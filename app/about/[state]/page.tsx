import { notFound } from "next/navigation";
import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { STATE_PATHS, type StateCode } from "@/components/icons/state-paths";
import { StateOutline, getStateName } from "@/components/icons/StateOutline";
import { StateSidebar } from "./StateSidebar";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const code = state.toUpperCase();
  if (!(code in STATE_PATHS)) return { title: "State Not Found" };
  const name = getStateName(code);
  const isActive = ACTIVE_STATES.includes(code);

  return {
    title: `${name} HOA Guide`,
    description: isActive
      ? `How HOAs, POAs, and COAs operate in ${name}: the governing statutes, records access, meetings, and where public HOA records are filed.`
      : `${name} is not covered by this portfolio project, which collected public HOA records for Texas only.`,
    // Only states with real content are worth indexing.
    robots: isActive ? undefined : { index: false, follow: true },
  };
}

const ACTIVE_STATES = ["TX"];

const TX_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "types", label: "Types of Associations" },
  { id: "ch209", label: "Chapter 209 (POA)" },
  { id: "certificates", label: "Management Certificates" },
  { id: "records", label: "Records Access" },
  { id: "meetings", label: "Open Board Meetings" },
  { id: "voting", label: "Voting & Elections" },
  { id: "enforcement", label: "Enforcement & Fines" },
  { id: "liens", label: "Assessments & Liens" },
  { id: "ch82", label: "Chapter 82 (COA)" },
  { id: "coa-management", label: "COA Management" },
  { id: "coa-maintenance", label: "Maintenance & Insurance" },
  { id: "coa-records", label: "COA Records" },
  { id: "comparison", label: "POA vs COA" },
  { id: "find-info", label: "How to Find Info" },
];

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  const code = state.toUpperCase() as StateCode;

  if (!(code in STATE_PATHS)) notFound();

  const name = getStateName(code);
  const isActive = ACTIVE_STATES.includes(code);

  if (!isActive) {
    return <InactiveStatePage code={code} name={name} />;
  }

  return <ActiveStatePage code={code} name={name} />;
}

/* ═══════════════════════════════════════════════════
   INACTIVE STATE — Waitlist
   ═══════════════════════════════════════════════════ */
function InactiveStatePage({ code, name }: { code: StateCode; name: string }) {
  return (
    <div className="min-h-screen">
      <NavBar activePath="/about" />

      <main id="main-content" className="max-w-[1180px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-20 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
          <StateOutline code={code} variant="background" />
        </div>

        <div className="relative z-10 max-w-[440px] mx-auto text-center">
          <div className="flex justify-center mb-6" style={{ height: 160, overflow: "visible" }}>
            <StateOutline code={code} variant="header" width={120} />
          </div>

          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
            style={{ background: "var(--color-ha-text)", color: "white" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-ha-primary)" }} />
            Not in this dataset
          </span>

          <h1
            className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
          >
            {name + " is not covered"}
          </h1>

          <p className="text-[15px] mt-3 mb-8 leading-relaxed mx-auto max-w-[400px]" style={{ color: "var(--color-ha-text-soft)" }}>
            This portfolio project only collected records for Texas, where the
            state publishes HOA management certificates as open data. No
            records for {name} were gathered, and the project is not being
            expanded.
          </p>

          <div className="ha-card-frosted p-6 md:p-8 text-left">
            <h2
              className="text-[16px] font-semibold"
              style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
            >
              What you can explore instead
            </h2>
            <ul className="flex flex-col gap-3 mt-4 text-[14px]">
              <li>
                <Link
                  href="/about/tx"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  {"The Texas HOA guide \u2192"}
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  {"Dallas-Fort Worth HOA records \u2192"}
                </Link>
              </li>
              <li>
                <Link
                  href="/project"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--color-ha-primary)" }}
                >
                  {"How the data pipeline was built \u2192"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACTIVE STATE — Texas Educational Content
   ═══════════════════════════════════════════════════ */
function ActiveStatePage({ code, name }: { code: StateCode; name: string }) {
  return (
    <div className="min-h-screen">
      <NavBar activePath="/about" />

      <main id="main-content" className="max-w-[1180px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ─── HEADER ─── */}
            <section id="overview" className="scroll-mt-24 mb-12 md:mb-16">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start relative">
                {/* Mobile — small state floating top-right */}
                <div
                  className="md:hidden absolute right-0 top-0 pointer-events-none"
                  style={{ overflow: "visible", opacity: 0.6 }}
                >
                  <StateOutline code={code} variant="header" width={90} />
                </div>
                {/* Desktop — larger state on the left */}
                <div className="hidden md:block shrink-0 pt-4" style={{ minHeight: 200, overflow: "visible" }}>
                  <StateOutline code={code} variant="header" width={160} />
                </div>
                <div className="flex-1">
                  <span
                    className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full mb-4"
                    style={{ background: "var(--color-ha-primary)", color: "white" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "white" }} />
                    Covered in this dataset
                  </span>
                  <h1
                    className="text-[32px] md:text-[44px] font-semibold leading-[1.1] tracking-tight"
                    style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.03em" }}
                  >
                    HOAs in {name}
                  </h1>
                  <p className="text-[15px] md:text-[17px] mt-3 leading-relaxed max-w-[600px]" style={{ color: "var(--color-ha-text-soft)" }}>
                    A complete guide to homeowner associations in {name}. Two chapters of Texas law govern everything: Chapter 209 for POAs and Chapter 82 for condominiums. Here is what every homeowner has a right to know.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <a
                      href="https://statutes.capitol.texas.gov/Docs/PR/htm/PR.209.htm"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-[10px] no-underline"
                      style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-primary)", border: "1px solid var(--color-ha-border)" }}
                    >
                      {"Read Chapter 209 \u2192"}
                    </a>
                    <a
                      href="https://statutes.capitol.texas.gov/Docs/PR/htm/PR.82.htm"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-[10px] no-underline"
                      style={{ background: "var(--color-ha-surface)", color: "var(--color-ha-primary)", border: "1px solid var(--color-ha-border)" }}
                    >
                      {"Read Chapter 82 \u2192"}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Content wrapper */}
            <div className="max-w-[720px] flex flex-col gap-14 md:gap-18">

              {/* ─── TYPES ─── */}
              <section id="types" className="scroll-mt-24">
                <SectionHeading>Types of associations</SectionHeading>
                <P>Texas has three main types of residential associations. While they share common governance structures, each operates under different sections of Texas law with different rules, rights, and compliance requirements.</P>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {[
                    { title: "HOA / POA", sub: "Chapter 209", desc: "Governs residential subdivisions with mandatory membership. Most common in DFW. If it collects assessments from residential property owners, Chapter 209 applies." },
                    { title: "COA", sub: "Chapter 82", desc: "Governs condominiums where owners hold separate units and share common elements. Different financial structures and higher maintenance obligations." },
                    { title: "POA vs COA", sub: "Key difference", desc: "POA owners maintain their own lot. COA owners share responsibility for the building structure itself. This makes COA finances significantly more critical." },
                  ].map(({ title, sub, desc }) => (
                    <div key={title} className="ha-card p-4">
                      <span className="text-[14px] font-semibold" style={{ color: "var(--color-ha-text)" }}>{title}</span>
                      <span className="block text-[11px] font-semibold mt-0.5" style={{ color: "var(--color-ha-primary)" }}>{sub}</span>
                      <p className="text-[12px] mt-2 leading-relaxed" style={{ color: "var(--color-ha-gray)" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── CHAPTER 209 HEADER ─── */}
              <section id="ch209" className="scroll-mt-24">
                <div className="rounded-2xl p-6 md:p-8" style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: "var(--color-ha-primary)", color: "white" }}>Chapter 209</span>
                  <h2 className="text-[22px] md:text-[26px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}>
                    Texas Residential Property Owners Protection Act
                  </h2>
                  <P>This law governs every POA in Texas that requires mandatory membership and collects assessments. It does not apply to condominiums. If an entity collects assessments from residential property owners, Chapter 209 applies regardless of what the entity calls itself.</P>
                </div>
              </section>

              {/* ─── MANAGEMENT CERTIFICATES ─── */}
              <section id="certificates" className="scroll-mt-24">
                <SectionHeading>Management certificates</SectionHeading>
                <Ref>Section 209.004</Ref>
                <P>Every POA must record a management certificate in the county where the subdivision is located. The certificate must include the subdivision name, association name, recording data, mailing address, managing agent details (name, address, phone, email), the website where governing documents are posted, and all fees charged during property transfers.</P>
                <P>If any information changes, the HOA must file an amended certificate within 30 days. SB 1588 requires the HOA to electronically file the certificate with TREC within 7 days, and TREC must make this data publicly accessible. That public database is hoa.texas.gov.</P>
                <Callout>An HOA without a current management certificate is either non-compliant or defunct. If they fail to file, they lose the ability to enforce liens against a purchaser for amounts due before the sale, and cannot charge attorney fees or interest during the non-compliance period.</Callout>
              </section>

              {/* ─── RECORDS ACCESS ─── */}
              <section id="records" className="scroll-mt-24">
                <SectionHeading>Records access</SectionHeading>
                <Ref>Section 209.005</Ref>
                <P>HOAs must make their books and records, including financial records, open and reasonably available for examination by any owner. An owner can designate an agent, attorney, or CPA to examine records on their behalf.</P>

                <SubHeading>The process</SubHeading>
                <CheckList items={[
                  "Send a written request by certified mail describing what you want",
                  "HOA has 10 business days to provide the records or inspection dates",
                  "If they need more time, they must notify you with a new deadline no later than 15 business days",
                  "HOA can charge reasonable copy costs but must have a recorded cost policy first",
                ]} />

                <SubHeading>Document retention requirements</SubHeading>
                <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-ha-border)" }}>
                  <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--color-ha-surface)" }}>
                        <th className="text-left py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)" }}>Document type</th>
                        <th className="text-right py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)", fontFamily: "var(--font-space)" }}>Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Founding documents (CC&Rs, bylaws, certificates)", "Permanently"],
                        ["Financial books and records", "7 years"],
                        ["Owner account records", "5 years"],
                        ["Contracts (1+ year term)", "4 years after expiration"],
                        ["Meeting minutes (owners and board)", "7 years"],
                        ["Tax returns and audit records", "7 years"],
                      ].map(([doc, ret], i) => (
                        <tr key={doc} style={{ borderTop: "1px solid var(--color-ha-border)" }}>
                          <td className="py-2.5 px-4" style={{ color: "var(--color-ha-text-soft)" }}>{doc}</td>
                          <td className="py-2.5 px-4 text-right font-semibold" style={{ fontFamily: "var(--font-space)", color: "var(--color-ha-text)" }}>{ret}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout>If the HOA denies access, you can file a petition with the justice of the peace. If the JP rules in your favor, the HOA can be ordered to release records and pay your attorney fees and court costs. You can deduct those amounts from future assessments.</Callout>
              </section>

              {/* ─── OPEN BOARD MEETINGS ─── */}
              <section id="meetings" className="scroll-mt-24">
                <SectionHeading>Open board meetings</SectionHeading>
                <Ref>Section 209.0051</Ref>
                <P>Regular and special board meetings must be open to owners. The board can go into closed executive session only for personnel matters, pending litigation, contract negotiations, enforcement actions, confidential attorney communications, or privacy matters.</P>

                <SubHeading>Notice requirements</SubHeading>
                <CheckList items={[
                  "Mail at least 10 days before OR post at least 144 hours (6 days) before a regular meeting",
                  "Post at least 72 hours before a special meeting",
                  "Post conspicuously in common areas AND email to owners who registered an email",
                ]} />

                <SubHeading>Actions that require an open meeting with prior notice</SubHeading>
                <P>The board cannot take action outside of a noticed meeting on these critical matters: fines and damage assessments, foreclosure initiation, enforcement actions, assessment increases and special assessments, architectural appeal decisions, suspending an owner&rsquo;s rights, borrowing or lending money, adopting or amending governing documents, approving budgets, buying or selling property, filling board vacancies, capital improvements, and electing officers.</P>
              </section>

              {/* ─── VOTING ─── */}
              <section id="voting" className="scroll-mt-24">
                <SectionHeading>Voting rights and elections</SectionHeading>
                <Ref>Sections 209.0055 &ndash; 209.00594</Ref>
                <CheckList items={[
                  "No dedicatory instrument can disqualify an owner from voting in board elections",
                  "Board members whose terms expire must be elected by owners \u2014 they cannot self-appoint indefinitely",
                  "Associations with 100+ lots must solicit candidates at least 10 days before distributing ballots",
                  "Owners can vote in person, by proxy, by absentee ballot, or electronically",
                  "Any owner can demand a recount within 15 days of results",
                  "Candidates and their relatives cannot tabulate ballots",
                  "No one living in the same household as a current board member can serve simultaneously (except associations with fewer than 10 residences)",
                  "A board member convicted of a felony within 20 years is immediately removed",
                ]} />
              </section>

              {/* ─── ENFORCEMENT ─── */}
              <section id="enforcement" className="scroll-mt-24">
                <SectionHeading>Enforcement, fines, and hearings</SectionHeading>
                <Ref>Sections 209.006 &ndash; 209.007</Ref>
                <P>Before an HOA can suspend common area access, file suit, charge for property damage, levy a fine, or report to credit agencies, they must give written notice by certified mail including a description of the violation, the amount due, the owner&rsquo;s right to cure (if curable), the right to request a hearing within 30 days, and information about military servicemember protections.</P>

                <SubHeading>Curable vs uncurable violations</SubHeading>
                <P>Curable violations (parking, maintenance, unapproved modifications, ongoing noise) must include a reasonable cure period. If the owner cures in time, no fine can be assessed. Uncurable violations (fireworks, one-time noise, property damage) can be fined without a cure period but still require notice and hearing rights.</P>

                <SubHeading>The hearing process</SubHeading>
                <CheckList items={[
                  "HOA must hold the hearing within 30 days of receiving the request",
                  "Must give 10 days notice of date, time, and place",
                  "At least 10 days before the hearing, HOA must provide ALL documents, photos, and communications they intend to present",
                  "If they don\u2019t provide the packet on time, automatic 15-day postponement",
                  "HOA presents their case first, then the owner presents their side",
                  "Either party can make an audio recording",
                ]} />
              </section>

              {/* ─── LIENS ─── */}
              <section id="liens" className="scroll-mt-24">
                <SectionHeading>Assessments, collections, and foreclosure</SectionHeading>
                <Ref>Sections 209.008 &ndash; 209.0094</Ref>
                <P>Before turning to collections, the HOA must send certified mail specifying each delinquent amount, payment plan options, and at least 45 days to cure. Payments are applied in this order: delinquent assessments first, then current assessments, then assessment-related attorney fees, then fines, then other amounts. Fines can never be prioritized over assessments.</P>

                <Callout>Foreclosure cannot be based solely on unpaid fines or attorney fees from fines. Judicial foreclosure is required \u2014 the HOA must get a court order. The owner has a 180-day right of redemption after foreclosure. Two written notices of delinquency are required before lien filing, and the HOA cannot file a lien until 90 days after the second notice.</Callout>
              </section>

              {/* ─── CHAPTER 82 HEADER ─── */}
              <section id="ch82" className="scroll-mt-24">
                <div className="rounded-2xl p-6 md:p-8" style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: "var(--color-ha-primary)", color: "white" }}>Chapter 82</span>
                  <h2 className="text-[22px] md:text-[26px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}>
                    Uniform Condominium Act
                  </h2>
                  <P>This law governs all condominiums in Texas recorded on or after January 1, 1994. The key distinction from Chapter 209: a condominium is a form of real property where portions are designated for separate ownership (units) and the remainder for common ownership (common elements). Owners hold undivided interests in the common elements directly.</P>
                </div>
              </section>

              {/* ─── COA MANAGEMENT ─── */}
              <section id="coa-management" className="scroll-mt-24">
                <SectionHeading>COA association management</SectionHeading>
                <Ref>Sections 82.101 &ndash; 82.110</Ref>
                <P>The unit owners&rsquo; association must be organized as a corporation. The board can adopt and amend bylaws, hire and fire managing agents, sue and be sued, regulate use and appearance, impose fines (with notice and hearing), and borrow money. Board members are fiduciaries of the unit owners.</P>

                <SubHeading>Declarant control period</SubHeading>
                <P>The declaration may provide for a period where the developer appoints and removes board members. This terminates no later than 120 days after 75% of units are conveyed. At 50% conveyance, at least one-third of board members must be elected by non-declarant owners.</P>

                <Callout>Communities still in the declarant control period have limited owner governance. Owners have less say in financial decisions during this period.</Callout>
              </section>

              {/* ─── COA MAINTENANCE ─── */}
              <section id="coa-maintenance" className="scroll-mt-24">
                <SectionHeading>Maintenance and insurance</SectionHeading>
                <Ref>Sections 82.107 and 82.111</Ref>
                <P>This is a critical difference from POAs. The association is responsible for maintenance, repair, and replacement of common elements (structure, roof, exterior, shared systems). The unit owner is responsible for their unit interior, plus utility installations serving only their unit and windows and doors serving only their unit.</P>

                <SubHeading>Insurance requirements</SubHeading>
                <CheckList items={[
                  "Association must maintain property insurance on common elements at 80%+ of replacement cost",
                  "Must maintain commercial general liability insurance",
                  "Policies must name each unit owner as insured and waive subrogation against owners",
                  "Damaged portions must be promptly repaired unless 80%+ of owners vote not to rebuild",
                  "Association must obtain annual independent audit",
                ]} />

                <Callout>Underfunded reserves in a COA can mean deferred structural maintenance. This is why condo association finances matter significantly more than POA finances. The association is responsible for the building itself.</Callout>
              </section>

              {/* ─── COA RECORDS ─── */}
              <section id="coa-records" className="scroll-mt-24">
                <SectionHeading>COA records and transparency</SectionHeading>
                <Ref>Sections 82.114 &ndash; 82.1142</Ref>
                <P>Record access provisions mirror Chapter 209 almost exactly: 10 business days to respond, same retention requirements, same JP court enforcement if access is denied. COAs must also keep detailed financial records complying with GAAP, construction plans and specifications, and annual independent audits.</P>

                <SubHeading>Online document posting (new, effective 9/1/2025)</SubHeading>
                <P>Condos with 60+ units OR any condo that uses a management company must make their current dedicatory instruments available on an internet website accessible to association members. Non-compliance is a governance red flag.</P>

                <SubHeading>Foreclosure differences</SubHeading>
                <P>COA liens cannot consist solely of fines. The owner has a 90-day right of redemption after foreclosure, which is shorter than the 180 days under Chapter 209 for POAs. The association can bid for and purchase the unit at foreclosure.</P>
              </section>

              {/* ─── COMPARISON TABLE ─── */}
              <section id="comparison" className="scroll-mt-24">
                <SectionHeading>POA vs COA comparison</SectionHeading>
                <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-ha-border)" }}>
                  <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--color-ha-surface)" }}>
                        <th className="text-left py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)" }}>Issue</th>
                        <th className="text-left py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)" }}>Ch. 209 (POA)</th>
                        <th className="text-left py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)" }}>Ch. 82 (COA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Applies to", "Residential subdivisions", "Condominiums"],
                        ["Maintenance", "Owner maintains lot; HOA maintains common areas", "HOA maintains building structure; owner maintains unit interior"],
                        ["Insurance mandate", "Not required by Ch. 209", "80%+ replacement cost required"],
                        ["Annual audit", "Not required", "Required as common expense"],
                        ["Foreclosure redemption", "180 days", "90 days"],
                        ["Resale certificate", "Not required by law", "Required, max $375 fee"],
                        ["Buyer cancellation", "Not specified", "5 days after receiving docs"],
                        ["Online doc posting", "If HOA has website", "Required for 60+ units or any w/ mgmt company"],
                        ["Financial risk", "Lower", "Higher \u2014 deferred maintenance can be catastrophic"],
                      ].map(([issue, poa, coa], i) => (
                        <tr key={issue} style={{ borderTop: "1px solid var(--color-ha-border)" }}>
                          <td className="py-2.5 px-4 font-semibold" style={{ color: "var(--color-ha-text)" }}>{issue}</td>
                          <td className="py-2.5 px-4" style={{ color: "var(--color-ha-text-soft)" }}>{poa}</td>
                          <td className="py-2.5 px-4" style={{ color: "var(--color-ha-text-soft)" }}>{coa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ─── HOW TO FIND INFO ─── */}
              <section id="find-info" className="scroll-mt-24">
                <SectionHeading>How to find information about your HOA</SectionHeading>
                <P>Texas requires HOAs to file management certificates and maintain public records. Here is where to find them.</P>
                <div className="flex flex-col gap-4 mt-4">
                  {[
                    { source: "hoa.texas.gov", desc: "Management certificates with fee schedules, management company info, CC&R references, and subdivision data.", url: "https://www.hoa.texas.gov" },
                    { source: "Texas Comptroller", desc: "Board members, entity status, registered agent, SOS file number, and formation date.", url: "https://mycpa.cpa.state.tx.us/coa/" },
                    { source: "County Clerk", desc: "Deed restrictions, liens, lawsuits, and recorded CC&R instruments.", url: null },
                    { source: "County Appraisal District", desc: "Property values, tax records, and subdivision information.", url: null },
                  ].map(({ source, desc, url }) => (
                    <div key={source} className="ha-card p-4 flex items-start gap-3">
                      <span className="text-[13px] font-semibold shrink-0 mt-0.5" style={{ color: "var(--color-ha-primary)", minWidth: 140 }}>
                        {source}
                      </span>
                      <div className="flex-1">
                        <span className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>{desc}</span>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener"
                            className="block text-[12px] font-semibold mt-1 no-underline hover:underline"
                            style={{ color: "var(--color-ha-primary)" }}
                          >
                            {"Visit \u2192"}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── CTA ─── */}
              <section className="scroll-mt-24">
                <div className="rounded-2xl p-6 md:p-8" style={{ background: "var(--color-ha-surface)", border: "1px solid var(--color-ha-border)" }}>
                  <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}>
                    Search {name} HOAs
                  </h3>
                  <p className="text-[14px] mt-2 mb-4" style={{ color: "var(--color-ha-text-soft)" }}>
                    This project holds profiles for more than 3,000 Dallas-Fort Worth HOAs, each with a projected score, board member data, and transfer fee schedules drawn from public filings. No account is needed.
                  </p>
                  <p className="text-[12px] mb-4" style={{ color: "var(--color-ha-gray)" }}>
                    This guide is a general summary for educational purposes and is not legal advice. Statutes change; read the linked chapters for the current text.
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
                    style={{ background: "var(--color-ha-primary)", color: "white" }}
                  >
                    {"Search HOAs \u2192"}
                  </Link>
                </div>
              </section>

            </div>
          </div>

          {/* Sidebar — right side */}
          <div className="hidden lg:block">
            <StateSidebar sections={TX_SECTIONS} />
          </div>
        </div>
      </main>

      {/* Mobile sidebar toggle */}
      <StateSidebar sections={TX_SECTIONS} />

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[22px] md:text-[26px] font-semibold mb-4"
      style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[16px] font-semibold mt-6 mb-2"
      style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed mt-3" style={{ color: "var(--color-ha-text-soft)" }}>
      {children}
    </p>
  );
}

function Ref({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-semibold mb-1" style={{ color: "var(--color-ha-primary)" }}>
      {children}
    </span>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-4 p-4 rounded-xl text-[13px] leading-relaxed"
      style={{ background: "transparent", border: "1px solid var(--color-ha-border-strong)", color: "var(--color-ha-text-soft)" }}
    >
      {children}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2.5">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="text-[14px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}