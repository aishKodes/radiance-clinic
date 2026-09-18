import { fallbackData } from "@/data/fallback";
import {
  absoluteUrl,
  clinicIdentity,
  defaultSocialImage,
  schemaIds,
  socialProfiles,
} from "@/lib/seo-config";
import type { Article, ClinicSettings } from "@/types/cms";
import type { YouTubeVideo } from "@/types/video-library";
import type { MediaCoverageItem } from "@/data/media-coverage";
import { radianceEditorialTeam, satyarthPrakash } from "@/data/doctor";

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
    "@type": ["Person", "Physician"],
    "@id": schemaIds.doctor,
    name: satyarthPrakash.name,
    url: absoluteUrl(satyarthPrakash.profilePath),
    image: absoluteUrl(
      satyarthPrakash.profileImage.src ||
        satyarthPrakash.profileImage.desktopUrl,
    ),
    jobTitle: satyarthPrakash.role,
    description: satyarthPrakash.bio,
    knowsAbout: satyarthPrakash.clinicalAreas.map((area) => area.label),
    worksFor: { "@id": schemaIds.clinic },
    address: postalAddress(settings),
  };
}

export function editorialTeamJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": schemaIds.editorialTeam,
    name: radianceEditorialTeam.name,
    url: absoluteUrl(radianceEditorialTeam.policyPath),
    parentOrganization: { "@id": schemaIds.organization },
  };
}

export function doctorProfilePageJsonLd(): JsonLd {
  const url = absoluteUrl(satyarthPrakash.profilePath);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    name: `${satyarthPrakash.name} at Radiance Clinics`,
    url,
    isPartOf: { "@id": schemaIds.website },
    mainEntity: { "@id": schemaIds.doctor },
    about: [{ "@id": schemaIds.doctor }, { "@id": schemaIds.clinic }],
    inLanguage: "en-IN",
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
  medicalReview = false,
}: {
  title: string;
  description: string;
  path: string;
  medicalReview?: boolean;
}): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": medicalReview ? "MedicalWebPage" : "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.clinic },
    ...(medicalReview ? { reviewedBy: { "@id": schemaIds.doctor } } : {}),
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

export function mediaCoverageCollectionJsonLd(
  items: MediaCoverageItem[],
): JsonLd {
  const path = "/media";
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: "Radiance in the Media",
    description:
      "Verified external coverage of Dr. Satyarth Prakash and Radiance Clinics.",
    url,
    isPartOf: { "@id": schemaIds.website },
    about: [{ "@id": schemaIds.clinic }, { "@id": schemaIds.doctor }],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.outletName}: ${item.articleTitle}`,
        url: item.originalArticleUrl,
        item: {
          "@type": "CreativeWork",
          name: item.articleTitle,
          url: item.originalArticleUrl,
          datePublished: item.publicationDate,
          publisher: {
            "@type": "Organization",
            name: item.outletName,
          },
        },
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
  const authoredByDoctor = article.authorType === "doctor";
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
    author: authoredByDoctor
      ? { "@id": schemaIds.doctor }
      : {
          "@id": schemaIds.editorialTeam,
          "@type": "Organization",
          name: article.authorName || radianceEditorialTeam.name,
          url: absoluteUrl(radianceEditorialTeam.policyPath),
        },
    reviewedBy: { "@id": schemaIds.doctor },
    publisher: { "@id": schemaIds.organization },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.reviewedAt,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    inLanguage: "en-IN",
  };
}

export function videoObjectJsonLd(video: YouTubeVideo): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${absoluteUrl("/videos")}#video-${video.videoId}`,
    name: video.title,
    description: video.description || `${video.primaryTopic} video from Radiance Clinics.`,
    thumbnailUrl: [video.thumbnail],
    uploadDate: video.publishedAt,
    duration: video.duration,
    contentUrl: video.url,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    publisher: { "@id": schemaIds.organization },
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
