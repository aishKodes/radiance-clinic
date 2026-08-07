"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/seed";
import { fallbackData } from "@/data/fallback";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { cn } from "@/lib/utils";
import { normalizedTel, treatmentNavigationGroups } from "@/lib/seo-config";
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
                <span className="block h-11 w-[min(12rem,46vw)] max-w-[12rem]">
                  <Image
                    src={logoUrl || ""}
                    alt="Radiance Clinics"
                    width={192}
                    height={44}
                    className="h-11 w-auto max-w-full object-contain object-left"
                    unoptimized={logoUrl?.endsWith(".svg")}
                  />
                </span>
                <span className="sr-only">Radiance Clinics Bhubaneswar</span>
              </>
            ) : (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--ink)]/10 bg-white/72 font-serif text-xl text-[var(--ink)] shadow-lg">
                  {hasLogoMark ? (
                    <Image
                      src={logoUrl || ""}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 object-contain p-1"
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
            {navItems.map((item) =>
              item.href === "/treatments" ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-[var(--ink)]/62 transition hover:bg-white/68 hover:text-[var(--ink)]",
                      pathname?.startsWith(item.href) &&
                        "bg-white/76 text-[var(--ink)] shadow-sm",
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-[44rem] -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="grid grid-cols-4 gap-5 rounded-[1.25rem] border border-[var(--ink)]/10 bg-[rgba(255,247,237,0.98)] p-6 shadow-[0_24px_90px_rgba(16,16,20,0.16)] backdrop-blur-2xl">
                      {treatmentNavigationGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                            {group.label}
                          </p>
                          <ul className="mt-3 space-y-2">
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="block text-xs font-semibold leading-5 text-[var(--ink)]/66 transition hover:text-[var(--ink)] focus:text-[var(--ink)]"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-bold text-[var(--ink)]/62 transition hover:bg-white/68 hover:text-[var(--ink)]",
                    pathname === item.href &&
                      "bg-white/76 text-[var(--ink)] shadow-sm",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <a
              href={`tel:${normalizedTel(settings.phone)}`}
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

      <div
        aria-hidden={!open}
        className={cn(
          "gradient-border mx-auto mt-3 max-h-[calc(100svh-7rem)] max-w-7xl overflow-y-auto rounded-[1.5rem] bg-[rgba(255,247,237,0.98)] p-4 shadow-[0_24px_90px_rgba(16,16,20,0.16)] backdrop-blur-2xl xl:hidden",
          !open && "hidden",
        )}
      >
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
            <div className="mt-3 grid grid-cols-2 gap-4 border-t border-[var(--ink)]/10 px-4 pt-5">
              {treatmentNavigationGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--bronze)]">
                    {group.label}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block text-xs font-semibold leading-5 text-[var(--ink)]/65"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
          <OpenBookingButton source="cta" className="mt-4 w-full">
            Book consultation
          </OpenBookingButton>
      </div>
    </header>
  );
}
