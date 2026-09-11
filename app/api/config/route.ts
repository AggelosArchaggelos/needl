import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/data/site-config";
import { cities } from "@/lib/data/cities";
import { styles } from "@/lib/data/styles";

export async function GET() {
  return NextResponse.json(
    { siteName: siteConfig.siteName, tagline: siteConfig.tagline, contactEmail: siteConfig.contactEmail, instagramHandle: siteConfig.instagramHandle, features: siteConfig.features, cities, styles },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}
