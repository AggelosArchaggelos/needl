import type { Metadata } from "next";
import { AboutClient } from "@/components/about-client";

export const metadata: Metadata = {
  title: "About — Needl",
  description: "Why Needl exists and what we're building next.",
};

export default function AboutPage() {
  return <AboutClient />;
}
