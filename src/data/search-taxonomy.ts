export type TaxonomyLink = {
  href: string;
  label: string;
  description: string;
};

export type TreatmentHub = {
  slug: "hair-restoration" | "skin" | "laser" | "aesthetic-dermatology";
  label: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  overview: string[];
  decisionPoints: string[];
  treatmentPaths: string[];
  conditionPaths: string[];
  articlePaths: string[];
  commercialPaths: string[];
  resultsHref: string;
};

export const treatmentHubs: TreatmentHub[] = [
  {
    slug: "hair-restoration",
    label: "Hair Restoration",
    eyebrow: "Hair and scalp care",
    title: "Hair Restoration & Hair Loss Treatments",
    metaTitle: "Hair Restoration & Hair Loss Treatments | Radiance Clinics",
    metaDescription:
      "Explore doctor-led hair-loss assessment, FUE hair transplant planning and scalp-support options at Radiance Clinics in Bhubaneswar.",
    summary:
      "Hair restoration starts by understanding the pattern, pace and cause of hair loss before comparing surgical and non-surgical options.",
    overview: [
      "A hair-loss consultation reviews shedding, scalp health, density pattern, medical history and donor capacity where surgery is being considered.",
      "Treatment selection depends on the diagnosis and long-term plan. Hair transplant, PRP or GFC scalp therapy and medical support are not interchangeable pathways.",
    ],
    decisionPoints: [
      "Current shedding and progression",
      "Scalp health and density pattern",
      "Donor-area suitability where relevant",
      "Realistic maintenance and restoration goals",
    ],
    treatmentPaths: [
      "/treatments/hair-restoration/fue-hair-transplant",
      "/treatments/hair-restoration/prp-gfc-scalp-therapy",
      "/treatments/hair-restoration/advanced-hair-fall-solutions",
    ],
    conditionPaths: ["/conditions/hair-fall-thinning"],
    articlePaths: ["/knowledge/how-to-plan-hair-restoration"],
    commercialPaths: ["/hair-transplant-bhubaneswar"],
    resultsHref: "/results#hair-transplant-results",
  },
  {
    slug: "skin",
    label: "Skin Treatments",
    eyebrow: "Concern-led dermatology",
    title: "Skin Treatments & Dermatology Consultations",
    metaTitle: "Skin Treatments & Dermatology Care | Radiance Clinics",
    metaDescription:
      "Explore consultation-led care for acne scars, pigmentation, melasma, skin texture and event skin planning in Bhubaneswar.",
    summary:
      "Skin treatment planning begins with the concern, skin type, current barrier health and factors that may affect recurrence or recovery.",
    overview: [
      "Acne scars, pigmentation, melasma and changes in skin texture can require different combinations of medical care, devices and home-care support.",
      "The clinic evaluates active concerns and treatment tolerance before discussing a staged plan. No single procedure is presented as suitable for every skin type.",
    ],
    decisionPoints: [
      "Active skin concerns and current products",
      "Skin type and pigment-response risk",
      "Barrier health and previous procedures",
      "Downtime tolerance and treatment goals",
    ],
    treatmentPaths: [
      "/treatments/skin-laser/acne-scar-revision",
      "/treatments/skin-wellness/bridal-glow-protocol",
    ],
    conditionPaths: [
      "/conditions/acne-acne-scars",
      "/conditions/pigmentation-melasma",
    ],
    articlePaths: ["/knowledge/laser-skin-treatments-safety"],
    commercialPaths: [
      "/skin-clinic-bhubaneswar",
      "/acne-scar-treatment-bhubaneswar",
      "/pigmentation-treatment-bhubaneswar",
    ],
    resultsHref: "/results#skin-results",
  },
  {
    slug: "laser",
    label: "Laser Treatments",
    eyebrow: "Device-led care",
    title: "Laser Treatments for Hair Reduction & Pigmentation",
    metaTitle: "Laser Treatments in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Understand laser hair reduction and pigmentation treatment planning with skin-type assessment, preparation and aftercare guidance.",
    summary:
      "Laser devices and settings are selected around skin type, treatment area, pigment risk and the specific concern being treated.",
    overview: [
      "Laser hair reduction and laser-based pigmentation care have different goals, preparation requirements and response patterns.",
      "A consultation establishes suitability, explains expected variability and identifies when treatment should be delayed or another approach considered.",
    ],
    decisionPoints: [
      "Skin type and treatment area",
      "Current tanning, irritation or medication",
      "Device suitability and calibrated settings",
      "Preparation, spacing and aftercare",
    ],
    treatmentPaths: [
      "/treatments/skin-laser/laser-hair-reduction",
      "/treatments/skin-laser/laser-pigmentation-program",
    ],
    conditionPaths: ["/conditions/pigmentation-melasma"],
    articlePaths: ["/knowledge/laser-skin-treatments-safety"],
    commercialPaths: [
      "/laser-hair-removal-bhubaneswar",
      "/pigmentation-treatment-bhubaneswar",
    ],
    resultsHref: "/results#skin-results",
  },
  {
    slug: "aesthetic-dermatology",
    label: "Aesthetic Dermatology",
    eyebrow: "Consultation-led aesthetics",
    title: "Aesthetic Dermatology & Facial Planning",
    metaTitle: "Aesthetic Dermatology in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Explore conservative aesthetic consultation and injectable planning focused on facial anatomy, movement and proportion.",
    summary:
      "Aesthetic planning at Radiance Clinics focuses on proportion, expression and a conservative assessment of what may be appropriate.",
    overview: [
      "Facial ageing, volume change and skin-quality concerns do not all require the same treatment. Consultation separates skin care, device-based options and injectable planning.",
      "Recommendations are based on anatomy, movement, medical history and the patient’s priorities rather than a fixed package.",
    ],
    decisionPoints: [
      "The concern and desired degree of change",
      "Facial movement and proportion",
      "Medical history and previous procedures",
      "Limitations, recovery and maintenance",
    ],
    treatmentPaths: [
      "/treatments/aesthetic-dermatology/injectable-aesthetics",
    ],
    conditionPaths: ["/conditions/skin-ageing-laxity"],
    articlePaths: ["/knowledge/premium-aesthetic-consultation"],
    commercialPaths: ["/skin-clinic-bhubaneswar"],
    resultsHref: "/results#skin-results",
  },
];

export const treatmentHubBySlug = new Map(
  treatmentHubs.map((hub) => [hub.slug, hub]),
);

export const treatmentHubRoutes = treatmentHubs.map(
  (hub) => `/treatments/${hub.slug}`,
);

type ContentRelationships = {
  hub: string;
  conditions: string[];
  treatments: string[];
  articles: string[];
  results: string;
  commercial: string[];
};

const hairRelationships: ContentRelationships = {
  hub: "/treatments/hair-restoration",
  conditions: ["/conditions/hair-fall-thinning"],
  treatments: treatmentHubs[0].treatmentPaths,
  articles: treatmentHubs[0].articlePaths,
  results: treatmentHubs[0].resultsHref,
  commercial: treatmentHubs[0].commercialPaths,
};

const skinRelationships: ContentRelationships = {
  hub: "/treatments/skin",
  conditions: [
    "/conditions/acne-acne-scars",
    "/conditions/pigmentation-melasma",
  ],
  treatments: treatmentHubs[1].treatmentPaths,
  articles: treatmentHubs[1].articlePaths,
  results: treatmentHubs[1].resultsHref,
  commercial: treatmentHubs[1].commercialPaths,
};

const laserRelationships: ContentRelationships = {
  hub: "/treatments/laser",
  conditions: ["/conditions/pigmentation-melasma"],
  treatments: treatmentHubs[2].treatmentPaths,
  articles: treatmentHubs[2].articlePaths,
  results: treatmentHubs[2].resultsHref,
  commercial: treatmentHubs[2].commercialPaths,
};

const aestheticRelationships: ContentRelationships = {
  hub: "/treatments/aesthetic-dermatology",
  conditions: ["/conditions/skin-ageing-laxity"],
  treatments: treatmentHubs[3].treatmentPaths,
  articles: treatmentHubs[3].articlePaths,
  results: treatmentHubs[3].resultsHref,
  commercial: treatmentHubs[3].commercialPaths,
};

export const relationshipByPath: Record<string, ContentRelationships> = {
  "/treatments/hair-restoration/fue-hair-transplant": hairRelationships,
  "/treatments/hair-restoration/prp-gfc-scalp-therapy": hairRelationships,
  "/treatments/hair-restoration/advanced-hair-fall-solutions": hairRelationships,
  "/conditions/hair-fall-thinning": hairRelationships,
  "/knowledge/how-to-plan-hair-restoration": hairRelationships,
  "/hair-transplant-bhubaneswar": hairRelationships,
  "/treatments/skin-laser/acne-scar-revision": skinRelationships,
  "/treatments/skin-wellness/bridal-glow-protocol": skinRelationships,
  "/conditions/acne-acne-scars": skinRelationships,
  "/acne-scar-treatment-bhubaneswar": skinRelationships,
  "/skin-clinic-bhubaneswar": skinRelationships,
  "/treatments/skin-laser/laser-hair-reduction": laserRelationships,
  "/treatments/skin-laser/laser-pigmentation-program": laserRelationships,
  "/conditions/pigmentation-melasma": laserRelationships,
  "/knowledge/laser-skin-treatments-safety": laserRelationships,
  "/laser-hair-removal-bhubaneswar": laserRelationships,
  "/pigmentation-treatment-bhubaneswar": laserRelationships,
  "/treatments/aesthetic-dermatology/injectable-aesthetics": aestheticRelationships,
  "/conditions/skin-ageing-laxity": aestheticRelationships,
  "/knowledge/premium-aesthetic-consultation": aestheticRelationships,
};

export function relationshipsFor(path: string) {
  return relationshipByPath[path];
}

export function hubForTreatmentPath(path: string) {
  return treatmentHubs.find((hub) => hub.treatmentPaths.includes(path));
}

export function hubForConditionPath(path: string) {
  return treatmentHubs.find((hub) => hub.conditionPaths.includes(path));
}
