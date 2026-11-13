/**
 * Homeowners Aligned — Address Match Test v2
 * ============================================
 * Tests address-to-HOA matching across all 6 DFW counties.
 * Handles all 4 CAD data formats.
 * Targets known HOA subdivisions from Supabase for validation.
 *
 * Usage:
 *   node test-address-match.js
 *   node test-address-match.js --samples 10
 */

require("dotenv").config();
const fs = require("fs");
const shapefile = require("shapefile");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
let samplesPerCounty = 5;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--samples" && args[i + 1]) {
    samplesPerCounty = parseInt(args[i + 1], 10);
    i++;
  }
}

// ============================================================
// Supabase helpers
// ============================================================
async function supabaseQuery(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getHOAsByCity(city) {
  const clean = city.replace(/\s*\(.*?\)\s*/g, "").trim();
  return supabaseQuery(
    `hoas?select=id,legal_name,subdivision_name,city,zip&city=ilike.%25${encodeURIComponent(clean)}%25&limit=1000`
  );
}

async function getHOAsByZip(zip) {
  if (!zip) return [];
  const clean = zip.substring(0, 5);
  return supabaseQuery(
    `hoas?select=id,legal_name,subdivision_name,city,zip&zip=ilike.${encodeURIComponent(clean)}%25&limit=1000`
  );
}

// ============================================================
// Subdivision parsing — handles all 4 county formats
// ============================================================
function parseSubdivision(legalDesc, county) {
  if (!legalDesc) return null;
  const text = legalDesc.trim();

  if (county === "DALLAS_DCAD") {
    return text.toUpperCase();
  }

  if (county === "ELLIS") {
    const reversed = text.toUpperCase();
    const m = reversed.match(/^(?:LOT\s+\S+\s+)?(?:BLK\s+\S+\s+)?(.+?)(?:\s+\d+\.\d+\s+AC.*)?$/);
    if (m && m[1]) {
      const sub = m[1].trim();
      if (sub.startsWith("LOT") || sub.startsWith("BLK")) return null;
      return sub;
    }
    return null;
  }

  if (county === "TARRANT") {
    const m = text.match(/^(.*?)\s+(?:Block|Lot)\s/i);
    if (m && m[1].trim().length > 2) {
      return m[1].trim().toUpperCase();
    }
    const ci = text.indexOf(",");
    if (ci > 2) return text.substring(0, ci).trim().toUpperCase();
    return text.toUpperCase();
  }

  const upper = text.toUpperCase();
  const patterns = [
    /^(.*?)(?:,\s*(?:BLOCK|BLK|LOT|LT|UNIT)\b)/,
    /^(.*?)(?:\s+(?:BLOCK|BLK)\s+\w)/,
    /^(.*?)(?:\s+(?:LOT|LT)\s+\d)/,
  ];

  for (const pattern of patterns) {
    const match = upper.match(pattern);
    if (match && match[1].trim().length > 2) {
      return match[1].trim();
    }
  }

  const ci = upper.indexOf(",");
  if (ci > 2) return upper.substring(0, ci).trim();
  return upper;
}

// ============================================================
// Normalize and clean subdivision names for matching
// ============================================================
function normalize(name) {
  if (!name) return "";
  return name
    .toUpperCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\bADDITION\b/g, "ADD")
    .replace(/\bSECTION\b/g, "SEC")
    .replace(/\bPHASE\b/g, "PH")
    .replace(/\bESTATES\b/g, "ESTS")
    .replace(/\bHEIGHTS\b/g, "HTS")
    .replace(/[,.'"\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function baseName(normalized) {
  if (!normalized) return "";
  return normalized
    .replace(/\b(SEC|PH|TR|TRACT)\s+\w+\s*\w*/g, "")
    .replace(/\b\d+(ST|ND|RD|TH)?\b/g, "")
    .replace(/\b(I{1,3}|IV|V|VI{0,3})\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// Match subdivision to HOA
// ============================================================
function matchToHOA(cadSubdivision, hoas) {
  if (!cadSubdivision) return { match: null, confidence: "none", reason: "no subdivision parsed" };

  const cadNorm = normalize(cadSubdivision);
  const cadBase = baseName(cadNorm);

  for (const hoa of hoas) {
    const hoaNorm = normalize(hoa.subdivision_name || "");
    if (cadNorm && hoaNorm && cadNorm === hoaNorm) {
      return { match: hoa, confidence: "exact", reason: `"${cadNorm}" = "${hoaNorm}"` };
    }
  }

  for (const hoa of hoas) {
    const hoaBase = baseName(normalize(hoa.subdivision_name || ""));
    if (cadBase && hoaBase && cadBase.length > 3 && cadBase === hoaBase) {
      return { match: hoa, confidence: "base_name", reason: `base "${cadBase}" = "${hoaBase}"` };
    }
  }

  for (const hoa of hoas) {
    const hoaNorm = normalize(hoa.subdivision_name || "");
    const hoaBase = baseName(hoaNorm);
    if (cadBase && cadBase.length > 4) {
      if (hoaNorm.includes(cadBase)) {
        return { match: hoa, confidence: "partial", reason: `CAD base "${cadBase}" in HOA "${hoaNorm}"` };
      }
      if (hoaBase && hoaBase.length > 4 && cadNorm.includes(hoaBase)) {
        return { match: hoa, confidence: "partial", reason: `HOA base "${hoaBase}" in CAD "${cadNorm}"` };
      }
    }
  }

  for (const hoa of hoas) {
    const hoaLegalNorm = normalize(hoa.legal_name || "");
    if (cadBase && cadBase.length > 4 && hoaLegalNorm.includes(cadBase)) {
      return { match: hoa, confidence: "legal_name", reason: `CAD base "${cadBase}" in legal name` };
    }
  }

  return { match: null, confidence: "none", reason: `no match for "${cadNorm}" (base: "${cadBase}")` };
}

// ============================================================
// Sample from TxGIO shapefile
// ============================================================
async function sampleFromShapefile(shpPath, countyName, count, hoaSubdivisions) {
  const samples = [];
  let scanned = 0;

  try {
    const src = await shapefile.open(shpPath);
    let r;
    while (!(r = await src.read()).done && samples.length < count) {
      scanned++;
      const p = r.value.properties;
      if (!p.LEGAL_DESC) continue;

      const subdivision = parseSubdivision(p.LEGAL_DESC, countyName);
      if (!subdivision || subdivision.length < 3) continue;

      const addr = p.SITUS_ADDR || `${p.SITUS_NUM || ""} ${p.SITUS_ST_1 || ""} ${p.SITUS_ST_2 || ""}`.trim();
      const city = p.SITUS_CITY || null;

      if (!addr || addr === "0" || addr.trim().length < 3) continue;

      const normSub = normalize(subdivision);
      const baseSub = baseName(normSub);
      const isKnownHOA = hoaSubdivisions.some(
        (h) => normalize(h).includes(baseSub) || baseSub.includes(baseName(normalize(h)))
      );

      if (isKnownHOA || (scanned > 20000 && samples.length < count)) {
        if (!samples.some((s) => s.parsed_subdivision === subdivision)) {
          samples.push({
            address: addr,
            city: city || "UNKNOWN",
            zip: p.SITUS_ZIP,
            county: countyName,
            legal_desc: p.LEGAL_DESC,
            parsed_subdivision: subdivision,
            source: "txgio",
            is_known_hoa: isKnownHOA,
          });
        }
      }

      if (scanned > 100000) break;
    }
  } catch (e) {
    console.log(`  ERROR reading ${countyName}: ${e.message}`);
  }

  return samples;
}

// ============================================================
// Sample from DCAD flat file
// ============================================================
function sampleFromDCAD(csvPath, count, hoaSubdivisions) {
  const samples = [];
  const lines = fs.readFileSync(csvPath, "utf-8").split("\n");
  const seen = new Set();

  for (let i = 1; i < lines.length && samples.length < count; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 26) continue;

    const divisionCd = cols[2];
    const streetNum = cols[15];
    const streetName = cols[17];
    const city = (cols[20] || "").replace(/\s*\(.*?\)/g, "").trim();
    const zip = (cols[21] || "").substring(0, 5);
    const legal1 = cols[24];

    if (divisionCd !== "RES" || !streetNum || streetNum === "0" || !city || !legal1 || legal1.length < 3) continue;

    const subdivision = parseSubdivision(legal1, "DALLAS_DCAD");
    if (!subdivision || seen.has(subdivision)) continue;

    const normSub = normalize(subdivision);
    const baseSub = baseName(normSub);
    const isKnownHOA = hoaSubdivisions.some(
      (h) => normalize(h).includes(baseSub) || baseSub.includes(baseName(normalize(h)))
    );

    if (isKnownHOA) {
      seen.add(subdivision);
      samples.push({
        address: `${streetNum} ${streetName}`.trim(),
        city: city,
        zip: zip,
        county: "DALLAS_DCAD",
        legal_desc: legal1,
        parsed_subdivision: subdivision,
        source: "dcad",
        is_known_hoa: true,
      });
    }
  }

  return samples;
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log("=".repeat(60));
  console.log("  ADDRESS-TO-HOA MATCH TEST v2");
  console.log("=".repeat(60));
  console.log(`  Samples per county: ${samplesPerCounty}`);
  console.log();

  console.log("Loading HOA subdivision names from Supabase...");
  let allHOAs = [];
  let offset = 0;
  while (true) {
    const batch = await supabaseQuery(
      `hoas?select=id,legal_name,subdivision_name,city,zip&limit=1000&offset=${offset}`
    );
    allHOAs = allHOAs.concat(batch);
    if (batch.length < 1000) break;
    offset += 1000;
  }
  const hoaSubdivisions = allHOAs
    .map((h) => h.subdivision_name)
    .filter(Boolean);
  console.log(`  Loaded ${allHOAs.length} HOAs, ${hoaSubdivisions.length} with subdivision names\n`);

  const allSamples = [];

  const txgioCounties = [
    { name: "COLLIN", path: "output/cad/stratmap25-landparcels_48085_lp/shp/stratmap25-landparcels_48085_collin_202503.shp" },
    { name: "TARRANT", path: "output/cad/stratmap25-landparcels_48439_lp/shp/stratmap25-landparcels_48439_tarrant_202507.shp" },
    { name: "ELLIS", path: "output/cad/stratmap25-landparcels_48139_lp/shp/stratmap25-landparcels_48139_ellis_202507.shp" },
    { name: "ROCKWALL", path: "output/cad/stratmap25-landparcels_48397_lp/shp/stratmap25-landparcels_48397_rockwall_202507.shp" },
    { name: "KAUFMAN", path: "output/cad/stratmap25-landparcels_48257_lp/shp/stratmap25-landparcels_48257_kaufman_202503.shp" },
  ];

  for (const county of txgioCounties) {
    console.log(`Sampling ${county.name}...`);
    const samples = await sampleFromShapefile(county.path, county.name, samplesPerCounty, hoaSubdivisions);
    console.log(`  Got ${samples.length} samples (${samples.filter((s) => s.is_known_hoa).length} known HOA)`);
    allSamples.push(...samples);
  }

  const dcadPath = "output/cad/dallas_dcad/ACCOUNT_INFO.csv";
  if (fs.existsSync(dcadPath)) {
    console.log("Sampling Dallas (DCAD)...");
    const samples = sampleFromDCAD(dcadPath, samplesPerCounty, hoaSubdivisions);
    console.log(`  Got ${samples.length} samples (${samples.filter((s) => s.is_known_hoa).length} known HOA)`);
    allSamples.push(...samples);
  }

  console.log(`\nTotal samples: ${allSamples.length}`);
  console.log("\n" + "=".repeat(60));
  console.log("  MATCHING RESULTS");
  console.log("=".repeat(60) + "\n");

  let exact = 0, base = 0, partial = 0, legal = 0, none = 0;
  const results = [];

  for (const sample of allSamples) {
    let cityHOAs = [];
    if (sample.city && sample.city !== "UNKNOWN") {
      cityHOAs = await getHOAsByCity(sample.city);
    }

    let result = matchToHOA(sample.parsed_subdivision, cityHOAs);

    if (result.confidence === "none" && sample.zip) {
      const zipHOAs = await getHOAsByZip(sample.zip);
      if (zipHOAs.length > 0) {
        const zipResult = matchToHOA(sample.parsed_subdivision, zipHOAs);
        if (zipResult.confidence !== "none") {
          result = zipResult;
          result.reason += " (zip fallback)";
        }
      }
    }

    if (result.confidence === "none") {
      const fullResult = matchToHOA(sample.parsed_subdivision, allHOAs);
      if (fullResult.confidence === "exact" || fullResult.confidence === "base_name") {
        result = fullResult;
        result.reason += " (full scan)";
      }
    }

    const icon =
      result.confidence === "exact" ? "✅" :
      result.confidence === "base_name" ? "🟡" :
      result.confidence === "partial" ? "🟠" :
      result.confidence === "legal_name" ? "🔵" : "❌";

    console.log(`${icon} [${sample.county}] ${sample.address}, ${sample.city}`);
    console.log(`   CAD legal: "${sample.legal_desc}"`);
    console.log(`   Parsed:    "${sample.parsed_subdivision}"`);
    if (result.match) {
      console.log(`   HOA:       ${result.match.legal_name}`);
      console.log(`   Confidence: ${result.confidence} — ${result.reason}`);
    } else {
      console.log(`   Result:    ${result.reason}`);
    }
    console.log();

    if (result.confidence === "exact") exact++;
    else if (result.confidence === "base_name") base++;
    else if (result.confidence === "partial") partial++;
    else if (result.confidence === "legal_name") legal++;
    else none++;

    results.push({
      county: sample.county,
      address: sample.address,
      city: sample.city,
      legal_desc: sample.legal_desc,
      parsed_subdivision: sample.parsed_subdivision,
      matched_hoa: result.match?.legal_name || null,
      confidence: result.confidence,
      reason: result.reason,
    });
  }

  const total = allSamples.length;
  const matched = exact + base + partial + legal;

  console.log("=".repeat(60));
  console.log("  SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Total tested:      ${total}`);
  console.log(`  ✅ Exact match:    ${exact} (${(exact / total * 100).toFixed(1)}%)`);
  console.log(`  🟡 Base name:      ${base} (${(base / total * 100).toFixed(1)}%)`);
  console.log(`  🟠 Partial:        ${partial} (${(partial / total * 100).toFixed(1)}%)`);
  console.log(`  🔵 Legal name:     ${legal} (${(legal / total * 100).toFixed(1)}%)`);
  console.log(`  ❌ No match:       ${none} (${(none / total * 100).toFixed(1)}%)`);
  console.log(`  ─────────────────`);
  console.log(`  Total matched:     ${matched} (${(matched / total * 100).toFixed(1)}%)`);
  console.log("=".repeat(60));

  fs.writeFileSync("output/cad/test_match_results_v2.json", JSON.stringify(results, null, 2));
  console.log("\nFull results saved to output/cad/test_match_results_v2.json");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});