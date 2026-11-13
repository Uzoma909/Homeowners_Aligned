import { createPublicClient } from "@/lib/supabase/server";
import { NavBar, Footer } from "@/components/layout";
import { HeroSearch } from "./HeroSearch";
import { HOAGridCard } from "./HOAGridCard";
import { HOA_CARD_COLUMNS } from "@/lib/hoa";
import Link from "next/link";
import type { HOA } from "@/types";

// The home page shows a record count and six sample profiles. Re-rendering it
// at most once an hour keeps portfolio traffic from hitting the database on
// every visit.
export const revalidate = 3600;

export default async function HomePage() {
  const supabase = createPublicClient();

  const { count: hoaCount } = await supabase
    .from("hoas")
    .select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("hoas")
    .select(HOA_CARD_COLUMNS)
    .order("data_completeness_percent", { ascending: false, nullsFirst: false })
    .limit(6);
  if (error) {
    // Logged server-side only. The page still renders, without the sample grid.
    console.error("[home] HOA query failed:", error.message);
  }

  const topHoas = (data as unknown as HOA[] | null) || [];

  const trySuggestions = topHoas.slice(0, 3).map((h) => ({
    label: h.display_name || h.legal_name,
    id: h.id,
  }));

  const displayCount = hoaCount ? hoaCount.toLocaleString() : "3,400";

  return (
    <div className="min-h-screen">
      <NavBar activePath="/" />

      <main id="main-content">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 opacity-50 ha-glow" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50 ha-dot-pattern"
            style={{
              maskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
              WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-[1180px] mx-auto px-4 md:px-8 pt-16 md:pt-20 pb-14 md:pb-16 text-center">
            <Link
              href="/project"
              className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 no-underline"
              style={{
                background: "var(--color-ha-surface)",
                color: "var(--color-ha-deep)",
                border: "1px solid var(--color-ha-border-strong)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-ha-primary)" }}
              />
              {"Data engineering portfolio project · See how it was built"}
            </Link>

            <h1
              className="text-[32px] md:text-[52px] lg:text-[60px] font-semibold leading-[1.08] tracking-tight"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-ha-text)",
                letterSpacing: "-0.035em",
                textWrap: "balance",
              }}
            >
              See what your community
              <br className="hidden md:block" />
              {" "}is really made of.
            </h1>

            <p
              className="text-[16px] md:text-[20px] mt-5 mx-auto max-w-[620px] leading-relaxed"
              style={{ color: "var(--color-ha-text-soft)", textWrap: "pretty" }}
            >
              Public records for {displayCount} Dallas-Fort Worth homeowners
              associations, collected and structured by an automated pipeline,
              with an experimental transparency score for each one.
            </p>

            <HeroSearch trySuggestions={trySuggestions} />

            <p className="text-[13px] mt-5" style={{ color: "var(--color-ha-gray)" }}>
              {"Not sure what an HOA is? "}
              <Link
                href="/about/tx"
                className="font-semibold no-underline hover:underline"
                style={{ color: "var(--color-ha-primary)" }}
              >
                {"Learn how they work in Texas →"}
              </Link>
            </p>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="max-w-[1180px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center mb-10">
            <h2
              className="text-[24px] md:text-[32px] font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-ha-text)",
                letterSpacing: "-0.02em",
              }}
            >
              How it works
            </h2>
            <p className="text-[15px] mt-2" style={{ color: "var(--color-ha-text-soft)" }}>
              From scattered public filings to a searchable profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                title: "Search a community",
                desc: "Enter an HOA name, city, zip code, or subdivision. Every profile is built from official public records. No account is needed.",
                href: "/search",
                cta: "Browse HOA records",
              },
              {
                step: "2",
                title: "Read the transparency score",
                desc: "Each HOA gets a projected score built from checkpoints across financial, governance, and legal records, with every input shown.",
                href: "/about#scoring",
                cta: "Score methodology",
              },
              {
                step: "3",
                title: "See how it was built",
                desc: "A Node.js pipeline downloads the state dataset, parses each filed certificate, matches it to state entity records, and loads the result into Postgres.",
                href: "/project",
                cta: "Technical case study",
              },
            ].map(({ step, title, desc, href, cta }) => (
              <div key={step} className="ha-card p-6 flex flex-col gap-3" style={{ boxShadow: "none" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold"
                  style={{
                    background: "var(--color-ha-primary)",
                    color: "white",
                    fontFamily: "var(--font-space)",
                  }}
                >
                  {step}
                </div>
                <h3
                  className="text-[17px] font-semibold"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  {desc}
                </p>
                <Link
                  href={href}
                  className="mt-auto text-[13px] font-semibold no-underline hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  {cta + " →"}
                </Link>
              </div>
            ))}
          </div>

          {/* Stats — compact row below steps */}
          <div
            className="mt-10 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-6"
            style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}
          >
            {[
              [displayCount, "HOA profiles"],
              ["2", "Public data sources"],
              ["6", "DFW counties"],
              ["Open", "No account needed"],
            ].map(([n, l]) => (
              <div key={String(l)} className="text-center">
                <span
                  className="text-[20px] md:text-[24px] font-bold"
                  style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)", letterSpacing: "-0.02em" }}
                >
                  {n}
                </span>
                <span className="block text-[12px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COMMUNITY GRID ─── */}
        {topHoas.length > 0 && (
          <section className="max-w-[1180px] mx-auto px-4 md:px-8 pb-14 md:pb-20">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2
                  className="text-[20px] md:text-[24px] font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                >
                  Explore the dataset
                </h2>
                <p className="text-[14px] mt-1" style={{ color: "var(--color-ha-gray)" }}>
                  Most complete profiles in DFW
                </p>
              </div>
              <Link
                href="/search"
                className="text-[13px] font-semibold no-underline hover:underline"
                style={{ color: "var(--color-ha-primary)" }}
              >
                {"View all HOA records →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topHoas.map((hoa) => (
                <HOAGridCard key={hoa.id} hoa={hoa} />
              ))}
            </div>
          </section>
        )}

        {/* ─── CASE STUDY CTA ─── */}
        <section className="max-w-[1180px] mx-auto px-4 md:px-8 pb-14 md:pb-20">
          <div
            className="rounded-3xl p-8 md:p-14 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--color-ha-deep) 0%, var(--color-ha-primary) 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative max-w-[600px]">
              <h2
                className="text-[24px] md:text-[36px] font-semibold tracking-tight leading-[1.1]"
                style={{ fontFamily: "var(--font-outfit)", letterSpacing: "-0.02em" }}
              >
                Behind Homeowners Aligned
              </h2>
              <p className="text-[15px] md:text-[17px] opacity-85 mt-4 mb-7 leading-relaxed">
                The data sources, the document-parsing pipeline, the database
                design, the scoring method, and what did not get built.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/project"
                  className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                  style={{ background: "white", color: "var(--color-ha-deep)" }}
                >
                  Read the technical case study
                </Link>
                <Link
                  href="/project#architecture"
                  className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                >
                  View the architecture
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
