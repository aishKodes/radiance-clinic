import type { CmsCollectionResponse, CmsSingleResponse } from "@/types/cms";

const DEFAULT_REVALIDATE_SECONDS = 300;

export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || ""
).replace(/\/+$/, "");

export const publicApiPaths = {
  siteSettings: "/api/public/site-settings",
  homepage: "/api/public/homepage",
  treatments: "/api/public/treatments",
  treatment: (cluster: string, slug: string) =>
    `/api/public/treatments/${encodeURIComponent(cluster)}/${encodeURIComponent(slug)}`,
  conditions: "/api/public/conditions",
  condition: (slug: string) => `/api/public/conditions/${encodeURIComponent(slug)}`,
  articles: "/api/public/articles",
  article: (slug: string) => `/api/public/articles/${encodeURIComponent(slug)}`,
  gallery: "/api/public/gallery",
  recognition: "/api/public/recognition",
  homepageMedia: "/api/public/homepage-media",
  beforeAfter: "/api/public/before-after",
  mediaRequirements: "/api/public/media-requirements",
  videos: "/api/public/videos",
  socialLinks: "/api/public/social-links",
  socialStats: "/api/public/social-stats",
  reviewSummary: "/api/public/review-summary",
  testimonials: "/api/public/testimonials",
  leads: "/api/public/leads",
  reviews: "/api/public/reviews",
  reviewsByCategory: (category: string) =>
    `/api/public/reviews/${encodeURIComponent(category)}`,
  reviewDetail: (slug: string) =>
    `/api/public/reviews/detail/${encodeURIComponent(slug)}`,
  seoIndex: "/api/public/seo-index",
  assistantKnowledge: "/api/public/assistant-knowledge",
};

export async function fetchPublicApi<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T | null> {
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicCollection<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T[] | null> {
  const payload = await fetchPublicApi<CmsCollectionResponse<T>>(path, options);

  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return null;
}

export async function fetchPublicSingle<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T | null> {
  const payload = await fetchPublicApi<CmsSingleResponse<T>>(path, options);

  if (!payload) {
    return null;
  }

  const record: Record<string, unknown> | null = isObject(payload)
    ? (payload as Record<string, unknown>)
    : null;

  if (record && Object.prototype.hasOwnProperty.call(record, "data")) {
    return (record.data as T | undefined) || null;
  }

  if (record && Object.prototype.hasOwnProperty.call(record, "item")) {
    return (record.item as T | undefined) || null;
  }

  return payload as T;
}

export function resolveApiAssetUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const url = value.trim();

  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  if (!apiBaseUrl) {
    return url;
  }

  try {
    return new URL(url, apiBaseUrl).toString();
  } catch {
    return url;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
