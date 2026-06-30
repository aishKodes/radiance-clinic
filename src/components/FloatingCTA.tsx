"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { fallbackData } from "@/data/fallback";
import type { ClinicSettings } from "@/types/cms";

export function FloatingCTA({
  settings = fallbackData.siteSettings,
}: {
  settings?: ClinicSettings;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 hidden justify-start 2xl:flex">
      <div className="flex overflow-hidden rounded-full border border-[#151515]/10 bg-[#FBF7EF]/88 p-1 shadow-[0_20px_70px_rgba(21,21,21,0.18)] backdrop-blur-xl">
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#FBF7EF] transition hover:bg-[#2a2723]"
          aria-label="Open WhatsApp consultation chat"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${settings.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#151515] transition hover:bg-white"
          aria-label="Call Radiance Clinics"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
      </div>
    </div>
  );
}
