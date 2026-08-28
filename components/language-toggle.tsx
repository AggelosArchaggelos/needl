"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  function toggle() {
    setLocale(locale === "en" ? "el" : "en");
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-line-strong p-0.5 font-mono text-xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2 py-1 transition-colors",
          locale === "en" ? "bg-red text-paper" : "text-paper-dim hover:text-paper",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={locale === "el"}
        className={cn(
          "rounded-full px-2 py-1 transition-colors",
          locale === "el" ? "bg-red text-paper" : "text-paper-dim hover:text-paper",
        )}
      >
        ΕΛ
      </button>
    </div>
  );
}
