"use client";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { styles } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";
import { styleGuideCopy } from "@/lib/i18n/style-guide";
import { finderCopy } from "@/lib/style-finder";
export function HowItWorksClient() {
 const { locale } = useLocale(); const c = styleGuideCopy[locale];
 return <div className="mx-auto max-w-4xl px-6 py-16">
  <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-bright">{c.eyebrow}</p>
  <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-paper sm:text-5xl">{c.title}</h1>
  <p className="mt-5 max-w-2xl leading-relaxed text-paper-dim">{c.intro}</p>
  <ScrollReveal className="my-10 rounded-xl border border-line bg-ink-2 p-6"><h2 className="font-display text-xl text-paper">{c.tipTitle}</h2><p className="mt-3 text-sm leading-relaxed text-paper-dim">{c.tip}</p></ScrollReveal>
  <div className="divide-y divide-line border-y border-line">
   {styles.filter(s=>s.guide).map((style,i)=><details key={style.id} name="tattoo-styles" className="group py-1">
    <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-brass [&::-webkit-details-marker]:hidden">
     <span className="font-mono text-xs text-brass-bright">{String(i+1).padStart(2,'0')}</span><div className="flex-1"><h2 className="font-display text-2xl text-paper">{style.name.en}</h2><p className="mt-1 text-sm text-paper-dim">{localize(style.guide!.summary,locale)}</p></div><Plus size={18} className="shrink-0 text-paper-dim transition-transform group-open:rotate-45 motion-reduce:transition-none" />
    </summary>
    <div className="pb-7 pl-8"><div className="grid gap-6 sm:grid-cols-2">{([[c.looks,style.guide!.description],[c.example,style.guide!.example]] as const).map(([title,body])=><div key={title}><h3 className="text-xs uppercase tracking-wider text-brass-bright">{title}</h3><p className="mt-2 text-sm leading-relaxed text-paper-dim">{localize(body,locale)}</p></div>)}</div><p className="mt-6 text-sm leading-relaxed text-paper-dim"><strong className="font-medium text-paper">{c.compare}: </strong>{localize(style.guide!.comparison,locale)}</p><Link href={'/browse?styles='+style.id} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-red-bright hover:underline focus-visible:outline-2 focus-visible:outline-brass">{c.cta} · {style.name.en}<ArrowRight size={16}/></Link></div>
   </details>)}
  </div>
  <ScrollReveal className="mt-12 rounded-xl border border-line bg-ink-2 p-7"><h2 className="font-display text-2xl text-paper">{c.endTitle}</h2><p className="mt-3 text-sm leading-relaxed text-paper-dim">{c.end}</p><Link href="/style-finder" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-brass px-5 text-sm text-brass-bright hover:bg-brass/10">{finderCopy[locale].entry} →</Link><br/><Link href="/browse" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-red px-5 text-sm text-paper hover:bg-red-bright">{c.all}</Link></ScrollReveal>
 </div>;
}
