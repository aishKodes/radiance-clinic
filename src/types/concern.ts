export type EditorialStatus =
  | "DRAFT"
  | "READY_FOR_MEDICAL_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "NEEDS_UPDATE";

export type MedicalReviewStatus =
  | "DRAFT"
  | "EDITORIAL_REVIEW"
  | "MEDICAL_REVIEW"
  | "MEDICALLY_REVIEWED"
  | "PUBLISHED"
  | "NEEDS_REVIEW";

export type ConcernFaq = {
  question: string;
  answer: string;
};
export type ConcernCategory = {
  slug: string;
  label: string;
  shortDescription: string;
  introduction: string[];
  issueGroups: string[];
  relatedTreatments: { href: string; label: string }[];
  usefulGuides: { href: string; label: string }[];
  featuredConcernSlugs: string[];
  indexable: true;
};

export type Concern = {
  slug: string;
  categorySlug: string;
  title: string;
  shortName: string;
  aliases: string[];
  patientLanguageTerms: string[];
  primaryIntent: string;
  secondaryIntents: string[];
  summary: string;
  definition: string;
  commonSigns: string[];
  possibleCauses: string[];
  whatPatientsOftenNotice: string[];
  howItIsAssessed: string[];
  whenToSeekProfessionalAdvice: string[];
  treatmentApproaches: string[];
  clinicTreatments: { href: string; label: string }[];
  whatNotToDo: string[];
  preventionOrCare: string[];
  expectedCourse: string[];
  faq: ConcernFaq[];
  doctorAnswers: string[];
  relatedConcerns: string[];
  relatedArticles: { href: string; label: string }[];
  references: string[];
  preparedBy: string;
  authorType?: "editorial-team" | "doctor";
  authorId?: string;
  reviewedBy?: string;
  reviewerId?: string;
  reviewedAt?: string;
  medicalReviewStatus?: MedicalReviewStatus;
  sourceType?: "original" | "legacy" | "youtube" | "mixed";
  legacySources?: string[];
  youtubeSources?: string[];
  publishedAt?: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  medicalReviewRequired: boolean;
  status: EditorialStatus;
  indexable: boolean;
  featured: boolean;
  searchTerms: string[];
};

export type DoctorAnswer = {
  slug: string;
  question: string;
  categorySlug: string;
  conciseAnswer: string;
  explanation: string[];
  whenEvaluationMayHelp: string;
  relatedConcern: string;
  relatedTreatment?: { href: string; label: string };
  relatedGuide?: { href: string; label: string };
  relatedQuestions: string[];
  similarQuestionCount?: number;
  preparedBy: string;
  authorType?: "editorial-team" | "doctor";
  authorId?: string;
  reviewedBy?: string;
  reviewerId?: string;
  reviewedAt?: string;
  medicalReviewStatus?: MedicalReviewStatus;
  sourceType?: "original" | "legacy" | "youtube" | "mixed";
  legacySources?: string[];
  youtubeSources?: string[];
  references?: string[];
  publishedAt?: string;
  updatedAt: string;
  status: EditorialStatus;
  indexable: boolean;
};
