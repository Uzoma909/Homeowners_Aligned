# Homeowners Aligned data pipeline

Plain Node.js scripts that collect public Texas HOA records and load them into Supabase. This folder is a separate package from the web application in the repository root.

The scripts are the original pipeline, unchanged. Nothing here runs automatically: every step is started from the command line.

## Setup

```bash
cd pipeline
npm install
cp .env.example .env   # then fill in the values
```

Requires Node.js 18 or newer (the scripts use the built-in `fetch`).

## Scripts

| Script | What it does |
| --- | --- |
| `run-pipeline.js` | Runs Phase A, B, C, and the seed in order for a metro area or a single county |
| `phase-a-download.js` | Downloads the TREC management certificate CSV, normalizes and validates each row, writes approved and flagged records per county |
| `phase-b-extract.js` | Downloads each certificate PDF, reads its text with `pdf-parse`, and asks the Claude API for structured JSON. Scanned PDFs are sent as documents |
| `fix-missing-fees.js` | Re-extracts text-path records that came back with no transfer fees, using a higher word cap, and updates them in place |
| `phase-c-comptroller.js` | Finds each HOA in the Texas Comptroller Franchise Tax API by name and merges entity status, registered agent, and officers |
| `seed-supabase.js` | Flattens complete records into `hoas`, `hoa_officers`, and `hoa_fees` rows and upserts them through the Supabase REST API |
| `phase-e-import.js` | Partly built. Extracts subdivisions from county parcel files, matches them to HOAs, and loads `subdivision_mappings` and `hoa_zip_codes`. Run for Dallas County only. Not used by the web application |
| `test-address-match.js` | Samples parcel records and prints how well they match HOAs. A diagnostic, not a test suite |
| `supabase_schema.sql` | Creates the three HOA tables, indexes, and read-only public policies |

## Usage

```bash
# Small trial: one county, five certificates, no database writes
node run-pipeline.js --county Rockwall --phase-b-limit 5 --skip-seed

# One metro area, including the load into Supabase
node run-pipeline.js --metro dfw

# Individual phases
node phase-a-download.js --county Dallas
node phase-b-extract.js --input output/hoas_approved_dallas.json --limit 10
node phase-c-comptroller.js --input output/hoas_enriched_dallas.json
node seed-supabase.js --input output/hoas_complete_dallas.json
```

Metro areas defined in `run-pipeline.js`: `dfw`, `dfw-full`, `houston`, `austin`, `sanantonio`. Only `dfw` has been run.

## Things to know before running

- **It makes real requests.** A full metro run sends thousands of requests to state servers and the Claude API and takes hours. Phase B costs money.
- **It resumes.** Each phase saves after every record and skips names it has already processed. To redo a record, remove it from the output file.
- **It writes to your database.** `seed-supabase.js` and `phase-e-import.js` use the service-role key, which bypasses row-level security. Use `--skip-seed` to stop before that.
- **The seed needs a unique constraint** on `hoas.legal_name`, which `supabase_schema.sql` does not create. See the database setup section of the root README.
- **Phase E needs files that are not downloaded by any script:** the Dallas appraisal district `ACCOUNT_INFO.csv` and TxGIO land parcel shapefiles, placed under `output/cad/`. Its two target tables are not created by any SQL file here.
- **Outputs stay local.** Everything is written under `output/`, which is git-ignored. It contains bulk records, including officers' mailing addresses. Do not commit or publish it.
