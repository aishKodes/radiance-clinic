export type EditorialStatus =
  | "DRAFT"
  | "READY_FOR_MEDICAL_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "NEEDS_UPDATE";

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
  reviewedBy?: string;
  reviewedAt?: string;
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
  reviewedBy?: string;
  reviewedAt?: string;
  updatedAt: string;
  status: EditorialStatus;
  indexable: boolean;
};
