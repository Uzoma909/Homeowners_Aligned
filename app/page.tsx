import { createClient } from "@/lib/supabase/server";
import { NavBar, Footer } from "@/components/layout";
import { HeroSearch } from "./HeroSearch";
import { HOAGridCard } from "./HOAGridCard";
import type { HOA } from "@/types";
import { MapPinIcon, LayerIcon } from "@/components/icons/hoa-icons";

export default async function HomePage() {
  const supabase = await createClient();

  // Live stats from DB
  const { count: hoaCount } = await supabase
    .from("hoas")
    .select("*", { count: "exact", head: true });

  // Most complete HOAs for "Try" chips and grid showcase
  const { data: topHoas } = await supabase
    .from("hoas")
    .select("*")
    .order("data_completeness_percent", { ascending: false })
    .limit(6);

  // Top 3 for "Try" suggestions (most complete profiles)
  const trySuggestions = (topHoas || []).slice(0, 3).map((h: HOA) => ({
    label: h.display_name || h.legal_name,
    id: h.id,
  }));

  const displayCount = hoaCount ? `${hoaCount.toLocaleString()}+` : "3,400+";

  return (
    <div className="min-h-screen">
      <NavBar activePath="/" />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div aria-hidden="true" className="absolute inset-0 opacity-50 ha-glow" />
        {/* Dot pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50 ha-dot-pattern"
          style={{
            maskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-[1180px] mx-auto px-4 md:px-8 pt-16 md:pt-[72px] pb-12 md:pb-14 text-center">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mb-6 md:mb-8"
            style={{
              background: "white",
              border: "1px solid var(--color-ha-border)",
              color: "var(--color-ha-deep)",
              boxShadow: "0 1px 2px rgba(124,58,237,0.05)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-ha-primary)" }} />
            Independent · Resident-verified · Free to search
          </div>

          {/* Headline */}
          <h1
            className="text-[36px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-tight"
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
            className="text-base md:text-[19px] mt-5 mx-auto max-w-[640px] leading-relaxed"
            style={{
              color: "var(--color-ha-text-soft)",
              textWrap: "pretty",
            }}
          >
            The first independent Health Score for HOAs. Check your community&rsquo;s
            financial health, governance quality, and resident satisfaction for free.
          </p>

          {/* Search — client component */}
          <HeroSearch trySuggestions={trySuggestions} />

          {/* Social proof stat */}
          <p
            className="text-[13.5px] mt-6"
            style={{ color: "var(--color-ha-gray)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-space)",
                fontWeight: 700,
                color: "var(--color-ha-text)",
              }}
            >
              78 million
            </span>{" "}
            Americans live under HOA governance. It&rsquo;s time we had a say.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative border-t" style={{ borderColor: "var(--color-ha-border)", background: "rgba(255,255,255,0.7)" }}>
          <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-5 md:py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              [displayCount, "HOAs on our platform"],
              ["2", "Public data sources per profile"],
              ["100%", "Free for residents"],
              ["TX", "Starting in DFW, expanding statewide"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col gap-1">
                <span
                  className="text-lg md:text-[22px] font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-space)",
                    color: "var(--color-ha-text)",
                  }}
                >
                  {n}
                </span>
                <span className="text-xs" style={{ color: "var(--color-ha-gray)" }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="max-w-[1180px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-2xl md:text-[36px] font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.02em",
            }}
          >
            How it works
          </h2>
          <p className="text-sm md:text-base mt-3" style={{ color: "var(--color-ha-gray)" }}>
            Three steps to understanding your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              step: "01",
              title: "Search your community",
              desc: "Enter an address, HOA name, or zip code. We have data on thousands of Texas HOAs from official public records.",
            },
            {
              step: "02",
              title: "See the Health Score",
              desc: "Every HOA gets a composite score (0\u2013100) across financial health, governance, legal history, and resident satisfaction.",
            },
            {
              step: "03",
              title: "Join the conversation",
              desc: "Verify your address to leave reviews, access the private board, and help build your community\u2019s profile.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="ha-card p-6 md:p-8 flex flex-col gap-4"
            >
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--color-ha-primary)" }}
              >
                Step {step}
              </span>
              <h3
                className="text-lg md:text-xl font-semibold"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "var(--color-ha-text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              <p
                className="text-[13.5px] leading-relaxed"
                style={{
                  color: "var(--color-ha-text-soft)",
                  textWrap: "pretty",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMMUNITY GRID ─── */}
      {topHoas && topHoas.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2
                className="text-xl md:text-2xl font-semibold tracking-tight"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "var(--color-ha-text)",
                }}
              >
                Explore communities
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-ha-gray)" }}>
                Most complete profiles in DFW
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topHoas.map((hoa: HOA) => (
              <HOAGridCard key={hoa.id} hoa={hoa} />
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-[1180px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
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
          <div className="relative max-w-[680px]">
            <h2
              className="text-2xl md:text-4xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-outfit)",
                textWrap: "balance",
                letterSpacing: "-0.02em",
              }}
            >
              Your community&rsquo;s data is already in our system.
            </h2>
            <p className="text-base md:text-[17px] opacity-85 mt-4 mb-7 leading-relaxed" style={{ textWrap: "pretty" }}>
              See what we know. Free for residents, always.
            </p>
            <HeroSearch variant="dark" trySuggestions={[]} />
          </div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a
            href="/agents"
            className="ha-card p-5 md:p-6 flex items-center gap-4 hover:shadow-lg transition-shadow no-underline"
          >
            <div
              className="shrink-0"
              style={{
                color: "var(--color-ha-primary)",
              }}
            >
              <LayerIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] md:text-base font-semibold" style={{ color: "var(--color-ha-text)" }}>
                Are you a real estate agent?
              </div>
              <div className="text-[13px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>
                Help your clients make informed HOA decisions
              </div>
            </div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-ha-gray)" }}>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="/buyers"
            className="ha-card p-5 md:p-6 flex items-center gap-4 hover:shadow-lg transition-shadow no-underline"
          >
            <div
              className="shrink-0"
              style={{
                color: "var(--color-ha-primary)",
              }}
            >
              <MapPinIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] md:text-base font-semibold" style={{ color: "var(--color-ha-text)" }}>
                Buying a home?
              </div>
              <div className="text-[13px] mt-0.5" style={{ color: "var(--color-ha-gray)" }}>
                Get the full HOA Intelligence Report
              </div>
            </div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-ha-gray)" }}>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}