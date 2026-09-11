"use client";
import { SaveButton } from "@/components/save-button";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n/locale-context";
import type { PortfolioPiece } from "@/lib/types";

export function PortfolioViewer({ pieces, index, artistName, onChange, onClose }: {
  pieces: PortfolioPiece[]; index: number | null; artistName: string;
  onChange: (index: number) => void; onClose: () => void;
}) {
  const { locale } = useLocale();
  const start = useRef<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const piece = index === null ? undefined : pieces[index];
  const el = locale === "el";
  const move = (step: number) => { if (index !== null) onChange(Math.max(0, Math.min(pieces.length - 1, index + step))); };
  const control = "flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-paper hover:bg-ink-3 focus-visible:outline-2 focus-visible:outline-brass disabled:opacity-30";
  return <Dialog open={!!piece} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent showCloseButton={false} className="max-h-[94dvh] overflow-y-auto bg-ink p-4 sm:max-w-4xl"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      <div className="flex items-center justify-between gap-4">
        <div><DialogTitle className="font-display text-xl">{artistName}</DialogTitle>
          <DialogDescription>{el ? "Συλλογή έργων" : "Portfolio"}</DialogDescription></div>
        <DialogClose aria-label={el ? "Κλείσιμο" : "Close"} className={control}><X size={20} /></DialogClose>
      </div>
      {piece && <>
        <div className="relative h-[min(62dvh,650px)] touch-pan-y rounded-lg bg-ink-2"
          onTouchStart={(e) => { start.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }}
          onTouchCancel={() => { start.current = null; }}
          onTouchEnd={(e) => {
            if (!start.current) return;
            const dx = e.changedTouches[0].clientX - start.current.x;
            const dy = e.changedTouches[0].clientY - start.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
            start.current = null;
          }}>
          {failed === piece.id ? <p className="flex h-full items-center justify-center text-paper-dim">{el ? "Η εικόνα δεν είναι διαθέσιμη." : "Image unavailable."}</p> :
            <Image key={piece.id} src={piece.imageUrl} alt={piece.caption} fill sizes="(min-width: 900px) 850px, 95vw" className="object-contain" onError={() => setFailed(piece.id)} />}
        </div>
        <SaveButton id={"piece:" + piece.id} /><div className="flex items-center justify-between gap-4">
          <button type="button" className={control} disabled={index === 0} onClick={() => move(-1)} aria-label={el ? "Προηγούμενη εικόνα" : "Previous image"}><ChevronLeft /></button>
          <div aria-live="polite" className="min-w-0 text-center"><p className="text-paper">{piece.caption}</p><p className="mt-1 text-sm text-paper-dim">{(index ?? 0) + 1} / {pieces.length}</p></div>
          <button type="button" className={control} disabled={index === pieces.length - 1} onClick={() => move(1)} aria-label={el ? "Επόμενη εικόνα" : "Next image"}><ChevronRight /></button>
        </div>
      </>}
    </DialogContent>
  </Dialog>;
}
