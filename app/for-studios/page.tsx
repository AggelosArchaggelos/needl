import type { Metadata } from "next";
import { ForStudiosClient } from "@/components/for-studios-client";

export const metadata: Metadata = {
  title: "For studios — Needl",
  description: "List your tattoo studio on Needl — free while we grow, with paid promotion coming later.",
};

export default function ForStudiosPage() {
  return <ForStudiosClient />;
}
