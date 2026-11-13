/**
 * Homeowners Aligned — Targeted Fee Re-extraction
 * =================================================
 * Finds records missing transfer fees in enriched files,
 * re-downloads their PDFs, re-extracts with higher word cap,
 * and updates the records IN PLACE. No stripping, no data loss.
 *
 * Usage:
 *   node fix-missing-fees.js --input output/metros/dfw/hoas_enriched_dallas.json
 *   node fix-missing-fees.js --input output/metros/dfw/hoas_enriched_dallas.json --limit 10
 *   node fix-missing-fees.js --dir output/metros/dfw
 *
 * Only re-processes text-extracted records (not vision) since
 * those were truncated at 3000 words. Vision records already
 * saw the full PDF.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const pdf = PDFParse;

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const RATE_LIMIT_MS = 1500;
const API_RATE_LIMIT_MS = 500;
const MAX_RETRIES = 3;
const PDF_TIMEOUT_MS = 15000;
const WORD_CAP = 8000;

const args = process.argv.slice(2);
let inputFile = null;
let inputDir = null;
let limit = Infinity;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) { inputFile = args[i + 1]; i++; }
  if (args[i] === "--dir" && args[i + 1]) { inputDir = args[i + 1]; i++; }
  if (args[i] === "--limit" && args[i + 1]) { limit = parseInt(args[i + 1], 10); i++; }
}

if (!inputFile && !inputDir) {
  console.error("Usage: node fix-missing-fees.js --input <enriched-json> [--limit N]");
  console.error("   or: node fix-missing-fees.js --dir <metro-folder> [--limit N]");
  process.exit(1);
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY not set in .env");
  process.exit(1);
}

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// PDF Download & Text Extraction (higher word cap)
// ============================================================
async function downloadAndExtractPDF(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PDF_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "HomeownersAligned-DataPipeline/1.0" },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 100) throw new Error(`PDF too small (${buffer.length} bytes)`);

    const parser = new pdf({ data: buffer });
    const data = await parser.getText();
    const text = data.text.trim();

    if (text.length < 200) {
      return { success: false, text: null, buffer, isScanned: true };
    }

    return { success: true, text, textLength: text.length };
  } catch (err) {
    clearTimeout(timeout);
    return { success: false, error: err.message, text: null, buffer: null, isScanned: false };
  }
}

// ============================================================
// Claude Extraction (with higher word cap)
// ============================================================
const EXTRACTION_PROMPT = `You are extracting structured data from a Texas HOA management certificate. The document is a legal filing required by Texas Property Code Section 209.004 (POA) or Section 82.116 (COA).

Extract the following fields from the text. Return ONLY valid JSON with no markdown, no backticks, no explanation. If a field is not found in the text, use null.

{
  "subdivision_name": "The legal subdivision name as stated in the certificate",
  "association_name": "The full legal name of the association",
  "management_company": {
    "name": "Management company or managing agent name",
    "address": "Full mailing address",
    "phone": "Phone number",
    "email": "Email address",
    "website": "Website URL"
  },
  "association_address": "Mailing address of the association itself",
  "association_website": "Website where dedicatory instruments are posted",
  "transfer_fees": [
    {
      "fee_type": "Type of fee (e.g., resale certificate, transfer fee, capital contribution)",
      "amount": "Dollar amount as a number, or null if not specified"
    }
  ],
  "recording_data": {
    "county": "County where recorded",
    "instrument_number": "Recording/instrument number if present",
    "volume_page": "Volume and page if present",
    "recording_date": "Date recorded if present"
  },
  "ccr_references": ["List of CC&R or declaration instrument/document numbers referenced"],
  "association_type": "POA or COA based on the certificate content"
}`;

async function extractWithClaude(pdfText, hoaName) {
  let trimmedText = pdfText
    .replace(/\s+/g, " ")
    .replace(/_{3,}/g, "")
    .replace(/\.{3,}/g, "...")
    .trim();

  const words = trimmedText.split(" ");
  if (words.length > WORD_CAP) {
    trimmedText = words.slice(0, WORD_CAP).join(" ") + "\n[TRUNCATED]";
  }

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Here is the text extracted from a management certificate for "${hoaName}":\n\n---\n${trimmedText}\n---\n\nExtract the structured data as JSON.`,
    }],
    system: EXTRACTION_PROMPT,
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "10", 10);
        log(`  Rate limited. Waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const rawText = data.content.filter(c => c.type === "text").map(c => c.text).join("");
      const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      const cost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

      return { success: true, data: parsed, tokens: { input: inputTokens, output: outputTokens }, cost };
    } catch (err) {
      if (attempt === MAX_RETRIES) return { success: false, error: err.message, data: null };
      log(`  Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

async function extractWithClaudeVision(pdfBuffer, hoaName) {
  const base64Data = pdfBuffer.toString("base64");

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } },
        { type: "text", text: `This is a scanned management certificate for "${hoaName}". Extract the structured data as JSON.` },
      ],
    }],
    system: EXTRACTION_PROMPT,
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "10", 10);
        log(`  Rate limited. Waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const rawText = data.content.filter(c => c.type === "text").map(c => c.text).join("");
      const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      const cost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

      return { success: true, data: parsed, tokens: { input: inputTokens, output: outputTokens }, cost, method: "vision" };
    } catch (err) {
      if (attempt === MAX_RETRIES) return { success: false, error: err.message, data: null };
      log(`  Vision attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

// ============================================================
// Process a single enriched file
// ============================================================
async function processFile(filePath, globalLimit) {
  const records = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Find text-extracted records missing fees
  const targets = [];
  const targetIndices = [];
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (r.extraction_method === "vision") continue; // Vision already saw full PDF
    if (r.extracted?.transfer_fees && r.extracted.transfer_fees.length > 0) continue; // Already has fees
    if (!r.certificate_url) continue;
    targets.push(r);
    targetIndices.push(i);
  }

  const toProcess = Math.min(targets.length, globalLimit.remaining);
  log(`${path.basename(filePath)}: ${targets.length} records missing fees, processing ${toProcess}`);

  if (toProcess === 0) return { fixed: 0, failed: 0, cost: 0 };

  let fixed = 0;
  let failed = 0;
  let totalCost = 0;

  for (let t = 0; t < toProcess; t++) {
    const record = targets[t];
    const idx = targetIndices[t];
    const progress = `[${t + 1}/${toProcess}]`;

    log(`${progress} ${record.legal_name}`);
    log(`  Downloading PDF...`);

    const pdfResult = await downloadAndExtractPDF(record.certificate_url);

    let extractResult = null;

    if (!pdfResult.success) {
      if (pdfResult.isScanned && pdfResult.buffer) {
        log(`  Scanned PDF. Using Vision...`);
        await sleep(API_RATE_LIMIT_MS);
        extractResult = await extractWithClaudeVision(pdfResult.buffer, record.legal_name);
      } else {
        log(`  PDF FAILED: ${pdfResult.error}`);
        failed++;
        await sleep(RATE_LIMIT_MS);
        continue;
      }
    } else {
      log(`  PDF OK: ${pdfResult.textLength} chars (cap: ${WORD_CAP} words)`);
      await sleep(API_RATE_LIMIT_MS);
      extractResult = await extractWithClaude(pdfResult.text, record.legal_name);
    }

    if (!extractResult || !extractResult.success) {
      log(`  EXTRACTION FAILED: ${extractResult?.error || "unknown"}`);
      failed++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    const newFees = extractResult.data?.transfer_fees || [];
    totalCost += extractResult.cost;

    if (newFees.length > 0) {
      // Update the record in place
      records[idx].extracted = extractResult.data;
      records[idx].extraction_cost = extractResult.cost;
      records[idx].extraction_tokens = extractResult.tokens;
      records[idx].processed_at = new Date().toISOString();
      if (extractResult.method === "vision") {
        records[idx].extraction_method = "vision";
      }
      log(`  FIXED: ${newFees.length} fees found | mgmt=${extractResult.data.management_company?.name || "N/A"} | cost=$${extractResult.cost.toFixed(4)}`);
      fixed++;
    } else {
      log(`  NO FEES in certificate (genuinely empty) | cost=$${extractResult.cost.toFixed(4)}`);
      // Mark as checked so we don't re-process again
      records[idx].fees_verified_empty = true;
      records[idx].processed_at = new Date().toISOString();
    }

    // Save after each record
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
    globalLimit.remaining--;
    await sleep(RATE_LIMIT_MS);
  }

  return { fixed, failed, cost: totalCost };
}

// ============================================================
// Main
// ============================================================
async function main() {
  let files = [];

  if (inputFile) {
    files = [inputFile];
  } else if (inputDir) {
    const dirContents = fs.readdirSync(inputDir);
    files = dirContents
      .filter(f => f.startsWith("hoas_enriched_") && f.endsWith(".json"))
      .map(f => path.join(inputDir, f));
  }

  if (files.length === 0) {
    console.error("No enriched files found.");
    process.exit(1);
  }

  const globalLimit = { remaining: limit };
  let totalFixed = 0;
  let totalFailed = 0;
  let totalCost = 0;

  log(`Starting targeted fee re-extraction (limit: ${limit === Infinity ? "none" : limit})`);
  log(`Word cap: ${WORD_CAP} (was 3000)`);
  log("");

  for (const file of files) {
    if (globalLimit.remaining <= 0) break;
    const result = await processFile(file, globalLimit);
    totalFixed += result.fixed;
    totalFailed += result.failed;
    totalCost += result.cost;
  }

  console.log("\n" + "=".repeat(60));
  console.log("  FEE RE-EXTRACTION COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Records fixed:     ${totalFixed}`);
  console.log(`  Records failed:    ${totalFailed}`);
  console.log(`  Genuinely empty:   checked and marked`);
  console.log(`  Total cost:        $${totalCost.toFixed(4)}`);
  console.log(`  Avg per record:    $${(totalCost / Math.max(totalFixed + totalFailed, 1)).toFixed(4)}`);
  console.log("=".repeat(60));
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});