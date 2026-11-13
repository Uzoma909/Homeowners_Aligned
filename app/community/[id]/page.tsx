import { createPublicClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { Card } from "@/components/ui";
import { MapPinIcon, DocumentIcon, ShieldIcon } from "@/components/icons/hoa-icons";
import { ProfileSidebar } from "./ProfileSidebar";
import { HealthScoreCard } from "./HealthScoreCard";
import { EntityWarning } from "./EntityWarning";
import { calculateProjectedScore } from "@/lib/scoring";
import {
  buildScoringInput,
  formatDate,
  FEE_COLUMNS,
  HOA_PROFILE_COLUMNS,
  OFFICER_COLUMNS,
} from "@/lib/hoa";
import type { HOA, HOAFee, HOAOfficer } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Extracted website values are free text. Only link to them when they are plain http(s) URLs. */
function toExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  // Profiles hold a snapshot of public records and name individual officers,
  // so they are kept out of search indexes. See /project for the reasoning.
  const robots = { index: false, follow: true };

  if (!UUID_PATTERN.test(id)) return { title: "Community Not Found", robots };

  const supabase = createPublicClient();
  const { data: hoa } = await supabase
    .from("hoas")
    .select("legal_name, city, county")
    .eq("id", id)
    .maybeSingle();

  if (!hoa) return { title: "Community Not Found", robots };

  return {
    title: `${hoa.legal_name} (${hoa.city}, TX)`,
    description: `Public records snapshot for ${hoa.legal_name} in ${hoa.county} County, Texas: projected transparency score, board members, transfer fees, and filings. Portfolio demonstration, not an official source.`,
    robots,
  };
}

export default async function CommunityProfilePage({ params }: PageProps) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const supabase = createPublicClient();

  // Fetch HOA + officers + fees in parallel
  const [hoaRes, officersRes, feesRes] = await Promise.all([
    supabase.from("hoas").select(HOA_PROFILE_COLUMNS).eq("id", id).maybeSingle(),
    supabase
      .from("hoa_officers")
      .select(OFFICER_COLUMNS)
      .eq("hoa_id", id)
      .order("active_year", { ascending: false }),
    supabase.from("hoa_fees").select(FEE_COLUMNS).eq("hoa_id", id),
  ]);

  if (hoaRes.error) {
    // Logged server-side only. The visitor gets the standard not-found page.
    console.error("[profile] HOA query failed:", hoaRes.error.message);
  }
  const hoa = hoaRes.data as unknown as HOA | null;
  if (!hoa) notFound();

  const officers = (officersRes.data as unknown as HOAOfficer[] | null) || [];
  const fees = (feesRes.data as unknown as HOAFee[] | null) || [];
  const name: string = hoa.display_name || hoa.legal_name;

  const scoring = calculateProjectedScore(
    buildScoringInput(hoa, { officers: officers.length, fees: fees.length })
  );

  const mgmtWebsite = toExternalUrl(hoa.mgmt_company_website);
  const associationWebsite = toExternalUrl(hoa.association_website);
  const certificateUrl = toExternalUrl(hoa.certificate_url);
  const registrationDate = formatDate(hoa.sos_effective_date) || hoa.sos_effective_date || null;
  const registrationYear = hoa.sos_effective_date
    ? new Date(hoa.sos_effective_date).getUTCFullYear()
    : NaN;
  const certificateRetrieved = formatDate(hoa.scraped_at);
  const comptrollerRetrieved = hoa.entity_status || officers.length > 0
    ? formatDate(hoa.comptroller_processed_at)
    : null;

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Breadcrumb */}
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 pt-4 pb-0">
        <nav
          aria-label="Breadcrumb"
          className="text-xs flex items-center gap-1 flex-wrap"
          style={{ color: "var(--color-ha-gray)" }}
        >
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/about/tx" className="hover:underline">Texas</Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/search?county=${encodeURIComponent(hoa.county || "")}`}
            className="hover:underline"
          >
            {hoa.county}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" style={{ color: "var(--color-ha-text)" }}>{name}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-[1180px] mx-auto px-4 md:px-6 pt-5 pb-6 md:pb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-ha-surface)",
              color: "var(--color-ha-deep)",
              border: "1px solid var(--color-ha-border-strong)",
            }}
          >
            Public records snapshot
          </span>
          {hoa.entity_status && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: hoa.entity_status === "ACTIVE" ? "#047857" : "#b91c1c",
                color: "white",
              }}
            >
              <span className="sr-only">Entity status: </span>
              {hoa.entity_status}
            </span>
          )}
        </div>

        <h1
          className="text-[28px] md:text-[40px] font-semibold leading-tight"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.025em",
          }}
        >
          {name}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[13.5px]" style={{ color: "var(--color-ha-text-soft)" }}>
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon size={14} />
            {hoa.city}, TX · {hoa.county} County
          </span>
          {hoa.mgmt_company_name && (
            <>
              <span className="hidden md:inline" aria-hidden="true">·</span>
              <span>
                Managed by{" "}
                <strong style={{ color: "var(--color-ha-text)", fontWeight: 600 }}>
                  {hoa.mgmt_company_name}
                </strong>
              </span>
            </>
          )}
          {hoa.association_type && (
            <>
              <span className="hidden md:inline" aria-hidden="true">·</span>
              <span>{hoa.association_type}</span>
            </>
          )}
          {Number.isFinite(registrationYear) && (
            <>
              <span className="hidden md:inline" aria-hidden="true">·</span>
              <span>
                Registered{" "}
                <span style={{ fontFamily: "var(--font-space)" }}>{registrationYear}</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Entity status warning */}
      {hoa.entity_status && hoa.entity_status !== "ACTIVE" && (
        <EntityWarning entityStatus={hoa.entity_status} />
      )}

      {/* Main grid */}
      <main id="main-content" className="max-w-[1180px] mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Left column — main content */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* Health Score Card */}
            <HealthScoreCard scoring={scoring} />

            {/* Management Company */}
            {hoa.mgmt_company_name && (
              <Card>
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
                >
                  Management company
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5" style={{ color: "var(--color-ha-primary)" }}>
                      <ShieldIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold" style={{ color: "var(--color-ha-text)" }}>
                        {hoa.mgmt_company_name}
                      </div>
                      {hoa.mgmt_company_address && (
                        <div className="text-xs mt-1" style={{ color: "var(--color-ha-gray)" }}>
                          {hoa.mgmt_company_address}
                        </div>
                      )}
                    </div>
                  </div>
                  {(hoa.mgmt_company_phone || hoa.mgmt_company_email || mgmtWebsite) && (
                    <div className="flex flex-wrap gap-4 text-[13px] pt-2" style={{ borderTop: "1px solid var(--color-ha-border)" }}>
                      {hoa.mgmt_company_phone && (
                        <a href={`tel:${hoa.mgmt_company_phone}`} className="hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                          {hoa.mgmt_company_phone}
                        </a>
                      )}
                      {hoa.mgmt_company_email && (
                        <a href={`mailto:${hoa.mgmt_company_email}`} className="hover:underline break-all" style={{ color: "var(--color-ha-primary)" }}>
                          {hoa.mgmt_company_email}
                        </a>
                      )}
                      {mgmtWebsite && (
                        <a href={mgmtWebsite} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <SourceNote>
                  Source: management certificate filed with the Texas Real Estate Commission
                </SourceNote>
              </Card>
            )}

            {/* Board Members / Officers */}
            {officers.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
                  >
                    Board members
                  </h2>
                  <span className="text-xs" style={{ color: "var(--color-ha-gray)" }}>
                    {officers.length} listed
                  </span>
                </div>
                <ul className="flex flex-col">
                  {officers.map((officer, i) => (
                    <li
                      key={officer.id}
                      className="flex items-center justify-between py-3 gap-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          aria-hidden="true"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{
                            background: "var(--color-ha-surface)",
                            color: "var(--color-ha-primary)",
                          }}
                        >
                          {officer.name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14px] font-semibold" style={{ color: "var(--color-ha-text)" }}>
                            {officer.name}
                          </div>
                          {officer.title && (
                            <div className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
                              {officer.title}
                            </div>
                          )}
                        </div>
                      </div>
                      {officer.active_year && (
                        <span
                          className="text-[12px] font-bold shrink-0"
                          style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-gray)" }}
                        >
                          <span className="sr-only">Report year </span>
                          {officer.active_year}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <SourceNote>
                  Source: Texas Comptroller franchise tax records, as reported for the year shown.
                  Officers may have changed since.
                </SourceNote>
              </Card>
            )}

            {/* Transfer Fees */}
            {fees.length > 0 && (
              <Card>
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
                >
                  Transfer fees
                </h2>
                <ul className="flex flex-col">
                  {fees.map((fee, i) => (
                    <li
                      key={fee.id}
                      className="flex items-center justify-between py-3 gap-4"
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}
                    >
                      <span className="text-[14px]" style={{ color: "var(--color-ha-text)" }}>
                        {fee.fee_type}
                      </span>
                      <span
                        className="text-[15px] font-bold shrink-0"
                        style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}
                      >
                        {fee.amount != null ? `$${Number(fee.amount).toLocaleString()}` : "Not stated"}
                      </span>
                    </li>
                  ))}
                </ul>
                <SourceNote>
                  Source: management certificate. Fee names and amounts were extracted from the
                  filed PDF by a language model and can contain errors.
                </SourceNote>
              </Card>
            )}

            {/* Public Records */}
            <Card>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
              >
                Public records
              </h2>
              <dl className="flex flex-col gap-3">
                {[
                  { label: "Entity status", value: hoa.entity_status || "No Comptroller match" },
                  { label: "SOS file number", value: hoa.sos_file_number },
                  { label: "Comptroller taxpayer number", value: hoa.taxpayer_id },
                  { label: "SOS registration date", value: registrationDate },
                  { label: "Registered agent", value: hoa.registered_agent_name },
                  { label: "Subdivision", value: hoa.subdivision_name },
                  { label: "Recording instrument", value: hoa.recording_instrument_number },
                ].filter((item) => item.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-baseline gap-4">
                    <dt className="text-[13px] shrink-0" style={{ color: "var(--color-ha-gray)" }}>{label}</dt>
                    <dd
                      className="text-[13px] font-semibold text-right break-words min-w-0"
                      style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-2 mt-4">
                {certificateUrl && (
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold"
                    style={{ color: "var(--color-ha-primary)" }}
                  >
                    <DocumentIcon size={14} />
                    View management certificate (PDF)
                  </a>
                )}
                {associationWebsite && (
                  <a
                    href={associationWebsite}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold"
                    style={{ color: "var(--color-ha-primary)" }}
                  >
                    <DocumentIcon size={14} />
                    Association website
                  </a>
                )}
              </div>
            </Card>

            {/* Not collected */}
            <Card>
              <h2
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
              >
                What this profile does not include
              </h2>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                Budgets, reserve studies, meeting minutes, court records, monthly
                assessment amounts, and resident reviews are not part of this
                dataset. They appear as open checkpoints in the score above. The
                project planned to collect them from residents, and that part was
                never built.{" "}
                <Link
                  href="/project#limitations"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  Known limitations
                </Link>
              </p>
            </Card>
          </div>

          {/* Right column — sources and score explanation */}
          <ProfileSidebar
            certificateRetrieved={certificateRetrieved}
            comptrollerRetrieved={comptrollerRetrieved}
            certificateUrl={certificateUrl}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] mt-3 pt-3 leading-relaxed"
      style={{ borderTop: "1px solid var(--color-ha-border)", color: "var(--color-ha-gray)" }}
    >
      {children}
    </div>
  );
}
