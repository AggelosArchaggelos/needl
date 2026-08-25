import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioView } from "@/components/studio-view";
import { getStudio, studios } from "@/lib/data/studios";

export function generateStaticParams() {
  return studios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/studios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const studio = getStudio(slug);
  if (!studio) return {};
  return {
    title: `${studio.name} — Needl`,
    description: studio.description.en,
  };
}

export default async function StudioPage({ params }: PageProps<"/studios/[slug]">) {
  const { slug } = await params;
  const studio = getStudio(slug);
  if (!studio) notFound();

  return <StudioView studio={studio} />;
}
