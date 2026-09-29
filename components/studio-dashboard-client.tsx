"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ImageIcon, LogOut, Plus, RotateCcw, Trash2 } from "lucide-react";
import { studios } from "@/lib/data/studios";
import { cities } from "@/lib/data/cities";
import { styles as tattooStyles } from "@/lib/data/styles";
import { disciplineLabel } from "@/lib/profile-details";
import { useLocale } from "@/lib/i18n/locale-context";
import { useStudioSession } from "@/lib/mock-session";
import type { Artist, Localized, Studio } from "@/lib/types";

const control =
  "w-full rounded-lg border border-line-strong bg-ink px-3 py-2.5 text-sm text-paper focus:outline-2 focus:outline-brass";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm text-paper-dim hover:bg-ink-3 hover:text-paper focus-visible:outline-2 focus-visible:outline-brass";
const makeId = () => crypto.randomUUID();
const safeImage = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm text-paper-dim">
      <span>{label}</span>
      {multiline ? (
        <textarea className={control + " min-h-24"} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={control} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Bilingual({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={label + " · English"} value={value.en} onChange={(en) => onChange({ ...value, en })} multiline />
      <Field label={label + " · Ελληνικά"} value={value.el} onChange={(el) => onChange({ ...value, el })} multiline />
    </div>
  );
}

function Photo({ url, label }: { url: string; label: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-ink-3">
      {safeImage(url) && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} className="h-full w-full object-cover" onError={() => setFailed(true)} referrerPolicy="no-referrer" />
      ) : (
        <ImageIcon className="text-paper-faint" aria-label={label} />
      )}
    </div>
  );
}

function StylePicker({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tattooStyles.map((style) => (
        <button
          key={style.id}
          type="button"
          aria-pressed={value.includes(style.id)}
          className={button + (value.includes(style.id) ? " border-red bg-red/15 text-paper" : "")}
          onClick={() => onChange(value.includes(style.id) ? value.filter((id) => id !== style.id) : [...value, style.id])}
        >
          {style.name.en}
        </button>
      ))}
    </div>
  );
}

function emptyArtist(studioSlug: string): Artist {
  const id = makeId();
  return {
    id,
    slug: "new-" + id.slice(0, 8),
    name: "",
    studioSlug,
    role: { en: "", el: "" },
    bio: { en: "", el: "" },
    yearsExperience: 0,
    avatarUrl: "",
    instagramHandle: "",
    styleIds: [],
    discipline: "tattoo",
    portfolio: [],
  };
}

function draftKey(studioId: string) {
  return "needl-studio-draft-v1:" + studioId;
}

export function StudioDashboardClient() {
  const { locale } = useLocale();
  const el = locale === "el";
  const l = (en: string, greek: string) => (el ? greek : en);
  const { session, ready, signOut } = useStudioSession();
  const realStudio = session ? studios.find((s) => s.id === session.studioId) : undefined;

  const [draft, setDraft] = useState<Studio | null>(null);

  useEffect(() => {
    if (!realStudio) return;
    try {
      const raw = localStorage.getItem(draftKey(realStudio.id));
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      setDraft(parsed && typeof parsed === "object" && (parsed as Studio).id === realStudio.id ? (parsed as Studio) : realStudio);
    } catch {
      setDraft(realStudio);
    }
    // Re-seed whenever a different studio session is active, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realStudio?.id]);

  function update(next: Studio) {
    setDraft(next);
    try {
      localStorage.setItem(draftKey(next.id), JSON.stringify(next));
    } catch {
      // Best-effort only.
    }
  }

  function discardDraft() {
    if (!realStudio) return;
    if (!window.confirm(l("Discard your changes and go back to the published page?", "Απόρριψη αλλαγών και επιστροφή στη δημοσιευμένη σελίδα;"))) return;
    try {
      localStorage.removeItem(draftKey(realStudio.id));
    } catch {
      // Ignore.
    }
    setDraft(realStudio);
  }

  function setArtist(index: number, next: Artist) {
    if (!draft) return;
    update({ ...draft, artists: draft.artists.map((a, i) => (i === index ? next : a)) });
  }

  function addArtist() {
    if (!draft) return;
    update({ ...draft, artists: [...draft.artists, emptyArtist(draft.slug)] });
  }

  function removeArtist(index: number) {
    if (!draft) return;
    const name = draft.artists[index]?.name || l("this team member", "αυτό το μέλος");
    if (!window.confirm(l(`Remove ${name} from your studio page?`, `Αφαίρεση του/της ${name} από τη σελίδα σας;`))) return;
    update({ ...draft, artists: draft.artists.filter((_, i) => i !== index) });
  }

  if (!ready) return null;

  if (!session || !realStudio) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-paper-dim">{l("You're not signed in to a studio.", "Δεν είστε συνδεδεμένοι σε στούντιο.")}</p>
        <a href="/studio/login" className="mt-4 inline-block text-brass-bright hover:underline">
          {l("Sign in →", "Είσοδος →")}
        </a>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">{l("Studio desk", "Χώρος στούντιο")}</p>
          <h1 className="font-display text-3xl text-paper">{draft.name || l("Your studio", "Το στούντιο σας")}</h1>
          <p className="mt-2 text-sm text-paper-dim">{l("Signed in as ", "Συνδεδεμένος ως ")}{session.email}</p>
          <p className="mt-2 font-mono text-xs text-brass-bright">{l("Early preview · not yet linked to a verified studio account", "Πρώιμη προεπισκόπηση · δεν συνδέεται ακόμα με επαληθευμένο λογαριασμό στούντιο")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={"/studios/" + realStudio.slug} target="_blank" rel="noreferrer" className={button}>
            <ExternalLink size={16} />
            {l("Preview your page", "Προεπισκόπηση σελίδας")}
          </a>
          <button onClick={signOut} className={button}>
            <LogOut size={16} />
            {l("Sign out", "Αποσύνδεση")}
          </button>
        </div>
      </div>

      <p role="status" className="mb-8 text-xs text-paper-faint">
        {l("All changes saved automatically in this browser.", "Όλες οι αλλαγές αποθηκεύονται αυτόματα σε αυτό το πρόγραμμα περιήγησης.")}
      </p>

      <section className="space-y-6 rounded-xl border border-line bg-ink-2 p-5 sm:p-7">
        <h2 className="font-display text-2xl text-paper">{l("Studio details", "Στοιχεία στούντιο")}</h2>
        <Field label={l("Studio name", "Όνομα στούντιο")} value={draft.name} onChange={(name) => update({ ...draft, name })} />
        <label className="block space-y-2 text-sm text-paper-dim">
          {l("City", "Πόλη")}
          <select className={control} value={draft.cityId} onChange={(e) => update({ ...draft, cityId: e.target.value })}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <Bilingual label={l("Neighbourhood", "Περιοχή")} value={draft.neighborhood} onChange={(neighborhood) => update({ ...draft, neighborhood })} />
        <Field label={l("Address", "Διεύθυνση")} value={draft.address} onChange={(address) => update({ ...draft, address })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={l("Public phone", "Δημόσιο τηλέφωνο")} value={draft.phone} onChange={(phone) => update({ ...draft, phone })} />
          <Field label="Instagram" value={draft.instagramHandle} onChange={(instagramHandle) => update({ ...draft, instagramHandle })} />
        </div>
        <Bilingual label={l("Opening hours", "Ωράριο")} value={draft.hours} onChange={(hours) => update({ ...draft, hours })} />
        <Bilingual label={l("Description", "Περιγραφή")} value={draft.description} onChange={(description) => update({ ...draft, description })} />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Field label={l("Cover image · URL", "Κεντρική εικόνα · URL")} value={draft.heroImageUrl} onChange={(heroImageUrl) => update({ ...draft, heroImageUrl })} />
            <Photo url={draft.heroImageUrl} label={draft.name} />
          </div>
          <Field
            label={l("Gallery URLs · one per line", "Εικόνες συλλογής · μία ανά γραμμή")}
            multiline
            value={draft.galleryImages.join("\n")}
            onChange={(v) => update({ ...draft, galleryImages: v.split("\n").filter(Boolean) })}
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-paper-dim">{l("Styles", "Στιλ")}</p>
          <StylePicker value={draft.styleIds} onChange={(styleIds) => update({ ...draft, styleIds })} />
        </div>
      </section>

      <section className="mt-8 space-y-4 rounded-xl border border-line bg-ink-2 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-paper">{l("Team", "Ομάδα")}</h2>
          <button onClick={addArtist} className={button}>
            <Plus size={16} />
            {l("Add artist or piercer", "Προσθήκη καλλιτέχνη ή piercer")}
          </button>
        </div>

        {draft.artists.length === 0 && (
          <p className="text-sm text-paper-dim">{l("No team members yet. Add your first one above.", "Δεν υπάρχει ακόμα ομάδα. Προσθέστε το πρώτο μέλος παραπάνω.")}</p>
        )}

        {draft.artists.map((a, i) => (
          <details key={a.id} className="rounded-lg border border-line p-4">
            <summary className="flex cursor-pointer items-center justify-between gap-3 py-1">
              <span className="font-display text-lg text-paper">
                {a.name || l("New team member", "Νέο μέλος")}
                {a.name && <span className="ml-2 text-sm font-normal text-paper-dim">· {disciplineLabel(a, locale)}</span>}
              </span>
            </summary>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="flex gap-4">
                  <div className="w-20 shrink-0">
                    <Photo url={a.avatarUrl} label={a.name} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <Field label={l("Name", "Όνομα")} value={a.name} onChange={(name) => setArtist(i, { ...a, name })} />
                    <Field label={l("Portrait URL", "Διεύθυνση πορτρέτου")} value={a.avatarUrl} onChange={(avatarUrl) => setArtist(i, { ...a, avatarUrl })} />
                  </div>
                </div>
                <button onClick={() => removeArtist(i)} className={button + " h-fit text-red-bright"}>
                  <Trash2 size={16} />
                  {l("Remove", "Αφαίρεση")}
                </button>
              </div>
              <label className="block text-sm text-paper-dim">
                {l("Role", "Ειδικότητα")}
                <select
                  className={control}
                  value={a.discipline ?? "tattoo"}
                  onChange={(e) => setArtist(i, { ...a, discipline: e.target.value as Artist["discipline"] })}
                >
                  <option value="tattoo">{l("Tattoo artist", "Καλλιτέχνης τατουάζ")}</option>
                  <option value="piercing">{l("Piercer", "Piercer")}</option>
                  <option value="both">{l("Tattoo artist & piercer", "Καλλιτέχνης & piercer")}</option>
                </select>
              </label>
              <Bilingual label={l("Title / role text", "Τίτλος / ρόλος")} value={a.role} onChange={(role) => setArtist(i, { ...a, role })} />
              <Bilingual label={l("Biography", "Βιογραφικό")} value={a.bio} onChange={(bio) => setArtist(i, { ...a, bio })} />
              <Field label="Instagram" value={a.instagramHandle} onChange={(instagramHandle) => setArtist(i, { ...a, instagramHandle })} />
              {a.discipline !== "piercing" && (
                <div>
                  <p className="mb-2 text-sm text-paper-dim">{l("Styles", "Στιλ")}</p>
                  <StylePicker value={a.styleIds} onChange={(styleIds) => setArtist(i, { ...a, styleIds })} />
                </div>
              )}
            </div>
          </details>
        ))}
      </section>

      <button onClick={discardDraft} className={button + " mt-8"}>
        <RotateCcw size={16} />
        {l("Discard changes", "Απόρριψη αλλαγών")}
      </button>
    </div>
  );
}
