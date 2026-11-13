import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the Homeowners Aligned portfolio site: what it is, what it is not, and the limits on relying on its data.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main id="main-content" className="max-w-[760px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
          style={{ background: "var(--color-ha-text)", color: "white" }}
        >
          Terms
        </span>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
        >
          Terms of Use
        </h1>
        <p className="text-[14px] mt-3 mb-10" style={{ color: "var(--color-ha-gray)" }}>
          Last updated: November 12, 2026
        </p>

        <div className="flex flex-col gap-8 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>

          <Section title="About these terms">
            <p>
              These terms apply to homeownersaligned.com (the &ldquo;Site&rdquo;), operated by
              Onque LLC, a Texas limited liability company (&ldquo;we,&rdquo; &ldquo;us&rdquo;).
              By using the Site you agree to them. If you do not agree, please do not use
              the Site.
            </p>
          </Section>

          <Section title="What the Site is">
            <p>
              Homeowners Aligned is a technical portfolio demonstration. It shows how
              publicly available data about homeowner associations (HOAs), property owner
              associations (POAs), and condominium associations (COAs) can be collected,
              structured, and presented. It is not an active commercial service. There are
              no accounts, subscriptions, or paid features.
            </p>
            <p>
              The Site may be changed, taken offline, or left without updates at any time.
              See the{" "}
              <Link href="/disclaimer" className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                project disclaimer
              </Link>{" "}
              for a plain-language summary.
            </p>
          </Section>

          <Section title="Not legal, financial, or real estate advice">
            <p>
              Nothing on the Site is legal advice, financial advice, real estate advice, or
              professional consultation of any kind. The information is provided for general
              educational and demonstration purposes only.
            </p>
            <p>
              Scores are experimental indicators calculated by this project from the public
              data it holds. They are not endorsements, appraisals, official ratings, or
              guarantees of an HOA&rsquo;s actual condition. A high score does not mean an HOA
              is well managed. A low score does not mean an HOA is poorly managed. Scores
              reflect how much information is on file, which may be incomplete.
            </p>
            <p>
              Consult a licensed attorney, CPA, or real estate professional, and check the
              original public records, before making any decision. We are not responsible
              for decisions made based on the Site.
            </p>
          </Section>

          <Section title="Public records disclaimer">
            <p>
              HOA profile data comes from publicly available government records, including
              management certificates filed with the Texas Real Estate Commission
              (hoa.texas.gov) and records from the Texas Comptroller of Public Accounts.
              Some fields were extracted from filed PDF documents by automated software,
              including a language model, and HOAs were matched to state entity records by
              name. Both steps can introduce errors.
            </p>
            <p>
              The data is a snapshot from when it was retrieved and is not being kept
              current. Board members, entity statuses, fee schedules, and management company
              details may have changed. We do not guarantee that any record is complete,
              current, or correct. To report an error or request removal of a record, email{" "}
              {CONTACT_EMAIL}.
            </p>
            <p>
              The Site is not affiliated with, endorsed by, or operated by any HOA,
              management company, or government agency.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              The Site&rsquo;s design, branding, icons, and original written content are owned
              by Onque LLC. Source code that has been published in the project&rsquo;s public
              repository is available under the license stated there.
            </p>
            <p>
              Public records displayed on the Site are not our intellectual property. They
              originate from the government agencies that publish them.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "Use the Site to defame, harass, or threaten any individual or organization",
                "Present the Site's data or scores as official, verified, or current",
                "Overload the Site or its database with automated requests",
                "Attempt to gain unauthorized access to our systems",
                "Interfere with the security or proper functioning of the Site",
                "Use the Site for any illegal purpose",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg aria-hidden="true" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="No warranty">
            <p>
              The Site is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
              warranties of any kind, express or implied, including accuracy, completeness,
              fitness for a particular purpose, and availability.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by Texas law, Onque LLC and its officers,
              employees, and agents shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of the Site, including
              but not limited to damages for loss of profits, data, goodwill, or other
              intangible losses.
            </p>
            <p>
              Our total liability to you for any claim arising from these terms or your use
              of the Site shall not exceed $100.
            </p>
            <p>
              We are not liable for the accuracy of public records data, for errors
              introduced by automated extraction or matching, for decisions made by HOA
              boards or management companies, or for any action taken by third parties based
              on information displayed on the Site.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of the State of Texas, without regard to
              conflict of law principles. Please contact us at {CONTACT_EMAIL} to try to
              resolve any dispute informally first. If that fails, any legal action shall be
              filed in the state or federal courts located in Dallas County, Texas.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms. Changes take effect when the updated terms are
              posted here with a new date.
            </p>
          </Section>

          <Section title="Severability">
            <p>
              If any provision of these terms is found to be unenforceable by a court of
              competent jurisdiction, the remaining provisions shall continue in full force
              and effect.
            </p>
          </Section>

          <Section title="Contact">
            <p>If you have questions about these terms:</p>
            <div className="mt-3 text-[14px]" style={{ color: "var(--color-ha-text)" }}>
              <p><strong>Homeowners Aligned</strong></p>
              <p>Dallas, TX</p>
              <p>{CONTACT_EMAIL}</p>
            </div>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-[20px] font-semibold mb-3"
        style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
