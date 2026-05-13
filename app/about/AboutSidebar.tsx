"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "states", label: "Search Your State" },
  { id: "mission", label: "Our Mission" },
  { id: "scoring", label: "How We Score" },
  { id: "request", label: "Request Records" },
  { id: "profile", label: "What You'll See" },
  { id: "forum", label: "Community Forum" },
  { id: "join", label: "Join Us" },
] as const;

export function AboutSidebar() {
  const [active, setActive] = useState("states");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      const offsets = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: el.getBoundingClientRect().top };
      });

      let current = offsets[0].id;
      for (const section of offsets) {
        if (section.top <= 140) {
          current = section.id;
        }
      }
      setActive(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  }

  return (
    <>
      {/* Desktop — sticky sidebar */}
      <nav
        className="hidden lg:flex flex-col gap-1 sticky top-24"
        style={{ width: 200 }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--color-ha-gray)", letterSpacing: "0.08em" }}
        >
          On this page
        </span>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="text-left text-[13px] py-1.5 px-3 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
            style={{
              fontFamily: "var(--font-outfit)",
              color: active === id ? "var(--color-ha-primary)" : "var(--color-ha-gray)",
              fontWeight: active === id ? 600 : 400,
              background: active === id ? "var(--color-ha-surface)" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Mobile — floating pill toggle */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer border-0"
          style={{
            background: "var(--color-ha-text)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-outfit)",
            boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
          Sections
        </button>

        {open && (
          <div
            className="absolute bottom-14 right-0 flex flex-col gap-1 p-3 rounded-2xl animate-fade-in"
            style={{
              background: "white",
              border: "1px solid var(--color-ha-border)",
              boxShadow: "0 16px 40px rgba(15,23,42,0.15)",
              minWidth: 200,
            }}
          >
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-[13px] py-2 px-3 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: active === id ? "var(--color-ha-primary)" : "var(--color-ha-text-soft)",
                  fontWeight: active === id ? 600 : 400,
                  background: active === id ? "var(--color-ha-surface)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}