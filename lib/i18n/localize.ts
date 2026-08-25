import type { Locale, Localized } from "@/lib/types";

export function localize(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}
