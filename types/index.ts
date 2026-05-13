/* ─── HOA Core ─── */
export type AssociationType = "POA" | "COA";

export type EntityStatus =
  | "ACTIVE"
  | "FORFEITED"
  | "TERMINATED"
  | "WITHDRAWN"
  | null;

export interface HOA {
  id: string;
  legal_name: string;
  display_name: string | null;
  county: string;
  state: string;
  city: string;
  zip: string;
  association_type: AssociationType | null;
  subdivision_name: string | null;
  management_company_name: string | null;
  management_company_phone: string | null;
  management_company_email: string | null;
  management_company_website: string | null;
  management_company_address: string | null;
  association_address: string | null;
  association_website: string | null;
  entity_status: EntityStatus;
  sos_file_number: string | null;
  formation_date: string | null;
  taxpayer_id: string | null;
  certificate_url: string | null;
  total_units: number | null;
  health_score: number | null;
  health_score_updated_at: string | null;
  data_completeness_percent: number;
  claimed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HOAOfficer {
  id: string;
  hoa_id: string;
  name: string;
  title: string | null;
  active_year: number | null;
  source: string;
  created_at: string;
}

export interface HOAFee {
  id: string;
  hoa_id: string;
  fee_type: string;
  amount: number | null;
  created_at: string;
}

/* ─── Health Score ─── */
export interface HealthScore {
  id: string;
  hoa_id: string;
  score_total: number | null;
  score_financial: number | null;
  score_governance: number | null;
  score_legal: number | null;
  score_sentiment: number | null;
  dimensions_scored: number;
  is_preliminary: boolean;
  data_completeness_percent: number;
  review_count: number;
  calculated_at: string;
}

export type ScoreTier = "green" | "amber" | "red" | "gray";

/* ─── Users ─── */
export type UserRole = "user" | "agent" | "inspector" | "admin";

export type DisplayPreference =
  | "named"
  | "anonymous_verified"
  | "anonymous_basic";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  display_preference: DisplayPreference;
  email: string;
  role: UserRole;
  is_premium: boolean;
  premium_expires_at: string | null;
  referral_token: string | null;
  avatar_type: string | null;
  created_at: string;
}

/* ─── Reviews ─── */
export type OwnershipStatus = "current_owner" | "former_owner" | "renter";

export type MeetingAttendance =
  | "regularly"
  | "few"
  | "never"
  | "board_member";

export type TenureLength = "<1yr" | "1-3yr" | "3-5yr" | "5+yr";

export type RecommendChoice = "yes" | "with_reservations" | "no";

export interface Review {
  id: string;
  hoa_id: string;
  user_id: string;
  rating_financial: number;
  rating_communication: number;
  rating_maintenance: number;
  rating_enforcement: number;
  rating_responsiveness: number;
  ownership_status: OwnershipStatus;
  tenure_years: TenureLength;
  meetings_attended: MeetingAttendance;
  whats_working: string;
  what_could_improve: string;
  would_recommend: RecommendChoice;
  display_preference: DisplayPreference;
  created_at: string;
  moderation_status: "pending" | "approved" | "flagged" | "rejected";
}

/* ─── Forum ─── */
export type ForumVisibility = "public" | "private";

export type ForumCategory =
  | "Financial"
  | "Board Election"
  | "Maintenance"
  | "Rules"
  | "New Resident"
  | "Board Response"
  | "Amenities";

export interface ForumPost {
  id: string;
  hoa_id: string;
  user_id: string;
  title: string;
  body: string;
  visibility: ForumVisibility;
  tag: ForumCategory;
  upvote_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
}

/* ─── Waitlist ─── */
export type WaitlistSource =
  | "organic"
  | "state_page"
  | "404_page"
  | "referral"
  | "county_missing";

export interface WaitlistEntry {
  id: string;
  email: string;
  first_name: string;
  state: string;
  zip: string;
  hoa_name: string | null;
  county: string | null;
  created_at: string;
  source: WaitlistSource;
  notified: boolean;
  notified_at: string | null;
}

/* ─── Helpers ─── */
export function getScoreTier(score: number | null): ScoreTier {
  if (score == null) return "gray";
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "red";
}

export function getScoreColor(score: number | null): string {
  const tier = getScoreTier(score);
  const map: Record<ScoreTier, string> = {
    green: "#059669",
    amber: "#d97706",
    red: "#dc2626",
    gray: "#94a3b8",
  };
  return map[tier];
}

export function getScoreTint(score: number | null): string {
  const tier = getScoreTier(score);
  const map: Record<ScoreTier, string> = {
    green: "#ecfdf5",
    amber: "#fffbeb",
    red: "#fef2f2",
    gray: "#f1f5f9",
  };
  return map[tier];
}

export function getScoreLabel(score: number | null): string {
  if (score == null) return "Unscored";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Healthy";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs attention";
  return "Concerning";
}
