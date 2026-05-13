import { NavBar, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Homeowners Aligned",
  description: "Terms governing your use of the Homeowners Aligned platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="max-w-[760px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
          style={{ background: "var(--color-ha-text)", color: "white" }}
        >
          Our Terms
        </span>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
        >
          Terms of Service
        </h1>
        <p className="text-[14px] mt-3 mb-10" style={{ color: "var(--color-ha-gray)" }}>
          Last updated: May 12, 2026
        </p>

        <div className="flex flex-col gap-8 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>

          <Section title="Agreement to terms">
            <p>
              By accessing or using homeownersaligned.com (the "Platform"), you agree to be bound
              by these Terms of Service. If you do not agree, do not use the Platform. These terms
              constitute a legally binding agreement between you and Onque LLC, a Texas limited
              liability company ("we," "us," "our") operating as Homeowners Aligned.
            </p>
          </Section>

          <Section title="What the Platform does">
            <p>
              Homeowners Aligned is an informational platform that aggregates publicly available
              data about homeowner associations (HOAs), property owner associations (POAs), and
              condominium associations (COAs). We display Health Scores, board member information,
              transfer fee schedules, entity status, and other data sourced from government records.
              We also provide a space for verified residents to leave reviews and participate in
              community discussion forums.
            </p>
          </Section>

          <Section title="The Platform is not legal, financial, or real estate advice">
            <p>
              Nothing on this Platform constitutes legal advice, financial advice, real estate
              advice, or professional consultation of any kind. The information provided is for
              general educational and informational purposes only.
            </p>
            <p>
              Health Scores are calculated projections based on available public data and
              community contributions. They are not endorsements, appraisals, or guarantees
              of an HOA's actual condition. A high score does not mean an HOA is well-managed.
              A low score does not mean an HOA is poorly managed. Scores reflect the data we
              have access to, which may be incomplete.
            </p>
            <p>
              You should always consult a licensed attorney, CPA, or real estate professional
              before making decisions based on information found on this Platform. We are not
              responsible for decisions you make based on our data.
            </p>
          </Section>

          <Section title="Public records disclaimer">
            <p>
              HOA profile data on this Platform is sourced from publicly available government
              records, including the Texas Secretary of State, the Texas Comptroller of Public
              Accounts, and hoa.texas.gov (Texas Real Estate Commission). While we make reasonable
              efforts to ensure accuracy, we do not guarantee that the data is complete, current,
              or error-free.
            </p>
            <p>
              Public records may contain errors at the source. Board member names, entity statuses,
              fee schedules, and management company information may have changed since the records
              were last updated. If you find an error, please submit a correction through the
              Platform or email us at contact@homeownersaligned.com.
            </p>
          </Section>

          <Section title="Account registration">
            <p>
              Some features require a free account, including leaving reviews, accessing private
              community boards, and contributing data to HOA profiles. When you create an account,
              you agree to:
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "Provide accurate and complete registration information",
                "Keep your login credentials secure and not share them with others",
                "Notify us immediately if you suspect unauthorized access to your account",
                "Accept responsibility for all activity under your account",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </Section>

          <Section title="Address verification">
            <p>
              To leave reviews or access private community discussion boards, you must verify
              that you reside at the address associated with the HOA community. Verification
              is used solely to confirm residency and prevent fraudulent reviews. Your verified
              address is never displayed publicly. Reviews display your first name and last
              initial only.
            </p>
          </Section>

          <Section title="User-contributed content">
            <p>
              When you submit a review, post in a forum, or upload a document, you retain
              ownership of your content. By submitting content to the Platform, you grant us a
              non-exclusive, royalty-free, perpetual, worldwide license to display, distribute,
              and use that content on the Platform and in connection with our services.
            </p>
            <p>You agree that your content will not:</p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "Contain false statements presented as fact",
                "Include personal attacks, harassment, threats, or hate speech",
                "Contain spam, advertising, or promotional material",
                "Violate any applicable law or regulation",
                "Infringe on the intellectual property rights of others",
                "Include another person's private information without their consent",
                "Attempt to manipulate Health Scores or review ratings",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We reserve the right to remove content that violates these guidelines. Reviews are
              limited to one per verified address per year per HOA community.
            </p>
          </Section>

          <Section title="HOA board and management company claims">
            <p>
              HOA boards and management companies may claim their community profile on the
              Platform. Claiming a profile allows official responses to reviews and forum
              posts. Claiming does not grant the ability to remove reviews, edit Health Scores,
              or suppress public records data. Official responses are clearly labeled as such.
            </p>
          </Section>

          <Section title="Payments and subscriptions">
            <p>
              Certain features, such as Intelligence Reports, may require payment. All payments
              are processed by Stripe, Inc. Prices are displayed before purchase and include
              applicable taxes. Refund requests must be submitted within 14 days of purchase
              to contact@homeownersaligned.com. We reserve the right to change pricing with
              30 days advance notice.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              The Platform, including its design, code, scoring methodology, icons, branding,
              and original content, is owned by Onque LLC and protected by applicable intellectual
              property laws. You may not copy, reproduce, distribute, or create derivative works
              from the Platform without our written permission.
            </p>
            <p>
              Public records data displayed on the Platform is not our intellectual property. It
              belongs to the public domain as provided by the originating government agencies.
            </p>
          </Section>

          <Section title="Prohibited uses">
            <p>You agree not to:</p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "Scrape, crawl, or automatically extract data from the Platform without written permission",
                "Use the Platform to defame, harass, or threaten any individual or organization",
                "Attempt to gain unauthorized access to other user accounts or our systems",
                "Use the Platform for any illegal purpose",
                "Interfere with the security or proper functioning of the Platform",
                "Create fake accounts or misrepresent your identity or residency",
                "Use automated systems to submit reviews, forum posts, or corrections",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by Texas law, Onque LLC and its officers, employees,
              and agents shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from your use of the Platform, including but not limited
              to damages for loss of profits, data, goodwill, or other intangible losses.
            </p>
            <p>
              Our total liability to you for any claim arising from these terms or your use of the
              Platform shall not exceed the amount you have paid us in the 12 months preceding the
              claim, or $100, whichever is greater.
            </p>
            <p>
              We are not liable for the accuracy of public records data, the content of
              user-submitted reviews or forum posts, decisions made by HOA boards or management
              companies, or any action taken by third parties based on information displayed on
              the Platform.
            </p>
          </Section>

          <Section title="Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless Onque LLC and its officers,
              directors, employees, and agents from any claims, damages, losses, or expenses
              (including reasonable attorney fees) arising from your use of the Platform, your
              violation of these terms, or your violation of any rights of a third party.
            </p>
          </Section>

          <Section title="Dispute resolution">
            <p>
              Any dispute arising from these terms or your use of the Platform shall be governed
              by the laws of the State of Texas, without regard to conflict of law principles.
              You agree to attempt to resolve any dispute informally by contacting us at
              contact@homeownersaligned.com before filing any legal claim. If informal resolution
              fails, any legal action shall be filed in the state or federal courts located in
              Dallas County, Texas.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              We may suspend or terminate your account at any time for violation of these terms,
              with or without notice. Upon termination, your right to access the Platform ceases
              immediately. Provisions that by their nature should survive termination (including
              limitation of liability, indemnification, and dispute resolution) shall survive.
            </p>
            <p>
              You may delete your account at any time by contacting us at
              contact@homeownersaligned.com. Account deletion is processed within 30 days.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms from time to time. If we make material changes, we will
              notify you by email or by posting a notice on the Platform at least 30 days before
              the changes take effect. Your continued use of the Platform after the effective date
              constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="Severability">
            <p>
              If any provision of these terms is found to be unenforceable by a court of competent
              jurisdiction, the remaining provisions shall continue in full force and effect.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              If you have questions about these terms:
            </p>
            <div className="mt-3 text-[14px]" style={{ color: "var(--color-ha-text)" }}>
              <p><strong>Homeowners Aligned</strong></p>
              <p>Dallas, TX</p>
              <p>contact@homeownersaligned.com</p>
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