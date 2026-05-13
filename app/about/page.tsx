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
  title: "About | Homeowners Aligned",
  description:
    "Learn about Homeowners Aligned, how we score HOAs, and explore homeowner rights in your state.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <NavBar activePath="/about" />

      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-10 md:py-16">
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
                  50 States
                </span>
                <h1
                  className="text-[32px] md:text-[44px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Search your state
                </h1>
                <p
                  className="text-[15px] md:text-[17px] mt-3 mb-8 mx-auto max-w-[520px] leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Learn how HOAs, POAs, and COAs operate in your state.
                  Understand your rights as a homeowner.
                </p>
                <StateSearch />
                <p
                  className="text-[12px] mt-4"
                  style={{ color: "var(--color-ha-gray)" }}
                >
                  Currently live in{" "}
                  <strong style={{ color: "var(--color-ha-primary)" }}>Texas</strong>
                  {" "}&middot; All other states: join the waitlist
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
                  Our mission
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
                    78 million Americans live under HOA governance. Most have no easy way to understand
                    how their community is managed, where their dues go, or whether their board is
                    acting in their best interest.
                  </p>
                  <p>
                    Homeowners Aligned exists to change that. We aggregate public records, surface
                    governance data, and give every resident a voice through verified reviews and
                    community discussion.
                  </p>
                  <p>
                    We are not backed by venture capital. We are not affiliated with any management
                    company. We are an independent platform built by a homeowner and licensed realtor
                    who saw the transparency gap firsthand.
                  </p>
                  <p style={{ color: "var(--color-ha-text)", fontWeight: 600 }}>
                    Transparency builds stronger communities.
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
                  How we score every HOA
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Every HOA on our platform receives a projected Health Score from 0 to 100,
                  built from four pillars. The score starts with public data and grows as the
                  community contributes.
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
                    desc: "Verified reviews and community forum activity. What do the people who live there actually think?",
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
                <strong style={{ color: "var(--color-ha-text)" }}>Why "Projected" and why is it capped at 75?</strong>
                {" "}Our scores are currently based on 2 public data sources: Texas Secretary of State
                and hoa.texas.gov management certificates. The projected score is capped at 75 out of 100
                because public records alone can only tell part of the story. The remaining 25 points come
                from community engagement: verified resident reviews, uploaded budgets, reserve studies,
                and forum activity. An HOA cannot reach 100 without its residents participating. This is
                by design. Transparency is a two-way street.
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
                  to inspect their HOA's books and records. This includes budgets, reserve studies,
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
                    body: "If your HOA denies access or ignores your request, most states provide a legal path to compel disclosure. In Texas, you can file a petition with the justice of the peace and recover attorney fees and court costs. Your state page on our platform explains the specific enforcement options available to you.",
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
                
                 <a href="/about/tx#records"
                  className="font-semibold no-underline hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  Read the full breakdown →
                </a>
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
                  {"What you\u2019ll see"}
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Every HOA profile is a complete transparency snapshot. Here is what we surface
                  for each community.
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
                    desc: "If an HOA has been forfeited or involuntarily terminated, we flag it immediately with context on what it means.",
                  },
                  {
                    title: "Verified Reviews",
                    desc: "Address-verified residents rate their HOA across five categories. One review per address per year.",
                  },
                  {
                    title: "Community Forum",
                    desc: "A private, verified-resident discussion board for your community. Public threads visible, full access requires signup.",
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
                  Coming soon
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Your community dashboard
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Track your monthly assessment, reserve fund health, board meeting
                  schedules, and community activity. All in one place, updated by
                  verified residents like you.
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
                  Coming soon
                </span>
                <h2
                  className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "var(--color-ha-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Community-first discussion
                </h2>
                <p
                  className="text-[15px] mt-4 mb-8 leading-relaxed"
                  style={{ color: "var(--color-ha-text-soft)" }}
                >
                  Every HOA gets a private discussion board. Verified residents can share updates,
                  ask questions, and hold their board accountable in a space that belongs to them.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Public threads",
                    desc: "Titles and previews visible to everyone. Full content requires a free account.",
                  },
                  {
                    title: "Verified posting",
                    desc: "Only address-verified residents can create threads and reply. No anonymous trolling.",
                  },
                  {
                    title: "Board responses",
                    desc: "HOA boards can claim their profile and respond directly to resident concerns.",
                  },
                  {
                    title: "Categorized topics",
                    desc: "Financial, maintenance, board elections, rules, amenities — organized by what matters.",
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
                    Ready to hold your HOA accountable?
                  </h2>
                  <p className="text-[15px] md:text-[17px] opacity-85 mt-4 mb-7 leading-relaxed">
                    Create a free account to leave verified reviews, access community boards,
                    and help build your {"community\u2019s"} transparency profile.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/auth/register"
                      className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                      style={{ background: "white", color: "var(--color-ha-deep)" }}
                    >
                      Create free account
                    </a>
                    <a
                      href="/"
                      className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                    >
                      Search HOAs
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}