import { ComingSoonPage } from "@/components/ui/ComingSoonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Agents | Homeowners Aligned",
  description: "HOA lookup tools for real estate agents. Coming soon.",
};

export default function AgentsPage() {
  return (
    <ComingSoonPage
      title="For Real Estate Agents"
      description="Unlimited HOA lookups, Health Score reports, and client-ready profiles. Help your clients make informed HOA decisions across your market."
    />
  );
}