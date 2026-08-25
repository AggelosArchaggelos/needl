import { NextResponse } from "next/server";
import { studios } from "@/lib/data/studios";

export async function GET() {
  return NextResponse.json(studios, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
