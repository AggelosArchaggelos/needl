"use client";

import Image from "next/image";
import Link from "next/link";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { Artist } from "@/lib/types";

export function ArtistCard({ artist }: { artist: Artist }) {
  const { locale } = useLocale();

  return (
    <Link
      href={`/studios/${artist.studioSlug}/artists/${artist.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-ink-2 transition-colors duration-300 hover:border-line-strong"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line-strong">
          <Image
            src={artist.avatarUrl}
            alt={artist.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base text-paper">{artist.name}</h3>
          <p className="text-sm text-paper-dim">{localize(artist.role, locale)}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {artist.styleIds.map((id) => (
              <span key={id} className="text-[11px] text-red-bright">
                {styleName(id)}
                {id !== artist.styleIds[artist.styleIds.length - 1] && (
                  <span className="text-paper-faint"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-px bg-line">
        {artist.portfolio.slice(0, 4).map((piece) => (
          <div key={piece.id} className="relative aspect-square overflow-hidden bg-ink-2">
            <Image
              src={piece.imageUrl}
              alt={piece.caption}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </Link>
  );
}
