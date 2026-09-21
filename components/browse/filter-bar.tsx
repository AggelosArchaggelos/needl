"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { cities, cityName } from "@/lib/data/cities";
import { styles } from "@/lib/data/styles";
import { defaultFilters } from "@/lib/filters";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import { discovery } from "@/lib/i18n/discovery";
import type { BrowseFilters } from "@/lib/types";

export type BrowseView = "artists" | "studios";

export function FilterBar({
  filters,
  onChange,
  view,
  onViewChange,
}: {
  filters: BrowseFilters;
  onChange: (next: BrowseFilters) => void;
  view: BrowseView;
  onViewChange: (next: BrowseView) => void;
}) {
  const { t, locale } = useLocale();
  const d = discovery[locale];
  function toggleStyle(id: string) {
    const has = filters.styleIds.includes(id);
    onChange({
      ...filters,
      styleIds: has ? filters.styleIds.filter((s) => s !== id) : [...filters.styleIds, id],
    });
  }

  const isDefault = filters.cityId === "all" && filters.styleIds.length === 0;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-line bg-ink-2 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-1 flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              {d.show}
            </span>
            <button
              type="button"
              aria-label={d.show + ": " + (view === "artists" ? d.viewArtists : d.viewStudios)}
              onClick={() => onViewChange(view === "artists" ? "studios" : "artists")}
              className="flex h-9 items-center gap-1 rounded-lg border border-line-strong p-0.5 text-sm"
            >
              {(["artists", "studios"] as const).map((option) => (
                <span
                  key={option}
                  className={cn(
                    "flex h-full items-center rounded-md px-3.5 transition-colors",
                    view === option ? "bg-red/15 text-red-bright" : "text-paper-dim",
                  )}
                >
                  {option === "artists" ? d.viewArtists : d.viewStudios}
                </span>
              ))}
            </button>
          </div>
          <div className="flex min-w-[9rem] max-w-xs flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              {t.filters.city}
            </span>
            <Select
              value={filters.cityId}
              onValueChange={(v) => onChange({ ...filters, cityId: v ?? "all" })}
            >
              <SelectTrigger className="w-full border-line-strong bg-transparent text-paper">
                <SelectValue placeholder={t.filters.allCities}>
                  {(v: string) => (v === "all" ? t.filters.allCities : cityName(v, locale))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-line-strong bg-ink-2 text-paper">
                <SelectItem value="all">{t.filters.allCities}</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {localize(c.name, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="text-paper-dim hover:bg-ink-3 hover:text-paper"
            onClick={() => onChange(defaultFilters)}
          >
            <X /> {t.filters.clearFilters}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
          {t.filters.style}
        </span>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => {
            const active = filters.styleIds.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border-red-bright bg-red/15 text-red-bright"
                    : "border-line-strong text-paper-dim hover:border-paper-dim hover:text-paper",
                )}
              >
                {style.name.en}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
