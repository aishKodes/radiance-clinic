"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { concernCategories } from "@/data/concern-library";
import { privateQueryMetrics, trackEvent } from "@/lib/analytics";

type FormFields = {
  displayName: string;
  category: string;
  question: string;
  contact: string;
  consent: boolean;
  website: string;
};

const initialFields: FormFields = {
  displayName: "",
  category: concernCategories[0].slug,
  question: "",
  contact: "",
  consent: false,
  website: "",
};

export function AskDoctorForm() {
  const [fields, setFields] = useState(initialFields);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const payload = (await response.json()) as { message?: string; reference?: string };
      if (!response.ok) throw new Error(payload.message || "Question intake is unavailable.");

      trackEvent("question_submitted", {
        category: fields.category,
        ...privateQueryMetrics(fields.question),
      });
      setStatus("success");
      setMessage(payload.message || "Your private question was submitted for triage.");
      setFields(initialFields);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Question intake is unavailable.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-white/65 bg-white/68 p-6 shadow-[0_28px_90px_rgba(15,16,22,0.1)] backdrop-blur-xl sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name (optional)">
          <input value={fields.displayName} onChange={(event) => setFields((current) => ({ ...current, displayName: event.target.value }))} autoComplete="name" className="form-control" />
        </Field>
        <Field label="Category">
          <select value={fields.category} onChange={(event) => setFields((current) => ({ ...current, category: event.target.value }))} className="form-control">
            {concernCategories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Your question">
        <textarea required minLength={12} maxLength={1200} rows={5} value={fields.question} onChange={(event) => setFields((current) => ({ ...current, question: event.target.value }))} className="form-control resize-y" />
      </Field>
      <Field label="Email or phone (optional and private)">
        <input value={fields.contact} onChange={(event) => setFields((current) => ({ ...current, contact: event.target.value }))} autoComplete="email" className="form-control" />
      </Field>
      <label className="hidden" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => setFields((current) => ({ ...current, website: event.target.value }))} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[var(--ink)]/66">
        <input required type="checkbox" checked={fields.consent} onChange={(event) => setFields((current) => ({ ...current, consent: event.target.checked }))} className="mt-1 h-4 w-4 accent-[var(--aqua)]" />
        <span>I consent to private clinical triage. My question will not be published automatically; identifying details will be removed before any future public answer.</span>
      </label>
      {message ? <p role="status" className={`rounded-2xl p-4 text-sm font-semibold ${status === "success" ? "bg-[var(--sage)]/45" : "bg-[var(--coral)]/12"}`}>{message}</p> : null}
      <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-white disabled:opacity-55">
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit privately
      </button>
    </form>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]/54">{label}{children}</label>;
}
