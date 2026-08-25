"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities, cityName } from "@/lib/data/cities";
import { useLocale } from "@/lib/i18n/locale-context";
import { localize } from "@/lib/i18n/localize";

type Status = "idle" | "submitting" | "success" | "error";

export function StudioSignupForm() {
  const { t, locale } = useLocale();
  const f = t.forStudios.form;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cityId, setCityId] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const selectedCity = cities.find((c) => c.id === cityId);

    try {
      const res = await fetch("/api/studio-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioName: data.get("studioName"),
          contactName: data.get("contactName"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: selectedCity ? localize(selectedCity.name, locale) : "",
          instagramHandle: data.get("instagramHandle"),
          message: data.get("message"),
        }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setErrorMessage(body.error ?? f.genericError);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage(f.networkError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-line bg-ink-2 p-10 text-center">
        <CheckCircle2 className="text-brass-bright" size={36} strokeWidth={1.5} />
        <h3 className="mt-4 font-display text-2xl text-paper">{f.successTitle}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper-dim">{f.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-line bg-ink-2 p-6 sm:grid-cols-2 sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="studioName" className="text-paper-dim">
          {f.studioName}
        </Label>
        <Input
          id="studioName"
          name="studioName"
          required
          className="border-line-strong bg-transparent text-paper"
          placeholder={f.studioNamePlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactName" className="text-paper-dim">
          {f.contactName}
        </Label>
        <Input
          id="contactName"
          name="contactName"
          required
          className="border-line-strong bg-transparent text-paper"
          placeholder={f.contactNamePlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-paper-dim">
          {f.email}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="border-line-strong bg-transparent text-paper"
          placeholder={f.emailPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone" className="text-paper-dim">
          {f.phone} <span className="text-paper-faint">({f.optional})</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          className="border-line-strong bg-transparent text-paper"
          placeholder={f.phonePlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-paper-dim">
          {f.city} <span className="text-paper-faint">({f.optional})</span>
        </Label>
        <Select value={cityId} onValueChange={(value) => setCityId(value ?? "")}>
          <SelectTrigger className="w-full border-line-strong bg-transparent text-paper">
            <SelectValue placeholder={f.selectCity}>
              {(v: string) => (v === "other" ? f.notListed : cityName(v, locale))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-line-strong bg-ink-2 text-paper">
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {localize(c.name, locale)}
              </SelectItem>
            ))}
            <SelectItem value="other">{f.notListed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instagramHandle" className="text-paper-dim">
          {f.instagram} <span className="text-paper-faint">({f.optional})</span>
        </Label>
        <Input
          id="instagramHandle"
          name="instagramHandle"
          className="border-line-strong bg-transparent text-paper"
          placeholder={f.instagramPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="message" className="text-paper-dim">
          {f.message} <span className="text-paper-faint">({f.optional})</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          className="min-h-24 border-line-strong bg-transparent text-paper"
          placeholder={f.messagePlaceholder}
        />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-red-bright">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 bg-red text-paper hover:bg-red-bright sm:col-span-2"
      >
        {status === "submitting" ? f.sending : f.send}
      </Button>
    </form>
  );
}
