"use client";

import Link from "next/link";
import { BarChart3, CalendarCheck, Image as ImageIcon, Star } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { StudioSignupForm } from "@/components/studio-signup-form";
import { buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

const icons = [ImageIcon, Star, CalendarCheck, BarChart3];

export function ForStudiosClient() {
  const { t } = useLocale();

  return (
    <div>
      <div className="border-b border-line bg-ink-2/40">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-16 text-center">
          <SectionHeading
            align="center"
            eyebrow={t.forStudios.eyebrow}
            title={t.forStudios.title}
            description={t.forStudios.description}
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-12">
        <ScrollReveal>
          <StudioSignupForm />
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          {t.forStudios.benefits.map((b, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={b.title} delay={i * 0.06}>
                <Icon size={22} className="text-brass-bright" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl text-paper">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{b.body}</p>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} className="mt-16 rounded-xl border border-line bg-ink-2 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-paper">{t.forStudios.freeDuringLaunch}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper-dim">
                {t.forStudios.freeDuringLaunchBody}
              </p>
            </div>
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "shrink-0 border-line-strong text-paper hover:bg-ink-3")}
            >
              {t.forStudios.seePricing}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
