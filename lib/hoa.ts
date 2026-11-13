import type { ScoringInput } from "@/lib/scoring";

/**
 * Shared helpers for reading HOA rows and turning them into scoring inputs.
 *
 * The scoring algorithm itself lives in lib/scoring.ts and is unchanged.
 * This file only makes sure every page feeds it the same inputs, so a card
 * in search results shows the same projected score as the full profile.
 */

/** Columns of `hoas` that the projected score depends on. */
export interface HoaScoringFields {
  recording_instrument_number?: string | null;
  association_website?: string | null;
  mgmt_company_name?: string | null;
  mgmt_company_phone?: string | null;
  mgmt_company_email?: string | null;
  mgmt_company_website?: string | null;
  entity_status?: string | null;
  registered_agent_name?: string | null;
  sos_effective_date?: string | null;
  certificate_url?: string | null;
  subdivision_name?: string | null;
}

/**
 * Column list for cards (home grid and search results).
 * Explicit on purpose: public pages should only fetch what they render.
 * `hoa_officers(count)` and `hoa_fees(count)` return row counts, not rows.
 */
export const HOA_CARD_COLUMNS = [
  "id",
  "legal_name",
  "display_name",
  "city",
  "county",
  "zip",
  "association_type",
  "entity_status",
  "subdivision_name",
  "association_website",
  "mgmt_company_name",
  "mgmt_company_phone",
  "mgmt_company_email",
  "mgmt_company_website",
  "registered_agent_name",
  "sos_effective_date",
  "recording_instrument_number",
  "certificate_url",
  "data_completeness_percent",
  "hoa_officers(count)",
  "hoa_fees(count)",
].join(", ");

/**
 * Column list for the full profile page. Explicit so the page keeps working
 * if anonymous access is later limited to these columns.
 */
export const HOA_PROFILE_COLUMNS = [
  "id",
  "legal_name",
  "display_name",
  "city",
  "county",
  "zip",
  "association_type",
  "subdivision_name",
  "mgmt_company_name",
  "mgmt_company_address",
  "mgmt_company_phone",
  "mgmt_company_email",
  "mgmt_company_website",
  "association_website",
  "entity_status",
  "sos_file_number",
  "sos_effective_date",
  "taxpayer_id",
  "certificate_url",
  "recording_instrument_number",
  "registered_agent_name",
  "scraped_at",
  "comptroller_processed_at",
].join(", ");

/** Columns of `hoa_officers` shown on a profile. Mailing addresses are deliberately not fetched. */
export const OFFICER_COLUMNS = "id, name, title, active_year";

/** Columns of `hoa_fees` shown on a profile. */
export const FEE_COLUMNS = "id, fee_type, amount";

/** PostgREST returns an embedded count as `[{ count: n }]`. */
export function embeddedCount(relation: unknown): number {
  if (Array.isArray(relation) && relation.length > 0) {
    const n = (relation[0] as { count?: number | null })?.count;
    return typeof n === "number" ? n : 0;
  }
  return 0;
}

export function buildScoringInput(
  hoa: HoaScoringFields,
  counts: { officers: number; fees: number }
): ScoringInput {
  return {
    hasFees: counts.fees > 0,
    hasCcrInstruments: !!hoa.recording_instrument_number,
    hasAssociationWebsite: !!hoa.mgmt_company_website || !!hoa.association_website,
    hasOfficers: counts.officers > 0,
    officerCount: counts.officers,
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
    // User-contributed inputs were planned but never built, so they are always empty.
    reviewCount: 0,
    hasForumActivity: false,
  };
}

/**
 * Makes free-text input safe to place inside a PostgREST `or=(...)` filter.
 * Commas and parentheses are filter syntax there, and % and * are wildcards,
 * so a search for "Smith, Inc." would otherwise break the query.
 */
export function sanitizeSearchTerm(input: string): string {
  return input
    .replace(/[,()"\\%*]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Formats an ISO timestamp as "May 12, 2026". Returns null for missing or invalid dates. */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
