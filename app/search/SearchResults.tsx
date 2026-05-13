"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FilterSearchIcon, MapPinIcon } from "@/components/icons/hoa-icons";

import { calculateProjectedScore } from "@/lib/scoring";

interface HOAResult {
  id: string;
  legal_name: string;
  display_name: string | null;
  city: string | null;
  county: string | null;
  zip: string | null;
  entity_status: string | null;
  mgmt_company_name: string | null;
  data_completeness_percent: number | null;
  health_score: number | null;
  subdivision_name: string | null;
  association_website: string | null;
  registered_agent_name: string | null;
  sos_effective_date: string | null;
  recording_instrument_number: string | null;
  certificate_url: string | null;
  mgmt_company_phone: string | null;
  mgmt_company_email: string | null;
}

function getCardScore(hoa: HOAResult): number | null {
  const result = calculateProjectedScore({
    hasFees: false, // would need join to hoa_fees, skip for now
    hasCcrInstruments: !!hoa.recording_instrument_number,
    hasAssociationWebsite: !!hoa.association_website,
    hasOfficers: false, // would need join to hoa_officers, skip for now
    officerCount: 0,
    entityStatusActive: hoa.entity_status?.toLowerCase().includes("active") ?? false,
    hasManagement: !!hoa.mgmt_company_name,
    hasRegisteredAgent: !!hoa.registered_agent_name,
    hasFormationDate: !!hoa.sos_effective_date,
    managementContactComplete: !!(hoa.mgmt_company_phone && hoa.mgmt_company_email),
    hasCertificate: !!hoa.certificate_url,
    hasSubdivision: !!hoa.subdivision_name,
    hasCcrRecording: !!hoa.recording_instrument_number,
    reviewCount: 0,
    hasForumActivity: false,
  });
  return result.projectedScore;
}

interface SearchResultsProps {
  query: string;
  hoas: HOAResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  cities: string[];
  counties: string[];
  activeCity: string;
  activeCounty: string;
}

function getScoreColor(score: number | null): string {
  if (score == null) return "var(--color-ha-gray)";
  if (score >= 70) return "#059669";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

export function SearchResults({
  query,
  hoas,
  totalResults,
  currentPage,
  totalPages,
  cities,
  counties,
  activeCity,
  activeCounty,
}: SearchResultsProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [cityOpen, setCityOpen] = useState(false);
  const [countyOpen, setCountyOpen] = useState(false);
  const router = useRouter();

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    const q = overrides.q ?? query;
    const city = overrides.city ?? activeCity;
    const county = overrides.county ?? activeCounty;
    const page = overrides.page ?? "1";

    if (q) p.set("q", q);
    if (city) p.set("city", city);
    if (county) p.set("county", county);
    if (page !== "1") p.set("page", page);

    return `/search?${p.toString()}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ q: searchInput, page: "1" }));
  }

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "white",
            border: "1px solid var(--color-ha-border)",
            boxShadow: "var(--shadow-search)",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-gray)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, city, zip, subdivision, or management company..."
            className="flex-1 text-[15px] bg-transparent border-0 outline-0 min-w-0 focus:ring-0 focus:outline-none"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 text-[13px] font-semibold rounded-xl cursor-pointer border-0"
            style={{
              background: "var(--color-ha-primary)",
              color: "white",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--color-ha-text-soft)" }}>
          <FilterSearchIcon size={14} />
          Filters:
        </div>

        {/* City filter */}
        <div className="relative">
          <button
            onClick={() => { setCityOpen(!cityOpen); setCountyOpen(false); }}
            className="text-[12px] font-medium px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5"
            style={{
              background: activeCity ? "var(--color-ha-primary)" : "white",
              color: activeCity ? "white" : "var(--color-ha-text-soft)",
              border: activeCity ? "1px solid var(--color-ha-primary)" : "1px solid var(--color-ha-border)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            {activeCity || "City"}
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {cityOpen && (
            <div
              className="absolute top-[calc(100%+4px)] left-0 z-40 rounded-xl py-2"
              style={{
                background: "white",
                border: "1px solid var(--color-ha-border)",
                boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                maxHeight: 260,
                overflowY: "auto",
                minWidth: 180,
              }}
            >
              <button
                onClick={() => { router.push(buildUrl({ city: "", page: "1" })); setCityOpen(false); }}
                className="w-full text-left text-[12px] px-3 py-2 bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-gray)" }}
              >
                All cities
              </button>
              {cities.slice(0, 50).map((c) => (
                <button
                  key={c}
                  onClick={() => { router.push(buildUrl({ city: c, page: "1" })); setCityOpen(false); }}
                  className="w-full text-left text-[12px] px-3 py-2 bg-transparent border-0 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: c === activeCity ? "var(--color-ha-primary)" : "var(--color-ha-text)",
                    fontWeight: c === activeCity ? 600 : 400,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* County filter */}
        <div className="relative">
          <button
            onClick={() => { setCountyOpen(!countyOpen); setCityOpen(false); }}
            className="text-[12px] font-medium px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5"
            style={{
              background: activeCounty ? "var(--color-ha-primary)" : "white",
              color: activeCounty ? "white" : "var(--color-ha-text-soft)",
              border: activeCounty ? "1px solid var(--color-ha-primary)" : "1px solid var(--color-ha-border)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            {activeCounty || "County"}
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {countyOpen && (
            <div
              className="absolute top-[calc(100%+4px)] left-0 z-40 rounded-xl py-2"
              style={{
                background: "white",
                border: "1px solid var(--color-ha-border)",
                boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                maxHeight: 260,
                overflowY: "auto",
                minWidth: 180,
              }}
            >
              <button
                onClick={() => { router.push(buildUrl({ county: "", page: "1" })); setCountyOpen(false); }}
                className="w-full text-left text-[12px] px-3 py-2 bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-gray)" }}
              >
                All counties
              </button>
              {counties.map((c) => (
                <button
                  key={c}
                  onClick={() => { router.push(buildUrl({ county: c, page: "1" })); setCountyOpen(false); }}
                  className="w-full text-left text-[12px] px-3 py-2 bg-transparent border-0 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: c === activeCounty ? "var(--color-ha-primary)" : "var(--color-ha-text)",
                    fontWeight: c === activeCounty ? 600 : 400,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filter clear */}
        {(activeCity || activeCounty) && (
          <button
            onClick={() => router.push(buildUrl({ city: "", county: "", page: "1" }))}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer"
            style={{
              background: "transparent",
              color: "var(--color-ha-gray)",
              border: "1px solid var(--color-ha-border)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Clear filters
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto text-[13px]" style={{ color: "var(--color-ha-gray)" }}>
          <strong style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{totalResults.toLocaleString()}</strong>{" "}
          {totalResults === 1 ? "result" : "results"}
          {query && <> for &ldquo;{query}&rdquo;</>}
        </span>
      </div>

      {/* Results grid */}
      {hoas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hoas.map((hoa) => (
            <Link
              key={hoa.id}
              href={`/community/${hoa.id}`}
              className="ha-card p-4 flex flex-col gap-2.5 no-underline transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              style={{ boxShadow: "none" }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="text-[14px] font-semibold leading-snug"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {hoa.display_name || hoa.legal_name}
                </h3>
                {/* Score badge */}
                {(() => {
                  const score = getCardScore(hoa);
                  return (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
                      style={{
                        fontFamily: "var(--font-space)",
                        background: score != null ? getScoreColor(score) : "var(--color-ha-border)",
                        color: "white",
                      }}
                    >
                      {score ?? "--"}
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>
                <MapPinIcon size={11} />
                <span>{[hoa.city, hoa.county].filter(Boolean).join(", ")}</span>
                {hoa.zip && <span style={{ fontFamily: "var(--font-space)" }}>&middot; {hoa.zip}</span>}
              </div>

              {hoa.mgmt_company_name && (
                <div className="text-[10px]" style={{ color: "var(--color-ha-gray)" }}>
                  Managed by <strong style={{ color: "var(--color-ha-text-soft)" }}>{hoa.mgmt_company_name}</strong>
                </div>
              )}

              {/* Completeness bar */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px]" style={{ color: "var(--color-ha-gray)" }}>Data completeness</span>
                  <span className="text-[9px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>
                    {hoa.data_completeness_percent ?? 0}%
                  </span>
                </div>
                <div className="h-1 rounded-full" style={{ background: "var(--color-ha-border)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${hoa.data_completeness_percent ?? 0}%`,
                      background: "var(--color-ha-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Entity status */}
              {hoa.entity_status && (
                <span
                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full self-start"
                  style={{
                    background: hoa.entity_status.toLowerCase().includes("active") ? "var(--color-ha-primary)" : "#dc2626",
                    color: "white",
                  }}
                >
                  {hoa.entity_status}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl p-12 md:p-16 text-center"
          style={{ background: "var(--color-ha-surface)", border: "1px dashed var(--color-ha-border-strong)" }}
        >
          <h3
            className="text-[20px] font-semibold"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
          >
            No HOAs found
          </h3>
          <p className="text-[14px] mt-2 max-w-[400px] mx-auto" style={{ color: "var(--color-ha-text-soft)" }}>
            {query
              ? `We couldn\u2019t find any HOAs matching "${query}". Try a different name, city, or zip code.`
              : "Try searching by HOA name, city, zip code, or management company."}
          </p>
          <Link
            href="/"
            className="inline-block text-[13px] font-semibold px-5 py-2.5 rounded-[10px] mt-5 no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            Back to home
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <Link
              href={buildUrl({ page: String(currentPage - 1) })}
              className="text-[13px] font-semibold px-4 py-2 rounded-xl no-underline"
              style={{ background: "white", color: "var(--color-ha-text)", border: "1px solid var(--color-ha-border)" }}
            >
              Previous
            </Link>
          )}
          <span className="text-[13px] px-3" style={{ color: "var(--color-ha-gray)" }}>
            Page <strong style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{currentPage}</strong> of{" "}
            <strong style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{totalPages}</strong>
          </span>
          {currentPage < totalPages && (
            <Link
              href={buildUrl({ page: String(currentPage + 1) })}
              className="text-[13px] font-semibold px-4 py-2 rounded-xl no-underline"
              style={{ background: "var(--color-ha-primary)", color: "white" }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}