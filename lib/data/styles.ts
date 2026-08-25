import stylesData from "@/content/styles.json";
import type { TattooStyle } from "@/lib/types";

export const styles: TattooStyle[] = stylesData;

// Tattoo style names (e.g. "Traditional", "Japanese Irezumi") stay in English
// regardless of locale — they're the vocabulary of the craft, not UI copy.
export function styleName(id: string): string {
  const style = styles.find((s) => s.id === id);
  return style ? style.name.en : id;
}
