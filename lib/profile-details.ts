import type { Artist, Locale } from "@/lib/types";
export function disciplineLabel(artist: Artist, locale: Locale) {
 const greek = locale === "el";
 switch (artist.discipline ?? "tattoo") {
 case "piercing": return greek ? "Ειδικός piercing" : "Piercer";
 case "both": return greek ? "Καλλιτέχνης τατουάζ & ειδικός piercing" : "Tattoo artist & piercer";
 default: return greek ? "Καλλιτέχνης τατουάζ" : "Tattoo artist";
 }
}
export function studioWebsite(value?: string): string | null {
 if (!value) return null;
 try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
