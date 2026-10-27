"use client";

export type RadianceAnalyticsEvent =
  | "search_started"
  | "search_query_submitted"
  | "search_result_clicked"
  | "no_results"
  | "question_submitted"
  | "related_question_clicked"
  | "treatment_clicked"
  | "consultation_clicked"
  | "video_played"
  | RadianceConversionEvent;

export type RadianceConversionEvent =
  | "call_click"
  | "whatsapp_click"
  | "hair_call_click"
  | "hair_whatsapp_click"
  | "hair_booking_start"
  | "hair_booking_complete"
  | "book_appointment_click"
  | "booking_start"
  | "booking_submission"
  | "treatment_cta_click"
  | "doctor_answer_click"
  | "video_play"
  | "case_click";

export type ConversionEventParameters = {
  path: string;
  page_type: string;
  topic?: string;
  referral_source?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    radianceAnalyticsConfigured?: string;
  }
}

export function trackEvent(
  name: RadianceAnalyticsEvent,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;
  // Queue the first CTA even when the deferred analytics script is not loaded.
  window.dataLayer ||= [];
  window.gtag ||= function () {
    // Match Google's pre-load command queue format.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined),
  );
  window.gtag("event", name, safeParameters);
}

export function initializeAnalyticsQueue(measurementId: string) {
  if (typeof window === "undefined" || window.radianceAnalyticsConfigured === measurementId) return;
  window.dataLayer ||= [];
  window.gtag ||= function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  window.radianceAnalyticsConfigured = measurementId;
}

export function trackConversionEvent(
  name: RadianceConversionEvent,
  parameters: ConversionEventParameters,
) {
  rememberLeadAttribution();
  const referralSource =
    parameters.referral_source ?? getAttributionSource();

  trackEvent(name, {
    path: parameters.path,
    page_type: parameters.page_type,
    topic: parameters.topic,
    referral_source: referralSource,
    article_slug: parameters.path.startsWith("/knowledge/") ? parameters.path.slice("/knowledge/".length) : undefined,
    landing_path: readLeadAttribution()?.landingPath,
  });
}

type LeadAttribution = { landingPath: string; source: string };
const leadAttributionKey = "radiance:lead-attribution";

function readLeadAttribution(): LeadAttribution | undefined {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(leadAttributionKey) || "null");
    return typeof value?.landingPath === "string" && typeof value?.source === "string" ? value : undefined;
  } catch { return undefined; }
}

export function rememberLeadAttribution() {
  if (typeof window === "undefined" || readLeadAttribution()) return;
  try {
    window.sessionStorage.setItem(leadAttributionKey, JSON.stringify({
      landingPath: window.location.pathname,
      source: currentAttributionSource() || "direct",
    }));
  } catch { /* Storage can be disabled without blocking a consultation. */ }
}

function getAttributionSource() {
  if (typeof window === "undefined") return undefined;
  return readLeadAttribution()?.source || currentAttributionSource();
}

function currentAttributionSource() {
  if (typeof window === "undefined") return undefined;

  const utmSource = new URLSearchParams(window.location.search)
    .get("utm_source")
    ?.trim()
    .toLowerCase();

  if (utmSource) return utmSource.slice(0, 100);

  try {
    const referringHost = document.referrer
      ? new URL(document.referrer).hostname.toLowerCase()
      : undefined;

    return referringHost?.slice(0, 100);
  } catch {
    return undefined;
  }
}

export function privateQueryMetrics(query: string) {
  const normalized = query.trim().replace(/\s+/g, " ");
  return {
    query_length: Math.min(normalized.length, 200),
    token_count: normalized ? Math.min(normalized.split(" ").length, 20) : 0,
  };
}
