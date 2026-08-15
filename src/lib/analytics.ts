"use client";

export type RadianceAnalyticsEvent =
  | "search_started"
  | "search_query_submitted"
  | "search_result_clicked"
  | "no_results"
  | "question_submitted"
  | "related_question_clicked"
  | "treatment_clicked"
  | "consultation_clicked";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: RadianceAnalyticsEvent,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined),
  );
  window.gtag("event", name, safeParameters);
}

export function privateQueryMetrics(query: string) {
  const normalized = query.trim().replace(/\s+/g, " ");
  return {
    query_length: Math.min(normalized.length, 200),
    token_count: normalized ? Math.min(normalized.split(" ").length, 20) : 0,
  };
}
