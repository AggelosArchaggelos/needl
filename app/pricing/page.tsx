import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasPricingAccess } from "@/lib/pricing-access";
import { siteConfig } from "@/lib/data/site-config";
import type { Metadata } from "next";
import { PricingClient } from "@/components/pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Needl",
  description: "Needl is free for studios during launch. See what's coming next.",
};

export default async function PricingPage() {
  if (!hasPricingAccess((await cookies()).get("needl-studio-access")?.value)) redirect("/for-studios");
  return <PricingClient tiers={siteConfig.pricingTiers} />;
}
