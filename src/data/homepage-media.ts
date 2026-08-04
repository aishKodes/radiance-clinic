import {
  Activity,
  Droplets,
  ScanFace,
  Sparkles,
  Syringe,
  WandSparkles,
  Zap,
} from "lucide-react";
import { realBeforeAfterCases } from "@/data/media-manifest";
import {
  beforeAfterCasesToTransformations,
  localPublicImage,
} from "@/lib/transformations";
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

export type TreatmentCategoryTab = {
  id: "skin" | "hair" | "laser" | "aesthetics";
  label: string;
  title: string;
  description: string;
  href: string;
  image: CmsImage;
  procedures: string[];
};

const premiumVisualBase = "/radiance-media-processed/landscape";

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

export const doctorPatientHeroImage = visualImage(
  "radiance-smiling-patient-hero.webp",
  "Smiling Radiance Clinics patient",
  "hero-support",
);

export const premiumHeroSupportImages = [
  imageFromPublic({
    src: "/radiance-media-processed/landscape/radiance-doctor-satyarth-with-patient-01.webp",
    alt: "Dr. Satyarth Prakash with a Radiance Clinics patient",
    id: "radiance-doctor-satyarth-with-patient-01",
    category: "hero-support",
    role: "doctor-consultation-support",
  }),
];

export const anilKapoorRecognitionImage = imageFromPublic({
  src: "/radiance-media-processed/landscape/radiance-hero-anil-kapoor-feature-01.webp",
  alt: "Dr. Satyarth Prakash at a recognition event with Anil Kapoor",
  id: "radiance-hero-anil-kapoor-feature-01",
  category: "recognition",
  role: "event-recognition-feature",
});

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
    summary: "Doctor-led care for active acne, marks and acne scar concerns.",
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
    summary: "Regenerative hair and scalp support using doctor-guided therapy.",
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
    href: "/skin-clinic-bhubaneswar",
    image: visualImage(
      "radiance-skin-rejuvenation-service.webp",
      "Skin consultation and rejuvenation treatment",
      "category-tab-visual",
    ),
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
    href: "/hair-transplant-bhubaneswar",
    image: imageFromPublic({
      src: "/radiance-media-processed/landscape/radiance-doctor-satyarth-consultation-01new.webp",
      alt: "Hair restoration consultation with Dr. Satyarth Prakash",
      id: "radiance-doctor-satyarth-consultation-01new",
      category: "doctor-consultation",
      role: "category-tab-visual",
    }),
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
    href: "/laser-hair-removal-bhubaneswar",
    image: imageFromPublic({
      src: "/radiance-media-processed/landscape/radiance-equipment-laser-machines-01.webp",
      alt: "Laser treatment equipment at Radiance Clinics",
      id: "radiance-equipment-laser-machines-01",
      category: "clinic-equipment",
      role: "category-tab-visual",
    }),
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
    href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
    image: visualImage(
      "radiance-botox-fillers-service.webp",
      "Doctor-led injectable aesthetic treatment",
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

const transformationExamples =
  beforeAfterCasesToTransformations(realBeforeAfterCases);

export const hairTransformationExamples: Transformation[] =
  transformationExamples.filter((item) => item.category === "hair");

export const skinTransformationExamples: Transformation[] =
  transformationExamples.filter((item) => item.category === "skin");
