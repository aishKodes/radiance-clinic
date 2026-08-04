import { fallbackData } from "@/data/fallback";
import { siteUrl } from "@/lib/utils";
import type { Article, ClinicSettings, Review } from "@/types/cms";

type JsonLd = Record<string, unknown>;

export function safeJsonLd(data: JsonLd) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function medicalClinicJsonLd(
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: settings.legalName,
    url: siteUrl,
    telephone: [settings.phone, settings.secondaryPhone].filter(Boolean),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: "IN",
    },
    medicalSpecialty: [
      "Dermatology",
      "Cosmetic Dermatology",
      "Hair Restoration",
      "Laser Aesthetic Medicine",
    ],
    founder: {
      "@type": "Person",
      name: settings.doctor,
      jobTitle: "Doctor",
    },
    openingHours: "Mo-Sa 10:00-19:00",
    priceRange: "$$",
  };
}

export function physicianJsonLd(
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: settings.doctor,
    url: `${siteUrl}/about`,
    worksFor: {
      "@type": "MedicalClinic",
      name: settings.legalName,
      url: siteUrl,
    },
    medicalSpecialty: [
      "Dermatology",
      "Cosmetic Dermatology",
      "Hair Restoration",
      "Laser Aesthetic Medicine",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: "IN",
    },
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteUrl}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: fallbackData.siteSettings.name,
      url: siteUrl,
    },
  };
}

export function medicalServiceJsonLd({
  name,
  description,
  path,
  settings = fallbackData.siteSettings,
}: {
  name: string;
  description: string;
  path: string;
  settings?: ClinicSettings;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${path}`,
    areaServed: {
      "@type": "City",
      name: settings.city,
    },
    provider: {
      "@type": "MedicalClinic",
      name: settings.legalName,
      url: siteUrl,
      telephone: [settings.phone, settings.secondaryPhone].filter(Boolean),
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: settings.city,
        addressRegion: settings.region,
        addressCountry: "IN",
      },
    },
  };
}

export function articleJsonLd(article: Article): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    author: {
      "@type": "Person",
      name: fallbackData.siteSettings.doctor,
    },
    publisher: {
      "@type": "Organization",
      name: fallbackData.siteSettings.name,
    },
    mainEntityOfPage: `${siteUrl}/knowledge/${article.slug}`,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function reviewJsonLd(
  review: Review,
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `Radiance Clinics review - ${review.treatmentCategory}`,
    reviewBody: review.reviewText,
    datePublished: review.reviewedAt,
    author: {
      "@type": "Person",
      name: review.reviewerName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      "@type": "MedicalClinic",
      name: settings.legalName,
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: settings.city,
        addressRegion: settings.region,
        addressCountry: "IN",
      },
    },
  };
}

export function faqJsonLd(
  items: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
