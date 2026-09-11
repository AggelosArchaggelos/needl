"use client";
import { Heart } from "lucide-react";
import { useFavourites } from "@/lib/favourites";
import { useLocale } from "@/lib/i18n/locale-context";
export function SaveButton({ id }: { id: string }) {
  const { ids, ready, error, toggle } = useFavourites(); const { locale } = useLocale();
  const saved = ids.includes(id); const el = locale === "el";
  return <span className="inline-flex flex-col items-start"><button type="button" disabled={!ready} aria-pressed={saved} onClick={() => toggle(id)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-ink-2 px-3 text-sm text-paper hover:border-brass focus-visible:outline-2 focus-visible:outline-brass disabled:opacity-40"><Heart size={17} className={saved ? "fill-red-bright text-red-bright" : ""}/>{saved ? (el ? "Αποθηκεύτηκε" : "Saved") : (el ? "Αποθήκευση" : "Save")}</button>{error && <span role="status" className="max-w-48 text-xs text-paper-dim">{el ? "Δεν αποθηκεύτηκε μόνιμα." : "Could not persist saves."}</span>}</span>;
}
