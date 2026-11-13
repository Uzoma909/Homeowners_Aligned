"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INTRO_STORAGE_KEY } from "@/lib/site";
import { DisclaimerIntro, DisclaimerNotice } from "./DisclaimerContent";

/**
 * Intro screen shown once before a visitor enters the application.
 *
 * How it avoids flashing or repeating:
 * - It is server-rendered open, so first-time visitors never see the app
 *   underneath before the notice.
 * - An inline script in app/layout.tsx sets `data-intro-seen` on <html>
 *   before first paint when sessionStorage says it was already dismissed;
 *   CSS in globals.css then hides this element immediately.
 * - If sessionStorage is unavailable (private mode, blocked storage), the
 *   dismissal is kept in memory, which still covers normal in-app navigation.
 * - Without JavaScript the screen is hidden by a <noscript> style and the
 *   same notice stays available in the footer and at /disclaimer.
 *
 * Informational pages are exempt so a direct link to the case study or the
 * policies is never blocked.
 */
const EXEMPT_PREFIXES = ["/project", "/disclaimer", "/privacy", "/terms", "/contact", "/command"];

let dismissedInMemory = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readSeen(): boolean {
  if (dismissedInMemory) return true;
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  dismissedInMemory = true;
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Storage unavailable: the in-memory flag above is the fallback.
  }
  document.documentElement.setAttribute("data-intro-seen", "1");
  listeners.forEach((notify) => notify());
}

export function IntroGate() {
  const pathname = usePathname() || "/";
  const exempt = EXEMPT_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // The server always renders the screen open (it cannot see sessionStorage).
  // After hydration React switches to the browser value.
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  const visible = !seen && !exempt;

  const dismiss = useCallback(() => {
    writeSeen();
  }, []);

  // While the screen is up: lock page scroll, take the app out of the tab
  // order, move focus into the dialog, and let Escape dismiss it.
  useEffect(() => {
    if (!hydrated || !visible) return;

    const appRoot = document.getElementById("app-root");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    appRoot?.setAttribute("inert", "");
    // preventScroll keeps the top of the notice in view on small screens.
    primaryRef.current?.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      appRoot?.removeAttribute("inert");
    };
  }, [hydrated, visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      id="intro-gate"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-gate-title"
      aria-describedby="intro-gate-desc"
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #faf8ff 35%, var(--color-ha-surface) 100%)",
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-60 ha-glow pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 ha-dot-pattern pointer-events-none"
        style={{
          maskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
        }}
      />

      <div className="relative min-h-full flex items-center justify-center px-4 py-10 md:py-14">
        <div
          className="w-full max-w-[620px] ha-card p-6 md:p-10 text-center"
          style={{ boxShadow: "var(--shadow-search)" }}
        >
          <div className="flex justify-center mb-5">
            <img
              src="/icons/mark-purple-transparent.svg"
              alt=""
              width={44}
              height={44}
            />
          </div>

          <h2
            id="intro-gate-title"
            className="text-[30px] md:text-[40px] font-semibold leading-[1.1]"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.03em",
            }}
          >
            Homeowners Aligned
          </h2>
          <p
            className="text-[15px] md:text-[17px] mt-2 italic"
            style={{ color: "var(--color-ha-deep)" }}
          >
            An Independent Data Engineering Portfolio Project
          </p>

          <div
            id="intro-gate-desc"
            className="flex flex-col gap-3 mt-6 text-[14.5px] md:text-[15px] leading-relaxed text-left"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            <DisclaimerIntro />
          </div>

          <div className="mt-6">
            <DisclaimerNotice headingLevel={3} />
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <button
              ref={primaryRef}
              type="button"
              onClick={dismiss}
              className="w-full sm:w-auto text-[15px] font-semibold px-7 py-3 rounded-[10px] cursor-pointer border-0"
              style={{
                background: "var(--color-ha-primary)",
                color: "white",
                fontFamily: "var(--font-outfit)",
              }}
            >
              Explore Project
            </button>
            <Link
              href="/project"
              onClick={dismiss}
              className="text-[14px] font-semibold hover:underline py-2"
              style={{ color: "var(--color-ha-primary)" }}
            >
              {"How This Was Built →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
