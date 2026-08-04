"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/seed";
import { fallbackData } from "@/data/fallback";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { cn } from "@/lib/utils";
import type { ClinicSettings } from "@/types/cms";

export function SiteHeader({
  settings = fallbackData.siteSettings,
  logoUrl,
  logoMode = "mark",
}: {
  settings?: ClinicSettings;
  logoUrl?: string;
  logoMode?: "primary" | "mark";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hasPrimaryLogo = Boolean(logoUrl && logoMode === "primary");
  const hasLogoMark = Boolean(logoUrl && logoMode !== "primary");

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="gradient-border mx-auto max-w-7xl rounded-full bg-[rgba(255,247,237,0.72)] px-4 py-3 shadow-[0_16px_70px_rgba(16,16,20,0.12)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {hasPrimaryLogo ? (
              <>
                <span className="relative block h-11 w-[min(12rem,46vw)] max-w-[12rem]">
                  <Image
                    src={logoUrl || ""}
                    alt="Radiance Clinics"
                    fill
                    sizes="192px"
                    className="object-contain object-left"
                    unoptimized={logoUrl?.endsWith(".svg")}
                  />
                </span>
                <span className="sr-only">Radiance Clinics Bhubaneswar</span>
              </>
            ) : (
              <>
                <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--ink)]/10 bg-white/72 font-serif text-xl text-[var(--ink)] shadow-lg">
                  {hasLogoMark ? (
                    <Image
                      src={logoUrl || ""}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                      unoptimized={logoUrl?.endsWith(".svg")}
                    />
                  ) : (
                    "R"
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--ink)]">
                    Radiance
                  </span>
                  <span className="block text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/48">
                    Clinics Bhubaneswar
                  </span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-bold text-[var(--ink)]/62 transition hover:bg-white/68 hover:text-[var(--ink)] after:absolute after:inset-x-5 after:bottom-1 after:h-px after:scale-x-0 after:bg-[linear-gradient(90deg,var(--aqua),var(--coral))] after:transition-transform hover:after:scale-x-100",
                  pathname === item.href &&
                    "bg-white/76 text-[var(--ink)] shadow-sm after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/60 text-[var(--ink)] transition hover:border-[var(--aqua)]/60"
              aria-label="Call Radiance Clinics"
            >
              <Phone className="h-4 w-4" />
            </a>
            <OpenBookingButton source="cta" className="min-h-11 px-5 py-2">
              Book
            </OpenBookingButton>
          </div>

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="gradient-border mx-auto mt-3 max-w-7xl rounded-[2rem] bg-[rgba(255,247,237,0.94)] p-4 shadow-[0_24px_90px_rgba(16,16,20,0.16)] backdrop-blur-2xl xl:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-sm font-bold text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <OpenBookingButton source="cta" className="mt-4 w-full">
            Book consultation
          </OpenBookingButton>
        </div>
      ) : null}
    </header>
  );
}
