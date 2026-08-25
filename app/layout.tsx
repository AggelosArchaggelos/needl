import type { Metadata } from "next";
import { Literata, Manrope, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "greek"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "greek"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Needl — Find your tattoo artist in Greece",
  description:
    "Browse tattoo studios and artists across Greece by city, style, and price. See real portfolios, check ratings, and book directly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${literata.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <LocaleProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
