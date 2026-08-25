"use client";

import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data/site-config";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import { cn } from "@/lib/utils";

export function PricingClient() {
  const { t, locale } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        align="center"
        eyebrow={t.pricing.eyebrow}
        title={t.pricing.title}
        description={t.pricing.description}
        className="mx-auto max-w-2xl"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {siteConfig.pricingTiers.map((tier, i) => (
          <ScrollReveal key={tier.name.en} delay={i * 0.06}>
            <div
              className={cn(
                "flex h-full flex-col rounded-xl border p-6",
                tier.highlight
                  ? "border-brass/40 bg-brass/[0.06]"
                  : "border-line bg-ink-2",
              )}
            >
              <h3 className="font-display text-xl text-paper">{localize(tier.name, locale)}</h3>
              <p className="mt-3">
                <span className="font-display text-3xl text-paper">{localize(tier.price, locale)}</span>{" "}
                <span className="text-sm text-paper-faint">{localize(tier.period, locale)}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                {localize(tier.description, locale)}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature.en} className="flex items-start gap-2 text-sm text-paper-dim">
                    <Check size={15} className="mt-0.5 shrink-0 text-brass-bright" />
                    {localize(feature, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
