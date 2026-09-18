export type MediaCoverageTopic =
  | "hair-transplant"
  | "pigmentation";

export type MediaCoverageItem = {
  id: string;
  outletName: string;
  officialLogo: {
    src: string;
    sourceUrl: string;
    width: number;
    height: number;
  };
  articleTitle: string;
  publicationDate: string;
  originalArticleUrl: string;
  topic: MediaCoverageTopic;
  topicLabel: string;
  summary: string;
  backlinkPresent: boolean;
  currentBacklinkTarget?: string;
  desiredRadianceTarget: string;
  relatedPage: {
    href: string;
    label: string;
  };
  sourceRecord: string;
};

// These are the independently verified entries selected for the public page.
// The complete source-register and backlink review live in seo/media-import-records.json.
export const featuredMediaCoverage: MediaCoverageItem[] = [
  {
    id: "hindustan-bytes-hair-transplant-odisha",
    outletName: "Hindustan Bytes",
    officialLogo: {
      src: "/media-outlets/hindustan-bytes.webp",
      sourceUrl:
        "https://hindustanbytes.com/uploads/logo/logo_685e399ef3d593.png",
      width: 280,
      height: 54,
    },
    articleTitle:
      "Dr. Satyartha Prakash and the Evolution of Hair Transplantation in Odisha",
    publicationDate: "2026-09-14",
    originalArticleUrl:
      "https://hindustanbytes.com/dr-satyartha-prakash-and-the-evolution-of-hair-transplantation-in-odisha/",
    topic: "hair-transplant",
    topicLabel: "Hair Transplant",
    summary:
      "An external profile discussing Dr. Satyartha Prakash's hair-transplant work and the development of hair-restoration care in Odisha.",
    backlinkPresent: true,
    currentBacklinkTarget: "http://www.radianceclinics.com/",
    desiredRadianceTarget: "/hair-transplant-bhubaneswar",
    relatedPage: {
      href: "/hair-transplant-bhubaneswar",
      label: "Hair transplant care in Bhubaneswar",
    },
    sourceRecord: "SM 3208 Google Sheets",
  },
  {
    id: "entrepreneur-hunt-hair-transplant-odisha",
    outletName: "Entrepreneur Hunt",
    officialLogo: {
      src: "/media-outlets/entrepreneur-hunt.webp",
      sourceUrl:
        "https://entrepreneurhunt.com/uploads/logo/logo_677ff553f23d23.png",
      width: 280,
      height: 54,
    },
    articleTitle:
      "Dr. Satyartha Prakash and the Evolution of Hair Transplantation in Odisha",
    publicationDate: "2026-09-14",
    originalArticleUrl:
      "https://entrepreneurhunt.com/dr-satyartha-prakash-and-the-evolution-of-hair-transplantation-in-odisha/",
    topic: "hair-transplant",
    topicLabel: "Hair Transplant",
    summary:
      "An external feature covering the growth of doctor-led hair-transplant planning and restoration care in Odisha.",
    backlinkPresent: true,
    currentBacklinkTarget: "http://www.radianceclinics.com/",
    desiredRadianceTarget: "/hair-transplant-bhubaneswar",
    relatedPage: {
      href: "/hair-transplant-bhubaneswar",
      label: "Hair transplant care in Bhubaneswar",
    },
    sourceRecord: "SM 3208 Google Sheets",
  },
  {
    id: "hindustan-metro-pigmentation-skin-care",
    outletName: "Hindustan Metro",
    officialLogo: {
      src: "/media-outlets/hindustan-metro.webp",
      sourceUrl:
        "https://hindustanmetro.com/uploads/logo/favicon_69e4bdc74db0a5-24556124.png",
      width: 192,
      height: 128,
    },
    articleTitle:
      "Dr. Satyartha Prakash on the Changing Science of Pigmentation and Skin Care",
    publicationDate: "2026-09-16",
    originalArticleUrl:
      "https://hindustanmetro.com/dr-satyartha-prakash-on-the-changing-science-of-pigmentation-and-skin-care/",
    topic: "pigmentation",
    topicLabel: "Pigmentation & Skin Care",
    summary:
      "An external feature on diagnosis-led planning for pigmentation and skin-care concerns at Radiance Clinics.",
    backlinkPresent: true,
    currentBacklinkTarget: "https://www.radianceclinics.com",
    desiredRadianceTarget: "/pigmentation-treatment-bhubaneswar",
    relatedPage: {
      href: "/pigmentation-treatment-bhubaneswar",
      label: "Pigmentation treatment in Bhubaneswar",
    },
    sourceRecord: "Report_NWplus_170926 (1).pdf",
  },
  {
    id: "loktej-business-news-pigmentation-skin-care",
    outletName: "Loktej Business News",
    officialLogo: {
      src: "/media-outlets/loktej-business-news.webp",
      sourceUrl:
        "https://english.loktej.com/media/2023-02/loktej-english-new-square-logo.jpg",
      width: 128,
      height: 128,
    },
    articleTitle:
      "Dr. Satyartha Prakash on the Changing Science of Pigmentation and Skin Care",
    publicationDate: "2026-09-16",
    originalArticleUrl:
      "https://english.loktej.com/article/32498/dr--satyartha-prakash-on-the-changing-science-of-pigmentation-and-skin-care/",
    topic: "pigmentation",
    topicLabel: "Pigmentation & Skin Care",
    summary:
      "An external feature considering why assessment matters before treatment selection for pigmentation and uneven skin tone.",
    backlinkPresent: false,
    desiredRadianceTarget: "/pigmentation-treatment-bhubaneswar",
    relatedPage: {
      href: "/pigmentation-treatment-bhubaneswar",
      label: "Pigmentation treatment in Bhubaneswar",
    },
    sourceRecord: "Report_NWplus_170926 (1).pdf",
  },
];

export const featuredMediaOutlets = Array.from(
  new Map(
    featuredMediaCoverage.map((item) => [item.outletName, item]),
  ).values(),
);
