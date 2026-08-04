import type { LucideIcon } from "lucide-react";

export type CmsFocalPoint = {
  x: number;
  y: number;
};

export type CmsImage = {
  src: string;
  alt: string;
  type?: string;
  id?: string;
  filename?: string;
  category?: string;
  role?: string;
  desktopUrl: string;
  mobileUrl?: string;
  thumbnailUrl?: string;
  fallbackUrl?: string;
  originalUrl?: string;
  altText: string;
  caption?: string;
  focalPoint?: CmsFocalPoint;
  placeholder?: boolean;
  placeholderAllowed?: boolean;
  credit?: string;
  lqip?: string;
  blurDataUrl?: string;
  usageLocation?: string;
  photographerSource?: string;
  permissionStatus?: string;
  sortOrder?: number;
  featured?: boolean;
  publish?: boolean;
  width?: number;
  height?: number;
  displayMode?: "cover" | "contain" | string;
  contentHash?: string;
  normalizedBasename?: string;
};

export type CmsStat = {
  value: string;
  label: string;
  description?: string;
  href?: string;
  external?: boolean;
  icon?: "youtube" | "patients" | "experience" | "location" | "recognition" | string;
};

export type CmsProofStat = CmsStat & {
  eyebrow?: string;
};

export type CmsTreatment = {
  slug: string;
  cluster: string;
  clusterLabel: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  duration: string;
  recovery: string;
  idealFor: string[];
  highlights: string[];
  icon: LucideIcon;
  accent: "bronze" | "blue" | "charcoal" | "coral" | "orchid" | "aqua";
  image?: CmsImage;
  seoTitle?: string;
  seoDescription?: string;
};

export type CmsCondition = {
  slug: string;
  title: string;
  summary: string;
  relatedTreatments: string[];
  signs: string[];
  image?: CmsImage;
  seoTitle?: string;
  seoDescription?: string;
};

export type CmsArticle = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  body: string[];
  image?: CmsImage;
  seoTitle?: string;
  seoDescription?: string;
};

export type CmsTestimonial = {
  name: string;
  context: string;
  quote: string;
};

export type CmsBeforeAfterCase = {
  slug: string;
  title: string;
  caseId?: string;
  treatmentCategory?: string;
  conditionName?: string;
  patientLabel?: string;
  treatment: string;
  note: string;
  resultSummary?: string;
  disclaimer?: string;
  timeGap?: string;
  featured?: boolean;
  patientConsentConfirmed?: boolean;
  faceBlurRequired?: boolean;
  frontBeforeImage?: CmsImage;
  frontAfterImage?: CmsImage;
  angle2BeforeImage?: CmsImage;
  angle2AfterImage?: CmsImage;
  primaryViewLabel?: string;
  secondaryViewLabel?: string;
  comparisonViews?: {
    label: string;
    before: CmsImage;
    after: CmsImage;
  }[];
  additionalViews?: {
    role: string;
    label: string;
    image: CmsImage;
  }[];
  beforeImage?: CmsImage;
  afterImage?: CmsImage;
  extraImages?: {
    role: string;
    label: string;
    image: CmsImage;
  }[];
};

export type CmsTransformationCategory = "hair" | "skin";

export type CmsTransformation = {
  id: string;
  title: string;
  category?: CmsTransformationCategory;
  conditionName?: string;
  publicTitle?: string;
  subtitle?: string;
  treatment: string;
  timeGap?: string;
  disclaimer?: string;
  beforeAfterPairs?: {
    viewLabel: string;
    before: CmsImage;
    after: CmsImage;
  }[];
  frontBefore?: CmsImage;
  frontAfter?: CmsImage;
  angleBefore?: CmsImage;
  angleAfter?: CmsImage;
  additionalImages?: CmsImage[];
  consentConfirmed?: boolean;
};

export type CmsMediaAsset = {
  id: string | number;
  filename?: string;
  category: string;
  role: string;
  title: string;
  altText: string;
  caption?: string;
  desktopUrl: string;
  mobileUrl?: string;
  thumbUrl?: string;
  fallbackUrl?: string;
  blurDataUrl?: string;
  focalPointX?: number;
  focalPointY?: number;
  placeholderAllowed?: boolean;
  sortOrder?: number;
  featured?: boolean;
  publish?: boolean;
};

export type CmsReview = {
  slug: string;
  reviewerName: string;
  reviewerInitials?: string;
  reviewText: string;
  rating: number;
  source?: string;
  sourceUrl?: string;
  treatmentCategory: string;
  reviewedAt?: string;
  permissionConfirmed?: boolean;
  featured?: boolean;
  screenshot?: CmsImage;
};

export type CmsMediaRequirement = {
  groupKey: string;
  groupLabel: string;
  requestKey: string;
  title: string;
  description?: string;
  idealDimension: string;
  minimumDimension: string;
  orientation: string;
  usageLocation: string;
  mediaType: string;
  status: "missing" | "uploaded" | "approved" | "needs_better_quality" | string;
  notes?: string;
  image?: CmsImage;
};

export type CmsSeoIndexEntry = {
  title: string;
  url: string;
  updatedAt?: string | null;
  categoryUrl?: string;
};

export type CmsSeoIndex = {
  staticRoutes: string[];
  treatments: CmsSeoIndexEntry[];
  conditions: CmsSeoIndexEntry[];
  articles: CmsSeoIndexEntry[];
  reviews: CmsSeoIndexEntry[];
  updatedAt?: string;
};

export type CmsVideoItem = {
  title: string;
  label: string;
  description: string;
  youtubeId?: string;
  href?: string;
  thumbnail?: CmsImage;
};

export type CmsGalleryImage = {
  title: string;
  category: string;
  caption: string;
  image: CmsImage;
  usageLocation?: string;
  sortOrder?: number;
};

export type CmsSocialLink = {
  platform: "instagram" | "youtube" | "google" | "facebook" | "linkedin" | string;
  label: string;
  handle?: string;
  url: string;
  ctaLabel: string;
  image?: CmsImage;
  sortOrder?: number;
};

export type CmsSocialStat = {
  platform: string;
  label: string;
  value?: string;
  sourceNote?: string;
};

export type CmsReviewSummary = {
  googleRating?: string;
  googleReviewCount?: string;
  googleMapsUrl?: string;
  featuredReviewExcerpts?: string[];
};

export type CmsMediaLogo = {
  title: string;
  label?: string;
  image?: CmsImage;
};

export type CmsRecognitionItem = {
  title: string;
  type: "award" | "badge" | "celebrity-moment" | "press" | "event" | string;
  description?: string;
  image?: CmsImage;
  badge?: CmsImage;
  sourceLink?: string;
  sortOrder?: number;
  displayMode?: "cover" | "contain" | string;
};

export type CmsHomepageMediaItem = {
  title: string;
  placement: string;
  image: CmsImage;
  mobileImage?: CmsImage;
  caption?: string;
  sortOrder?: number;
};

export type CmsAssistantSettings = {
  title: string;
  intro: string;
  disclaimer: string;
  quickPrompts: string[];
};

export type CmsJourneyStep = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export type CmsFaq = {
  question: string;
  answer: string;
};

export type CmsSiteSettings = {
  name: string;
  legalName: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp: string;
  email: string;
  doctor: string;
  tagline: string;
  hours: string;
  bookingUrl?: string;
  callbackLabel?: string;
  socialLinks?: CmsSocialLink[];
  socialStats?: CmsSocialStat[];
  reviewSummary?: CmsReviewSummary;
};

export type CmsDoctorProfile = {
  name: string;
  role: string;
  shortBio: string;
  authorityPoints: string[];
  image?: CmsImage;
  portraitFocalPoint?: CmsFocalPoint;
};

export type CmsLeadSource = "homepage_booking" | "chat_callback" | "cta";

export type CmsLeadPayload = {
  name: string;
  phone: string;
  concern: string;
  preferred_date?: string;
  message?: string;
  source: CmsLeadSource;
  page_url?: string;
};

export type CmsHomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  assistantTeaser: { label: string; text: string };
  heroImages: CmsImage[];
  stats: CmsStat[];
  proofStats: CmsProofStat[];
  whyChoose: { title: string; text: string }[];
  journey: CmsJourneyStep[];
  faqs: CmsFaq[];
};

export type CmsAssistantKnowledge = {
  settings: CmsAssistantSettings;
  faqs: CmsFaq[];
  quickPrompts: string[];
  serviceNotes?: string[];
};

export type CmsCollectionResponse<T> = T[] | { data?: T[]; items?: T[] };
export type CmsSingleResponse<T> = T | { data?: T; item?: T };

export type Treatment = CmsTreatment;
export type Condition = CmsCondition;
export type Article = CmsArticle;
export type Testimonial = CmsTestimonial;
export type Stat = CmsStat;
export type BeforeAfterCase = CmsBeforeAfterCase;
export type TransformationCategory = CmsTransformationCategory;
export type Transformation = CmsTransformation;
export type ProofStat = CmsProofStat;
export type VideoItem = CmsVideoItem;
export type GalleryImage = CmsGalleryImage;
export type MediaLogo = CmsMediaLogo;
export type RecognitionItem = CmsRecognitionItem;
export type HomepageMediaItem = CmsHomepageMediaItem;
export type Review = CmsReview;
export type MediaRequirement = CmsMediaRequirement;
export type SeoIndex = CmsSeoIndex;
export type AssistantSettings = CmsAssistantSettings;
export type ClinicSettings = CmsSiteSettings;
export type DoctorProfile = CmsDoctorProfile;
export type HomepageContent = CmsHomepageContent;
export type MediaAsset = CmsMediaAsset;
export type SocialLink = CmsSocialLink;
export type SocialStat = CmsSocialStat;
export type ReviewSummary = CmsReviewSummary;
export type LeadPayload = CmsLeadPayload;
export type LeadSource = CmsLeadSource;
