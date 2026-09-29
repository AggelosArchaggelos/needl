"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { studios } from "@/lib/data/studios";
import { useLocale } from "@/lib/i18n/locale-context";
import { signInDelay, useStudioSession } from "@/lib/mock-session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const control =
  "w-full rounded-lg border border-line-strong bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-faint focus:outline-2 focus:outline-brass";
const button =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-red-bright disabled:opacity-50";

export function StudioLoginClient() {
  const { locale } = useLocale();
  const el = locale === "el";
  const router = useRouter();
  const { signIn } = useStudioSession();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(el ? "Καταχωρίστε μια έγκυρη διεύθυνση email." : "Enter a valid email address.");
      return;
    }
    if (!studios.length) {
      setError(el ? "Δεν υπάρχει ακόμα καταχωρισμένο στούντιο." : "There's no listed studio to sign in to yet.");
      return;
    }
    setError("");
    setSending(true);
    await signInDelay();
    signIn({ email: email.trim(), studioId: studios[0].id });
    router.push("/studio/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-red-bright">
        {el ? "Για στούντιο" : "For studios"}
      </p>
      <h1 className="font-display text-3xl text-paper">
        {el ? "Διαχείριση του στούντιο σας" : "Manage your studio"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-paper-dim">
        {el
          ? "Σας στέλνουμε έναν σύνδεσμο εισόδου στο email του στούντιο σας — χωρίς κωδικό πρόσβασης να θυμάστε."
          : "We'll send a sign-in link to your studio's email — no password to remember."}
      </p>
      <p className="mt-3 font-mono text-xs text-brass-bright">
        {el
          ? "Πρώιμη προεπισκόπηση · η ταυτότητα στούντιο δεν επαληθεύεται ακόμα"
          : "Early preview · studio identity isn't verified yet"}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block space-y-2 text-sm text-paper-dim">
          {el ? "Email στούντιο" : "Studio email"}
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className={control}
            placeholder="studio@example.com"
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
          {sending ? (el ? "Αποστολή…" : "Sending…") : el ? "Αποστολή συνδέσμου εισόδου" : "Send sign-in link"}
        </button>
      </form>

      <p className="mt-8 text-sm text-paper-dim">
        {el ? "Δεν είστε ακόμα καταχωρισμένο στούντιο; " : "Not a listed studio yet? "}
        <a href="/for-studios" className="text-brass-bright hover:underline">
          {el ? "Καταχωρίστε το στούντιο σας →" : "List your studio →"}
        </a>
      </p>
    </div>
  );
}
