import type { Artist, Studio, BrowseFilters } from "@/lib/types";
export type ArtistResult = { artist: Artist; studio: Studio; matchedStyles: number };
export function artistRating(artist: Artist): number | undefined {
 return typeof artist.rating === "number" && Number.isFinite(artist.rating) && artist.rating >= 0 && artist.rating <= 5 && (artist.reviewCount ?? 0) > 0 ? artist.rating : undefined;
}
export function findArtists(studios: Studio[], filters: BrowseFilters): ArtistResult[] {
 const results: ArtistResult[] = [];
 for (const studio of studios) {
  if(filters.cityId !== "all" && studio.cityId !== filters.cityId) continue;
  for(const artist of studio.artists) {
   if (artist.discipline === "art") continue;
   const matchedStyles=artist.discipline === "piercing" ? 0 : filters.styleIds.filter(id=>artist.styleIds.includes(id)).length;
   if(filters.styleIds.length && !matchedStyles) continue;
   results.push({artist,studio,matchedStyles});
  }
 }
 return results.sort((a,b)=> b.matchedStyles-a.matchedStyles || a.artist.name.localeCompare(b.artist.name) || a.studio.slug.localeCompare(b.studio.slug));
}

// Studios match a style when the studio lists it or any of its tattooists work in it.
export function findStudios(studios: Studio[], filters: BrowseFilters): Studio[] {
 return studios
  .filter(studio => (filters.cityId === "all" || studio.cityId === filters.cityId)
   && (!filters.styleIds.length || filters.styleIds.some(id => studio.styleIds.includes(id) || studio.artists.some(a => a.discipline !== "piercing" && a.styleIds.includes(id)))))
  .sort((a,b)=>a.name.localeCompare(b.name));
}
