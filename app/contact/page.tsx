import { NavBar, Footer } from "@/components/layout";
import { MailIcon } from "@/components/icons/hoa-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Homeowners Aligned",
  description: "Get in touch with the Homeowners Aligned team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
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
            Have a question, correction, or partnership inquiry? We read every message.
          </p>
          <a
            href="mailto:contact@homeownersaligned.com"
            className="inline-block text-[15px] font-semibold px-6 py-3 rounded-[10px] mt-6 no-underline"
            style={{ background: "var(--color-ha-primary)", color: "white" }}
          >
            contact@homeownersaligned.com
          </a>
          <p className="text-[12px] mt-4" style={{ color: "var(--color-ha-gray)" }}>
            Empowering communities through transparency.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}