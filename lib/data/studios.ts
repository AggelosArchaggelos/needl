import studiosData from "@/content/studios.json";
import type { Artist, Studio } from "@/lib/types";

export const studios: Studio[] = studiosData as Studio[];

export function getStudio(slug: string): Studio | undefined {
  return studios.find((s) => s.slug === slug);
}

export function getArtist(
  studioSlug: string,
  artistSlug: string,
): { studio: Studio; artist: Artist } | undefined {
  const studio = getStudio(studioSlug);
  const foundArtist = studio?.artists.find((a) => a.slug === artistSlug);
  if (!studio || !foundArtist) return undefined;
  return { studio, artist: foundArtist };
}

export function topRatedStudios(count: number): Studio[] {
  return [...studios]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, count);
}
