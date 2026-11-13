import { NavBar, Footer } from "@/components/layout";
import { MailIcon } from "@/components/icons/hoa-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the developer of Homeowners Aligned about the project, a correction, or removal of a record.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="text-center max-w-[480px]">
          <div className="flex justify-center mb-6" style={{ color: "var(--color-ha-primary)" }}>
            <MailIcon size={28} />
          </div>
          <h1
            className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              letterSpacing: "-0.025em",
            }}
          >
            Get in touch
          </h1>
          <p
            className="text-[15px] mt-4 leading-relaxed"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            Questions about the project, a correction to a record, or a request to remove information? Email is the only contact channel. This site has no forms and collects nothing from you.
          </p>
          <a
            href="mailto:contact@homeownersaligned.com"
            className="inline-block text-[15px] font-semibold px-6 py-3 rounded-[10px] mt-6 no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            contact@homeownersaligned.com
          </a>
          <p className="text-[12px] mt-4" style={{ color: "var(--color-ha-gray)" }}>
            Homeowners Aligned is a portfolio project, not a customer service desk for any HOA.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}