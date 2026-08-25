import { NextResponse } from "next/server";
import { Resend } from "resend";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StudioSignupPayload = {
  studioName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  city?: string;
  instagramHandle?: string;
  message?: string;
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  let payload: StudioSignupPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const { studioName, contactName, email, phone, city, instagramHandle, message } = payload;

  if (!studioName?.trim() || !contactName?.trim() || !email?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Studio name, your name, and email are required." },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.STUDIO_SIGNUP_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.error(
      "Studio sign-up received but RESEND_API_KEY / STUDIO_SIGNUP_NOTIFY_EMAIL is not configured.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: "Sign-up isn't fully wired up yet — please try again later or email us directly.",
      },
      { status: 503, headers: CORS_HEADERS },
    );
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.STUDIO_SIGNUP_FROM_EMAIL ?? "Needl <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: email.trim(),
      subject: `New studio sign-up: ${studioName.trim()}`,
      text: [
        `Studio: ${studioName.trim()}`,
        `Contact: ${contactName.trim()}`,
        `Email: ${email.trim()}`,
        phone?.trim() ? `Phone: ${phone.trim()}` : null,
        city?.trim() ? `City: ${city.trim()}` : null,
        instagramHandle?.trim() ? `Instagram: @${instagramHandle.trim()}` : null,
        "",
        message?.trim() ? `Message:\n${message.trim()}` : "No additional message.",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend rejected the studio signup email", error);
      return NextResponse.json(
        { ok: false, error: "Couldn't send that just now — please try again." },
        { status: 502, headers: CORS_HEADERS },
      );
    }
  } catch (err) {
    console.error("Failed to send studio signup email", err);
    return NextResponse.json(
      { ok: false, error: "Couldn't send that just now — please try again." },
      { status: 502, headers: CORS_HEADERS },
    );
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
