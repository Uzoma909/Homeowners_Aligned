/**
 * Architecture diagram for the /project case study.
 *
 * Built from plain HTML and CSS rather than an image so it reflows on small
 * screens, stays readable by screen readers, and is edited by changing the
 * STAGES data below. Every box maps to something that exists in the code:
 * the scripts in /pipeline, the tables in the SQL files, lib/scoring.ts, and
 * the pages in /app.
 */

type Kind = "source" | "processing" | "storage" | "scoring" | "presentation";

interface DiagramNode {
  name: string;
  /** Technology or file actually used for this step. */
  tech: string;
  detail: string;
  /** What this step writes, when it is worth showing. */
  output?: string;
}

interface Stage {
  kind: Kind;
  title: string;
  subtitle?: string;
  /** Sequential stages draw arrows between their nodes. */
  sequential?: boolean;
  nodes: DiagramNode[];
  /** Label on the arrow leading to the next stage. */
  handoff?: string;
}

const KIND_STYLE: Record<Kind, { label: string; accent: string; tint: string; border: string }> = {
  source: { label: "Data sources", accent: "#334155", tint: "#f1f5f9", border: "#cbd5e1" },
  processing: { label: "Processing", accent: "#6d28d9", tint: "#f5f3ff", border: "#d6cdf2" },
  storage: { label: "Storage", accent: "#047857", tint: "#ecfdf5", border: "#a7f3d0" },
  scoring: { label: "Scoring", accent: "#b45309", tint: "#fffbeb", border: "#fde68a" },
  presentation: { label: "Presentation", accent: "#1d4ed8", tint: "#eff6ff", border: "#bfdbfe" },
};

const STAGES: Stage[] = [
  {
    kind: "source",
    title: "Public records",
    subtitle: "Texas state sources",
    nodes: [
      {
        name: "HOA management certificate dataset",
        tech: "data.texas.gov, bulk CSV",
        detail: "One row per association: name, county, city, zip, type, and a link to its filed certificate.",
      },
      {
        name: "Management certificate PDFs",
        tech: "One filed PDF per HOA",
        detail: "Transfer fees, management company, recording data, and CC&R references. Many are scans.",
      },
      {
        name: "Texas Comptroller",
        tech: "Franchise Tax public API",
        detail: "Entity status, registered agent, registration date, and officers.",
      },
    ],
    handoff: "Fetched by scripts run by hand from the command line",
  },
  {
    kind: "processing",
    title: "Pipeline",
    subtitle: "Node.js scripts, JSON files between steps",
    sequential: true,
    nodes: [
      {
        name: "Phase A: parse and validate",
        tech: "csv-parse",
        detail: "Normalizes names, cities, zips, and types. Records that fail validation are set aside.",
        output: "hoas_approved, hoas_flagged",
      },
      {
        name: "Phase B: document extraction",
        tech: "pdf-parse, Claude API",
        detail: "Reads each PDF's text and asks the model for structured JSON. Scanned PDFs are sent whole.",
        output: "hoas_enriched, hoas_errors",
      },
      {
        name: "Phase C: entity matching",
        tech: "Comptroller API, JavaScript",
        detail: "Finds the HOA's state entity by name, then merges its status and officers.",
        output: "hoas_complete",
      },
      {
        name: "Seed: load",
        tech: "Supabase REST API",
        detail: "Flattens each record into rows and upserts in batches, keyed on legal name.",
      },
    ],
    handoff: "Rows written with a server-side service key",
  },
  {
    kind: "storage",
    title: "Structured database",
    subtitle: "Supabase (Postgres)",
    nodes: [
      {
        name: "hoas",
        tech: "One row per association",
        detail: "Identity, management company, recording data, entity status, and retrieval timestamps.",
      },
      {
        name: "hoa_officers",
        tech: "Many per HOA",
        detail: "Name, title, and report year for each officer on the Comptroller record.",
      },
      {
        name: "hoa_fees",
        tech: "Many per HOA",
        detail: "Fee type and amount for each transfer fee found in the certificate.",
      },
    ],
    handoff: "Read anonymously, limited by row-level security",
  },
  {
    kind: "scoring",
    title: "Transparency scoring",
    subtitle: "Calculated when a page renders, not stored",
    nodes: [
      {
        name: "calculateProjectedScore",
        tech: "TypeScript, lib/scoring.ts",
        detail:
          "Checks 12 public checkpoints across financial, governance, and legal pillars. Capped at 75, minus 12 if the entity is not active, unscored below 5 checkpoints.",
      },
    ],
    handoff: "Score and its inputs passed to the interface",
  },
  {
    kind: "presentation",
    title: "Searchable application",
    subtitle: "Next.js 16, React 19, Tailwind CSS 4",
    nodes: [
      {
        name: "Search",
        tech: "Substring match in Postgres",
        detail: "By name, city, zip, subdivision, or management company, with a typeahead and a city filter.",
      },
      {
        name: "HOA profile",
        tech: "Server-rendered page",
        detail: "Management company, board members, transfer fees, public records, and source dates.",
      },
      {
        name: "Score card",
        tech: "React component",
        detail: "The projected score with every checkpoint shown as met or missing.",
      },
    ],
  },
];

function Arrow({ label, direction }: { label?: string; direction: "down" | "auto" }) {
  // "auto" points right on wide screens (nodes sit in a row) and down on small ones.
  return (
    <div
      className={
        direction === "down"
          ? "flex flex-col items-center gap-1 py-2"
          : "flex md:flex-col items-center justify-center gap-1 py-1 md:py-0 md:px-1 shrink-0"
      }
    >
      <span className="sr-only">{label ? `Then: ${label}.` : "Then"}</span>
      {direction === "down" ? (
        <svg aria-hidden="true" width={18} height={26} viewBox="0 0 18 26" fill="none" stroke="var(--color-ha-gray)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 1v22M3 17l6 7 6-7" />
        </svg>
      ) : (
        <>
          <svg aria-hidden="true" className="md:hidden" width={16} height={20} viewBox="0 0 16 20" fill="none" stroke="var(--color-ha-gray)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 1v16M3 12l5 6 5-6" />
          </svg>
          <svg aria-hidden="true" className="hidden md:block" width={20} height={16} viewBox="0 0 20 16" fill="none" stroke="var(--color-ha-gray)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 8h16M12 3l6 5-6 5" />
          </svg>
        </>
      )}
      {label && direction === "down" && (
        <span
          aria-hidden="true"
          className="text-[11px] text-center px-2"
          style={{ color: "var(--color-ha-gray)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function NodeCard({ node, kind }: { node: DiagramNode; kind: Kind }) {
  const style = KIND_STYLE[kind];
  return (
    <div
      className="flex-1 min-w-0 rounded-xl p-3.5 flex flex-col gap-1.5"
      style={{ background: "white", border: `1px solid ${style.border}` }}
    >
      <div
        className="text-[13.5px] font-semibold leading-snug"
        style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
      >
        {node.name}
      </div>
      <div
        className="text-[10.5px] font-bold self-start px-1.5 py-0.5 rounded"
        style={{ fontFamily: "var(--font-space)", background: style.tint, color: style.accent }}
      >
        {node.tech}
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
        {node.detail}
      </p>
      {node.output && (
        <p className="text-[11px] mt-auto pt-1" style={{ color: "var(--color-ha-gray)" }}>
          <span className="font-semibold">Writes:</span>{" "}
          <span style={{ fontFamily: "var(--font-space)" }}>{node.output}</span>
        </p>
      )}
    </div>
  );
}

export function PipelineDiagram() {
  return (
    <figure className="m-0" aria-labelledby="pipeline-diagram-caption">
      {/* Legend */}
      <ul className="flex flex-wrap gap-2 mb-5 list-none p-0" aria-label="Diagram legend">
        {(Object.keys(KIND_STYLE) as Kind[]).map((kind) => (
          <li
            key={kind}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: KIND_STYLE[kind].tint,
              color: KIND_STYLE[kind].accent,
              border: `1px solid ${KIND_STYLE[kind].border}`,
            }}
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full"
              style={{ background: KIND_STYLE[kind].accent }}
            />
            {KIND_STYLE[kind].label}
          </li>
        ))}
      </ul>

      <ol className="list-none p-0 m-0 flex flex-col">
        {STAGES.map((stage, index) => {
          const style = KIND_STYLE[stage.kind];
          return (
            <li key={stage.title} className="flex flex-col">
              <section
                aria-label={`${style.label}: ${stage.title}`}
                className="rounded-2xl p-4 md:p-5"
                style={{ background: style.tint, border: `1px solid ${style.border}` }}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                  <span
                    className="text-[10.5px] font-bold uppercase"
                    style={{ color: style.accent, letterSpacing: "0.08em" }}
                  >
                    {index + 1}. {style.label}
                  </span>
                  <h3
                    className="text-[16px] font-semibold"
                    style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                  >
                    {stage.title}
                  </h3>
                  {stage.subtitle && (
                    <span className="text-[12px]" style={{ color: "var(--color-ha-text-soft)" }}>
                      {stage.subtitle}
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-2">
                  {stage.nodes.map((node, nodeIndex) => (
                    <div key={node.name} className="contents">
                      {stage.sequential && nodeIndex > 0 && <Arrow direction="auto" />}
                      <NodeCard node={node} kind={stage.kind} />
                    </div>
                  ))}
                </div>
              </section>

              {index < STAGES.length - 1 && <Arrow direction="down" label={stage.handoff} />}
            </li>
          );
        })}
      </ol>

      {/* Side branch that exists in the code but is not connected to the app */}
      <div
        className="mt-5 rounded-2xl p-4 md:p-5"
        style={{ border: "1.5px dashed var(--color-ha-border-strong)", background: "white" }}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <span
            className="text-[10.5px] font-bold uppercase"
            style={{ color: "var(--color-ha-gray)", letterSpacing: "0.08em" }}
          >
            Side branch · Partly built
          </span>
          <h3
            className="text-[15px] font-semibold"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
          >
            Phase E: address-to-HOA matching
          </h3>
        </div>
        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
          County appraisal parcel files (a Dallas CSV and TxGIO shapefiles, read with the{" "}
          <span style={{ fontFamily: "var(--font-space)" }}>shapefile</span> library) are reduced to
          unique subdivisions and matched to HOAs by normalized name within the same city or zip.
          Results load into <span style={{ fontFamily: "var(--font-space)" }}>subdivision_mappings</span>{" "}
          and <span style={{ fontFamily: "var(--font-space)" }}>hoa_zip_codes</span>. It was run for
          Dallas County only, and the web application does not read these tables.
        </p>
      </div>

      <figcaption
        id="pipeline-diagram-caption"
        className="text-[12px] mt-4 leading-relaxed"
        style={{ color: "var(--color-ha-gray)" }}
      >
        Architecture of Homeowners Aligned. Three Texas public sources feed a four-step Node.js
        pipeline that writes JSON files between steps and loads the result into a Supabase Postgres
        database. The Next.js application reads that database anonymously, calculates each
        HOA&rsquo;s projected score when the page renders, and presents search, profiles, and score
        cards. Nothing runs on a schedule: every pipeline step is started by hand.
      </figcaption>
    </figure>
  );
}
