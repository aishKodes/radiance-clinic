"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { treatmentCategoryTabs } from "@/data/homepage-media";
import { cn } from "@/lib/utils";

const tabAccent = {
  skin: "border-[var(--orchid)]/30 bg-[var(--orchid)]/10 text-[var(--ink)]",
  hair: "border-[var(--bronze)]/34 bg-[var(--champagne)]/18 text-[var(--ink)]",
  laser: "border-[var(--aqua)]/34 bg-[var(--aqua)]/10 text-[var(--ink)]",
  aesthetics: "border-[var(--coral)]/34 bg-[var(--coral)]/10 text-[var(--ink)]",
};

export function TreatmentUniverseSection() {
  const [activeId, setActiveId] = useState(treatmentCategoryTabs[0]?.id || "skin");
  const active =
    treatmentCategoryTabs.find((item) => item.id === activeId) ||
    treatmentCategoryTabs[0];

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0"
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
            aria-controls={`treatment-tab-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "min-w-[11rem] rounded-[1.2rem] border px-5 py-4 text-left transition hover:-translate-y-0.5 lg:w-full",
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
        {treatmentCategoryTabs.map((tab) => {
          const isActive = active.id === tab.id;

          return (
            <div
              key={tab.id}
              id={`treatment-tab-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`treatment-tab-trigger-${tab.id}`}
              hidden={!isActive}
              className={cn(
                "overflow-hidden rounded-[1.8rem] border border-[var(--ink)]/10 bg-white/64 shadow-[0_24px_86px_rgba(15,16,22,0.08)] backdrop-blur-xl",
                !isActive && "hidden",
              )}
            >
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[18rem] bg-[var(--mist)] lg:min-h-[31rem]">
                  {tab.image ? (
                    <Image
                      src={tab.image.src}
                      alt={tab.image.altText || tab.image.alt}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      placeholder={tab.image.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={tab.image.blurDataUrl}
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
                      {tab.label}
                    </p>
                    <h3 className="mt-2 font-serif text-4xl leading-none">
                      {tab.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-7 lg:p-8">
                  <p className="max-w-xl text-sm leading-7 text-[var(--ink)]/66">
                    {tab.description}
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {tab.procedures.map((procedure) => (
                      <div
                        key={procedure}
                        className="rounded-[1.1rem] border border-[var(--ink)]/10 bg-[var(--ivory)]/72 px-4 py-3 text-sm font-extrabold text-[var(--ink)] shadow-sm"
                      >
                        {procedure}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/treatments"
                    className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--ink)]/10 bg-[var(--ink)] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--ivory)] transition hover:-translate-y-0.5"
                  >
                    Explore Treatments
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
