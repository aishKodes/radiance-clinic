export const defaultWhatsAppMessage =
  "Hello Radiance Clinics, I would like to know more about your treatment options and book a consultation.";

const pageTopics: { pattern: RegExp; topic: string }[] = [
  { pattern: /hair-transplant|fue-hair/, topic: "hair transplant" },
  { pattern: /hair-loss|hair-fall|scalp|prp-gfc/, topic: "hair and scalp treatment" },
  { pattern: /laser-hair/, topic: "laser hair reduction" },
  { pattern: /acne-scar/, topic: "acne scar treatment" },
  { pattern: /acne/, topic: "acne treatment" },
  { pattern: /pigmentation|melasma/, topic: "pigmentation treatment" },
  { pattern: /wart/, topic: "wart assessment" },
  { pattern: /injectable|botox|filler|aesthetic/, topic: "aesthetic dermatology" },
  { pattern: /skin/, topic: "skin treatment" },
];

export function topicFromPath(pathname = "/") {
  return pageTopics.find(({ pattern }) => pattern.test(pathname.toLowerCase()))?.topic;
}

export function pageTypeFromPath(pathname = "/") {
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/treatments/")) return "treatment";
  if (pathname.startsWith("/concerns/")) return "concern";
  if (pathname.startsWith("/doctor-answers/")) return "doctor_answer";
  if (pathname.startsWith("/knowledge/")) return "knowledge";
  if (pathname.startsWith("/results/") || pathname === "/before-after") return "results";
  if (pathname.startsWith("/reviews")) return "reviews";
  if (pathname.startsWith("/videos")) return "videos";
  if (pathname.startsWith("/contact")) return "contact";
  if (/^\/[^/]+$/.test(pathname)) return "local_service";
  return "site_page";
}

export function whatsappMessage(pathname = "/", topic?: string) {
  const resolvedTopic = topic || topicFromPath(pathname);
  return resolvedTopic
    ? `Hello Radiance Clinics, I would like to know more about ${resolvedTopic} and book a consultation.`
    : defaultWhatsAppMessage;
}

export function whatsappHref(number: string, pathname = "/", topic?: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
    whatsappMessage(pathname, topic),
  )}`;
}
