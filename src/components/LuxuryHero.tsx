"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MessageCircle, Play } from "lucide-react";
import {
  AnimatedAuroraBackground,
  FloatingSkinCells,
  LuxuryNoiseOverlay,
  SciencePatternOverlay,
} from "@/components/BackgroundEffects";
import {
  clinic,
  homepageContent as seedHomepageContent,
} from "@/data/seed";
import { HeroMediaCollage } from "@/components/HeroMediaCollage";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { PremiumButton } from "@/components/PremiumButton";
import type { ClinicSettings, CmsImage, HomepageContent } from "@/types/cms";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function imagePosition(image: CmsImage) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

function imageSearchText(image: CmsImage) {
  return `${image.filename || ""} ${image.role || ""} ${image.category || ""} ${image.altText || ""} ${image.alt || ""}`;
}

function isDoctorOrRecognitionVisual(image: CmsImage) {
  return /doctor-hero|doctor-image|hero-primary|hero-secondary|anil|award|recognition|event|badge|threebest|threebestrated/i.test(
    imageSearchText(image),
  );
}

function heroHighlightImages(images: CmsImage[]) {
  const clinicImages = images.filter(
    (image) =>
      !isDoctorOrRecognitionVisual(image) &&
      /hero-gallery|clinic|reception|interior|consultation|treatment|happy-patient|patient/i.test(
        imageSearchText(image),
      ),
  );

  return (clinicImages.length ? clinicImages : images.filter((image) => !isDoctorOrRecognitionVisual(image))).slice(0, 3);
}

function HeroClinicHighlights({ images }: { images: CmsImage[] }) {
  const highlights = heroHighlightImages(images);

  if (!highlights.length) return null;

  return (
    <motion.div
      variants={fadeUp}
      className="mt-5 hidden max-w-2xl rounded-[1.8rem] border border-white/58 bg-white/50 p-3 shadow-[0_20px_62px_rgba(16,16,20,0.08)] backdrop-blur-xl lg:block"
    >
      <div className="grid grid-cols-3 gap-2">
        {highlights.map((image, index) => (
          <div
            key={image.id || image.src || index}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-[var(--mist)]"
          >
            <Image
              src={image.src || image.desktopUrl}
              alt={image.altText || image.alt}
              fill
              sizes="(min-width: 1024px) 190px, 33vw"
              placeholder={image.blurDataUrl ? "blur" : "empty"}
              blurDataURL={image.blurDataUrl}
              className="object-cover"
              style={{ objectPosition: imagePosition(image) }}
            />
          </div>
        ))}
      </div>
      <div className="px-2 pb-1 pt-4">
        <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
          Clinic highlights
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ink)]/62">
          A calm, modern Bhubaneswar clinic environment for consultation,
          treatment planning and doctor-led care.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {["Comfort-first clinic", "Private planning", "Doctor-led care"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--ink)]/10 bg-white/56 px-3 py-2 text-center text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]/52"
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
  const heroStats = homepage.stats.length ? homepage.stats : seedHomepageContent.stats;
  const heroImages = homepage.heroImages.length
    ? homepage.heroImages
    : seedHomepageContent.heroImages;

  return (
    <section className="relative isolate scroll-mt-32 overflow-hidden bg-[var(--ivory)] px-5 pb-16 pt-[8.75rem] sm:px-8 sm:pt-[9.25rem] lg:pb-20 lg:pt-[8rem]">
      <AnimatedAuroraBackground className="z-0" />
      <SciencePatternOverlay className="z-0" />
      <FloatingSkinCells className="z-0" />
      <LuxuryNoiseOverlay className="z-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-[var(--mist)] to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.92fr)] lg:items-start">
        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : "visible"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-white/60 bg-white/64 px-4 py-2 shadow-[0_16px_50px_rgba(16,16,20,0.08)] backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--aqua)] shadow-[0_0_20px_var(--aqua)]" />
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--ink)]/64">
              {homepage.heroEyebrow || "Hair • Skin • Laser • Aesthetic Care"}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-balance font-serif text-[clamp(2.75rem,5.9vw,4.8rem)] leading-[0.96] tracking-normal text-[var(--ink)]"
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
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <OpenBookingButton source="homepage_booking">
              {homepage.primaryCta.label}
            </OpenBookingButton>
            <PremiumButton href={homepage.secondaryCta.href} variant="outline">
              {homepage.secondaryCta.label}
            </PremiumButton>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("radiance:open-chat"))}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--ink)]/10 bg-white/68 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--ink)] shadow-[0_18px_55px_rgba(15,16,22,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
            >
              Chat Now
              <MessageCircle className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-7 grid max-w-2xl grid-cols-2 gap-3"
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
                  aria-label={isYouTube ? "Watch Radiance Clinics on YouTube" : undefined}
                  className="group min-h-[7.6rem] rounded-3xl border border-white/58 bg-white/62 p-4 shadow-[0_18px_55px_rgba(16,16,20,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/78"
                >
                  {isYouTube ? (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF0033] text-white shadow-[0_16px_40px_rgba(255,0,51,0.22)]">
                      <Play className="h-5 w-5 fill-current" />
                    </span>
                  ) : (
                    <p className="font-mono text-xl font-extrabold leading-none text-[var(--ink)]">
                      {stat.value}
                    </p>
                  )}
                  <p className={isYouTube ? "mt-3 text-sm font-extrabold text-[var(--ink)]" : "mt-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/50"}>
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
          <HeroClinicHighlights images={heroImages} />
        </motion.div>

        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <HeroMediaCollage
            images={heroImages}
            stats={heroStats}
            settings={settings}
            assistantTeaser={homepage.assistantTeaser}
          />
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
