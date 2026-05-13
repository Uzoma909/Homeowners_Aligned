import { createServiceClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command | Homeowners Aligned",
};

export const dynamic = "force-dynamic";

export default async function CommandPage() {
  const supabase = createServiceClient();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Stats
  const [
    { count: totalHoas },
    { count: totalUsers },
    { count: signupsToday },
    { count: signupsWeek },
    { count: signupsMonth },
    { count: totalWaitlist },
    { count: pendingVerifications },
    { count: pendingCorrections },
    { count: pendingReports },
  ] = await Promise.all([
    supabase.from("hoas").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", monthAgo),
    supabase.from("waitlist").select("*", { count: "exact", head: true }),
    supabase.from("address_verifications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("corrections_queue").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reported_content").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  // Recent signups (last 20)
  const { data: recentSignups } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Waitlist entries (last 20)
  const { data: waitlistEntries } = await supabase
    .from("waitlist")
    .select("id, first_name, email, state, zip, hoa_name, source, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Waitlist by state
  const { data: waitlistByState } = await supabase
    .from("waitlist")
    .select("state");

  const stateCounts: Record<string, number> = {};
  (waitlistByState || []).forEach((w: { state: string | null }) => {
    if (w.state) stateCounts[w.state] = (stateCounts[w.state] || 0) + 1;
  });
  const stateBreakdown = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Pending verifications
  const { data: pendingVerifs } = await supabase
    .from("address_verifications")
    .select("id, user_id, hoa_id, address, document_url, document_type, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  // Pending corrections
  const { data: pendingCorrs } = await supabase
    .from("corrections_queue")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  // Data completeness distribution — use count queries to avoid row limits
  const [
    { count: highComplete },
    { count: medComplete },
    { count: lowComplete },
    { count: sparseComplete },
  ] = await Promise.all([
    supabase.from("hoas").select("*", { count: "exact", head: true }).gte("data_completeness_percent", 60),
    supabase.from("hoas").select("*", { count: "exact", head: true }).gte("data_completeness_percent", 40).lt("data_completeness_percent", 60),
    supabase.from("hoas").select("*", { count: "exact", head: true }).gte("data_completeness_percent", 20).lt("data_completeness_percent", 40),
    supabase.from("hoas").select("*", { count: "exact", head: true }).lt("data_completeness_percent", 20),
  ]);

  const buckets = {
    high: highComplete || 0,
    medium: medComplete || 0,
    low: lowComplete || 0,
    sparse: sparseComplete || 0,
  };

  return (
    <AdminDashboard
      stats={{
        totalHoas: totalHoas || 0,
        totalUsers: totalUsers || 0,
        signupsToday: signupsToday || 0,
        signupsWeek: signupsWeek || 0,
        signupsMonth: signupsMonth || 0,
        totalWaitlist: totalWaitlist || 0,
        pendingVerifications: pendingVerifications || 0,
        pendingCorrections: pendingCorrections || 0,
        pendingReports: pendingReports || 0,
      }}
      completeness={buckets}
      recentSignups={recentSignups || []}
      waitlistEntries={waitlistEntries || []}
      stateBreakdown={stateBreakdown}
      pendingVerifs={pendingVerifs || []}
      pendingCorrs={pendingCorrs || []}
    />
  );
}
