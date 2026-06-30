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
    credit: "Temporary Pexels placeholder",
  };
}

export const placeholderImages = {
  clinicTexture: placeholderImage({
    src: "https://images.pexels.com/photos/10521230/pexels-photo-10521230.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder aesthetic clinic detail image",
    caption: "Temporary editorial clinic texture image.",
  }),
  skinLaser: placeholderImage({
    src: "https://images.pexels.com/photos/16571739/pexels-photo-16571739.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder premium laser and skin care visual",
    caption: "Temporary skin and laser treatment visual.",
  }),
  hairRestoration: placeholderImage({
    src: "https://images.pexels.com/photos/11024139/pexels-photo-11024139.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder hair restoration consultation visual",
    caption: "Temporary hair restoration and consultation visual.",
  }),
  treatmentRoom: placeholderImage({
    src: "https://images.pexels.com/photos/7108264/pexels-photo-7108264.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder treatment room image",
    caption: "Temporary clinic room and care environment image.",
  }),
  knowledge: placeholderImage({
    src: "https://images.pexels.com/photos/7446690/pexels-photo-7446690.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder clinical knowledge article visual",
    caption: "Temporary knowledge library editorial image.",
  }),
  aestheticCare: placeholderImage({
    src: "https://images.pexels.com/photos/5619463/pexels-photo-5619463.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Placeholder aesthetic dermatology visual",
    caption: "Temporary aesthetic dermatology visual.",
  }),
  clinicAmbience: placeholderImage({
    src: "https://images.pexels.com/photos/10521230/pexels-photo-10521230.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Temporary placeholder for Radiance Clinics ambience photography",
    caption: "Temporary ambience image; replace with original Radiance photography.",
  }),
  equipment: placeholderImage({
    src: "https://images.pexels.com/photos/16571739/pexels-photo-16571739.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Temporary placeholder for clinic equipment and treatment technology",
    caption: "Temporary equipment image; replace from the custom admin gallery.",
  }),
  consultation: placeholderImage({
    src: "https://images.pexels.com/photos/7108264/pexels-photo-7108264.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Temporary placeholder for consultation and patient care experience",
    caption: "Temporary consultation visual for the clinic journey.",
  }),
} satisfies Record<string, MediaAsset>;
