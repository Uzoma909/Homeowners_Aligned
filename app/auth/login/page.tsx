import { NavBar, Footer } from "@/components/layout";
import { WordMark } from "@/components/icons/Logo";
import { AuthForm } from "../auth-form";
import { StateCarousel } from "../StateCarousel";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Homeowners Aligned",
  description: "Sign in to your Homeowners Aligned account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-32 relative min-h-[80vh]">
        <StateCarousel />
        <div className="w-full max-w-[420px] relative z-10">
          {/* Tagline */}
          <p
            className="text-center text-[26px] md:text-[32px] font-semibold leading-[1.15] mb-10 -mx-8 md:-mx-12"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text-soft)",
              letterSpacing: "-0.025em",
            }}
          >
            {"Your community\u2019s data is public."}
            <br />
            <span style={{ color: "var(--color-ha-primary)", fontWeight: 600 }}>
              Your voice should be too.
            </span>
          </p>

          {/* Card */}
          <div className="ha-card-frosted p-6 md:p-8">
            <AuthForm mode="login" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}