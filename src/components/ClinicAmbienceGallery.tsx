"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { GalleryImage } from "@/types/cms";

export function ClinicAmbienceGallery({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });
  const [hero, ...supporting] = images;

  if (!hero) {
    return null;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div className="relative min-h-[34rem] overflow-hidden rounded-[2.8rem] border border-white/60 bg-white shadow-[0_34px_120px_rgba(15,16,22,0.13)]">
        <Image
          src={hero.image.desktopUrl || hero.image.src}
          alt={hero.image.altText || hero.image.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          placeholder={hero.image.blurDataUrl ? "blur" : "empty"}
          blurDataURL={hero.image.blurDataUrl}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,16,22,0.78),rgba(15,16,22,0.16)_58%,rgba(15,16,22,0.52))]" />
        <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-white backdrop-blur">
          Radiance Clinics
        </div>
        <div className="absolute inset-x-6 bottom-6 max-w-xl text-white">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--champagne)]">
            <MapPin className="h-4 w-4" />
            {hero.category}
          </p>
          <h3 className="mt-4 font-serif text-6xl leading-[0.88]">
            {hero.title}
          </h3>
          <p className="mt-5 max-w-lg text-base leading-8 text-white/70">
            {hero.caption}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.8rem] border border-[var(--ink)]/10 bg-white/52 p-5 shadow-[0_30px_100px_rgba(15,16,22,0.09)] backdrop-blur-xl">
        <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-[var(--orchid)]/16 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[var(--aqua)]/18 blur-3xl" />
        <div className="relative mb-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--bronze)]">
              Clinic ambience
            </p>
            <h3 className="mt-4 font-serif text-5xl leading-[0.92] text-[var(--ink)]">
              Designed for comfort, privacy, and doctor-led care.
            </h3>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] transition hover:bg-white"
              aria-label="Previous clinic image"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] transition hover:bg-white"
              aria-label="Next clinic image"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {(supporting.length ? supporting : images).map((item) => (
              <article
                key={`${item.category}-${item.title}`}
                className="min-w-0 flex-[0_0_76%] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_22px_70px_rgba(15,16,22,0.1)] sm:flex-[0_0_54%]"
              >
                <div className="relative h-72 bg-[var(--mist)]">
                  <Image
                    src={item.image.src}
                    alt={item.image.altText || item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 76vw"
                    placeholder={item.image.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={item.image.blurDataUrl}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.62))]" />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/22 bg-white/16 text-white backdrop-blur">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">
                    {item.category}
                  </p>
                  <h4 className="mt-2 font-serif text-3xl leading-none text-[var(--ink)]">
                    {item.title}
                  </h4>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">
                    {item.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
