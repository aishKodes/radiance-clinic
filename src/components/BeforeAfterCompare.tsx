"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import type { CmsFocalPoint, CmsImage } from "@/types/cms";
import { cn } from "@/lib/utils";

type CompareImageInput = CmsImage | string | null | undefined;

type ResolvedImage = {
  src: string;
  alt: string;
  blurDataUrl?: string;
  focalPoint?: CmsFocalPoint;
};

type BeforeAfterCompareProps = {
  beforeImage?: CompareImageInput;
  afterImage?: CompareImageInput;
  beforeAlt?: string;
  afterAlt?: string;
  label?: string;
  viewLabel?: string;
  aspectRatio?: string;
  focalPointBefore?: CmsFocalPoint;
  focalPointAfter?: CmsFocalPoint;
  className?: string;
};

export function BeforeAfterCompare({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  label = "Transformation Example",
  viewLabel = "Front View",
  aspectRatio = "4 / 5",
  focalPointBefore,
  focalPointAfter,
  className,
}: BeforeAfterCompareProps) {
  const before = useMemo(
    () => resolveImage(beforeImage, beforeAlt, focalPointBefore),
    [beforeImage, beforeAlt, focalPointBefore],
  );
  const after = useMemo(
    () => resolveImage(afterImage, afterAlt, focalPointAfter),
    [afterImage, afterAlt, focalPointAfter],
  );
  const [hasBrokenImage, setHasBrokenImage] = useState(false);
  const mounted = useClientMounted();

  if (!before?.src || !after?.src || hasBrokenImage) {
    return (
      <div
        data-before-after-empty
        className={cn(
          "relative grid w-full place-items-center overflow-hidden rounded-[1.65rem] border border-white/12 bg-[radial-gradient(circle_at_35%_20%,rgba(42,195,214,0.2),transparent_36%),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035))] p-6 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.2)]",
          className,
        )}
        style={{ aspectRatio }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_32%,rgba(233,201,143,0.08))]" />
        <div className="relative max-w-xs">
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
            {viewLabel}
          </p>
          <h3 className="mt-3 font-serif text-3xl leading-none">
            Result image pair coming soon.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/62">
            This space is reserved for a consent-confirmed before-and-after
            image pair.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-before-after-compare
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-[1.65rem] border border-white/12 bg-[var(--ink)] shadow-[0_28px_88px_rgba(0,0,0,0.28)]",
        className,
      )}
      style={{ aspectRatio }}
    >
      {mounted ? (
        <ReactCompareSlider
          boundsPadding="0px"
          keyboardIncrement="5%"
          itemOne={
            <ReactCompareSliderImage
              src={before.src}
              alt={before.alt}
              loading="lazy"
              onError={() => setHasBrokenImage(true)}
              style={{
                objectFit: "cover",
                objectPosition: objectPosition(before.focalPoint),
              }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={after.src}
              alt={after.alt}
              loading="lazy"
              onError={() => setHasBrokenImage(true)}
              style={{
                objectFit: "cover",
                objectPosition: objectPosition(after.focalPoint),
              }}
            />
          }
          className="h-full w-full"
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                width: "clamp(2.65rem, 12vw, 3.4rem)",
                height: "clamp(2.65rem, 12vw, 3.4rem)",
                border: "1px solid rgba(255,255,255,0.72)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(233,201,143,0.92))",
                boxShadow: "0 18px 46px rgba(0,0,0,0.34)",
                color: "#101014",
              }}
              linesStyle={{
                width: 2,
                outline: "1px solid rgba(255,255,255,0.72)",
                boxShadow: "0 0 24px rgba(42,195,214,0.28)",
              }}
            />
          }
        />
      ) : (
        <SplitPreview
          before={before}
          after={after}
          onError={() => setHasBrokenImage(true)}
        />
      )}

      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex justify-between gap-3 sm:inset-x-4 sm:top-4">
        <CompareLabel>Before</CompareLabel>
        <CompareLabel>After</CompareLabel>
      </div>

      <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-20 flex flex-wrap items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
        <span className="rounded-full border border-white/18 bg-[rgba(15,16,22,0.68)] px-2.5 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]">
          {viewLabel}
        </span>
        <span className="max-w-[62%] truncate rounded-full border border-white/14 bg-white/12 px-2.5 py-1.5 text-right text-[0.56rem] font-extrabold uppercase tracking-[0.1em] text-white/76 backdrop-blur sm:px-3 sm:text-[0.62rem] sm:tracking-[0.14em]">
          {label}
        </span>
      </div>
    </div>
  );
}

function SplitPreview({
  before,
  after,
  onError,
}: {
  before: ResolvedImage;
  after: ResolvedImage;
  onError: () => void;
}) {
  return (
    <div className="grid h-full w-full grid-cols-2 overflow-hidden bg-[var(--ink)]">
      <div className="relative">
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          placeholder={before.blurDataUrl ? "blur" : "empty"}
          blurDataURL={before.blurDataUrl}
          onError={onError}
          className="object-cover"
          style={{ objectPosition: objectPosition(before.focalPoint) }}
        />
      </div>
      <div className="relative border-l border-white/60">
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          placeholder={after.blurDataUrl ? "blur" : "empty"}
          blurDataURL={after.blurDataUrl}
          onError={onError}
          className="object-cover"
          style={{ objectPosition: objectPosition(after.focalPoint) }}
        />
      </div>
    </div>
  );
}

function useClientMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

function CompareLabel({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/24 bg-[rgba(15,16,22,0.68)] px-2.5 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_12px_34px_rgba(0,0,0,0.2)] backdrop-blur sm:px-4 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.18em]">
      {children}
    </span>
  );
}

function resolveImage(
  image: CompareImageInput,
  alt?: string,
  focalPoint?: CmsFocalPoint,
): ResolvedImage | null {
  if (!image) return null;

  if (typeof image === "string") {
    return {
      src: image,
      alt: alt || "Radiance Clinics before and after image",
      focalPoint,
    };
  }

  const src =
    image.src ||
    image.desktopUrl ||
    image.fallbackUrl ||
    image.mobileUrl ||
    image.thumbnailUrl;

  if (!src) return null;

  return {
    src,
    alt: alt || image.altText || image.alt || "Radiance Clinics result image",
    blurDataUrl: image.blurDataUrl || image.lqip,
    focalPoint: focalPoint || image.focalPoint,
  };
}

function objectPosition(focalPoint?: CmsFocalPoint) {
  const x = Number.isFinite(focalPoint?.x) ? focalPoint?.x : 0.5;
  const y = Number.isFinite(focalPoint?.y) ? focalPoint?.y : 0.5;

  return `${(x ?? 0.5) * 100}% ${(y ?? 0.5) * 100}%`;
}
