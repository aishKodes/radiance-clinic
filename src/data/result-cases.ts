import {
  hairTransformationExamples,
  skinTransformationExamples,
} from "@/data/homepage-media";
import type { CmsImage, Transformation } from "@/types/cms";
import { evaluateProgrammaticPageEligibility } from "@/lib/indexability";

export type ResultCaseCategory = "hair-transplant" | "skin";

export type ResultCase = {
  slug: string;
  category: ResultCaseCategory;
  conditionName: string;
  treatment: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  transformation: Transformation;
  beforeImage: CmsImage;
  afterImage: CmsImage;
  viewLabel: string;
  treatmentHref: string;
  conditionHref: string;
  guideHref: string;
  verifiedClinicalContext?: string[];
  verifiedTimeline?: string;
  consentStatus: "confirmed";
  indexable: boolean;
  missingForIndexability: string[];
};

type ResultConfig = Omit<
  ResultCase,
  | "transformation"
  | "beforeImage"
  | "afterImage"
  | "viewLabel"
  | "consentStatus"
  | "indexable"
  | "missingForIndexability"
>;

const configs: ResultConfig[] = [
  {
    slug: "advanced-male-pattern-baldness-result",
    category: "hair-transplant",
    conditionName: "Advanced Male Pattern Baldness",
    treatment: "Hair Transplant",
    title: "Hair Transplant Result for Advanced Male Pattern Baldness",
    metaTitle: "Advanced Male Pattern Baldness Result | Radiance Clinics",
    metaDescription:
      "View a consent-confirmed hair transplant comparison for advanced male pattern baldness at Radiance Clinics Bhubaneswar. Individual results vary.",
    summary:
      "A consent-confirmed front-view comparison associated with hair transplant care for advanced male pattern baldness.",
    treatmentHref: "/treatments/hair-restoration/fue-hair-transplant",
    conditionHref: "/conditions/hair-fall-thinning",
    guideHref: "/knowledge/how-to-plan-hair-restoration",
  },
  ...[
    ["female-frontal-hairline-thinning", "Female Frontal Hairline Thinning"],
    ["female-pattern-hair-loss", "Female Pattern Hair Loss"],
    ["female-widening-part", "Female Widening Part"],
    ["frontal-and-mid-scalp-hair-transplant", "Frontal And Mid Scalp Hair Transplant"],
    ["male-diffuse-frontal-thinning", "Male Diffuse Frontal Thinning"],
    ["male-temporal-recession", "Male Temporal Recession"],
    ["receding-hairline", "Receding Hairline"],
  ].map(([slug, conditionName]) => ({
    slug: `${slug}-result`,
    category: "hair-transplant" as const,
    conditionName,
    treatment: conditionName.includes("Transplant") || conditionName.includes("Recession") || conditionName.includes("Hairline")
      ? "Hair Transplant"
      : "Hair Restoration",
    title: `${conditionName} Hair Restoration Result`,
    metaTitle: `${conditionName} Result | Radiance Clinics`,
    metaDescription: `View a consent-confirmed hair restoration comparison for ${conditionName.toLowerCase()} at Radiance Clinics Bhubaneswar. Individual results vary.`,
    summary: `A consent-confirmed comparison associated with hair restoration care for ${conditionName.toLowerCase()}.`,
    treatmentHref: "/treatments/hair-restoration/fue-hair-transplant",
    conditionHref: "/conditions/hair-fall-thinning",
    guideHref: "/knowledge/how-to-plan-hair-restoration",
  })),
  ...[
    ["acne", "Acne", "Acne Treatment"],
    ["acne-scars", "Acne Scars", "Acne Scar Treatment"],
    ["melasma", "Melasma", "Pigmentation Treatment"],
    ["pigmentation", "Pigmentation", "Pigmentation Treatment"],
  ].map(([slug, conditionName, treatment]) => ({
    slug: `${slug}-improvement-result`,
    category: "skin" as const,
    conditionName,
    treatment,
    title: `${conditionName} Improvement Result`,
    metaTitle: `${conditionName} Improvement Result | Radiance Clinics`,
    metaDescription: `View a consent-confirmed ${conditionName.toLowerCase()} treatment comparison at Radiance Clinics Bhubaneswar. Individual results vary.`,
    summary: `A consent-confirmed comparison associated with treatment planning for ${conditionName.toLowerCase()}.`,
    treatmentHref:
      conditionName === "Acne" || conditionName === "Acne Scars"
        ? "/treatments/skin-laser/acne-scar-revision"
        : "/treatments/skin-laser/laser-pigmentation-program",
    conditionHref:
      conditionName === "Acne" || conditionName === "Acne Scars"
        ? "/conditions/acne-acne-scars"
        : "/conditions/pigmentation-melasma",
    guideHref: "/knowledge/laser-skin-treatments-safety",
  })),
];

const transformations = [
  ...hairTransformationExamples,
  ...skinTransformationExamples,
];

function firstPair(transformation: Transformation) {
  if (transformation.beforeAfterPairs?.[0]) {
    return transformation.beforeAfterPairs[0];
  }
  if (transformation.frontBefore && transformation.frontAfter) {
    return {
      viewLabel: "Front View",
      before: transformation.frontBefore,
      after: transformation.frontAfter,
    };
  }
  return null;
}

export const resultCases: ResultCase[] = configs.flatMap((config) => {
  const transformation = transformations.find(
    (item) =>
      item.conditionName?.trim().toLowerCase() ===
      config.conditionName.toLowerCase(),
  );
  const pair = transformation ? firstPair(transformation) : null;
  if (!transformation || !pair || transformation.consentConfirmed === false) {
    return [];
  }

  const missingForIndexability: string[] = [];
  if (!config.verifiedClinicalContext?.length) {
    missingForIndexability.push("verified clinical context");
  }
  if (!config.verifiedTimeline) {
    missingForIndexability.push("verified result timeline");
  }

  const eligibility = evaluateProgrammaticPageEligibility({
    slug: config.slug,
    title: config.title,
    description: config.metaDescription,
    bodyText: [config.summary, ...(config.verifiedClinicalContext || []), config.verifiedTimeline || ""].join(" "),
    parentPath: "/results",
    contextualLinks: [config.treatmentHref, config.conditionHref, config.guideHref],
    canonicalPath: `/results/${config.category}/${config.slug}`,
    status: missingForIndexability.length ? "draft" : "published",
    hasVerifiedUserValue: Boolean(config.verifiedClinicalContext?.length && config.verifiedTimeline),
    missingVerifiedFields: missingForIndexability,
  });

  return [{
    ...config,
    transformation,
    beforeImage: pair.before,
    afterImage: pair.after,
    viewLabel: pair.viewLabel || "Comparison View",
    consentStatus: "confirmed" as const,
    indexable: eligibility.eligible,
    missingForIndexability: eligibility.reasons,
  }];
});

export const indexableResultCases = resultCases.filter((item) => item.indexable);

export function getIndexableResultCase(category: string, slug: string) {
  return indexableResultCases.find(
    (item) => item.category === category && item.slug === slug,
  );
}
