import type { BrowseFilters, Studio } from "@/lib/types";

export const defaultFilters: BrowseFilters = {
  cityId: "all",
  styleIds: [],
};

export function filterStudios(studios: Studio[], filters: BrowseFilters): Studio[] {
  const filtered = studios.filter((studio) => {
    if (filters.cityId !== "all" && studio.cityId !== filters.cityId) return false;
    if (
      filters.styleIds.length > 0 &&
      !filters.styleIds.some((id) => studio.styleIds.includes(id))
    )
      return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
