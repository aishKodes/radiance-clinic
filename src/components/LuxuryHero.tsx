"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MessageCircle, Phone, Play } from "lucide-react";
import {
  AnimatedAuroraBackground,
  FloatingSkinCells,
  LuxuryNoiseOverlay,
  SciencePatternOverlay,
} from "@/components/BackgroundEffects";
import { clinic, homepageContent as seedHomepageContent } from "@/data/seed";
import { HeroMediaCollage } from "@/components/HeroMediaCollage";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { PremiumButton } from "@/components/PremiumButton";
import type { ClinicSettings, HomepageContent } from "@/types/cms";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function LuxuryHero({
  homepage = seedHomepageContent,
  settings = clinic,
}: {
  homepage?: Pick<
    HomepageContent,
    | "heroEyebrow"
    | "heroTitle"
    | "heroSubtitle"
    | "primaryCta"
    | "secondaryCta"
    | "assistantTeaser"
    | "heroImages"
    | "stats"
  >;
  settings?: ClinicSettings;
}) {
  const reduceMotion = useReducedMotion();
  const heroStats = homepage.stats.length
    ? homepage.stats
    : seedHomepageContent.stats;
  const heroImages = homepage.heroImages.length
    ? homepage.heroImages
    : seedHomepageContent.heroImages;

  return (
    <section className="relative isolate scroll-mt-32 overflow-hidden bg-[var(--ivory)] px-4 pb-14 pt-[7.5rem] sm:px-8 sm:pb-16 sm:pt-[9.25rem] lg:pb-20 lg:pt-[8rem]">
      <AnimatedAuroraBackground className="z-0" />
      <SciencePatternOverlay className="z-0" />
      <FloatingSkinCells className="z-0" />
      <LuxuryNoiseOverlay className="z-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-[var(--mist)] to-transparent" />

      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-7xl gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.92fr)] lg:items-start">
        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : "visible"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="min-w-0"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 flex w-full max-w-full items-start gap-3 rounded-2xl border border-white/60 bg-white/64 px-4 py-3 shadow-[0_16px_50px_rgba(16,16,20,0.08)] backdrop-blur-xl sm:mb-6 sm:inline-flex sm:w-auto sm:items-center sm:rounded-full sm:py-2"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--aqua)] shadow-[0_0_20px_var(--aqua)] sm:mt-0" />
            <span className="min-w-0 text-[0.68rem] font-extrabold uppercase leading-5 tracking-[0.12em] text-[var(--ink)]/64 sm:text-xs sm:tracking-[0.24em]">
              {homepage.heroEyebrow || "Hair • Skin • Laser • Aesthetic Care"}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-balance font-serif text-[2.45rem] leading-[0.98] tracking-normal text-[var(--ink)] sm:text-[3.5rem] lg:text-[4.8rem]"
          >
            {homepage.heroTitle}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-7 text-[var(--ink)]/72 sm:text-lg"
          >
            {homepage.heroSubtitle}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:grid lg:grid-cols-2 xl:flex"
          >
            <OpenBookingButton
              source="homepage_booking"
              className="w-full sm:w-auto lg:col-span-2 xl:col-span-1"
            >
              {homepage.primaryCta.label}
            </OpenBookingButton>
            <PremiumButton
              href={`https://wa.me/${settings.whatsapp}`}
              variant="outline"
              icon={MessageCircle}
              className="w-full sm:w-auto"
            >
              WhatsApp
            </PremiumButton>
            <PremiumButton
              href={`tel:${settings.phone}`}
              variant="outline"
              icon={Phone}
              className="w-full sm:w-auto"
            >
              Call Now
            </PremiumButton>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-4 grid min-w-0 gap-1.5 text-sm font-bold text-[var(--ink)]/58 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3"
          >
            <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
              Clinic numbers
            </span>
            <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="transition hover:text-[var(--ink)]"
              >
                {settings.phone}
              </a>
              {settings.secondaryPhone ? (
                <>
                  <span aria-hidden="true" className="text-[var(--ink)]/24">
                    /
                  </span>
                  <a
                    href={`tel:${settings.secondaryPhone.replace(/\s/g, "")}`}
                    className="transition hover:text-[var(--ink)]"
                  >
                    {settings.secondaryPhone}
                  </a>
                </>
              ) : null}
            </span>
          </motion.div>

        </motion.div>

        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <HeroMediaCollage
            images={heroImages}
            stats={heroStats}
            settings={settings}
            assistantTeaser={homepage.assistantTeaser}
          />
        </motion.div>

        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : "visible"}
          variants={fadeUp}
          className="grid min-w-0 max-w-2xl grid-cols-2 gap-3 lg:col-start-1 lg:row-start-2"
        >
          {heroStats.map((stat) => {
            const isYouTube =
              stat.icon === "youtube" ||
              /youtube|video/i.test(`${stat.value} ${stat.label}`);
            const CardTag = stat.href ? "a" : "div";

            return (
              <CardTag
                key={stat.label}
                href={stat.href}
                target={stat.external ? "_blank" : undefined}
                rel={stat.external ? "noreferrer" : undefined}
                aria-label={
                  isYouTube ? "Watch Radiance Clinics on YouTube" : undefined
                }
                className="group min-h-[6.75rem] min-w-0 rounded-[1.35rem] border border-white/58 bg-white/62 p-3.5 shadow-[0_18px_55px_rgba(16,16,20,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/78 sm:min-h-[7.6rem] sm:rounded-3xl sm:p-4"
              >
                {isYouTube ? (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF0033] text-white shadow-[0_16px_40px_rgba(255,0,51,0.22)]">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                ) : (
                  <p className="break-words font-mono text-lg font-extrabold leading-tight text-[var(--ink)] sm:text-xl sm:leading-none">
                    {stat.value}
                  </p>
                )}
                <p
                  className={
                    isYouTube
                      ? "mt-3 text-sm font-extrabold text-[var(--ink)]"
                      : "mt-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/50"
                  }
                >
                  {isYouTube ? "YouTube Community" : stat.label}
                </p>
                {isYouTube ? (
                  <p className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]/45">
                    Watch Videos
                  </p>
                ) : null}
              </CardTag>
            );
          })}
        </motion.div>
      </div>

      <a
        href="#signature-treatments"
        className="relative z-10 mx-auto mt-4 hidden h-12 w-12 place-items-center rounded-full border border-[#151515]/10 bg-white/50 text-[#151515] backdrop-blur transition hover:bg-white lg:grid"
        aria-label="Scroll to signature treatments"
      >
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
}
