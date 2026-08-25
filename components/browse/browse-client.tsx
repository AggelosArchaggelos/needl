"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { FilterBar } from "@/components/browse/filter-bar";
import { SectionHeading } from "@/components/section-heading";
import { StudioCard } from "@/components/studio-card";
import { useLocale } from "@/lib/i18n/locale-context";
import { defaultFilters, filterStudios } from "@/lib/filters";
import type { BrowseFilters, Studio } from "@/lib/types";

export function BrowseClient({
  studios,
  initialCity,
}: {
  studios: Studio[];
  initialCity?: string;
}) {
  const { t } = useLocale();
  const [filters, setFilters] = useState<BrowseFilters>({
    ...defaultFilters,
    cityId: initialCity ?? defaultFilters.cityId,
  });

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
        <FilterBar filters={filters} onChange={setFilters} />

        <div className="mt-8 flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
            {results.length} {results.length === 1 ? t.browse.studio : t.browse.studios}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((studio, i) => (
              <motion.div
                key={studio.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
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
