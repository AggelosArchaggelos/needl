"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
const KEY = "needl-favourites-v1";
const storage = { getItem: async (key: string) => localStorage.getItem(key), setItem: async (key: string, value: string) => localStorage.setItem(key, value) };
type State = { ids: string[]; ready: boolean; error: boolean; toggle: (id: string) => void };
const Context = createContext<State | null>(null);
export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const current = useRef<string[]>([]);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    storage.getItem(KEY).then(raw => {
      const data: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data) || !data.every(x => typeof x === "string")) throw Error("Invalid favourites");
      if (active) { current.current = data; setIds(data); }
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  function toggle(id: string) {
    if (!ready) return;
    const next = current.current.includes(id) ? current.current.filter(x => x !== id) : [...current.current, id];
    current.current = next; setIds(next);
    queue.current = queue.current.then(() => storage.setItem(KEY, JSON.stringify(next))).then(() => setError(false)).catch(() => setError(true));
  }
  return <Context.Provider value={{ ids, ready, error, toggle }}>{children}</Context.Provider>;
}
export function useFavourites() { const state = useContext(Context); if (!state) throw Error("Missing FavouritesProvider"); return state; }
