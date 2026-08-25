import newsData from "@/content/news.json";
import type { NewsArticle } from "@/lib/types";

export const newsArticles: NewsArticle[] = newsData;

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function latestNews(count: number): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
