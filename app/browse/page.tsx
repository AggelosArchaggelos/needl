import type { Metadata } from "next";
import { BrowseClient } from "@/components/browse/browse-client";
import { studios } from "@/lib/data/studios";

export const metadata: Metadata = {
  title: "Browse studios — Needl",
  description: "Filter tattoo studios across Greece by city and tattoo style.",
};

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const params = await searchParams;
  const cityParam = typeof params.city === "string" ? params.city : undefined;

  return <BrowseClient studios={studios} initialCity={cityParam} initialStyles={typeof params.styles === "string" ? params.styles.split(",") : []} />;
}
