"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import type { BrowseFilters, PriceBand } from "@/lib/types";

const priceBands: PriceBand[] = ["€", "€€", "€€€"];

export function FilterBar({
  filters,
  onChange,
}: {
  filters: BrowseFilters;
  onChange: (next: BrowseFilters) => void;
}) {
  const { t, locale } = useLocale();

  function toggleStyle(id: string) {
    const has = filters.styleIds.includes(id);
    onChange({
      ...filters,
      styleIds: has ? filters.styleIds.filter((s) => s !== id) : [...filters.styleIds, id],
    });
  }

  const isDefault =
    filters.cityId === "all" &&
    filters.styleIds.length === 0 &&
    filters.priceBand === "all" &&
    filters.minRating === defaultFilters.minRating;

  const sortLabels: Record<BrowseFilters["sort"], string> = {
    recommended: t.filters.recommended,
    rating: t.filters.topRated,
    "price-asc": t.filters.priceAsc,
    "price-desc": t.filters.priceDesc,
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-line bg-ink-2 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid flex-1 grid-cols-2 gap-3 sm:flex sm:flex-1 sm:flex-wrap">
          <div className="flex min-w-[9rem] flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              {t.filters.city}
            </span>
            <Select
              value={filters.cityId}
              onValueChange={(v) => onChange({ ...filters, cityId: v as BrowseFilters["cityId"] })}
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

          <div className="flex min-w-[9rem] flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              {t.filters.price}
            </span>
            <Select
              value={filters.priceBand}
              onValueChange={(v) =>
                onChange({ ...filters, priceBand: v as BrowseFilters["priceBand"] })
              }
            >
              <SelectTrigger className="w-full border-line-strong bg-transparent text-paper">
                <SelectValue placeholder={t.filters.anyPrice}>
                  {(v: string) => (v === "all" ? t.filters.anyPrice : v)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-line-strong bg-ink-2 text-paper">
                <SelectItem value="all">{t.filters.anyPrice}</SelectItem>
                {priceBands.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[10rem] flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
              {t.filters.sortBy}
            </span>
            <Select
              value={filters.sort}
              onValueChange={(v) => onChange({ ...filters, sort: v as BrowseFilters["sort"] })}
            >
              <SelectTrigger className="w-full border-line-strong bg-transparent text-paper">
                <SelectValue>{(v: BrowseFilters["sort"]) => sortLabels[v]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="border-line-strong bg-ink-2 text-paper">
                <SelectItem value="recommended">{t.filters.recommended}</SelectItem>
                <SelectItem value="rating">{t.filters.topRated}</SelectItem>
                <SelectItem value="price-asc">{t.filters.priceAsc}</SelectItem>
                <SelectItem value="price-desc">{t.filters.priceDesc}</SelectItem>
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

      <div className="flex flex-col gap-3 sm:max-w-xs">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
          {t.filters.minimumRating} — {(filters.minRating ?? defaultFilters.minRating).toFixed(1)}+
        </span>
        <Slider
          value={[filters.minRating]}
          min={4}
          max={5}
          step={0.1}
          onValueChange={(v) => {
            const value = Array.isArray(v) ? v[0] : v;
            onChange({ ...filters, minRating: value ?? defaultFilters.minRating });
          }}
        />
      </div>
    </div>
  );
}
