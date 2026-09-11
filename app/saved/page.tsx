"use client";
import Link from "next/link";
import { studios } from "@/lib/data/studios";
import { useFavourites } from "@/lib/favourites";
import { useLocale } from "@/lib/i18n/locale-context";
import { StudioCard } from "@/components/studio-card";
import { ArtistCard } from "@/components/artist-card";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { SaveButton } from "@/components/save-button";

export default function SavedPage() {
  const { ids, ready } = useFavourites();
  const { locale } = useLocale(); const el = locale === "el";
  const artists = studios.flatMap(s => s.artists);
  const selectedStudios = studios.filter(s => ids.includes("studio:" + s.id));
  const selectedArtists = artists.filter(a => ids.includes("artist:" + a.id));
  const portfolios = artists.map(a => ({ artist: a, pieces: a.portfolio.filter(p => ids.includes("piece:" + p.id)) })).filter(a => a.pieces.length);
  const available = new Set([...studios.map(s => "studio:" + s.id), ...artists.map(a => "artist:" + a.id), ...artists.flatMap(a => a.portfolio.map(p => "piece:" + p.id))]);
  const missing = ids.filter(id => !available.has(id));
  return <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
    <div><h1 className="font-display text-3xl text-paper">{el ? "Αποθηκευμένα" : "Saved"}</h1><p className="mt-3 max-w-xl text-paper-dim">{el ? "Τα αγαπημένα σας σε αυτό το πρόγραμμα περιήγησης. Δεν συγχρονίζονται με άλλες συσκευές· η διαγραφή των δεδομένων του ιστοτόπου τα αφαιρεί." : "Your favourites in this browser. They do not sync across devices; clearing site data removes them."}</p></div>
    {!ready ? <p role="status">{el ? "Φόρτωση…" : "Loading…"}</p> : ids.length === 0 ? <div className="rounded-xl border border-line p-8"><p>{el ? "Αποθηκεύστε στούντιο, καλλιτέχνες ή έργα για να τα βρείτε εδώ." : "Save studios, artists, or tattoos to find them here."}</p><Link className="mt-4 inline-block text-brass-bright underline" href="/browse">{el ? "Εξερεύνηση στούντιο" : "Browse studios"}</Link></div> : <>
      {selectedStudios.length > 0 && <section><h2 className="mb-4 font-display text-2xl">{el ? "Στούντιο" : "Studios"}</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{selectedStudios.map(s => <StudioCard key={s.id} studio={s}/>)}</div></section>}
      {selectedArtists.length > 0 && <section><h2 className="mb-4 font-display text-2xl">{el ? "Καλλιτέχνες" : "Artists"}</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{selectedArtists.map(a => <div key={a.id} className="space-y-2"><ArtistCard artist={a}/><SaveButton id={"artist:" + a.id}/></div>)}</div></section>}
      {portfolios.length > 0 && <section><h2 className="mb-4 font-display text-2xl">{el ? "Έργα" : "Tattoos"}</h2><div className="space-y-8">{portfolios.map(({artist, pieces}) => <div key={artist.id}><Link href={"/studios/" + artist.studioSlug + "/artists/" + artist.slug} className="mb-3 inline-block text-brass-bright underline">{artist.name}</Link><PortfolioGrid key={pieces.map(p => p.id).join(",")} pieces={pieces} artistName={artist.name}/></div>)}</div></section>}
      {missing.length > 0 && <section><h2 className="font-display text-xl">{el ? "Δεν είναι πλέον διαθέσιμα" : "No longer available"}</h2>{missing.map(id => <div key={id} className="mt-3"><SaveButton id={id}/></div>)}</section>}
    </>}
  </div>;
}
