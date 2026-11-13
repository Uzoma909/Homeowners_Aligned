/**
 * Homeowners Aligned — Phase E: Address-to-HOA Import Pipeline
 * =============================================================
 * 
 * Step 1: Extract unique subdivisions from CAD data
 * Step 2: Match subdivisions to HOAs (geographic filter required)
 * Step 3: Seed subdivision_mappings table
 * Step 4: Import matched properties into property_addresses
 * Step 5: Build hoa_zip_codes from matched data
 *
 * Usage:
 *   node phase-e-import.js --county dallas
 *   node phase-e-import.js --county collin
 *   node phase-e-import.js --county all
 *   node phase-e-import.js --county dallas --step 1   (subdivisions only)
 *   node phase-e-import.js --county dallas --step 2   (match only)
 *   node phase-e-import.js --county dallas --step 3   (seed only)
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const shapefile = require("shapefile");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
let targetCounty = "dallas";
let targetStep = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--county" && args[i + 1]) { targetCounty = args[i + 1].toLowerCase(); i++; }
  if (args[i] === "--step" && args[i + 1]) { targetStep = parseInt(args[i + 1], 10); i++; }
}

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// Supabase helpers
// ============================================================
async function supabaseQuery(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase GET ${res.status}: ${await res.text()}`);
  return res.json();
}

async function supabasePost(table, rows) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase POST ${table}: ${res.status} — ${err.substring(0, 300)}`);
  }
  return res;
}

async function loadAllHOAs() {
  let all = [];
  let offset = 0;
  while (true) {
    const batch = await supabaseQuery(
      `hoas?select=id,legal_name,subdivision_name,city,zip&limit=1000&offset=${offset}`
    );
    all = all.concat(batch);
    if (batch.length < 1000) break;
    offset += 1000;
  }
  return all;
}

// ============================================================
// Normalization
// ============================================================
function normalize(name) {
  if (!name) return "";
  return name
    .toUpperCase()
    .replace(/@/g, "AT")
    .replace(/\(.*?\)/g, "")
    .replace(/\bADDITION\b/g, "ADD")
    .replace(/\bSECTION\b/g, "SEC")
    .replace(/\bPHASE\b/g, "PH")
    .replace(/\bESTATES\b/g, "ESTS")
    .replace(/\bHEIGHTS\b/g, "HTS")
    .replace(/\bCONDOMINIUM[S]?\b/g, "CONDO")
    .replace(/\bTOWNHOME[S]?\b/g, "TH")
    .replace(/\bRESIDENCES\b/g, "RES")
    .replace(/[,.'"\-#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function baseName(normalized) {
  if (!normalized) return "";
  return normalized
    .replace(/\b(SEC|PH|TR|TRACT|NO)\s+\w+\s*\w*/g, "")
    .replace(/\b\d+(ST|ND|RD|TH|[A-Z])?\b/g, "")
    .replace(/\b(I{1,3}|IV|V|VI{0,3}|VII|VIII|IX|X)\b/g, "")
    .replace(/\bTHE\b/g, "")
    .replace(/\bADD\b$/g, "")
    .replace(/\bESTS\b$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// Subdivision parsing per county format
// ============================================================
function parseSubdivision(legalDesc, county) {
  if (!legalDesc) return null;
  const text = legalDesc.trim();

  if (county === "DALLAS_DCAD") {
    return text.toUpperCase();
  }

  if (county === "ELLIS") {
    const upper = text.toUpperCase();
    const m = upper.match(/^(?:LOT\s+\S+\s+)?(?:BLK\s+\S+\s+)?(.+?)(?:\s+\d+\.?\d*\s+AC.*)?$/);
    if (m && m[1]) {
      const sub = m[1].trim();
      if (sub.startsWith("LOT") || sub.startsWith("BLK")) return null;
      return sub;
    }
    return null;
  }

  if (county === "TARRANT") {
    const m = text.match(/^(.*?)\s+(?:Block|Lot)\s/i);
    if (m && m[1].trim().length > 2) return m[1].trim().toUpperCase();
    const ci = text.indexOf(",");
    if (ci > 2) return text.substring(0, ci).trim().toUpperCase();
    return text.toUpperCase();
  }

  // Standard: Collin, Kaufman, Rockwall
  const upper = text.toUpperCase();
  const patterns = [
    /^(.*?)(?:,\s*(?:BLOCK|BLK|LOT|LT|UNIT)\b)/,
    /^(.*?)(?:\s+(?:BLOCK|BLK)\s+\w)/,
    /^(.*?)(?:\s+(?:LOT|LT)\s+\d)/,
  ];
  for (const pattern of patterns) {
    const match = upper.match(pattern);
    if (match && match[1].trim().length > 2) return match[1].trim();
  }
  const ci = upper.indexOf(",");
  if (ci > 2) return upper.substring(0, ci).trim();
  return upper;
}

// ============================================================
// County configs
// ============================================================
const COUNTY_CONFIGS = {
  dallas: {
    type: "dcad",
    csvPath: "output/cad/dallas_dcad/ACCOUNT_INFO.csv",
    county: "Dallas",
  },
  collin: {
    type: "txgio",
    shpPath: "output/cad/stratmap25-landparcels_48085_lp/shp/stratmap25-landparcels_48085_collin_202503.shp",
    county: "Collin",
    parseCounty: "COLLIN",
  },
  tarrant: {
    type: "txgio",
    shpPath: "output/cad/stratmap25-landparcels_48439_lp/shp/stratmap25-landparcels_48439_tarrant_202507.shp",
    county: "Tarrant",
    parseCounty: "TARRANT",
  },
  ellis: {
    type: "txgio",
    shpPath: "output/cad/stratmap25-landparcels_48139_lp/shp/stratmap25-landparcels_48139_ellis_202507.shp",
    county: "Ellis",
    parseCounty: "ELLIS",
  },
  rockwall: {
    type: "txgio",
    shpPath: "output/cad/stratmap25-landparcels_48397_lp/shp/stratmap25-landparcels_48397_rockwall_202507.shp",
    county: "Rockwall",
    parseCounty: "ROCKWALL",
  },
  kaufman: {
    type: "txgio",
    shpPath: "output/cad/stratmap25-landparcels_48257_lp/shp/stratmap25-landparcels_48257_kaufman_202503.shp",
    county: "Kaufman",
    parseCounty: "KAUFMAN",
  },
};

// ============================================================
// Step 1: Extract unique subdivisions from CAD data
// ============================================================
async function extractSubdivisions(config) {
  const subdivisions = new Map(); // key: "SUBDIVISION|CITY|ZIP" -> { count, properties[] }

  if (config.type === "dcad") {
    log("Reading DCAD flat file...");
    const lines = fs.readFileSync(config.csvPath, "utf-8").split("\n");
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 26) continue;
      
      const divisionCd = cols[2];
      if (divisionCd !== "RES") continue;
      
      const streetNum = cols[15];
      const streetName = cols[17];
      const city = (cols[20] || "").replace(/\s*\(.*?\)\s*/g, "").trim();
      const zip = (cols[21] || "").substring(0, 5);
      const legal1 = cols[24];
      
      if (!legal1 || legal1.length < 3 || !city) continue;
      
      const subdivision = parseSubdivision(legal1, "DALLAS_DCAD");
      if (!subdivision || subdivision.length < 3) continue;
      
      // Skip rural tracts (no LOT/BLK in legal2, has ACRES in legal1)
      if (legal1.toUpperCase().includes("ACRES") || legal1.toUpperCase().includes("TRACT")) continue;
      
      const key = `${subdivision}|${city}|${zip}`;
      if (!subdivisions.has(key)) {
        subdivisions.set(key, { subdivision, city, zip, county: config.county, count: 0, sample_addresses: [] });
      }
      const entry = subdivisions.get(key);
      entry.count++;
      
      if (entry.sample_addresses.length < 3 && streetNum && streetNum !== "0") {
        entry.sample_addresses.push(`${streetNum} ${streetName}`.trim());
      }
      
      if (i % 100000 === 0) process.stdout.write(`  ${(i/1000).toFixed(0)}k records...\r`);
    }
    
  } else if (config.type === "txgio") {
    log(`Reading TxGIO shapefile for ${config.county}...`);
    const src = await shapefile.open(config.shpPath);
    let r;
    let count = 0;
    
    while (!(r = await src.read()).done) {
      count++;
      const p = r.value.properties;
      if (!p.LEGAL_DESC) continue;
      
      const city = p.SITUS_CITY || null;
      const zip = p.SITUS_ZIP || null;
      
      const subdivision = parseSubdivision(p.LEGAL_DESC, config.parseCounty);
      if (!subdivision || subdivision.length < 3) continue;
      
      // Skip rural (TRACT, ACRES patterns without LOT/BLK)
      const upper = p.LEGAL_DESC.toUpperCase();
      if ((upper.includes("TRACT") || upper.includes("ACRES")) && 
          !upper.includes("LOT") && !upper.includes("BLOCK") && !upper.includes("BLK")) continue;
      
      const addr = p.SITUS_ADDR || `${p.SITUS_NUM || ""} ${p.SITUS_ST_1 || ""} ${p.SITUS_ST_2 || ""}`.trim();
      
      const key = `${subdivision}|${city || ""}|${zip || ""}`;
      if (!subdivisions.has(key)) {
        subdivisions.set(key, { subdivision, city: city || "", zip: zip || "", county: config.county, count: 0, sample_addresses: [] });
      }
      const entry = subdivisions.get(key);
      entry.count++;
      
      if (entry.sample_addresses.length < 3 && addr && addr.length > 3) {
        entry.sample_addresses.push(addr);
      }
      
      if (count % 100000 === 0) process.stdout.write(`  ${(count/1000).toFixed(0)}k records...\r`);
    }
  }

  log(`  Extracted ${subdivisions.size} unique subdivision+city+zip combos`);
  return subdivisions;
}

// ============================================================
// Step 2: Match subdivisions to HOAs
// ============================================================
function matchSubdivisionToHOAs(subdivision, city, zip, allHOAs) {
  const cadNorm = normalize(subdivision);
  const cadBase = baseName(cadNorm);
  
  if (!cadNorm || cadNorm.length < 3) return { matches: [], confidence: "unmatched" };
  
  // Build candidate pool: HOAs in same city OR same zip
  const candidates = allHOAs.filter(hoa => {
    if (!hoa.subdivision_name && !hoa.legal_name) return false;
    
    const hoaCity = (hoa.city || "").toUpperCase().replace(/\s*\(.*?\)/g, "").trim();
    const hoaZip = (hoa.zip || "").substring(0, 5);
    const searchCity = (city || "").toUpperCase().replace(/\s*\(.*?\)/g, "").trim();
    const searchZip = (zip || "").substring(0, 5);
    
    // Must have geographic overlap
    if (searchCity && hoaCity && searchCity === hoaCity) return true;
    if (searchZip && hoaZip && searchZip === hoaZip) return true;
    
    return false;
  });
  
  if (candidates.length === 0) return { matches: [], confidence: "unmatched" };
  
  // Layer 1: Exact normalized match
  for (const hoa of candidates) {
    const hoaNorm = normalize(hoa.subdivision_name || "");
    if (cadNorm && hoaNorm && cadNorm === hoaNorm) {
      return { matches: [hoa], confidence: "exact" };
    }
  }
  
  // Layer 2: Base name match
  const baseMatches = [];
  for (const hoa of candidates) {
    const hoaBase = baseName(normalize(hoa.subdivision_name || ""));
    if (cadBase && hoaBase && cadBase.length > 3 && cadBase === hoaBase) {
      baseMatches.push(hoa);
    }
  }
  if (baseMatches.length > 0) {
    return { matches: baseMatches, confidence: "base_name" };
  }
  
  // Layer 3: Contains match (only if base name is long enough to avoid false positives)
  if (cadBase.length > 6) {
    const partialMatches = [];
    for (const hoa of candidates) {
      const hoaNorm = normalize(hoa.subdivision_name || "");
      const hoaBase = baseName(hoaNorm);
      
      if (hoaNorm.includes(cadBase) || (hoaBase && hoaBase.length > 6 && cadNorm.includes(hoaBase))) {
        partialMatches.push(hoa);
      }
    }
    if (partialMatches.length > 0 && partialMatches.length <= 3) {
      return { matches: partialMatches, confidence: "partial" };
    }
  }
  
  return { matches: [], confidence: "unmatched" };
}

// ============================================================
// Step 3: Seed to Supabase
// ============================================================
async function seedSubdivisionMappings(mappings) {
  log(`Seeding ${mappings.length} subdivision mappings...`);
  const batchSize = 50;
  let seeded = 0;
  
  for (let i = 0; i < mappings.length; i += batchSize) {
    const batch = mappings.slice(i, i + batchSize).map(m => ({
      cad_subdivision: m.cad_subdivision,
      normalized_name: m.normalized_name,
      base_name: m.base_name,
      city: m.city || null,
      zip: m.zip || null,
      county: m.county,
      hoa_id: m.hoa_id || null,
      match_confidence: m.confidence,
      property_count: m.property_count,
      source: "cad",
    }));
    
    try {
      await supabasePost("subdivision_mappings", batch);
      seeded += batch.length;
      if (seeded % 200 === 0) log(`  ${seeded} mappings seeded`);
    } catch (err) {
      log(`  BATCH ERROR at ${i}: ${err.message}`);
    }
    
    await sleep(200);
  }
  
  log(`  Total seeded: ${seeded}`);
  return seeded;
}

async function seedHOAZipCodes(zipEntries) {
  log(`Seeding ${zipEntries.length} HOA zip codes...`);
  const batchSize = 100;
  let seeded = 0;
  
  for (let i = 0; i < zipEntries.length; i += batchSize) {
    const batch = zipEntries.slice(i, i + batchSize);
    try {
      await supabasePost("hoa_zip_codes", batch);
      seeded += batch.length;
    } catch (err) {
      // Duplicates are expected, ignore
    }
    await sleep(100);
  }
  
  log(`  Total seeded: ${seeded}`);
}

// ============================================================
// Main pipeline
// ============================================================
async function runPipeline(countyKey) {
  const config = COUNTY_CONFIGS[countyKey];
  if (!config) {
    console.error(`Unknown county: ${countyKey}`);
    console.error(`Available: ${Object.keys(COUNTY_CONFIGS).join(", ")}`);
    process.exit(1);
  }
  
  log(`\n${"=".repeat(60)}`);
  log(`  PHASE E: ${config.county.toUpperCase()} COUNTY`);
  log(`${"=".repeat(60)}`);
  
  // Step 1: Extract subdivisions
  if (!targetStep || targetStep === 1) {
    log("\nSTEP 1: Extracting unique subdivisions from CAD data...");
    const subdivisions = await extractSubdivisions(config);
    
    const outputPath = `output/cad/${countyKey}_subdivisions.json`;
    const subArray = [...subdivisions.values()];
    fs.writeFileSync(outputPath, JSON.stringify(subArray, null, 2));
    log(`  Saved ${subArray.length} subdivisions to ${outputPath}`);
    
    // Show stats
    const withCity = subArray.filter(s => s.city).length;
    const withZip = subArray.filter(s => s.zip).length;
    const totalProps = subArray.reduce((sum, s) => sum + s.count, 0);
    log(`  Properties covered: ${totalProps.toLocaleString()}`);
    log(`  With city: ${withCity} (${(withCity / subArray.length * 100).toFixed(1)}%)`);
    log(`  With zip: ${withZip} (${(withZip / subArray.length * 100).toFixed(1)}%)`);
  }
  
  // Step 2: Match to HOAs
  if (!targetStep || targetStep === 2) {
    log("\nSTEP 2: Matching subdivisions to HOAs...");
    
    const subPath = `output/cad/${countyKey}_subdivisions.json`;
    if (!fs.existsSync(subPath)) {
      log("  ERROR: Run step 1 first");
      return;
    }
    
    const subdivisions = JSON.parse(fs.readFileSync(subPath, "utf-8"));
    const allHOAs = await loadAllHOAs();
    log(`  Loaded ${allHOAs.length} HOAs from Supabase`);
    
    let exact = 0, base = 0, partial = 0, unmatched = 0;
    const mappings = [];
    const zipEntries = new Map(); // hoa_id|zip -> entry
    
    for (const sub of subdivisions) {
      const result = matchSubdivisionToHOAs(sub.subdivision, sub.city, sub.zip, allHOAs);
      
      const mapping = {
        cad_subdivision: sub.subdivision,
        normalized_name: normalize(sub.subdivision),
        base_name: baseName(normalize(sub.subdivision)),
        city: sub.city,
        zip: sub.zip,
        county: sub.county,
        hoa_id: result.matches.length === 1 ? result.matches[0].id : null,
        confidence: result.confidence,
        property_count: sub.count,
        matched_hoas: result.matches.map(h => ({ id: h.id, name: h.legal_name })),
        sample_addresses: sub.sample_addresses,
      };
      
      mappings.push(mapping);
      
      // Build zip entries for matched HOAs
      if (result.matches.length > 0 && sub.zip) {
        for (const hoa of result.matches) {
          const key = `${hoa.id}|${sub.zip.substring(0, 5)}`;
          if (!zipEntries.has(key)) {
            zipEntries.set(key, { hoa_id: hoa.id, zip: sub.zip.substring(0, 5), source: "cad" });
          }
        }
      }
      
      if (result.confidence === "exact") exact++;
      else if (result.confidence === "base_name") base++;
      else if (result.confidence === "partial") partial++;
      else unmatched++;
    }
    
    // Save matches
    const matchPath = `output/cad/${countyKey}_matched.json`;
    fs.writeFileSync(matchPath, JSON.stringify(mappings, null, 2));
    
    // Save zip entries
    const zipPath = `output/cad/${countyKey}_zip_codes.json`;
    fs.writeFileSync(zipPath, JSON.stringify([...zipEntries.values()], null, 2));
    
    const matched = exact + base + partial;
    const matchedProps = mappings.filter(m => m.confidence !== "unmatched").reduce((s, m) => s + m.property_count, 0);
    const totalProps = mappings.reduce((s, m) => s + m.property_count, 0);
    
    log(`\n  ${"─".repeat(40)}`);
    log(`  Subdivisions:  ${subdivisions.length}`);
    log(`  ✅ Exact:      ${exact}`);
    log(`  🟡 Base name:  ${base}`);
    log(`  🟠 Partial:    ${partial}`);
    log(`  ❌ Unmatched:  ${unmatched}`);
    log(`  ─────────────`);
    log(`  Matched:       ${matched} (${(matched / subdivisions.length * 100).toFixed(1)}%)`);
    log(`  Properties covered: ${matchedProps.toLocaleString()} of ${totalProps.toLocaleString()} (${(matchedProps / totalProps * 100).toFixed(1)}%)`);
    log(`  HOA zip codes: ${zipEntries.size}`);
    log(`  ${"─".repeat(40)}`);
    
    // Show sample matches
    log("\n  Sample matches:");
    mappings.filter(m => m.confidence === "exact").slice(0, 5).forEach(m => {
      log(`    ✅ "${m.cad_subdivision}" → ${m.matched_hoas[0]?.name} [${m.city}]`);
    });
    mappings.filter(m => m.confidence === "base_name").slice(0, 3).forEach(m => {
      log(`    🟡 "${m.cad_subdivision}" → ${m.matched_hoas[0]?.name} [${m.city}]`);
    });
    
    // Show multi-match conflicts
    const multiMatch = mappings.filter(m => m.matched_hoas.length > 1);
    if (multiMatch.length > 0) {
      log(`\n  ⚠ Multi-match conflicts (${multiMatch.length}):`);
      multiMatch.slice(0, 5).forEach(m => {
        log(`    "${m.cad_subdivision}" → ${m.matched_hoas.map(h => h.name).join(" | ")}`);
      });
    }
  }
  
  // Step 3: Seed to Supabase
  if (!targetStep || targetStep === 3) {
    log("\nSTEP 3: Seeding to Supabase...");
    
    const matchPath = `output/cad/${countyKey}_matched.json`;
    const zipPath = `output/cad/${countyKey}_zip_codes.json`;
    
    if (!fs.existsSync(matchPath)) {
      log("  ERROR: Run step 2 first");
      return;
    }
    
    const mappings = JSON.parse(fs.readFileSync(matchPath, "utf-8"));
    await seedSubdivisionMappings(mappings);
    
    if (fs.existsSync(zipPath)) {
      const zipEntries = JSON.parse(fs.readFileSync(zipPath, "utf-8"));
      await seedHOAZipCodes(zipEntries);
    }
    
    log("  Seeding complete");
  }
}

// ============================================================
// Entry point
// ============================================================
async function main() {
  if (targetCounty === "all") {
    for (const key of Object.keys(COUNTY_CONFIGS)) {
      await runPipeline(key);
    }
  } else {
    await runPipeline(targetCounty);
  }
  
  log("\n" + "█".repeat(60));
  log("  PHASE E COMPLETE");
  log("█".repeat(60));
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});