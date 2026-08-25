import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtistView } from "@/components/artist-view";
import { getArtist, studios } from "@/lib/data/studios";

export function generateStaticParams() {
  return studios.flatMap((s) =>
    s.artists.map((a) => ({ slug: s.slug, artistSlug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/studios/[slug]/artists/[artistSlug]">): Promise<Metadata> {
  const { slug, artistSlug } = await params;
  const found = getArtist(slug, artistSlug);
  if (!found) return {};
  return {
    title: `${found.artist.name} — ${found.studio.name} — Needl`,
    description: found.artist.bio.en,
  };
}

export default async function ArtistPage({
  params,
}: PageProps<"/studios/[slug]/artists/[artistSlug]">) {
  const { slug, artistSlug } = await params;
  const found = getArtist(slug, artistSlug);
  if (!found) notFound();

  return <ArtistView studio={found.studio} artist={found.artist} />;
}
