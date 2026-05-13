"use client";

import { useState } from "react";

interface HOAProfile {
  name: string;
  city: string;
  county: string;
  mgmt: string;
  mgmtPhone: string;
  est: string;
  entityStatus: string;
  entityOk: boolean;
  score: number;
  scoreColor: string;
  pillars: { label: string; score: number; max: number; pct: number; color: string }[];
  assessment: number;
  assessmentTrend: string;
  assessmentFill: string;
  changePct: number;
  changeUp: boolean;
  avgComparison: string;
  warranties: string;
  specialAssessment: string;
  specialNote: string;
  meetingCadence: string;
  meetingColor: string;
  reservePct: number;
  reserveNote: string;
  reviewAvg: number;
  reviewStars: number;
  reviewCount: number;
  reviewQuote: string;
  officers: { name: string; title: string; year: string; initials: string }[];
  fees: { type: string; amount: string }[];
}

const GOOD_HOA: HOAProfile = {
  name: "Aligned Meadows Homeowners Association",
  city: "Dallas, TX",
  county: "Collin County",
  mgmt: "Premier Community Mgmt",
  mgmtPhone: "(972) 555-0140",
  est: "2004",
  entityStatus: "ACTIVE",
  entityOk: true,
  score: 75,
  scoreColor: "#059669",
  pillars: [
    { label: "Financial Health", score: 20, max: 25, pct: 80, color: "#059669" },
    { label: "Governance", score: 21, max: 25, pct: 84, color: "#059669" },
    { label: "Legal History", score: 19, max: 25, pct: 76, color: "#059669" },
    { label: "Resident Sentiment", score: 15, max: 25, pct: 60, color: "#7c3aed" },
  ],
  assessment: 275,
  assessmentTrend: "0,44 20,42 40,40 60,38 80,38 100,34 110,34 130,28 150,22 170,14 180,10",
  assessmentFill: "0,48 0,44 20,42 40,40 60,38 80,38 100,34 110,34 130,28 150,22 170,14 180,10 180,48",
  changePct: 8,
  changeUp: true,
  avgComparison: "12% above the DFW average for communities this size ($245).",
  warranties: "4",
  specialAssessment: "$2,400",
  specialNote: "Pool resurfacing \u00b7 March 2025",
  meetingCadence: "Monthly",
  meetingColor: "var(--color-ha-text)",
  reservePct: 42,
  reserveNote: "Industry standard: 70%+",
  reviewAvg: 4.1,
  reviewStars: 4,
  reviewCount: 23,
  reviewQuote: "Fees are reasonable for the area but the reserve fund situation concerns me. Special assessment last year was unexpected.",
  officers: [
    { name: "Alex Thompson", title: "President", year: "2026", initials: "AT" },
    { name: "Maria Chen", title: "Vice President", year: "2026", initials: "MC" },
    { name: "David Owens", title: "Treasurer", year: "2025", initials: "DO" },
  ],
  fees: [
    { type: "Resale Certificate", amount: "$375" },
    { type: "Transfer Fee", amount: "$250" },
    { type: "Capital Contribution", amount: "$500" },
  ],
};

const BAD_HOA: HOAProfile = {
  name: "Unaligned Estates Property Owners Association",
  city: "Sample City, TX",
  county: "Dallas County",
  mgmt: "Self-managed",
  mgmtPhone: "No phone listed",
  est: "1998",
  entityStatus: "FORFEITED",
  entityOk: false,
  score: 34,
  scoreColor: "#dc2626",
  pillars: [
    { label: "Financial Health", score: 6, max: 25, pct: 24, color: "#dc2626" },
    { label: "Governance", score: 10, max: 25, pct: 40, color: "#dc2626" },
    { label: "Legal History", score: 12, max: 25, pct: 48, color: "#7c3aed" },
    { label: "Resident Sentiment", score: 6, max: 25, pct: 24, color: "#dc2626" },
  ],
  assessment: 410,
  assessmentTrend: "0,38 20,36 40,32 60,28 80,24 100,20 110,16 130,14 150,10 170,8 180,6",
  assessmentFill: "0,48 0,38 20,36 40,32 60,28 80,24 100,20 110,16 130,14 150,10 170,8 180,6 180,48",
  changePct: 22,
  changeUp: true,
  avgComparison: "45% above the DFW average for communities this size ($283). Two special assessments in the last 3 years.",
  warranties: "0",
  specialAssessment: "$4,800",
  specialNote: "Roof repair \u00b7 November 2025",
  meetingCadence: "Irregular",
  meetingColor: "#dc2626",
  reservePct: 18,
  reserveNote: "Critically underfunded",
  reviewAvg: 2.1,
  reviewStars: 2,
  reviewCount: 47,
  reviewQuote: "Board has not held an open meeting in over a year. Multiple homeowners have filed complaints with the county. No financial transparency.",
  officers: [
    { name: "J. Smith", title: "President", year: "2022", initials: "JS" },
    { name: "Vacant", title: "Vice President", year: "\u2014", initials: "??" },
    { name: "Vacant", title: "Treasurer", year: "\u2014", initials: "??" },
  ],
  fees: [
    { type: "Resale Certificate", amount: "$500" },
    { type: "Transfer Fee", amount: "$400" },
    { type: "Capital Contribution", amount: "$750" },
  ],
};

export function ProfilePreview() {
  const [mode, setMode] = useState<"good" | "bad">("good");
  const h = mode === "good" ? GOOD_HOA : BAD_HOA;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--color-ha-border)", background: "white" }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: h.entityOk ? "#059669" : "#dc2626", color: "white" }}>
              {h.entityStatus}
            </span>
            {h.entityOk && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#059669", color: "white" }}>
                Verified Profile
              </span>
            )}
          </div>
          {/* Toggle */}
          <button
            onClick={() => setMode(mode === "good" ? "bad" : "good")}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5"
            style={{
              background: mode === "good" ? "var(--color-ha-surface)" : "#fef2f2",
              color: mode === "good" ? "var(--color-ha-primary)" : "#dc2626",
              border: mode === "good" ? "1px solid var(--color-ha-border)" : "1px solid #fecaca",
              fontFamily: "var(--font-outfit)",
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.4199 5.16H3.57996M20.42 18.84H6.57996M17.26 22L20.42 18.84L17.26 15.68M6.73996 2L3.57996 5.16L6.73996 8.32" />
            </svg>
            {mode === "good" ? "See a poorly managed HOA" : "See a well-managed HOA"}
          </button>
        </div>
        <h3
          className="text-[20px] font-semibold"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.02em" }}
        >
          {h.name}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>
          <span className="flex items-center gap-1">
            <svg width={10} height={10} viewBox="0 0 24 24" overflow="visible" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 13.43C10.27 13.43 8.88 12.04 8.88 10.31C8.88 8.58 10.28 7.19 12 7.19" />
              <path d="M5.98 4.3C10.35 0.19 18.82 1.6 20.38 8.51C21.53 13.59 18.37 17.89 15.6 20.55C13.59 22.49 10.41 22.49 8.39 20.55" />
            </svg>
            {h.city} &middot; {h.county}
          </span>
          <span>&middot; {h.mgmt === "Self-managed" ? <span style={{ color: "#d97706" }}>Self-managed</span> : <>Managed by <strong style={{ color: "var(--color-ha-text)" }}>{h.mgmt}</strong></>}</span>
          <span>&middot; Est. <span style={{ fontFamily: "var(--font-space)" }}>{h.est}</span></span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5" style={{ background: "var(--color-ha-surface)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Health Score */}
          <div className="ha-card p-4" style={{ boxShadow: "none" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: h.scoreColor, color: "white" }}>
                Health Score
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
                <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={40} cy={40} r={32} fill="none" stroke="#e2e8f0" strokeWidth={5} />
                  <circle cx={40} cy={40} r={32} fill="none" stroke={h.scoreColor} strokeWidth={5}
                    strokeDasharray={`${32 * 2 * Math.PI * (h.score / 100)} ${32 * 2 * Math.PI}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-[22px] font-bold" style={{ fontFamily: "var(--font-space)", color: h.scoreColor, lineHeight: 1 }}>{h.score}</span>
                  <span className="text-[7px]" style={{ color: "var(--color-ha-gray)" }}>of 100</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {h.pillars.map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-semibold" style={{ color: "var(--color-ha-text)" }}>{p.label}</span>
                      <span className="text-[9px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{p.score}/{p.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--color-ha-border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-2.5 text-[9px]" style={{ borderTop: "1px dashed var(--color-ha-border)", color: "var(--color-ha-gray)" }}>
              <strong style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{mode === "good" ? "16/19" : "8/19"}</strong>{" "}data points verified &middot; 2 public sources
            </div>
            {/* Review summary */}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-ha-border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width={10} height={10} viewBox="0 0 24 24" fill={s <= h.reviewStars ? "#7c3aed" : "none"} stroke="#7c3aed" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{h.reviewAvg}</span>
                </div>
                <span className="text-[9px]" style={{ color: "var(--color-ha-gray)" }}>{h.reviewCount} verified reviews</span>
              </div>
              <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                &ldquo;{h.reviewQuote}&rdquo;
              </p>
            </div>
          </div>

          {/* At a Glance */}
          <div className="ha-card p-4" style={{ boxShadow: "none" }}>
            <div className="text-[12px] font-semibold mb-3" style={{ color: "var(--color-ha-text)" }}>At a glance</div>
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
                <span className="text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>Active warranties</span>
                <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{h.warranties}</span>
              </div>
              <div className="py-2.5" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>Last special assessment</span>
                  <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{h.specialAssessment}</span>
                </div>
                <div className="text-[9px] mt-1" style={{ color: "var(--color-ha-gray)" }}>{h.specialNote}</div>
              </div>
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--color-ha-border)" }}>
                <span className="text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>Board meeting cadence</span>
                <span className="text-[11px] font-semibold" style={{ color: h.meetingColor }}>{h.meetingCadence}</span>
              </div>
              <div className="py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "var(--color-ha-text-soft)" }}>Reserve fund</span>
                  <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-space)", color: h.reservePct < 30 ? "#dc2626" : "#d97706" }}>{h.reservePct}%</span>
                </div>
                <div className="text-[9px] mt-1" style={{ color: "var(--color-ha-gray)" }}>{h.reserveNote}</div>
              </div>
            </div>
            <div className="mt-3 p-2.5 rounded-lg flex items-center gap-2" style={{ background: "var(--color-ha-surface)" }}>
              <svg width={12} height={12} viewBox="0 0 24 24" overflow="visible" fill="none" stroke={h.entityOk ? "#059669" : "#dc2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-[10px]" style={{ color: "var(--color-ha-text-soft)" }}>
                {h.mgmt === "Self-managed"
                  ? <><strong style={{ color: "#d97706" }}>Self-managed</strong> &middot; {h.mgmtPhone}</>
                  : <>Management company: <strong style={{ color: "var(--color-ha-text)" }}>{h.mgmt}</strong> &middot; {h.mgmtPhone}</>
                }
              </span>
            </div>
          </div>

          {/* Monthly Assessment — full width */}
          <div className="ha-card p-4 md:col-span-2" style={{ boxShadow: "none" }}>
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-ha-gray)", letterSpacing: "0.06em" }}>
              Monthly assessment
            </span>
            <div className="flex items-end justify-between mt-3 gap-4 flex-wrap">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[36px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    ${h.assessment}
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>/mo</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>2-yr trend</span>
                </div>
                <span className="text-[12px] font-bold flex items-center gap-1 mt-0.5" style={{ fontFamily: "var(--font-space)", color: "#dc2626" }}>
                  {"\u2191"} +{h.changePct}%
                </span>
              </div>
              <svg viewBox="0 0 180 48" style={{ width: 180, height: 48 }} className="shrink-0">
                <defs>
                  <linearGradient id={`spark-fill-${mode}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={mode === "good" ? "#7c3aed" : "#dc2626"} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={mode === "good" ? "#7c3aed" : "#dc2626"} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon points={h.assessmentFill} fill={`url(#spark-fill-${mode})`} />
                <polyline points={h.assessmentTrend} fill="none" stroke={mode === "good" ? "var(--color-ha-primary)" : "#dc2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed" style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-text-soft)" }}>
              <strong style={{ color: "var(--color-ha-text)" }}>{h.avgComparison.split(" ")[0]} {h.avgComparison.split(" ")[1]}</strong> {h.avgComparison.split(" ").slice(2).join(" ")}
            </div>
          </div>

          {/* Board Members */}
          <div className="ha-card p-4" style={{ boxShadow: "none" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Board members</div>
              <span className="text-[9px]" style={{ color: "var(--color-ha-gray)" }}>Source: Texas Comptroller</span>
            </div>
            <div className="flex flex-col">
              {h.officers.map((o, i) => (
                <div key={o.name + i} className="flex items-center justify-between py-2" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: "var(--color-ha-surface)", color: o.name === "Vacant" ? "#dc2626" : "var(--color-ha-primary)" }}>
                      {o.initials}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold" style={{ color: o.name === "Vacant" ? "#dc2626" : "var(--color-ha-text)" }}>{o.name}</div>
                      <div className="text-[10px]" style={{ color: "var(--color-ha-gray)" }}>{o.title}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-gray)" }}>{o.year}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] mt-2 pt-2 text-center" style={{ borderTop: "1px solid var(--color-ha-border)", color: "var(--color-ha-gray)" }}>
              {mode === "good" ? "+4 more board members \u00b7 Sign up to view all" : "2 vacant seats \u00b7 No election scheduled"}
            </div>
          </div>

          {/* Transfer Fees */}
          <div className="ha-card p-4" style={{ boxShadow: "none" }}>
            <div className="text-[12px] font-semibold mb-3" style={{ color: "var(--color-ha-text)" }}>Transfer fees</div>
            <div className="flex flex-col">
              {h.fees.map((f, i) => (
                <div key={f.type} className="flex items-center justify-between py-2" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}>
                  <span className="text-[12px]" style={{ color: "var(--color-ha-text)" }}>{f.type}</span>
                  <span className="text-[13px] font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{f.amount}</span>
                </div>
              ))}
            </div>
            <div className="text-[9px] mt-2 pt-2" style={{ borderTop: "1px solid var(--color-ha-border)", color: "var(--color-ha-gray)" }}>
              Source: Management certificate filed with hoa.texas.gov
            </div>
          </div>

          {/* Resident Reviews — full width */}
          <div className="ha-card p-4 md:col-span-2" style={{ boxShadow: "none" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[12px] font-semibold" style={{ color: "var(--color-ha-text)" }}>Resident reviews</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>{h.reviewCount} verified reviews &middot; Avg {h.reviewAvg} / 5</div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width={12} height={12} viewBox="0 0 24 24" fill={s <= h.reviewStars ? "#7c3aed" : "none"} stroke="#7c3aed" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              {(mode === "good" ? [
                { author: "Sarah K.", years: "4 years", stars: 4, text: "Board communication improved a lot this year. Monthly emails and open meetings. Landscaping could use work." },
                { author: "James R.", years: "2 years", stars: 3, text: "Fees are reasonable for the area but the reserve fund situation concerns me. Special assessment last year was unexpected." },
                { author: "Linda M.", years: "7 years", stars: 5, text: "Best managed HOA I have lived in. Responsive board, well-maintained common areas, and transparent financials." },
              ] : [
                { author: "David P.", years: "5 years", stars: 1, text: "Board refuses to hold open meetings. No financial transparency. Two special assessments in two years with zero explanation." },
                { author: "Maria S.", years: "3 years", stars: 2, text: "Common areas are falling apart. Pool has been closed for six months. Fees keep going up with nothing to show for it." },
                { author: "Kevin T.", years: "1 year", stars: 3, text: "Moved in last year. Fees are high for what you get. Wish I had seen this data before buying." },
              ]).map((r, i) => (
                <div key={r.author} className="py-3" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-ha-border)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "white" }}>
                      {r.author.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <strong className="text-[11px]" style={{ color: "var(--color-ha-text)" }}>{r.author}</strong>
                    <span className="text-[10px]" style={{ color: "var(--color-ha-gray)" }}>Verified &middot; {r.years}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} width={9} height={9} viewBox="0 0 24 24" fill={s <= r.stars ? "#7c3aed" : "none"} stroke="#7c3aed" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>{r.text}</p>
                </div>
              ))}
            </div>
            <div className="text-[10px] mt-2 pt-2 text-center" style={{ borderTop: "1px solid var(--color-ha-border)", color: "var(--color-ha-gray)" }}>
              Sign up to leave a verified review
            </div>
          </div>

        </div>
      </div>

      {/* Label */}
      <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid var(--color-ha-border)", background: "white" }}>
        <span className="text-[11px] font-semibold" style={{ color: "var(--color-ha-gray)" }}>
          HOA Profile &middot; Free for everyone to search
        </span>
      </div>
    </div>
  );
}