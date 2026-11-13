/**
 * Homeowners Aligned — Phase C: Comptroller API Enrichment
 * =========================================================
 * Searches Texas Comptroller Franchise Tax API for each HOA,
 * retrieves officer/board member info, entity status, registered
 * agent, and SOS details. Merges with Phase B enriched data.
 *
 * Usage:
 *   node phase-c-comptroller.js --input output/metros/dfw/hoas_enriched_dallas.json --limit 5
 *   node phase-c-comptroller.js --input output/metros/dfw/hoas_enriched_dallas.json
 *
 * Required env var:
 *   COMPTROLLER_API_KEY=your-key-here
 *
 * No Claude API needed — this phase is FREE.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

// ============================================================
// Configuration
// ============================================================
const API_BASE = "https://api.comptroller.texas.gov/public-data/v1/public";
const RATE_LIMIT_MS = 500; // 0.5 seconds between API calls
const MAX_RETRIES = 3;

// Parse CLI args
const args = process.argv.slice(2);
let inputFile = null;
let limit = Infinity;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    inputFile = args[i + 1];
    i++;
  }
  if (args[i] === "--limit" && args[i + 1]) {
    limit = parseInt(args[i + 1], 10);
    i++;
  }
}

if (!inputFile) {
  console.error("Usage: node phase-c-comptroller.js --input <path-to-enriched-json> [--limit N]");
  console.error("Example: node phase-c-comptroller.js --input output/metros/dfw/hoas_enriched_dallas.json --limit 5");
  process.exit(1);
}

const API_KEY = process.env.COMPTROLLER_API_KEY;
if (!API_KEY) {
  console.error("ERROR: COMPTROLLER_API_KEY environment variable not set.");
  console.error("Add it to your .env file: COMPTROLLER_API_KEY=your-key-here");
  process.exit(1);
}

// ============================================================
// Helpers
// ============================================================
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clean HOA name for search — remove common suffixes that may not match
function cleanNameForSearch(name) {
  let cleaned = name
    .replace(/,?\s*(Inc\.?|LLC|L\.L\.C\.|Ltd\.?|Corp\.?|Corporation|Company|Co\.)$/i, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\s+(a\/k\/a|d\/b\/a|f\/k\/a|aka|dba)[\s].*/i, "")
    .replace(/[\/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50).trim();
  }
  return cleaned;
}

// ============================================================
// Comptroller API Calls
// ============================================================
async function searchByName(name) {
  const encodedName = encodeURIComponent(name);
  const url = `${API_BASE}/franchise-tax-list?name=${encodedName}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "x-api-key": API_KEY },
      });

      if (response.status === 429) {
        log(`  Rate limited. Waiting 10s before retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(10000);
        continue;
      }

      if (response.status === 413) {
        // Response too large — name too generic
        return { success: true, data: [], count: 0, tooMany: true };
      }

      if (!response.ok) {
        throw new Error(`API ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        count: data.count || 0,
      };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        return { success: false, error: err.message, data: [] };
      }
      log(`  Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

async function getDetails(taxpayerId) {
  const url = `${API_BASE}/franchise-tax/${taxpayerId}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "x-api-key": API_KEY },
      });

      if (response.status === 429) {
        log(`  Rate limited. Waiting 10s before retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(10000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`API ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        return { success: false, error: err.message, data: null };
      }
      log(`  Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

// ============================================================
// Match Logic — find best match from search results
// ============================================================
function findBestMatch(searchResults, hoaName) {
  if (!searchResults || searchResults.length === 0) return null;

  const normalize = (s) =>
    s
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const target = normalize(hoaName);

  // Exact match first
  for (const result of searchResults) {
    if (normalize(result.name) === target) return result;
  }

  // Contains match — HOA name is contained in result or vice versa
  for (const result of searchResults) {
    const resultName = normalize(result.name);
    if (resultName.includes(target) || target.includes(resultName)) return result;
  }

  // Word overlap score
  const targetWords = new Set(target.split(" ").filter((w) => w.length > 2));
  let bestScore = 0;
  let bestResult = null;

  for (const result of searchResults) {
    const resultWords = normalize(result.name).split(" ").filter((w) => w.length > 2);
    const overlap = resultWords.filter((w) => targetWords.has(w)).length;
    const score = overlap / Math.max(targetWords.size, resultWords.length);
    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      bestResult = result;
    }
  }

  return bestResult;
}

// ============================================================
// Extract structured data from Comptroller response
// ============================================================
function extractComptrollerData(details) {
  const officers = (details.officerInfo || []).map((o) => ({
    name: titleCase(o.AGNT_NM),
    title: titleCase(o.AGNT_TITL_TX),
    active_year: o.AGNT_ACTV_YR,
    address: formatAddress(o.AD_STR_POB_TX, o.CITY_NM, o.ST_CD, o.AD_ZP),
    source: o.SOURCE,
  }));

  return {
    taxpayer_id: details.taxpayerId,
    fei_number: details.feiNumber,
    comptroller_name: details.name,
    dba_name: details.dbaName,
    entity_status: details.rightToTransactTX,
    sos_status: details.sosRegistrationStatus,
    sos_file_number: details.sosFileNumber,
    sos_effective_date: details.effectiveSosRegistrationDate,
    state_of_formation: details.stateOfFormation?.trim(),
    registered_agent: {
      name: titleCase(details.registeredAgentName),
      address: formatAddress(
        details.registeredOfficeAddressStreet,
        details.registeredOfficeAddressCity,
        details.registeredOfficeAddressState,
        details.registeredOfficeAddressZip
      ),
    },
    mailing_address: formatAddress(
      details.mailingAddressStreet,
      details.mailingAddressCity,
      details.mailingAddressState,
      details.mailingAddressZip
    ),
    officers: officers,
    report_year: details.reportYear,
    last_updated: details.lastUpdated,
  };
}

function titleCase(str) {
  if (!str) return null;
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Ii|Iii|Iv)\b/gi, (m) => m.toUpperCase());
}

function formatAddress(street, city, state, zip) {
  const parts = [street, city, state, zip].filter(Boolean);
  if (parts.length === 0) return null;
  return `${street || ""}, ${city || ""}, ${state || ""} ${zip || ""}`.replace(/,\s*,/g, ",").trim();
}

// ============================================================
// Main Pipeline
// ============================================================
async function main() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
  const totalToProcess = Math.min(records.length, limit);

  log(`Loaded ${records.length} records from ${inputFile}`);
  log(`Processing ${totalToProcess} records (limit: ${limit === Infinity ? "none" : limit})`);
  log("");

  // Output file
  const inputDir = path.dirname(inputFile);
  const inputBase = path.basename(inputFile, ".json").replace("hoas_enriched_", "");
  const outputFile = path.join(inputDir, `hoas_complete_${inputBase}.json`);

  // Track stats
  let searchHits = 0;
  let searchMisses = 0;
  let detailSuccesses = 0;
  let detailFailures = 0;
  let alreadyProcessed = 0;

  // Load existing progress if resuming
  let completeRecords = [];
  const processedNames = new Set();

  if (fs.existsSync(outputFile)) {
    completeRecords = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
    for (const r of completeRecords) {
      processedNames.add(r.legal_name);
    }
    log(`Resuming: ${completeRecords.length} already processed`);
  }

  for (let i = 0; i < totalToProcess; i++) {
    const record = records[i];
    const progress = `[${i + 1}/${totalToProcess}]`;

    // Skip if already processed (name-based dedup)
    if (processedNames.has(record.legal_name)) {
      alreadyProcessed++;
      continue;
    }

    log(`${progress} ${record.legal_name}`);

    // Step 1: Search by name
    const searchName = cleanNameForSearch(record.legal_name);
    log(`  Searching: "${searchName}"`);
    const searchResult = await searchByName(searchName);
    await sleep(RATE_LIMIT_MS);

    if (!searchResult.success) {
      log(`  SEARCH FAILED: ${searchResult.error}`);
      searchMisses++;
      // Still save the record without comptroller data
      completeRecords.push({
        ...record,
        comptroller: null,
        comptroller_error: searchResult.error,
        comptroller_processed_at: new Date().toISOString(),
      });
      processedNames.add(record.legal_name);
      fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
      continue;
    }

    if (searchResult.tooMany) {
      log(`  TOO MANY RESULTS: Name too generic, skipping`);
      searchMisses++;
      completeRecords.push({
        ...record,
        comptroller: null,
        comptroller_error: "too_many_results",
        comptroller_processed_at: new Date().toISOString(),
      });
      processedNames.add(record.legal_name);
      fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
      continue;
    }

    // Find best match
    const match = findBestMatch(searchResult.data, record.legal_name);

    if (!match) {
      log(`  NO MATCH found in ${searchResult.count} results`);
      searchMisses++;

      // Try searching with full legal name if cleaned version didn't work
      if (searchName !== record.legal_name) {
        const cleanedFull = cleanNameForSearch(record.legal_name);
        log(`  Retrying with cleaned full name: "${cleanedFull}"`);
        const retryResult = await searchByName(cleanedFull);
        await sleep(RATE_LIMIT_MS);

        const retryMatch = findBestMatch(retryResult.data, record.legal_name);
        if (retryMatch) {
          log(`  FOUND on retry: ${retryMatch.name} (ID: ${retryMatch.taxpayerId})`);
          searchHits++;
          searchMisses--; // Undo the miss count

          // Get details
          const detailResult = await getDetails(retryMatch.taxpayerId);
          await sleep(RATE_LIMIT_MS);

          if (detailResult.success) {
            const comptrollerData = extractComptrollerData(detailResult.data);
            const officerCount = comptrollerData.officers.length;
            log(`  ENRICHED: ${officerCount} officers | status=${comptrollerData.entity_status}`);
            detailSuccesses++;

            completeRecords.push({
              ...record,
              comptroller: comptrollerData,
              comptroller_processed_at: new Date().toISOString(),
            });
          } else {
            log(`  DETAIL FAILED: ${detailResult.error}`);
            detailFailures++;
            completeRecords.push({
              ...record,
              comptroller: null,
              comptroller_error: detailResult.error,
              comptroller_processed_at: new Date().toISOString(),
            });
          }

          processedNames.add(record.legal_name);
          fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
          continue;
        }
      }

      // Try Phase B extracted association name as final fallback
      const extractedName = record.extracted?.association_name;
      if (extractedName && extractedName !== record.legal_name && extractedName !== searchName) {
        const cleanExtracted = cleanNameForSearch(extractedName);
        log(`  Trying extracted name: "${cleanExtracted}"`);
        const extractedResult = await searchByName(cleanExtracted);
        await sleep(RATE_LIMIT_MS);

        const extractedMatch = findBestMatch(extractedResult.data, extractedName);
        if (extractedMatch) {
          log(`  FOUND on extracted name: ${extractedMatch.name} (ID: ${extractedMatch.taxpayerId})`);
          searchHits++;
          searchMisses--;

          const detailResult = await getDetails(extractedMatch.taxpayerId);
          await sleep(RATE_LIMIT_MS);

          if (detailResult.success) {
            const comptrollerData = extractComptrollerData(detailResult.data);
            log(`  ENRICHED: ${comptrollerData.officers.length} officers | status=${comptrollerData.entity_status}`);
            detailSuccesses++;
            completeRecords.push({
              ...record,
              comptroller: comptrollerData,
              comptroller_processed_at: new Date().toISOString(),
            });
          } else {
            completeRecords.push({
              ...record,
              comptroller: null,
              comptroller_error: detailResult.error,
              comptroller_processed_at: new Date().toISOString(),
            });
            detailFailures++;
          }

          processedNames.add(record.legal_name);
          fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
          continue;
        }
      }

      completeRecords.push({
        ...record,
        comptroller: null,
        comptroller_error: "no_match",
        comptroller_processed_at: new Date().toISOString(),
      });
      processedNames.add(record.legal_name);
      fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
      continue;
    }

    searchHits++;
    log(`  MATCHED: ${match.name} (ID: ${match.taxpayerId})`);

    // Step 2: Get officer details
    const detailResult = await getDetails(match.taxpayerId);
    await sleep(RATE_LIMIT_MS);

    if (!detailResult.success) {
      log(`  DETAIL FAILED: ${detailResult.error}`);
      detailFailures++;
      completeRecords.push({
        ...record,
        comptroller: { taxpayer_id: match.taxpayerId, name: match.name },
        comptroller_error: detailResult.error,
        comptroller_processed_at: new Date().toISOString(),
      });
      processedNames.add(record.legal_name);
      fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
      continue;
    }

    // Step 3: Extract and merge
    const comptrollerData = extractComptrollerData(detailResult.data);
    const officerCount = comptrollerData.officers.length;
    log(`  ENRICHED: ${officerCount} officers | status=${comptrollerData.entity_status}`);
    detailSuccesses++;

    completeRecords.push({
      ...record,
      comptroller: comptrollerData,
      comptroller_processed_at: new Date().toISOString(),
    });

    processedNames.add(record.legal_name);

    // Save progress after each record
    fs.writeFileSync(outputFile, JSON.stringify(completeRecords, null, 2));
  }

  // ===== Summary =====
  console.log("\n" + "=".repeat(60));
  console.log("  PHASE C COMPLETE — Comptroller API Enrichment");
  console.log("=".repeat(60));
  console.log(`  Records processed:       ${totalToProcess - alreadyProcessed}`);
  console.log(`  Already processed:       ${alreadyProcessed}`);
  console.log(`  Search hits:             ${searchHits}`);
  console.log(`  Search misses:           ${searchMisses}`);
  console.log(`  Detail lookups OK:       ${detailSuccesses}`);
  console.log(`  Detail lookups failed:   ${detailFailures}`);
  console.log(`  Match rate:              ${((searchHits / Math.max(searchHits + searchMisses, 1)) * 100).toFixed(1)}%`);
  console.log("");
  console.log(`  API cost:                $0.00 (FREE)`);
  console.log("");
  console.log(`  Output: ${outputFile}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});