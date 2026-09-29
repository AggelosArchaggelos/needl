import type { Metadata } from "next";
import { StudioLoginClient } from "@/components/studio-login-client";

export const metadata: Metadata = {
  title: "Studio sign in — Needl",
  description: "Sign in to manage your studio's Needl page.",
};

export default function StudioLoginPage() {
  return <StudioLoginClient />;
}
