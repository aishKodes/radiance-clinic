export const defaultWhatsAppMessage =
  "Hello Radiance Clinics, I would like to know more about your treatment options and book a consultation.";

const pageTopics: { pattern: RegExp; topic: string }[] = [
  {
    pattern: /beard-moustache|beard-transplant/,
    topic: "hair transplant for beard or moustache restoration",
  },
  {
    pattern: /hair-transplant-repair/,
    topic: "hair transplant repair assessment",
  },
  {
    pattern: /crown-hair-transplant/,
    topic: "hair transplant for crown thinning",
  },
  {
    pattern: /hairline-correction|receding-hairline/,
    topic: "hairline correction",
  },
  { pattern: /hair-transplant|fue-hair/, topic: "hair transplant" },
  {
    pattern: /female-hair-loss/,
    topic: "hair loss and thinning in women",
  },
  {
    pattern: /male-pattern-hair-loss/,
    topic: "male pattern hair loss",
  },
  {
    pattern: /non-surgical-hair-replacement|hair-patch|hair-wig/,
    topic: "hair patch or non-surgical hair replacement",
  },
  { pattern: /alopecia/, topic: "patchy hair loss and alopecia assessment" },
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
