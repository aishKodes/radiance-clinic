import { unstable_cache } from "next/cache";

const DEFAULT_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Radiance%20Clinics%20Bhubaneswar";
const REVIEW_REFRESH_SECONDS = 3600;
const MAX_VISIBLE_REVIEWS = 18;

type GoogleBusinessReviewer = {
  displayName?: string;
  profilePhotoUrl?: string;
  isAnonymous?: boolean;
};

type GoogleBusinessReview = {
  name?: string;
  reviewId?: string;
  reviewer?: GoogleBusinessReviewer;
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

type GoogleBusinessReviewsResponse = {
  reviews?: GoogleBusinessReview[];
  averageRating?: number;
  totalReviewCount?: number;
};

type GooglePlacesReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type GooglePlaceDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GooglePlacesReview[];
};

type GoogleTokenResponse = {
  access_token?: string;
};

export type GoogleReviewItem = {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  publishedAt?: string;
  relativePublishedAt?: string;
  reviewerProfileUrl?: string;
  sourceUrl: string;
};

export type GoogleReviewsFeed = {
  source: "business-profile" | "places" | "unavailable";
  rating?: number;
  totalReviewCount?: number;
  googleMapsUrl: string;
  reviews: GoogleReviewItem[];
};

function env(name: string) {
  return process.env[name]?.trim() || "";
}

function mapsUrl() {
  return env("GOOGLE_BUSINESS_PROFILE_MAPS_URL") || DEFAULT_GOOGLE_MAPS_URL;
}

function resourceId(value: string) {
  return value.split("/").filter(Boolean).at(-1) || value;
}

function starRating(value?: string) {
  const ratings: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  return ratings[value || ""] || 0;
}

function uniqueReviews(reviews: GoogleReviewItem[]) {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();

  return reviews.filter((review) => {
    const idKey = review.id.toLowerCase();
    const contentKey = `${review.reviewerName.toLowerCase()}|${review.text
      .toLowerCase()
      .replace(/\s+/g, " ")}`;

    if (seenIds.has(idKey) || seenContent.has(contentKey)) return false;
    seenIds.add(idKey);
    seenContent.add(contentKey);
    return true;
  });
}

function unavailableFeed(): GoogleReviewsFeed {
  return {
    source: "unavailable",
    googleMapsUrl: mapsUrl(),
    reviews: [],
  };
}

function hasBusinessProfileConfig() {
  const hasToken = Boolean(env("GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN"));
  const hasRefreshCredentials = Boolean(
    env("GOOGLE_BUSINESS_PROFILE_CLIENT_ID") &&
    env("GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET") &&
    env("GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN"),
  );

  return Boolean(
    env("GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID") &&
    env("GOOGLE_BUSINESS_PROFILE_LOCATION_ID") &&
    (hasToken || hasRefreshCredentials),
  );
}

function hasPlacesConfig() {
  return Boolean(env("GOOGLE_PLACES_API_KEY") && env("GOOGLE_PLACE_ID"));
}

async function getBusinessProfileAccessToken() {
  const directToken = env("GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN");

  if (directToken) return directToken;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env("GOOGLE_BUSINESS_PROFILE_CLIENT_ID"),
      client_secret: env("GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET"),
      refresh_token: env("GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as GoogleTokenResponse;
  return payload.access_token || null;
}

async function fetchBusinessProfileReviews(): Promise<GoogleReviewsFeed | null> {
  if (!hasBusinessProfileConfig()) return null;

  const accessToken = await getBusinessProfileAccessToken();
  if (!accessToken) return null;

  const accountId = resourceId(env("GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID"));
  const locationId = resourceId(env("GOOGLE_BUSINESS_PROFILE_LOCATION_ID"));
  const endpoint = new URL(
    `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`,
  );
  endpoint.searchParams.set("pageSize", "50");
  endpoint.searchParams.set("orderBy", "updateTime desc");

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as GoogleBusinessReviewsResponse;
  const reviews = uniqueReviews(
    (payload.reviews || [])
      .map((review): GoogleReviewItem | null => {
        const text = review.comment?.trim();
        const rating = starRating(review.starRating);

        if (!text || !rating) return null;

        return {
          id: review.reviewId || review.name || `${review.createTime}-${text}`,
          reviewerName:
            review.reviewer?.isAnonymous || !review.reviewer?.displayName
              ? "Google user"
              : review.reviewer.displayName,
          rating,
          text,
          publishedAt: review.createTime || review.updateTime,
          sourceUrl: mapsUrl(),
        };
      })
      .filter((review): review is GoogleReviewItem => Boolean(review)),
  ).slice(0, MAX_VISIBLE_REVIEWS);

  return {
    source: "business-profile",
    rating: payload.averageRating,
    totalReviewCount: payload.totalReviewCount,
    googleMapsUrl: mapsUrl(),
    reviews,
  };
}

async function fetchPlacesReviews(): Promise<GoogleReviewsFeed | null> {
  if (!hasPlacesConfig()) return null;

  const placeId = resourceId(env("GOOGLE_PLACE_ID"));
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-IN",
        "X-Goog-Api-Key": env("GOOGLE_PLACES_API_KEY"),
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as GooglePlaceDetailsResponse;
  const profileUrl = payload.googleMapsUri || mapsUrl();
  const reviews = uniqueReviews(
    (payload.reviews || [])
      .map((review): GoogleReviewItem | null => {
        const text =
          review.text?.text?.trim() || review.originalText?.text?.trim();
        const rating = Math.round(review.rating || 0);

        if (!text || !rating) return null;

        return {
          id: review.name || `${review.publishTime}-${text}`,
          reviewerName: review.authorAttribution?.displayName || "Google user",
          reviewerProfileUrl: review.authorAttribution?.uri,
          rating,
          text,
          publishedAt: review.publishTime,
          relativePublishedAt: review.relativePublishTimeDescription,
          sourceUrl: review.googleMapsUri || profileUrl,
        };
      })
      .filter((review): review is GoogleReviewItem => Boolean(review)),
  ).slice(0, MAX_VISIBLE_REVIEWS);

  return {
    source: "places",
    rating: payload.rating,
    totalReviewCount: payload.userRatingCount,
    googleMapsUrl: profileUrl,
    reviews,
  };
}

async function fetchGoogleReviews(): Promise<GoogleReviewsFeed> {
  if (hasBusinessProfileConfig()) {
    try {
      const businessProfile = await fetchBusinessProfileReviews();
      if (businessProfile) return businessProfile;
    } catch {
      // The public Places feed can still provide a summary if it is configured.
    }
  }

  if (hasPlacesConfig()) {
    try {
      const places = await fetchPlacesReviews();
      if (places) return places;
    } catch {
      return unavailableFeed();
    }
  }

  return unavailableFeed();
}

const getCachedGoogleReviews = unstable_cache(
  fetchGoogleReviews,
  ["radiance-google-reviews-v1"],
  {
    revalidate: REVIEW_REFRESH_SECONDS,
    tags: ["google-reviews"],
  },
);

export async function getGoogleReviewsFeed() {
  if (!hasBusinessProfileConfig() && !hasPlacesConfig()) {
    return unavailableFeed();
  }

  return getCachedGoogleReviews();
}
