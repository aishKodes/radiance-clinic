import type {
  BeforeAfterCase,
  CmsImage,
  Transformation,
  TransformationCategory,
} from "@/types/cms";

type Pair = {
  label: string;
  before: CmsImage;
  after: CmsImage;
};

const tinyBlur =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function beforeAfterCasesToTransformations(
  cases: BeforeAfterCase[],
): Transformation[] {
  return cases
    .map((item, index) => beforeAfterCaseToTransformation(item, index))
    .filter((item): item is Transformation => Boolean(item));
}

export function beforeAfterCaseToTransformation(
  item: BeforeAfterCase,
  index: number,
): Transformation | null {
  if (item.patientConsentConfirmed === false) return null;

  const views = getComparisonPairs(item);

  if (!views.length) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Radiance] Skipping before/after example ${
          item.caseId || item.slug
        }: no complete before/after pair.`,
      );
    }
    return null;
  }

  const used = new Set(
    views.flatMap((view) => [
      imageKey(view.before),
      imageKey(view.after),
    ]),
  );
  const additionalImages = getAdditionalImages(item, used);
  const number = transformationNumber(item.caseId || item.slug, index);
  const category = inferTransformationCategory(item);
  const conditionName =
    item.conditionName ||
    titleFromSlug(item.treatmentCategory || item.treatment || item.title || item.slug);
  const publicTitle =
    item.patientLabel ||
    item.title ||
    transformationFallbackTitle(category || "hair", index);

  return {
    id: item.caseId || item.slug || `hair-transformation-${number}`,
    title: item.title || publicTitle,
    category,
    conditionName,
    publicTitle,
    subtitle:
      item.resultSummary ||
      item.note ||
      "Consent-confirmed treatment images for consultation discussion.",
    treatment: item.treatment || "Hair Restoration",
    timeGap: item.timeGap || "Timeline discussed during consultation",
    disclaimer:
      item.disclaimer ||
      "Results vary by individual. Images are shared with consent. A consultation is required.",
    beforeAfterPairs: views.map((view) => ({
      viewLabel: view.label,
      before: view.before,
      after: view.after,
    })),
    frontBefore: views[0]?.before,
    frontAfter: views[0]?.after,
    angleBefore: views[1]?.before,
    angleAfter: views[1]?.after,
    additionalImages,
    consentConfirmed: true,
  };
}

export function localPublicImage({
  src,
  alt,
  id,
  category,
  role,
}: {
  src: string;
  alt: string;
  id: string;
  category: string;
  role: string;
}): CmsImage {
  return {
    id,
    filename: src.split("/").pop(),
    category,
    role,
    src,
    alt,
    desktopUrl: src,
    mobileUrl: src,
    thumbnailUrl: src,
    fallbackUrl: src,
    originalUrl: src,
    altText: alt,
    blurDataUrl: tinyBlur,
    focalPoint: { x: 0.5, y: 0.5 },
    type: "image",
    placeholder: false,
    placeholderAllowed: false,
    publish: true,
  };
}

export function transformationFallbackTitle(
  category: TransformationCategory,
  index: number,
) {
  const number = String(index + 1).padStart(2, "0");
  return category === "skin"
    ? `Skin Improvement Example ${number}`
    : `Hair Transformation Example ${number}`;
}

function getComparisonPairs(item: BeforeAfterCase): Pair[] {
  const explicit = item.comparisonViews
    ?.filter((view) => imageHasSource(view.before) && imageHasSource(view.after))
    .map((view) => ({
      label: view.label || "Front View",
      before: view.before,
      after: view.after,
    }));

  if (explicit?.length) return explicit;

  return [
    item.frontBeforeImage && item.frontAfterImage
      ? {
          label: item.primaryViewLabel || "Front View",
          before: item.frontBeforeImage,
          after: item.frontAfterImage,
        }
      : null,
    item.angle2BeforeImage && item.angle2AfterImage
      ? {
          label: item.secondaryViewLabel || "Second View",
          before: item.angle2BeforeImage,
          after: item.angle2AfterImage,
        }
      : null,
    item.beforeImage && item.afterImage
      ? {
          label: item.primaryViewLabel || "Front View",
          before: item.beforeImage,
          after: item.afterImage,
        }
      : null,
  ].filter((view): view is Pair =>
    Boolean(view && imageHasSource(view.before) && imageHasSource(view.after)),
  );
}

function getAdditionalImages(item: BeforeAfterCase, used: Set<string>) {
  const seen = new Set<string>();
  const raw = [
    ...(item.additionalViews || []).map((view) => view.image),
    ...(item.extraImages || []).map((view) => view.image),
    item.frontBeforeImage,
    item.frontAfterImage,
    item.angle2BeforeImage,
    item.angle2AfterImage,
    item.beforeImage,
    item.afterImage,
  ].filter((image): image is CmsImage => Boolean(image && imageHasSource(image)));

  return raw.filter((image) => {
    const key = imageKey(image);
    if (!key || used.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function transformationNumber(value: string | undefined, index: number) {
  const matches = value?.match(/\d+/g);
  const digits = matches?.[matches.length - 1];
  return digits
    ? digits.slice(-2).padStart(2, "0")
    : String(index + 1).padStart(2, "0");
}

function titleFromSlug(value: string | undefined) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part === "and") return "and";
      if (part === "prp") return "PRP";
      if (part === "gfc") return "GFC";
      if (part === "fue") return "FUE";
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}

function inferTransformationCategory(
  item: BeforeAfterCase,
): TransformationCategory | undefined {
  const text = `${item.slug} ${item.caseId || ""} ${item.title} ${item.conditionName || ""} ${
    item.treatmentCategory || ""
  } ${item.treatment}`.toLowerCase();

  if (
    /skin|acne|scar|pigmentation|melasma|mole|wart|tag|rosacea|redness|pore|circle|rejuvenation|tone|oily|laser/.test(
      text,
    )
  ) {
    return "skin";
  }

  if (/hair|fue|prp|gfc|beard|bald|scalp|crown|thinning|recession|hairline|transplant/.test(text)) {
    return "hair";
  }

  return undefined;
}

function imageHasSource(image?: CmsImage): image is CmsImage {
  return Boolean(
    image?.src ||
      image?.desktopUrl ||
      image?.fallbackUrl ||
      image?.thumbnailUrl ||
      image?.mobileUrl,
  );
}

function imageKey(image: CmsImage) {
  return image.id || image.src || image.desktopUrl || image.fallbackUrl || "";
}
