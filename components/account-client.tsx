"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CalendarClock, Heart, LogOut, Mail } from "lucide-react";
import { StudioCard } from "@/components/studio-card";
import { ArtistCard } from "@/components/artist-card";
import { studios } from "@/lib/data/studios";
import { useFavourites } from "@/lib/favourites";
import { useLocale } from "@/lib/i18n/locale-context";
import { signInDelay, useVisitorSession } from "@/lib/mock-session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const control =
  "w-full rounded-lg border border-line-strong bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:outline-2 focus:outline-brass";
const button =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-red-bright disabled:opacity-50";

export function AccountClient() {
  const { locale } = useLocale();
  const el = locale === "el";
  const { session, ready, signIn, signOut } = useVisitorSession();
  const { ids } = useFavourites();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const artists = studios.flatMap((s) => s.artists);
  const savedStudios = studios.filter((s) => ids.includes("studio:" + s.id));
  const savedArtists = artists.filter((a) => ids.includes("artist:" + a.id));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(el ? "Καταχωρίστε μια έγκυρη διεύθυνση email." : "Enter a valid email address.");
      return;
    }
    setError("");
    setSending(true);
    await signInDelay();
    signIn({ email: email.trim(), name: "" });
    setSending(false);
  }

  if (!ready) return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">
          {el ? "Λογαριασμός" : "Account"}
        </p>
        <h1 className="font-display text-3xl text-paper">
          {el ? "Είσοδος στο Needl" : "Sign in to Needl"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-paper-dim">
          {el
            ? "Σας στέλνουμε έναν σύνδεσμο εισόδου στο email σας — χωρίς κωδικό πρόσβασης να θυμάστε."
            : "We'll send a sign-in link to your email — no password to remember."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2 text-sm text-paper-dim">
            {el ? "Email" : "Email"}
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className={control}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-bright">
              {error}
            </p>
          )}
          <button type="submit" disabled={sending} className={button}>
            <Mail size={16} />
            {sending
              ? el
                ? "Αποστολή…"
                : "Sending…"
              : el
                ? "Αποστολή συνδέσμου εισόδου"
                : "Send sign-in link"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">
            {el ? "Λογαριασμός" : "Account"}
          </p>
          <h1 className="font-display text-3xl text-paper">
            {el ? "Καλώς ήρθες πίσω" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-paper-dim">
            {el ? "Συνδεδεμένος ως " : "Signed in as "}
            <span className="text-paper">{session.email}</span>
          </p>
        </div>
        <button
          onClick={signOut}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm text-paper-dim hover:bg-ink-3 hover:text-paper"
        >
          <LogOut size={16} />
          {el ? "Αποσύνδεση" : "Sign out"}
        </button>
      </div>

      <section>
        <h2 className="flex items-center gap-2 font-display text-xl text-paper">
          <Heart size={18} className="text-red-bright" />
          {el ? "Αποθηκευμένα" : "Saved"}
        </h2>
        {savedStudios.length === 0 && savedArtists.length === 0 ? (
          <div className="mt-4 rounded-xl border border-line p-6">
            <p className="text-sm text-paper-dim">
              {el
                ? "Αποθηκεύστε στούντιο ή καλλιτέχνες για να τα βρείτε εδώ."
                : "Save studios or artists to find them here."}
            </p>
            <Link href="/browse" className="mt-3 inline-block text-sm text-brass-bright hover:underline">
              {el ? "Εξερεύνηση στούντιο →" : "Browse studios →"}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedStudios.map((s) => (
              <StudioCard key={s.id} studio={s} />
            ))}
            {savedArtists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-display text-xl text-paper">
          <CalendarClock size={18} className="text-red-bright" />
          {el ? "Αιτήματα ραντεβού" : "Booking requests"}
        </h2>
        <div className="mt-4 rounded-xl border border-dashed border-line-strong p-6">
          <p className="text-sm text-paper-dim">
            {el
              ? "Δεν υπάρχουν αιτήματα ακόμα. Όταν το Needl υποστηρίξει κρατήσεις, οι απαντήσεις των στούντιο θα εμφανίζονται εδώ."
              : "No requests yet. Once Needl supports bookings, studio replies will show up here."}
          </p>
        </div>
      </section>
    </div>
  );
}
