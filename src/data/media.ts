import type { CmsImage } from "@/types/cms";

export type MediaAsset = CmsImage;

function placeholderImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}): MediaAsset {
  return {
    src,
    alt,
    desktopUrl: src,
    mobileUrl: src,
    thumbnailUrl: src,
    fallbackUrl: src,
    altText: alt,
    caption,
    focalPoint: { x: 0.5, y: 0.5 },
    placeholder: true,
    placeholderAllowed: true,
    credit: "Editorial reference image",
  };
}

export const placeholderImages = {
  clinicTexture: placeholderImage({
    src: "https://images.pexels.com/photos/10521230/pexels-photo-10521230.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Refined aesthetic clinic detail image",
    caption: "Editorial clinic texture image.",
  }),
  skinLaser: placeholderImage({
    src: "https://images.pexels.com/photos/16571739/pexels-photo-16571739.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Premium laser and skin care visual",
    caption: "Skin and laser treatment visual.",
  }),
  hairRestoration: placeholderImage({
    src: "https://images.pexels.com/photos/11024139/pexels-photo-11024139.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Hair restoration consultation visual",
    caption: "Hair restoration and consultation visual.",
  }),
  treatmentRoom: placeholderImage({
    src: "https://images.pexels.com/photos/7108264/pexels-photo-7108264.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Treatment room image",
    caption: "Clinic room and care environment image.",
  }),
  knowledge: placeholderImage({
    src: "https://images.pexels.com/photos/7446690/pexels-photo-7446690.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Clinical knowledge article visual",
    caption: "Knowledge library editorial image.",
  }),
  aestheticCare: placeholderImage({
    src: "https://images.pexels.com/photos/5619463/pexels-photo-5619463.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Aesthetic dermatology visual",
    caption: "Aesthetic dermatology visual.",
  }),
  clinicAmbience: placeholderImage({
    src: "https://images.pexels.com/photos/10521230/pexels-photo-10521230.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Radiance Clinics ambience visual",
    caption: "Clinic ambience image.",
  }),
  equipment: placeholderImage({
    src: "https://images.pexels.com/photos/16571739/pexels-photo-16571739.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Clinic equipment and treatment technology",
    caption: "Clinic equipment image.",
  }),
  consultation: placeholderImage({
    src: "https://images.pexels.com/photos/7108264/pexels-photo-7108264.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Consultation and patient care experience",
    caption: "Consultation visual for patient care.",
  }),
} satisfies Record<string, MediaAsset>;
