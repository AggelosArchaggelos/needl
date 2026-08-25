"use client";

import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/rating-stars";
import { PromotedBadge } from "@/components/promoted-badge";
import { cityName } from "@/lib/data/cities";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { Studio } from "@/lib/types";

export function StudioCard({ studio }: { studio: Studio }) {
  const { locale, t } = useLocale();

  return (
    <Link
      href={`/studios/${studio.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-ink-2 transition-colors duration-300 hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={studio.heroImageUrl}
          alt={`Interior of ${studio.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        {studio.promoted && (
          <PromotedBadge className="absolute left-3 top-3 bg-ink/70 backdrop-blur-sm" />
        )}
        <div className="absolute bottom-3 right-3 rounded-full border border-line-strong bg-ink/70 px-2.5 py-1 font-mono text-xs text-paper backdrop-blur-sm">
          {studio.priceBand}
          <span className="text-paper-faint"> · {t.artist.from} €{studio.avgSessionEUR}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight text-paper">{studio.name}</h3>
        </div>
        <p className="mt-1 text-sm text-paper-dim">
          {localize(studio.neighborhood, locale)}, {cityName(studio.cityId, locale)}
        </p>
        <RatingStars rating={studio.rating} reviewCount={studio.reviewCount} className="mt-3" />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {studio.styleIds.slice(0, 3).map((id) => (
            <span
              key={id}
              className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-paper-dim"
            >
              {styleName(id)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
