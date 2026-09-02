export type GoogleReviewItem = {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  publishedAt?: string;
  relativePublishedAt?: string;
  reviewerProfileUrl?: string;
  sourceUrl: string;
};

export type GoogleReviewsFeed = {
  source: "business-profile" | "places" | "verified-snapshot" | "unavailable";
  rating?: number;
  totalReviewCount?: number;
  verifiedAt?: string;
  googleMapsUrl: string;
  reviews: GoogleReviewItem[];
};
