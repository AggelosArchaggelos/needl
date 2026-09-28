import type { Metadata } from "next";
import { LegalPageClient } from "@/components/legal-page-client";

export const metadata: Metadata = {
  title: "Terms of service — Needl",
  description: "The terms for using the Needl website and app.",
};

export default function TermsPage() {
  return <LegalPageClient doc="terms" />;
}
