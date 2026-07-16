"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/cms";

function imageKey(item: GalleryImage, index: number) {
  const image = item.image;
  return (
    image.id ||
    image.contentHash ||
    image.normalizedBasename ||
    image.src ||
    image.desktopUrl ||
    `${item.category}-${item.title}-${index}`
  );
}

function imageSearchText(item: GalleryImage) {
  const image = item.image;
  return [
    item.title,
    item.category,
    item.caption,
    image.id,
    image.filename,
    image.role,
    image.category,
    image.altText,
    image.src,
    image.desktopUrl,
    image.thumbnailUrl,
    image.normalizedBasename,
    image.contentHash,
  ]
    .filter(Boolean)
    .join(" ");
}

function dedupeGalleryImages(images: GalleryImage[]) {
  const seen = new Set<string>();

  return images.filter((item, index) => {
    const image = item.image;
    const normalizedTitle = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const basename = (image.normalizedBasename || image.filename || "")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9]+/g, "-");
    const source = image.originalUrl || image.src || image.desktopUrl;
    const keys = [
      image.id && `id:${image.id}`,
      image.contentHash && `hash:${image.contentHash}`,
      basename && `base:${basename}`,
      image.src && `src:${image.src}`,
      image.desktopUrl && `desktop:${image.desktopUrl}`,
      image.thumbnailUrl && `thumb:${image.thumbnailUrl}`,
      source && `source:${source}`,
      normalizedTitle && `title:${normalizedTitle}`,
      /threebest|threebestrated|best-business/i.test(imageSearchText(item))
        ? "trust-badge:threebest"
        : "",
      /anil-kapoor/i.test(imageSearchText(item)) ? "recognition:anil-kapoor" : "",
      imageKey(item, index),
    ].filter(Boolean) as string[];

    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return Boolean(image.src || image.desktopUrl || image.fallbackUrl);
  });
}

function shouldContain(item: GalleryImage) {
  const text = imageSearchText(item);
  return (
    item.image.displayMode === "contain" ||
    /certificate|badge|threebest|threebestrated|press|newspaper|clipping/.test(
      text.toLowerCase(),
    )
  );
}

function imagePosition(item: GalleryImage) {
  const focal = item.image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

function imageSrc(item: GalleryImage) {
  return item.image.src || item.image.desktopUrl || item.image.fallbackUrl || "";
}

export function ClinicAmbienceGallery({ images }: { images: GalleryImage[] }) {
  const visibleImages = useMemo(() => dedupeGalleryImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : visibleImages[activeIndex];

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || !visibleImages.length) return current;
      return current === 0 ? visibleImages.length - 1 : current - 1;
    });
  }, [visibleImages.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || !visibleImages.length) return current;
      return (current + 1) % visibleImages.length;
    });
  }, [visibleImages.length]);

  if (!visibleImages.length) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[14rem] lg:grid-cols-4 lg:gap-5">
        {visibleImages.map((item, index) => (
          <GalleryTile
            key={imageKey(item, index)}
            item={item}
            index={index}
            onOpen={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(15,16,22,0.86)] px-4 py-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={closeLightbox}
        >
          <div
            className="relative grid w-full max-w-6xl gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 text-white">
              <div>
                <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
                  {activeItem.category}
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-none sm:text-4xl">
                  {activeItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16"
                aria-label="Close gallery image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative min-h-[68vh] overflow-hidden rounded-[1.8rem] border border-white/16 bg-white/8">
              <Image
                src={imageSrc(activeItem)}
                alt={activeItem.image.altText || activeItem.image.alt || activeItem.title}
                fill
                sizes="100vw"
                placeholder={activeItem.image.blurDataUrl ? "blur" : "empty"}
                blurDataURL={activeItem.image.blurDataUrl}
                className={cn(shouldContain(activeItem) ? "object-contain p-4 sm:p-8" : "object-cover")}
                style={{ objectPosition: imagePosition(activeItem) }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-white">
              <button
                type="button"
                onClick={showPrevious}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition hover:bg-white/16"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <p className="hidden max-w-xl text-center text-sm leading-6 text-white/66 sm:block">
                {activeItem.caption}
              </p>
              <button
                type="button"
                onClick={showNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition hover:bg-white/16"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryImage;
  index: number;
  onOpen: () => void;
}) {
  const contain = shouldContain(item);
  const large = index === 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative min-h-0 overflow-hidden rounded-[1.1rem] border border-[var(--ink)]/10 bg-white text-left shadow-[0_24px_80px_rgba(15,16,22,0.1)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_32px_110px_rgba(15,16,22,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aqua)]",
        large
          ? "col-span-2 min-h-[24rem] lg:row-span-2 lg:min-h-0"
          : "min-h-[16rem] lg:min-h-0",
      )}
    >
      <Image
        src={imageSrc(item)}
        alt={item.image.altText || item.image.alt || item.title}
        fill
        sizes={
          large
            ? "(min-width: 1024px) 50vw, 100vw"
            : "(min-width: 1024px) 25vw, 50vw"
        }
        placeholder={item.image.blurDataUrl ? "blur" : "empty"}
        blurDataURL={item.image.blurDataUrl}
        className={cn(
          "transition duration-700 group-hover:scale-[1.03]",
          contain ? "object-contain p-4 sm:p-5" : "object-cover",
        )}
        style={{ objectPosition: imagePosition(item) }}
      />
      <div
        className={cn(
          "absolute inset-0 transition duration-500",
          contain
            ? "bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.12))]"
            : "bg-[linear-gradient(180deg,rgba(15,16,22,0.02),rgba(15,16,22,0.72))]",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-[rgba(15,16,22,0.52)] px-3 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
            {item.category}
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 bg-white/12 opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </div>
        <h3
          className={cn(
            "font-serif leading-none",
            large ? "text-4xl sm:text-5xl" : "text-2xl",
          )}
        >
          {item.title}
        </h3>
        {large ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
            {item.caption}
          </p>
        ) : null}
      </div>
    </button>
  );
}
