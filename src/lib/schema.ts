import { fallbackData } from "@/data/fallback";
import {
  absoluteUrl,
  clinicIdentity,
  defaultSocialImage,
  schemaIds,
  socialProfiles,
} from "@/lib/seo-config";
import type { Article, ClinicSettings } from "@/types/cms";

type JsonLd = Record<string, unknown>;

export function safeJsonLd(data: JsonLd) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function postalAddress(settings: ClinicSettings): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: clinicIdentity.streetAddress,
    addressLocality: settings.city,
    addressRegion: settings.region,
    postalCode: clinicIdentity.postalCode,
    addressCountry: clinicIdentity.countryCode,
  };
}

function telephoneNumbers(settings: ClinicSettings) {
  return [settings.landline, settings.phone, settings.secondaryPhone].filter(
    Boolean,
  );
}

export function organizationJsonLd(
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": schemaIds.organization,
    name: settings.legalName,
    alternateName: clinicIdentity.shortName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/radiance-logo.png"),
    },
    email: settings.email,
    telephone: telephoneNumbers(settings),
    sameAs: socialProfiles.map((profile) => profile.href),
  };
}

export function medicalClinicJsonLd(
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": schemaIds.clinic,
    name: settings.legalName,
    alternateName: clinicIdentity.shortName,
    url: absoluteUrl("/"),
    image: absoluteUrl(defaultSocialImage),
    telephone: telephoneNumbers(settings),
    email: settings.email,
    address: postalAddress(settings),
    parentOrganization: { "@id": schemaIds.organization },
    sameAs: socialProfiles.map((profile) => profile.href),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": schemaIds.website,
    name: clinicIdentity.shortName,
    url: absoluteUrl("/"),
    publisher: { "@id": schemaIds.organization },
    inLanguage: "en-IN",
  };
}

export function physicianJsonLd(
  settings: ClinicSettings = fallbackData.siteSettings,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": schemaIds.physician,
    name: settings.doctor,
    url: absoluteUrl("/about"),
    worksFor: { "@id": schemaIds.clinic },
    address: postalAddress(settings),
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
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.clinic },
    inLanguage: "en-IN",
  };
}

export function collectionPageJsonLd({
  title,
  description,
  path,
  itemPaths,
}: {
  title: string;
  description: string;
  path: string;
  itemPaths: string[];
}): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.clinic },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemPaths.map((itemPath, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(itemPath),
      })),
    },
    inLanguage: "en-IN",
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
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    areaServed: {
      "@type": "City",
      name: settings.city,
    },
    provider: { "@id": schemaIds.clinic },
  };
}

export function articleJsonLd(article: Article): JsonLd {
  const url = absoluteUrl(`/knowledge/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    image: article.image
      ? absoluteUrl(article.image.src || article.image.desktopUrl)
      : undefined,
    author: article.authorName
      ? { "@type": "Person", name: article.authorName }
      : { "@id": schemaIds.organization },
    publisher: { "@id": schemaIds.organization },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.reviewedAt,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    inLanguage: "en-IN",
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
      item: absoluteUrl(item.path),
    })),
  };
}
