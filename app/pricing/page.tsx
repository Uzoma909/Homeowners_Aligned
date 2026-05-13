import { ComingSoonPage } from "@/components/ui/ComingSoonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Homeowners Aligned",
  description: "Free for residents. Premium tiers for agents and buyers. Coming soon.",
};

export default function PricingPage() {
  return (
    <ComingSoonPage
      title="Simple, Transparent Pricing"
      description="Free for every resident, always. Premium tiers for agents and buyers who need deeper insights, bulk lookups, and full Intelligence Reports."
    />
  );
}