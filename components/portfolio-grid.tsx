"use client";

import { useState } from "react";
import { PortfolioViewer } from "@/components/portfolio-viewer";
import Image from "next/image";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import type { PortfolioPiece } from "@/lib/types";

export function PortfolioGrid({ pieces, artistName }: { pieces: PortfolioPiece[]; artistName: string }) {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {pieces.map((piece, index) => (
        <button type="button" onClick={() => setSelected(index)} aria-label={(locale === "el" ? "Προβολή: " : "View: ") + piece.caption} key={piece.id}
          className="group text-left focus-visible:outline-2 focus-visible:outline-brass relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-ink-2"
        >
          <Image
            src={piece.imageUrl}
            alt={piece.caption}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink via-ink/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-brass-bright">
              {styleName(piece.styleId)}
            </p>
            <p className="mt-0.5 text-sm text-paper">{piece.caption}</p>
            <p className="font-mono text-xs text-paper-dim">
              {t.artist.from} €{piece.priceEUR}
            </p>
          </div>
        </button>))}
    </div><PortfolioViewer pieces={pieces} artistName={artistName} index={selected} onChange={setSelected} onClose={() => setSelected(null)} /></>);
}


