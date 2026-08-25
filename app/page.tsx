"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NeedleMark } from "@/components/needle-mark";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { StudioCard } from "@/components/studio-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cities } from "@/lib/data/cities";
import { topRatedStudios } from "@/lib/data/studios";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";

export default function Home() {
  const { t, locale } = useLocale();
  const featured = topRatedStudios(6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">
              {t.home.eyebrow}
            </p>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-paper sm:text-6xl">
              {t.home.titlePrefix}
              <em className="text-paper-dim not-italic font-normal">{t.home.titleEm}</em>
              {t.home.titleSuffix}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-dim">{t.home.subhead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/browse"
                className={cn(buttonVariants({ size: "lg" }), "bg-red text-paper hover:bg-red-bright")}
              >
                {t.home.browseStudios} <ArrowRight />
              </Link>
              <Link
                href="/for-studios"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-line-strong text-paper hover:bg-ink-3",
                )}
              >
                {t.nav.listYourStudio}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/browse?city=${city.id}`}
                  className="rounded-full border border-line-strong px-3 py-1.5 text-xs text-paper-dim transition-colors hover:border-paper-dim hover:text-paper"
                >
                  {localize(city.name, locale)}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm text-paper/90 md:mx-0">
            <NeedleMark delay={0.2} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal>
          <SectionHeading
            eyebrow={t.home.topRatedEyebrow}
            title={t.home.topRatedTitle}
            description={t.home.topRatedDescription}
          />
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((studio, i) => (
            <ScrollReveal key={studio.id} delay={Math.min(i, 5) * 0.06}>
              <StudioCard studio={studio} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
          >
            {t.home.seeEveryStudio} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal>
            <SectionHeading eyebrow={t.home.howItWorksEyebrow} title={t.home.howItWorksTitle} />
          </ScrollReveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.home.steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <p className="font-mono text-sm text-red-bright">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-xl text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{step.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-brass/25 bg-brass/[0.06] p-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-paper sm:text-3xl">{t.home.promoTitle}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">{t.home.promoBody}</p>
            </div>
            <Link
              href="/for-studios"
              className={cn(buttonVariants({ size: "lg" }), "shrink-0 bg-brass text-ink hover:bg-brass-bright")}
            >
              {t.nav.listYourStudio} <ArrowRight />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
