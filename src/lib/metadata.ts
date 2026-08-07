import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage } from "@/lib/seo-config";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  index?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  imageAlt = "Radiance Clinics in Bhubaneswar",
  type = "website",
  index = true,
}: PageMetadata): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: "Radiance Clinics",
      locale: "en_IN",
      images: [{ url: socialImage, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
