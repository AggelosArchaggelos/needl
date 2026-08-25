"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { BookingDialog } from "@/components/booking-dialog";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { cityName } from "@/lib/data/cities";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { Artist, Studio } from "@/lib/types";

export function ArtistView({ studio, artist }: { studio: Studio; artist: Artist }) {
  const { t, locale } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href={`/studios/${studio.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
      >
        <ArrowLeft size={15} /> {studio.name}
      </Link>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-line-strong">
            <Image
              src={artist.avatarUrl}
              alt={artist.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-display text-3xl text-paper sm:text-4xl">{artist.name}</h1>
            <p className="mt-1 text-paper-dim">
              {localize(artist.role, locale)} · {studio.name} · {cityName(studio.cityId, locale)}
            </p>
            <p className="mt-1 font-mono text-xs text-paper-faint">
              {artist.yearsExperience} {t.artist.yearsExperience}
            </p>
          </div>
        </div>
        <BookingDialog
          studio={studio}
          artist={artist}
          trigger={
            <Button size="lg" className="shrink-0 bg-red text-paper hover:bg-red-bright">
              {t.artist.bookWith} {artist.name.split(" ")[0]}
            </Button>
          }
        />
      </div>

      <ScrollReveal className="mt-10 max-w-2xl">
        <p className="leading-relaxed text-paper-dim">{localize(artist.bio, locale)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {artist.styleIds.map((id) => (
              <span
                key={id}
                className="rounded-full border border-line-strong px-2.5 py-1 text-xs text-paper-dim"
              >
                {styleName(id)}
              </span>
            ))}
          </div>
          <a
            href={`https://instagram.com/${artist.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
          >
            <InstagramIcon size={15} /> @{artist.instagramHandle}
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="mt-12">
        <h2 className="font-display text-2xl text-paper">{t.artist.portfolio}</h2>
        <div className="mt-6">
          <PortfolioGrid pieces={artist.portfolio} />
        </div>
      </ScrollReveal>
    </div>
  );
}
