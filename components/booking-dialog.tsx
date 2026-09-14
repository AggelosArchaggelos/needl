"use client";

import { useState, type ReactElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Phone, Stamp } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { styleName } from "@/lib/data/styles";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { Artist, Studio } from "@/lib/types";

export function BookingDialog({
  studio,
  artist,
  trigger,
  localEmailTest = false,
}: {
  studio: Studio;
  artist?: Artist;
  trigger: ReactElement;
  localEmailTest?: boolean;
}) {
  const { t, locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [artistChoice, setArtistChoice] = useState(artist?.id ?? "any");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset after the close transition so the sheet doesn't flash empty.
      setTimeout(() => setSubmitted(false), 200);
    }
  }

  const chosenArtist = studio.artists.find((a) => a.id === artistChoice);

  if (studio.experimental || artist?.discipline === "art") return <Button disabled className="border border-line-strong bg-ink-2 text-paper-dim">{locale === "el" ? "Προεπισκόπηση · χωρίς κρατήσεις" : "Preview · bookings disabled"}</Button>;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="border-line-strong bg-ink-2 text-paper sm:max-w-md">
        {submitted ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center px-2 py-6 text-center"
            >
              <motion.div
                initial={reducedMotion ? false : { scale: 0.96, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-bright text-red-bright"
              >
                <Stamp size={32} strokeWidth={1.5} />
              </motion.div>
              <h3 className="mt-5 font-display text-2xl text-paper">{localEmailTest ? "Test request accepted for sending" : t.booking.confirmedTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                {localEmailTest ? "Check your inbox. This is not a confirmed appointment." : `${studio.name} ${t.booking.confirmedBodyPrefix}`}
              </p>
              <div className="mt-6 flex w-full flex-col gap-2">
                <a
                  href={`https://instagram.com/${studio.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-line-strong text-paper hover:bg-ink-3",
                  )}
                >
                  <InstagramIcon /> {t.booking.messageInstagram}
                </a>
                <a
                  href={`tel:${studio.phone.replace(/\s+/g, "")}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-line-strong text-paper hover:bg-ink-3",
                  )}
                >
                  <Phone /> {t.booking.call} {studio.phone}
                </a>
              </div>
            </motion.div>
          ) : (
            <div key="form">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-paper">
                  {t.booking.titlePrefix} {studio.name}
                </DialogTitle>
                <DialogDescription className="text-paper-dim">
                  {t.booking.description}
                </DialogDescription>
              </DialogHeader>

              <form
                className="mt-2 flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (localEmailTest) {
                    if (sending) return;
                    const values = new FormData(e.currentTarget);
                    setSending(true); setSendError("");
                    try {
                      const response = await fetch("/api/local-booking-test", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studioSlug: studio.slug, artistId: artistChoice, name: values.get("name"), contact: values.get("contact"), notes: values.get("notes") }),
                      });
                      const result = await response.json();
                      if (!response.ok || !result.ok) throw new Error(result.error || "Test email failed.");
                      setSubmitted(true);
                    } catch (error) { setSendError(error instanceof Error ? error.message : "Test email failed."); }
                    finally { setSending(false); }
                    return;
                  }
                  setSubmitted(true);
                }}
              >
                {studio.artists.length > 1 && (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-paper-dim">{t.booking.artist}</Label>
                    <Select
                      value={artistChoice}
                      onValueChange={(value) => setArtistChoice(value ?? "any")}
                    >
                      <SelectTrigger className="w-full border-line-strong bg-transparent text-paper">
                        <SelectValue placeholder={t.booking.noPreference}>
                          {(v: string) =>
                            v === "any"
                              ? t.booking.noPreference
                              : (studio.artists.find((a) => a.id === v)?.name ?? v)
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="border-line-strong bg-ink-2 text-paper">
                        <SelectItem value="any">{t.booking.noPreference}</SelectItem>
                        {studio.artists.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-paper-dim" htmlFor="booking-name">
                      {t.booking.name}
                    </Label>
                    <Input
                      id="booking-name"
                      name="name"
                      required
                      className="border-line-strong bg-transparent text-paper"
                      placeholder={t.booking.namePlaceholder}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-paper-dim" htmlFor="booking-contact">
                      {t.booking.contact}
                    </Label>
                    <Input
                      id="booking-contact"
                      name="contact"
                      required
                      className="border-line-strong bg-transparent text-paper"
                      placeholder={t.booking.contactPlaceholder}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-paper-dim" htmlFor="booking-notes">
                    {t.booking.notes}
                  </Label>
                  <Textarea
                    id="booking-notes"
                    name="notes"
                    className="min-h-24 border-line-strong bg-transparent text-paper"
                    placeholder={
                      chosenArtist && chosenArtist.discipline !== "piercing" && chosenArtist.styleIds.length > 0
                        ? `e.g. a ${styleName(chosenArtist.styleIds[0]).toLowerCase()} piece, roughly palm-sized`
                        : t.booking.notesPlaceholder
                    }
                  />
                </div>

                {sendError && <p role="alert" className="text-sm text-red-bright">{sendError}</p>}
                <Button disabled={sending} type="submit" className="mt-1 bg-red text-paper hover:bg-red-bright">
                  {sending ? "Sending test…" : t.booking.submit}
                </Button>
              </form>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
