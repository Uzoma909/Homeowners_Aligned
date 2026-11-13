"use client";

import { useState } from "react";
import Link from "next/link";
import { WordMark } from "@/components/icons/Logo";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Search" },
  { href: "/search", label: "HOA Records" },
  { href: "/about", label: "About" },
  { href: "/project", label: "How It Was Built" },
] as const;

interface NavBarProps {
  activePath?: string;
}

export function NavBar({ activePath }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-ha-border)",
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:px-3 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ background: "var(--color-ha-text)", color: "white" }}
      >
        Skip to content
      </a>

      <div className="max-w-[1180px] mx-auto px-4 md:px-6 flex items-center h-14 md:h-16 relative">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Homeowners Aligned home">
          {/* Mobile and tablet: compact, so the centered nav has room */}
          <div className="lg:hidden flex items-end gap-1.5">
            <img src="/icons/mark-purple-transparent.svg" alt="" width={24} height={24} />
            <span
              className="font-semibold leading-none"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 18,
                color: "var(--color-ha-primary)",
                letterSpacing: "-0.02em",
                transform: "translateY(-1px)",
              }}
            >
              HOAligned
            </span>
          </div>
          {/* Desktop: full wordmark */}
          <span className="hidden lg:block">
            <WordMark size={20} />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main"
          className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activePath === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="text-sm transition-colors whitespace-nowrap"
                style={{
                  color: isActive
                    ? "var(--color-ha-primary)"
                    : "var(--color-ha-text-soft)",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: isActive
                    ? "2px solid var(--color-ha-primary)"
                    : "2px solid transparent",
                  paddingBottom: 4,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop: project status */}
        <div className="hidden md:flex items-center ml-auto mr-0">
          <Link
            href="/disclaimer"
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full no-underline whitespace-nowrap"
            style={{
              background: "var(--color-ha-surface)",
              color: "var(--color-ha-deep)",
              border: "1px solid var(--color-ha-border-strong)",
            }}
          >
            Portfolio project
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden ml-auto p-2 -mr-2 bg-transparent border-0 cursor-pointer"
          style={{ color: "var(--color-ha-text)" }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t"
          style={{
            borderColor: "var(--color-ha-border)",
            background: "white",
          }}
        >
          <nav aria-label="Main" className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={activePath === href ? "page" : undefined}
                className="py-3 text-[15px] font-medium"
                style={{
                  color:
                    activePath === href
                      ? "var(--color-ha-primary)"
                      : "var(--color-ha-text)",
                  borderBottom: "1px solid var(--color-ha-border)",
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/disclaimer"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-[13px] font-medium"
              style={{ color: "var(--color-ha-gray)" }}
            >
              Portfolio project: read the disclaimer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
