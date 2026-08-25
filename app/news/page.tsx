import type { Metadata } from "next";
import { NewsListClient } from "@/components/news-list-client";
import { latestNews } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News — Needl",
  description: "Tattoo culture stories, studio announcements, and guides from Needl.",
};

export default function NewsPage() {
  const articles = latestNews(50);
  return <NewsListClient articles={articles} />;
}
