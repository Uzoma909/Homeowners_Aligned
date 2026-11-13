/**
 * Homeowners Aligned — Master Pipeline
 * ======================================
 * Runs Phase A → B → C → Supabase Seed for specified counties.
 * One command to go from zero to database.
 *
 * Usage:
 *   node run-pipeline.js --metro dfw
 *   node run-pipeline.js --metro dfw --skip-seed       (skip Supabase push)
 *   node run-pipeline.js --metro dfw --phase-b-limit 10 (limit Phase B for testing)
 *   node run-pipeline.js --county Dallas                (single county, no metro folder)
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   COMPTROLLER_API_KEY=...
 *   SUPABASE_URL=https://...supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

require("dotenv").config();

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ============================================================
// Metro definitions
// ============================================================
const METROS = {
  dfw: ["Dallas", "Collin", "Tarrant", "Ellis", "Rockwall", "Kaufman"],
  "dfw-full": ["Dallas", "Collin", "Tarrant", "Denton", "Ellis", "Rockwall", "Kaufman"],
  houston: ["Harris", "Fort Bend", "Montgomery", "Brazoria", "Galveston"],
  austin: ["Travis", "Williamson", "Hays", "Bastrop"],
  sanantonio: ["Bexar", "Comal", "Guadalupe", "Kendall"],
};

// ============================================================
// Parse CLI args
// ============================================================
const args = process.argv.slice(2);
let metro = null;
let singleCounty = null;
let skipSeed = false;
let phaseBLimit = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--metro" && args[i + 1]) {
    metro = args[i + 1].toLowerCase();
    i++;
  }
  if (args[i] === "--county" && args[i + 1]) {
    singleCounty = args[i + 1];
    i++;
  }
  if (args[i] === "--skip-seed") {
    skipSeed = true;
  }
  if (args[i] === "--phase-b-limit" && args[i + 1]) {
    phaseBLimit = parseInt(args[i + 1], 10);
    i++;
  }
}

if (!metro && !singleCounty) {
  console.error("Usage:");
  console.error("  node run-pipeline.js --metro dfw");
  console.error("  node run-pipeline.js --county Dallas");
  console.error("");
  console.error("Available metros: " + Object.keys(METROS).join(", "));
  process.exit(1);
}

const counties = singleCounty ? [singleCounty] : METROS[metro];
if (!counties) {
  console.error(`Unknown metro: ${metro}`);
  console.error("Available: " + Object.keys(METROS).join(", "));
  process.exit(1);
}

const metroDir = metro ? `output/metros/${metro}` : "output";

// ============================================================
// Helpers
// ============================================================
function log(msg) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${msg}`);
  console.log("=".repeat(60));
}

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit", timeout: 3600000 }); // 1 hour timeout
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    console.error(err.message);
    return false;
  }
  return true;
}

// ============================================================
// Check prerequisites
// ============================================================
function checkEnv() {
  const required = ["ANTHROPIC_API_KEY", "COMPTROLLER_API_KEY"];
  if (!skipSeed) {
    required.push("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY");
  }

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error("Missing environment variables in .env:");
    missing.forEach((k) => console.error(`  - ${k}`));
    process.exit(1);
  }
}

// ============================================================
// Main Pipeline
// ============================================================
async function main() {
  checkEnv();

  const startTime = Date.now();

  console.log("\n" + "█".repeat(60));
  console.log("  HOMEOWNERS ALIGNED — FULL PIPELINE");
  console.log("█".repeat(60));
  console.log(`  Metro:    ${metro || "single county"}`);
  console.log(`  Counties: ${counties.join(", ")}`);
  console.log(`  Seed:     ${skipSeed ? "SKIP" : "YES"}`);
  console.log(`  Phase B:  ${phaseBLimit ? `limit ${phaseBLimit}` : "full run"}`);
  console.log("█".repeat(60));

  // ===== Ensure directories exist =====
  if (metro) {
    fs.mkdirSync(metroDir, { recursive: true });
  }

  // ===== Check if CSV exists =====
  if (!fs.existsSync("output/raw_hoa_data.csv")) {
    log("DOWNLOADING CSV from Texas Open Data Portal...");
    console.log("This may take a minute...");
    // Use node fetch since PowerShell commands don't work in execSync cross-platform
    const downloadScript = `
      const fs = require("fs");
      async function dl() {
        const r = await fetch("https://data.texas.gov/views/8auc-hzdi/rows.csv?accessType=DOWNLOAD");
        const buf = Buffer.from(await r.arrayBuffer());
        fs.writeFileSync("output/raw_hoa_data.csv", buf);
        console.log("Downloaded " + buf.length + " bytes");
      }
      dl();
    `;
    fs.writeFileSync("_dl_temp.js", downloadScript);
    run("node _dl_temp.js");
    fs.unlinkSync("_dl_temp.js");
  } else {
    console.log("\nCSV already cached: output/raw_hoa_data.csv");
  }

  // ===== PHASE A: Parse each county =====
  log("PHASE A — CSV Parse");
  for (const county of counties) {
    run(`node phase-a-download.js --county ${county}`);
  }

  // Move files to metro folder if needed
  if (metro) {
    for (const county of counties) {
      const lcCounty = county.toLowerCase();
      const files = [
        `output/hoas_approved_${lcCounty}.json`,
        `output/hoas_flagged_${lcCounty}.json`,
        `output/stats_${lcCounty}.json`,
      ];
      for (const f of files) {
        if (fs.existsSync(f)) {
          const dest = path.join(metroDir, path.basename(f));
          fs.renameSync(f, dest);
        }
      }
    }
    console.log(`\nMoved files to ${metroDir}/`);
  }

  // ===== PHASE B: PDF Extraction =====
  log("PHASE B — PDF Extraction (Claude API)");
  for (const county of counties) {
    const lcCounty = county.toLowerCase();
    const inputPath = metro
      ? `${metroDir}/hoas_approved_${lcCounty}.json`
      : `output/hoas_approved_${lcCounty}.json`;

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${county} — no approved file found`);
      continue;
    }

    const limitArg = phaseBLimit ? ` --limit ${phaseBLimit}` : "";
    run(`node phase-b-extract.js --input ${inputPath}${limitArg}`);
  }

  // ===== PHASE C: Comptroller Enrichment =====
  log("PHASE C — Comptroller API Enrichment (FREE)");
  for (const county of counties) {
    const lcCounty = county.toLowerCase();
    const inputPath = metro
      ? `${metroDir}/hoas_enriched_${lcCounty}.json`
      : `output/hoas_enriched_${lcCounty}.json`;

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${county} — no enriched file found`);
      continue;
    }

    run(`node phase-c-comptroller.js --input ${inputPath}`);
  }

  // ===== SEED: Push to Supabase =====
  if (!skipSeed) {
    log("SEEDING SUPABASE");
    const dirArg = metro ? `--dir ${metroDir}` : "";

    if (metro) {
      run(`node seed-supabase.js --dir ${metroDir}`);
    } else {
      for (const county of counties) {
        const lcCounty = county.toLowerCase();
        const completePath = `output/hoas_complete_${lcCounty}.json`;
        if (fs.existsSync(completePath)) {
          run(`node seed-supabase.js --input ${completePath}`);
        }
      }
    }
  }

  // ===== Summary =====
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n" + "█".repeat(60));
  console.log("  PIPELINE COMPLETE");
  console.log("█".repeat(60));
  console.log(`  Counties processed: ${counties.length}`);
  console.log(`  Total time:         ${elapsed} minutes`);
  console.log(`  Output directory:   ${metroDir}`);
  if (!skipSeed) {
    console.log(`  Supabase:           SEEDED`);
  }
  console.log("█".repeat(60));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});