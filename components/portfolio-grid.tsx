"use client";

import Image from "next/image";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import type { PortfolioPiece } from "@/lib/types";

export function PortfolioGrid({ pieces }: { pieces: PortfolioPiece[] }) {
  const { t, locale } = useLocale();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-ink-2"
        >
          <Image
            src={piece.imageUrl}
            alt={piece.caption}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/95 via-ink/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-brass-bright">
              {styleName(piece.styleId)}
            </p>
            <p className="mt-0.5 text-sm text-paper">{piece.caption}</p>
            <p className="font-mono text-xs text-paper-dim">
              {t.artist.from} €{piece.priceEUR}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
