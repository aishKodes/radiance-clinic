"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { treatmentCategoryTabs } from "@/data/homepage-media";
import { cn } from "@/lib/utils";
import { ConversionLink } from "@/components/ConversionLink";

const tabAccent = {
  skin: "border-[var(--orchid)]/30 bg-[var(--orchid)]/10 text-[var(--ink)]",
  hair: "border-[var(--bronze)]/34 bg-[var(--champagne)]/18 text-[var(--ink)]",
  laser: "border-[var(--aqua)]/34 bg-[var(--aqua)]/10 text-[var(--ink)]",
  aesthetics: "border-[var(--coral)]/34 bg-[var(--coral)]/10 text-[var(--ink)]",
};

export function TreatmentUniverseSection() {
  const [activeId, setActiveId] = useState(
    treatmentCategoryTabs[0]?.id || "skin",
  );
  const active =
    treatmentCategoryTabs.find((item) => item.id === activeId) ||
    treatmentCategoryTabs[0];

  if (!active) return null;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="mobile-scroll-row flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0"
        role="tablist"
        aria-label="Treatment categories"
      >
        {treatmentCategoryTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`treatment-tab-trigger-${tab.id}`}
            aria-selected={active.id === tab.id}
            aria-controls="treatment-tab-panel"
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "w-[10.5rem] shrink-0 snap-start rounded-[1.2rem] border px-4 py-3.5 text-left transition hover:-translate-y-0.5 sm:w-[11rem] sm:px-5 sm:py-4 lg:w-full",
              active.id === tab.id
                ? tabAccent[tab.id]
                : "border-[var(--ink)]/10 bg-white/54 text-[var(--ink)]/58 hover:bg-white/76",
            )}
          >
            <span className="block text-[0.64rem] font-extrabold uppercase tracking-[0.2em]">
              Treatment Options
            </span>
            <span className="mt-2 block text-lg font-extrabold">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="min-w-0">
        <div
          key={active.id}
          id="treatment-tab-panel"
          role="tabpanel"
          aria-labelledby={`treatment-tab-trigger-${active.id}`}
          className="overflow-hidden rounded-[1.8rem] border border-[var(--ink)]/10 bg-white shadow-[0_24px_86px_rgba(15,16,22,0.08)]"
        >
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[18rem] bg-[var(--mist)] lg:min-h-[31rem]">
                  {active.image ? (
                    <Image
                      src={active.image.src}
                      alt={active.image.altText || active.image.alt}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      placeholder={active.image.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={active.image.blurDataUrl}
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#fbf7f0,#eef7f8)]">
                      <span className="rounded-full border border-[var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink)]/54">
                        Radiance Clinics
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.58))]" />
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
                      {active.label}
                    </p>
                    <h3 className="mt-2 font-serif text-4xl leading-none">
                      {active.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-7 lg:p-8">
                  <p className="max-w-xl text-sm leading-7 text-[var(--ink)]/66">
                    {active.description}
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {active.procedures.map((procedure) => (
                      <div
                        key={procedure}
                        className="rounded-[1.1rem] border border-[var(--ink)]/10 bg-[var(--ivory)]/72 px-4 py-3 text-sm font-extrabold text-[var(--ink)] shadow-sm"
                      >
                        {procedure}
                      </div>
                    ))}
                  </div>
                  <ConversionLink
                    href={active.href}
                    eventName="treatment_cta_click"
                    topic={active.label}
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--ink)]/10 bg-[var(--ink)] px-6 py-3 text-center text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--ivory)] transition hover:-translate-y-0.5 sm:w-auto sm:tracking-[0.16em]"
                  >
                    Explore {active.label} Care
                    <ArrowUpRight className="h-4 w-4" />
                  </ConversionLink>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
