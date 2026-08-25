import citiesData from "@/content/cities.json";
import { localize } from "@/lib/i18n/localize";
import type { City, Locale } from "@/lib/types";

export const cities: City[] = citiesData;

export function cityName(id: string, locale: Locale): string {
  const city = cities.find((c) => c.id === id);
  return city ? localize(city.name, locale) : id;
}
