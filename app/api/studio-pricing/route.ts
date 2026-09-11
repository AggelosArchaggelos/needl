import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hasPricingAccess } from "@/lib/pricing-access";
import { siteConfig } from "@/lib/data/site-config";
const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization", "Access-Control-Allow-Methods": "GET, OPTIONS", "Cache-Control": "private, no-store" };
export function OPTIONS() { return new NextResponse(null, { status: 204, headers }); }
export async function GET(request: Request) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer /, "");
  const token = bearer || (await cookies()).get("needl-studio-access")?.value;
  if (!hasPricingAccess(token)) return NextResponse.json({ error: "Studio enquiry required, or access expired." }, { status: 401, headers });
  return NextResponse.json({ pricingTiers: siteConfig.pricingTiers }, { headers });
}
