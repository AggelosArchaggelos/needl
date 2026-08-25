import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleClient } from "@/components/news-article-client";
import { getNewsArticle, newsArticles } from "@/lib/data/news";

export function generateStaticParams() {
  return newsArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return {};
  return { title: `${article.title.en} — Needl`, description: article.excerpt.en };
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) notFound();

  return <NewsArticleClient article={article} />;
}
