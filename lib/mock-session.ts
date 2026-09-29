"use client";
import { useEffect, useRef, useState } from "react";

// Front-end-only "signed in" state for demo purposes: no server, no real
// account, no email actually sent. Everything lives in this browser's
// localStorage. Nothing here should be treated as a real authentication
// system — it exists so the login and self-serve editing flows can be
// walked through end to end before the real backend (database, email
// sign-in, hosted media) is built and paid for.

type VisitorSession = { email: string; name: string };
type StudioSession = { email: string; studioId: string };

function useMockSession<T>(key: string) {
  const [session, setSession] = useState<T | null>(null);
  const [ready, setReady] = useState(false);
  const current = useRef<T | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as T) : null;
      current.current = parsed;
      setSession(parsed);
    } catch {
      // No session available; treat as signed out.
    }
    setReady(true);
  }, [key]);

  function signIn(next: T) {
    current.current = next;
    setSession(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Best-effort only; the session still works for this render.
    }
  }

  function signOut() {
    current.current = null;
    setSession(null);
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore: nothing left to clear if storage is unavailable.
    }
  }

  return { session, ready, signIn, signOut };
}

export function useVisitorSession() {
  return useMockSession<VisitorSession>("needl-visitor-session-v1");
}

export function useStudioSession() {
  return useMockSession<StudioSession>("needl-studio-session-v1");
}

// A brief, realistic-feeling pause before "signing in" — long enough to read
// as a real round trip, short enough not to feel broken.
export function signInDelay() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}
