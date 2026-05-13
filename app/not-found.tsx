import { NavBar, Footer } from "@/components/layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="text-center max-w-[480px]">
          <span
            className="text-[64px] md:text-[80px] font-bold"
            style={{
              fontFamily: "var(--font-space)",
              color: "var(--color-ha-border-strong)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            404
          </span>
          <h1
            className="text-[24px] md:text-[30px] font-semibold mt-4"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.02em",
            }}
          >
            Page not found
          </h1>
          <p
            className="text-[15px] mt-3 leading-relaxed"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            The page you are looking for does not exist or may have been moved.
            Try searching for an HOA or head back home.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link
              href="/"
              className="text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
              style={{ background: "var(--color-ha-primary)", color: "white" }}
            >
              Go home
            </Link>
            <Link
              href="/search"
              className="text-[14px] font-semibold px-5 py-2.5 rounded-[10px] no-underline"
              style={{
                background: "transparent",
                color: "var(--color-ha-primary)",
                border: "1.5px solid var(--color-ha-primary)",
              }}
            >
              Search HOAs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
