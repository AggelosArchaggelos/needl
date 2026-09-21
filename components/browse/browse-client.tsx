"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FilterBar, type BrowseView } from "@/components/browse/filter-bar";
import { StudioCard } from "@/components/studio-card";
import { SectionHeading } from "@/components/section-heading";
import { ArtistCard } from "@/components/artist-card";
import Link from "next/link";
import { cityName } from "@/lib/data/cities";
import { findArtists, findStudios, artistRating } from "@/lib/artist-search";
import { discovery } from "@/lib/i18n/discovery";
import { useLocale } from "@/lib/i18n/locale-context";
import { cities } from "@/lib/data/cities";
import { styles } from "@/lib/data/styles";
import { defaultFilters } from "@/lib/filters";
import type { BrowseFilters, Studio } from "@/lib/types";


export function BrowseClient({
  studios,
  initialCity,
  initialStyles = [],
  initialView,
}: {
  studios: Studio[];
  initialCity?: string;
  initialStyles?: string[];
  initialView?: string;
}) {
  const { t, locale } = useLocale();
  const d = discovery[locale];
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<BrowseFilters>({
    ...defaultFilters,
    cityId: cities.some(c => c.id === initialCity) ? initialCity! : defaultFilters.cityId,
    styleIds: initialStyles.filter(id => styles.some(s => s.id === id)),
  });

  const [view, setView] = useState<BrowseView>(initialView === "studios" ? "studios" : "artists");

  useEffect(() => {
    const readFilters = () => { setView(new URLSearchParams(location.search).get("view") === "studios" ? "studios" : "artists"); const p = new URLSearchParams(location.search); setFilters(current => ({ ...current, cityId: cities.some(c => c.id === p.get("city")) ? p.get("city")! : "all", styleIds: (p.get("styles") ?? "").split(",").filter(id => styles.some(s => s.id === id)) })); };
    const key = () => "needl-browse-scroll:" + location.search;
    let frame = 0;
    const save = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { try { sessionStorage.setItem(key(), String(window.scrollY)); } catch {} }); };
    try { const y = Number(sessionStorage.getItem(key())); if (Number.isFinite(y) && y > 0) frame = requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" })); } catch {}
    readFilters();
    window.addEventListener("popstate", readFilters); window.addEventListener("scroll", save, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("popstate", readFilters); window.removeEventListener("scroll", save); };
  }, []);
  function changeFilters(next: BrowseFilters) {
    setFilters(next); const url = new URL(location.href);
    if (next.cityId === "all") url.searchParams.delete("city"); else url.searchParams.set("city", next.cityId);
    if (next.styleIds.length) url.searchParams.set("styles", next.styleIds.join(",")); else url.searchParams.delete("styles");
    url.searchParams.delete("rating");
    window.history.replaceState(window.history.state, "", url);
  }
  function changeView(next: BrowseView) {
    setView(next); const url = new URL(location.href);
    if (next === "studios") url.searchParams.set("view", "studios"); else url.searchParams.delete("view");
    window.history.replaceState(window.history.state, "", url);
  }
  const results = useMemo(() => findArtists(studios, filters), [studios, filters]);
  const studioResults = useMemo(() => findStudios(studios, filters), [studios, filters]);
  const showingStudios = view === "studios";
  const count = showingStudios ? studioResults.length : results.length;

  return (
    <div>
      <div className="border-b border-line bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-14">
          <SectionHeading
            eyebrow={t.browse.eyebrow}
            title={d.title}
            description={d.description}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <FilterBar filters={filters} onChange={changeFilters} view={view} onViewChange={changeView} />

        <div className="mt-8 flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
            {count} {showingStudios ? (count === 1 ? d.studioSingular : d.studioPlural) : (count === 1 ? d.artist : d.artists)}
          </p>
        </div>

        {showingStudios ? (
          studioResults.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studioResults.map((studio) => <StudioCard key={studio.id} studio={studio} />)}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center rounded-lg border border-dashed border-line-strong py-20 text-center">
              <p className="font-display text-xl text-paper">{d.emptyStudios}</p>
              <p className="mt-2 max-w-sm text-sm text-paper-dim">{d.emptyStudiosBody}</p>
            </div>
          )
        ) : results.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ artist, studio, matchedStyles }) => (
              <motion.div
                key={studio.id + ":" + artist.id}
                layout={!reducedMotion}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
              >
                <ArtistCard artist={artist} />
                <div className="space-y-2 px-2 py-3 text-sm text-paper-dim">
                  <Link href={"/studios/" + studio.slug} className="text-brass-bright hover:underline">{d.studio} {studio.name} · {cityName(studio.cityId, locale)}</Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>{artistRating(artist) === undefined ? d.unrated : "★ " + artist.rating!.toFixed(1) + " (" + artist.reviewCount + " " + d.review + ")"}</span>
                    {filters.styleIds.length > 0 && <span>{matchedStyles}/{filters.styleIds.length} {d.match}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center rounded-lg border border-dashed border-line-strong py-20 text-center">
            <p className="font-display text-xl text-paper">{d.empty}</p>
            <p className="mt-2 max-w-sm text-sm text-paper-dim">{d.emptyBody}</p>
          </div>
        )}
      </div>
    </div>
  );
}
