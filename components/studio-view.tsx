"use client";

import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { ArtistCard } from "@/components/artist-card";
import { BookingDialog } from "@/components/booking-dialog";
import { PromotedBadge } from "@/components/promoted-badge";
import { RatingStars } from "@/components/rating-stars";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { cityName } from "@/lib/data/cities";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { Studio } from "@/lib/types";

export function StudioView({ studio }: { studio: Studio }) {
  const { t, locale } = useLocale();

  return (
    <div>
      <div className="relative h-[46vh] min-h-80 w-full overflow-hidden">
        <Image
          src={studio.heroImageUrl}
          alt={`Interior of ${studio.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="-mt-20 flex flex-col gap-8 rounded-xl border border-line bg-ink-2/95 p-6 backdrop-blur sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            {studio.promoted && <PromotedBadge className="mb-3" />}
            <h1 className="font-display text-4xl text-paper sm:text-5xl">{studio.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper-dim">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} /> {localize(studio.neighborhood, locale)}, {cityName(studio.cityId, locale)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {localize(studio.hours, locale)}
              </span>
              <RatingStars rating={studio.rating} reviewCount={studio.reviewCount} />
            </div>
          </div>
          <BookingDialog
            studio={studio}
            trigger={
              <Button size="lg" className="shrink-0 bg-red text-paper hover:bg-red-bright">
                {t.studio.bookWith} {studio.name.split(" ")[0]}
              </Button>
            }
          />
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
          <div>
            <ScrollReveal>
              <p className="max-w-2xl text-base leading-relaxed text-paper-dim">
                {localize(studio.description, locale)}
              </p>
            </ScrollReveal>

            {studio.galleryImages.length > 0 && (
              <ScrollReveal delay={0.05} className="mt-10">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {studio.galleryImages.map((src, i) => (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden rounded-lg border border-line"
                    >
                      <Image
                        src={src}
                        alt={`${studio.name}, photo ${i + 1}`}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1} className="mt-14">
              <h2 className="font-display text-2xl text-paper">{t.studio.artists}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {studio.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </ScrollReveal>
          </div>

          <aside className="flex h-fit flex-col gap-6 rounded-lg border border-line bg-ink-2 p-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                {t.studio.price}
              </p>
              <p className="mt-1 text-paper">
                {studio.priceBand}{" "}
                <span className="text-sm text-paper-dim">
                  · {t.studio.avgPerSession} €{studio.avgSessionEUR} {t.studio.perSession}
                </span>
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                {t.studio.styles}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {studio.styleIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-line-strong px-2 py-0.5 text-xs text-paper-dim"
                  >
                    {styleName(id)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                {t.studio.address}
              </p>
              <p className="mt-1 text-sm text-paper-dim">{studio.address}</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <a
                href={`https://instagram.com/${studio.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
              >
                <InstagramIcon size={16} /> @{studio.instagramHandle}
              </a>
              <a
                href={`tel:${studio.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
              >
                <Phone size={16} /> {studio.phone}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
