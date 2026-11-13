import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { AboutSidebar } from "./AboutSidebar";
import { StateSearch } from "./StateSearch";
import { ProfilePreview } from "./ProfilePreview";
import { DashboardPreview } from "./DashboardPreview";
import { ForumPreview } from "./ForumPreview";
import { ShieldIcon, FinancialsIcon, MultiUserIcon, StarIcon } from "@/components/icons/hoa-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About This Project",
  description:
    "What Homeowners Aligned is, how its experimental HOA transparency score works, and how Texas homeowners can request records from their association.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <NavBar activePath="/about" />

      <main id="main-content" className="max-w-[1180px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex gap-10 items-start">
          {/* Sidebar */}
          <AboutSidebar />

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ─── STATE SEARCH ─── */}
            <section id="states" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="text-center">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-primary)", color: "white" }}
                >
                  State guides
                </span>
                <h1
                  className="text-[32px] md:text-[44px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  About Homeowners Aligned
                </h1>
                <p
                  className="text-[15px] md:text-[17px] mt-3 mb-8 mx-auto max-w-[520px] leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  A portfolio project that turns public HOA filings into searchable
                  profiles. Pick a state to read its HOA guide.
                </p>
                <StateSearch />
                <p
                  className="text-[12px] mt-4"
                  style={{ color: "var(--color-ha-gray)" }}
                >
                  The dataset and guide cover{" "}
                  <strong style={{ color: "var(--color-ha-primary)" }}>Texas</strong>
                  {" "}only &middot; No other states were collected
                </p>
              </div>
            </section>

            {/* ─── MISSION ─── */}
            <section id="mission" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-text)", color: "white" }}
                >
                  About this project
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Honest. Open. Accountable.
                </h2>
                <div className="flex flex-col gap-5 mt-6 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                  <p>
                    Public information about a homeowners association is scattered. In Texas, the
                    management certificate sits in one state database, the entity filing and officers
                    in another, and neither is easy to search or compare.
                  </p>
                  <p>
                    Homeowners Aligned was started as a possible business to close that gap, by a
                    homeowner and licensed realtor. It is no longer being commercialized. It now
                    serves as a working demonstration of the data pipeline behind it: automated
                    collection of public records, extraction of structured data from filed PDFs,
                    matching against state entity records, and a transparency score built on the
                    result.
                  </p>
                  <p>
                    The site is read-only. There are no accounts, payments, or forms. It is not
                    affiliated with any HOA, management company, or government agency.
                  </p>
                  <p>
                    <Link
                      href="/project"
                      className="font-semibold hover:underline"
                      style={{ color: "var(--color-ha-primary)" }}
                    >
                      {"Read how it was built \u2192"}
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* ─── HOW WE SCORE ─── */}
            <section id="scoring" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-primary)", color: "white" }}
                >
                  Health Score
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  How every HOA is scored
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Every HOA in the dataset gets a projected score built from four pillars. Each
                  pillar is a checklist: a checkpoint is met when the matching piece of public
                  information is on file. The score is experimental and generated by this project.
                  It measures how much is on record, not how well an HOA is run.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: FinancialsIcon,
                    title: "Financial Health",
                    points: "25 pts",
                    desc: "Transfer fees, CC&R filings, budgets, and reserve studies. Are the books in order?",
                  },
                  {
                    icon: MultiUserIcon,
                    title: "Governance & Transparency",
                    points: "25 pts",
                    desc: "Board members, entity status, management company, registered agent. Is the HOA properly organized?",
                  },
                  {
                    icon: ShieldIcon,
                    title: "Legal History",
                    points: "25 pts",
                    desc: "Management certificates, subdivision records, CC&R recording data, and court records.",
                  },
                  {
                    icon: StarIcon,
                    title: "Resident Sentiment",
                    points: "25 pts",
                    desc: "Resident reviews and forum activity. This pillar was designed but never built, so it is always empty and is left out of the projected score.",
                  },
                ].map(({ icon: Icon, title, points, desc }) => (
                  <div
                    key={title}
                    className="ha-card p-5 md:p-6 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div style={{ color: "var(--color-ha-primary)" }}>
                          <Icon size={20} />
                        </div>
                        <span
                          className="text-[15px] font-semibold"
                          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                        >
                          {title}
                        </span>
                      </div>
                      <span
                        className="text-[12px] font-bold"
                        style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-gray)" }}
                      >
                        {points}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--color-ha-text-soft)" }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 p-5 rounded-2xl text-[13px] leading-relaxed"
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-ha-border-strong)",
                  color: "var(--color-ha-text-soft)",
                }}
              >
                <strong style={{ color: "var(--color-ha-text)" }}>Why &ldquo;Projected&rdquo; and why is it capped at 75?</strong>
                {" "}Scores use 2 public data sources: management certificates filed with the Texas
                Real Estate Commission (hoa.texas.gov) and Texas Comptroller franchise tax records.
                The projected score is capped at 75 out of 100 because public records only tell part
                of the story. The remaining points were reserved for information residents would
                contribute, such as budgets, reserve studies, and reviews. That part of the product
                was never built, so no HOA can score above 75. An HOA whose entity status is not
                ACTIVE loses 12 points, and an HOA with fewer than 5 public checkpoints is left
                unscored.{" "}
                <Link
                  href="/project#scoring"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  Full method and limitations
                </Link>
              </div>
            </section>

            {/* ─── HOW TO REQUEST RECORDS ─── */}
            <section id="request" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-text)", color: "white" }}
                >
                  Know your rights
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  How to request your HOA records
                </h2>
                <p
                  className="text-[15px] mt-4 mb-6 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Under Texas Property Code Chapter 209, every homeowner has the legal right
                  to inspect their HOA&rsquo;s books and records. This includes budgets, reserve studies,
                  meeting minutes, financial statements, and assessment history. Here is exactly
                  how to do it.
                </p>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    step: "1",
                    title: "Write a formal records request",
                    body: "Draft a written request describing the specific records you want to inspect. Be specific: \"FY2025 operating budget,\" \"reserve study,\" \"board meeting minutes from January-June 2026.\" You can request records on your own behalf or designate an attorney, CPA, or agent to inspect them for you.",
                  },
                  {
                    step: "2",
                    title: "Send it by certified mail",
                    body: "Mail your request via USPS certified mail to your HOA's mailing address (listed on their management certificate). Certified mail creates a legal paper trail with a delivery receipt. Keep a copy of everything you send.",
                  },
                  {
                    step: "3",
                    title: "Wait for a response",
                    body: "In Texas, your HOA has 10 business days to either provide the records or set a date for inspection. Other states have different timelines, and in some states there is no statutory deadline at all. Check your state's property code for the exact requirements. Regardless of timeline, document everything and follow up in writing.",
                  },
                  {
                    step: "4",
                    title: "If they refuse, you have legal recourse",
                    body: "If your HOA denies access or ignores your request, most states provide a legal path to compel disclosure. In Texas, you can file a petition with the justice of the peace and recover attorney fees and court costs. The Texas guide on this site summarizes the enforcement options.",
                  },
                ].map(({ step, title, body }) => (
                  <div key={step} className="ha-card p-5 md:p-6 flex gap-4" style={{ boxShadow: "none" }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold"
                      style={{ background: "var(--color-ha-primary)", color: "white", fontFamily: "var(--font-space)" }}
                    >
                      {step}
                    </div>
                    <div>
                      <h3
                        className="text-[15px] font-semibold mb-1.5"
                        style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                      >
                        {title}
                      </h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What you can request */}
              <div
                className="mt-6 p-5 rounded-2xl"
                style={{ background: "transparent", border: "1px solid var(--color-ha-border-strong)" }}
              >
                <h4
                  className="text-[14px] font-semibold mb-3"
                  style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                >
                  What you can request
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    "Annual operating budget",
                    "Reserve study and fund balance",
                    "Special assessment history",
                    "Board meeting minutes (7-year retention)",
                    "Financial statements and audit records",
                    "Contracts with vendors (4-year retention)",
                    "Owner account records (5-year retention)",
                    "Insurance policies and claims",
                    "CC&Rs, bylaws, and amendments",
                    "Assessment increase history",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 py-1">
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span className="text-[13px]" style={{ color: "var(--color-ha-text-soft)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-4 p-4 rounded-xl text-[13px] leading-relaxed"
                style={{ background: "transparent", border: "1px solid var(--color-ha-border-strong)", color: "var(--color-ha-text-soft)" }}
              >
                <strong style={{ color: "var(--color-ha-text)" }}>Why this matters:</strong>
                {" "}Most homeowners have no idea they have these rights. Your HOA is legally required
                to keep these records and make them available to you. When residents request records,
                boards govern more transparently. This is how accountability starts.
              </div>

              <p className="text-[12px] mt-4" style={{ color: "var(--color-ha-gray)" }}>
                Source: Texas Property Code Chapter 209, Section 209.005.{" "}
                
                <Link
                  href="/about/tx#records"
                  className="font-semibold no-underline hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  Read the full breakdown →
                </Link>
                {" "}This is a general summary for educational purposes, not legal advice.
              </p>
            </section>

            {/* ─── WHAT YOU'LL SEE ─── */}
            <section id="profile" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-text)", color: "white" }}
                >
                  HOA Profiles
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  What a profile shows
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Every HOA profile is a snapshot of what public records say about that
                  community, with its sources and retrieval dates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Health Score & Pillars",
                    desc: "An animated arc score with four expandable pillars showing exactly what data exists and what is missing.",
                  },
                  {
                    title: "Board & Management",
                    desc: "Officer names, titles, active years, management company contact info, and registered agent details.",
                  },
                  {
                    title: "Fees & Public Records",
                    desc: "Transfer fee schedules, entity status, SOS filings, formation dates, CC&R references, and certificate PDFs.",
                  },
                  {
                    title: "Entity Status Alerts",
                    desc: "If an HOA's entity status is forfeited or involuntarily ended, the profile flags it with context on what that means.",
                  },
                  {
                    title: "Sources & Dates",
                    desc: "Each section names the public source it came from, and the profile shows when each source was retrieved.",
                  },
                  {
                    title: "What Is Missing",
                    desc: "Open checkpoints show which records are not on file, so an empty field is visible rather than hidden.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="ha-card p-5 flex flex-col gap-2"
                  >
                    <span
                      className="text-[14px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                    >
                      {title}
                    </span>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--color-ha-text-soft)" }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[12px] mt-6 mb-2" style={{ color: "var(--color-ha-gray)" }}>
                Illustration with made-up sample data. It includes sections (assessments,
                reviews) that were designed but are not in the live profiles.
              </p>
              <div>
                <ProfilePreview />
              </div>
            </section>

            {/* ─── RESIDENT DASHBOARD ─── */}
            <section id="dashboard" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-primary)", color: "white" }}
                >
                  Design concept &middot; Not built
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Resident dashboard concept
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  A planned view for tracking monthly assessments, reserve fund health, board
                  meeting schedules, and community activity. Only the interface mockup below
                  exists. It uses sample data and has no backend.
                </p>
              </div>

              <div className="mt-6">
                <DashboardPreview />
              </div>
            </section>

            {/* ─── COMMUNITY FORUM ─── */}
            <section id="forum" className="mb-16 md:mb-20 scroll-mt-24">
              <div className="max-w-[680px]">
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ background: "var(--color-ha-primary)", color: "white" }}
                >
                  Design concept &middot; Not built
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Community forum concept
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  The original product plan gave each HOA a discussion board for verified
                  residents. It was designed but not built. The cards and mockup below describe
                  the intended behavior and use sample data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Public threads",
                    desc: "Planned: titles and previews visible to everyone, full threads for signed-in residents.",
                  },
                  {
                    title: "Verified posting",
                    desc: "Planned: only address-verified residents could create threads and reply.",
                  },
                  {
                    title: "Board responses",
                    desc: "Planned: HOA boards could claim their profile and respond to resident concerns.",
                  },
                  {
                    title: "Categorized topics",
                    desc: "Planned: threads grouped by topic, such as financial, maintenance, elections, rules, and amenities.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="ha-card p-5 flex flex-col gap-2"
                  >
                    <span
                      className="text-[14px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
                    >
                      {title}
                    </span>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--color-ha-text-soft)" }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <ForumPreview />
              </div>
            </section>

            {/* ─── JOIN ─── */}
            <section id="join" className="scroll-mt-24">
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
                <div className="relative max-w-[540px]">
                  <h2
                    className="text-2xl md:text-[36px] font-semibold tracking-tight leading-[1.1]"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    See how the system was built
                  </h2>
                  <p className="text-[15px] md:text-[17px] opacity-85 mt-4 mb-7 leading-relaxed">
                    The technical case study covers the data sources, the document-parsing
                    pipeline, the database, the scoring method, and the known limitations.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/project"
                      className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                      style={{ background: "white", color: "var(--color-ha-deep)" }}
                    >
                      Read the case study
                    </Link>
                    <Link
                      href="/search"
                      className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                    >
                      Explore the dataset
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}