/**
 * Homeowners Aligned — Phase B: PDF Extraction
 * ==============================================
 * Downloads management certificate PDFs from hoa.texas.gov,
 * extracts text with pdf-parse, sends to Claude API for
 * structured data extraction, and saves enriched records.
 *
 * Usage:
 *   node phase-b-extract.js --input output/metros/dfw/hoas_approved_dallas.json --limit 5
 *   node phase-b-extract.js --input output/metros/dfw/hoas_approved_dallas.json --limit 50
 *   node phase-b-extract.js --input output/metros/dfw/hoas_approved_dallas.json  (all records)
 *
 * Required env var:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *
 * Set it before running:
 *   PowerShell:  $env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
 *   Bash:        export ANTHROPIC_API_KEY=sk-ant-your-key-here
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const pdf = PDFParse;

// ============================================================
// Configuration
// ============================================================
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const RATE_LIMIT_MS = 1500; // 1.5 seconds between PDF downloads
const API_RATE_LIMIT_MS = 500; // 0.5 seconds between Claude calls
const MAX_RETRIES = 3;
const PDF_TIMEOUT_MS = 15000; // 15 second timeout for PDF downloads

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
  console.error("Usage: node phase-b-extract.js --input <path-to-approved-json> [--limit N]");
  console.error("Example: node phase-b-extract.js --input output/metros/dfw/hoas_approved_dallas.json --limit 5");
  process.exit(1);
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable not set.");
  console.error("PowerShell:  $env:ANTHROPIC_API_KEY=\"sk-ant-your-key-here\"");
  console.error("Then run again.");
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
// PDF Download & Text Extraction
// ============================================================
async function downloadAndExtractPDF(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PDF_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "HomeownersAligned-DataPipeline/1.0 (contact: support@homeownersaligned.com)",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("pdf") && !contentType.includes("octet-stream")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 100) {
      throw new Error(`PDF too small (${buffer.length} bytes), likely an error page`);
    }

    const parser = new pdf({ data: buffer });
    const data = await parser.getText();
    const text = data.text.trim();

    if (text.length < 200) {
      return {
        success: false,
        error: `Extracted text too short (${text.length} chars), PDF may be scanned/image-only`,
        text: null,
        buffer: buffer,
        isScanned: true,
      };
    }

    return {
      success: true,
      text: text,
      pages: data.numpages,
      textLength: text.length,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      success: false,
      error: err.message,
      text: null,
      buffer: null,
      isScanned: false,
    };
  }
}

// ============================================================
// Claude API: Structured Extraction
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
  // Trim the text to reduce tokens — remove repeated whitespace and limit length
  let trimmedText = pdfText
    .replace(/\s+/g, " ")
    .replace(/_{3,}/g, "")
    .replace(/\.{3,}/g, "...")
    .trim();

  // Cap at ~3000 words to keep costs low
  const words = trimmedText.split(" ");
  if (words.length > 8000) {
    trimmedText = words.slice(0, 8000).join(" ") + "\n[TRUNCATED]";
  }

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Here is the text extracted from a management certificate for "${hoaName}":\n\n---\n${trimmedText}\n---\n\nExtract the structured data as JSON.`,
      },
    ],
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
        log(`  Rate limited. Waiting ${retryAfter}s before retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const rawText = data.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("");

      // Clean and parse JSON response
      const cleaned = rawText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      // Calculate approximate cost
      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      const cost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

      return {
        success: true,
        data: parsed,
        tokens: { input: inputTokens, output: outputTokens },
        cost: cost,
      };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        return {
          success: false,
          error: err.message,
          data: null,
        };
      }
      log(`  Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

// ============================================================
// Claude Vision: Extract from scanned PDFs
// ============================================================
async function extractWithClaudeVision(pdfBuffer, hoaName) {
  const base64Data = pdfBuffer.toString("base64");

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64Data,
            },
          },
          {
            type: "text",
            text: `This is a scanned management certificate for "${hoaName}". Extract the structured data as JSON.`,
          },
        ],
      },
    ],
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
        log(`  Rate limited. Waiting ${retryAfter}s before retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const rawText = data.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("");

      const cleaned = rawText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      const cost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

      return {
        success: true,
        data: parsed,
        tokens: { input: inputTokens, output: outputTokens },
        cost: cost,
        method: "vision",
      };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        return {
          success: false,
          error: err.message,
          data: null,
        };
      }
      log(`  Vision attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(2000 * attempt);
    }
  }
}

// ============================================================
// Main Pipeline
// ============================================================
async function main() {
  // Load input records
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
  const totalToProcess = Math.min(records.length, limit);

  log(`Loaded ${records.length} records from ${inputFile}`);
  log(`Processing ${totalToProcess} records (limit: ${limit === Infinity ? "none" : limit})`);
  log("");

  // Determine output file path
  const inputDir = path.dirname(inputFile);
  const inputBase = path.basename(inputFile, ".json").replace("hoas_approved_", "");
  const outputFile = path.join(inputDir, `hoas_enriched_${inputBase}.json`);
  const errorsFile = path.join(inputDir, `hoas_errors_${inputBase}.json`);

  // Check for existing progress (resume support — name-based dedup)
  let enrichedRecords = [];
  let errorRecords = [];
  const processedNames = new Set();

  if (fs.existsSync(outputFile)) {
    enrichedRecords = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
    for (const r of enrichedRecords) processedNames.add(r.legal_name);
    log(`Resuming: ${enrichedRecords.length} already processed`);
  }
  if (fs.existsSync(errorsFile)) {
    errorRecords = JSON.parse(fs.readFileSync(errorsFile, "utf-8"));
    for (const r of errorRecords) processedNames.add(r.legal_name);
  }

  // Track stats
  let totalCost = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let pdfSuccessCount = 0;
  let pdfFailCount = 0;
  let extractSuccessCount = 0;
  let extractFailCount = 0;

  // Process records
  for (let i = 0; i < totalToProcess; i++) {
    const record = records[i];
    const progress = `[${i + 1}/${totalToProcess}]`;

    // Skip already processed (name-based dedup)
    if (processedNames.has(record.legal_name)) {
      continue;
    }

    log(`${progress} ${record.legal_name}`);

    // Step 1: Download and extract PDF text
    log(`  Downloading PDF...`);
    const pdfResult = await downloadAndExtractPDF(record.certificate_url);

    if (!pdfResult.success) {
      if (pdfResult.isScanned && pdfResult.buffer) {
        log(`  PDF is scanned/image-only. Trying Claude Vision...`);
        await sleep(API_RATE_LIMIT_MS);
        const visionResult = await extractWithClaudeVision(pdfResult.buffer, record.legal_name);

        if (!visionResult.success) {
          log(`  VISION FAILED: ${visionResult.error}`);
          extractFailCount++;
          errorRecords.push({
            ...record,
            error_stage: "vision_extraction",
            error_message: visionResult.error,
            processed_at: new Date().toISOString(),
          });
          fs.writeFileSync(errorsFile, JSON.stringify(errorRecords, null, 2));
          await sleep(RATE_LIMIT_MS);
          continue;
        }

        extractSuccessCount++;
        totalCost += visionResult.cost;
        totalInputTokens += visionResult.tokens.input;
        totalOutputTokens += visionResult.tokens.output;
        log(`  VISION EXTRACTED: mgmt=${visionResult.data.management_company?.name || "N/A"} | cost=$${visionResult.cost.toFixed(4)}`);

        const enrichedRecord = {
          ...record,
          extracted: visionResult.data,
          extraction_method: "vision",
          extraction_tokens: visionResult.tokens,
          extraction_cost: visionResult.cost,
          processed_at: new Date().toISOString(),
        };

        enrichedRecords.push(enrichedRecord);
        fs.writeFileSync(outputFile, JSON.stringify(enrichedRecords, null, 2));
        fs.writeFileSync(errorsFile, JSON.stringify(errorRecords, null, 2));
        await sleep(RATE_LIMIT_MS);
        continue;
      }

      log(`  PDF FAILED: ${pdfResult.error}`);
      pdfFailCount++;
      errorRecords.push({
        ...record,
        error_stage: "pdf_download",
        error_message: pdfResult.error,
        processed_at: new Date().toISOString(),
      });
      fs.writeFileSync(errorsFile, JSON.stringify(errorRecords, null, 2));
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    pdfSuccessCount++;
    log(`  PDF OK: ${pdfResult.pages} pages, ${pdfResult.textLength} chars`);

    // Step 2: Send to Claude for extraction
    log(`  Extracting with Claude API...`);
    await sleep(API_RATE_LIMIT_MS);
    const extractResult = await extractWithClaude(pdfResult.text, record.legal_name);

    if (!extractResult.success) {
      log(`  EXTRACTION FAILED: ${extractResult.error}`);
      extractFailCount++;
      errorRecords.push({
        ...record,
        pdf_pages: pdfResult.pages,
        pdf_text_length: pdfResult.textLength,
        error_stage: "claude_extraction",
        error_message: extractResult.error,
        processed_at: new Date().toISOString(),
      });
      fs.writeFileSync(errorsFile, JSON.stringify(errorRecords, null, 2));
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    extractSuccessCount++;
    totalCost += extractResult.cost;
    totalInputTokens += extractResult.tokens.input;
    totalOutputTokens += extractResult.tokens.output;

    log(`  EXTRACTED: mgmt=${extractResult.data.management_company?.name || "N/A"} | cost=$${extractResult.cost.toFixed(4)}`);

    // Step 3: Merge enriched data with original record
    const enrichedRecord = {
      ...record,
      extracted: extractResult.data,
      pdf_pages: pdfResult.pages,
      pdf_text_length: pdfResult.textLength,
      extraction_tokens: extractResult.tokens,
      extraction_cost: extractResult.cost,
      processed_at: new Date().toISOString(),
    };

    enrichedRecords.push(enrichedRecord);

    // Save progress after each record (resume-safe)
    fs.writeFileSync(outputFile, JSON.stringify(enrichedRecords, null, 2));
    fs.writeFileSync(errorsFile, JSON.stringify(errorRecords, null, 2));

    // Rate limit
    await sleep(RATE_LIMIT_MS);
  }

  // ===== Summary =====
  console.log("\n" + "=".repeat(60));
  console.log("  PHASE B COMPLETE — PDF Extraction Results");
  console.log("=".repeat(60));
  console.log(`  Records processed:        ${extractSuccessCount + extractFailCount + pdfFailCount}`);
  console.log(`  PDF downloads succeeded:  ${pdfSuccessCount}`);
  console.log(`  PDF downloads failed:     ${pdfFailCount}`);
  console.log(`  Claude extractions OK:    ${extractSuccessCount}`);
  console.log(`  Claude extractions failed: ${extractFailCount}`);
  console.log("");
  console.log(`  Total API cost:           $${totalCost.toFixed(4)}`);
  console.log(`  Total input tokens:       ${totalInputTokens.toLocaleString()}`);
  console.log(`  Total output tokens:      ${totalOutputTokens.toLocaleString()}`);
  console.log(`  Avg cost per certificate: $${(totalCost / Math.max(extractSuccessCount, 1)).toFixed(4)}`);
  console.log("");
  console.log(`  Enriched output: ${outputFile}`);
  console.log(`  Errors log:      ${errorsFile}`);
  console.log("=".repeat(60));

  // Estimate full run cost
  if (limit !== Infinity && extractSuccessCount > 0) {
    const avgCost = totalCost / extractSuccessCount;
    const fullRunCost = avgCost * records.length;
    console.log("");
    console.log(`  ESTIMATE: Full run of ${records.length} records ≈ $${fullRunCost.toFixed(2)}`);
    console.log("=".repeat(60));
  }
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});