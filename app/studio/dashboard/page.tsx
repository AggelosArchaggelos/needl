import type { Metadata } from "next";
import { StudioDashboardClient } from "@/components/studio-dashboard-client";

export const metadata: Metadata = {
  title: "Studio dashboard — Needl",
  description: "Manage your studio's Needl page.",
};

export default function StudioDashboardPage() {
  return <StudioDashboardClient />;
}
