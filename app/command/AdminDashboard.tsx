"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AdminDashboardProps {
  stats: {
    totalHoas: number;
    totalUsers: number;
    signupsToday: number;
    signupsWeek: number;
    signupsMonth: number;
    totalWaitlist: number;
    pendingVerifications: number;
    pendingCorrections: number;
    pendingReports: number;
  };
  completeness: { high: number; medium: number; low: number; sparse: number };
  recentSignups: { id: string; first_name: string | null; last_name: string | null; email: string | null; role: string | null; created_at: string }[];
  waitlistEntries: { id: string; first_name: string | null; email: string; state: string | null; zip: string | null; hoa_name: string | null; source: string | null; created_at: string }[];
  stateBreakdown: [string, number][];
  pendingVerifs: { id: string; user_id: string; hoa_id: string; address: string; document_url: string; document_type: string; status: string; created_at: string }[];
  pendingCorrs: any[];
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "waitlist", label: "Waitlist" },
  { id: "verifications", label: "Verifications" },
  { id: "corrections", label: "Corrections" },
] as const;

type Tab = typeof TABS[number]["id"];

export function AdminDashboard({
  stats,
  completeness,
  recentSignups,
  waitlistEntries,
  stateBreakdown,
  pendingVerifs,
  pendingCorrs,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleVerification(id: string, action: "approved" | "rejected") {
    setActionLoading(id);
    await supabase
      .from("address_verifications")
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (action === "approved") {
      const verif = pendingVerifs.find((v) => v.id === id);
      if (verif) {
        await supabase
          .from("profiles")
          .update({ verified_address: true, verified_hoa_id: verif.hoa_id, verified_at: new Date().toISOString() })
          .eq("id", verif.user_id);
      }
    }

    setActionLoading(null);
    router.refresh();
  }

  async function handleCorrection(id: string, action: "approved" | "rejected") {
    setActionLoading(id);
    await supabase
      .from("corrections_queue")
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActionLoading(null);
    router.refresh();
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#0f172a", color: "white", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Admin</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-outfit)" }}>Command Center</div>
          </div>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>
            {"Back to site \u2192"}
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, padding: "0 24px" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? "#7c3aed" : "#64748b",
                borderBottom: tab === t.id ? "2px solid #7c3aed" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "var(--font-outfit)",
                marginBottom: -1,
              }}
            >
              {t.label}
              {t.id === "verifications" && stats.pendingVerifications > 0 && (
                <span style={{ marginLeft: 6, background: "#dc2626", color: "white", borderRadius: 999, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                  {stats.pendingVerifications}
                </span>
              )}
              {t.id === "corrections" && stats.pendingCorrections > 0 && (
                <span style={{ marginLeft: 6, background: "#d97706", color: "white", borderRadius: 999, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                  {stats.pendingCorrections}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              <StatCard label="Total HOAs" value={stats.totalHoas} />
              <StatCard label="Total Users" value={stats.totalUsers} />
              <StatCard label="Signups Today" value={stats.signupsToday} accent="#059669" />
              <StatCard label="Signups This Week" value={stats.signupsWeek} accent="#7c3aed" />
              <StatCard label="Signups This Month" value={stats.signupsMonth} accent="#2563eb" />
              <StatCard label="Waitlist Total" value={stats.totalWaitlist} accent="#d97706" />
              <StatCard label="Pending Verifications" value={stats.pendingVerifications} accent={stats.pendingVerifications > 0 ? "#dc2626" : undefined} />
              <StatCard label="Pending Corrections" value={stats.pendingCorrections} accent={stats.pendingCorrections > 0 ? "#d97706" : undefined} />
              <StatCard label="Reported Content" value={stats.pendingReports} accent={stats.pendingReports > 0 ? "#dc2626" : undefined} />
            </div>

            {/* Data Quality */}
            <div style={{ marginTop: 24 }}>
              <SectionTitle>Data quality</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <StatCard label="60%+ Complete" value={completeness.high} accent="#059669" />
                <StatCard label="40-59% Complete" value={completeness.medium} accent="#d97706" />
                <StatCard label="20-39% Complete" value={completeness.low} accent="#dc2626" />
                <StatCard label="Under 20%" value={completeness.sparse} />
              </div>
            </div>

            {/* Waitlist by State */}
            {stateBreakdown.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <SectionTitle>Waitlist by state (top 10)</SectionTitle>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  {stateBreakdown.map(([state, count], i) => (
                    <div
                      key={state}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 16px", borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{state}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-space)", color: "#7c3aed" }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <QuickLink label="Supabase Dashboard" href="https://supabase.com/dashboard" />
              <QuickLink label="PostHog Analytics" href="https://us.posthog.com" />
              <QuickLink label="Vercel Dashboard" href="https://vercel.com/dashboard" />
              <QuickLink label="Stripe Dashboard" href="https://dashboard.stripe.com" />
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div>
            <SectionTitle>Recent signups ({stats.totalUsers} total)</SectionTitle>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th align="right">Joined</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentSignups.map((u) => (
                    <tr key={u.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <Td bold>{[u.first_name, u.last_name].filter(Boolean).join(" ") || "No name"}</Td>
                      <Td>{u.email || "No email"}</Td>
                      <Td><span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: u.role === "admin" ? "#7c3aed" : "#f1f5f9", color: u.role === "admin" ? "white" : "#64748b" }}>{u.role || "user"}</span></Td>
                      <Td align="right" mono>{formatDate(u.created_at)}</Td>
                    </tr>
                  ))}
                  {recentSignups.length === 0 && (
                    <tr><Td colSpan={3}>No signups yet</Td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── WAITLIST ── */}
        {tab === "waitlist" && (
          <div>
            <SectionTitle>Waitlist entries ({stats.totalWaitlist} total)</SectionTitle>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>State</Th>
                    <Th>Zip</Th>
                    <Th>HOA Name</Th>
                    <Th>Source</Th>
                    <Th align="right">Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.map((w) => (
                    <tr key={w.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <Td bold>{w.first_name || "N/A"}</Td>
                      <Td>{w.email}</Td>
                      <Td>{w.state || "N/A"}</Td>
                      <Td mono>{w.zip || "N/A"}</Td>
                      <Td>{w.hoa_name || "N/A"}</Td>
                      <Td><span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: "#f1f5f9", color: "#64748b" }}>{w.source || "unknown"}</span></Td>
                      <Td align="right" mono>{formatDate(w.created_at)}</Td>
                    </tr>
                  ))}
                  {waitlistEntries.length === 0 && (
                    <tr><Td colSpan={7}>No waitlist entries yet</Td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── VERIFICATIONS ── */}
        {tab === "verifications" && (
          <div>
            <SectionTitle>Pending address verifications ({stats.pendingVerifications})</SectionTitle>
            {pendingVerifs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pendingVerifs.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
                      padding: 16, display: "flex", gap: 16, alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>User ID: <span style={{ fontFamily: "var(--font-space)", fontSize: 10 }}>{v.user_id.slice(0, 8)}...</span></div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{v.address}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        HOA: <span style={{ fontFamily: "var(--font-space)", fontSize: 10 }}>{v.hoa_id.slice(0, 8)}...</span>
                        {" \u00b7 "}{v.document_type.replace("_", " ")}
                        {" \u00b7 "}{formatDate(v.created_at)}
                      </div>
                      <a
                        href={v.document_url}
                        target="_blank"
                        rel="noopener"
                        style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}
                      >
                        {"View document \u2192"}
                      </a>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleVerification(v.id, "approved")}
                        disabled={actionLoading === v.id}
                        style={{
                          background: "#059669", color: "white", border: "none", borderRadius: 8,
                          padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "var(--font-outfit)", opacity: actionLoading === v.id ? 0.5 : 1,
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerification(v.id, "rejected")}
                        disabled={actionLoading === v.id}
                        style={{
                          background: "white", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8,
                          padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "var(--font-outfit)", opacity: actionLoading === v.id ? 0.5 : 1,
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No pending verifications" />
            )}
          </div>
        )}

        {/* ── CORRECTIONS ── */}
        {tab === "corrections" && (
          <div>
            <SectionTitle>Pending corrections ({stats.pendingCorrections})</SectionTitle>
            {pendingCorrs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pendingCorrs.map((c: any) => (
                  <div
                    key={c.id}
                    style={{
                      background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
                      padding: 16, display: "flex", gap: 16, alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        HOA: <span style={{ fontFamily: "var(--font-space)", fontSize: 10 }}>{c.hoa_id?.slice(0, 8)}...</span>
                        {" \u00b7 "}{formatDate(c.created_at)}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{c.field || "General correction"}</div>
                      <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>{c.suggestion || c.details || "No details provided"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleCorrection(c.id, "approved")}
                        disabled={actionLoading === c.id}
                        style={{
                          background: "#059669", color: "white", border: "none", borderRadius: 8,
                          padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "var(--font-outfit)", opacity: actionLoading === c.id ? 0.5 : 1,
                        }}
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleCorrection(c.id, "rejected")}
                        disabled={actionLoading === c.id}
                        style={{
                          background: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8,
                          padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "var(--font-outfit)", opacity: actionLoading === c.id ? 0.5 : 1,
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No pending corrections" />
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Helper Components ── */

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-space)", color: accent || "#0f172a", letterSpacing: "-0.03em", marginTop: 4 }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", fontFamily: "var(--font-outfit)", marginBottom: 12 }}>
      {children}
    </h2>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th style={{ textAlign: align || "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </th>
  );
}

function Td({ children, bold, mono, align, colSpan }: { children: React.ReactNode; bold?: boolean; mono?: boolean; align?: "right"; colSpan?: number }) {
  return (
    <td
      colSpan={colSpan}
      style={{
        textAlign: align || "left",
        padding: "10px 14px",
        fontWeight: bold ? 600 : 400,
        color: bold ? "#0f172a" : "#334155",
        fontFamily: mono ? "var(--font-space)" : "inherit",
        fontSize: mono ? 12 : 13,
      }}
    >
      {children}
    </td>
  );
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 10,
        padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#0f172a",
        textDecoration: "none", fontFamily: "var(--font-outfit)",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}
    >
      {label} <span style={{ color: "#64748b" }}>{"\u2192"}</span>
    </a>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px dashed #d6cdf2", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 14, color: "#64748b" }}>{message}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
