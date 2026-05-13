import Link from "next/link";
import { WordMark } from "@/components/icons/Logo";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "HOA Profiles", href: "/" },
      { label: "Health Score Methodology", href: "/methodology" },
      { label: "For Residents", href: "/residents" },
      { label: "For Buyers", href: "/buyers" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "For Agents", href: "/agents" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
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
              An independent transparency platform for the 78 million Americans
              living under HOA governance.
            </p>
          </div>

          {/* Nav columns */}
          {FOOTER_SECTIONS.map(({ title, links }) => (
            <div key={title}>
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
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--color-ha-border)" }}>
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between gap-2 text-xs"
          style={{ color: "var(--color-ha-gray)" }}
        >
          <span>© 2026 Homeowners Aligned</span>
          <span>Made for residents. Transparency builds stronger communities.</span>
        </div>
      </div>
    </footer>
  );
}
