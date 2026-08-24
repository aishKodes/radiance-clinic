"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import type {
  ClinicSettings,
  CmsImage,
  CmsStat,
  HomepageContent,
} from "@/types/cms";

function imagePosition(image: CmsImage) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

function imageSearchText(image: CmsImage) {
  return `${image.filename || ""} ${image.role || ""} ${image.category || ""} ${image.altText || ""} ${image.alt || ""}`;
}

function isRecognitionImage(image: CmsImage) {
  return /anil|award|recognition|event|badge|threebest|threebestrated/i.test(
    imageSearchText(image),
  );
}

function isAnilKapoorImage(image: CmsImage) {
  return /anil[-_\s]+kapoor/i.test(imageSearchText(image));
}

function selectHeroImage(images: CmsImage[]) {
  return (
    images.find((image) =>
      /(^|[-\s])doctor[-\s]?hero|hero[-_\s]?primary|satyarth.*hero/i.test(
        imageSearchText(image),
      ),
    ) ||
    images.find(
      (image) =>
        !isRecognitionImage(image) &&
        /doctor.*patient|with-patient|consultation/i.test(
          imageSearchText(image),
        ),
    ) ||
    images.find(
      (image) =>
        !isRecognitionImage(image) &&
        /doctor|satyarth/i.test(imageSearchText(image)),
    ) ||
    images.find((image) => !isRecognitionImage(image)) ||
    images[0]
  );
}

function selectHeroSlides(images: CmsImage[]) {
  const primary = selectHeroImage(images);
  const recognition = images.find(isAnilKapoorImage);
  const seen = new Set<string>();

  return [primary, recognition].filter((image): image is CmsImage => {
    if (!image) return false;
    const key = image.id || image.src || image.desktopUrl;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function HeroVisualFallback() {
  return (
    <div className="grid h-full min-h-[28rem] place-items-center bg-[linear-gradient(135deg,#fff7ed,#eef7f8)]">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
          Radiance Clinics
        </p>
        <p className="mt-3 font-serif text-4xl leading-none text-[var(--ink)]">
          Skin, Hair & Aesthetic Care
        </p>
      </div>
    </div>
  );
}

export function HeroMediaCollage({
  images,
  settings,
}: {
  images: CmsImage[];
  stats: CmsStat[];
  settings: ClinicSettings;
  assistantTeaser: HomepageContent["assistantTeaser"];
}) {
  const slides = selectHeroSlides(images);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeImage = slides[activeIndex] || slides[0];
  const recognitionActive = activeImage
    ? isAnilKapoorImage(activeImage)
    : false;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl">
      <div className="gradient-border relative overflow-hidden rounded-[1.5rem] bg-[var(--ink)] shadow-[0_34px_110px_rgba(16,16,20,0.18)] sm:rounded-[2rem]">
        <div className="relative aspect-[4/5] min-h-0 sm:min-h-[31rem]">
          {slides.length ? (
            slides.map((image, index) => {
              const active = index === activeIndex;
              const recognition = isAnilKapoorImage(image);

              return (
                <Image
                  key={image.id || image.src || image.desktopUrl}
                  src={image.src || image.desktopUrl}
                  alt={active ? image.altText || image.alt : ""}
                  aria-hidden={!active}
                  fill
                  preload={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 576px, calc(100vw - 32px)"
                  placeholder={image.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={image.blurDataUrl}
                  className={`absolute ${index === 0 ? "z-0" : "z-[1]"} ${
                    recognition
                      ? "object-cover bg-[#10142b]"
                      : "object-cover"
                  } transition-[opacity,transform] duration-700 ease-out ${
                    index === 0 || active
                      ? "scale-100 opacity-100"
                      : "scale-[1.015] opacity-0"
                  }`}
                  style={{
                    objectPosition: recognition
                      ? "center center"
                      : imagePosition(image),
                  }}
                />
              );
            })
          ) : (
            <HeroVisualFallback />
          )}
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(16,16,20,0.04),rgba(16,16,20,0.68))]" />
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/20 bg-white/14 px-3 py-2 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-[0.62rem] sm:tracking-[0.2em]">
            {recognitionActive ? "Recognition moment" : "Doctor-led care"}
          </div>
          {slides.length > 1 ? (
            <div className="absolute right-3 top-3 z-20 flex gap-1 rounded-full border border-white/18 bg-[rgba(16,16,20,0.28)] p-1 backdrop-blur sm:right-5 sm:top-5">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || slide.src || slide.desktopUrl}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setPaused(true);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={
                    isAnilKapoorImage(slide)
                      ? "Show Anil Kapoor recognition image"
                      : "Show doctor-led care image"
                  }
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/52"
                    }`}
                  />
                </button>
              ))}
              {!reduceMotion ? (
                <button
                  type="button"
                  onClick={() => setPaused((current) => !current)}
                  className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={
                    paused ? "Resume hero slideshow" : "Pause hero slideshow"
                  }
                >
                  {paused ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  )}
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 rounded-[1.2rem] border border-white/14 bg-[rgba(16,16,20,0.56)] p-4 text-white backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:rounded-[1.55rem] sm:p-5">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
              Radiance Clinics
            </p>
            <p className="mt-2 max-w-sm font-serif text-2xl leading-none sm:text-3xl">
              {recognitionActive
                ? "Dr. Satyarth Prakash with Anil Kapoor at a public recognition event."
                : `Skin, hair, laser and aesthetic care in ${settings.city}.`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap gap-2">
        {["Skin", "Hair", "Laser", "Aesthetics"].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/60 bg-white/54 px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-[var(--ink)]/62 shadow-sm backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.16em]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
