"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import type { NewsArticle } from "@/lib/types";

export function NewsArticleClient({ article }: { article: NewsArticle }) {
  const { t, locale } = useLocale();

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale === "el" ? "el-GR" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
      >
        <ArrowLeft size={15} /> {t.news.backToNews}
      </Link>

      <ScrollReveal className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
          {formatDate(article.publishedAt)} · {article.sourceName}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-paper sm:text-4xl">
          {localize(article.title, locale)}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-paper-dim">
          {localize(article.excerpt, locale)}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.06} className="relative mt-8 aspect-[16/10] overflow-hidden rounded-xl border border-line">
        <Image
          src={article.imageUrl}
          alt={localize(article.title, locale)}
          fill
          sizes="(min-width: 768px) 700px, 100vw"
          className="object-cover"
        />
      </ScrollReveal>

      {article.sourceUrl && (
        <ScrollReveal delay={0.1} className="mt-8">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-red-bright hover:underline"
          >
            {t.news.readFullStoryAt} {article.sourceName} <ArrowUpRight size={15} />
          </a>
        </ScrollReveal>
      )}
    </div>
  );
}
