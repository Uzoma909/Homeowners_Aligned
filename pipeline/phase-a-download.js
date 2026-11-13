/**
 * Homeowners Aligned — Phase A Scraper
 * =====================================
 * Downloads HOA management certificate data from the Texas Open Data Portal
 * (data.texas.gov), parses the CSV, validates records, and outputs structured
 * JSON files split by county.
 *
 * Data source: TREC HOA Management Certificates
 * Dataset ID: 8auc-hzdi
 * URL: https://data.texas.gov/views/8auc-hzdi/rows.csv?accessType=DOWNLOAD
 *
 * Usage:
 *   node phase-a-download.js                    # Downloads all, saves by county
 *   node phase-a-download.js --county Dallas    # Filter to one county
 *   node phase-a-download.js --county Dallas --county Tarrant  # Multiple counties
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// ============================================================
// Configuration
// ============================================================
const CSV_URL = "https://data.texas.gov/views/8auc-hzdi/rows.csv?accessType=DOWNLOAD";
const OUTPUT_DIR = path.join(__dirname, "output");
const RAW_CSV_PATH = path.join(OUTPUT_DIR, "raw_hoa_data.csv");

// Parse CLI args for county filter
const args = process.argv.slice(2);
const targetCounties = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--county" && args[i + 1]) {
    targetCounties.push(args[i + 1].toLowerCase());
    i++;
  }
}

// ============================================================
// Helpers
// ============================================================
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function normalizeCounty(county) {
  if (!county) return null;
  // Some records have "TX" or "TEXAS" instead of a county name
  const c = county.trim();
  if (c.toUpperCase() === "TX" || c.toUpperCase() === "TEXAS") return null;
  // Title case
  return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
}

function normalizeCity(city) {
  if (!city) return null;
  // Capitalize each word
  return city.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeZip(zip) {
  if (!zip) return null;
  // Take first 5 digits only (strip +4)
  const match = zip.trim().match(/^(\d{5})/);
  return match ? match[1] : zip.trim();
}

function normalizeType(type) {
  if (!type) return null;
  const t = type.trim().toUpperCase();
  if (t === "POA" || t === "COA") return t;
  return null;
}

function normalizeName(name) {
  if (!name) return null;
  // Remove extra whitespace, trim quotes
  return name.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
}

// ============================================================
// Validation
// ============================================================
function validateRecord(record) {
  const flags = [];

  if (!record.legal_name || record.legal_name.length < 3) {
    flags.push("missing_or_short_name");
  }
  if (!record.county) {
    flags.push("missing_county");
  }
  if (!record.city) {
    flags.push("missing_city");
  }
  if (!record.zip || !/^\d{5}$/.test(record.zip)) {
    flags.push("invalid_zip");
  }
  if (!record.association_type) {
    flags.push("missing_type");
  }
  if (!record.certificate_url || !record.certificate_url.startsWith("http")) {
    flags.push("missing_or_invalid_certificate_url");
  }

  return {
    validation_status: flags.length === 0 ? "approved" : "flagged",
    validation_flags: flags,
  };
}

// ============================================================
// Main
// ============================================================
async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // ----- Step 1: Download the CSV -----
  log("Downloading HOA data from Texas Open Data Portal...");
  let csvText;

  // Check if we have a cached copy (avoid re-downloading during development)
  if (fs.existsSync(RAW_CSV_PATH)) {
    log("Using cached CSV file: " + RAW_CSV_PATH);
    csvText = fs.readFileSync(RAW_CSV_PATH, "utf-8");
  } else {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
    }
    csvText = await response.text();
    fs.writeFileSync(RAW_CSV_PATH, csvText);
    log(`CSV saved to ${RAW_CSV_PATH} (${(csvText.length / 1024 / 1024).toFixed(2)} MB)`);
  }

  // ----- Step 2: Parse the CSV -----
  log("Parsing CSV...");
  const rawRecords = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });
  log(`Parsed ${rawRecords.length} total records from CSV`);

  // ----- Step 3: Normalize and structure each record -----
  log("Normalizing records...");
  const allRecords = rawRecords.map((row, index) => {
    const record = {
      row_index: index + 1,
      legal_name: normalizeName(row.Name),
      county: normalizeCounty(row.County),
      city: normalizeCity(row.City),
      zip: normalizeZip(row.Zip),
      association_type: normalizeType(row.Type),
      certificate_url: row.Certificate ? row.Certificate.trim() : null,
      scraped_at: new Date().toISOString(),
    };

    const validation = validateRecord(record);
    return { ...record, ...validation };
  });

  // ----- Step 4: Filter by county if requested -----
  let filteredRecords = allRecords;
  if (targetCounties.length > 0) {
    filteredRecords = allRecords.filter(
      (r) => r.county && targetCounties.includes(r.county.toLowerCase())
    );
    log(`Filtered to ${filteredRecords.length} records for counties: ${targetCounties.join(", ")}`);
  }

  // ----- Step 5: Split into approved and flagged -----
  const approved = filteredRecords.filter((r) => r.validation_status === "approved");
  const flagged = filteredRecords.filter((r) => r.validation_status === "flagged");

  // ----- Step 6: Generate stats -----
  const countyBreakdown = {};
  const typeBreakdown = { POA: 0, COA: 0, unknown: 0 };
  const flagBreakdown = {};

  filteredRecords.forEach((r) => {
    // County counts
    const county = r.county || "UNKNOWN";
    countyBreakdown[county] = (countyBreakdown[county] || 0) + 1;

    // Type counts
    if (r.association_type === "POA") typeBreakdown.POA++;
    else if (r.association_type === "COA") typeBreakdown.COA++;
    else typeBreakdown.unknown++;

    // Flag counts
    r.validation_flags.forEach((flag) => {
      flagBreakdown[flag] = (flagBreakdown[flag] || 0) + 1;
    });
  });

  // Sort counties by count descending
  const sortedCounties = Object.entries(countyBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  // ----- Step 7: Output files -----
  const suffix = targetCounties.length > 0 ? `_${targetCounties.join("_")}` : "_all";

  // Approved records
  const approvedPath = path.join(OUTPUT_DIR, `hoas_approved${suffix}.json`);
  fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
  log(`Saved ${approved.length} approved records to ${approvedPath}`);

  // Flagged records
  const flaggedPath = path.join(OUTPUT_DIR, `hoas_flagged${suffix}.json`);
  fs.writeFileSync(flaggedPath, JSON.stringify(flagged, null, 2));
  log(`Saved ${flagged.length} flagged records to ${flaggedPath}`);

  // Stats summary
  const stats = {
    generated_at: new Date().toISOString(),
    total_csv_records: rawRecords.length,
    filtered_records: filteredRecords.length,
    approved_records: approved.length,
    flagged_records: flagged.length,
    approval_rate: `${((approved.length / filteredRecords.length) * 100).toFixed(1)}%`,
    type_breakdown: typeBreakdown,
    top_counties: sortedCounties,
    flag_breakdown: flagBreakdown,
    target_counties: targetCounties.length > 0 ? targetCounties : "ALL",
  };
  const statsPath = path.join(OUTPUT_DIR, `stats${suffix}.json`);
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

  // ----- Step 8: Print summary -----
  console.log("\n" + "=".repeat(60));
  console.log("  PHASE A COMPLETE — HOA Data Download & Validation");
  console.log("=".repeat(60));
  console.log(`  Total records in CSV:     ${rawRecords.length}`);
  console.log(`  Filtered records:         ${filteredRecords.length}`);
  console.log(`  Approved (clean):         ${approved.length}`);
  console.log(`  Flagged (needs review):   ${flagged.length}`);
  console.log(`  Approval rate:            ${stats.approval_rate}`);
  console.log("");
  console.log("  Type breakdown:");
  console.log(`    POA: ${typeBreakdown.POA}  |  COA: ${typeBreakdown.COA}  |  Unknown: ${typeBreakdown.unknown}`);
  console.log("");
  console.log("  Top counties:");
  sortedCounties.forEach(([county, count]) => {
    console.log(`    ${county}: ${count}`);
  });
  if (Object.keys(flagBreakdown).length > 0) {
    console.log("");
    console.log("  Flag breakdown:");
    Object.entries(flagBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([flag, count]) => {
        console.log(`    ${flag}: ${count}`);
      });
  }
  console.log("");
  console.log("  Output files:");
  console.log(`    ${approvedPath}`);
  console.log(`    ${flaggedPath}`);
  console.log(`    ${statsPath}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});