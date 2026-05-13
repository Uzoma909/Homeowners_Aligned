import { NavBar, Footer } from "@/components/layout";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="text-center max-w-[480px]">
          <span
            className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-5"
            style={{ background: "var(--color-ha-text)", color: "white" }}
          >
            Coming soon
          </span>
          <h1
            className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h1>
          <p
            className="text-[15px] mt-4 leading-relaxed"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            {description}
          </p>
          <a
            href="/"
            className="inline-block text-[14px] font-semibold px-5 py-2.5 rounded-[10px] mt-6 no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            {"Search HOAs \u2192"}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}