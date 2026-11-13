import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What the Homeowners Aligned portfolio site does and does not collect from visitors, and how public-record data about HOAs is handled.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main id="main-content" className="max-w-[760px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
          style={{ background: "var(--color-ha-text)", color: "white" }}
        >
          Privacy
        </span>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[14px] mt-3 mb-10" style={{ color: "var(--color-ha-gray)" }}>
          Last updated: November 12, 2026
        </p>

        <div className="flex flex-col gap-8 text-[15px] leading-relaxed" style={{ color: "var(--color-ha-text-soft)" }}>

          <Section title="What this site is">
            <p>
              Homeowners Aligned (homeownersaligned.com) is a technical portfolio
              demonstration operated by Onque LLC, a Texas limited liability company.
              It is not an active commercial service. The site is read-only: there are
              no accounts, no payments, and no forms.
            </p>
            <p>
              Questions about this policy can be sent to{" "}
              <strong style={{ color: "var(--color-ha-text)" }}>{CONTACT_EMAIL}</strong>.
            </p>
          </Section>

          <Section title="What the site asks you for">
            <p>
              Nothing. You cannot sign up, log in, post, upload, or pay here, so the site
              never asks for your name, email address, home address, or payment details.
            </p>
            <p>
              Search terms you type are sent to the database to find matching HOA records.
              They are not tied to an identity by this site.
            </p>
          </Section>

          <Section title="What is collected automatically">
            <SubSection title="Server and database logs">
              <p>
                Like any website, the services that run this site receive technical
                information when your browser makes a request: your IP address, browser
                and device type, the page or search you requested, and the time. Two
                providers can see this:
              </p>
              <ul className="flex flex-col gap-2 mt-2">
                <Bullet>
                  <strong style={{ color: "var(--color-ha-text)" }}>The web host</strong>, which
                  serves the pages.
                </Bullet>
                <Bullet>
                  <strong style={{ color: "var(--color-ha-text)" }}>Supabase</strong>, which hosts the
                  database. The search box on the home page queries Supabase directly from your
                  browser, so Supabase receives that request and your IP address.
                </Bullet>
              </ul>
              <p className="mt-3">
                These logs are kept by those providers under their own retention rules and
                are used here only to keep the site running and to investigate abuse.
              </p>
            </SubSection>

            <SubSection title="Cookies and browser storage">
              <p>
                The public site sets no cookies. It stores one item in your browser&rsquo;s
                session storage, named <code>ha-intro-seen</code>, so the introductory notice
                is not shown again while the tab stays open. It contains no personal
                information, is never sent to a server, and is cleared when you close the tab.
              </p>
            </SubSection>

            <SubSection title="Analytics and advertising">
              <p>
                The site&rsquo;s code contains no analytics scripts, tracking pixels,
                advertising, or third-party embeds. Fonts are served from the site itself
                rather than from a third party.
              </p>
            </SubSection>
          </Section>

          <Section title="Information from the earlier version of the site">
            <p>
              Before it became a portfolio project, the site allowed people to create an
              account or join a waitlist. Those features have been removed. Any names and
              email addresses submitted at that time are no longer used for anything, and
              you can ask for yours to be deleted by emailing {CONTACT_EMAIL}.
            </p>
          </Section>

          <Section title="Public records about HOAs">
            <p>
              HOA profiles are built from public government records: management
              certificates filed with the Texas Real Estate Commission (published at
              hoa.texas.gov and data.texas.gov) and franchise tax records from the Texas
              Comptroller of Public Accounts. These records can include the names and
              titles of HOA officers, registered agents, and management company contacts,
              because those appear in the public filings.
            </p>
            <p>
              The profiles are a snapshot taken when the records were retrieved and may be
              out of date. Mailing addresses of individual officers that appear in the
              source records are not shown on this site.
            </p>
            <p>
              If you are named in a record and want it corrected or removed from this site,
              email {CONTACT_EMAIL} with the HOA name and the page address. Removal here
              does not change the underlying government record.
            </p>
          </Section>

          <Section title="Sharing and selling">
            <p>
              No visitor information is sold or shared for advertising. The only parties
              that process visitor data are the hosting and database providers described
              above, as part of delivering the site.
            </p>
          </Section>

          <Section title="Email">
            <p>
              If you email {CONTACT_EMAIL}, your address and message are used only to reply
              to you and handle your request.
            </p>
          </Section>

          <Section title="Children">
            <p>
              The site is not directed at children under 13 and does not knowingly collect
              personal information from them.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If the site&rsquo;s behavior changes, for example if analytics are added, this
              page will be updated and the date above will change.
            </p>
          </Section>

          <Section title="Related notices">
            <p>
              See also the{" "}
              <Link href="/disclaimer" className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                project disclaimer
              </Link>{" "}
              and the{" "}
              <Link href="/terms" className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
                terms of use
              </Link>
              .
            </p>
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg aria-hidden="true" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
