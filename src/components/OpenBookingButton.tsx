"use client";

import { CalendarCheck } from "lucide-react";
import type { LeadSource } from "@/types/cms";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function openBookingModal(source: LeadSource = "homepage_booking") {
  window.dispatchEvent(
    new CustomEvent("radiance:open-booking", {
      detail: { source },
    }),
  );
}

export function OpenBookingButton({
  children = "Book Consultation",
  className,
  source = "homepage_booking",
}: {
  children?: React.ReactNode;
  className?: string;
  source?: LeadSource;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("consultation_clicked", { source });
        openBookingModal(source);
      }}
      className={cn(
        "group inline-flex min-h-12 max-w-full items-center justify-center gap-3 rounded-full border border-transparent bg-[linear-gradient(135deg,var(--ink),#27201a)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--ivory)] shadow-[0_18px_55px_rgba(16,16,20,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(156,107,52,0.18)] focus:outline-none focus:ring-2 focus:ring-[var(--aqua)]/50 focus:ring-offset-2 focus:ring-offset-[var(--ivory)] sm:px-6 sm:tracking-[0.1em]",
        className,
      )}
    >
      <span className="min-w-0 text-center">{children}</span>
      <CalendarCheck className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
