"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarCheck, Loader2, MessageCircle, Phone, Send, X } from "lucide-react";
import type { ClinicSettings, LeadPayload, LeadSource } from "@/types/cms";
import { apiBaseUrl } from "@/lib/api";
import { usePathname } from "next/navigation";
import { normalizedTel } from "@/lib/seo-config";
import {
  pageTypeFromPath,
  topicFromPath,
  whatsappHref,
} from "@/lib/contact-links";
import { trackConversionEvent } from "@/lib/analytics";

type BookingFields = {
  name: string;
  phone: string;
  concern: string;
  preferredDate: string;
  message: string;
};

const initialFields: BookingFields = {
  name: "",
  phone: "",
  concern: "",
  preferredDate: "",
  message: "",
};

export function BookingModal({ settings }: { settings: ClinicSettings }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<LeadSource>("homepage_booking");
  const [fields, setFields] = useState<BookingFields>(initialFields);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const phoneHref = useMemo(
    () => `tel:${normalizedTel(settings.phone)}`,
    [settings.phone],
  );
  const treatmentTopic = fields.concern.trim() || topicFromPath(pathname);
  const messageHref = useMemo(
    () => whatsappHref(settings.whatsapp, pathname, treatmentTopic),
    [pathname, settings.whatsapp, treatmentTopic],
  );
  const eventParameters = {
    path: pathname,
    page_type: pageTypeFromPath(pathname),
    topic: topicFromPath(pathname),
  };

  useEffect(() => {
    const openBooking = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: LeadSource }>;

      setSource(customEvent.detail?.source || "homepage_booking");
      setStatus("idle");
      setError("");
      setOpen(true);
    };

    window.addEventListener("radiance:open-booking", openBooking);
    return () => window.removeEventListener("radiance:open-booking", openBooking);
  }, []);

  if (!open) return null;

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fields.name.trim() || !fields.phone.trim() || !fields.concern.trim()) {
      setStatus("error");
      setError("Please share your name, phone and treatment concern.");
      return;
    }

    setStatus("sending");
    setError("");

    const payload: LeadPayload = {
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      concern: fields.concern.trim(),
      preferred_date: fields.preferredDate || undefined,
      message: fields.message.trim() || undefined,
      source,
      page_url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      if (!apiBaseUrl) {
        throw new Error("Lead API is not configured yet.");
      }

      const response = await fetch(`${apiBaseUrl}/api/public/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead request failed.");
      }

      setStatus("success");
      setFields(initialFields);
    } catch {
      setStatus("error");
      setError("We could not send the request right now. Please use WhatsApp or Call Now.");
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(15,16,22,0.58)] px-4 py-5 backdrop-blur-xl">
      <div className="relative max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/60 bg-[rgba(255,247,237,0.98)] p-5 shadow-[0_34px_110px_rgba(15,16,22,0.28)] sm:p-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] transition hover:bg-white"
          aria-label="Close booking form"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">
            <CalendarCheck className="h-4 w-4" />
            Consultation request
          </div>
          <h2 className="font-serif text-4xl leading-none text-[var(--ink)] sm:text-5xl">
            Request a Radiance callback.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">
            Share a few details and the clinic team can guide the next step.
            Suitability and treatment plans require doctor-led consultation.
          </p>
        </div>

        <form onSubmit={submitLead} className="mt-7 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Name"
              value={fields.name}
              onChange={(value) => setFields((current) => ({ ...current, name: value }))}
              autoComplete="name"
            />
            <Input
              label="Phone"
              value={fields.phone}
              onChange={(value) => setFields((current) => ({ ...current, phone: value }))}
              autoComplete="tel"
            />
          </div>
          <Input
            label="Treatment / concern"
            value={fields.concern}
            onChange={(value) => setFields((current) => ({ ...current, concern: value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Preferred date optional"
              type="date"
              value={fields.preferredDate}
              onChange={(value) =>
                setFields((current) => ({ ...current, preferredDate: value }))
              }
            />
            <Input
              label="Message optional"
              value={fields.message}
              onChange={(value) => setFields((current) => ({ ...current, message: value }))}
            />
          </div>

          {status === "success" ? (
            <p className="rounded-2xl border border-[var(--aqua)]/30 bg-[var(--aqua)]/10 p-3 text-sm font-bold text-[var(--ink)]">
              Thank you. Radiance Clinics will contact you soon.
            </p>
          ) : null}
          {status === "error" && error ? (
            <p className="rounded-2xl border border-[var(--coral)]/30 bg-[var(--coral)]/10 p-3 text-sm font-bold text-[var(--ink)]">
              {error}
            </p>
          ) : null}

          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Request Callback
            </button>
            <a
              href={messageHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackConversionEvent("whatsapp_click", eventParameters)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--ink)]/10 bg-white/72 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)] transition hover:bg-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Clinic
            </a>
            <a
              href={phoneHref}
              onClick={() => trackConversionEvent("call_click", eventParameters)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--ink)]/10 bg-white/72 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)] transition hover:bg-white"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  autoComplete,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]/48">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        type={type}
        className="min-h-12 rounded-2xl border border-[var(--ink)]/10 bg-white/76 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-[var(--ink)] outline-none transition placeholder:text-[var(--ink)]/36 focus:border-[var(--aqua)]/70"
      />
    </label>
  );
}
