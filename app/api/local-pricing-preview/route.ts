import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/data/site-config";

export function GET() {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  return NextResponse.json({ pricingTiers: siteConfig.pricingTiers }, { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" } });
}
