import Link from "next/link";
import { WordMark } from "@/components/icons/Logo";
import { REPO_URL } from "@/lib/site";

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Search HOAs", href: "/" },
      { label: "Browse HOA Records", href: "/search" },
      { label: "Texas HOA Guide", href: "/about/tx" },
      { label: "Score Methodology", href: "/about#scoring" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "How It Was Built", href: "/project" },
      { label: "Technical Architecture", href: "/project#architecture" },
      { label: "Data Methodology", href: "/project#collection" },
      { label: "About This Project", href: "/about" },
    ],
  },
  {
    title: "Notices",
    links: [
      { label: "Project Disclaimer", href: "/disclaimer" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-ha-border)",
        background: "var(--color-ha-surface)",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <WordMark size={14} />
            <div
              className="mt-3 text-sm font-medium"
              style={{
                color: "var(--color-ha-deep)",
                letterSpacing: "0.04em",
              }}
            >
              Honest · Open · Accountable
            </div>
            <p
              className="mt-4 text-[12.5px] leading-relaxed max-w-[320px]"
              style={{ color: "var(--color-ha-gray)" }}
            >
              A data engineering portfolio project built on public Texas HOA
              records. Not an active commercial service.
            </p>
            {REPO_URL && (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[12.5px] font-semibold hover:underline"
                style={{ color: "var(--color-ha-primary)" }}
              >
                {"View source on GitHub →"}
              </a>
            )}
          </div>

          {/* Nav columns */}
          {FOOTER_SECTIONS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <div
                className="text-xs font-semibold uppercase tracking-wide mb-4"
                style={{ color: "var(--color-ha-text)" }}
              >
                {title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13.5px] hover:underline"
                      style={{ color: "var(--color-ha-text-soft)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Disclaimer strip */}
      <div style={{ borderTop: "1px solid var(--color-ha-border)" }}>
        <div
          className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 text-xs leading-relaxed"
          style={{ color: "var(--color-ha-gray)" }}
        >
          Technical portfolio demonstration. Records come from public sources and
          may be incomplete, outdated, or inaccurate. Scores are experimental
          and are not official evaluations. Not affiliated with any homeowners
          association or government agency.{" "}
          <Link
            href="/disclaimer"
            className="font-semibold hover:underline"
            style={{ color: "var(--color-ha-primary)" }}
          >
            Read the full disclaimer
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--color-ha-border)" }}>
        <div
          className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between gap-2 text-xs"
          style={{ color: "var(--color-ha-gray)" }}
        >
          <span>© 2026 Homeowners Aligned</span>
          <span>Built as a software and data engineering showcase.</span>
        </div>
      </div>
    </footer>
  );
}
