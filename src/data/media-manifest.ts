import manifestPayload from "../../public/radiance-media-processed/manifest.json";
import pairsPayload from "../../public/radiance-media-processed/before-after-pairs.json";
import type {
  BeforeAfterCase,
  CmsImage,
  GalleryImage,
  HomepageMediaItem,
  RecognitionItem,
  SocialLink,
  SocialStat,
  ReviewSummary,
} from "@/types/cms";

const processedBase = "/radiance-media-processed";
const placeholderFallback =
  "https://images.pexels.com/photos/10521230/pexels-photo-10521230.jpeg?auto=compress&cs=tinysrgb&w=1600";
const tinyBlur =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

type VariantKey =
  | "heroDesktop"
  | "heroMobile"
  | "landscape"
  | "portrait"
  | "square"
  | "thumb";

type ManifestVariant = {
  webp?: string;
  avif?: string;
  width?: number;
  height?: number;
};

type ManifestItem = {
  id: string;
  filename?: string;
  originalFilename?: string;
  originalRelativePath?: string;
  rawRelativePath?: string;
  category?: string;
  role?: string;
  subject?: string;
  usage?: string;
  title?: string;
  altText?: string;
  alt_text?: string;
  caption?: string;
  displayMode?: "cover" | "contain" | string;
  contentHash?: string;
  normalizedBasename?: string;
  focalPointX?: number;
  focalPointY?: number;
  focal_point_x?: number;
  focal_point_y?: number;
  sortOrder?: number;
  sort_order?: number;
  sequence?: string | number | null;
  sequenceNumber?: number | null;
  featured?: boolean;
  publish?: boolean;
  consentConfirmed?: boolean;
  consent_confirmed?: boolean;
  caseId?: string | null;
  beforeAfterRole?: string | null;
  beforeAfterPairKey?: string | null;
  replacementAfter?: boolean;
  replacementTargetSlug?: string | null;
  replacementExampleNumber?: number | null;
  generated?: Partial<Record<VariantKey, ManifestVariant>>;
  blur?: {
    placeholder?: string;
    imagePath?: string;
  };
  blur_data_url?: string;
  width?: number;
  height?: number;
};

type ManifestPayload = {
  items?: ManifestItem[];
};

type PairImage = {
  id: string;
  role?: string;
  beforeAfterRole?: string;
  replacementAfter?: boolean;
  altText?: string;
  caption?: string;
  blurDataUrl?: string;
};

type PairPayload = {
  pairs?: {
    pairKey: string;
    caseId: string;
    category?: "hair" | "skin" | string;
    conditionName?: string;
    publicTitle?: string;
    treatmentCategory?: string;
    treatment?: string;
    title?: string;
    patientLabel?: string;
    timeGap?: string;
    disclaimer?: string;
    consentConfirmed?: boolean;
    publish?: boolean;
    featured?: boolean;
    sortOrder?: number;
    frontBefore?: PairImage | null;
    frontAfter?: PairImage | null;
    angleBefore?: PairImage | null;
    angleAfter?: PairImage | null;
    topBefore?: PairImage | null;
    topAfter?: PairImage | null;
    images?: Record<string, PairImage>;
    extraImages?: PairImage[];
    replacementAfterImages?: {
      view: string;
      previousAfterId: string;
      replacementAfterId: string;
    }[];
  }[];
};

const manifest = manifestPayload as ManifestPayload;
const beforeAfterPairs = pairsPayload as unknown as PairPayload;
const manifestItems = (manifest.items || []).filter(Boolean);

function isPublished(item: ManifestItem) {
  return item.publish !== false;
}

const categoryAliases: Record<string, string> = {
  "awards-certificates": "recognition",
  "awards-recognition": "recognition",
  gallery: "gallery",
  "gallery-raw": "gallery",
  "new-gallery": "gallery",
  "clinic-gallery": "clinic-ambience",
  "doctor-gallery": "doctor",
  "clinic-interior": "clinic-ambience",
  clinic: "clinic-ambience",
  hair: "before-after",
  "hair-before-after": "hair-before-after",
  "skin-before-after": "skin-before-after",
  "generic-service-card": "generic-service-card",
  "hero-support": "hero-support",
  "category-tab-visual": "category-tab-visual",
};

const preferredIds: Record<string, string[]> = {
  "doctor:hero-primary": [
    "radiance-doctor-satyarth-hero-primary-02",
    "doctor-hero",
    "radiance-doctor-satyarth-hero-primary-01",
    "doctor-image",
  ],
  "doctor:hero-secondary": [
    "radiance-doctor-satyarth-hero-primary-01",
    "doctor-image",
    "doctor-hero",
  ],
  "hero:anil-kapoor-feature": [
    "radiance-hero-anil-kapoor-feature-01",
    "radiance-recognition-anil-kapoor-event-01",
  ],
  "hero:doctor-consultation-feature": [
    "radiance-hero-doctor-consultation-feature-01",
    "radiance-doctor-satyarth-consultation-01",
  ],
  "hero:clinic-interior-secondary": [
    "radiance-hero-clinic-interior-secondary-01",
    "radiance-clinic-reception-wide-01",
    "radiance-clinic-interior-wide-01",
  ],
  "hero:happy-patient-secondary": [
    "radiance-hero-happy-patient-secondary-01",
    "radiance-clinic-happy-patient-01",
  ],
  "doctor:satyarth-portrait": ["radiance-doctor-satyarth-portrait-01"],
  "doctor:satyarth-consultation": [
    "radiance-doctor-satyarth-hero-primary-01",
    "doctor-image",
    "radiance-doctor-satyarth-consultation-01new",
    "radiance-doctor-satyarth-consultation-01",
  ],
  "doctor:satyarth-procedure-room": ["radiance-doctor-satyarth-procedure-room-01"],
  "doctor:satyarth-with-patient": [
    "radiance-doctor-satyarth-with-patient-01",
    "radiance-clinic-happy-patient-01",
  ],
  "doctor:satyarth-award-moment": ["radiance-doctor-satyarth-award-moment-01"],
  "recognition:threebestrated-2025-badge": [
    "radiance-recognition-threebestrated-2025-badge-01",
    "radiance-brand-threebestrated-badge-01",
  ],
  "recognition:anil-kapoor-event": [
    "radiance-recognition-anil-kapoor-event-01",
    "radiance-hero-anil-kapoor-feature-01",
  ],
  "clinic-ambience:exterior-board": ["radiance-clinic-exterior-board-01"],
  "clinic-ambience:reception-wide": ["radiance-clinic-reception-wide-01"],
  "clinic-ambience:consultation-room": ["radiance-clinic-consultation-room-01"],
  "clinic-ambience:treatment-room": ["radiance-clinic-treatment-room-01"],
  "clinic-ambience:happy-patient": ["radiance-clinic-happy-patient-01"],
  "equipment:laser-machine": ["radiance-equipment-laser-machines-01"],
  "equipment:skin-treatment-machine": ["radiance-equipment-machine-cluster-01"],
  "equipment:hair-transplant-setup": ["radiance-equipment-procedure-room-01"],
};

function normalize(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function itemSearchText(item: ManifestItem) {
  return [
    item.id,
    item.filename,
    item.originalFilename,
    item.rawRelativePath,
    item.originalRelativePath,
    item.category,
    item.role,
    item.usage,
    item.subject,
    item.title,
    item.altText,
    item.caption,
  ]
    .map(normalize)
    .join(" ");
}

function sequenceRank(item: ManifestItem) {
  const fromSequenceNumber = Number(item.sequenceNumber);
  if (Number.isFinite(fromSequenceNumber)) return fromSequenceNumber;

  const sequence = String(item.sequence || "").match(/\d+/)?.[0];
  if (sequence) return Number(sequence);

  const text = `${item.id || ""} ${item.filename || ""} ${item.originalFilename || ""}`;
  const matches = text.match(/\d+/g);
  const last = matches?.[matches.length - 1];
  return last ? Number(last) : 0;
}

function mediaRank(item: ManifestItem) {
  const text = itemSearchText(item);
  return (
    sequenceRank(item) +
    (item.featured ? 1000 : 0) +
    (text.includes("new") ? 0.5 : 0) +
    Number(item.sortOrder ?? item.sort_order ?? 0) / 10000
  );
}

function sortMediaItems(items: ManifestItem[]) {
  return [...items].sort((a, b) => {
    const rankDiff = mediaRank(b) - mediaRank(a);
    if (rankDiff !== 0) return rankDiff;
    return String(b.id).localeCompare(String(a.id));
  });
}

function itemsByCategory(category: string) {
  const categoryKey = canonicalCategory(category);
  return manifestItems.filter(
    (item) => isPublished(item) && canonicalCategory(item.category) === categoryKey,
  );
}

function findBestItem(
  category: string,
  tests: (RegExp | string)[],
  exclude?: (item: ManifestItem) => boolean,
) {
  const normalizedTests = tests.map((test) =>
    typeof test === "string" ? normalize(test) : test,
  );
  const candidates = itemsByCategory(category).filter((item) => {
    if (exclude?.(item)) return false;
    const text = itemSearchText(item);
    return normalizedTests.some((test) =>
      typeof test === "string" ? text.includes(test) : test.test(text),
    );
  });

  return sortMediaItems(candidates)[0];
}

function findBestImage(
  category: string,
  tests: (RegExp | string)[],
  variant: VariantKey = "landscape",
  exclude?: (item: ManifestItem) => boolean,
) {
  const item = findBestItem(category, tests, exclude);
  return item ? cmsImage(item, variant) : undefined;
}

function imagesMatching(
  category: string,
  tests: (RegExp | string)[],
  variant: VariantKey = "landscape",
) {
  const normalizedTests = tests.map((test) =>
    typeof test === "string" ? normalize(test) : test,
  );

  return sortMediaItems(
    itemsByCategory(category).filter((item) => {
      const text = itemSearchText(item);
      return normalizedTests.some((test) =>
        typeof test === "string" ? text.includes(test) : test.test(text),
      );
    }),
  ).map((item) => cmsImage(item, variant));
}

function uniqueImages(images: Array<CmsImage | undefined>) {
  const seen = new Set<string>();

  return images.filter((image): image is CmsImage => {
    if (!image) return false;
    const key = image.id || image.src;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function dedupeMediaItems<T extends ManifestItem>(items: T[]): T[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const basename = normalize(
      item.normalizedBasename || pathBasename(item.originalFilename || item.filename || item.id),
    );
    const titleCategory = normalize(`${item.title || ""}-${item.category || ""}`);
    const text = itemSearchText(item);
    const generatedDesktop = item.generated?.heroDesktop?.webp || "";
    const generatedThumb = item.generated?.thumb?.webp || "";
    const keys = [
      item.id && `id:${item.id}`,
      item.originalFilename && `file:${normalize(item.originalFilename)}`,
      basename && `base:${basename}`,
      item.rawRelativePath && `raw:${normalize(item.rawRelativePath)}`,
      item.originalRelativePath && `source:${normalize(item.originalRelativePath)}`,
      item.contentHash && `hash:${item.contentHash}`,
      titleCategory && !/^certificate-recognition$|^clinic-milestone-recognition$/.test(titleCategory)
        ? `title:${titleCategory}`
        : "",
      generatedDesktop && `desktop:${generatedDesktop}`,
      generatedThumb && `thumb:${generatedThumb}`,
      /threebest|threebestrated|best-business/.test(text) ? "trust-badge:threebest" : "",
      /anil-kapoor/.test(text) ? "recognition:anil-kapoor" : "",
    ].filter(Boolean) as string[];

    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function pathBasename(value: string) {
  return value.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") || value;
}

function canonicalCategory(value: unknown) {
  const normalized = normalize(value);
  return categoryAliases[normalized] || normalized;
}

function titleFromSlug(value: string) {
  return normalize(value)
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function pathWithBase(value?: string) {
  if (!value) return undefined;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:") || value.startsWith("/")) {
    return value;
  }
  return `${processedBase}/${value}`;
}

function itemById(id: string) {
  return manifestItems.find((item) => item.id === id);
}

function selectVariant(item: ManifestItem, variant: VariantKey) {
  const preferred = item.generated?.[variant]?.webp;
  const fallback =
    item.generated?.landscape?.webp ||
    item.generated?.heroDesktop?.webp ||
    item.generated?.portrait?.webp ||
    item.generated?.square?.webp ||
    item.generated?.thumb?.webp;

  return pathWithBase(preferred || fallback) || "";
}

function cmsImage(item: ManifestItem, variant: VariantKey = "landscape"): CmsImage {
  const role = normalize(item.role || item.usage || item.subject || item.id);
  const altText =
    item.altText ||
    item.alt_text ||
    `${titleFromSlug(role || item.id)} - Radiance Clinics`;
  const focalX = Number(item.focalPointX ?? item.focal_point_x ?? 0.5);
  const focalY = Number(item.focalPointY ?? item.focal_point_y ?? 0.5);

  return {
    id: item.id,
    filename: item.filename || item.originalFilename,
    category: canonicalCategory(item.category),
    role,
    src: selectVariant(item, variant),
    alt: altText,
    desktopUrl: selectVariant(item, "heroDesktop"),
    mobileUrl: selectVariant(item, "heroMobile"),
    thumbnailUrl: selectVariant(item, "thumb"),
    fallbackUrl: selectVariant(item, "landscape"),
    originalUrl: pathWithBase(item.originalRelativePath),
    altText,
    caption: item.caption || undefined,
    displayMode: item.displayMode || undefined,
    contentHash: item.contentHash,
    normalizedBasename: item.normalizedBasename,
    focalPoint: {
      x: Number.isFinite(focalX) ? focalX : 0.5,
      y: Number.isFinite(focalY) ? focalY : 0.5,
    },
    blurDataUrl: item.blur?.placeholder || item.blur_data_url || tinyBlur,
    type: "image",
    placeholder: false,
    placeholderAllowed: false,
    usageLocation: item.usage,
    photographerSource: "Radiance Clinics media library",
    permissionStatus: "clinic-provided",
    sortOrder: Number(item.sortOrder ?? item.sort_order ?? 0),
    featured: Boolean(item.featured),
    publish: item.publish !== false,
    width: item.width,
    height: item.height,
  };
}

function findByRole(category: string, role: string) {
  const categoryKey = canonicalCategory(category);
  const roleKey = normalize(role);
  const aliasKey = `${categoryKey}:${roleKey}`;
  const aliasItem = preferredIds[aliasKey]?.map(itemById).find(Boolean);

  if (aliasItem) return aliasItem;

  return manifestItems.find((item) => {
    const itemCategory = canonicalCategory(item.category);
    const haystack = [
      item.role,
      item.usage,
      item.subject,
      item.id,
      item.originalFilename,
      item.filename,
    ]
      .map(normalize)
      .join(" ");

    return item.publish !== false && itemCategory === categoryKey && haystack.includes(roleKey);
  });
}

function imageByRole(category: string, role: string, fallbackId?: string, variant?: VariantKey) {
  const item = findByRole(category, role) || (fallbackId ? itemById(fallbackId) : undefined);
  return item ? cmsImage(item, variant) : undefined;
}

function requiredImage(
  category: string,
  role: string,
  fallbackId: string,
  variant?: VariantKey,
): CmsImage {
  const image = imageByRole(category, role, fallbackId, variant);
  if (image) return image;

  return {
    src: placeholderFallback,
    alt: "Radiance Clinics treatment visual",
    desktopUrl: placeholderFallback,
    mobileUrl: placeholderFallback,
    thumbnailUrl: placeholderFallback,
    fallbackUrl: placeholderFallback,
    altText: "Radiance Clinics treatment visual",
    blurDataUrl: tinyBlur,
    focalPoint: { x: 0.5, y: 0.5 },
    type: "image",
    placeholder: true,
    placeholderAllowed: true,
    publish: true,
  } satisfies CmsImage;
}

function placeholderImage(label = "Radiance Clinics treatment visual"): CmsImage {
  return {
    src: placeholderFallback,
    alt: label,
    desktopUrl: placeholderFallback,
    mobileUrl: placeholderFallback,
    thumbnailUrl: placeholderFallback,
    fallbackUrl: placeholderFallback,
    altText: label,
    blurDataUrl: tinyBlur,
    focalPoint: { x: 0.5, y: 0.5 },
    type: "image",
    placeholder: true,
    placeholderAllowed: true,
    publish: true,
  } satisfies CmsImage;
}

function requiredPriorityImage(
  candidates: Array<CmsImage | undefined>,
  label = "Radiance Clinics treatment visual",
): CmsImage {
  return candidates.find(Boolean) || placeholderImage(label);
}

function extra(role: string, image: CmsImage, label?: string) {
  return {
    role,
    label: label || titleFromSlug(role),
    image,
  };
}

function pairImageToCms(pairImage?: PairImage | null, fallback?: CmsImage) {
  if (!pairImage) return fallback;
  const item = itemById(pairImage.id);
  return item ? cmsImage(item, "portrait") : fallback;
}

function pairImageByRole(
  pair: NonNullable<PairPayload["pairs"]>[number],
  role: string,
) {
  return (
    (pair[role as keyof typeof pair] as PairImage | null | undefined) ||
    pair.images?.[role] ||
    pair.extraImages?.find(
      (item) => normalize(item.beforeAfterRole || item.role || "") === normalize(role),
    )
  );
}

function caseManifestItems(pair: NonNullable<PairPayload["pairs"]>[number]) {
  const caseKey = normalize(pair.caseId);

  return manifestItems.filter((item) => {
    const itemCase = normalize(item.caseId || item.subject);
    const path = normalize(item.originalRelativePath || item.rawRelativePath || "");

    return (
      canonicalCategory(item.category) === "before-after" &&
      item.publish !== false &&
      (itemCase === caseKey || path.includes(caseKey))
    );
  });
}

function pairImageFromItem(item: ManifestItem): PairImage {
  return {
    id: item.id,
    role: item.role || item.usage,
    beforeAfterRole: item.beforeAfterRole || undefined,
    altText: item.altText || item.alt_text,
    caption: item.caption,
    blurDataUrl: item.blur?.placeholder || item.blur_data_url,
  };
}

function candidateText(item: ManifestItem | PairImage) {
  return normalize(
    [
      "id" in item ? item.id : "",
      item.role,
      "beforeAfterRole" in item ? item.beforeAfterRole : "",
      "filename" in item ? item.filename : "",
      "originalFilename" in item ? item.originalFilename : "",
      "rawRelativePath" in item ? item.rawRelativePath : "",
      "originalRelativePath" in item ? item.originalRelativePath : "",
    ].join(" "),
  );
}

function isBeforeCandidate(item: ManifestItem | PairImage) {
  const text = candidateText(item);
  return /\b(before|bfore)\b/.test(text) || text.includes("before");
}

function isAfterCandidate(item: ManifestItem | PairImage) {
  const text = candidateText(item);
  return /\bafter\b/.test(text) || text.includes("after");
}

function looseCandidates(
  pair: NonNullable<PairPayload["pairs"]>[number],
  role: "before" | "after",
  usedIds: Set<string>,
) {
  return caseManifestItems(pair)
    .filter((item) => !usedIds.has(item.id))
    .filter((item) => (role === "before" ? isBeforeCandidate(item) : isAfterCandidate(item)))
    .map(pairImageFromItem);
}

function comparisonViewsForPair(pair: NonNullable<PairPayload["pairs"]>[number]) {
  const viewPriority = [
    { before: "frontBefore", after: "frontAfter", label: "Front View" },
    { before: "angleBefore", after: "angleAfter", label: "Second View" },
    { before: "topBefore", after: "topAfter", label: "Crown View" },
  ];
  const usedIds = new Set<string>();
  const views: { label: string; before: CmsImage; after: CmsImage }[] = [];

  for (const view of viewPriority) {
    const explicitBefore = pairImageByRole(pair, view.before);
    const explicitAfter = pairImageByRole(pair, view.after);
    const beforeCandidate = explicitBefore || looseCandidates(pair, "before", usedIds)[0];
    const afterCandidate = explicitAfter || looseCandidates(pair, "after", usedIds)[0];

    if (
      (beforeCandidate?.id && usedIds.has(beforeCandidate.id)) ||
      (afterCandidate?.id && usedIds.has(afterCandidate.id))
    ) {
      continue;
    }

    const before = pairImageToCms(beforeCandidate);
    const after = pairImageToCms(afterCandidate);

    if (before && after) {
      if (beforeCandidate?.id) usedIds.add(beforeCandidate.id);
      if (afterCandidate?.id) usedIds.add(afterCandidate.id);
      views.push({ label: view.label, before, after });
    } else if (beforeCandidate?.id && !before) {
      usedIds.delete(beforeCandidate.id);
    } else if (beforeCandidate?.id && !after) {
      usedIds.delete(beforeCandidate.id);
    }

    if (views.length >= 2) break;
  }

  return { views, usedIds };
}

function additionalViewsForPair(
  pair: NonNullable<PairPayload["pairs"]>[number],
  usedIds: Set<string>,
) {
  const explicitImages = [
    pair.frontBefore,
    pair.frontAfter,
    pair.angleBefore,
    pair.angleAfter,
    pair.topBefore,
    pair.topAfter,
    ...(pair.extraImages || []),
  ].filter((item): item is PairImage => Boolean(item));
  const manifestImages = caseManifestItems(pair).map(pairImageFromItem);
  const seen = new Set<string>();
  const supersededAfterIds = new Set(
    (pair.replacementAfterImages || []).map((item) => item.previousAfterId),
  );

  return [...explicitImages, ...manifestImages]
    .filter((item) => {
      if (
        !item.id ||
        usedIds.has(item.id) ||
        seen.has(item.id) ||
        supersededAfterIds.has(item.id)
      ) {
        return false;
      }
      seen.add(item.id);
      return true;
    })
    .map((item, index) => {
      const image = pairImageToCms(item);
      if (!image) return null;
      const role = normalize(item.beforeAfterRole || item.role || `additional-${index + 1}`);
      const label = isBeforeCandidate(item)
        ? "Additional Before View"
        : isAfterCandidate(item)
          ? "Additional After View"
          : "Additional View";

      return extra(role || `additional-${index + 1}`, image, label);
    })
    .filter((item): item is ReturnType<typeof extra> => Boolean(item));
}

function strictBeforeAfterCases() {
  return (beforeAfterPairs.pairs || [])
    .filter((pair) => pair.publish !== false && pair.consentConfirmed === true)
    .map((pair): BeforeAfterCase | null => {
      const { views, usedIds } = comparisonViewsForPair(pair);

      if (!views.length) {
        console.warn(
          `[Radiance] Before/after example ${pair.caseId} was skipped because no complete before/after pair was found.`,
        );
        return null;
      }

      const primaryView = views[0];
      const secondaryView = views[1];
      const additionalViews = additionalViewsForPair(pair, usedIds);
      const category = pair.category === "skin" ? "skin" : "hair";
      const treatmentTitle =
        pair.treatment ||
        titleFromSlug(pair.treatmentCategory || (category === "skin" ? "Skin Treatment" : "Hair Transplant"));
      const exampleLabel =
        pair.publicTitle ||
        pair.title ||
        (category === "skin" ? "Skin Improvement Example" : "Hair Transformation Example");

      return {
        slug: normalize(`${pair.treatmentCategory || "hair-transplant"}-${pair.caseId}`),
        caseId: pair.caseId,
        title: exampleLabel,
        conditionName: pair.conditionName,
        patientLabel: exampleLabel,
        treatment: treatmentTitle,
        treatmentCategory: pair.treatmentCategory || (category === "skin" ? "skin-treatment" : "hair-transplant"),
        timeGap: pair.timeGap || "Timeline discussed during consultation",
        note:
          category === "skin"
            ? "A consent-confirmed skin improvement example shown with context."
            : "A consent-confirmed hair transformation example shown with context.",
        resultSummary:
          "Matched before-and-after images are shown for education and consultation discussion.",
        disclaimer:
          pair.disclaimer ||
          "Results vary by diagnosis, donor quality, biology, timeline and maintenance. Images must be interpreted with clinical context.",
        patientConsentConfirmed: true,
        faceBlurRequired: category === "hair",
        featured: pair.featured,
        frontBeforeImage: primaryView.before,
        frontAfterImage: primaryView.after,
        angle2BeforeImage: secondaryView?.before,
        angle2AfterImage: secondaryView?.after,
        primaryViewLabel: primaryView.label,
        secondaryViewLabel: secondaryView?.label,
        comparisonViews: views,
        additionalViews,
        beforeImage: primaryView.before,
        afterImage: primaryView.after,
        extraImages: additionalViews,
      };
    })
    .filter((item): item is BeforeAfterCase => Boolean(item));
}

export function getHeroImage(role: string) {
  return imageByRole("hero", role, undefined, "landscape");
}

export function getHeroGalleryImages() {
  return uniqueImages([
    ...imagesMatching("hero", [/radiance-hero-gallery/, /hero-gallery/, /gallery/], "landscape"),
    ...imagesMatching("clinic-ambience", [/clinic|reception|interior|consultation|treatment|happy/], "landscape"),
    ...imagesMatching("recognition", [/recognition|award|certificate|threebest|badge/], "landscape"),
  ]);
}

export function getBeforeAfterCase(caseId: string) {
  return realBeforeAfterCases.find(
    (item) => normalize(item.caseId || "") === normalize(caseId),
  );
}

export function getRecognitionItemsFromManifest() {
  return realRecognitionItems;
}

export function getClinicGallery() {
  return realClinicGallery;
}

export function getEquipmentGallery() {
  return realEquipmentGallery;
}

export function getSocialAssets() {
  return realSocialAssets;
}

export const radianceMedia = {
  badge2025: requiredPriorityImage(
    [
      findBestImage("recognition", [/threebestrated|threebest|best-business|2025|badge/], "square"),
      findBestImage("logo-brand", [/threebestrated|threebest|badge/], "square"),
    ],
    "ThreeBestRated 2025 recognition badge",
  ),
  awardFullStage: requiredPriorityImage(
    [
      findBestImage("recognition", [/award-ceremony|ceremony|event|stage/], "landscape"),
      findBestImage("recognition", [/recognition|award/], "landscape"),
    ],
    "Radiance Clinics award ceremony",
  ),
  awardPresentation: requiredPriorityImage(
    [
      findBestImage("hero", [/radiance-hero-anil-kapoor-feature-01|anil-kapoor-feature/], "landscape"),
      findBestImage("recognition", [/radiance-recognition-anil-kapoor-event-01|anil-kapoor-event/], "landscape"),
      findBestImage("recognition", [/award|recognition|event/], "landscape"),
    ],
    "Radiance Clinics recognition moment",
  ),
  awardStageWide: requiredPriorityImage(
    [
      findBestImage("recognition", [/award-ceremony|stage|event/], "landscape"),
      findBestImage("recognition", [/recognition/], "landscape"),
    ],
    "Radiance Clinics recognition stage moment",
  ),
  awardTrophyCloseup: requiredPriorityImage(
    [
      findBestImage("doctor", [/satyarth-award|award-moment/], "portrait"),
      findBestImage("recognition", [/award|trophy|ceremony/], "portrait"),
    ],
    "Dr. Satyarth Prakash recognition moment",
  ),
  clinicExterior: requiredImage(
    "clinic-ambience",
    "exterior-board",
    "clinic-exterior-evening-front-signage",
  ),
  clinicReception: requiredImage(
    "hero",
    "clinic-interior-secondary",
    "clinic-reception-lobby-modern-01",
  ),
  doctorCabin: requiredImage(
    "clinic-ambience",
    "consultation-room",
    "clinic-doctor-cabin-empty-01",
  ),
  consultationRoom: requiredImage(
    "clinic-ambience",
    "consultation-room",
    "clinic-consultation-room-empty-01",
  ),
  equipmentRoomOne: requiredImage(
    "equipment",
    "laser-machine",
    "clinic-treatment-room-equipment-01",
  ),
  equipmentRoomTwo: requiredImage(
    "equipment",
    "skin-treatment-machine",
    "clinic-treatment-room-equipment-02",
  ),
  heroMain: requiredPriorityImage(
    [
      requiredImage(
        "doctor",
        "hero-primary",
        "doctor-hero",
        "portrait",
      ),
      findBestImage("doctor", [/radiance-doctor-satyarth-hero-primary-02|doctor-hero|hero-primary/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-hero-primary-01|doctor-image|hero-secondary/], "portrait"),
      findBestImage("hero", [/radiance-hero-gallery-consultation|gallery-consultation|hero-gallery.*consultation/], "landscape"),
      findBestImage("doctor", [/radiance-doctor-satyarth-consultation|satyarth-consultation|consultation/], "landscape"),
      findBestImage("hero", [/radiance-hero-gallery-clinic|gallery-clinic|clinic-gallery|clinic/], "landscape"),
      findBestImage("hero", [/radiance-hero-doctor-consultation-feature-01|doctor-consultation-feature|consultation-feature/], "landscape"),
    ],
    "Radiance Clinics doctor-led consultation",
  ),
  doctorConsultation: requiredPriorityImage(
    [
      requiredImage(
        "doctor",
        "hero-secondary",
        "doctor-image",
        "portrait",
      ),
      findBestImage("doctor", [/radiance-doctor-satyarth-hero-primary-01|doctor-image|hero-secondary/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-hero-primary-02|doctor-hero|hero-primary/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-consultation|satyarth-consultation|consultation/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-portrait|satyarth-portrait|portrait/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-with-patient|with-patient|patient/], "portrait"),
      findBestImage("hero", [/doctor-consultation-feature|consultation/], "portrait"),
    ],
    "Dr. Satyarth Prakash consultation at Radiance Clinics",
  ),
  doctorProfile: requiredPriorityImage(
    [
      findBestImage("doctor", [/radiance-doctor-satyarth-portrait|satyarth-portrait|portrait/], "portrait"),
      findBestImage("doctor", [/radiance-doctor-satyarth-consultation|satyarth-consultation|consultation/], "portrait"),
    ],
    "Dr. Satyarth Prakash portrait",
  ),
  happyPatient: requiredImage(
    "hero",
    "happy-patient-secondary",
    "doctor-with-happy-patient-trust-photo-01",
  ),
  hairBeforeFront: requiredImage(
    "before-after",
    "case001-front-before",
    "hair-case-anonymized-04-censored-portrait-in-clinical-setting",
    "portrait",
  ),
  hairAfterFront: requiredImage(
    "before-after",
    "case001-front-after",
    "hair-case-portrait-34-radiance-hair-clinic-portrait-close-up",
    "portrait",
  ),
  hairBeforeAngle: requiredImage(
    "before-after",
    "case001-angle-before",
    "hair-case-anonymized-37-side-profile-with-privacy-bar-filter",
    "portrait",
  ),
  hairAfterAngle: requiredImage(
    "before-after",
    "case001-angle-after",
    "hair-case-portrait-35-radiance-hair-clinic-portrait-session",
    "portrait",
  ),
  crownBefore: requiredImage(
    "before-after",
    "case001-crown-before",
    "hair-case-top-crown-01-balding-focus-on-the-crown-view",
    "square",
  ),
  crownAfter: requiredImage(
    "before-after",
    "case001-crown-after",
    "hair-case-portrait-10-contemplative-portrait-in-soft-lighting",
    "portrait",
  ),
  hairCaseTwoFront: requiredImage(
    "before-after",
    "case002-front-before",
    "hair-case-anonymized-29-portrait-of-man-with-censor-bar",
    "portrait",
  ),
  hairCaseTwoAfter: requiredImage(
    "before-after",
    "case002-front-after",
    "hair-case-portrait-31-professional-clinic-portrait-with-branding",
    "portrait",
  ),
};

export const realHeroImages = [
  radianceMedia.heroMain,
  radianceMedia.awardPresentation,
  ...getHeroGalleryImages(),
  radianceMedia.doctorConsultation,
  radianceMedia.clinicReception,
  radianceMedia.happyPatient,
  radianceMedia.badge2025,
].filter((image, index, self) => {
  const key = image.id || image.src;
  return self.findIndex((candidate) => (candidate.id || candidate.src) === key) === index;
});

function galleryLabelFor(item: ManifestItem) {
  const text = itemSearchText(item);

  if (/certificate|badge|threebest|threebestrated|award|recognition|anil-kapoor|ceremony|trophy/.test(text)) {
    return "Recognition";
  }

  if (/press|newspaper|media-feature|media-mention|clipping|social/.test(text)) {
    return "Media Mention";
  }

  if (/procedure|treatment-room|equipment|laser|machine|skin-treatment|transplant-setup/.test(text)) {
    return "Treatment Room";
  }

  if (/doctor|satyarth|consultation|cabin|with-patient/.test(text)) {
    return "Consultation";
  }

  if (/patient|waiting|lounge|comfort|reception/.test(text)) {
    return "Patient Care";
  }

  return "Clinic Interior";
}

function galleryTitleFor(item: ManifestItem, label: string) {
  const text = itemSearchText(item);

  if (/doctor-hero|hero-primary|satyarth-portrait/.test(text)) return "Dr. Satyarth Prakash";
  if (/consultation|with-patient|doctor-cabin|cabin/.test(text)) return "Doctor Consultation";
  if (/procedure|treatment-room|equipment|laser|machine/.test(text)) return "Treatment Room";
  if (/reception/.test(text)) return "Reception Lounge";
  if (/waiting|lounge|comfort/.test(text)) return "Patient Care Lounge";
  if (/interior|ambience/.test(text)) return "Clinic Interior";
  if (/exterior|board|signage/.test(text)) return "Clinic Entrance";
  if (/threebest|threebestrated|best-business/.test(text)) return "ThreeBestRated Recognition";
  if (/certificate/.test(text)) return item.title || titleFromSlug(item.subject || item.id);
  if (/anil-kapoor|award|ceremony|recognition/.test(text)) return "Recognition Moment";
  if (/press|newspaper|media-feature|clipping|social/.test(text)) return "Media Mention";

  const rawTitle =
    item.title ||
    item.subject ||
    item.role ||
    item.normalizedBasename ||
    pathBasename(item.originalFilename || item.filename || item.id);
  const title = titleFromSlug(rawTitle)
    .replace(/\bRadiance\b/g, "")
    .replace(/\bClinics?\b/g, "Clinic")
    .replace(/\b0+\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return title || label;
}

function galleryCaptionFor(item: ManifestItem, label: string, title: string) {
  if (item.caption) return item.caption;

  if (label === "Consultation") {
    return "Doctor-led consultation and assessment at Radiance Clinics.";
  }

  if (label === "Clinic Interior") {
    return `${title} at Radiance Clinics.`;
  }

  if (label === "Treatment Room") {
    return "Clinical treatment-room spaces used for planned skin, hair, laser and aesthetic care.";
  }

  if (label === "Recognition") {
    return "Recognition moments and certificates from Radiance Clinics.";
  }

  if (label === "Patient Care") {
    return "Patient care spaces designed for comfort, privacy and clear communication.";
  }

  return "Media and event mentions connected to Radiance Clinics.";
}

function galleryVariantFor(item: ManifestItem, label: string): VariantKey {
  const text = itemSearchText(item);

  if (
    item.displayMode === "contain" ||
    /certificate|badge|threebest|threebestrated|press|newspaper|clipping/.test(text)
  ) {
    return "square";
  }

  if (label === "Consultation" && /doctor|satyarth|portrait|hero/.test(text)) {
    return "portrait";
  }

  return "landscape";
}

function galleryPriority(item: ManifestItem) {
  const label = galleryLabelFor(item);
  const labelRank =
    {
      Consultation: 0,
      "Clinic Interior": 1,
      "Treatment Room": 2,
      "Patient Care": 3,
      Recognition: 4,
      "Media Mention": 5,
    }[label] ?? 8;
  const text = itemSearchText(item);
  const primaryBoost = /doctor-hero|hero-primary|satyarth/.test(text) ? -500 : 0;
  const featureBoost = item.featured ? -120 : 0;

  return labelRank * 1000 + primaryBoost + featureBoost + sequenceRank(item);
}

function galleryItemsFromManifest(): GalleryImage[] {
  const sourceItems = [
    ...itemsByCategory("gallery"),
    ...itemsByCategory("doctor"),
    ...itemsByCategory("clinic-ambience"),
    ...itemsByCategory("equipment"),
    ...itemsByCategory("recognition"),
    ...itemsByCategory("press-newspaper"),
    ...itemsByCategory("social-media").filter((item) =>
      /consultation|recognition|clinic|doctor|event|media/.test(itemSearchText(item)),
    ),
    ...itemsByCategory("hero").filter((item) =>
      /doctor|consultation|clinic|interior|patient|recognition|anil|gallery/.test(itemSearchText(item)),
    ),
    ...itemsByCategory("hero-support").filter((item) =>
      /doctor|consultation|clinic|patient|gallery/.test(itemSearchText(item)),
    ),
    ...itemsByCategory("logo-brand").filter((item) =>
      /badge|threebest|threebestrated|recognition/.test(itemSearchText(item)),
    ),
  ].filter((item) => {
    const sourceText = [
      item.id,
      item.filename,
      item.originalFilename,
      item.rawRelativePath,
      item.originalRelativePath,
      item.category,
      item.role,
      item.usage,
      item.subject,
    ]
      .map(normalize)
      .join(" ");

    return (
      item.publish !== false &&
      !/before-after|case\d+|(^|[-\s])(before|after|bfore)([-\s]|$)|transformation|skin-before-after|hair-before-after/.test(sourceText)
    );
  });

  return dedupeMediaItems(sourceItems)
    .sort((a, b) => galleryPriority(a) - galleryPriority(b) || String(a.id).localeCompare(String(b.id)))
    .map((item, index) => {
      const label = galleryLabelFor(item);
      const title = galleryTitleFor(item, label);
      const image = cmsImage(item, galleryVariantFor(item, label));

      return {
        title,
        category: label,
        caption: galleryCaptionFor(item, label, title),
        image,
        usageLocation: "inside-radiance-clinics",
        sortOrder: index + 1,
      };
    });
}

const fallbackClinicGallery: GalleryImage[] = [
  {
    title: "Evening Arrival",
    category: "Clinic exterior",
    caption: "The Radiance Clinics exterior creates a confident arrival moment.",
    image: radianceMedia.clinicExterior,
    usageLocation: "clinic-gallery",
    sortOrder: 10,
  },
  {
    title: "Reception Lounge",
    category: "Clinic ambience",
    caption: "Designed for comfort, privacy, and doctor-led care.",
    image: radianceMedia.clinicReception,
    usageLocation: "clinic-gallery",
    sortOrder: 20,
  },
  {
    title: "Doctor Consultation",
    category: "Consultation",
    caption: "Doctor-led planning before hair, skin, laser or aesthetic treatments.",
    image: radianceMedia.doctorConsultation,
    usageLocation: "clinic-gallery",
    sortOrder: 30,
  },
  {
    title: "Patient Trust Moment",
    category: "Patient experience",
    caption: "A real clinic moment focused on trust, comfort and clarity.",
    image: radianceMedia.happyPatient,
    usageLocation: "clinic-gallery",
    sortOrder: 40,
  },
  {
    title: "Private Planning Room",
    category: "Consultation room",
    caption: "A private room for detailed skin, scalp and aesthetic conversations.",
    image: radianceMedia.doctorCabin,
    usageLocation: "clinic-gallery",
    sortOrder: 50,
  },
];

export const realClinicGallery: GalleryImage[] =
  galleryItemsFromManifest().length ? galleryItemsFromManifest() : fallbackClinicGallery;

export const realEquipmentGallery: GalleryImage[] = [
  {
    title: "Laser & Skin Suite",
    category: "Advanced equipment",
    caption: "Modern treatment-room technology, presented as part of careful planning.",
    image: radianceMedia.equipmentRoomOne,
    usageLocation: "equipment-strip",
    sortOrder: 10,
  },
  {
    title: "Procedure Room Technology",
    category: "Skin, laser and procedure support",
    caption: "Equipment is framed as a clinical tool, not a one-size-fits-all promise.",
    image: radianceMedia.equipmentRoomTwo,
    usageLocation: "equipment-strip",
    sortOrder: 20,
  },
  {
    title: "Consultation Workflow",
    category: "Planning environment",
    caption: "The room where suitability, expectations and aftercare are discussed.",
    image: radianceMedia.consultationRoom,
    usageLocation: "equipment-strip",
    sortOrder: 30,
  },
];

function recognitionTypeFor(item: ManifestItem) {
  const text = itemSearchText(item);
  if (/certificate|role-certificate|aesthetic|ahrs|ishrs|fue-asia|haircon|medical-association/.test(text)) return "certificate";
  if (/trust-badge|threebest|threebestrated|best-business/.test(text)) return "badge";
  if (/recognition-moment|anil-kapoor|celebrity/.test(text)) return "celebrity-moment";
  if (/press-clipping|press|newspaper|media-feature|media/.test(text)) return "press";
  if (/award-event|award|ceremony|event|stage/.test(text)) return "event";
  return "award";
}

function recognitionTitleFor(item: ManifestItem) {
  const type = recognitionTypeFor(item);
  if (type === "certificate") return item.title || titleFromSlug(item.subject || item.id);
  if (type === "badge") return item.title || "Clinic Milestone";
  if (type === "celebrity-moment") return "Recognition Moment";
  if (type === "press") return item.title || "Media Feature";
  if (type === "event") return item.title || "Recognition Moment";
  return item.title || "Clinic Milestone";
}

function recognitionDescriptionFor(item: ManifestItem) {
  const type = recognitionTypeFor(item);
  if (type === "celebrity-moment") {
    return "A public event moment from Radiance Clinics' recognition highlights.";
  }
  if (type === "certificate") {
    return item.caption || "A recognition certificate from Radiance Clinics.";
  }
  if (type === "badge") {
    return item.caption || "A clinic milestone for Radiance Clinics.";
  }
  if (type === "press") {
    return item.caption || "A media mention connected to Radiance Clinics.";
  }
  return item.caption || "Trusted by patients across Odisha.";
}

function recognitionPriority(item: ManifestItem) {
  const type = recognitionTypeFor(item);
  const typeRank =
    {
      certificate: 10,
      badge: 20,
      event: 30,
      "celebrity-moment": 40,
      press: 50,
      award: 60,
    }[type] || 80;

  return typeRank + Number(item.sortOrder ?? item.sort_order ?? 0) / 1000 - sequenceRank(item) / 100;
}

function recognitionItemsFromManifest(): RecognitionItem[] {
  const rawItems = [
    ...itemsByCategory("recognition"),
    ...itemsByCategory("press-newspaper"),
    ...itemsByCategory("logo-brand").filter((item) =>
      /badge|threebest|recognition/.test(itemSearchText(item)),
    ),
  ];

  return dedupeMediaItems(rawItems)
    .sort((a, b) => recognitionPriority(a) - recognitionPriority(b))
    .map((item, index) => {
      const type = recognitionTypeFor(item);
      const image = cmsImage(
        item,
        type === "certificate" || type === "badge" || type === "press"
          ? "square"
          : "landscape",
      );

      return {
        title: recognitionTitleFor(item),
        type,
        description: recognitionDescriptionFor(item),
        image,
        badge: type === "badge" ? image : undefined,
        sortOrder: index + 1,
        displayMode: item.displayMode || image.displayMode,
      };
    });
}

export const realRecognitionItems: RecognitionItem[] =
  recognitionItemsFromManifest().length
    ? recognitionItemsFromManifest()
    : [
        {
          title: "Clinic Milestone",
          type: "badge",
          description:
            "A clinic milestone for Radiance Clinics.",
          image: radianceMedia.badge2025,
          badge: radianceMedia.badge2025,
          sortOrder: 10,
        },
        {
          title: "Recognition Moment",
          type: "celebrity-moment",
          description:
            "A public event moment from Radiance Clinics' recognition highlights.",
          image: radianceMedia.awardPresentation,
          sortOrder: 20,
        },
      ];

const legacyCases: BeforeAfterCase[] = [
  {
    slug: "hair-transplant-front-angle-crown",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note:
      "A consent-aware multi-angle transformation layout prepared for matched front, angle and crown review.",
    resultSummary:
      "Structured hairline and density images for consultation discussion.",
    disclaimer:
      "Results vary by diagnosis, donor quality, biology, timeline and maintenance. Images must be interpreted with clinical context.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: true,
    frontBeforeImage: radianceMedia.hairBeforeFront,
    frontAfterImage: radianceMedia.hairAfterFront,
    angle2BeforeImage: radianceMedia.hairBeforeAngle,
    angle2AfterImage: radianceMedia.hairAfterAngle,
    beforeImage: radianceMedia.hairBeforeFront,
    afterImage: radianceMedia.hairAfterFront,
    extraImages: [
      extra("crown-before", radianceMedia.crownBefore),
      extra("crown-after", radianceMedia.crownAfter),
    ],
  },
  {
    slug: "hair-transplant-crown-portrait",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note:
      "Crown and portrait angles are shown with consent and consultation context.",
    resultSummary:
      "Designed to make crown-pattern improvement easier to compare without exaggerated claims.",
    disclaimer:
      "Public visuals are educational and do not guarantee any specific result.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: true,
    frontBeforeImage: radianceMedia.crownBefore,
    frontAfterImage: radianceMedia.crownAfter,
    angle2BeforeImage: radianceMedia.hairCaseTwoFront,
    angle2AfterImage: radianceMedia.hairCaseTwoAfter,
    beforeImage: radianceMedia.crownBefore,
    afterImage: radianceMedia.crownAfter,
    extraImages: [
      extra(
        "texture-before",
        requiredImage("before-after", "case002-texture-before", "hair-case-top-crown-02-balding-hair-and-striped-shirt-portrait", "square"),
      ),
      extra(
        "texture-after",
        requiredImage("before-after", "case002-texture-after", "hair-case-portrait-32-professional-portrait-of-a-south-asian-man", "portrait"),
      ),
    ],
  },
  {
    slug: "hairline-density-improvement",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Restoration",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note: "A clinic-provided anonymized set for hairline and density review.",
    resultSummary: "Front and side views prepared for consultation discussion.",
    disclaimer: "Results vary. Public visuals require consent and clinical interpretation.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: true,
    frontBeforeImage: requiredImage("before-after", "case003-front-before", "hair-case-anonymized-05-censored-portrait-in-neutral-tones", "portrait"),
    frontAfterImage: requiredImage("before-after", "case003-front-after", "hair-case-portrait-25-portrait-of-a-man-with-beard", "portrait"),
    angle2BeforeImage: requiredImage("before-after", "case003-angle-before", "hair-case-anonymized-06-censored-portrait-of-a-man", "portrait"),
    angle2AfterImage: requiredImage("before-after", "case003-angle-after", "hair-case-portrait-26-portrait-of-a-man-with-beard-and-polo", "portrait"),
    beforeImage: requiredImage("before-after", "case003-front-before", "hair-case-anonymized-05-censored-portrait-in-neutral-tones", "portrait"),
    afterImage: requiredImage("before-after", "case003-front-after", "hair-case-portrait-25-portrait-of-a-man-with-beard", "portrait"),
  },
  {
    slug: "hair-transplant-profile-top-view",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note: "A multi-view transformation prepared for front, side and top-view browsing.",
    resultSummary: "Images are organized to avoid misleading single-image comparison.",
    disclaimer: "Outcomes differ by biology, planning, aftercare and timeline.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: true,
    frontBeforeImage: requiredImage("before-after", "case004-front-before", "hair-case-anonymized-08-clinical-portrait-with-blurred-eyes", "portrait"),
    frontAfterImage: requiredImage("before-after", "case004-front-after", "hair-case-portrait-28-portrait-of-a-young-man-with-beard", "portrait"),
    angle2BeforeImage: requiredImage("before-after", "case004-angle-before", "hair-case-anonymized-09-clinical-portrait-with-privacy-bar", "portrait"),
    angle2AfterImage: requiredImage("before-after", "case004-angle-after", "hair-case-portrait-38-simple-studio-portrait-of-man", "portrait"),
    beforeImage: requiredImage("before-after", "case004-front-before", "hair-case-anonymized-08-clinical-portrait-with-blurred-eyes", "portrait"),
    afterImage: requiredImage("before-after", "case004-front-after", "hair-case-portrait-28-portrait-of-a-young-man-with-beard", "portrait"),
  },
  {
    slug: "natural-hair-density-improvement",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Restoration",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note: "A privacy-aware set for hair restoration discussion.",
    resultSummary: "Multiple angles help avoid over-reading a single view.",
    disclaimer: "No website image can replace diagnosis or doctor-led expectation setting.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: true,
    frontBeforeImage: requiredImage("before-after", "case005-front-before", "hair-case-anonymized-17-man-with-censor-strip-in-clinical-setting", "portrait"),
    frontAfterImage: requiredImage("before-after", "case005-front-after", "hair-case-portrait-23-neutral-profile-portrait-with-subtle-details", "portrait"),
    angle2BeforeImage: requiredImage("before-after", "case005-angle-before", "hair-case-anonymized-18-minimalist-portrait-with-censor-strip", "portrait"),
    angle2AfterImage: requiredImage("before-after", "case005-angle-after", "hair-case-portrait-14-hair-care-studio-portrait-shot", "portrait"),
    beforeImage: requiredImage("before-after", "case005-front-before", "hair-case-anonymized-17-man-with-censor-strip-in-clinical-setting", "portrait"),
    afterImage: requiredImage("before-after", "case005-front-after", "hair-case-portrait-23-neutral-profile-portrait-with-subtle-details", "portrait"),
  },
  {
    slug: "crown-pattern-improvement",
    title: "Hair Transplant Transformation",
    patientLabel: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    treatmentCategory: "hair-transplant",
    timeGap: "Timeline reviewed during consultation",
    note: "A transformation set prepared for crown and front pattern discussion.",
    resultSummary: "Additional image views can support consultation discussion.",
    disclaimer: "Results vary and cannot be guaranteed from image viewing.",
    patientConsentConfirmed: true,
    faceBlurRequired: true,
    featured: false,
    frontBeforeImage: requiredImage("before-after", "case006-front-before", "hair-case-anonymized-21-neutral-portrait-with-censored-eyes", "portrait"),
    frontAfterImage: requiredImage("before-after", "case006-front-after", "hair-case-portrait-11-contemplative-profile-portrait-of-man", "portrait"),
    angle2BeforeImage: requiredImage("before-after", "case006-angle-before", "hair-case-anonymized-22-neutral-portrait-with-earphones-and-mask", "portrait"),
    angle2AfterImage: requiredImage("before-after", "case006-angle-after", "hair-case-portrait-33-professional-skin-and-hair-clinic-portrait", "portrait"),
    beforeImage: requiredImage("before-after", "case006-front-before", "hair-case-anonymized-21-neutral-portrait-with-censored-eyes", "portrait"),
    afterImage: requiredImage("before-after", "case006-front-after", "hair-case-portrait-11-contemplative-profile-portrait-of-man", "portrait"),
    extraImages: [
      extra(
        "crown-before",
        requiredImage("before-after", "case006-crown-before", "hair-case-top-crown-39-top-view-of-thinning-hair-pattern", "square"),
      ),
    ],
  },
];

const strictCases = strictBeforeAfterCases();
export const legacyBeforeAfterCases: BeforeAfterCase[] = legacyCases;
export const realBeforeAfterCases: BeforeAfterCase[] = strictCases;

export const realHomepageMedia: HomepageMediaItem[] = [
  {
    title: "Hero recognition moment",
    placement: "hero-recognition",
    image: radianceMedia.awardPresentation,
    caption: "Recognition moment from Radiance Clinics.",
    sortOrder: 10,
  },
  {
    title: "Hero consultation image",
    placement: "hero-primary",
    image: radianceMedia.doctorConsultation,
    caption: "Doctor-led consultation and planning.",
    sortOrder: 20,
  },
  {
    title: "Hero clinic ambience",
    placement: "hero-secondary",
    image: radianceMedia.clinicReception,
    caption: "Clinic ambience and arrival.",
    sortOrder: 30,
  },
  {
    title: "Hero recognition badge",
    placement: "trust-badge",
    image: radianceMedia.badge2025,
    caption: "Best Business of 2025 recognition.",
    sortOrder: 40,
  },
];

export const realSocialAssets = {
  instagram: imageByRole("social-media", "instagram-profile-screenshot", undefined, "landscape"),
  youtube: imageByRole("social-media", "youtube-channel-screenshot", undefined, "landscape"),
  google: imageByRole("social-media", "google-maps-review-screenshot", undefined, "landscape"),
  facebook: imageByRole("social-media", "facebook-page-screenshot", undefined, "landscape"),
  linkedin: imageByRole("social-media", "linkedin-profile-screenshot", undefined, "landscape"),
};

export const realSocialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram community",
    handle: "@radianceskinandhairclinic",
    url: "https://instagram.com/radianceskinandhairclinic",
    ctaLabel: "View Instagram",
    image: realSocialAssets.instagram || radianceMedia.happyPatient,
    sortOrder: 10,
  },
  {
    platform: "youtube",
    label: "YouTube video library",
    handle: "@RadianceClinics",
    url: "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l",
    ctaLabel: "Watch YouTube",
    image: realSocialAssets.youtube || radianceMedia.doctorConsultation,
    sortOrder: 20,
  },
  {
    platform: "google",
    label: "Google reviews / Maps reputation",
    url: "https://www.google.com/maps/search/?api=1&query=Radiance%20Clinics%20Bhubaneswar",
    ctaLabel: "Read Google Reviews",
    image: realSocialAssets.google || radianceMedia.clinicExterior,
    sortOrder: 30,
  },
  {
    platform: "facebook",
    label: "Facebook updates",
    url: "https://facebook.com/RadianceSkinandHairClinics",
    ctaLabel: "Visit Facebook",
    image: realSocialAssets.facebook || radianceMedia.clinicReception,
    sortOrder: 40,
  },
  {
    platform: "linkedin",
    label: "LinkedIn profile",
    url: "https://linkedin.com/in/radiance-skin-and-hair-clinic-231124131",
    ctaLabel: "View LinkedIn",
    image: realSocialAssets.linkedin || radianceMedia.badge2025,
    sortOrder: 50,
  },
];

export const realSocialStats: SocialStat[] = [
  {
    platform: "instagram",
    label: "Official Instagram community",
    sourceNote: "Follower counts can be added after clinic verification.",
  },
  {
    platform: "youtube",
    label: "Videos and patient education",
    sourceNote: "Subscriber and video counts can be added after verification.",
  },
  {
    platform: "google",
    label: "Google reviews and directions",
    sourceNote: "Review summaries should come from approved clinic sources.",
  },
];

export const realReviewSummary: ReviewSummary = {
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Radiance%20Clinics%20Bhubaneswar",
  featuredReviewExcerpts: [],
};
