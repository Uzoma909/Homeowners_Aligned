import { NavBar, Footer } from "@/components/layout";
import { WordMark } from "@/components/icons/Logo";
import { AuthForm } from "../auth-form";
import { StateCarousel } from "../StateCarousel";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Homeowners Aligned",
  description:
    "Sign up free to leave reviews, access community boards, and help build your HOA\u2019s transparency profile.",
};

export default function RegisterPage() {
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
            <AuthForm mode="register" />
          </div>

          {/* Legal */}
          <p
            className="text-[11px] text-center mt-5 leading-relaxed max-w-[340px] mx-auto"
            style={{ color: "var(--color-ha-gray)" }}
          >
            By creating an account you agree to our{" "}
            <Link
              href="/terms"
              className="underline"
              style={{ color: "var(--color-ha-gray)" }}
            >
              Terms
            </Link>
            {" and "}
            <Link
              href="/privacy"
              className="underline"
              style={{ color: "var(--color-ha-gray)" }}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}