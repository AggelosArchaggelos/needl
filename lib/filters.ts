import type { BrowseFilters, Studio } from "@/lib/types";

export const defaultFilters: BrowseFilters = {
  cityId: "all",
  styleIds: [],
  priceBand: "all",
  minRating: 4,
  sort: "recommended",
};

const priceRank: Record<Studio["priceBand"], number> = {
  "€": 1,
  "€€": 2,
  "€€€": 3,
};

export function filterStudios(studios: Studio[], filters: BrowseFilters): Studio[] {
  const filtered = studios.filter((studio) => {
    if (filters.cityId !== "all" && studio.cityId !== filters.cityId) return false;
    if (filters.priceBand !== "all" && studio.priceBand !== filters.priceBand) return false;
    if (studio.rating < filters.minRating) return false;
    if (
      filters.styleIds.length > 0 &&
      !filters.styleIds.some((id) => studio.styleIds.includes(id))
    )
      return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "price-asc":
        return priceRank[a.priceBand] - priceRank[b.priceBand] || b.rating - a.rating;
      case "price-desc":
        return priceRank[b.priceBand] - priceRank[a.priceBand] || b.rating - a.rating;
      case "recommended":
      default:
        // Promoted studios surface first, then by rating/review weight.
        if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
        return b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10);
    }
  });

  return sorted;
}
