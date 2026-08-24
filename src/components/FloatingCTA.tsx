"use client";

import { usePathname } from "next/navigation";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { fallbackData } from "@/data/fallback";
import type { ClinicSettings } from "@/types/cms";
import { normalizedTel } from "@/lib/seo-config";
import {
  pageTypeFromPath,
  topicFromPath,
  whatsappHref,
} from "@/lib/contact-links";
import { trackConversionEvent } from "@/lib/analytics";
import { openBookingModal } from "@/components/OpenBookingButton";

export function FloatingCTA({
  settings = fallbackData.siteSettings,
}: {
  settings?: ClinicSettings;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const currentPath = pathname || "/";
  const topic = topicFromPath(currentPath);
  const eventParameters = {
    path: currentPath,
    page_type: pageTypeFromPath(currentPath),
    topic,
  };
  const callHref = `tel:${normalizedTel(settings.phone)}`;
  const messageHref = whatsappHref(settings.whatsapp, currentPath, topic);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[55] hidden lg:flex">
        <a
          href={messageHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackConversionEvent("whatsapp_click", eventParameters)}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-[#151515] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#FBF7EF] shadow-[0_20px_70px_rgba(21,21,21,0.2)] transition hover:-translate-y-0.5 hover:bg-[#2a2723]"
          aria-label="Open WhatsApp consultation chat"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <nav
        aria-label="Quick appointment actions"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#151515]/10 bg-[#FBF7EF]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(21,21,21,0.12)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-1.5">
          <a
            href={callHref}
            onClick={() => trackConversionEvent("call_click", eventParameters)}
            className="inline-flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[0.63rem] font-extrabold uppercase tracking-[0.08em] text-[#151515]"
            aria-label="Call Radiance Clinics"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={messageHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackConversionEvent("whatsapp_click", eventParameters)}
            className="inline-flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-[#151515] px-1.5 py-2 text-[0.63rem] font-extrabold uppercase tracking-[0.08em] text-[#FBF7EF]"
            aria-label="WhatsApp Radiance Clinics"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              trackConversionEvent("book_appointment_click", eventParameters);
              openBookingModal("cta");
            }}
            className="inline-flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[0.59rem] font-extrabold uppercase tracking-[0.05em] text-[#151515]"
            aria-label="Book an appointment"
          >
            <CalendarCheck className="h-4 w-4" />
            <span className="leading-tight">Book Appointment</span>
          </button>
        </div>
      </nav>
    </>
  );
}
