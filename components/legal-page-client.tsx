"use client";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

export function LegalPageClient({ doc }: { doc: "privacy" | "terms" }) {
  const { t } = useLocale();
  const page = t.legal[doc];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading eyebrow={t.footer.legal} title={page.title} />
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
        {t.legal.updated}: 2026-09-28
      </p>

      <ScrollReveal className="mt-8 space-y-10">
        <p className="text-base leading-relaxed text-paper-dim">{page.intro}</p>

        {page.sections.map((section) => (
          <div key={section.heading} className="space-y-3">
            <h2 className="font-display text-xl text-paper">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-paper-dim">
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        <p className="border-t border-line pt-6 text-sm text-paper-dim">
          {t.legal.contactPrefix}{" "}
          <a href="mailto:studios@needl.gr" className="text-brass-bright hover:underline">
            studios@needl.gr
          </a>
        </p>
      </ScrollReveal>
    </div>
  );
}
