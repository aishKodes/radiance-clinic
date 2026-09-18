import {
  Activity,
  Droplets,
  Sparkles,
  Syringe,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { fallbackData } from "@/data/fallback";
import { placeholderImages } from "@/data/media";
import {
  fetchPublicCollection,
  fetchPublicSingle,
  publicApiPaths,
  resolveApiAssetUrl,
} from "@/lib/api";
import type {
  Article,
  AssistantSettings,
  BeforeAfterCase,
  ClinicSettings,
  Condition,
  DoctorProfile,
  GalleryImage,
  HomepageContent,
  MediaLogo,
  MediaRequirement,
  ProofStat,
  RecognitionItem,
  Review,
  ReviewSummary,
  SeoIndex,
  SocialLink,
  SocialStat,
  Stat,
  Testimonial,
  Treatment,
  VideoItem,
  CmsAssistantKnowledge,
  CmsImage,
} from "@/types/cms";
import { applyVerifiedClinicFacts } from "@/data/clinic-facts";
import { isIndexableRoute } from "@/lib/indexability";

type ApiRecord = Record<string, unknown>;

const clusterLabels: Record<string, string> = {
  "hair-restoration": "Hair Restoration",
  "skin-laser": "Skin & Laser",
  "aesthetic-dermatology": "Aesthetic Dermatology",
  "skin-wellness": "Skin Wellness",
};

const clusterIcons: Record<string, LucideIcon> = {
  "hair-restoration": Activity,
  "skin-laser": Zap,
  "aesthetic-dermatology": Syringe,
  "skin-wellness": Sparkles,
};

const clusterAccents: Record<string, Treatment["accent"]> = {
  "hair-restoration": "bronze",
  "skin-laser": "aqua",
  "aesthetic-dermatology": "coral",
  "skin-wellness": "orchid",
};

const validAccents = new Set<Treatment["accent"]>([
  "bronze",
  "blue",
  "charcoal",
  "coral",
  "orchid",
  "aqua",
]);

export const reviewCategories = [
  {
    slug: "hair-transplant",
    label: "Hair Transplant",
    description:
      "Patient feedback related to hair restoration consultations and transplant care.",
  },
  {
    slug: "skin-laser",
    label: "Skin & Laser",
    description:
      "Published patient feedback for skin, laser and dermatology-related clinic experiences.",
  },
  {
    slug: "aesthetic-treatments",
    label: "Aesthetic Treatments",
    description:
      "Clinic experience reviews connected to aesthetic dermatology and wellness-facing services.",
  },
] as const;

export function isReviewCategory(slug: string): boolean {
  return reviewCategories.some((category) => category.slug === slug);
}

function hasItems<T>(items: T[] | null | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

function imageIdentity(image: CmsImage) {
  return image.id || image.desktopUrl || image.src || image.altText;
}

function mergeHeroImages(images: CmsImage[]) {
  const seen = new Set<string>();

  return [...fallbackData.heroImages, ...images].filter((image) => {
    const key = imageIdentity(image);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function asRecord(value: unknown): ApiRecord {
  return typeof value === "object" && value !== null ? (value as ApiRecord) : {};
}

function firstString(record: ApiRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}

function firstRecord(record: ApiRecord, keys: string[]): ApiRecord | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return value as ApiRecord;
    }
  }

  return undefined;
}

function firstArray(record: ApiRecord, keys: string[]): unknown[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return undefined;
}

function firstBoolean(
  record: ApiRecord,
  keys: string[],
  fallback?: boolean,
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["1", "true", "yes", "y", "published", "enabled"].includes(normalized)) {
        return true;
      }
      if (["0", "false", "no", "n", "disabled"].includes(normalized)) {
        return false;
      }
    }
  }

  return fallback;
}

function contentAuthorType(
  value: string | undefined,
  fallback?: "editorial-team" | "doctor",
) {
  if (value === "doctor") return "doctor" as const;
  if (value === "editorial-team") return "editorial-team" as const;
  return fallback;
}

function contentReviewStatus(
  value: string | undefined,
  fallback?:
    | "DRAFT"
    | "EDITORIAL_REVIEW"
    | "MEDICAL_REVIEW"
    | "MEDICALLY_REVIEWED"
    | "PUBLISHED"
    | "NEEDS_REVIEW",
) {
  return [
    "DRAFT",
    "EDITORIAL_REVIEW",
    "MEDICAL_REVIEW",
    "MEDICALLY_REVIEWED",
    "PUBLISHED",
    "NEEDS_REVIEW",
  ].includes(value || "")
    ? (value as NonNullable<typeof fallback>)
    : fallback;
}

function contentSourceType(
  value: string | undefined,
  fallback?: "original" | "legacy" | "youtube" | "mixed",
) {
  return ["original", "legacy", "youtube", "mixed"].includes(value || "")
    ? (value as NonNullable<typeof fallback>)
    : fallback;
}

function firstNumber(record: ApiRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    const numeric = typeof value === "number" ? value : Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "number") return String(item);
        const record = asRecord(item);
        return firstString(record, ["title", "name", "label", "text", "value"]);
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toArticleReferences(value: unknown): NonNullable<Article["references"]> {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string" && /^https?:\/\//i.test(item)) {
      return [{ label: item, href: item }];
    }

    const record = asRecord(item);
    const href = firstString(record, ["href", "url", "sourceUrl", "source_url"]);
    const label = firstString(record, ["label", "title", "name"]);

    return href && label ? [{ label, href }] : [];
  });
}

function toFaqArray(value: unknown) {
  return (Array.isArray(value) ? value : [])
    .map((item) => {
      const record = asRecord(item);
      const question = firstString(record, ["question", "title", "q"]);
      const answer = firstString(record, ["answer", "text", "body", "a"]);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

function toParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        const record = asRecord(item);
        if (Array.isArray(record.children)) {
          return record.children
            .map((child) => firstString(asRecord(child), ["text"]))
            .filter(Boolean)
            .join(" ");
        }
        return firstString(record, ["text", "paragraph", "content", "body"]);
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === "string") {
    return value
      .replace(/<[^>]+>/g, " ")
      .split(/\n{2,}/)
      .map((item) => item.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeImage(value: unknown, fallback: CmsImage): CmsImage {
  const record = asRecord(value);
  const desktopUrl =
    resolveApiAssetUrl(
      firstString(record, [
        "desktopUrl",
        "desktop_url",
        "desktop",
        "url",
        "src",
        "imageUrl",
        "image_url",
        "originalUrl",
        "original_url",
      ]) || (typeof value === "string" ? value : undefined),
    ) || fallback.desktopUrl;
  const mobileUrl =
    resolveApiAssetUrl(
      firstString(record, ["mobileUrl", "mobile_url", "mobile"]),
    ) || fallback.mobileUrl;
  const thumbnailUrl =
    resolveApiAssetUrl(
      firstString(record, [
        "thumbnailUrl",
        "thumbnail_url",
        "thumbnail",
        "thumb",
        "thumbUrl",
        "thumb_url",
        "thumbUrl",
      ]),
    ) || fallback.thumbnailUrl;
  const altText =
    firstString(record, ["altText", "alt_text", "alt", "title"]) ||
    fallback.altText ||
    fallback.alt;
  const caption =
    firstString(record, ["caption", "description", "credit"]) ||
    fallback.caption;
  const focalX = Number(record.focalX ?? record.focal_x ?? record.focal_point_x ?? record.focusX ?? record.focus_x);
  const focalY = Number(record.focalY ?? record.focal_y ?? record.focal_point_y ?? record.focusY ?? record.focus_y);

  return {
    ...fallback,
    id: firstString(record, ["id"]) || fallback.id,
    filename:
      firstString(record, ["filename", "fileName", "file_name", "originalFilename", "original_filename"]) ||
      fallback.filename,
    category:
      firstString(record, ["category"]) ||
      fallback.category,
    role:
      firstString(record, ["role", "usage", "placement"]) ||
      fallback.role,
    src: desktopUrl,
    alt: altText,
    type: firstString(record, ["type", "assetType", "asset_type"]) || fallback.type,
    desktopUrl,
    mobileUrl,
    thumbnailUrl,
    originalUrl:
      resolveApiAssetUrl(firstString(record, ["originalUrl", "original_url"])) ||
      fallback.originalUrl,
    altText,
    caption,
    focalPoint:
      Number.isFinite(focalX) && Number.isFinite(focalY)
        ? { x: focalX, y: focalY }
        : fallback.focalPoint,
    placeholder: desktopUrl === fallback.desktopUrl ? fallback.placeholder : false,
    credit: desktopUrl === fallback.desktopUrl ? fallback.credit : caption,
    lqip:
      firstString(record, ["lqip", "blurDataUrl", "blur_data_url", "blurPlaceholder", "blur_placeholder"]) ||
      fallback.lqip,
    blurDataUrl:
      firstString(record, ["blurDataUrl", "blur_data_url", "blurPlaceholder", "blur_placeholder", "lqip"]) ||
      fallback.blurDataUrl,
    usageLocation:
      firstString(record, ["usageLocation", "usage_location"]) ||
      fallback.usageLocation,
    displayMode:
      firstString(record, ["displayMode", "display_mode", "fit", "objectFit", "object_fit"]) ||
      fallback.displayMode,
    contentHash:
      firstString(record, ["contentHash", "content_hash", "hash", "sha1"]) ||
      fallback.contentHash,
    normalizedBasename:
      firstString(record, ["normalizedBasename", "normalized_basename", "basename"]) ||
      fallback.normalizedBasename,
    photographerSource:
      firstString(record, ["photographerSource", "photographer_source", "source"]) ||
      fallback.photographerSource,
    permissionStatus:
      firstString(record, ["permissionStatus", "permission_status"]) ||
      fallback.permissionStatus,
    sortOrder: firstNumber(record, ["sortOrder", "sort_order"]) ?? fallback.sortOrder,
    featured: firstBoolean(record, ["featured", "is_featured"], fallback.featured),
    publish: firstBoolean(record, ["publish", "is_published"], fallback.publish),
  };
}

function hasImageInput(value: unknown) {
  if (typeof value === "string") return Boolean(value.trim());
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const record = value as ApiRecord;
  return Boolean(
    firstString(record, [
      "desktopUrl",
      "desktop_url",
      "desktop",
      "url",
      "src",
      "imageUrl",
      "image_url",
      "originalUrl",
      "original_url",
    ]),
  );
}

function normalizeOptionalImage(value: unknown, fallback?: CmsImage) {
  if (!hasImageInput(value)) return fallback;
  return normalizeImage(value, fallback || placeholderImages.clinicTexture);
}

function normalizeStat(value: unknown, fallback?: Stat): Stat | null {
  const record = asRecord(value);
  const stat = {
    value: firstString(record, ["value", "number", "stat"]) || fallback?.value,
    label: firstString(record, ["label", "title", "name"]) || fallback?.label,
    description:
      firstString(record, ["description", "text", "caption"]) ||
      fallback?.description,
  };

  return stat.value && stat.label ? (stat as Stat) : fallback || null;
}

function normalizeProofStat(value: unknown, fallback?: ProofStat): ProofStat | null {
  const record = asRecord(value);
  const stat = normalizeStat(value, fallback);

  if (!stat) return fallback || null;

  return {
    ...stat,
    eyebrow: firstString(record, ["eyebrow", "kicker", "prefix"]) || fallback?.eyebrow,
  };
}

function normalizeTreatment(value: unknown, fallback?: Treatment): Treatment | null {
  const record = asRecord(value);
  const slug = firstString(record, ["slug", "url_slug"]) || fallback?.slug;
  const cluster =
    firstString(record, ["cluster", "category_slug", "clusterSlug", "cluster_slug"]) ||
    fallback?.cluster;
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!slug || !cluster || !title) {
    return fallback || null;
  }

  const accent = firstString(record, ["accent", "theme"]) as Treatment["accent"] | undefined;
  const faq = toFaqArray(record.faq ?? record.faqs);

  return {
    slug,
    cluster,
    clusterLabel:
      firstString(record, ["clusterLabel", "cluster_label", "category"]) ||
      clusterLabels[cluster] ||
      fallback?.clusterLabel ||
      "Treatments",
    title,
    eyebrow:
      firstString(record, ["eyebrow", "kicker", "subtitle"]) ||
      fallback?.eyebrow ||
      "Doctor-led protocol",
    summary: firstString(record, ["summary", "excerpt", "short_description"]) || fallback?.summary || "",
    description:
      firstString(record, ["description", "body", "long_description"]) ||
      fallback?.description ||
      firstString(record, ["summary", "excerpt"]) ||
      "",
    duration: firstString(record, ["duration", "typical_duration"]) || fallback?.duration || "Personalized",
    recovery:
      firstString(record, ["recovery", "downtime", "recovery_note"]) ||
      fallback?.recovery ||
      "Discussed during consultation",
    idealFor: hasItems(toStringArray(record.idealFor ?? record.ideal_for))
      ? toStringArray(record.idealFor ?? record.ideal_for)
      : fallback?.idealFor || [],
    highlights: hasItems(toStringArray(record.highlights ?? record.protocol_highlights))
      ? toStringArray(record.highlights ?? record.protocol_highlights)
      : fallback?.highlights || [],
    icon: fallback?.icon || clusterIcons[cluster] || Droplets,
    accent: accent && validAccents.has(accent)
      ? accent
      : fallback?.accent || clusterAccents[cluster] || "aqua",
    image: normalizeImage(
      firstRecord(record, ["heroImage", "hero_image", "image", "featuredImage", "featured_image"]) ||
        firstString(record, ["image_url", "hero_image_url"]),
      fallback?.image || placeholderImages.clinicTexture,
    ),
    seoTitle: firstString(record, ["seoTitle", "seo_title"]) || fallback?.seoTitle,
    seoDescription:
      firstString(record, ["seoDescription", "seo_description", "meta_description"]) ||
      fallback?.seoDescription,
    primaryIntent: firstString(record, ["primaryIntent", "primary_intent"]) || fallback?.primaryIntent,
    primaryLocation: firstString(record, ["primaryLocation", "primary_location"]) || fallback?.primaryLocation,
    h1: firstString(record, ["h1", "pageHeading", "page_heading"]) || fallback?.h1,
    overview: toStringArray(record.overview).length ? toStringArray(record.overview) : fallback?.overview,
    candidateInfo: toStringArray(record.candidateInfo ?? record.candidate_info).length ? toStringArray(record.candidateInfo ?? record.candidate_info) : fallback?.candidateInfo,
    benefits: toStringArray(record.benefits).length ? toStringArray(record.benefits) : fallback?.benefits,
    limitations: toStringArray(record.limitations).length ? toStringArray(record.limitations) : fallback?.limitations,
    procedureSteps: toStringArray(record.procedureSteps ?? record.procedure_steps).length ? toStringArray(record.procedureSteps ?? record.procedure_steps) : fallback?.procedureSteps,
    timeline: toStringArray(record.timeline).length ? toStringArray(record.timeline) : fallback?.timeline,
    risks: toStringArray(record.risks).length ? toStringArray(record.risks) : fallback?.risks,
    aftercare: toStringArray(record.aftercare).length ? toStringArray(record.aftercare) : fallback?.aftercare,
    faq: faq.length ? faq : fallback?.faq,
    relatedConditions: toStringArray(record.relatedConditions ?? record.related_conditions).length ? toStringArray(record.relatedConditions ?? record.related_conditions) : fallback?.relatedConditions,
    relatedTreatments: toStringArray(record.relatedTreatments ?? record.related_treatments).length ? toStringArray(record.relatedTreatments ?? record.related_treatments) : fallback?.relatedTreatments,
    relatedArticles: toStringArray(record.relatedArticles ?? record.related_articles).length ? toStringArray(record.relatedArticles ?? record.related_articles) : fallback?.relatedArticles,
    relatedCases: toStringArray(record.relatedCases ?? record.related_cases).length ? toStringArray(record.relatedCases ?? record.related_cases) : fallback?.relatedCases,
    status: firstString(record, ["status"]) || fallback?.status,
    lastReviewedAt: firstString(record, ["lastReviewedAt", "last_reviewed_at"]) || fallback?.lastReviewedAt,
    reviewedBy: firstString(record, ["reviewedBy", "reviewed_by"]) || fallback?.reviewedBy,
    authorType: contentAuthorType(
      firstString(record, ["authorType", "author_type"]),
      fallback?.authorType,
    ),
    authorId: firstString(record, ["authorId", "author_id"]) || fallback?.authorId,
    reviewerId: firstString(record, ["reviewerId", "reviewer_id"]) || fallback?.reviewerId,
    reviewedAt: firstString(record, ["reviewedAt", "reviewed_at"]) || fallback?.reviewedAt,
    medicalReviewStatus: contentReviewStatus(
      firstString(record, ["medicalReviewStatus", "medical_review_status"]),
      fallback?.medicalReviewStatus,
    ),
    sourceType: contentSourceType(
      firstString(record, ["sourceType", "source_type"]),
      fallback?.sourceType,
    ),
    legacySources: toStringArray(record.legacySources ?? record.legacy_sources).length
      ? toStringArray(record.legacySources ?? record.legacy_sources)
      : fallback?.legacySources,
    youtubeSources: toStringArray(record.youtubeSources ?? record.youtube_sources).length
      ? toStringArray(record.youtubeSources ?? record.youtube_sources)
      : fallback?.youtubeSources,
    references: toStringArray(record.references).length
      ? toStringArray(record.references)
      : fallback?.references,
  };
}

function normalizeCondition(value: unknown, fallback?: Condition): Condition | null {
  const record = asRecord(value);
  const slug = firstString(record, ["slug", "url_slug"]) || fallback?.slug;
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!slug || !title) {
    return fallback || null;
  }

  const faq = toFaqArray(record.faq ?? record.faqs);

  return {
    slug,
    title,
    summary: firstString(record, ["summary", "excerpt", "description"]) || fallback?.summary || "",
    signs: hasItems(toStringArray(record.signs ?? record.common_signs))
      ? toStringArray(record.signs ?? record.common_signs)
      : fallback?.signs || [],
    relatedTreatments: hasItems(toStringArray(record.relatedTreatments ?? record.related_treatments))
      ? toStringArray(record.relatedTreatments ?? record.related_treatments)
      : fallback?.relatedTreatments || [],
    image: normalizeImage(
      firstRecord(record, ["heroImage", "hero_image", "image", "featuredImage", "featured_image"]) ||
        firstString(record, ["image_url", "hero_image_url"]),
      fallback?.image || placeholderImages.treatmentRoom,
    ),
    seoTitle: firstString(record, ["seoTitle", "seo_title"]) || fallback?.seoTitle,
    seoDescription:
      firstString(record, ["seoDescription", "seo_description", "meta_description"]) ||
      fallback?.seoDescription,
    primaryIntent: firstString(record, ["primaryIntent", "primary_intent"]) || fallback?.primaryIntent,
    h1: firstString(record, ["h1", "pageHeading", "page_heading"]) || fallback?.h1,
    overview: toStringArray(record.overview).length ? toStringArray(record.overview) : fallback?.overview,
    commonCauses: toStringArray(record.commonCauses ?? record.common_causes).length ? toStringArray(record.commonCauses ?? record.common_causes) : fallback?.commonCauses,
    commonTypes: toStringArray(record.commonTypes ?? record.common_types).length ? toStringArray(record.commonTypes ?? record.common_types) : fallback?.commonTypes,
    assessment: toStringArray(record.assessment).length ? toStringArray(record.assessment) : fallback?.assessment,
    limitations: toStringArray(record.limitations).length ? toStringArray(record.limitations) : fallback?.limitations,
    faq: faq.length ? faq : fallback?.faq,
    relatedConditions: toStringArray(record.relatedConditions ?? record.related_conditions).length ? toStringArray(record.relatedConditions ?? record.related_conditions) : fallback?.relatedConditions,
    relatedArticles: toStringArray(record.relatedArticles ?? record.related_articles).length ? toStringArray(record.relatedArticles ?? record.related_articles) : fallback?.relatedArticles,
    relatedCases: toStringArray(record.relatedCases ?? record.related_cases).length ? toStringArray(record.relatedCases ?? record.related_cases) : fallback?.relatedCases,
    status: firstString(record, ["status"]) || fallback?.status,
    lastReviewedAt: firstString(record, ["lastReviewedAt", "last_reviewed_at"]) || fallback?.lastReviewedAt,
    reviewedBy: firstString(record, ["reviewedBy", "reviewed_by"]) || fallback?.reviewedBy,
    authorType: contentAuthorType(
      firstString(record, ["authorType", "author_type"]),
      fallback?.authorType,
    ),
    authorId: firstString(record, ["authorId", "author_id"]) || fallback?.authorId,
    reviewerId: firstString(record, ["reviewerId", "reviewer_id"]) || fallback?.reviewerId,
    reviewedAt: firstString(record, ["reviewedAt", "reviewed_at"]) || fallback?.reviewedAt,
    medicalReviewStatus: contentReviewStatus(
      firstString(record, ["medicalReviewStatus", "medical_review_status"]),
      fallback?.medicalReviewStatus,
    ),
    sourceType: contentSourceType(
      firstString(record, ["sourceType", "source_type"]),
      fallback?.sourceType,
    ),
    legacySources: toStringArray(record.legacySources ?? record.legacy_sources).length
      ? toStringArray(record.legacySources ?? record.legacy_sources)
      : fallback?.legacySources,
    youtubeSources: toStringArray(record.youtubeSources ?? record.youtube_sources).length
      ? toStringArray(record.youtubeSources ?? record.youtube_sources)
      : fallback?.youtubeSources,
    references: toStringArray(record.references).length
      ? toStringArray(record.references)
      : fallback?.references,
  };
}

function normalizeArticle(value: unknown, fallback?: Article): Article | null {
  const record = asRecord(value);
  const slug = firstString(record, ["slug", "url_slug"]) || fallback?.slug;
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!slug || !title) {
    return fallback || null;
  }

  const body = toParagraphs(record.body ?? record.content ?? record.article_body);

  return {
    slug,
    title,
    category: firstString(record, ["category", "category_name"]) || fallback?.category || "Clinic Guidance",
    readTime: firstString(record, ["readTime", "read_time"]) || fallback?.readTime || "4 min read",
    excerpt: firstString(record, ["excerpt", "summary", "description"]) || fallback?.excerpt || "",
    body: hasItems(body) ? body : fallback?.body || [],
    content: fallback?.content,
    image: normalizeImage(
      firstRecord(record, ["featuredImage", "featured_image", "image", "heroImage", "hero_image"]) ||
        firstString(record, ["image_url", "featured_image_url"]),
      fallback?.image || placeholderImages.knowledge,
    ),
    seoTitle: firstString(record, ["seoTitle", "seo_title"]) || fallback?.seoTitle,
    seoDescription:
      firstString(record, ["seoDescription", "seo_description", "meta_description"]) ||
      fallback?.seoDescription,
    authorName:
      firstString(record, ["authorName", "author_name", "author"]) ||
      fallback?.authorName,
    publishedAt:
      firstString(record, ["publishedAt", "published_at", "datePublished"]) ||
      fallback?.publishedAt,
    updatedAt:
      firstString(record, ["updatedAt", "updated_at", "dateModified"]) ||
      fallback?.updatedAt,
    reviewedAt:
      firstString(record, ["reviewedAt", "reviewed_at"]) ||
      fallback?.reviewedAt,
    reviewedBy:
      firstString(record, ["reviewedBy", "reviewed_by", "medicalReviewer"]) ||
      fallback?.reviewedBy,
    authorType: contentAuthorType(
      firstString(record, ["authorType", "author_type"]),
      fallback?.authorType || "editorial-team",
    ),
    authorId: firstString(record, ["authorId", "author_id"]) || fallback?.authorId,
    reviewerId: firstString(record, ["reviewerId", "reviewer_id"]) || fallback?.reviewerId,
    medicalReviewStatus: contentReviewStatus(
      firstString(record, ["medicalReviewStatus", "medical_review_status"]),
      fallback?.medicalReviewStatus || "MEDICALLY_REVIEWED",
    ),
    sourceType: contentSourceType(
      firstString(record, ["sourceType", "source_type"]),
      fallback?.sourceType || "original",
    ),
    legacySources: toStringArray(record.legacySources ?? record.legacy_sources).length
      ? toStringArray(record.legacySources ?? record.legacy_sources)
      : fallback?.legacySources,
    youtubeSources: toStringArray(record.youtubeSources ?? record.youtube_sources).length
      ? toStringArray(record.youtubeSources ?? record.youtube_sources)
      : fallback?.youtubeSources,
    references: toArticleReferences(record.references).length
      ? toArticleReferences(record.references)
      : fallback?.references,
    relatedTreatments: toStringArray(record.relatedTreatments ?? record.related_treatments).length ? toStringArray(record.relatedTreatments ?? record.related_treatments) : fallback?.relatedTreatments,
    relatedConditions: toStringArray(record.relatedConditions ?? record.related_conditions).length ? toStringArray(record.relatedConditions ?? record.related_conditions) : fallback?.relatedConditions,
    relatedArticles: toStringArray(record.relatedArticles ?? record.related_articles).length ? toStringArray(record.relatedArticles ?? record.related_articles) : fallback?.relatedArticles,
  };
}

function normalizeTestimonial(value: unknown, fallback?: Testimonial): Testimonial | null {
  const record = asRecord(value);
  const quote = firstString(record, ["quote", "text", "content"]) || fallback?.quote;

  if (!quote) {
    return fallback || null;
  }

  return {
    name:
      firstString(record, ["name", "patientName", "patient_name", "display_name"]) ||
      fallback?.name ||
      "Patient, Bhubaneswar",
    context: firstString(record, ["context", "treatment", "label"]) || fallback?.context || "Clinic experience",
    quote,
  };
}

function normalizeBeforeAfterCase(
  value: unknown,
  fallback?: BeforeAfterCase,
): BeforeAfterCase | null {
  const record = asRecord(value);
  const slug = firstString(record, ["slug", "url_slug"]) || fallback?.slug;
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!slug || !title) {
    return fallback || null;
  }

  const frontBeforeInput =
    firstRecord(record, [
      "frontBeforeImage",
      "front_before_image",
      "beforeImage",
      "before_image",
    ]) ||
    firstString(record, [
      "front_before_image_url",
      "frontBeforeUrl",
      "front_before_url",
      "before_image_url",
      "beforeUrl",
      "before_url",
    ]);
  const frontAfterInput =
    firstRecord(record, [
      "frontAfterImage",
      "front_after_image",
      "afterImage",
      "after_image",
    ]) ||
    firstString(record, [
      "front_after_image_url",
      "frontAfterUrl",
      "front_after_url",
      "after_image_url",
      "afterUrl",
      "after_url",
    ]);
  const angle2BeforeInput =
    firstRecord(record, [
      "angle2BeforeImage",
      "angle2_before_image",
      "secondBeforeImage",
      "second_before_image",
    ]) ||
    firstString(record, [
      "angle2_before_image_url",
      "angle2BeforeUrl",
      "second_before_image_url",
    ]);
  const angle2AfterInput =
    firstRecord(record, [
      "angle2AfterImage",
      "angle2_after_image",
      "secondAfterImage",
      "second_after_image",
    ]) ||
    firstString(record, [
      "angle2_after_image_url",
      "angle2AfterUrl",
      "second_after_image_url",
    ]);
  const frontBeforeImage = normalizeOptionalImage(
    frontBeforeInput,
    fallback?.frontBeforeImage || fallback?.beforeImage,
  );
  const frontAfterImage = normalizeOptionalImage(
    frontAfterInput,
    fallback?.frontAfterImage || fallback?.afterImage,
  );
  const angle2BeforeImage = normalizeOptionalImage(
    angle2BeforeInput,
    fallback?.angle2BeforeImage,
  );
  const angle2AfterImage = normalizeOptionalImage(
    angle2AfterInput,
    fallback?.angle2AfterImage,
  );
  const comparisonViewsFromApi = firstArray(record, [
    "comparisonViews",
    "comparison_views",
    "views",
  ])
    ?.map((item, index) => {
      const viewRecord = asRecord(item);
      const beforeInput =
        firstRecord(viewRecord, ["before", "beforeImage", "before_image"]) ||
        firstString(viewRecord, ["before_url", "beforeUrl"]);
      const afterInput =
        firstRecord(viewRecord, ["after", "afterImage", "after_image"]) ||
        firstString(viewRecord, ["after_url", "afterUrl"]);
      const before = normalizeOptionalImage(
        beforeInput,
        fallback?.comparisonViews?.[index]?.before,
      );
      const after = normalizeOptionalImage(
        afterInput,
        fallback?.comparisonViews?.[index]?.after,
      );

      if (!before || !after) return null;

      return {
        label:
          firstString(viewRecord, ["label", "title", "view"]) ||
          fallback?.comparisonViews?.[index]?.label ||
          (index === 0 ? "Front View" : "Second View"),
        before,
        after,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const comparisonViews =
    hasItems(comparisonViewsFromApi)
      ? comparisonViewsFromApi
      : [
          frontBeforeImage && frontAfterImage
            ? {
                label: firstString(record, ["primaryViewLabel", "primary_view_label"]) || "Front View",
                before: frontBeforeImage,
                after: frontAfterImage,
              }
            : null,
          angle2BeforeImage && angle2AfterImage
            ? {
                label: firstString(record, ["secondaryViewLabel", "secondary_view_label"]) || "Second View",
                before: angle2BeforeImage,
                after: angle2AfterImage,
              }
            : null,
        ].filter((item): item is NonNullable<typeof item> => Boolean(item));
  const extraImages = firstArray(record, ["extraImages", "extra_images", "additionalImages", "additional_images"])
    ?.map((item, index) => {
      const extraRecord = asRecord(item);
      const imageValue =
        firstRecord(extraRecord, ["image", "media", "asset"]) ||
        firstString(extraRecord, ["image_url", "url", "src"]);
      const fallbackExtra = fallback?.extraImages?.[index];

      if (!imageValue && !fallbackExtra) return null;

      return {
        role:
          firstString(extraRecord, ["role", "type", "label"]) ||
          fallbackExtra?.role ||
          `additional-${index + 1}`,
        label:
          firstString(extraRecord, ["label", "title", "role"]) ||
          fallbackExtra?.label ||
          `Additional ${index + 1}`,
        image:
          normalizeOptionalImage(
            imageValue,
            fallbackExtra?.image || frontBeforeImage || frontAfterImage,
          ) || placeholderImages.clinicTexture,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    slug,
    title,
    caseId: firstString(record, ["caseId", "case_id"]) || fallback?.caseId,
    treatmentCategory:
      firstString(record, ["treatmentCategory", "treatment_category", "categorySlug", "category_slug"]) ||
      fallback?.treatmentCategory,
    patientLabel:
      firstString(record, ["patientLabel", "patient_label", "patientInitials", "patient_initials"]) ||
      fallback?.patientLabel,
    treatment:
      firstString(record, ["treatment", "treatment_title", "category"]) ||
      fallback?.treatment ||
      "Treatment review",
    timeGap: firstString(record, ["timeGap", "time_gap"]) || fallback?.timeGap,
    note:
      firstString(record, ["note", "contextNote", "context_note", "description"]) ||
      fallback?.note ||
      "Case documentation is shown only with appropriate consent and context.",
    resultSummary:
      firstString(record, ["resultSummary", "result_summary", "summary"]) ||
      fallback?.resultSummary,
    disclaimer:
      firstString(record, ["disclaimer", "safety_note"]) ||
      fallback?.disclaimer,
    featured: firstBoolean(record, ["featured", "is_featured"], fallback?.featured),
    patientConsentConfirmed: firstBoolean(
      record,
      ["patientConsentConfirmed", "patient_consent_confirmed", "consentConfirmed", "consent_confirmed"],
      fallback?.patientConsentConfirmed,
    ),
    faceBlurRequired: firstBoolean(
      record,
      ["faceBlurRequired", "face_blur_required"],
      fallback?.faceBlurRequired,
    ),
    frontBeforeImage,
    frontAfterImage,
    angle2BeforeImage,
    angle2AfterImage,
    comparisonViews: hasItems(comparisonViews)
      ? comparisonViews
      : fallback?.comparisonViews,
    additionalViews: fallback?.additionalViews,
    beforeImage: frontBeforeImage,
    afterImage: frontAfterImage,
    extraImages: hasItems(extraImages) ? extraImages : fallback?.extraImages,
  };
}

function normalizeGalleryImage(value: unknown, fallback?: GalleryImage): GalleryImage | null {
  const record = asRecord(value);
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!title) {
    return fallback || null;
  }

  const image = normalizeImage(
    firstRecord(record, ["image", "media", "asset"]) ||
      firstString(record, ["image_url", "url", "src"]),
    fallback?.image || placeholderImages.clinicAmbience,
  );

  return {
    title,
    category: firstString(record, ["category", "type"]) || fallback?.category || "Clinic",
    caption: firstString(record, ["caption", "description"]) || fallback?.caption || image.caption || "",
    image,
    usageLocation:
      firstString(record, ["usageLocation", "usage_location", "placement"]) ||
      fallback?.usageLocation,
    sortOrder: firstNumber(record, ["sortOrder", "sort_order"]) ?? fallback?.sortOrder,
  };
}

function normalizeRecognitionItem(
  value: unknown,
  fallback?: RecognitionItem,
): RecognitionItem | null {
  const record = asRecord(value);
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!title) {
    return fallback || null;
  }

  const imageValue =
    firstRecord(record, ["image", "media", "asset"]) ||
    firstString(record, ["image_url", "url", "src"]);
  const badgeValue =
    firstRecord(record, ["badge", "badgeImage", "badge_image", "logo"]) ||
    firstString(record, ["badge_url", "badgeImageUrl", "badge_image_url"]);

  return {
    title,
    type:
      firstString(record, ["type", "recognitionType", "recognition_type"]) ||
      fallback?.type ||
      "award",
    description:
      firstString(record, ["description", "caption", "short_description"]) ||
      fallback?.description,
    image: imageValue
      ? normalizeImage(imageValue, fallback?.image || placeholderImages.clinicTexture)
      : fallback?.image,
    badge: badgeValue
      ? normalizeImage(badgeValue, fallback?.badge || fallback?.image || placeholderImages.clinicTexture)
      : fallback?.badge,
    sourceLink:
      firstString(record, ["sourceLink", "source_link", "sourceUrl", "source_url"]) ||
      fallback?.sourceLink,
    sortOrder: firstNumber(record, ["sortOrder", "sort_order"]) ?? fallback?.sortOrder,
    displayMode:
      firstString(record, ["displayMode", "display_mode"]) ||
      fallback?.displayMode,
  };
}

function dedupeRecognitionItems(items: RecognitionItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const image = item.image || item.badge;
    const proofText = `${item.title} ${item.type} ${item.description || ""} ${image?.altText || ""} ${image?.src || ""}`;
    const title = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const keys = [
      image?.id && `id:${image.id}`,
      image?.contentHash && `hash:${image.contentHash}`,
      image?.normalizedBasename && `base:${image.normalizedBasename}`,
      image?.desktopUrl && `desktop:${image.desktopUrl}`,
      image?.thumbnailUrl && `thumb:${image.thumbnailUrl}`,
      title && `title:${title}-${item.type}`,
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

function normalizeVideoItem(value: unknown, fallback?: VideoItem): VideoItem | null {
  const record = asRecord(value);
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!title) {
    return fallback || null;
  }

  return {
    title,
    label: firstString(record, ["label", "category", "kicker"]) || fallback?.label || "Our Videos",
    description:
      firstString(record, ["description", "summary", "caption"]) ||
      fallback?.description ||
      "",
    youtubeId:
      firstString(record, ["youtubeId", "youtube_id", "videoId", "video_id"]) ||
      fallback?.youtubeId,
    href:
      firstString(record, ["href", "url", "youtubeUrl", "youtube_url"]) ||
      fallback?.href,
    thumbnail: normalizeImage(
      firstRecord(record, ["thumbnail", "image", "poster"]) ||
        firstString(record, ["thumbnail_url", "image_url"]),
      fallback?.thumbnail || placeholderImages.knowledge,
    ),
  };
}

function normalizeReview(value: unknown, fallback?: Review): Review | null {
  const record = asRecord(value);
  const slug = firstString(record, ["slug", "url_slug"]) || fallback?.slug;
  const reviewText =
    firstString(record, ["reviewText", "review_text", "text", "quote", "content"]) ||
    fallback?.reviewText;

  if (!slug || !reviewText) {
    return fallback || null;
  }

  const ratingValue = Number(record.rating ?? fallback?.rating ?? 5);

  return {
    slug,
    reviewerName:
      firstString(record, ["reviewerName", "reviewer_name", "name", "display_name"]) ||
      fallback?.reviewerName ||
      "Verified patient",
    reviewerInitials:
      firstString(record, ["reviewerInitials", "reviewer_initials", "initials"]) ||
      fallback?.reviewerInitials,
    reviewText,
    rating: Number.isFinite(ratingValue) ? Math.min(5, Math.max(1, ratingValue)) : 5,
    source:
      firstString(record, ["source", "platform"]) ||
      fallback?.source,
    sourceUrl:
      firstString(record, ["sourceUrl", "source_url", "url"]) ||
      fallback?.sourceUrl,
    treatmentCategory:
      firstString(record, ["treatmentCategory", "treatment_category", "category"]) ||
      fallback?.treatmentCategory ||
      "general",
    reviewedAt:
      firstString(record, ["reviewedAt", "reviewed_at", "date", "created_at"]) ||
      fallback?.reviewedAt,
    permissionConfirmed:
      typeof record.permissionConfirmed === "boolean"
        ? record.permissionConfirmed
        : typeof record.permission_confirmed === "boolean"
          ? record.permission_confirmed
          : fallback?.permissionConfirmed,
    featured:
      typeof record.featured === "boolean"
        ? record.featured
        : typeof record.is_featured === "boolean"
          ? record.is_featured
          : fallback?.featured,
    screenshot: firstRecord(record, ["screenshot", "image"])
      ? normalizeImage(firstRecord(record, ["screenshot", "image"]), fallback?.screenshot || placeholderImages.knowledge)
      : fallback?.screenshot,
  };
}

function normalizeMediaRequirement(
  value: unknown,
  fallback?: MediaRequirement,
): MediaRequirement | null {
  const record = asRecord(value);
  const requestKey =
    firstString(record, ["requestKey", "request_key", "key", "slug"]) ||
    fallback?.requestKey;
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!requestKey || !title) {
    return fallback || null;
  }

  return {
    groupKey:
      firstString(record, ["groupKey", "group_key"]) ||
      fallback?.groupKey ||
      "media",
    groupLabel:
      firstString(record, ["groupLabel", "group_label", "group"]) ||
      fallback?.groupLabel ||
      "Media",
    requestKey,
    title,
    description:
      firstString(record, ["description", "text"]) ||
      fallback?.description,
    idealDimension:
      firstString(record, ["idealDimension", "ideal_dimension", "ideal"]) ||
      fallback?.idealDimension ||
      "2400x1400",
    minimumDimension:
      firstString(record, ["minimumDimension", "minimum_dimension", "minimum"]) ||
      fallback?.minimumDimension ||
      "1200x800",
    orientation:
      firstString(record, ["orientation"]) ||
      fallback?.orientation ||
      "Landscape",
    usageLocation:
      firstString(record, ["usageLocation", "usage_location", "whereUsed", "where_used"]) ||
      fallback?.usageLocation ||
      "Website",
    mediaType:
      firstString(record, ["mediaType", "media_type", "type"]) ||
      fallback?.mediaType ||
      "image",
    status:
      firstString(record, ["status"]) ||
      fallback?.status ||
      "missing",
    notes:
      firstString(record, ["notes", "note"]) ||
      fallback?.notes,
    image: firstRecord(record, ["image", "media", "asset"])
      ? normalizeImage(firstRecord(record, ["image", "media", "asset"]), fallback?.image || placeholderImages.clinicTexture)
      : fallback?.image,
  };
}

function normalizeMediaLogo(value: unknown, fallback?: MediaLogo): MediaLogo | null {
  const record = asRecord(value);
  const title = firstString(record, ["title", "name"]) || fallback?.title;

  if (!title) {
    return fallback || null;
  }

  return {
    title,
    label: firstString(record, ["label", "description"]) || fallback?.label,
    image: firstRecord(record, ["image", "logo"])
      ? normalizeImage(firstRecord(record, ["image", "logo"]), fallback?.image || placeholderImages.clinicTexture)
      : fallback?.image,
  };
}

function normalizeSocialLink(value: unknown, fallback?: SocialLink): SocialLink | null {
  const record = asRecord(value);
  const platform =
    firstString(record, ["platform", "type", "name"]) ||
    fallback?.platform;
  const url =
    firstString(record, ["url", "href", "link", "profileUrl", "profile_url"]) ||
    fallback?.url;

  if (!platform || !url) {
    return fallback || null;
  }

  return {
    platform,
    label:
      firstString(record, ["label", "title", "name"]) ||
      fallback?.label ||
      platform,
    handle:
      firstString(record, ["handle", "username"]) ||
      fallback?.handle,
    url,
    ctaLabel:
      firstString(record, ["ctaLabel", "cta_label", "buttonLabel", "button_label"]) ||
      fallback?.ctaLabel ||
      "Open",
    image: firstRecord(record, ["image", "media", "asset"])
      ? normalizeImage(firstRecord(record, ["image", "media", "asset"]), fallback?.image || placeholderImages.clinicTexture)
      : fallback?.image,
    sortOrder: firstNumber(record, ["sortOrder", "sort_order"]) ?? fallback?.sortOrder,
  };
}

function normalizeSocialStat(value: unknown, fallback?: SocialStat): SocialStat | null {
  const record = asRecord(value);
  const platform = firstString(record, ["platform", "type"]) || fallback?.platform;
  const label = firstString(record, ["label", "metricLabel", "metric_label", "title"]) || fallback?.label;

  if (!platform || !label) {
    return fallback || null;
  }

  return {
    platform,
    label,
    value:
      firstString(record, ["value", "metricValue", "metric_value", "count"]) ||
      fallback?.value,
    sourceNote:
      firstString(record, ["sourceNote", "source_note", "note"]) ||
      fallback?.sourceNote,
  };
}

function normalizeReviewSummary(value: unknown): ReviewSummary {
  const record = asRecord(value);
  return {
    googleRating:
      firstString(record, ["googleRating", "google_rating", "rating"]) ||
      fallbackData.reviewSummary.googleRating,
    googleReviewCount:
      firstString(record, ["googleReviewCount", "google_review_count", "reviewCount", "review_count"]) ||
      fallbackData.reviewSummary.googleReviewCount,
    googleMapsUrl:
      firstString(record, ["googleMapsUrl", "google_maps_url", "mapsUrl", "maps_url", "url"]) ||
      fallbackData.reviewSummary.googleMapsUrl,
    featuredReviewExcerpts: hasItems(
      toStringArray(record.featuredReviewExcerpts ?? record.featured_review_excerpts),
    )
      ? toStringArray(record.featuredReviewExcerpts ?? record.featured_review_excerpts)
      : fallbackData.reviewSummary.featuredReviewExcerpts,
  };
}

function normalizeAssistantSettings(value: unknown): AssistantSettings {
  const record = asRecord(value);
  const settingsRecord = firstRecord(record, ["settings", "assistant", "assistantSettings", "assistant_settings"]) || record;
  const prompts =
    toStringArray(settingsRecord.quickPrompts ?? settingsRecord.quick_prompts ?? record.quickPrompts ?? record.quick_prompts);

  return {
    title:
      firstString(settingsRecord, ["title", "name"]) ||
      fallbackData.assistantSettings.title,
    intro:
      firstString(settingsRecord, ["intro", "description", "welcome_message"]) ||
      fallbackData.assistantSettings.intro,
    disclaimer:
      firstString(settingsRecord, ["disclaimer", "safety_note"]) ||
      fallbackData.assistantSettings.disclaimer,
    quickPrompts: hasItems(prompts)
      ? prompts
      : fallbackData.assistantSettings.quickPrompts,
  };
}

function normalizeHomepage(value: unknown): HomepageContent {
  const record = asRecord(value);
  const fallback = fallbackData.homepage;
  const stats = firstArray(record, ["stats", "hero_stats"]);
  const proofStats = firstArray(record, ["proofStats", "proof_stats"]);
  const whyChoose = firstArray(record, ["whyChoose", "why_choose"]);
  const journey = firstArray(record, ["journey", "patient_journey"]);
  const faqs = firstArray(record, ["faqs", "faq"]);
  const heroImages = firstArray(record, ["heroImages", "hero_images", "hero_media"]);

  return applyVerifiedClinicFacts({
    heroEyebrow:
      firstString(record, ["heroEyebrow", "hero_eyebrow", "eyebrow"]) ||
      fallback.heroEyebrow,
    heroTitle:
      firstString(record, ["heroTitle", "hero_title", "title"]) ||
      fallback.heroTitle,
    heroSubtitle:
      firstString(record, ["heroSubtitle", "hero_subtitle", "subtitle"]) ||
      fallback.heroSubtitle,
    primaryCta: normalizeCta(firstRecord(record, ["primaryCta", "primary_cta"]), fallback.primaryCta),
    secondaryCta: normalizeCta(firstRecord(record, ["secondaryCta", "secondary_cta"]), fallback.secondaryCta),
    assistantTeaser: {
      label:
        firstString(firstRecord(record, ["assistantTeaser", "assistant_teaser"]) || {}, ["label", "title"]) ||
        fallback.assistantTeaser.label,
      text:
        firstString(firstRecord(record, ["assistantTeaser", "assistant_teaser"]) || {}, ["text", "description"]) ||
        fallback.assistantTeaser.text,
    },
    heroImages: hasItems(heroImages)
      ? heroImages
          .map((item, index) => normalizeImage(item, fallback.heroImages[index] || fallback.heroImages[0]))
          .filter(Boolean)
      : fallback.heroImages,
    stats: hasItems(stats)
      ? stats
          .map((item, index) => normalizeStat(item, fallback.stats[index]))
          .filter((item): item is Stat => Boolean(item))
      : fallback.stats,
    proofStats: hasItems(proofStats)
      ? proofStats
          .map((item, index) => normalizeProofStat(item, fallback.proofStats[index]))
          .filter((item): item is ProofStat => Boolean(item))
      : fallback.proofStats,
    whyChoose: hasItems(whyChoose)
      ? whyChoose.map((item, index) => {
          const recordItem = asRecord(item);
          return {
            title:
              firstString(recordItem, ["title", "heading"]) ||
              fallback.whyChoose[index]?.title ||
              "Personalized care",
            text:
              firstString(recordItem, ["text", "description", "body"]) ||
              fallback.whyChoose[index]?.text ||
              "",
          };
        })
      : fallback.whyChoose,
    journey: hasItems(journey)
      ? journey.map((item, index) => {
          const recordItem = asRecord(item);
          return {
            title:
              firstString(recordItem, ["title", "heading"]) ||
              fallback.journey[index]?.title ||
              "Consultation",
            text:
              firstString(recordItem, ["text", "description", "body"]) ||
              fallback.journey[index]?.text ||
              "",
            icon: fallback.journey[index]?.icon || fallback.journey[0].icon,
          };
        })
      : fallback.journey,
    faqs: hasItems(faqs)
      ? faqs.map((item, index) => {
          const recordItem = asRecord(item);
          return {
            question:
              firstString(recordItem, ["question", "title"]) ||
              fallback.faqs[index]?.question ||
              "Question",
            answer:
              firstString(recordItem, ["answer", "text", "body"]) ||
              fallback.faqs[index]?.answer ||
              "",
          };
        })
      : fallback.faqs,
  });
}

function normalizeCta(
  value: ApiRecord | undefined,
  fallback: { label: string; href: string },
) {
  return {
    label: firstString(value || {}, ["label", "title", "text"]) || fallback.label,
    href: firstString(value || {}, ["href", "url", "link"]) || fallback.href,
  };
}

export async function getClinicSettings(): Promise<ClinicSettings> {
  const settings = await fetchPublicSingle<ApiRecord>(publicApiPaths.siteSettings);

  if (!settings) {
    return fallbackData.siteSettings;
  }

  return {
    ...fallbackData.siteSettings,
    name: fallbackData.siteSettings.name,
    legalName: fallbackData.siteSettings.legalName,
    city: fallbackData.siteSettings.city,
    region: fallbackData.siteSettings.region,
    address: fallbackData.siteSettings.address,
    phone: fallbackData.siteSettings.phone,
    secondaryPhone: fallbackData.siteSettings.secondaryPhone,
    landline: fallbackData.siteSettings.landline,
    whatsapp: fallbackData.siteSettings.whatsapp,
    email: fallbackData.siteSettings.email,
    doctor: fallbackData.siteSettings.doctor,
    tagline: firstString(settings, ["tagline", "description"]) || fallbackData.siteSettings.tagline,
    hours: "",
    bookingUrl: firstString(settings, ["bookingUrl", "booking_url"]),
    callbackLabel: firstString(settings, ["callbackLabel", "callback_label"]),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const homepage = await fetchPublicSingle<ApiRecord>(publicApiPaths.homepage);
  return homepage
    ? normalizeHomepage(homepage)
    : applyVerifiedClinicFacts(fallbackData.homepage);
}

export async function getHeroImages(): Promise<CmsImage[]> {
  const homepage = await getHomepageContent();
  return mergeHeroImages(homepage.heroImages);
}

export async function getDoctorProfile(): Promise<DoctorProfile> {
  const settings = await getClinicSettings();
  return {
    ...fallbackData.doctorProfile,
    name: settings.doctor || fallbackData.doctorProfile.name,
  };
}

export async function getTreatments(): Promise<Treatment[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.treatments);
  const normalized =
    items
      ?.map((item) =>
        normalizeTreatment(
          item,
          fallbackData.treatments.find((fallback) => fallback.slug === firstString(item, ["slug", "url_slug"])),
        ),
      )
      .filter((item): item is Treatment => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.treatments;
}

export async function getTreatment(
  cluster: string,
  slug: string,
): Promise<Treatment | null> {
  const fallback = fallbackData.treatments.find(
    (treatment) => treatment.cluster === cluster && treatment.slug === slug,
  );
  const item = await fetchPublicSingle<ApiRecord>(
    publicApiPaths.treatment(cluster, slug),
  );

  return normalizeTreatment(item || {}, fallback);
}

export async function getTreatmentStaticParams() {
  const treatments = await getTreatments();
  return uniqueParams(
    treatments.map((treatment) => ({
      cluster: treatment.cluster,
      slug: treatment.slug,
    })),
    ["cluster", "slug"],
  );
}

export async function getConditions(): Promise<Condition[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.conditions);
  const normalized =
    items
      ?.map((item) =>
        normalizeCondition(
          item,
          fallbackData.conditions.find((fallback) => fallback.slug === firstString(item, ["slug", "url_slug"])),
        ),
      )
      .filter((item): item is Condition => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.conditions;
}

export async function getCondition(slug: string): Promise<Condition | null> {
  const fallback = fallbackData.conditions.find((condition) => condition.slug === slug);
  const item = await fetchPublicSingle<ApiRecord>(publicApiPaths.condition(slug));

  return normalizeCondition(item || {}, fallback);
}

export async function getConditionStaticParams() {
  const conditions = await getConditions();
  return uniqueParams(
    conditions.map((condition) => ({ slug: condition.slug })),
    ["slug"],
  );
}

export async function getArticles(): Promise<Article[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.articles);
  const normalized =
    items
      ?.map((item) =>
        normalizeArticle(
          item,
          fallbackData.articles.find((fallback) => fallback.slug === firstString(item, ["slug", "url_slug"])),
        ),
      )
      .filter((item): item is Article => Boolean(item)) || [];

  const articles = hasItems(normalized)
    ? [
        ...normalized,
        ...fallbackData.articles.filter(
          (fallback) => !normalized.some((article) => article.slug === fallback.slug),
        ),
      ]
    : fallbackData.articles;

  return articles.filter((article) =>
    isIndexableRoute(`/knowledge/${article.slug}`),
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  const fallback = fallbackData.articles.find((article) => article.slug === slug);
  const item = await fetchPublicSingle<ApiRecord>(publicApiPaths.article(slug));

  return normalizeArticle(item || {}, fallback);
}

export async function getArticleStaticParams() {
  const articles = await getArticles();
  return uniqueParams(
    articles.map((article) => ({ slug: article.slug })),
    ["slug"],
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.testimonials);
  const normalized =
    items
      ?.map((item, index) => normalizeTestimonial(item, fallbackData.testimonials[index]))
      .filter((item): item is Testimonial => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.testimonials;
}

export async function getReviews(category?: string): Promise<Review[]> {
  const path = category
    ? publicApiPaths.reviewsByCategory(category)
    : publicApiPaths.reviews;
  const items = await fetchPublicCollection<ApiRecord>(path);
  const fallbackReviews = category
    ? fallbackData.reviews.filter((review) => review.treatmentCategory === category)
    : fallbackData.reviews;
  const normalized =
    items
      ?.map((item) =>
        normalizeReview(
          item,
          fallbackReviews.find((fallback) => fallback.slug === firstString(item, ["slug", "url_slug"])),
        ),
      )
      .filter((item): item is Review => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackReviews;
}

export async function getReview(slug: string): Promise<Review | null> {
  const fallback = fallbackData.reviews.find((review) => review.slug === slug);
  const item = await fetchPublicSingle<ApiRecord>(publicApiPaths.reviewDetail(slug));

  return normalizeReview(item || {}, fallback);
}

export async function getReviewStaticParams() {
  const reviews = await getReviews();
  return uniqueParams(
    [
      ...reviewCategories
        .filter((category) =>
          reviews.some(
            (review) => review.treatmentCategory === category.slug,
          ),
        )
        .map((category) => ({ slug: category.slug })),
      ...reviews.map((review) => ({ slug: review.slug })),
    ],
    ["slug"],
  );
}

export async function getBeforeAfterCases(): Promise<BeforeAfterCase[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.beforeAfter);
  const normalized =
    items
      ?.map((item) =>
        normalizeBeforeAfterCase(
          item,
          fallbackData.beforeAfterCases.find((fallback) => fallback.slug === firstString(item, ["slug", "url_slug"])),
        ),
      )
      .filter((item): item is BeforeAfterCase => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.beforeAfterCases;
}

export async function getMediaRequirements(): Promise<MediaRequirement[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.mediaRequirements);
  const normalized =
    items
      ?.map((item) =>
        normalizeMediaRequirement(
          item,
          fallbackData.mediaRequirements.find(
            (fallback) => fallback.requestKey === firstString(item, ["requestKey", "request_key", "key"]),
          ),
        ),
      )
      .filter((item): item is MediaRequirement => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.mediaRequirements;
}

export async function getProofStats(): Promise<ProofStat[]> {
  const homepage = await fetchPublicSingle<ApiRecord>(publicApiPaths.homepage);
  const homepageStats = firstArray(asRecord(homepage), ["proofStats", "proof_stats"]);

  if (hasItems(homepageStats)) {
    const normalized = homepageStats
      .map((item, index) => normalizeProofStat(item, fallbackData.proofStats[index]))
      .filter((item): item is ProofStat => Boolean(item));

    if (hasItems(normalized)) return normalized;
  }

  return fallbackData.proofStats;
}

export async function getVideoItems(): Promise<VideoItem[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.videos);
  const normalized =
    items
      ?.map((item, index) => normalizeVideoItem(item, fallbackData.videoItems[index]))
      .filter((item): item is VideoItem => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.videoItems;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.socialLinks);
  const normalized =
    items
      ?.map((item, index) => normalizeSocialLink(item, fallbackData.socialLinks[index]))
      .filter((item): item is SocialLink => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.socialLinks;
}

export async function getSocialStats(): Promise<SocialStat[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.socialStats);
  const normalized =
    items
      ?.map((item, index) => normalizeSocialStat(item, fallbackData.socialStats[index]))
      .filter((item): item is SocialStat => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.socialStats;
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  const item = await fetchPublicSingle<ApiRecord>(publicApiPaths.reviewSummary);
  return item ? normalizeReviewSummary(item) : fallbackData.reviewSummary;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.gallery);
  const normalized =
    items
      ?.map((item, index) => normalizeGalleryImage(item, fallbackData.galleryImages[index]))
      .filter((item): item is GalleryImage => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.galleryImages;
}

export async function getEquipmentGalleryImages(): Promise<GalleryImage[]> {
  const gallery = await getGalleryImages();
  const equipment = gallery.filter((item) => {
    const label = `${item.category} ${item.usageLocation || ""} ${item.title}`.toLowerCase();
    return /equipment|technology|laser|machine|treatment suite/.test(label);
  });

  return hasItems(equipment) ? equipment : fallbackData.equipmentGalleryImages;
}

export async function getRecognitionItems(): Promise<RecognitionItem[]> {
  const items = await fetchPublicCollection<ApiRecord>(publicApiPaths.recognition);
  const normalized =
    items
      ?.map((item, index) =>
        normalizeRecognitionItem(item, fallbackData.recognitionItems[index]),
      )
      .filter((item): item is RecognitionItem => Boolean(item)) || [];

  return hasItems(normalized)
    ? dedupeRecognitionItems(normalized)
    : dedupeRecognitionItems(fallbackData.recognitionItems);
}

export async function getMediaLogos(): Promise<MediaLogo[]> {
  const homepage = await fetchPublicSingle<ApiRecord>(publicApiPaths.homepage);
  const logos = firstArray(asRecord(homepage), ["mediaLogos", "media_logos", "socialProof", "social_proof"]);
  const normalized =
    logos
      ?.map((item, index) => normalizeMediaLogo(item, fallbackData.mediaLogos[index]))
      .filter((item): item is MediaLogo => Boolean(item)) || [];

  return hasItems(normalized) ? normalized : fallbackData.mediaLogos;
}

export async function getAssistantKnowledge(): Promise<CmsAssistantKnowledge> {
  const knowledge = await fetchPublicSingle<ApiRecord>(publicApiPaths.assistantKnowledge);

  if (!knowledge) {
    return fallbackData.assistantKnowledge;
  }

  const settings = normalizeAssistantSettings(knowledge);
  const faqs = firstArray(knowledge, ["faqs", "faq"])
    ?.map((item, index) => {
      const record = asRecord(item);
      return {
        question:
          firstString(record, ["question", "title"]) ||
          fallbackData.assistantKnowledge.faqs[index]?.question ||
          "Question",
        answer:
          firstString(record, ["answer", "text", "body"]) ||
          fallbackData.assistantKnowledge.faqs[index]?.answer ||
          "",
      };
    })
    .filter((item) => item.question && item.answer);

  return {
    settings,
    faqs: hasItems(faqs) ? faqs : fallbackData.assistantKnowledge.faqs,
    quickPrompts: settings.quickPrompts,
    serviceNotes: hasItems(toStringArray(knowledge.serviceNotes ?? knowledge.service_notes))
      ? toStringArray(knowledge.serviceNotes ?? knowledge.service_notes)
      : fallbackData.assistantKnowledge.serviceNotes,
  };
}

export async function getAssistantSettings(): Promise<AssistantSettings> {
  const knowledge = await getAssistantKnowledge();
  return knowledge.settings;
}

export async function getSeoIndex(): Promise<SeoIndex> {
  const payload = await fetchPublicSingle<ApiRecord>(publicApiPaths.seoIndex);

  if (payload) {
    const record = asRecord(payload);
    const mapEntry = (item: unknown) => {
      const value = asRecord(item);
      const title = firstString(value, ["title", "name"]) || "";
      const url = firstString(value, ["url", "href", "path"]) || "";
      return {
        title,
        url,
        updatedAt: firstString(value, ["updatedAt", "updated_at"]) || null,
        categoryUrl: firstString(value, ["categoryUrl", "category_url"]),
      };
    };

    return {
      staticRoutes:
        toStringArray(record.staticRoutes ?? record.static_routes).length > 0
          ? toStringArray(record.staticRoutes ?? record.static_routes)
          : [],
      treatments: (firstArray(record, ["treatments"]) || []).map(mapEntry).filter((item) => item.url),
      conditions: (firstArray(record, ["conditions"]) || []).map(mapEntry).filter((item) => item.url),
      articles: (firstArray(record, ["articles"]) || []).map(mapEntry).filter((item) => item.url),
      reviews: (firstArray(record, ["reviews"]) || []).map(mapEntry).filter((item) => item.url),
      updatedAt: firstString(record, ["updatedAt", "updated_at"]),
    };
  }

  const [treatments, conditions, articles, reviews] = await Promise.all([
    getTreatments(),
    getConditions(),
    getArticles(),
    getReviews(),
  ]);
  const publishedReviewCategories = new Set(
    reviews.map((review) => review.treatmentCategory),
  );

  return {
    staticRoutes: [
      "/",
      "/about",
      "/treatments",
      "/concerns",
      "/doctor-answers",
      "/conditions",
      "/knowledge",
      "/before-after",
      "/reviews",
      ...reviewCategories
        .filter((category) => publishedReviewCategories.has(category.slug))
        .map((category) => `/reviews/${category.slug}`),
      "/contact",
    ],
    treatments: treatments.map((treatment) => ({
      title: treatment.title,
      url: `/treatments/${treatment.cluster}/${treatment.slug}`,
    })),
    conditions: conditions.map((condition) => ({
      title: condition.title,
      url: `/conditions/${condition.slug}`,
    })),
    articles: articles.map((article) => ({
      title: article.title,
      url: `/knowledge/${article.slug}`,
    })),
    reviews: reviews.map((review) => ({
      title: `Review from ${review.reviewerName}`,
      url: `/reviews/${review.slug}`,
      categoryUrl: `/reviews/${review.treatmentCategory}`,
    })),
  };
}

function uniqueParams<T extends Record<string, string | undefined>>(
  items: T[],
  keys: (keyof T)[],
) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (keys.some((key) => !item[key])) {
      return false;
    }

    const id = keys.map((key) => item[key]).join("/");

    if (seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  }) as Required<T>[];
}

export const seedData = fallbackData;
