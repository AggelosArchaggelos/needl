import type { Metadata } from "next";
import { HowItWorksClient } from "@/components/how-it-works-client";

export const metadata: Metadata = {
  title: "How it works — Needl",
  description: "How to find and book a tattoo artist in Greece through Needl.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
