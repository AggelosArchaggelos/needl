import type { Metadata } from "next";
import { HowItWorksClient } from "@/components/how-it-works-client";

export const metadata: Metadata = {
  title: "Tattoo styles — Needl",
  description: "A beginner-friendly guide to tattoo styles, visual differences and finding an artist.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
