"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupNudge() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // assume logged in until checked
  const supabase = createClient();

  // Check auth once on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  // Only activate on community profiles and state education pages
  const NUDGE_PATHS = ["/community/", "/about/tx", "/about/florida", "/about/california"];

  function isNudgePage(): boolean {
    const path = window.location.pathname;
    return NUDGE_PATHS.some((p) => path.startsWith(p));
  }

  // Listen for tab return (user clicked external link and came back)
  const handleVisibility = useCallback(() => {
    if (document.visibilityState === "visible" && !isLoggedIn && !dismissed && isNudgePage()) {
      // Small delay so it doesn't feel jarring
      setTimeout(() => setShow(true), 800);
    }
  }, [isLoggedIn, dismissed]);

  useEffect(() => {
    if (isLoggedIn || dismissed) return;
    if (typeof window === "undefined") return;

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isLoggedIn, dismissed, handleVisibility]);

  function dismiss() {
    setShow(false);
    setDismissed(true);
    try {
      sessionStorage.setItem("ha-nudge-dismissed", "1");
    } catch {}
  }

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ha-nudge-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {}
  }, []);

  if (!show || isLoggedIn || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] rounded-2xl p-6 md:p-8 text-center animate-fade-in"
        style={{
          background: "white",
          boxShadow: "0 24px 64px rgba(15,23,42,0.20)",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: "var(--color-ha-surface)", border: "none", color: "var(--color-ha-gray)" }}
          aria-label="Close"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Logo mark */}
        <div className="flex justify-center mb-4">
          <img src="/icons/mark-purple-transparent.svg" alt="" width={36} height={36} />
        </div>

        <h3
          className="text-[18px] font-semibold"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)", letterSpacing: "-0.015em" }}
        >
          {"We\u2019d love your support"}
        </h3>

        <p
          className="text-[13px] mt-2 leading-relaxed"
          style={{ color: "var(--color-ha-text-soft)" }}
        >
          Create a free account to save HOA profiles, leave verified reviews, and help build transparency in your community.
        </p>

        <div className="flex flex-col gap-2.5 mt-5">
          <a
            href="/auth/register"
            className="w-full text-center text-[14px] font-semibold py-3 rounded-[10px] no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            Create free account
          </a>
          <a
            href="/auth/login"
            className="w-full text-center text-[13px] font-medium py-2.5 rounded-[10px] no-underline"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}