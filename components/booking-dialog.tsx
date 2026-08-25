"use client";

import { useState, type ReactElement } from "react";
import { motion } from "motion/react";
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
}: {
  studio: Studio;
  artist?: Artist;
  trigger: ReactElement;
}) {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [artistChoice, setArtistChoice] = useState(artist?.id ?? "any");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset after the close transition so the sheet doesn't flash empty.
      setTimeout(() => setSubmitted(false), 200);
    }
  }

  const chosenArtist = studio.artists.find((a) => a.id === artistChoice);

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
                initial={{ scale: 2, rotate: -18, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-bright text-red-bright"
              >
                <Stamp size={32} strokeWidth={1.5} />
              </motion.div>
              <h3 className="mt-5 font-display text-2xl text-paper">{t.booking.confirmedTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                {studio.name} {t.booking.confirmedBodyPrefix}
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
                onSubmit={(e) => {
                  e.preventDefault();
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
                    className="min-h-24 border-line-strong bg-transparent text-paper"
                    placeholder={
                      chosenArtist
                        ? `e.g. a ${styleName(chosenArtist.styleIds[0]).toLowerCase()} piece, roughly palm-sized`
                        : t.booking.notesPlaceholder
                    }
                  />
                </div>

                <Button type="submit" className="mt-1 bg-red text-paper hover:bg-red-bright">
                  {t.booking.submit}
                </Button>
              </form>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
