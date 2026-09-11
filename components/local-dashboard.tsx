"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, CheckCircle2, ImageIcon } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Artist, City, Localized, NewsArticle, PortfolioPiece, Studio, TattooStyle } from "@/lib/types";

type TeamMember = Artist & { discipline?: "tattoo" | "piercing" | "both"; piercingSpecialities?: string };
type StudioDraft = Omit<Studio, "artists"> & { artists: TeamMember[]; websiteUrl?: string };
type Workspace = { version: 1; studios: StudioDraft[]; news: NewsArticle[] };
const KEY = "needl-local-editor-v1";
const control = "w-full rounded-lg border border-line-strong bg-ink px-3 py-2.5 text-sm text-paper focus:outline-2 focus:outline-brass";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm hover:bg-ink-3 focus-visible:outline-2 focus-visible:outline-brass";
const emptyText = (): Localized => ({ en: "", el: "" });
const makeId = () => crypto.randomUUID();
const safeImage = (url: string) => { try { const u = new URL(url); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } };

function Field({ label, value, onChange, multiline = false, number = false }: { label: string; value: string | number; onChange: (value: string) => void; multiline?: boolean; number?: boolean }) {
  return <label className="flex min-w-0 flex-col gap-2 text-sm text-paper-dim"><span>{label}</span>{multiline ? <textarea className={control + " min-h-24"} value={value} onChange={e => onChange(e.target.value)} /> : <input className={control} type={number ? "number" : "text"} min={number ? 0 : undefined} value={value} onChange={e => onChange(e.target.value)} />}</label>;
}
function Bilingual({ label, value, onChange }: { label: string; value: Localized; onChange: (value: Localized) => void }) {
  return <div className="grid gap-4 sm:grid-cols-2">{(["en", "el"] as const).map(lang => <Field key={lang} label={label + " · " + (lang === "en" ? "English" : "Ελληνικά")} value={value[lang]} onChange={text => onChange({ ...value, [lang]: text })} multiline />)}</div>;
}
function Photo({ url, label }: { url: string; label: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-ink-3">{safeImage(url) && !failed ?
    // Preview arbitrary HTTPS draft images without changing the published image-host configuration.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={label} className="h-full w-full object-cover" onError={() => setFailed(true)} referrerPolicy="no-referrer" /> : <ImageIcon className="text-paper-faint" aria-label={label} />}</div>;
}
function StylePicker({ value, onChange, styles }: { value: string[]; onChange: (value: string[]) => void; styles: TattooStyle[] }) {
  return <div className="flex flex-wrap gap-2">{styles.map(style => <button key={style.id} type="button" aria-pressed={value.includes(style.id)} className={button + (value.includes(style.id) ? " border-red bg-red/20" : "")} onClick={() => onChange(value.includes(style.id) ? value.filter(id => id !== style.id) : [...value, style.id])}>{style.name.en}</button>)}</div>;
}

export function LocalDashboard({ initialStudios, initialNews, cities, tattooStyles }: { initialStudios: Studio[]; initialNews: NewsArticle[]; cities: City[]; tattooStyles: TattooStyle[] }) {
  const { locale } = useLocale(); const l = (en: string, el: string) => locale === "el" ? el : en;
  const [workspace, setWorkspace] = useState<Workspace>({ version: 1, studios: initialStudios, news: initialNews });
  const [ready, setReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [section, setSection] = useState<"studios" | "news">("studios");
  const [selected, setSelected] = useState(initialStudios[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.version !== 1 || !Array.isArray(draft.studios) || !Array.isArray(draft.news) || !draft.studios.every((s: Studio) => typeof s.id === "string" && s.description?.en !== undefined && Array.isArray(s.artists) && Array.isArray(s.galleryImages)) || !draft.news.every((n: NewsArticle) => typeof n.id === "string" && n.title?.en !== undefined)) throw Error();
        setWorkspace(draft); setSelected(draft.studios[0]?.id ?? "");
      }
    } catch { setStorageMessage("Could not restore saved drafts. Nothing has been overwritten."); }
    setReady(true);
  }, []);
  function update(next: Workspace) {
    setWorkspace(next); setReviewed(false); setStorageMessage("");
    try { localStorage.setItem(KEY, JSON.stringify(next)); }
    catch { setStorageMessage("Draft changes are only in memory. Browser storage is unavailable or full. Keep this tab open."); }
  }
  const studio = workspace.studios.find(s => s.id === selected);
  const article = workspace.news.find(n => n.id === selected);
  function setStudio(next: StudioDraft) { update({ ...workspace, studios: workspace.studios.map(s => s.id === next.id ? next : s) }); }
  function setArticle(next: NewsArticle) { update({ ...workspace, news: workspace.news.map(n => n.id === next.id ? next : n) }); }
  function setArtist(index: number, next: TeamMember) { if (studio) setStudio({ ...studio, artists: studio.artists.map((a, i) => i === index ? next : a) }); }
  function switchSection(next: "studios" | "news") { setSection(next); setSelected(workspace[next][0]?.id ?? ""); setPreview(false); setReviewed(false); setQuery(""); }
  function add() {
    const id = makeId();
    if (section === "studios") {
      const next: StudioDraft = { id, slug: "draft-" + id.slice(0,8), name: "", cityId: cities[0]?.id ?? "", neighborhood: emptyText(), address: "", description: emptyText(), heroImageUrl: "", galleryImages: [], rating: 0, reviewCount: 0, priceBand: "€", avgSessionEUR: 0, styleIds: [], instagramHandle: "", phone: "", hours: emptyText(), promoted: false, artists: [], websiteUrl: "" };
      update({ ...workspace, studios: [...workspace.studios, next] });
    } else update({ ...workspace, news: [...workspace.news, { id, slug: "draft-" + id.slice(0,8), title: emptyText(), excerpt: emptyText(), imageUrl: "", sourceName: "", publishedAt: new Date().toISOString().slice(0,10), tags: [] }] });
    setSelected(id); setPreview(false);
  }
  const issues: string[] = [];
  const required = (v: string, label: string) => { if (!v?.trim()) issues.push(label); };
  const bilingual = (v: Localized, label: string) => { required(v?.en, label + " · English"); required(v?.el, label + " · Ελληνικά"); };
  const imageCheck = (v: string, label: string) => { if (!safeImage(v)) issues.push(label + " · HTTPS URL"); };
  if (section === "studios" && studio) {
    required(studio.name, l("Studio name", "Όνομα στούντιο")); required(studio.address, l("Address", "Διεύθυνση")); required(studio.phone, l("Phone", "Τηλέφωνο")); required(studio.instagramHandle, "Instagram");
    for (const f of ["description", "neighborhood", "hours"] as const) bilingual(studio[f], f);
    imageCheck(studio.heroImageUrl, l("Cover image", "Κεντρική εικόνα"));
    if (studio.websiteUrl && !safeImage(studio.websiteUrl)) issues.push("Website · HTTPS URL");
    if (!studio.galleryImages.length) issues.push(l("At least one studio photo", "Τουλάχιστον μία φωτογραφία"));
    studio.galleryImages.forEach((url, i) => imageCheck(url, "Gallery " + (i + 1)));
    if (!studio.artists.length) issues.push(l("Add a team member", "Προσθέστε μέλος ομάδας"));
    studio.artists.forEach((a, i) => { const p = l("Team member ", "Μέλος ομάδας ") + (i + 1); required(a.name, p + " · name"); required(a.instagramHandle, p + " · Instagram"); bilingual(a.bio, p + " · bio"); bilingual(a.role, p + " · role"); imageCheck(a.avatarUrl, p + " · portrait"); if (!a.portfolio.length) issues.push(p + " · portfolio"); a.portfolio.forEach((piece, k) => { required(piece.caption, p + " · caption " + (k+1)); imageCheck(piece.imageUrl, p + " · image " + (k+1)); }); });
  } else if (article) { bilingual(article.title, "Title"); bilingual(article.excerpt, "Excerpt"); required(article.sourceName, "Source"); imageCheck(article.imageUrl, "Image"); if (article.sourceUrl && !safeImage(article.sourceUrl)) issues.push("Source · HTTPS URL"); if (!Number.isFinite(Date.parse(article.publishedAt))) issues.push("Publication date"); }
  const items = section === "studios" ? workspace.studios.map(s => ({ id:s.id, name:s.name })) : workspace.news.map(n => ({ id:n.id, name:n.title[locale] || n.title.en }));

  return <div className="mx-auto max-w-7xl px-5 py-10">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-brass-bright">Needl / Studio desk</p><h1 className="font-display text-3xl">{l("Your content workspace", "Ο χώρος του περιεχομένου σας")}</h1><p className="mt-3 max-w-2xl text-sm text-paper-dim">{l("Local prototype. Drafts stay in this browser; nothing here changes the public website or app. Clearing browser data removes drafts.", "Τοπικό πρωτότυπο. Τα πρόχειρα μένουν σε αυτό το πρόγραμμα περιήγησης και δεν αλλάζουν τον δημόσιο ιστότοπο ή την εφαρμογή.")}</p></div><span className="rounded-full border border-brass/40 px-3 py-2 text-xs text-brass-bright">{l("LOCAL ONLY", "ΜΟΝΟ ΤΟΠΙΚΑ")}</span></div>
    {!ready ? <p>Loading drafts…</p> : <>
    {storageMessage && <p role="alert" className="mb-5 rounded-lg border border-red p-4">{storageMessage}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-xl border border-line bg-ink-2 p-4">
        <div className="flex gap-2">{(["studios", "news"] as const).map(s => <button key={s} className={button + (section === s ? " bg-red text-paper" : "")} aria-pressed={section === s} onClick={() => switchSection(s)}>{s === "studios" ? l("Studios", "Στούντιο") : l("News", "Ειδήσεις")}</button>)}</div>
        <Field label={l("Find a draft", "Εύρεση προχείρου")} value={query} onChange={setQuery}/>
        <button className={button + " w-full"} onClick={add}><Plus size={16}/>{l("New draft", "Νέο πρόχειρο")}</button>
        <div className="max-h-96 space-y-1 overflow-y-auto">{items.filter(n => n.name.toLowerCase().includes(query.toLowerCase())).map(n => <button key={n.id} aria-current={selected === n.id ? "true" : undefined} className={"block min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm " + (selected === n.id ? "bg-ink-3 text-paper" : "text-paper-dim hover:bg-ink-3")} onClick={() => { setSelected(n.id); setReviewed(false); }}>{n.name || l("Untitled draft", "Πρόχειρο χωρίς τίτλο")}</button>)}</div>
      </aside>
      <section aria-label={l("Draft editor", "Επεξεργασία προχείρου")} className="min-w-0 rounded-xl border border-line bg-ink-2 p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><span role="status" className="text-xs text-paper-dim">{reviewed ? l("Marked for local review", "Σημειώθηκε για τοπικό έλεγχο") : l("Draft · changes saved locally as you type", "Πρόχειρο · τοπική αποθήκευση αλλαγών")}</span><button className={button} onClick={() => setPreview(!preview)}>{preview ? <Pencil size={16}/> : <Eye size={16}/>} {preview ? l("Edit", "Επεξεργασία") : l("Preview", "Προεπισκόπηση")}</button></div>
        {preview ? <div className="space-y-6">
          {section === "studios" && studio ? <><Photo url={studio.heroImageUrl} label={studio.name}/><h2 className="font-display text-3xl">{studio.name || l("Untitled studio", "Χωρίς όνομα")}</h2><p className="text-paper-dim">{studio.address}</p><p className="whitespace-pre-wrap leading-relaxed">{studio.description[locale]}</p><p className="text-sm text-paper-dim">{studio.phone} · @{studio.instagramHandle}</p>{studio.websiteUrl && <p className="break-all text-sm text-brass-bright">{studio.websiteUrl}</p>}<div className="grid gap-4 sm:grid-cols-2">{studio.artists.map(a => <div key={a.id} className="space-y-3 rounded-xl border border-line p-4"><Photo url={a.avatarUrl} label={a.name}/><h3 className="font-display text-xl">{a.name}</h3><p className="text-sm text-brass-bright">{a.role[locale]}</p><p className="text-sm text-paper-dim">{a.bio[locale]}</p><div className="grid grid-cols-2 gap-2">{a.portfolio.map(p => <Photo key={p.id} url={p.imageUrl} label={p.caption}/>)}</div></div>)}</div></> : article ? <><Photo url={article.imageUrl} label={article.title[locale]}/><h2 className="font-display text-3xl">{article.title[locale]}</h2><p className="text-paper-dim">{article.sourceName} · {article.publishedAt}</p><p className="whitespace-pre-wrap">{article.excerpt[locale]}</p></> : null}
          <p className="text-xs text-paper-dim">{l("Draft preview only. This is not an exact copy of the public profile layout.", "Προεπισκόπηση προχείρου, όχι ακριβές αντίγραφο του δημόσιου προφίλ.")}</p>
        </div> : section === "studios" && studio ? <div className="space-y-6">
          <Field label={l("Studio name", "Όνομα στούντιο")} value={studio.name} onChange={name => setStudio({...studio,name})}/>
          <label className="block space-y-2 text-sm text-paper-dim">{l("City", "Πόλη")}<select className={control} value={studio.cityId} onChange={e => setStudio({...studio,cityId:e.target.value})}>{cities.map(c => <option key={c.id} value={c.id}>{c.name[locale]}</option>)}</select></label>
          <Bilingual label={l("Neighbourhood", "Περιοχή")} value={studio.neighborhood} onChange={neighborhood => setStudio({...studio,neighborhood})}/>
          <Field label={l("Address", "Διεύθυνση")} value={studio.address} onChange={address => setStudio({...studio,address})}/>
          <div className="grid gap-4 sm:grid-cols-2"><Field label={l("Public phone", "Δημόσιο τηλέφωνο")} value={studio.phone} onChange={phone => setStudio({...studio,phone})}/><Field label="Instagram" value={studio.instagramHandle} onChange={instagramHandle => setStudio({...studio,instagramHandle})}/></div>
          <Field label={l("Website (optional)", "Ιστότοπος (προαιρετικό)")} value={studio.websiteUrl ?? ""} onChange={websiteUrl => setStudio({...studio,websiteUrl})}/>
          <Bilingual label={l("Description", "Περιγραφή")} value={studio.description} onChange={description => setStudio({...studio,description})}/>
          <Bilingual label={l("Opening hours", "Ωράριο")} value={studio.hours} onChange={hours => setStudio({...studio,hours})}/>
          <Field label={l("Cover image · HTTPS URL", "Κεντρική εικόνα · HTTPS URL")} value={studio.heroImageUrl} onChange={heroImageUrl => setStudio({...studio,heroImageUrl})}/>
          <Field label={l("Gallery URLs · one per line", "Εικόνες συλλογής · μία διεύθυνση ανά γραμμή")} multiline value={studio.galleryImages.join("\n")} onChange={value => setStudio({...studio,galleryImages:value.split("\n")})}/>
          <StylePicker value={studio.styleIds} styles={tattooStyles} onChange={styleIds => setStudio({...studio,styleIds})}/>
          <div className="border-t border-line pt-6"><h2 className="mb-4 font-display text-2xl">{l("Artists & piercers", "Καλλιτέχνες & piercers")}</h2><p className="mb-4 text-sm text-paper-dim">{l("Piercing details and website links are draft-only additions. Public display needs a separate update.", "Τα στοιχεία piercing και οι ιστότοποι είναι προς το παρόν μόνο στο πρόχειρο.")}</p>
            {studio.artists.map((a, i) => <details key={a.id} className="mb-3 rounded-lg border border-line p-4" open={undefined}><summary className="cursor-pointer py-2 font-display text-lg">{a.name || l("New team member", "Νέο μέλος")}</summary><div className="mt-4 space-y-4">
              <Field label={l("Name", "Όνομα")} value={a.name} onChange={name => setArtist(i,{...a,name})}/>
              <label className="block text-sm text-paper-dim">{l("Discipline", "Ειδικότητα")}<select className={control} value={a.discipline ?? "tattoo"} onChange={e => setArtist(i,{...a,discipline:e.target.value as TeamMember["discipline"]})}><option value="tattoo">Tattoo artist</option><option value="piercing">Piercer</option><option value="both">Tattoo artist & piercer</option></select></label>
              <Bilingual label={l("Role", "Ρόλος")} value={a.role} onChange={role => setArtist(i,{...a,role})}/><Bilingual label={l("Biography", "Βιογραφικό")} value={a.bio} onChange={bio => setArtist(i,{...a,bio})}/>
              <Field label="Instagram" value={a.instagramHandle} onChange={instagramHandle => setArtist(i,{...a,instagramHandle})}/><Field label={l("Portrait URL", "Διεύθυνση πορτρέτου")} value={a.avatarUrl} onChange={avatarUrl => setArtist(i,{...a,avatarUrl})}/>
              <Field label={l("Years of experience", "Χρόνια εμπειρίας")} number value={a.yearsExperience} onChange={v => setArtist(i,{...a,yearsExperience:Number(v)})}/>
              {a.discipline !== "piercing" && <StylePicker value={a.styleIds} styles={tattooStyles} onChange={styleIds => setArtist(i,{...a,styleIds})}/>}
              {a.discipline && a.discipline !== "tattoo" && <Field label={l("Piercing specialities", "Ειδικότητες piercing")} multiline value={a.piercingSpecialities ?? ""} onChange={piercingSpecialities => setArtist(i,{...a,piercingSpecialities})}/>}
              {a.portfolio.map((piece,k) => <div key={piece.id} className="space-y-3 rounded-lg bg-ink p-3"><Field label={l("Work caption", "Περιγραφή έργου")} value={piece.caption} onChange={caption => setArtist(i,{...a,portfolio:a.portfolio.map((p,j)=>j===k?{...p,caption}:p)})}/><Field label={l("Image URL", "Διεύθυνση εικόνας")} value={piece.imageUrl} onChange={imageUrl => setArtist(i,{...a,portfolio:a.portfolio.map((p,j)=>j===k?{...p,imageUrl}:p)})}/></div>)}
              <button className={button} onClick={() => { const piece: PortfolioPiece = {id:makeId(),imageUrl:"",caption:"",styleId:a.styleIds[0] ?? "",priceEUR:0}; setArtist(i,{...a,portfolio:[...a.portfolio,piece]}); }}><Plus size={16}/>{l("Add work", "Προσθήκη έργου")}</button>
            </div></details>)}
            <button className={button} onClick={() => { const id=makeId(); const a:TeamMember={id,slug:"draft-"+id.slice(0,8),name:"",studioSlug:studio.slug,role:emptyText(),bio:emptyText(),yearsExperience:0,avatarUrl:"",instagramHandle:"",styleIds:[],portfolio:[],discipline:"tattoo"}; setStudio({...studio,artists:[...studio.artists,a]}); }}><Plus size={16}/>{l("Add artist or piercer", "Προσθήκη καλλιτέχνη ή piercer")}</button>
          </div>
        </div> : article ? <div className="space-y-5"><Bilingual label={l("Title", "Τίτλος")} value={article.title} onChange={title=>setArticle({...article,title})}/><Bilingual label={l("Excerpt", "Περίληψη")} value={article.excerpt} onChange={excerpt=>setArticle({...article,excerpt})}/><Field label={l("Image URL", "Διεύθυνση εικόνας")} value={article.imageUrl} onChange={imageUrl=>setArticle({...article,imageUrl})}/><Field label={l("Source name", "Όνομα πηγής")} value={article.sourceName} onChange={sourceName=>setArticle({...article,sourceName})}/><Field label={l("Source URL (optional)", "Διεύθυνση πηγής (προαιρετικό)")} value={article.sourceUrl ?? ""} onChange={sourceUrl=>setArticle({...article,sourceUrl})}/><Field label={l("Date · YYYY-MM-DD", "Ημερομηνία · ΕΕΕΕ-ΜΜ-ΗΗ")} value={article.publishedAt} onChange={publishedAt=>setArticle({...article,publishedAt})}/><Field label={l("Tags · comma separated", "Ετικέτες · διαχωρισμένες με κόμμα")} value={article.tags.join(",")} onChange={value=>setArticle({...article,tags:value.split(",")})}/></div> : <p>{l("Create a draft to begin.", "Δημιουργήστε ένα πρόχειρο.")}</p>}
        <div className="mt-8 border-t border-line pt-6"><h2 className="font-display text-xl">{l("Before review", "Πριν τον έλεγχο")}</h2>{issues.length ? <ul className="mt-3 max-h-48 list-disc overflow-auto pl-5 text-sm text-paper-dim">{issues.map((issue,i)=><li key={i}>{issue}</li>)}</ul> : <p className="mt-3 text-sm text-paper-dim">{l("Basic fields complete. Photos, permissions, prices, URLs and final content validation still need a person to review them.", "Τα βασικά πεδία συμπληρώθηκαν. Απαιτείται ακόμη έλεγχος φωτογραφιών, δικαιωμάτων και περιεχομένου.")}</p>}<button disabled={issues.length>0 || (!studio && !article)} className={button+" mt-4 disabled:opacity-40"} onClick={()=>{setReviewed(true);setPreview(true);}}><CheckCircle2 size={16}/>{l("Mark for local review", "Σήμανση για τοπικό έλεγχο")}</button><p className="mt-3 text-xs text-paper-faint">{l("There is no publish action in this prototype. Keep original photographs separately; use hosted image URLs here.", "Δεν υπάρχει δημοσίευση σε αυτό το πρωτότυπο. Κρατήστε τα πρωτότυπα αρχεία φωτογραφιών χωριστά.")}</p></div>
      </section>
    </div></>}
  </div>;
}
