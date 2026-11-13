import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { PipelineDiagram } from "@/components/portfolio/PipelineDiagram";
import { REPO_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behind Homeowners Aligned: Technical Case Study",
  description:
    "How a Node.js data pipeline turns fragmented public Texas HOA records into structured, searchable profiles: data sources, PDF extraction, entity matching, Postgres storage, and an experimental transparency score.",
  alternates: { canonical: "/project" },
};

const SECTIONS = [
  { id: "problem", label: "The Problem" },
  { id: "solution", label: "The Solution" },
  { id: "architecture", label: "Technical Architecture" },
  { id: "collection", label: "Data Collection" },
  { id: "documents", label: "Document Processing" },
  { id: "cleaning", label: "Cleaning and Transformation" },
  { id: "storage", label: "Data Storage" },
  { id: "scoring", label: "Transparency Scoring" },
  { id: "frontend", label: "Frontend Application" },
  { id: "challenges", label: "Engineering Challenges" },
  { id: "limitations", label: "Known Limitations" },
  { id: "learned", label: "What I Learned" },
];

const STACK: [string, string][] = [
  ["Pipeline", "Node.js (CommonJS), built-in fetch, csv-parse, pdf-parse, shapefile, dotenv"],
  ["Document extraction", "Claude API (claude-sonnet-4-20250514), called over HTTPS with a fixed JSON schema prompt"],
  ["Database", "Supabase (Postgres) with row-level security and pg_trgm indexes"],
  ["Web application", "Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4"],
  ["Data access", "Supabase JavaScript client using the anonymous key. No custom API layer"],
  ["Scoring", "A pure TypeScript function, run when a page renders"],
];

// Counts taken from the pipeline's output files for the Dallas-Fort Worth run.
const RUN_SUMMARY: [string, string][] = [
  ["Associations in the statewide dataset", "16,611"],
  ["DFW records that passed validation (six counties)", "3,486"],
  ["DFW records set aside by validation", "3"],
  ["Records carried through every phase", "3,361"],
  ["Certificates that needed the scanned-document path", "2,460"],
  ["Records with at least one transfer fee extracted", "2,645"],
  ["Records matched to a Comptroller entity", "2,710"],
  ["Officer records collected", "13,002"],
];

export default function ProjectPage() {
  return (
    <div className="min-h-screen">
      <NavBar activePath="/project" />

      <main id="main-content">
        {/* ─── HEADER ─── */}
        <header className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 opacity-50 ha-glow" />
          <div className="relative max-w-[960px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-8 md:pb-10">
            <Eyebrow>Technical case study</Eyebrow>
            <h1
              className="text-[34px] md:text-[52px] font-semibold leading-[1.06] tracking-tight"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-ha-text)",
                letterSpacing: "-0.035em",
              }}
            >
              Behind Homeowners Aligned
            </h1>
            <p
              className="text-[17px] md:text-[21px] mt-4 max-w-[720px] leading-relaxed"
              style={{ color: "var(--color-ha-text-soft)" }}
            >
              Building a data pipeline to turn fragmented public HOA records into
              structured, searchable information.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/search"
                className="inline-block text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
                style={{ background: "var(--color-ha-primary)", color: "white" }}
              >
                Explore the dataset
              </Link>
              <a
                href="#architecture"
                className="inline-block text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
                style={{
                  background: "white",
                  color: "var(--color-ha-primary)",
                  border: "1px solid var(--color-ha-border-strong)",
                }}
              >
                Jump to the architecture
              </a>
              {REPO_URL && (
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
                  style={{
                    background: "white",
                    color: "var(--color-ha-text)",
                    border: "1px solid var(--color-ha-border-strong)",
                  }}
                >
                  View source on GitHub
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-[960px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
          {/* ─── CONTENTS ─── */}
          <nav
            aria-label="On this page"
            className="ha-card p-4 md:p-5 mb-12"
            style={{ boxShadow: "none" }}
          >
            <div
              className="text-[11px] font-semibold uppercase mb-3"
              style={{ color: "var(--color-ha-gray)", letterSpacing: "0.08em" }}
            >
              On this page
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 list-none p-0 m-0">
              {SECTIONS.map(({ id, label }, i) => (
                <li key={id} className="text-[13.5px]">
                  <a
                    href={`#${id}`}
                    className="hover:underline"
                    style={{ color: "var(--color-ha-text-soft)" }}
                  >
                    <span
                      className="inline-block w-6"
                      style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-gray)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-14 md:gap-18">
            {/* ─── PROBLEM ─── */}
            <Section id="problem" eyebrow="01" title="The Problem">
              <P>
                Public HOA information can be scattered across different records,
                documents, and sources, making it difficult to locate and compare.
              </P>
              <P>
                In Texas the pieces live in separate places. Each association files a
                management certificate with the Texas Real Estate Commission, and the
                state publishes a list of those filings. The useful detail (transfer
                fees, the management company, recording references) sits inside each
                filed PDF. The association&rsquo;s legal standing and its officers are in a
                different system, run by the Texas Comptroller, with no shared
                identifier linking the two.
              </P>
            </Section>

            {/* ─── SOLUTION ─── */}
            <Section id="solution" eyebrow="02" title="The Solution">
              <P>
                I developed Homeowners Aligned to demonstrate how automated data
                collection and structured processing can make this information easier
                to explore.
              </P>
              <P>
                A set of Node.js scripts downloads the state dataset, reads each filed
                certificate, extracts its contents into structured fields, matches the
                association to its Comptroller record, and loads everything into a
                Postgres database. A Next.js application then presents each association
                as a searchable profile with a score that summarizes how much public
                information is on file.
              </P>
              <div
                className="rounded-2xl p-5 mt-2"
                style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}
              >
                <h3
                  className="text-[14px] font-semibold mb-3"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                >
                  What the project covers
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
                  {[
                    "Automated collection from public sources",
                    "Extraction from unstructured PDF filings",
                    "Cleaning, validation, and normalization",
                    "Record matching across two datasets",
                    "Relational database design",
                    "A scoring method with visible inputs",
                    "A full-stack, server-rendered web application",
                    "Presenting incomplete data honestly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13.5px]" style={{ color: "var(--color-ha-text-soft)" }}>
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* ─── ARCHITECTURE ─── */}
            <Section id="architecture" eyebrow="03" title="Technical Architecture">
              <P>
                The system has two halves that only meet at the database. The pipeline
                is a set of command-line scripts that write to Postgres. The web
                application only reads from it. There is no scheduler, queue, or
                custom API between them.
              </P>

              <div className="mt-4">
                <PipelineDiagram />
              </div>

              <h3
                className="text-[17px] font-semibold mt-8"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
              >
                Technology actually used
              </h3>
              <Table
                caption="Technology used in each part of the system"
                head={["Part", "Technology"]}
                rows={STACK}
              />
            </Section>

            {/* ─── COLLECTION ─── */}
            <Section id="collection" eyebrow="04" title="Data Collection">
              <P>Three public sources feed the profiles.</P>
              <ul className="flex flex-col gap-4 list-none p-0 m-0">
                <SourceItem
                  name="HOA management certificate dataset"
                  where="Texas Open Data Portal (data.texas.gov), dataset 8auc-hzdi"
                >
                  Downloaded once as a CSV. Each row gives an association&rsquo;s name,
                  county, city, zip code, type (POA or COA), and a link to its filed
                  certificate.
                </SourceItem>
                <SourceItem
                  name="Management certificate PDFs"
                  where="One document per association, at the link in the dataset"
                >
                  Fetched one at a time with a 1.5 second pause between downloads, a
                  15 second timeout, and a User-Agent that identifies the project and
                  gives a contact address.
                </SourceItem>
                <SourceItem
                  name="Texas Comptroller Franchise Tax records"
                  where="The Comptroller's public data API"
                >
                  Queried by name, then by taxpayer number for the detail record.
                  Requests are spaced half a second apart, retried up to three times
                  with a growing delay, and paused when the API reports a rate limit.
                </SourceItem>
              </ul>
              <P>
                The run covered six Dallas-Fort Worth counties: Dallas, Collin, Tarrant,
                Ellis, Rockwall, and Kaufman. The scripts define other Texas metro areas,
                but only DFW was collected. Every step is started by hand. Nothing
                refreshes on a schedule.
              </P>

              <h3
                className="text-[17px] font-semibold mt-4"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
              >
                The DFW run in numbers
              </h3>
              <Table
                caption="Record counts from the Dallas-Fort Worth pipeline run"
                head={["Measure", "Count"]}
                rows={RUN_SUMMARY}
                numeric
              />
              <Note>
                Counts come from the pipeline&rsquo;s output files for the May 2026 run.
                The live database can differ slightly.
              </Note>
            </Section>

            {/* ─── DOCUMENTS ─── */}
            <Section id="documents" eyebrow="05" title="Document Processing">
              <P>
                The certificates are legal filings with no fixed layout, so their
                contents cannot be read with a template. Extraction runs in two paths.
              </P>
              <ol className="flex flex-col gap-4 list-none p-0 m-0">
                <Step n="1" title="Text path">
                  The PDF&rsquo;s text layer is read with pdf-parse, whitespace is
                  collapsed, and the text is capped at 8,000 words. It is sent to the
                  Claude API with a fixed system prompt that defines the exact JSON to
                  return: subdivision name, association name, management company
                  (name, address, phone, email, website), association address and
                  website, a list of transfer fees, recording data, CC&amp;R references,
                  and association type.
                </Step>
                <Step n="2" title="Scanned-document path">
                  If the text layer has fewer than 200 characters, the file is treated
                  as a scan. The whole PDF is sent to the same model as a document with
                  the same schema, so the output shape is identical either way.
                </Step>
                <Step n="3" title="Parse, record, continue">
                  The response is parsed as JSON. A record that fails at download,
                  extraction, or parsing is written to an errors file with the stage
                  and message, and the run moves on. Token counts and estimated cost
                  are saved with each record.
                </Step>
              </ol>
              <P>
                The prompt tells the model to return null for any field it cannot
                find instead of guessing. Those nulls are what the scoring step later
                counts as missing.
              </P>
            </Section>

            {/* ─── CLEANING ─── */}
            <Section id="cleaning" eyebrow="06" title="Data Cleaning and Transformation">
              <h3 className="sr-only">Normalization and validation</h3>
              <ul className="flex flex-col gap-3 list-disc pl-5 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                <li>
                  <Strong>Normalization.</Strong> Names are trimmed of stray quotes and
                  repeated spaces, counties and cities are put in title case, zip codes
                  are cut to five digits, and association type is accepted only as POA
                  or COA.
                </li>
                <li>
                  <Strong>Validation.</Strong> A record is set aside if its name is
                  missing or too short, its county or city is missing, its zip is not
                  five digits, its type is unknown, or its certificate link is not a
                  URL. Set-aside records are written to their own file with the reason.
                </li>
                <li>
                  <Strong>Matching.</Strong> To find an association in Comptroller
                  records, its name is stripped of suffixes such as Inc. and LLC,
                  parenthetical notes, and alternate names, then compared in three
                  tiers: exact match after normalization, one name containing the
                  other, and word overlap of at least 50 percent. If the legal name
                  fails, the name extracted from the certificate is tried.
                </li>
                <li>
                  <Strong>Flattening.</Strong> Each nested record (dataset row,
                  extracted fields, Comptroller data) is flattened into one HOA row plus
                  child rows for officers and fees. Re-running the load replaces an
                  HOA&rsquo;s officers and fees rather than appending to them.
                </li>
                <li>
                  <Strong>Staging.</Strong> Each phase reads one JSON file and writes
                  the next (approved, enriched, complete), so any phase can be re-run or
                  inspected on its own.
                </li>
              </ul>
            </Section>

            {/* ─── STORAGE ─── */}
            <Section id="storage" eyebrow="07" title="Data Storage">
              <P>
                All structured data lives in one Supabase Postgres database. Three
                tables hold what the site displays.
              </P>
              <Table
                caption="Database tables used by the public site"
                head={["Table", "Holds", "Relationship"]}
                rows={[
                  ["hoas", "Identity, location, management company, recording data, entity status, and retrieval timestamps", "One row per association"],
                  ["hoa_officers", "Officer name, title, and report year", "Many per HOA, deleted with it"],
                  ["hoa_fees", "Fee type and amount", "Many per HOA, deleted with it"],
                ]}
              />
              <P>
                Row-level security is enabled on all three: anyone may read, and only
                the server-side service key used by the pipeline may write. Trigram
                indexes on the name columns support substring search.
              </P>
              <P>
                The schema also contains tables for accounts, reviews, a waitlist,
                corrections, and stored score history. They were created for the
                product that was planned and are not used by the public site.
              </P>
            </Section>

            {/* ─── SCORING ─── */}
            <Section id="scoring" eyebrow="08" title="Transparency Scoring">
              <P>
                The score answers one narrow question: how much of the information a
                homeowner would want is actually on public record for this association?
                It does not measure how well an HOA is managed.
              </P>
              <P>
                It is a checklist. Each pillar has checkpoints, and a checkpoint is met
                when the matching field is present.
              </P>
              <Table
                caption="Score pillars and their public checkpoints"
                head={["Pillar", "Public checkpoints", "Planned, never collected"]}
                rows={[
                  ["Financial Health", "Transfer fees on file, CC&R instrument recorded, association or management website found", "Budget, reserve study"],
                  ["Governance & Transparency", "Board members found, entity status active, management company, registered agent, registration date, complete management contact details", "Meeting minutes"],
                  ["Legal History", "Management certificate on file, subdivision identified, CC&R recording data", "Court records"],
                  ["Resident Sentiment", "None", "Reviews, forum activity"],
                ]}
              />
              <ul className="flex flex-col gap-3 list-disc pl-5 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                <li>
                  Each pillar with at least one met checkpoint contributes its share of
                  public checkpoints, and the result is scaled to 100.
                </li>
                <li>
                  The projected score is <Strong>capped at 75</Strong>, because the
                  remaining inputs were meant to come from residents.
                </li>
                <li>
                  An association whose entity status is not ACTIVE loses <Strong>12 points</Strong>.
                </li>
                <li>
                  With fewer than <Strong>5 of the 12</Strong> public checkpoints met, no
                  score is shown at all.
                </li>
              </ul>
              <P>
                The function is about 200 lines of TypeScript with no dependencies. It
                runs when a page renders, so a card in search results and the full
                profile always agree, and the profile shows every checkpoint as met or
                missing.
              </P>
              <Note>
                Limits worth knowing: an association with no Comptroller match is
                treated the same as one that is not active, so a failed name match
                lowers its score. Presence of a field is counted, not its accuracy.
                The scores are experimental and are not official ratings.
              </Note>
            </Section>

            {/* ─── FRONTEND ─── */}
            <Section id="frontend" eyebrow="09" title="Frontend Application">
              <ul className="flex flex-col gap-3 list-disc pl-5 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                <li>
                  <Strong>Search.</Strong> A case-insensitive substring match across
                  name, city, zip, subdivision, and management company, ordered by data
                  completeness and paged 24 at a time, with a city filter. The home page
                  search box suggests matches as you type.{" "}
                  <InlineLink href="/search">Try it</InlineLink>
                </li>
                <li>
                  <Strong>Profiles.</Strong> Each association has a server-rendered page
                  showing its management company, board members, transfer fees, public
                  record identifiers, a link to the filed certificate, and the date each
                  source was retrieved.
                </li>
                <li>
                  <Strong>Score card.</Strong> An animated score ring with four
                  expandable pillars. Opening a pillar lists every checkpoint and whether
                  it was met.
                </li>
                <li>
                  <Strong>Read-only access.</Strong> Pages query the database with the
                  anonymous key and no session. There are no accounts, forms, or write
                  paths in the public site.
                </li>
                <li>
                  <Strong>Texas guide.</Strong> A long-form reference on the statutes
                  that govern Texas associations.{" "}
                  <InlineLink href="/about/tx">Read it</InlineLink>
                </li>
              </ul>
            </Section>

            {/* ─── CHALLENGES ─── */}
            <Section id="challenges" eyebrow="10" title="Engineering Challenges">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Challenge title="Most certificates are scans">
                  A text-only approach would have skipped the majority of filings. The
                  pipeline detects a missing text layer and switches to sending the
                  document itself, keeping one schema for both paths.
                </Challenge>
                <Challenge title="Truncation silently dropped fee tables">
                  An early word cap cut long certificates before their fee schedules.
                  A separate script finds only the text-path records with no fees,
                  re-extracts them with a higher cap, and updates them in place without
                  touching the rest of the file.
                </Challenge>
                <Challenge title="Long jobs that must survive interruption">
                  Thousands of sequential downloads and API calls will be interrupted.
                  Every phase saves after each record and skips names already processed
                  on restart, so a failed run resumes instead of starting over.
                </Challenge>
                <Challenge title="Two datasets with no shared key">
                  The certificate dataset and Comptroller records share nothing but a
                  name, written differently in each. Matching runs in tiers from strict
                  to loose, and a search too generic for the API to answer is recorded as
                  such rather than forced.
                </Challenge>
                <Challenge title="Inconsistent records across counties">
                  For the address-matching branch, each appraisal district writes legal
                  descriptions differently. Four parsers handle the formats, matching is
                  limited to the same city or zip, and a subdivision that matches more
                  than one HOA is left unassigned.
                </Challenge>
                <Challenge title="Missing information">
                  About one in five associations had no Comptroller match, and many
                  certificates omit fields. Missing values are stored as null, shown as
                  open checkpoints, and below a minimum the score is withheld.
                </Challenge>
                <Challenge title="Duplicate detection">
                  Duplicates are detected by exact legal name only, both when resuming
                  and when loading. Two filings for one association under slightly
                  different names would become two profiles.
                </Challenge>
                <Challenge title="Being a polite client">
                  Requests to public servers are spaced out, time out, retry with
                  backoff, and identify the project with a contact address.
                </Challenge>
              </div>
            </Section>

            {/* ─── LIMITATIONS ─── */}
            <Section id="limitations" eyebrow="11" title="Known Limitations">
              <ul className="flex flex-col gap-3 list-disc pl-5 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                <li>The data is a snapshot from May 2026 and is not refreshed.</li>
                <li>
                  Extraction by a language model was not checked against a hand-labeled
                  sample, so its error rate is unknown. Fee names and amounts are the
                  most likely to be wrong.
                </li>
                <li>Name matching can attach the wrong Comptroller entity to an HOA.</li>
                <li>The pipeline has no automated tests and no scheduler.</li>
                <li>
                  Scores are computed on demand and not stored, so there is no score
                  history.
                </li>
                <li>
                  The data-completeness percentage used to order results is a stored
                  column. The step that calculated it is not part of this repository.
                </li>
                <li>
                  Reviews, the forum, the resident dashboard, and paid reports were
                  designed but never built. Address matching was built for one county
                  and is not connected to the site.
                </li>
                <li>
                  Profiles are excluded from search engines because they name
                  individual officers and will go out of date.
                </li>
              </ul>
            </Section>

            {/* ─── LEARNED ─── */}
            <Section id="learned" eyebrow="12" title="What I Learned">
              <ul className="flex flex-col gap-3 list-disc pl-5 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                <li>
                  <Strong>Checkpoint everything.</Strong> Saving after each record cost
                  almost nothing and turned every failure into a resume.
                </li>
                <li>
                  <Strong>Keep the intermediate files.</Strong> Plain JSON between
                  phases made it possible to fix one phase and re-run only what
                  depended on it.
                </li>
                <li>
                  <Strong>A model needs a contract.</Strong> A fixed schema, explicit
                  nulls, and an errors file made language-model output usable as data.
                  The truncation problem showed that a quiet failure is worse than a
                  loud one.
                </li>
                <li>
                  <Strong>Matching is the weakest link.</Strong> Without a shared key,
                  every match is a guess with a confidence level, and the honest move is
                  to leave ambiguous cases unassigned.
                </li>
                <li>
                  <Strong>A score needs a definition and a way to say &ldquo;not enough
                  data.&rdquo;</Strong> Showing each checkpoint made the number
                  explainable.
                </li>
                <li>
                  <Strong>What I would do next.</Strong> Add tests around extraction and
                  matching, validate extraction against a labeled sample, use a stable
                  key for deduplication, store score history, and run the pipeline on a
                  schedule.
                </li>
              </ul>

              <div
                className="rounded-2xl p-5 mt-4"
                style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}
              >
                <h3
                  className="text-[14px] font-semibold mb-2"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                >
                  AI-assisted development
                </h3>
                <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                  Claude Code, an AI coding assistant, was used throughout development
                  of both the pipeline and the web application. The pipeline also calls
                  the Claude API at run time to extract fields from certificates.
                </p>
              </div>
            </Section>

            {/* ─── CTA ─── */}
            <section
              className="rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--color-ha-deep) 0%, var(--color-ha-primary) 100%)",
              }}
            >
              <div className="relative max-w-[560px]">
                <h2
                  className="text-[24px] md:text-[32px] font-semibold tracking-tight leading-[1.1]"
                  style={{ fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}
                >
                  See the result
                </h2>
                <p className="text-[15px] md:text-[16px] opacity-85 mt-3 mb-6 leading-relaxed">
                  Search the records the pipeline produced, or open a profile to see
                  the score card and its sources.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                    style={{ background: "white", color: "var(--color-ha-deep)" }}
                  >
                    Search HOAs
                  </Link>
                  <Link
                    href="/search"
                    className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                    style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                  >
                    Browse all records
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Page building blocks
   ═══════════════════════════════════════════════════ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
      style={{ background: "var(--color-ha-primary)", color: "white" }}
    >
      {children}
    </span>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-title`}>
      <div className="flex items-baseline gap-3 mb-4">
        <span
          aria-hidden="true"
          className="text-[13px] font-bold"
          style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-light)" }}
        >
          {eyebrow}
        </span>
        <h2
          id={`${id}-title`}
          className="text-[26px] md:text-[32px] font-semibold leading-[1.15]"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] md:text-[16px] leading-relaxed max-w-[760px]" style={{ color: "var(--color-ha-text-soft)" }}>
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--color-ha-text)", fontWeight: 600 }}>{children}</strong>;
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
      {children}
      {" →"}
    </Link>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[13px] leading-relaxed p-4 rounded-xl max-w-[760px]"
      style={{ border: "1px solid var(--color-ha-border-strong)", color: "var(--color-ha-text-soft)" }}
    >
      {children}
    </p>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SourceItem({
  name,
  where,
  children,
}: {
  name: string;
  where: string;
  children: React.ReactNode;
}) {
  return (
    <li className="ha-card p-4 md:p-5" style={{ boxShadow: "none" }}>
      <div className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}>
        {name}
      </div>
      <div className="text-[12px] mt-0.5" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-deep)" }}>
        {where}
      </div>
      <p className="text-[13.5px] leading-relaxed mt-2" style={{ color: "var(--color-ha-text-soft)" }}>
        {children}
      </p>
    </li>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="ha-card p-4 md:p-5 flex gap-4" style={{ boxShadow: "none" }}>
      <div
        aria-hidden="true"
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold"
        style={{ background: "var(--color-ha-primary)", color: "white", fontFamily: "var(--font-space)" }}
      >
        {n}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold mb-1" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}>
          {title}
        </h3>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          {children}
        </p>
      </div>
    </li>
  );
}

function Challenge({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ha-card p-5 flex flex-col gap-2" style={{ boxShadow: "none" }}>
      <h3 className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}>
        {title}
      </h3>
      <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
        {children}
      </p>
    </div>
  );
}

function Table({
  caption,
  head,
  rows,
  numeric = false,
}: {
  caption: string;
  head: string[];
  rows: string[][];
  numeric?: boolean;
}) {
  return (
    <div className="ha-card overflow-x-auto" style={{ boxShadow: "none" }}>
      <table className="w-full text-[13.5px] border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr style={{ background: "var(--color-ha-surface)" }}>
            {head.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`py-2.5 px-4 font-semibold ${numeric && i === head.length - 1 ? "text-right" : "text-left"}`}
                style={{ color: "var(--color-ha-text)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} style={{ borderTop: "1px solid var(--color-ha-border)" }}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="py-2.5 px-4 text-left font-semibold align-top"
                    style={{ color: "var(--color-ha-text)" }}
                  >
                    {cell}
                  </th>
                ) : (
                  <td
                    key={i}
                    className={`py-2.5 px-4 align-top ${numeric && i === row.length - 1 ? "text-right whitespace-nowrap" : ""}`}
                    style={{
                      color: "var(--color-ha-text-soft)",
                      fontFamily: numeric && i === row.length - 1 ? "var(--font-space)" : undefined,
                    }}
                  >
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
