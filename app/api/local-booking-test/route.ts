import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getStudio } from "@/lib/data/studios";

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (process.env.NODE_ENV !== "development" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || request.headers.get("origin") !== url.origin) return new NextResponse(null, { status: 404 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body && typeof body === "object" && !Array.isArray(body) && body.notes == null) body.notes = "";
  if (!body || ["studioSlug", "artistId", "name", "contact", "notes"].some(key => typeof body[key] !== "string" || body[key].length > 5000) || !body.name.trim() || !body.contact.trim()) return NextResponse.json({ error: "Name and contact details are required." }, { status: 400 });
  const studio = getStudio(body.studioSlug);
  const artist = studio?.artists.find(a => a.id === body.artistId);
  if (!studio || (body.artistId !== "any" && !artist)) return NextResponse.json({ error: "Invalid studio or artist." }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email test is not configured: RESEND_API_KEY is missing." }, { status: 503 });
  try {
    const { data, error } = await new Resend(key).emails.send({
      from: process.env.STUDIO_SIGNUP_FROM_EMAIL || "Needl <onboarding@resend.dev>",
      to: "aggkritharas@gmail.com",
      subject: `[TEST — NOT A REAL BOOKING] ${studio.name}`,
      text: ["Authorised Needl delivery test. No appointment has been booked.", `Studio: ${studio.name}`, `Artist: ${artist?.name || "No preference"}`, `Test client: ${body.name.trim()}`, `Contact: ${body.contact.trim()}`, `Notes: ${body.notes.trim() || "Not provided — please contact the client to discuss their idea."}`].join("\n"),
    });
    if (error || !data?.id) return NextResponse.json({ error: "Provider rejected the test email. Check the Resend dashboard and sender setup." }, { status: 502 });
    return NextResponse.json({ ok: true, emailId: data.id }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Email service unavailable. Check delivery logs before retrying." }, { status: 502 }); }
}
