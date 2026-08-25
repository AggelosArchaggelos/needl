"use client";

import { NeedleMark } from "@/components/needle-mark";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

export function AboutClient() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} />

      <ScrollReveal className="mt-8 space-y-5 text-base leading-relaxed text-paper-dim">
        {t.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-16 flex items-center gap-4 border-t border-line pt-10">
        <span className="h-8 w-8 text-paper-dim">
          <NeedleMark />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
          {t.about.builtIn}
        </p>
      </ScrollReveal>
    </div>
  );
}
