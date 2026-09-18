import process from "node:process";

const trimEnv = (name) => process.env[name]?.trim() || "";
const mapsUrl =
  trimEnv("GOOGLE_BUSINESS_PROFILE_MAPS_URL") ||
  "https://www.google.com/maps/search/?api=1&query=Radiance%20Clinics%20Bhubaneswar";

function resourceId(value) {
  return value.split("/").filter(Boolean).at(-1) || value;
}

async function googleAccessToken() {
  const directToken = trimEnv("GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN");
  if (directToken) return directToken;

  const clientId = trimEnv("GOOGLE_BUSINESS_PROFILE_CLIENT_ID");
  const clientSecret = trimEnv("GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET");
  const refreshToken = trimEnv("GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) return "";

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Google OAuth refresh failed (${response.status}).`);
  const payload = await response.json();
  return payload.access_token || "";
}

async function syncBusinessProfile() {
  const accountId = trimEnv("GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID");
  const locationId = trimEnv("GOOGLE_BUSINESS_PROFILE_LOCATION_ID");
  const accessToken = await googleAccessToken();
  if (!accountId || !locationId || !accessToken) return null;

  const endpoint = new URL(
    `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(resourceId(accountId))}/locations/${encodeURIComponent(resourceId(locationId))}/reviews`,
  );
  endpoint.searchParams.set("pageSize", "50");
  endpoint.searchParams.set("orderBy", "updateTime desc");
  const response = await fetch(endpoint, {
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Google Business Profile review sync failed (${response.status}).`);
  const payload = await response.json();
  return {
    source: "business-profile",
    rating: payload.averageRating ?? null,
    totalReviewCount: payload.totalReviewCount ?? null,
    writtenReviewsReceived: Array.isArray(payload.reviews) ? payload.reviews.length : 0,
    mapsUrl,
  };
}

async function syncPlaces() {
  const apiKey = trimEnv("GOOGLE_PLACES_API_KEY");
  const placeId = trimEnv("GOOGLE_PLACE_ID");
  if (!apiKey || !placeId) return null;

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(resourceId(placeId))}`,
    {
      headers: {
        Accept: "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!response.ok) throw new Error(`Google Places review sync failed (${response.status}).`);
  const payload = await response.json();
  return {
    source: "places",
    rating: payload.rating ?? null,
    totalReviewCount: payload.userRatingCount ?? null,
    writtenReviewsReceived: Array.isArray(payload.reviews) ? payload.reviews.length : 0,
    mapsUrl: payload.googleMapsUri || mapsUrl,
  };
}

try {
  const result = (await syncBusinessProfile()) || (await syncPlaces());
  if (!result) {
    console.log(
      "SKIPPED: no official Google Business Profile or Places API credentials are configured. The production site continues to use its one-hour server cache when credentials are supplied, otherwise the verified source-linked snapshot.",
    );
  } else {
    console.log(JSON.stringify({ syncedAt: new Date().toISOString(), ...result }, null, 2));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
