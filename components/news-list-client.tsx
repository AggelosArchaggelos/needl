"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { NewsArticle } from "@/lib/types";

export function NewsListClient({ articles }: { articles: NewsArticle[] }) {
  const { t, locale } = useLocale();

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale === "el" ? "el-GR" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <div className="border-b border-line bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-14">
          <SectionHeading
            eyebrow={t.news.eyebrow}
            title={t.news.title}
            description={t.news.description}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ScrollReveal key={article.id} delay={Math.min(i, 6) * 0.04}>
              <Link
                href={`/news/${article.slug}`}
                className="group block overflow-hidden rounded-lg border border-line bg-ink-2 transition-colors duration-300 hover:border-line-strong"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={localize(article.title, locale)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                    {formatDate(article.publishedAt)} · {article.sourceName}
                  </p>
                  <h3 className="mt-2 font-display text-lg leading-tight text-paper">
                    {localize(article.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                    {localize(article.excerpt, locale)}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
