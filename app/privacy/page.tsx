import type { Metadata } from "next";
import { LegalPageClient } from "@/components/legal-page-client";

export const metadata: Metadata = {
  title: "Privacy policy — Needl",
  description: "What information Needl collects, and why.",
};

export default function PrivacyPage() {
  return <LegalPageClient doc="privacy" />;
}
