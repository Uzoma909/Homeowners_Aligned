import { NavBar, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Homeowners Aligned",
  description: "How Homeowners Aligned collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="max-w-[760px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
          style={{ background: "var(--color-ha-text)", color: "white" }}
        >
          Our Policy
        </span>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[14px] mt-3 mb-10" style={{ color: "var(--color-ha-gray)" }}>
          Last updated: May 12, 2026
        </p>

        <div className="flex flex-col gap-8 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>

          <Section title="Who we are">
            <p>
              Homeowners Aligned is a transparency platform for homeowner associations,
              operated by Onque LLC, a Texas limited liability company. When this policy
              refers to "we," "us," or "our," it means Homeowners Aligned at
              homeownersaligned.com.
            </p>
            <p>
              For questions about this policy or your data, contact us at{" "}
              <strong style={{ color: "var(--color-ha-text)" }}>contact@homeownersaligned.com</strong>.
            </p>
          </Section>

          <Section title="What personal data we collect">
            <p>We collect different types of data depending on how you use the platform:</p>

            <SubSection title="Account information">
              <p>
                When you create an account, we collect your name, email address, and password
                (stored as a cryptographic hash, never in plain text). If you verify your address
                to leave reviews or access private community boards, we collect your mailing address.
                Phone number is optional and only collected if you provide it.
              </p>
            </SubSection>

            <SubSection title="Payment information">
              <p>
                If you purchase a premium report or subscription, payment is processed by Stripe, Inc.
                We do not store your credit card number, CVV, or full card details on our servers.
                Stripe provides us with a truncated card reference (last 4 digits), billing address,
                and transaction ID for record-keeping purposes. Stripe's privacy policy governs
                their handling of your payment data.
              </p>
            </SubSection>

            <SubSection title="User-contributed content">
              <p>
                When you leave a review, post in a community forum, upload a document (such as a
                budget, reserve study, or meeting minutes), or submit a correction, that content is
                stored on our platform. Reviews and forum posts are associated with your verified
                identity. Uploaded documents may contain financial information about your HOA,
                including assessment amounts, reserve fund balances, and expenditure details.
              </p>
            </SubSection>

            <SubSection title="Automatically collected data">
              <p>
                When you visit our website, we automatically collect: your IP address, browser type
                and version, device type, operating system, pages visited, time spent on pages,
                referring URL, and general geographic location (city-level, not precise). This data
                is collected through PostHog analytics and Vercel web analytics. We do not use
                this data for targeted advertising.
              </p>
            </SubSection>

            <SubSection title="Cookies">
              <p>
                We use essential cookies to maintain your login session and remember your preferences.
                We use analytics cookies (PostHog) to understand how people use the platform so we
                can improve it. We do not use advertising cookies or share cookie data with advertisers.
              </p>
            </SubSection>
          </Section>

          <Section title="What we do NOT collect">
            <p>
              We do not collect biometric data, precise geolocation data, data about your race or
              ethnicity, religious beliefs, health information, sexual orientation, or citizenship
              status. We do not knowingly collect data from children under 13 years of age.
            </p>
          </Section>

          <Section title="How we use your data">
            <p>We use the personal data we collect for the following purposes:</p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "To create and manage your account",
                "To verify your address so you can leave reviews and access private community boards",
                "To process payments for premium features",
                "To display your reviews and forum posts to other users (associated with your first name and last initial, never your full address)",
                "To send you transactional emails (account verification, password resets, payment receipts)",
                "To send you platform updates and notifications you have opted into",
                "To analyze aggregate usage patterns and improve the platform",
                "To respond to your support requests",
                "To comply with legal obligations",
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

          <Section title="We do not sell your data">
            <p>
              We do not sell your personal data to third parties. We do not sell sensitive personal
              data. We do not share your data with advertisers. We do not use your data for targeted
              advertising. This is a core principle of our platform, not a checkbox compliance item.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>
              We use the following third-party services to operate the platform. Each processes
              data on our behalf under contractual obligations:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ["Supabase", "Database hosting and authentication (servers in US)"],
                ["Vercel", "Website hosting and deployment (servers in US)"],
                ["Stripe", "Payment processing (PCI-DSS compliant)"],
                ["PostHog", "Privacy-focused analytics (no data sold to third parties)"],
                ["Resend", "Transactional email delivery"],
              ].map(([name, desc]) => (
                <div key={name} className="flex items-start gap-2">
                  <span className="text-[13px] font-semibold shrink-0" style={{ color: "var(--color-ha-text)", minWidth: 80 }}>{name}</span>
                  <span className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>{desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-3">
              We do not share your personal data with any other third parties except as required
              by law or to protect our legal rights.
            </p>
          </Section>

          <Section title="Public records data">
            <p>
              HOA profile data on our platform (entity status, board members, transfer fees,
              management company information, and management certificates) is sourced from
              publicly available government records including hoa.texas.gov and the Texas
              Comptroller of Public Accounts. This data is public information and is not
              considered personal data under the Texas Data Privacy and Security Act.
            </p>
          </Section>

          <Section title="Your rights under Texas law (TDPSA)">
            <p>
              Under the Texas Data Privacy and Security Act (effective July 1, 2024), you have the
              following rights regarding your personal data:
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                "Right to know whether we are processing your personal data",
                "Right to access your personal data in a portable format",
                "Right to correct inaccuracies in your personal data",
                "Right to delete your personal data",
                "Right to opt out of the sale of your personal data (we do not sell your data)",
                "Right to opt out of targeted advertising (we do not run targeted advertising)",
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
              To exercise any of these rights, email us at contact@homeownersaligned.com with
              the subject line "Data Privacy Request." We will respond within 45 days. If we
              decline a request, we will provide the reason and instructions for how to appeal.
              If you are unsatisfied with our response, you may file a complaint with the
              Texas Attorney General.
            </p>
          </Section>

          <Section title="Data security">
            <p>
              We implement reasonable administrative, technical, and physical safeguards to
              protect your personal data. This includes encryption of data in transit (TLS/SSL),
              encryption of data at rest, secure password hashing, role-based access controls,
              and regular security reviews. However, no method of transmission over the Internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              We retain your account data for as long as your account is active. If you delete
              your account, we will delete your personal data within 30 days, except where we
              are required to retain it for legal or regulatory purposes. Reviews and forum posts
              may be anonymized rather than deleted to preserve community discussion integrity.
              Analytics data is retained in aggregate form and cannot be linked back to you after
              account deletion.
            </p>
          </Section>

          <Section title="Children">
            <p>
              Homeowners Aligned is not directed at children under 13 years of age. We do not
              knowingly collect personal data from children under 13. If we learn that we have
              collected data from a child under 13, we will delete it promptly. If you believe
              a child has provided us with personal data, please contact us at
              contact@homeownersaligned.com.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this privacy policy from time to time. If we make material changes,
              we will notify you by email or by posting a notice on the platform at least 30 days
              before the changes take effect. Your continued use of the platform after the effective
              date constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              If you have questions about this privacy policy or how we handle your data:
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2">
      <h3
        className="text-[16px] font-semibold mb-1.5"
        style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}