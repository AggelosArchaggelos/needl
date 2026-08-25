"use client";

import Link from "next/link";
import { NeedleMark } from "@/components/needle-mark";
import { cities } from "@/lib/data/cities";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";

export function SiteFooter() {
  const { t, locale } = useLocale();

  const columns = [
    {
      heading: t.footer.explore,
      links: [
        { href: "/browse", label: t.nav.browse },
        { href: "/news", label: t.nav.news },
        { href: "/how-it-works", label: t.nav.howItWorks },
        { href: "/about", label: t.nav.about },
      ],
    },
    {
      heading: t.footer.forStudios,
      links: [
        { href: "/for-studios", label: t.nav.listYourStudio },
        { href: "/pricing", label: t.nav.pricing },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="h-6 w-6 text-paper">
                <NeedleMark />
              </span>
              <span className="font-display text-lg text-paper">Needl</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-dim">
              {t.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper-dim transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
              {t.footer.cities}
            </p>
            <ul className="mt-4 space-y-2.5">
              {cities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/browse?city=${city.id}`}
                    className="text-sm text-paper-dim transition-colors hover:text-paper"
                  >
                    {localize(city.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-paper-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Needl. {t.footer.copyright}
          </p>
          <p>{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
