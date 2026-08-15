export type VideoContentType =
  | "DOCTOR_EXPLANATION"
  | "TREATMENT_EXPLAINER"
  | "PATIENT_EDUCATION"
  | "HAIR_TRANSPLANT_RESULT"
  | "SKIN_RESULT"
  | "PATIENT_TESTIMONIAL"
  | "PROCEDURE"
  | "RECOVERY"
  | "FAQ"
  | "CLINIC_TOUR"
  | "MEDIA_APPEARANCE"
  | "AWARD"
  | "EVENT"
  | "SHORT"
  | "PROMOTIONAL"
  | "OUTDATED"
  | "DUPLICATE"
  | "OTHER";

export type YouTubeVideo = {
  videoId: string;
  url: string;
  title: string;
  description: string;
  publishedAt?: string;
  duration?: string;
  durationSeconds?: number;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  viewCount?: number;
  likeCount?: number;
  playlist?: string;
  contentType: VideoContentType;
  primaryTopic: string;
  secondaryTopics: string[];
  treatment?: string;
  concern?: string;
  doctor?: string;
  location?: string;
  patientCase?: string;
  searchIntent: string;
  primaryDestination: string;
  secondaryDestinations: string[];
  embedPriority: "HIGH" | "MEDIUM" | "LOW";
  transcriptAvailable: boolean;
  captionsAvailable: boolean;
  isShort: boolean;
  needsManualReview: boolean;
};
