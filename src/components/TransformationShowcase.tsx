"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, ShieldCheck } from "lucide-react";
import { BeforeAfterCompare } from "@/components/BeforeAfterCompare";
import { cn } from "@/lib/utils";
import { transformationFallbackTitle } from "@/lib/transformations";
import type {
  CmsImage,
  Transformation,
  TransformationCategory,
} from "@/types/cms";

const RESULT_DISCLAIMER =
  "Results vary by individual. Images are shared with consent. A consultation is required.";

type TransformationShowcaseProps = {
  title: string;
  eyebrow: string;
  description: string;
  category: TransformationCategory;
  transformations: Transformation[];
};

type ComparePair = {
  viewLabel: string;
  before: CmsImage;
  after: CmsImage;
};

export function TransformationShowcase({
  title,
  eyebrow,
  description,
  category,
  transformations,
}: TransformationShowcaseProps) {
  const sectionId =
    category === "hair"
      ? "hair-transplant-results"
      : "skin-improvement-results";
  const headingId = `${sectionId}-heading`;
  const visibleTransformations = useMemo(
    () =>
      transformations.filter((item) => {
        if (item.consentConfirmed === false) return false;

        const hasPair = getComparePairs(item).length > 0;

        if (!hasPair && process.env.NODE_ENV !== "production") {
          console.warn(
            `[Radiance] Skipping ${item.id}: no complete before/after pair.`,
          );
        }

        return hasPair;
      }),
    [transformations],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSafeIndex = visibleTransformations.length
    ? Math.min(activeIndex, visibleTransformations.length - 1)
    : 0;
  const current = visibleTransformations[activeSafeIndex];
  const pairs = current ? getComparePairs(current).slice(0, 2) : [];
  const additionalImages = current ? getAdditionalImages(current, pairs) : [];
  const disclaimer = current?.disclaimer || RESULT_DISCLAIMER;
  const selectorScrollRef = useRef<HTMLDivElement>(null);
  const selectorItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const emptyMessage =
    category === "skin"
      ? "Skin improvement examples will be added soon."
      : "More transformation images will be added soon.";

  useEffect(() => {
    const container = selectorScrollRef.current;
    const item = selectorItemRefs.current[activeSafeIndex];

    if (!container || !item) return;

    const horizontal = container.scrollWidth > container.clientWidth;
    container.scrollTo({
      left: horizontal
        ? Math.max(
            0,
            item.offsetLeft - Math.round(container.clientWidth * 0.08),
          )
        : 0,
      top: horizontal ? 0 : Math.max(0, item.offsetTop - 12),
      behavior: activeSafeIndex === 0 ? "auto" : "smooth",
    });
  }, [activeSafeIndex]);

  if (!current) {
    return (
      <section
        id={sectionId}
        aria-labelledby={headingId}
        data-transformation-showcase={category}
        className="relative overflow-hidden rounded-[2.4rem] border border-white/12 bg-white/[0.075] p-5 text-[var(--ivory)] shadow-[0_34px_120px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[var(--aqua)]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-[var(--coral)]/12 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="mt-4 max-w-2xl font-serif text-4xl leading-none sm:text-5xl"
            >
              {emptyMessage}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/66">
              {description}
            </p>
            <p className="mt-5 rounded-3xl border border-white/12 bg-white/[0.07] p-4 text-sm leading-6 text-white/62">
              {RESULT_DISCLAIMER}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Before", "After", "Additional View", "Consultation"].map(
              (label) => (
                <div
                  key={label}
                  className="aspect-[4/5] rounded-[1.5rem] border border-white/12 bg-[radial-gradient(circle_at_35%_20%,rgba(42,195,214,0.22),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]"
                >
                  <div className="flex h-full items-end p-4">
                    <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/66">
                      {label}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      data-transformation-showcase={category}
      className="relative min-w-0 overflow-hidden rounded-[1.55rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-3 text-[var(--ivory)] shadow-[0_42px_140px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-6 lg:p-7"
    >
      <div className="pointer-events-none absolute -left-28 top-24 z-0 h-72 w-72 rounded-full bg-[var(--aqua)]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 z-0 h-72 w-72 rounded-full bg-[var(--coral)]/14 blur-3xl" />

      <div className="relative z-10 min-w-0 rounded-[1.3rem] bg-[linear-gradient(145deg,rgba(16,16,20,0.98),rgba(20,21,29,0.96))] p-3 sm:rounded-[2rem] sm:p-5 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="relative z-20 min-w-0 rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-3 backdrop-blur-xl sm:rounded-[1.6rem] sm:p-4 lg:self-start">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-2 text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-[var(--champagne)]">
              <ShieldCheck className="h-4 w-4" />
              Consent-aware
            </div>
            <h2 id={headingId} className="font-serif text-3xl leading-none">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/62">
              {description}
            </p>

            <div
              ref={selectorScrollRef}
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              className="transformation-selector-scroll mobile-scroll-row relative z-20 mt-5 flex w-full max-w-full scroll-smooth snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 lg:mt-6 lg:max-h-[34rem] lg:flex-col lg:snap-none lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:pb-4 lg:pr-2"
            >
              {visibleTransformations.map((item, index) => (
                <SelectorCard
                  key={`${category}-${item.id}-${item.conditionName || item.treatment}-${index}`}
                  buttonRef={(node) => {
                    selectorItemRefs.current[index] = node;
                  }}
                  item={item}
                  index={index}
                  category={category}
                  active={activeSafeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </aside>

          <div className="relative z-10 grid min-w-0 gap-5">
            <div className="grid min-w-0 gap-5 rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-4 backdrop-blur-xl sm:rounded-[1.6rem] sm:p-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[var(--aqua)]">
                  {eyebrow}
                </p>
                <h3 className="mt-3 max-w-3xl font-serif text-3xl leading-none sm:text-5xl">
                  {transformationHeading(current, category)}
                </h3>
                <p className="mt-3 text-sm font-bold text-white/78">
                  <span className="text-white/48">Condition: </span>
                  {current.conditionName || current.treatment}
                </p>
                {current.subtitle ? (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/66">
                    {current.subtitle}
                  </p>
                ) : null}
              </div>
              <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start md:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      activeSafeIndex === 0
                        ? visibleTransformations.length - 1
                        : activeSafeIndex - 1,
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/14 bg-white/10 transition hover:bg-white/16"
                  aria-label="Previous transformation example"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-mono text-sm font-extrabold text-white/54">
                  {String(activeSafeIndex + 1).padStart(2, "0")} /{" "}
                  {String(visibleTransformations.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (activeSafeIndex + 1) % visibleTransformations.length,
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/14 bg-white/10 transition hover:bg-white/16"
                  aria-label="Next transformation example"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "grid min-w-0 gap-4",
                pairs.length > 1 ? "lg:grid-cols-2" : "lg:max-w-3xl",
              )}
            >
              {pairs.map((pair) => (
                <BeforeAfterCompare
                  key={`${current.id}-${pair.viewLabel}`}
                  beforeImage={pair.before}
                  afterImage={pair.after}
                  beforeAlt={transformationAltText(
                    current,
                    category,
                    "before",
                    pair.viewLabel,
                  )}
                  afterAlt={transformationAltText(
                    current,
                    category,
                    "after",
                    pair.viewLabel,
                  )}
                  label={displayTitle(current, category, activeSafeIndex)}
                  viewLabel={pair.viewLabel}
                  aspectRatio="4 / 5"
                  focalPointBefore={pair.before.focalPoint}
                  focalPointAfter={pair.after.focalPoint}
                />
              ))}
            </div>

            {additionalImages.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {additionalImages.map((image, index) => (
                  <AdditionalImageCard
                    key={image.id || image.src || `${current.id}-${index}`}
                    image={image}
                    label={
                      index === 0
                        ? "Additional View"
                        : `Additional View ${index + 1}`
                    }
                  />
                ))}
              </div>
            ) : null}

            <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <p className="rounded-3xl border border-white/12 bg-white/[0.07] p-4 text-sm leading-6 text-white/62">
                {disclaimer}
              </p>
              <div className="grid gap-2 rounded-3xl border border-white/12 bg-white/[0.07] p-4 text-sm text-white/70 sm:min-w-56">
                <InfoLine label="Treatment" value={current.treatment} />
                <InfoLine
                  label="Timeline"
                  value={current.timeGap || "Discussed during consultation"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectorCard({
  buttonRef,
  item,
  index,
  category,
  active,
  onClick,
}: {
  buttonRef?: (node: HTMLButtonElement | null) => void;
  item: Transformation;
  index: number;
  category: TransformationCategory;
  active: boolean;
  onClick: () => void;
}) {
  const pairs = getComparePairs(item);
  const thumb =
    pairs[0]?.after || pairs[0]?.before || item.additionalImages?.[0];

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={cn(
        "relative z-20 grid w-[15.5rem] shrink-0 snap-start cursor-pointer grid-cols-[3.25rem_minmax(0,1fr)] gap-3 rounded-[1.15rem] border p-3 text-left transition last:mr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aqua)] lg:w-full lg:snap-align-none lg:grid-cols-[4rem_minmax(0,1fr)] lg:last:mr-0",
        active
          ? "border-[var(--champagne)] bg-white/14 text-white shadow-[0_16px_45px_rgba(0,0,0,0.18)]"
          : "border-white/10 bg-white/[0.06] text-white/62 hover:bg-white/10",
      )}
      aria-pressed={active}
    >
      <span className="relative h-[3.25rem] w-[3.25rem] overflow-hidden rounded-[0.85rem] bg-white/10 lg:h-16 lg:w-16 lg:rounded-[1rem]">
        {thumb ? (
          <Image
            src={imageSrc(thumb)}
            alt={
              thumb.altText || thumb.alt || displayTitle(item, category, index)
            }
            fill
            sizes="64px"
            placeholder={thumb.blurDataUrl ? "blur" : "empty"}
            blurDataURL={thumb.blurDataUrl}
            className="object-cover transition duration-500"
            style={{ objectPosition: imagePosition(thumb) }}
          />
        ) : (
          <span className="grid h-full w-full place-items-center">
            <Images className="h-5 w-5 text-white/50" />
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.62rem] font-extrabold uppercase tracking-[0.18em]">
          {item.treatment || (category === "hair" ? "Hair" : "Skin")}
        </span>
        <span className="mt-2 block truncate text-sm font-extrabold text-white">
          {displayTitle(item, category, index)}
        </span>
        <span className="mt-1 block truncate text-xs text-white/46">
          {item.timeGap || "Consultation timeline"}
        </span>
      </span>
    </button>
  );
}

function AdditionalImageCard({
  image,
  label,
}: {
  image: CmsImage;
  label: string;
}) {
  const src = imageSrc(image);

  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.07]">
      <div className="relative aspect-[4/3] bg-white/8">
        <Image
          src={src}
          alt={image.altText || image.alt || label}
          fill
          sizes="(min-width: 1024px) 220px, 50vw"
          placeholder={image.blurDataUrl ? "blur" : "empty"}
          blurDataURL={image.blurDataUrl}
          className="object-contain"
          style={{ objectPosition: imagePosition(image) }}
        />
      </div>
      <p className="px-3 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white/58">
        {label}
      </p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-white/42">
        {label}
      </p>
      <p className="mt-1 font-extrabold text-white/78">{value}</p>
    </div>
  );
}

function getComparePairs(item: Transformation): ComparePair[] {
  if (item.beforeAfterPairs?.length) {
    return item.beforeAfterPairs
      .filter(
        (pair) => imageHasSource(pair.before) && imageHasSource(pair.after),
      )
      .map((pair, index) => ({
        viewLabel:
          pair.viewLabel || (index === 0 ? "Front View" : "Second View"),
        before: pair.before,
        after: pair.after,
      }));
  }

  return [
    imageHasSource(item.frontBefore) && imageHasSource(item.frontAfter)
      ? {
          viewLabel: "Front View",
          before: item.frontBefore,
          after: item.frontAfter,
        }
      : null,
    imageHasSource(item.angleBefore) && imageHasSource(item.angleAfter)
      ? {
          viewLabel: "Second View",
          before: item.angleBefore,
          after: item.angleAfter,
        }
      : null,
  ].filter((pair): pair is ComparePair => Boolean(pair));
}

function getAdditionalImages(item: Transformation, pairs: ComparePair[]) {
  const used = new Set(
    pairs.flatMap((pair) => [imageKey(pair.before), imageKey(pair.after)]),
  );
  const seen = new Set<string>();
  const raw = [
    ...(item.additionalImages || []),
    ...(item.beforeAfterPairs || []).flatMap((pair) => [
      pair.before,
      pair.after,
    ]),
    item.frontBefore,
    item.frontAfter,
    item.angleBefore,
    item.angleAfter,
  ].filter((image): image is CmsImage =>
    Boolean(image && imageHasSource(image)),
  );

  return raw.filter((image) => {
    const key = imageKey(image);
    if (!key || used.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function displayTitle(
  item: Transformation,
  category: TransformationCategory,
  index: number,
) {
  if (item.conditionName) {
    if (category === "hair") return `${item.conditionName} Transformation`;
    return `${item.conditionName} Improvement`;
  }

  if (item.publicTitle && !/^case\s*\d+$/i.test(item.publicTitle)) {
    return item.publicTitle;
  }

  if (item.title && !/^case\s*\d+$/i.test(item.title)) {
    return item.title;
  }

  return transformationFallbackTitle(category, index);
}

function transformationHeading(
  item: Transformation,
  category: TransformationCategory,
) {
  if (category === "hair") {
    return /fue/i.test(item.treatment)
      ? "FUE Hair Transplant Transformation Example"
      : "Hair Transplant Transformation Example";
  }

  return `${item.conditionName || "Skin"} Improvement Example`;
}

function transformationAltText(
  item: Transformation,
  category: TransformationCategory,
  phase: "before" | "after",
  viewLabel: string,
) {
  const condition = item.conditionName || item.treatment;
  const view = viewLabel ? `${viewLabel.toLowerCase()} ` : "";

  if (category === "hair") {
    return phase === "after"
      ? `Hair transplant improvement example showing restored hair density after treatment at Radiance Clinics Bhubaneswar, ${view}${condition}`
      : `Hair transplant ${view}example before treatment for ${condition} at Radiance Clinics Bhubaneswar`;
  }

  return `${condition} ${view}${phase} treatment example at Radiance Clinics Bhubaneswar`;
}

function imageHasSource(image?: CmsImage): image is CmsImage {
  return Boolean(image && imageSrc(image));
}

function imageSrc(image: CmsImage) {
  return (
    image.src ||
    image.desktopUrl ||
    image.fallbackUrl ||
    image.thumbnailUrl ||
    image.mobileUrl ||
    ""
  );
}

function imageKey(image: CmsImage) {
  return image.id || imageSrc(image);
}

function imagePosition(image: CmsImage) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}
