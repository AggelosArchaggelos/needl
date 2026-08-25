import type { Metadata } from "next";
import { PricingClient } from "@/components/pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Needl",
  description: "Needl is free for studios during launch. See what's coming next.",
};

export default function PricingPage() {
  return <PricingClient />;
}
