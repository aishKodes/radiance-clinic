import {
  Activity,
  Droplets,
  ScanFace,
  Sparkles,
  Syringe,
  WandSparkles,
  Zap,
} from "lucide-react";
import { localPublicImage } from "@/lib/transformations";
import type { CmsImage, Transformation, Treatment } from "@/types/cms";

type ServiceCardInput = {
  title: string;
  summary: string;
  slug: string;
  cluster: string;
  clusterLabel: string;
  image: string;
  icon: Treatment["icon"];
  accent: Treatment["accent"];
};

type TransformationInput = {
  id: string;
  category: "hair" | "skin";
  conditionName: string;
  title: string;
  publicTitle: string;
  treatment: string;
  before: string;
  after: string;
  viewLabel?: string;
  subtitle: string;
};

export type TreatmentCategoryTab = {
  id: "skin" | "hair" | "laser" | "aesthetics";
  label: string;
  title: string;
  description: string;
  image: CmsImage;
  procedures: string[];
};

const premiumVisualBase = "/radiance-premium-visuals/webp";
const hairBase = "/radiance-hair-before-after";
const additionalHairBase = "/radiance-additional-hair-before-after";
const skinSeparatedBase = "/radiance-skin-before-after-separated%202";
const skinNextBase = "/radiance-next-5-skin-before-after";

function imageFromPublic({
  src,
  alt,
  id,
  category,
  role,
}: {
  src: string;
  alt: string;
  id: string;
  category: string;
  role: string;
}): CmsImage {
  return localPublicImage({ src, alt, id, category, role });
}

function visualImage(filename: string, title: string, role: string) {
  return imageFromPublic({
    src: `${premiumVisualBase}/${filename}`,
    alt: `${title} at Radiance Clinics`,
    id: filename.replace(/\.[^.]+$/, ""),
    category: role,
    role,
  });
}

function serviceCard({
  title,
  summary,
  slug,
  cluster,
  clusterLabel,
  image,
  icon,
  accent,
}: ServiceCardInput): Treatment {
  return {
    slug,
    cluster,
    clusterLabel,
    title,
    eyebrow: clusterLabel,
    summary,
    description: summary,
    duration: "Learn More",
    recovery: "Discussed during consultation",
    idealFor: [],
    highlights: [],
    icon,
    accent,
    image: visualImage(image, title, "generic-service-card"),
  };
}

function transformation({
  id,
  category,
  conditionName,
  title,
  publicTitle,
  treatment,
  before,
  after,
  viewLabel = "Front View",
  subtitle,
}: TransformationInput): Transformation {
  return {
    id,
    category,
    conditionName,
    title,
    publicTitle,
    subtitle,
    treatment,
    timeGap: "Timeline discussed during consultation",
    beforeAfterPairs: [
      {
        viewLabel,
        before: imageFromPublic({
          src: before,
          alt: `${publicTitle} before treatment`,
          id: `${id}-before`,
          category: `${category}-before-after`,
          role: `${viewLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-before`,
        }),
        after: imageFromPublic({
          src: after,
          alt: `${publicTitle} after treatment`,
          id: `${id}-after`,
          category: `${category}-before-after`,
          role: `${viewLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-after`,
        }),
      },
    ],
    additionalImages: [],
    consentConfirmed: true,
    disclaimer:
      "Results vary by individual. Images are shared with consent. A consultation is required.",
  };
}

export const doctorPatientHeroImage = visualImage(
  "radiance-smiling-patient-hero.webp",
  "Smiling Radiance Clinics patient",
  "hero-support",
);

export const premiumHeroSupportImages = [
  imageFromPublic({
    src: "/radiance-media-processed/hero-desktop/radiance-doctor-satyarth-with-patient-01.webp",
    alt: "Dr. Satyarth Prakash with a Radiance Clinics patient",
    id: "radiance-doctor-satyarth-with-patient-01",
    category: "hero-support",
    role: "doctor-consultation-support",
  }),
];

export const premiumServiceCards: Treatment[] = [
  serviceCard({
    title: "Hair Transplant",
    summary:
      "Natural-looking hair restoration planned by experienced specialists.",
    slug: "fue-hair-transplant",
    cluster: "hair-restoration",
    clusterLabel: "Hair Restoration",
    image: "radiance-hair-transplant-service.webp",
    icon: Activity,
    accent: "bronze",
  }),
  serviceCard({
    title: "Laser Hair Removal",
    summary:
      "Advanced laser reduction for smoother skin and long-term convenience.",
    slug: "laser-hair-reduction",
    cluster: "skin-laser",
    clusterLabel: "Laser",
    image: "radiance-laser-hair-removal-service.webp",
    icon: Zap,
    accent: "aqua",
  }),
  serviceCard({
    title: "Acne & Acne Scar",
    summary:
      "Doctor-led care for active acne, marks and acne scar concerns.",
    slug: "acne-scar-revision",
    cluster: "skin-laser",
    clusterLabel: "Skin",
    image: "radiance-acne-scar-service.webp",
    icon: ScanFace,
    accent: "orchid",
  }),
  serviceCard({
    title: "Botox & Fillers",
    summary:
      "Refined aesthetic treatments for facial balance and rejuvenation.",
    slug: "injectable-aesthetics",
    cluster: "aesthetic-dermatology",
    clusterLabel: "Aesthetics",
    image: "radiance-botox-fillers-service.webp",
    icon: Syringe,
    accent: "coral",
  }),
  serviceCard({
    title: "Pigmentation",
    summary:
      "Personalised treatment planning for pigmentation, melasma and uneven tone.",
    slug: "laser-pigmentation-program",
    cluster: "skin-laser",
    clusterLabel: "Skin",
    image: "radiance-pigmentation-melasma-service.webp",
    icon: WandSparkles,
    accent: "aqua",
  }),
  serviceCard({
    title: "Skin Rejuvenation",
    summary: "Modern skin treatments for glow, texture and freshness.",
    slug: "bridal-glow-protocol",
    cluster: "skin-wellness",
    clusterLabel: "Skin Wellness",
    image: "radiance-skin-rejuvenation-service.webp",
    icon: Sparkles,
    accent: "orchid",
  }),
  serviceCard({
    title: "PRP Therapy",
    summary:
      "Regenerative hair and scalp support using doctor-guided therapy.",
    slug: "prp-gfc-scalp-therapy",
    cluster: "hair-restoration",
    clusterLabel: "Hair Restoration",
    image: "radiance-prp-hair-therapy-service.webp",
    icon: Droplets,
    accent: "bronze",
  }),
  serviceCard({
    title: "Anti Ageing",
    summary:
      "Subtle, personalised care for lines, firmness and youthful skin quality.",
    slug: "injectable-aesthetics",
    cluster: "aesthetic-dermatology",
    clusterLabel: "Aesthetics",
    image: "radiance-anti-ageing-service.webp",
    icon: Sparkles,
    accent: "coral",
  }),
];

export const treatmentCategoryTabs: TreatmentCategoryTab[] = [
  {
    id: "skin",
    label: "Skin",
    title: "Skin Treatment Options",
    description:
      "Doctor-led care for acne, scars, pigmentation, redness, pores and skin quality.",
    image: visualImage("radiance-skin-category.webp", "Skin treatments", "category-tab-visual"),
    procedures: [
      "Acne",
      "Acne Scars",
      "Pigmentation",
      "Melasma",
      "Dark Circles",
      "Open Pores",
      "Skin Rejuvenation",
      "Mole / Wart / Skin Tag",
      "Rosacea / Redness",
      "Dull Skin",
    ],
  },
  {
    id: "hair",
    label: "Hair",
    title: "Hair Treatment Options",
    description:
      "Hair transplant, hair fall and regenerative scalp support planned around diagnosis.",
    image: visualImage("radiance-hair-category.webp", "Hair treatments", "category-tab-visual"),
    procedures: [
      "Hair Transplant",
      "FUE Hair Transplant",
      "Hair Fall",
      "Male Pattern Baldness",
      "Crown Thinning",
      "Receding Hairline",
      "PRP / GFC Therapy",
      "Beard Transplant",
      "Female Hair Thinning",
      "Hairline Correction",
    ],
  },
  {
    id: "laser",
    label: "Laser",
    title: "Laser Treatment Options",
    description:
      "Skin-type aware laser treatments with preparation, aftercare and realistic planning.",
    image: visualImage("radiance-laser-category.webp", "Laser treatments", "category-tab-visual"),
    procedures: [
      "Laser Hair Removal",
      "Laser Toning",
      "Carbon Laser Peel",
      "Fractional CO2 Laser",
      "MNRF for Acne Scars",
      "Tattoo Removal",
      "Laser Pigmentation Treatment",
      "Laser Skin Resurfacing",
      "Underarm Laser Reduction",
      "Photo Facial",
    ],
  },
  {
    id: "aesthetics",
    label: "Aesthetics",
    title: "Aesthetic Treatment Options",
    description:
      "Subtle facial rejuvenation and injectable planning focused on balance and restraint.",
    image: visualImage(
      "radiance-aesthetics-category.webp",
      "Aesthetic treatments",
      "category-tab-visual",
    ),
    procedures: [
      "Botox",
      "Dermal Fillers",
      "Anti Ageing",
      "Facial Rejuvenation",
      "Thread Lift",
      "Under Eye Rejuvenation",
      "Bridal Dermatology",
      "Skin Tightening",
      "Lip Enhancement",
      "Cheek Enhancement",
    ],
  },
];

export const hairTransformationExamples: Transformation[] = [
  transformation({
    id: "hair-beard-transplant",
    category: "hair",
    conditionName: "Beard Transplant",
    title: "Beard Transplant Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${hairBase}/01-beard-transplant/before_beard_transplant.webp`,
    after: `${hairBase}/01-beard-transplant/after_beard_transplant.webp`,
    subtitle: "Beard transplant example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-receding-hairline",
    category: "hair",
    conditionName: "Receding Hairline",
    title: "Receding Hairline Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${hairBase}/02-receding-hairline/before_receding_hairline.webp`,
    after: `${hairBase}/02-receding-hairline/after_receding_hairline.webp`,
    subtitle: "Hairline restoration example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-female-pattern-hair-loss",
    category: "hair",
    conditionName: "Female Pattern Hair Loss",
    title: "Female Hair Thinning Transformation",
    publicTitle: "Hair Fall Improvement",
    treatment: "Hair Restoration",
    before: `${hairBase}/03-female-pattern-hair-loss/before_female_pattern_hair_loss.webp`,
    after: `${hairBase}/03-female-pattern-hair-loss/after_female_pattern_hair_loss.webp`,
    subtitle: "Female hair thinning example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-crown-hair-transplant",
    category: "hair",
    conditionName: "Crown Hair Transplant",
    title: "Crown Hair Transplant Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${hairBase}/04-crown-hair-transplant/before_crown_hair_transplant.webp`,
    after: `${hairBase}/04-crown-hair-transplant/after_crown_hair_transplant.webp`,
    viewLabel: "Crown View",
    subtitle: "Crown hair transplant example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-frontal-mid-scalp-hair-transplant",
    category: "hair",
    conditionName: "Frontal and Mid-Scalp Hair Transplant",
    title: "Frontal and Mid-Scalp Hair Transplant Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${hairBase}/05-frontal-mid-scalp-hair-transplant/before_frontal_mid_scalp_hair_transplant.webp`,
    after: `${hairBase}/05-frontal-mid-scalp-hair-transplant/after_frontal_mid_scalp_hair_transplant.webp`,
    subtitle:
      "Frontal and mid-scalp transplant example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-male-temporal-recession",
    category: "hair",
    conditionName: "Male Temporal Recession",
    title: "Male Temporal Recession Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${additionalHairBase}/01-male-temporal-recession/before_male_temporal_recession.webp`,
    after: `${additionalHairBase}/01-male-temporal-recession/after_male_temporal_recession.webp`,
    subtitle: "Temporal recession example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-male-diffuse-frontal-thinning",
    category: "hair",
    conditionName: "Male Diffuse Frontal Thinning",
    title: "Male Diffuse Frontal Thinning Transformation",
    publicTitle: "Hair Fall Improvement",
    treatment: "Hair Restoration",
    before: `${additionalHairBase}/02-male-diffuse-frontal-thinning/before_male_diffuse_frontal_thinning.webp`,
    after: `${additionalHairBase}/02-male-diffuse-frontal-thinning/after_male_diffuse_frontal_thinning.webp`,
    subtitle:
      "Diffuse frontal thinning example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-female-frontal-hairline-thinning",
    category: "hair",
    conditionName: "Female Frontal Hairline Thinning",
    title: "Female Frontal Hairline Thinning Transformation",
    publicTitle: "Hair Fall Improvement",
    treatment: "Hair Restoration",
    before: `${additionalHairBase}/03-female-frontal-hairline-thinning/before_female_frontal_hairline_thinning.webp`,
    after: `${additionalHairBase}/03-female-frontal-hairline-thinning/after_female_frontal_hairline_thinning.webp`,
    subtitle:
      "Female frontal hairline thinning example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-advanced-male-pattern-baldness",
    category: "hair",
    conditionName: "Advanced Male Pattern Baldness",
    title: "Advanced Male Pattern Baldness Transformation",
    publicTitle: "Hair Transplant Transformation",
    treatment: "Hair Transplant",
    before: `${additionalHairBase}/04-advanced-male-pattern-baldness/before_advanced_male_pattern_baldness.webp`,
    after: `${additionalHairBase}/04-advanced-male-pattern-baldness/after_advanced_male_pattern_baldness.webp`,
    subtitle:
      "Advanced male pattern baldness example using matched before-and-after images.",
  }),
  transformation({
    id: "hair-female-widening-part",
    category: "hair",
    conditionName: "Female Widening Part",
    title: "Female Widening Part Transformation",
    publicTitle: "Hair Fall Improvement",
    treatment: "Hair Restoration",
    before: `${additionalHairBase}/05-female-widening-part/before_female_widening_part.webp`,
    after: `${additionalHairBase}/05-female-widening-part/after_female_widening_part.webp`,
    subtitle: "Female widening part example using matched before-and-after images.",
  }),
];

export const skinTransformationExamples: Transformation[] = [
  transformation({
    id: "skin-acne-scars",
    category: "skin",
    conditionName: "Acne Scars",
    title: "Acne Scar Improvement",
    publicTitle: "Acne Scar Improvement",
    treatment: "Acne Scar Treatment",
    before: `${skinSeparatedBase}/02-acne-scars/before_acne_scars.webp`,
    after: `${skinSeparatedBase}/02-acne-scars/after_acne_scars.webp`,
    subtitle: "Acne scar improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-pigmentation",
    category: "skin",
    conditionName: "Pigmentation",
    title: "Pigmentation Improvement",
    publicTitle: "Pigmentation Improvement",
    treatment: "Pigmentation Treatment",
    before: `${skinSeparatedBase}/03-pigmentation/before_pigmentation.webp`,
    after: `${skinSeparatedBase}/03-pigmentation/after_pigmentation.webp`,
    subtitle: "Pigmentation improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-melasma",
    category: "skin",
    conditionName: "Melasma",
    title: "Melasma Improvement",
    publicTitle: "Melasma Improvement",
    treatment: "Pigmentation Treatment",
    before: `${skinSeparatedBase}/04-melasma/before_melasma.webp`,
    after: `${skinSeparatedBase}/04-melasma/after_melasma.webp`,
    subtitle: "Melasma improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-uneven-skin-tone",
    category: "skin",
    conditionName: "Uneven Skin Tone",
    title: "Skin Rejuvenation Example",
    publicTitle: "Skin Rejuvenation Example",
    treatment: "Skin Rejuvenation",
    before: `${skinNextBase}/01-uneven-skin-tone/before_uneven_skin_tone.webp`,
    after: `${skinNextBase}/01-uneven-skin-tone/after_uneven_skin_tone.webp`,
    subtitle: "Skin rejuvenation example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-acne",
    category: "skin",
    conditionName: "Acne",
    title: "Acne Improvement",
    publicTitle: "Skin Improvement Example",
    treatment: "Acne Treatment",
    before: `${skinSeparatedBase}/01-acne/before_acne.webp`,
    after: `${skinSeparatedBase}/01-acne/after_acne.webp`,
    subtitle: "Acne improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-dark-circles",
    category: "skin",
    conditionName: "Dark Circles",
    title: "Dark Circles Improvement",
    publicTitle: "Skin Improvement Example",
    treatment: "Under Eye Rejuvenation",
    before: `${skinSeparatedBase}/05-dark-circles/before_dark_circles.webp`,
    after: `${skinSeparatedBase}/05-dark-circles/after_dark_circles.webp`,
    subtitle: "Dark circles improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-open-pores",
    category: "skin",
    conditionName: "Open Pores",
    title: "Open Pores Improvement",
    publicTitle: "Skin Rejuvenation Example",
    treatment: "Skin Rejuvenation",
    before: `${skinSeparatedBase}/06-open-pores/before_open_pores.webp`,
    after: `${skinSeparatedBase}/06-open-pores/after_open_pores.webp`,
    subtitle: "Open pores improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-rosacea-redness",
    category: "skin",
    conditionName: "Rosacea / Redness",
    title: "Redness Improvement",
    publicTitle: "Skin Improvement Example",
    treatment: "Redness Treatment",
    before: `${skinNextBase}/02-rosacea-redness/before_rosacea_redness.webp`,
    after: `${skinNextBase}/02-rosacea-redness/after_rosacea_redness.webp`,
    subtitle: "Redness improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-facial-mole",
    category: "skin",
    conditionName: "Facial Mole",
    title: "Facial Mole Treatment Example",
    publicTitle: "Skin Improvement Example",
    treatment: "Mole Treatment",
    before: `${skinNextBase}/03-facial-mole/before_facial_mole.webp`,
    after: `${skinNextBase}/03-facial-mole/after_facial_mole.webp`,
    subtitle: "Facial mole treatment example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-oily-skin",
    category: "skin",
    conditionName: "Oily Skin",
    title: "Oily Skin Improvement",
    publicTitle: "Skin Rejuvenation Example",
    treatment: "Skin Treatment",
    before: `${skinNextBase}/04-oily-skin/before_oily_skin.webp`,
    after: `${skinNextBase}/04-oily-skin/after_oily_skin.webp`,
    subtitle: "Oily skin improvement example using matched before-and-after images.",
  }),
  transformation({
    id: "skin-skin-tags",
    category: "skin",
    conditionName: "Skin Tags",
    title: "Skin Tag Treatment Example",
    publicTitle: "Skin Improvement Example",
    treatment: "Skin Tag Treatment",
    before: `${skinNextBase}/05-skin-tags/before_skin_tags.webp`,
    after: `${skinNextBase}/05-skin-tags/after_skin_tags.webp`,
    subtitle: "Skin tag treatment example using matched before-and-after images.",
  }),
];
