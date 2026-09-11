import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/data/site-config";
import { PricingClient } from "@/components/pricing-client";
export const dynamic = "force-dynamic";
export default function LocalPricingPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <PricingClient tiers={siteConfig.pricingTiers} />;
}
