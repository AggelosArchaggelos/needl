"use client";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { animateResultScroll } from "@/lib/result-scroll";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { styles } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { useStyleFinder } from "@/lib/use-style-finder";

export function StyleFinder() {
 const {locale}=useLocale(); const f=useStyleFinder(locale,styles); const c=f.c;
 const resultHeading = useRef<HTMLHeadingElement>(null);
 const reducedMotion = useReducedMotion();
 useEffect(() => {
  if (!f.result) return;
  let stop = () => {};
  const cancel = () => { cancelAnimationFrame(frame); stop(); };
  const frame = requestAnimationFrame(() => {
   resultHeading.current?.focus({ preventScroll: true });
   const heading = resultHeading.current;
   if (!heading) return;
   const from = window.scrollY;
   const to = Math.max(0, Math.min(from + heading.getBoundingClientRect().top - window.innerHeight * 0.22, document.documentElement.scrollHeight - window.innerHeight));
   const write = (top: number) => window.scrollTo({top, behavior: "instant"});
   if (reducedMotion) write(to);
   else stop = animateResultScroll(from, to, write);
  });
  window.addEventListener("wheel", cancel, {passive:true});
  window.addEventListener("touchstart", cancel, {passive:true});
  // The Enter event that submits can still be bubbling when this effect runs.
  // Only navigation keys should interrupt the newly scheduled animation.
  const cancelOnNavigation = (event: globalThis.KeyboardEvent) => {
   if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape", "Tab"].includes(event.key)) cancel();
  };
  window.addEventListener("keydown", cancelOnNavigation);
  return () => { cancel(); window.removeEventListener("wheel", cancel); window.removeEventListener("touchstart", cancel); window.removeEventListener("keydown", cancelOnNavigation); };
 }, [f.result, reducedMotion]);
 function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return;
  event.preventDefault();
  if (!event.repeat) event.currentTarget.form?.requestSubmit();
 }
 const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red px-5 py-3 text-sm text-paper transition-colors hover:bg-red-bright disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";
 const input="w-full rounded-xl border border-line-strong bg-ink p-4 text-paper placeholder:text-paper-faint focus:border-brass focus:outline-none";
 return <div className="mx-auto max-w-3xl px-6 py-14">
  <Link href="/how-it-works" className="inline-flex min-h-11 items-center text-sm text-paper-dim hover:text-paper">← {c.back}</Link>
  <Sparkles aria-hidden size={24} className="mt-8 text-brass-bright"/>
  <h1 className="mt-5 font-display text-4xl leading-tight text-paper sm:text-5xl">{c.title}</h1>
  <p className="mt-5 max-w-xl leading-relaxed text-paper-dim">{c.intro}</p>
  <div className="my-7 rounded-xl border border-line bg-ink-2 p-5"><p className="font-mono text-xs text-brass-bright">{f.mode==="checking"?c.checking:f.mode==="ai"?c.ai:c.preview}</p><p className="mt-2 text-sm leading-relaxed text-paper-dim">{f.mode==="ai"?c.privacy:c.local}</p></div>
  <form onSubmit={e=>{e.preventDefault();void f.run();}}>
   <label htmlFor="tattoo-idea" className="mb-3 block text-sm text-paper">{c.label}</label>
   <textarea id="tattoo-idea" onKeyDown={submitOnEnter} value={f.description} onChange={e=>f.edit(e.target.value)} maxLength={1200} rows={5} placeholder={c.placeholder} className={input} aria-describedby="idea-count"/>
   <div className="mt-2 flex items-center justify-between gap-3"><button type="button" onClick={()=>f.edit(c.sample)} className="min-h-11 text-sm text-brass-bright hover:underline">{c.example}</button><span id="idea-count" className="font-mono text-xs text-paper-faint">{f.description.length}/1200</span></div>
   <button className={button+" mt-3"} disabled={f.busy || f.mode==="checking"}>{f.busy?c.busy:c.submit}<ArrowRight size={16} aria-hidden/></button>
  </form>
  {f.error && <p role="alert" className="mt-5 text-sm text-paper">{f.error}</p>}
  <section aria-live="polite" aria-busy={f.busy}>
   {f.result && <div className="mt-10 border-t border-line pt-8">
    <h2 ref={resultHeading} tabIndex={-1} className="scroll-mt-[22vh] font-display text-2xl text-paper outline-none">{f.result.matches.length?c.results:c.empty}</h2>
    <p className="mt-3 text-sm leading-relaxed text-paper-dim">{c.caveat}</p>
    <div className="mt-6 space-y-4">{f.result.matches.map(m=><article key={m.id} className="rounded-xl border border-line bg-ink-2 p-6"><h3 className="font-display text-2xl text-paper">{styles.find(s=>s.id===m.id)?.name.en}</h3><p className="mt-3 text-sm leading-relaxed text-paper-dim">{m.reason}</p><Link href={'/browse?styles='+encodeURIComponent(m.id)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-brass-bright hover:underline">{c.explore}<ArrowRight size={16}/></Link></article>)}</div>
    {f.result.question && <form className="mt-6" onSubmit={e=>{e.preventDefault();void f.run(true);}}><label htmlFor="tattoo-detail" className="mb-3 block text-paper">{f.result.question}</label><textarea id="tattoo-detail" onKeyDown={submitOnEnter} disabled={f.busy} className={input} rows={3} maxLength={300} value={f.answer} onChange={e=>f.setAnswer(e.target.value)} placeholder={c.follow}/><button disabled={f.busy} className={button+" mt-4"}>{f.busy?c.busy:c.update}</button></form>}
    <button onClick={()=>f.edit("")} className="mt-5 min-h-11 text-sm text-paper-dim hover:text-paper">{c.reset}</button>
   </div>}
  </section>
 </div>;
}
