"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Award, BadgeCheck } from "lucide-react";
import type { RecognitionItem } from "@/types/cms";

function publicLabel(type: string) {
  if (/certificate/i.test(type)) return "Certificate";
  if (/badge/i.test(type)) return "Clinic Milestone";
  if (/celebrity|event/i.test(type)) return "Event Moment";
  if (/press|media/i.test(type)) return "Media Mention";
  if (/award|recognition/i.test(type)) return "Recognition";
  return "Recognition";
}

function shouldContain(type: string) {
  return /badge|certificate|press|media/i.test(type);
}

export function RecognitionCarousel({ items }: { items: RecognitionItem[] }) {
  const visibleItems = dedupeRecognitionItems(items);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: visibleItems.length > 2,
    dragFree: true,
  });

  if (!visibleItems.length) {
    return (
      <div className="relative overflow-hidden rounded-[2.8rem] border border-[var(--ink)]/10 bg-white/52 p-8 shadow-[0_32px_110px_rgba(15,16,22,0.1)] backdrop-blur-xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--bronze)]">
          Recognition & Trust
        </p>
        <h3 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)]">
          Recognition updates coming soon.
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink)]/62">
          Certificates, media mentions and clinic milestones will appear here as
          they are approved.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[1.45rem] border border-[var(--ink)]/10 bg-white/52 p-3 shadow-[0_32px_110px_rgba(15,16,22,0.1)] backdrop-blur-xl sm:rounded-[2.8rem] sm:p-4">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--champagne)]/22 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--aqua)]/18 blur-3xl" />
      <div className="relative grid gap-5 lg:grid-cols-[0.42fr_1fr] lg:items-stretch">
        <div className="rounded-[1.25rem] border border-[var(--ink)]/10 bg-[var(--ink)] p-5 text-[var(--ivory)] sm:rounded-[2.1rem] sm:p-7">
          <BadgeCheck className="mb-7 h-7 w-7 text-[var(--champagne)] sm:mb-12" />
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--aqua)]">
            Recognition & Trust
          </p>
          <h3 className="mt-4 font-serif text-4xl leading-[0.94] sm:mt-5 sm:text-5xl sm:leading-[0.9]">
            Milestones from a doctor-led clinic.
          </h3>
          <p className="mt-6 text-sm leading-7 text-white/62">
            Certificates, recognition moments and clinic milestones from
            Radiance Clinics&apos; work in hair, skin and aesthetic care.
          </p>
          <div className="mt-6 flex gap-3 sm:mt-8">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/8 transition hover:bg-white/14"
              aria-label="Previous recognition item"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/8 transition hover:bg-white/14"
              aria-label="Next recognition item"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {visibleItems.map((item, index) => {
              const image = item.image || item.badge;
              const contain =
                item.displayMode === "contain" ||
                image?.displayMode === "contain" ||
                shouldContain(item.type);

              return (
                <article
                  key={recognitionKey(item, index)}
                  className="relative min-w-0 flex-[0_0_82%] overflow-hidden rounded-[1.35rem] border border-white/66 bg-white shadow-[0_26px_90px_rgba(15,16,22,0.12)] sm:flex-[0_0_48%] sm:rounded-[2.1rem] lg:flex-[0_0_38%]"
                >
                  <div className="relative h-64 bg-[var(--mist)] sm:h-80">
                    {image ? (
                      <Image
                        src={image.src || image.desktopUrl}
                        alt={image.altText || image.alt}
                        fill
                        sizes="(min-width: 1024px) 28vw, 82vw"
                        placeholder={image.blurDataUrl ? "blur" : "empty"}
                        blurDataURL={image.blurDataUrl}
                        className={
                          contain ? "object-contain p-7" : "object-cover"
                        }
                        style={{
                          objectPosition: image.focalPoint
                            ? `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`
                            : "50% 50%",
                        }}
                      />
                    ) : null}
                    {!contain ? (
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,22,0.02),rgba(15,16,22,0.38))]" />
                    ) : null}
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/10 bg-[var(--mist)] px-3 py-1.5 text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)]/58">
                      <Award className="h-3.5 w-3.5 text-[var(--bronze)]" />
                      {publicLabel(item.type)}
                    </span>
                    <h4 className="font-serif text-2xl leading-none text-[var(--ink)] sm:text-3xl">
                      {item.title}
                    </h4>
                    {item.description ? (
                      <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function recognitionKey(item: RecognitionItem, index: number) {
  const image = item.image || item.badge;
  return (
    image?.id ||
    image?.contentHash ||
    image?.src ||
    `${item.type}-${item.title}-${index}`
  );
}

function dedupeRecognitionItems(items: RecognitionItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const image = item.image || item.badge;
    const normalizedTitle = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const proofText = `${item.title} ${item.type} ${item.description || ""} ${image?.altText || ""} ${image?.src || ""}`;
    const keys = [
      image?.id && `id:${image.id}`,
      image?.contentHash && `hash:${image.contentHash}`,
      image?.normalizedBasename && `base:${image.normalizedBasename}`,
      image?.src && `src:${image.src}`,
      image?.desktopUrl && `desktop:${image.desktopUrl}`,
      image?.thumbnailUrl && `thumb:${image.thumbnailUrl}`,
      normalizedTitle && `title:${normalizedTitle}-${item.type}`,
      /threebest|threebestrated|best-business/i.test(proofText)
        ? "trust-badge:threebest"
        : "",
      /anil-kapoor/i.test(proofText) ? "recognition:anil-kapoor" : "",
    ].filter(Boolean) as string[];

    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
}
