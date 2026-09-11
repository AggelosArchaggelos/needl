"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FilterBar } from "@/components/browse/filter-bar";
import { SectionHeading } from "@/components/section-heading";
import { StudioCard } from "@/components/studio-card";
import { useLocale } from "@/lib/i18n/locale-context";
import { cities } from "@/lib/data/cities";
import { styles } from "@/lib/data/styles";
import { defaultFilters, filterStudios } from "@/lib/filters";
import type { BrowseFilters, Studio } from "@/lib/types";

export function BrowseClient({
  studios,
  initialCity,
  initialStyles = [],
}: {
  studios: Studio[];
  initialCity?: string;
  initialStyles?: string[];
}) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<BrowseFilters>({
    ...defaultFilters,
    cityId: cities.some(c => c.id === initialCity) ? initialCity! : defaultFilters.cityId,
    styleIds: initialStyles.filter(id => styles.some(s => s.id === id)),
  });

  useEffect(() => {
    const readFilters = () => { const p = new URLSearchParams(location.search); setFilters({ cityId: cities.some(c => c.id === p.get("city")) ? p.get("city")! : "all", styleIds: (p.get("styles") ?? "").split(",").filter(id => styles.some(s => s.id === id)) }); };
    const key = () => "needl-browse-scroll:" + location.search;
    let frame = 0;
    const save = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { try { sessionStorage.setItem(key(), String(window.scrollY)); } catch {} }); };
    try { const y = Number(sessionStorage.getItem(key())); if (Number.isFinite(y) && y > 0) frame = requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" })); } catch {}
    window.addEventListener("popstate", readFilters); window.addEventListener("scroll", save, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("popstate", readFilters); window.removeEventListener("scroll", save); };
  }, []);
  function changeFilters(next: BrowseFilters) {
    setFilters(next); const url = new URL(location.href);
    if (next.cityId === "all") url.searchParams.delete("city"); else url.searchParams.set("city", next.cityId);
    if (next.styleIds.length) url.searchParams.set("styles", next.styleIds.join(",")); else url.searchParams.delete("styles");
    window.history.replaceState(window.history.state, "", url);
  }
  const results = useMemo(() => filterStudios(studios, filters), [studios, filters]);

  return (
    <div>
      <div className="border-b border-line bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-14">
          <SectionHeading
            eyebrow={t.browse.eyebrow}
            title={t.browse.title}
            description={t.browse.description}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <FilterBar filters={filters} onChange={changeFilters} />

        <div className="mt-8 flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
            {results.length} {results.length === 1 ? t.browse.studio : t.browse.studios}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((studio) => (
              <motion.div
                key={studio.id}
                layout={!reducedMotion}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
              >
                <StudioCard studio={studio} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center rounded-lg border border-dashed border-line-strong py-20 text-center">
            <p className="font-display text-xl text-paper">{t.browse.emptyTitle}</p>
            <p className="mt-2 max-w-sm text-sm text-paper-dim">{t.browse.emptyBody}</p>
          </div>
        )}
      </div>
    </div>
  );
}
