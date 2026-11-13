import Link from "next/link";
import { NavBar, Footer } from "@/components/layout";
import { DisclaimerIntro, DisclaimerNotice } from "@/components/portfolio/DisclaimerContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Disclaimer",
  description:
    "Homeowners Aligned is a technical portfolio demonstration, not an active commercial service. Records are public, may be outdated, and scores are experimental.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main id="main-content" className="flex-1 max-w-[720px] w-full mx-auto px-4 md:px-8 py-10 md:py-16">
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
          style={{ background: "var(--color-ha-text)", color: "white" }}
        >
          Project disclaimer
        </span>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.025em" }}
        >
          Homeowners Aligned
        </h1>
        <p className="text-[16px] md:text-[18px] mt-2 italic" style={{ color: "var(--color-ha-deep)" }}>
          An Independent Data Engineering Portfolio Project
        </p>

        <div
          className="flex flex-col gap-4 mt-8 text-[15px] leading-relaxed"
          style={{ color: "var(--color-ha-text-soft)" }}
        >
          <DisclaimerIntro />
        </div>

        <div className="mt-8">
          <DisclaimerNotice />
        </div>

        <div
          className="flex flex-col gap-4 mt-8 text-[15px] leading-relaxed"
          style={{ color: "var(--color-ha-text-soft)" }}
        >
          <h2
            className="text-[20px] font-semibold"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}
          >
            What that means in practice
          </h2>
          <ul className="flex flex-col gap-3 list-disc pl-5">
            <li>
              <strong style={{ color: "var(--color-ha-text)" }}>Source data versus project output.</strong>{" "}
              Names, fees, statuses, and filings come from public records. The projected
              score and the &ldquo;data completeness&rdquo; figure are calculated by this
              project and exist nowhere else.
            </li>
            <li>
              <strong style={{ color: "var(--color-ha-text)" }}>A snapshot, not a live feed.</strong>{" "}
              Records were retrieved in May 2026 and are not refreshed on a schedule.
              Each HOA profile shows its own retrieval dates.
            </li>
            <li>
              <strong style={{ color: "var(--color-ha-text)" }}>Automated extraction can be wrong.</strong>{" "}
              Details from filed certificates were read by software, including a language
              model, and HOAs were matched to state entity records by name. Either step can
              produce a mistake.
            </li>
            <li>
              <strong style={{ color: "var(--color-ha-text)" }}>Not advice.</strong>{" "}
              Nothing here is legal, financial, or real estate advice. Check the original
              records and consult a professional before acting on anything.
            </li>
          </ul>
          <p>
            Reading this page or using the site does not create any agreement with you.
            The site&rsquo;s{" "}
            <Link href="/terms" className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold hover:underline" style={{ color: "var(--color-ha-primary)" }}>
              privacy policy
            </Link>{" "}
            are separate documents.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            Explore Project
          </Link>
          <Link
            href="/project"
            className="inline-block text-[14px] font-semibold px-6 py-3 rounded-[10px] no-underline"
            style={{
              background: "white",
              color: "var(--color-ha-primary)",
              border: "1px solid var(--color-ha-border-strong)",
            }}
          >
            How This Was Built
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
