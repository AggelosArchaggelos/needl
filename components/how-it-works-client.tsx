"use client";

import Link from "next/link";
import { ArrowRight, Filter, MessageSquare, Search, Sparkles } from "lucide-react";
import { NeedleMark } from "@/components/needle-mark";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

const icons = [Search, Filter, MessageSquare, Sparkles];

export function HowItWorksClient() {
  const { t } = useLocale();

  return (
    <div>
      <div className="border-b border-line bg-ink-2/40">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-16 text-center">
          <SectionHeading
            align="center"
            eyebrow={t.howItWorks.eyebrow}
            title={t.howItWorks.title}
            description={t.howItWorks.description}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={step.title} delay={i * 0.06}>
                <Icon size={22} className="text-red-bright" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{step.body}</p>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} className="mt-16 text-paper-dim">
          <NeedleMark variant="divider" className="h-3 text-line-strong" />
        </ScrollReveal>

        <ScrollReveal delay={0.24} className="mt-12 rounded-xl border border-line bg-ink-2 p-8 sm:p-10">
          <h2 className="font-display text-2xl text-paper">{t.howItWorks.noteTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim">
            {t.howItWorks.noteBody}
          </p>
          <Link
            href="/browse"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 bg-red text-paper hover:bg-red-bright")}
          >
            {t.howItWorks.startBrowsing} <ArrowRight />
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
