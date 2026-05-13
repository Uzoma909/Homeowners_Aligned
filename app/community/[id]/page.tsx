import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { NavBar, Footer } from "@/components/layout";
import { ScoreBadge, DimensionBar, Card, VerifiedBadge, UnclaimedBadge } from "@/components/ui";
import { MapPinIcon, CalendarIcon, TeamIcon, DocumentIcon, MoneyIcon, ShieldIcon, TriangleAlertAmberIcon } from "@/components/icons/hoa-icons";
import { ProfileSidebar } from "./ProfileSidebar";
import { HealthScoreCard } from "./HealthScoreCard";
import { AssessmentCard } from "./AssessmentCard";
import { EntityWarning } from "./EntityWarning";
import { calculateProjectedScore } from "@/lib/scoring";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: hoa } = await supabase.from("hoas").select("legal_name, city, county").eq("id", id).single();

  if (!hoa) return { title: "Community Not Found" };

  return {
    title: `${hoa.legal_name} | ${hoa.city}, TX`,
    description: `View the Health Score, board members, fees, and public records for ${hoa.legal_name} in ${hoa.county}, Texas.`,
  };
}

export default async function CommunityProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch HOA + officers + fees in parallel
  const [hoaRes, officersRes, feesRes] = await Promise.all([
    supabase.from("hoas").select("*").eq("id", id).single(),
    supabase.from("hoa_officers").select("*").eq("hoa_id", id).order("active_year", { ascending: false }),
    supabase.from("hoa_fees").select("*").eq("hoa_id", id),
  ]);

  const hoa = hoaRes.data;
  if (!hoa) notFound();

  const officers = officersRes.data || [];
  const fees = feesRes.data || [];
  const name = hoa.display_name || hoa.legal_name;
  const isClaimed = hoa.claimed || false;
  const completeness = hoa.data_completeness_percent || 0;

  const scoring = calculateProjectedScore({
    hasFees: fees.length > 0,
    hasCcrInstruments: !!hoa.recording_instrument_number,
    hasAssociationWebsite: !!hoa.mgmt_company_website || !!hoa.association_website,
    hasOfficers: officers.length > 0,
    officerCount: officers.length,
    entityStatusActive: hoa.entity_status === "ACTIVE",
    hasManagement: !!hoa.mgmt_company_name,
    hasRegisteredAgent: !!hoa.registered_agent_name,
    hasFormationDate: !!hoa.sos_effective_date,
    managementContactComplete:
      !!hoa.mgmt_company_phone &&
      !!hoa.mgmt_company_email &&
      !!hoa.mgmt_company_website,
    hasCertificate: !!hoa.certificate_url,
    hasSubdivision: !!hoa.subdivision_name,
    hasCcrRecording: !!hoa.recording_instrument_number,
    reviewCount: 0,
    hasForumActivity: false,
  });

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Breadcrumb */}
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 pt-4 pb-0">
        <nav className="text-xs flex items-center gap-1 flex-wrap" style={{ color: "var(--color-ha-gray)" }}>
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <a href="/about/texas" className="hover:underline">Texas</a>
          <span>/</span>
          <span>{hoa.county}</span>
          <span>/</span>
          <span style={{ color: "var(--color-ha-text)" }}>{name}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-[1180px] mx-auto px-4 md:px-6 pt-5 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {isClaimed ? <VerifiedBadge /> : <UnclaimedBadge />}
              {hoa.entity_status && (
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: hoa.entity_status === "ACTIVE" ? "#059669" : "#dc2626",
                    color: "white",
                  }}
                >
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
                {hoa.city}, TX · {hoa.county}
              </span>
              {hoa.management_company_name && (
                <>
                  <span className="hidden md:inline">·</span>
                  <span>
                    Managed by{" "}
                    <strong style={{ color: "var(--color-ha-text)", fontWeight: 600 }}>
                      {hoa.management_company_name}
                    </strong>
                  </span>
                </>
              )}
              {hoa.association_type && (
                <>
                  <span className="hidden md:inline">·</span>
                  <span>{hoa.association_type}</span>
                </>
              )}
              {hoa.formation_date && (
                <>
                  <span className="hidden md:inline">·</span>
                  <span>
                    Est.{" "}
                    <span style={{ fontFamily: "var(--font-space)" }}>
                      {new Date(hoa.formation_date).getFullYear()}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              className="text-[13px] font-semibold px-4 py-2.5 rounded-[10px] cursor-pointer"
              style={{ background: "white", border: "1px solid var(--color-ha-border)", color: "var(--color-ha-text)" }}
            >
              Save
            </button>
            <button
              className="text-[13px] font-semibold px-4 py-2.5 rounded-[10px] cursor-pointer"
              style={{ background: "white", border: "1px solid var(--color-ha-border)", color: "var(--color-ha-text)" }}
            >
              Share
            </button>
            <button
              className="text-[13px] font-semibold px-4 py-2.5 rounded-[10px] cursor-pointer"
              style={{ background: "var(--color-ha-primary)", border: "none", color: "white" }}
            >
              I live here
            </button>
          </div>
        </div>
      </header>

      {/* Entity status warning */}
      {hoa.entity_status && hoa.entity_status !== "ACTIVE" && (
        <EntityWarning entityStatus={hoa.entity_status} />
      )}

      {/* Main grid */}
      <main className="max-w-[1180px] mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Left column — main content */}
          <div className="flex flex-col gap-5">

            {/* Health Score Card */}
            <HealthScoreCard scoring={scoring} />

            {/* Monthly Assessment */}
            <AssessmentCard
              assessment={null}
              trend={null}
              changePercent={null}
              avgComparison={null}
            />

            {/* Management Company */}
            {hoa.management_company_name && (
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
                    <div>
                      <div className="text-[15px] font-semibold" style={{ color: "var(--color-ha-text)" }}>
                        {hoa.management_company_name}
                      </div>
                      {hoa.management_company_address && (
                        <div className="text-xs mt-1" style={{ color: "var(--color-ha-gray)" }}>
                          {hoa.management_company_address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[13px] pt-2" style={{ borderTop: "1px solid var(--color-ha-border)" }}>
                    {hoa.management_company_phone && (
                      <a href={`tel:${hoa.management_company_phone}`} className="hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                        {hoa.management_company_phone}
                      </a>
                    )}
                    {hoa.management_company_email && (
                      <a href={`mailto:${hoa.management_company_email}`} className="hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                        {hoa.management_company_email}
                      </a>
                    )}
                    {hoa.management_company_website && (
                      <a href={hoa.management_company_website} target="_blank" rel="noopener" className="hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Board Members / Officers */}
            {officers.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
                  >
                    Board members
                  </h2>
                  <span className="text-xs" style={{ color: "var(--color-ha-gray)" }}>
                    Source: Texas Comptroller
                  </span>
                </div>
                <div className="flex flex-col">
                  {officers.slice(0, 3).map((officer, i) => (
                    <div
                      key={officer.id}
                      className="flex items-center justify-between py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{
                            background: "var(--color-ha-surface)",
                            color: "var(--color-ha-primary)",
                          }}
                        >
                          {officer.name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div>
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
                          className="text-[12px] font-bold"
                          style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-gray)" }}
                        >
                          {officer.active_year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {officers.length > 3 && (
                  <div
                    className="mt-3 pt-3 text-center"
                    style={{ borderTop: "1px solid var(--color-ha-border)" }}
                  >
                    <p className="text-[13px] mb-2" style={{ color: "var(--color-ha-gray)" }}>
                      +{officers.length - 3} more board member{officers.length - 3 > 1 ? "s" : ""}
                    </p>
                    <button
                      className="text-[13px] font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer"
                      style={{
                        background: "var(--color-ha-surface)",
                        border: "1px solid var(--color-ha-border)",
                        color: "var(--color-ha-primary)",
                      }}
                    >
                      Sign up free to view all
                    </button>
                  </div>
                )}
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
                <div className="flex flex-col">
                  {fees.map((fee, i) => (
                    <div
                      key={fee.id}
                      className="flex items-center justify-between py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}
                    >
                      <span className="text-[14px]" style={{ color: "var(--color-ha-text)" }}>
                        {fee.fee_type}
                      </span>
                      <span
                        className="text-[15px] font-bold"
                        style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}
                      >
                        {fee.amount != null ? `$${fee.amount.toLocaleString()}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] mt-3 pt-3" style={{ borderTop: "1px solid var(--color-ha-border)", color: "var(--color-ha-gray)" }}>
                  Source: Management certificate filed with hoa.texas.gov
                </div>
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
              <div className="flex flex-col gap-3">
                {[
                  { label: "Entity status", value: hoa.entity_status || "Unknown" },
                  { label: "SOS file number", value: hoa.sos_file_number },
                  { label: "Taxpayer ID", value: hoa.taxpayer_id },
                  { label: "Formation date", value: hoa.formation_date ? new Date(hoa.formation_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null },
                  { label: "Subdivision", value: hoa.subdivision_name },
                ].filter(item => item.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-baseline">
                    <span className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>{label}</span>
                    <span
                      className="text-[13px] font-semibold text-right"
                      style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                {hoa.certificate_url && (
                  <a
                    href={hoa.certificate_url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold mt-2"
                    style={{ color: "var(--color-ha-primary)" }}
                  >
                    <DocumentIcon size={14} />
                    View management certificate (PDF)
                  </a>
                )}
              </div>
            </Card>

            {/* Reviews placeholder */}
            <Card>
              <h2
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
              >
                Resident reviews
              </h2>
              <p className="text-[13px] mb-4" style={{ color: "var(--color-ha-gray)" }}>
                No reviews yet. Be the first to share your experience.
              </p>
              <div
                className="rounded-xl p-5 text-center"
                style={{ border: "1px dashed var(--color-ha-border-strong)", background: "var(--color-ha-surface)" }}
              >
                <p className="text-sm" style={{ color: "var(--color-ha-text-soft)" }}>
                  Live in this community? Your review helps future homeowners make informed decisions.
                </p>
                <button
                  className="mt-3 text-[13px] font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer"
                  style={{ background: "var(--color-ha-primary)", color: "white", border: "none" }}
                >
                  Leave a review
                </button>
              </div>
            </Card>

            {/* Forum placeholder */}
            <Card>
              <h2
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.01em" }}
              >
                Community discussion
              </h2>
              <p className="text-[13px] mb-4" style={{ color: "var(--color-ha-gray)" }}>
                No discussions yet. Start a conversation about your community.
              </p>
              <div
                className="rounded-xl p-5 flex items-center justify-between gap-4"
                style={{ border: "1px dashed var(--color-ha-border-strong)", background: "var(--color-ha-surface)" }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-ha-text)" }}>
                    Join the conversation
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--color-ha-gray)" }}>
                    Create a free account to read full discussions and post.
                  </div>
                </div>
                <button
                  className="shrink-0 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] cursor-pointer"
                  style={{ background: "var(--color-ha-primary)", color: "white", border: "none" }}
                >
                  Sign up free
                </button>
              </div>
            </Card>

            {/* Error reporting */}
            <div className="text-center py-4">
              <a
                href="#"
                className="text-[12px] font-medium hover:underline"
                style={{ color: "var(--color-ha-gray)" }}
              >
                See something wrong? Submit a correction.
              </a>
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="hidden lg:block">
            <ProfileSidebar hoaName={name} hasScore={hoa.health_score != null} />
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid var(--color-ha-border)",
        }}
      >
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            className="flex-1 text-[14px] font-semibold py-3 rounded-[10px] cursor-pointer"
            style={{ background: "var(--color-ha-primary)", color: "white", border: "none" }}
          >
            I live here
          </button>
          <button
            className="flex-1 text-[14px] font-semibold py-3 rounded-[10px] cursor-pointer"
            style={{ background: "white", border: "1px solid var(--color-ha-border)", color: "var(--color-ha-text)" }}
          >
            Get report
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}