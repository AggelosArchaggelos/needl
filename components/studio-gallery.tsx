"use client";
import { useState } from "react";
import Image from "next/image";
import { PortfolioViewer } from "@/components/portfolio-viewer";
import { useLocale } from "@/lib/i18n/locale-context";
export function StudioGallery({ images, studioName }: { images: string[]; studioName: string }) {
  const { locale } = useLocale();
  const [selected, setSelected] = useState<number | null>(null);
  const pieces = images.map((imageUrl, i) => ({ id: "studio-photo-" + i, imageUrl, caption: studioName + " · " + (locale === "el" ? "Φωτογραφία " : "Photo ") + (i + 1) }));
  return <><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {pieces.map((piece, i) => <button key={piece.id} type="button" onClick={() => setSelected(i)} aria-label={(locale === "el" ? "Μεγέθυνση: " : "Enlarge: ") + piece.caption} className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg border border-line focus-visible:outline-2 focus-visible:outline-brass hover:border-line-strong">
      <Image src={piece.imageUrl} alt={piece.caption} fill sizes="220px" className="object-cover" />
    </button>)}
  </div><PortfolioViewer studioPhotos pieces={pieces} artistName={studioName} index={selected} onChange={setSelected} onClose={() => setSelected(null)} /></>;
}
