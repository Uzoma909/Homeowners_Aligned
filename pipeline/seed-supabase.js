/**
 * Homeowners Aligned — Seed Script
 * ==================================
 * Reads hoas_complete_*.json files and inserts into Supabase.
 * Handles deduplication by legal_name — safe to re-run.
 *
 * Usage:
 *   node seed-supabase.js --input output/metros/dfw/hoas_complete_dallas.json
 *   node seed-supabase.js --dir output/metros/dfw    (seeds all complete files in dir)
 *
 * Required env vars:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

// ============================================================
// Configuration
// ============================================================
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BATCH_SIZE = 50;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

// Parse CLI args
const args = process.argv.slice(2);
let inputFile = null;
let inputDir = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    inputFile = args[i + 1];
    i++;
  }
  if (args[i] === "--dir" && args[i + 1]) {
    inputDir = args[i + 1];
    i++;
  }
}

if (!inputFile && !inputDir) {
  console.error("Usage:");
  console.error("  node seed-supabase.js --input <path-to-complete-json>");
  console.error("  node seed-supabase.js --dir <path-to-metro-folder>");
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

// ============================================================
// Supabase REST API helpers (no SDK needed)
// ============================================================
async function supabaseRequest(table, method, body, query = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: method === "POST" ? "resolution=merge-duplicates,return=representation" : "return=representation",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase ${method} ${table}: ${response.status} — ${errorText.slice(0, 300)}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ============================================================
// Transform JSON record to Supabase row
// ============================================================
function transformHoa(record) {
  const ext = record.extracted || {};
  const comp = record.comptroller || {};

  return {
    legal_name: record.legal_name,
    association_name: ext.association_name || null,
    subdivision_name: ext.subdivision_name || null,
    county: record.county,
    city: record.city,
    zip: record.zip,
    association_type: record.association_type || ext.association_type || null,
    certificate_url: record.certificate_url,

    // Management company
    mgmt_company_name: ext.management_company?.name || null,
    mgmt_company_address: ext.management_company?.address || null,
    mgmt_company_phone: ext.management_company?.phone || null,
    mgmt_company_email: ext.management_company?.email || null,
    mgmt_company_website: ext.management_company?.website || null,

    // Association contact
    association_address: ext.association_address || null,
    association_website: ext.association_website || null,

    // Recording data
    recording_county: ext.recording_data?.county || null,
    recording_instrument_number: ext.recording_data?.instrument_number || null,
    recording_volume_page: ext.recording_data?.volume_page || null,
    recording_date: ext.recording_data?.recording_date || null,

    // CC&R references
    ccr_references: ext.ccr_references || [],

    // Comptroller data
    taxpayer_id: comp.taxpayer_id || null,
    fei_number: comp.fei_number || null,
    entity_status: comp.entity_status || null,
    sos_status: comp.sos_status || null,
    sos_file_number: comp.sos_file_number || null,
    sos_effective_date: comp.sos_effective_date || null,
    state_of_formation: comp.state_of_formation || null,
    registered_agent_name: comp.registered_agent?.name || null,
    registered_agent_address: comp.registered_agent?.address || null,
    comptroller_mailing_address: comp.mailing_address || null,
    comptroller_report_year: comp.report_year || null,

    // Extraction metadata
    extraction_method: record.extraction_method || "text",
    extraction_cost: record.extraction_cost || null,

    // Timestamps
    scraped_at: record.scraped_at || null,
    processed_at: record.processed_at || null,
    comptroller_processed_at: record.comptroller_processed_at || null,
  };
}

function transformOfficers(officers, hoaId) {
  return (officers || []).map((o) => ({
    hoa_id: hoaId,
    name: o.name,
    title: o.title,
    active_year: o.active_year,
    address: o.address,
    source: o.source,
  }));
}

function transformFees(fees, hoaId) {
  return (fees || []).map((f) => ({
    hoa_id: hoaId,
    fee_type: f.fee_type,
    amount: f.amount,
  }));
}

// ============================================================
// Seed a single file
// ============================================================
async function seedFile(filePath) {
  if (!fs.existsSync(filePath)) {
    log(`File not found: ${filePath}`);
    return { inserted: 0, skipped: 0, errors: 0 };
  }

  const records = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  log(`Processing ${records.length} records from ${path.basename(filePath)}`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const hoaRows = batch.map(transformHoa);

    try {
      // Upsert HOAs (merge on legal_name conflict)
      const result = await supabaseRequest("hoas", "POST", hoaRows, "?on_conflict=legal_name");

      if (!result || result.length === 0) {
        skipped += batch.length;
        continue;
      }

      // Build a map of legal_name → id for officers and fees
      const nameToId = {};
      for (const row of result) {
        nameToId[row.legal_name] = row.id;
      }

      // Insert officers and fees for each record
      for (const record of batch) {
        const hoaId = nameToId[record.legal_name];
        if (!hoaId) continue;

        // Officers
        const officers = transformOfficers(record.comptroller?.officers, hoaId);
        if (officers.length > 0) {
          // Delete existing officers for this HOA first (fresh data wins)
          await supabaseRequest("hoa_officers", "DELETE", null, `?hoa_id=eq.${hoaId}`);
          await supabaseRequest("hoa_officers", "POST", officers);
        }

        // Fees
        const fees = transformFees(record.extracted?.transfer_fees, hoaId);
        if (fees.length > 0) {
          await supabaseRequest("hoa_fees", "DELETE", null, `?hoa_id=eq.${hoaId}`);
          await supabaseRequest("hoa_fees", "POST", fees);
        }
      }

      inserted += result.length;
      log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.length} HOAs seeded`);
    } catch (err) {
      log(`  BATCH ERROR: ${err.message}`);
      errors += batch.length;
    }

    await sleep(200);
  }

  return { inserted, skipped, errors };
}

// ============================================================
// Main
// ============================================================
async function main() {
  log("Starting Supabase seed...");
  log(`Target: ${SUPABASE_URL}`);
  log("");

  let files = [];

  if (inputFile) {
    files = [inputFile];
  } else if (inputDir) {
    const dirContents = fs.readdirSync(inputDir);
    files = dirContents
      .filter((f) => f.startsWith("hoas_complete_") && f.endsWith(".json"))
      .map((f) => path.join(inputDir, f));

    if (files.length === 0) {
      log(`No hoas_complete_*.json files found in ${inputDir}`);
      process.exit(1);
    }
  }

  log(`Found ${files.length} file(s) to seed`);
  log("");

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const file of files) {
    const result = await seedFile(file);
    totalInserted += result.inserted;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
    log("");
  }

  console.log("=".repeat(60));
  console.log("  SEED COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Files processed:   ${files.length}`);
  console.log(`  HOAs inserted:     ${totalInserted}`);
  console.log(`  HOAs skipped:      ${totalSkipped}`);
  console.log(`  Errors:            ${totalErrors}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});