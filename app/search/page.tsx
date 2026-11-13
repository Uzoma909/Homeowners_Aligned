import { NavBar, Footer } from "@/components/layout";
import { createPublicClient } from "@/lib/supabase/server";
import { HOA_CARD_COLUMNS, sanitizeSearchTerm } from "@/lib/hoa";
import { SearchResults } from "./SearchResults";
import type { HOA } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string; county?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" in HOA Records` : "Browse HOA Records",
    description: q
      ? `Search results for "${q}" across Dallas-Fort Worth HOA profiles built from public records.`
      : "Browse Dallas-Fort Worth HOA profiles built from public records: projected transparency scores, board members, fees, and filings.",
    // Result pages are an unbounded set of query URLs, so they stay out of search indexes.
    robots: { index: false, follow: true },
  };
}

const PER_PAGE = 24;

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawQuery = params.q?.trim() || "";
  const q = sanitizeSearchTerm(rawQuery);
  const cityFilter = sanitizeSearchTerm(params.city || "");
  const countyFilter = sanitizeSearchTerm(params.county || "");
  const parsedPage = parseInt(params.page || "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 1000) : 1;
  const offset = (page - 1) * PER_PAGE;

  const supabase = createPublicClient();

  // Build query
  let query = supabase
    .from("hoas")
    .select(HOA_CARD_COLUMNS, { count: "exact" })
    .order("data_completeness_percent", { ascending: false, nullsFirst: false })
    .order("legal_name", { ascending: true })
    .range(offset, offset + PER_PAGE - 1);

  // Text search across multiple columns
  if (q) {
    query = query.or(
      `legal_name.ilike.%${q}%,display_name.ilike.%${q}%,city.ilike.%${q}%,zip.ilike.%${q}%,subdivision_name.ilike.%${q}%,mgmt_company_name.ilike.%${q}%`
    );
  }

  if (cityFilter) {
    query = query.ilike("city", `%${cityFilter}%`);
  }

  if (countyFilter) {
    query = query.ilike("county", `%${countyFilter}%`);
  }

  const { data: hoas, count, error } = await query;
  if (error) {
    // Logged server-side only. The page shows a generic "could not be loaded" state.
    console.error("[search] HOA query failed:", error.message);
  }

  // Get unique cities and counties for filter dropdowns
  const { data: cities } = await supabase
    .from("hoas")
    .select("city")
    .not("city", "is", null)
    .order("city");

  const { data: counties } = await supabase
    .from("hoas")
    .select("county")
    .not("county", "is", null)
    .order("county");

  const uniqueCities = [
    ...new Set(((cities as { city: string }[] | null) || []).map((c) => c.city).filter(Boolean)),
  ];
  const uniqueCounties = [
    ...new Set(((counties as { county: string }[] | null) || []).map((c) => c.county).filter(Boolean)),
  ];

  const totalResults = count || 0;
  const totalPages = Math.ceil(totalResults / PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar activePath="/search" />

      <main id="main-content" className="flex-1">
        <SearchResults
          query={rawQuery}
          hoas={(hoas as unknown as HOA[] | null) || []}
          totalResults={totalResults}
          currentPage={page}
          totalPages={totalPages}
          cities={uniqueCities}
          counties={uniqueCounties}
          activeCity={cityFilter}
          activeCounty={countyFilter}
          loadFailed={!!error}
        />
      </main>

      <Footer />
    </div>
  );
}
