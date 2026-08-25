"use client";

import Link from "next/link";
import { NeedleMark } from "@/components/needle-mark";
import { buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      <span className="h-14 w-14 text-paper-dim">
        <NeedleMark />
      </span>
      <h1 className="mt-6 font-display text-3xl text-paper">{t.notFound.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t.notFound.body}</p>
      <Link
        href="/browse"
        className={cn(buttonVariants({ size: "lg" }), "mt-8 bg-red text-paper hover:bg-red-bright")}
      >
        {t.notFound.browseStudios}
      </Link>
    </div>
  );
}
