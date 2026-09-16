"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { NeedleMark } from "@/components/needle-mark";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t, locale } = useLocale();
  const savedLabel = locale === "el" ? "Αποθηκευμένα" : "Saved";

  const navLinks = [
    { href: "/saved", label: locale === "el" ? "Αποθηκευμένα" : "Saved" },
    { href: "/browse", label: t.nav.browse },
    { href: "/news", label: t.nav.news },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/for-studios", label: t.nav.forStudios },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-6 w-6 text-paper">
            <NeedleMark />
          </span>
          <span className="font-display text-lg tracking-tight text-paper">Needl</span>
        </Link>

        <nav className="hidden items-center gap-4 xl:gap-8 lg:flex">
          {navLinks.filter((link) => link.href !== "/saved").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-underline text-sm transition-colors hover:text-paper focus-visible:text-paper focus-visible:outline-none",
                pathname === link.href ? "text-paper" : "text-paper-dim",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/saved"
            aria-label={savedLabel}
            title={savedLabel}
            aria-current={pathname === "/saved" ? "page" : undefined}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ink-3 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
              pathname === "/saved" ? "text-red-bright" : "text-paper-dim",
            )}
          >
            <Heart size={19} strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <LanguageToggle />
          <Link
            href="/for-studios"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "nav-underline text-paper-dim hover:bg-ink-3 hover:text-paper focus-visible:text-paper",
            )}
          >
            {t.nav.listYourStudio}
          </Link>
          <Link
            href="/browse"
            className={cn(
              buttonVariants({ size: "sm" }),
              "cta-sweep relative isolate overflow-hidden bg-red text-paper hover:bg-red",
            )}
          >
            {t.nav.findAnArtist}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="text-paper" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="border-line bg-ink-2 text-paper">
              <SheetTitle className="px-4 pt-6 font-display text-xl">Needl</SheetTitle>
              <nav className="flex flex-col gap-1 px-4 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 text-base text-paper-dim hover:bg-ink-3 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 px-2">
                  <Link
                    href="/browse"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants(),
                      "cta-sweep relative isolate overflow-hidden bg-red text-paper hover:bg-red",
                    )}
                  >
                    {t.nav.findAnArtist}
                  </Link>
                  <Link
                    href="/for-studios"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "border-line-strong text-paper hover:bg-ink-3",
                    )}
                  >
                    {t.nav.listYourStudio}
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
