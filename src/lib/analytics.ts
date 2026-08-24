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
  | "book_appointment_click"
  | "treatment_cta_click"
  | "doctor_answer_click"
  | "video_play"
  | "case_click";

export type ConversionEventParameters = {
  path: string;
  page_type: string;
  topic?: string;
};

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

export function trackConversionEvent(
  name: RadianceConversionEvent,
  parameters: ConversionEventParameters,
) {
  trackEvent(name, {
    path: parameters.path,
    page_type: parameters.page_type,
    topic: parameters.topic,
  });
}

export function privateQueryMetrics(query: string) {
  const normalized = query.trim().replace(/\s+/g, " ");
  return {
    query_length: Math.min(normalized.length, 200),
    token_count: normalized ? Math.min(normalized.split(" ").length, 20) : 0,
  };
}
