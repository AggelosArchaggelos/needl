import { NextResponse } from "next/server";
import { newsArticles } from "@/lib/data/news";

export async function GET() {
  return NextResponse.json(newsArticles, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
