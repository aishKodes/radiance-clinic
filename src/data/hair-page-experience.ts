export type HairPageExperience = {
  leadTopic: string;
  resultConditions: string[];
  videoSlug: string;
  guide: { href: string; label: string };
  reviewIds: string[];
  showHairMediaCoverage?: boolean;
};

export const hairPageExperienceBySlug: Record<string, HairPageExperience> = {
  "hair-transplant-bhubaneswar": {
    leadTopic: "hair transplant",
    resultConditions: [
      "Advanced Male Pattern Baldness",
      "Receding Hairline",
      "Frontal And Mid Scalp Hair Transplant",
    ],
    videoSlug: "choosing-a-hair-transplant-clinic",
    guide: {
      href: "/knowledge/how-to-plan-hair-restoration",
      label: "Hair restoration planning guide",
    },
    reviewIds: ["google-umakanta-pradhan-2026-09"],
    showHairMediaCoverage: true,
  },
  "hair-loss-clinic-bhubaneswar": {
    leadTopic: "hair thinning and hair loss",
    resultConditions: [
      "Female Pattern Hair Loss",
      "Female Widening Part",
      "Male Diffuse Frontal Thinning",
    ],
    videoSlug: "hair-loss-treatment-options",
    guide: {
      href: "/knowledge/hair-loss-causes-and-assessment",
      label: "Hair loss causes and assessment guide",
    },
    reviewIds: [
      "google-sashi-kanta-parida-2026-09",
      "google-sudipta-kumar-jena-2026-09",
    ],
  },
  "male-pattern-hair-loss-treatment-bhubaneswar": {
    leadTopic: "male pattern hair loss",
    resultConditions: [
      "Advanced Male Pattern Baldness",
      "Male Diffuse Frontal Thinning",
      "Male Temporal Recession",
    ],
    videoSlug: "hair-loss-treatment-options",
    guide: {
      href: "/knowledge/hair-loss-causes-and-assessment",
      label: "Hair loss causes and assessment guide",
    },
    reviewIds: ["google-sashi-kanta-parida-2026-09"],
  },
  "female-hair-loss-treatment-bhubaneswar": {
    leadTopic: "female hair loss and thinning",
    resultConditions: [
      "Female Pattern Hair Loss",
      "Female Widening Part",
      "Female Frontal Hairline Thinning",
    ],
    videoSlug: "female-hair-loss-causes",
    guide: {
      href: "/knowledge/hair-loss-causes-and-assessment",
      label: "Hair loss causes and assessment guide",
    },
    reviewIds: ["google-sudipta-kumar-jena-2026-09"],
  },
  "crown-hair-transplant-bhubaneswar": {
    leadTopic: "crown hair transplant",
    resultConditions: ["Advanced Male Pattern Baldness"],
    videoSlug: "hair-transplant-graft-planning",
    guide: {
      href: "/knowledge/crown-vs-hairline-graft-priority",
      label: "Crown and hairline graft-priority guide",
    },
    reviewIds: ["google-umakanta-pradhan-2026-09"],
    showHairMediaCoverage: true,
  },
  "hairline-correction-bhubaneswar": {
    leadTopic: "receding hairline and hairline correction",
    resultConditions: [
      "Receding Hairline",
      "Male Temporal Recession",
      "Female Frontal Hairline Thinning",
    ],
    videoSlug: "receding-hairline-options",
    guide: {
      href: "/knowledge/crown-vs-hairline-graft-priority",
      label: "Crown and hairline graft-priority guide",
    },
    reviewIds: ["google-umakanta-pradhan-2026-09"],
    showHairMediaCoverage: true,
  },
  "hair-transplant-repair-bhubaneswar": {
    leadTopic: "a previous hair transplant concern",
    resultConditions: [],
    videoSlug: "hair-transplant-safety",
    guide: {
      href: "/knowledge/fue-vs-fut-hair-transplant",
      label: "FUE and FUT donor-planning guide",
    },
    reviewIds: ["google-umakanta-pradhan-2026-09"],
    showHairMediaCoverage: true,
  },
  "beard-moustache-transplant-bhubaneswar": {
    leadTopic: "beard or moustache transplant",
    resultConditions: ["Beard Transplant"],
    videoSlug: "hair-transplant-procedure-explained",
    guide: {
      href: "/knowledge/how-to-plan-hair-restoration",
      label: "Hair restoration planning guide",
    },
    reviewIds: ["google-umakanta-pradhan-2026-09"],
    showHairMediaCoverage: true,
  },
  "non-surgical-hair-replacement-bhubaneswar": {
    leadTopic: "hair patch or non-surgical hair replacement",
    resultConditions: [],
    videoSlug: "hair-patch-vs-hair-transplant",
    guide: {
      href: "/knowledge/hair-transplant-vs-hair-patch-vs-hair-wig",
      label: "Compare transplant, hair patch and hair wig",
    },
    reviewIds: [],
  },
  "alopecia-areata-treatment-bhubaneswar": {
    leadTopic: "patchy hair loss",
    resultConditions: [],
    videoSlug: "hair-loss-treatment-options",
    guide: {
      href: "/knowledge/hair-loss-causes-and-assessment",
      label: "Hair loss assessment guide",
    },
    reviewIds: ["google-sashi-kanta-parida-2026-09"],
  },
};
