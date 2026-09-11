import { notFound } from "next/navigation";
import { studios } from "@/lib/data/studios";
import { newsArticles } from "@/lib/data/news";
import { cities } from "@/lib/data/cities";
import { styles } from "@/lib/data/styles";
import { LocalDashboard } from "@/components/local-dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Local content dashboard — Needl", robots: { index: false, follow: false } };

export default function LocalDashboardPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <LocalDashboard initialStudios={studios} initialNews={newsArticles} cities={cities} tattooStyles={styles} />;
}
