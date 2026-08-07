export type LocationSeoPage = {
  slug: string;
  city: string;
  service: "Hair Transplant";
  actualClinicCity: "Bhubaneswar";
  status: "draft" | "published";
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  uniqueIntroduction?: string[];
  verifiedTravelGuidance?: string[];
  verifiedPatientContext?: string;
  faqs?: { question: string; answer: string }[];
};

const cities = [
  ["cuttack", "Cuttack"],
  ["puri", "Puri"],
  ["rourkela", "Rourkela"],
  ["sambalpur", "Sambalpur"],
  ["berhampur", "Berhampur"],
  ["baripada", "Baripada"],
] as const;

export const locationPages: LocationSeoPage[] = cities.map(([slug, city]) => ({
  slug: `hair-transplant-${slug}`,
  city,
  service: "Hair Transplant",
  actualClinicCity: "Bhubaneswar",
  status: "draft",
}));

export type LocationEligibility = {
  eligible: boolean;
  missing: string[];
};

export function evaluateLocationEligibility(
  page: LocationSeoPage,
): LocationEligibility {
  const missing: string[] = [];

  if (page.status !== "published") missing.push("published status");
  if (!page.title || page.title.length < 25) missing.push("unique H1");
  if (!page.metaTitle || !page.metaDescription) missing.push("unique metadata");
  if (!page.uniqueIntroduction || page.uniqueIntroduction.join(" ").length < 450) {
    missing.push("substantial city-specific introduction");
  }
  if (!page.verifiedTravelGuidance?.length) missing.push("verified travel guidance");
  if (!page.faqs || page.faqs.length < 2) missing.push("city-specific patient FAQs");

  const shared = evaluateProgrammaticPageEligibility({
    slug: page.slug,
    title: page.title,
    description: page.metaDescription,
    bodyText: [...(page.uniqueIntroduction || []), ...(page.verifiedTravelGuidance || [])].join(" "),
    parentPath: "/locations",
    contextualLinks: ["/hair-transplant-bhubaneswar", "/contact"],
    canonicalPath: `/${page.slug}`,
    status: page.status,
    hasVerifiedUserValue: Boolean(page.verifiedTravelGuidance?.length),
    missingVerifiedFields: missing,
  });
  return { eligible: shared.eligible, missing: shared.reasons };
}

export const indexableLocationPages = locationPages.filter(
  (page) => evaluateLocationEligibility(page).eligible,
);

export const indexableLocationPageBySlug = new Map(
  indexableLocationPages.map((page) => [page.slug, page]),
);
import { evaluateProgrammaticPageEligibility } from "@/lib/indexability";
