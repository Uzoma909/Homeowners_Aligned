import { NavBar, Footer } from "@/components/layout";
import { createClient } from "@/lib/supabase/server";
import { SearchResults } from "./SearchResults";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string; county?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" | Homeowners Aligned` : "Search HOAs | Homeowners Aligned",
    description: q
      ? `Search results for "${q}" across 3,400+ DFW HOA profiles.`
      : "Search HOA profiles across Dallas-Fort Worth. Free Health Scores, board members, fees, and public records.",
  };
}

const PER_PAGE = 24;

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const cityFilter = params.city?.trim() || "";
  const countyFilter = params.county?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("hoas")
    .select("id, legal_name, display_name, city, county, zip, entity_status, mgmt_company_name, data_completeness_percent, health_score, subdivision_name, association_website, registered_agent_name, sos_effective_date, recording_instrument_number, certificate_url, mgmt_company_phone, mgmt_company_email", { count: "exact" })
    .order("data_completeness_percent", { ascending: false, nullsFirst: false })
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

  const { data: hoas, count } = await query;

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

  const uniqueCities = [...new Set((cities || []).map((c) => c.city).filter(Boolean))];
  const uniqueCounties = [...new Set((counties || []).map((c) => c.county).filter(Boolean))];

  const totalResults = count || 0;
  const totalPages = Math.ceil(totalResults / PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar activePath="/" />

      <main className="flex-1">
        <SearchResults
          query={q}
          hoas={hoas || []}
          totalResults={totalResults}
          currentPage={page}
          totalPages={totalPages}
          cities={uniqueCities}
          counties={uniqueCounties}
          activeCity={cityFilter}
          activeCounty={countyFilter}
        />
      </main>

      <Footer />
    </div>
  );
}