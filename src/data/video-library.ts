import { youtubeVideos } from "@/data/youtube-library.generated";
import type { YouTubeVideo } from "@/types/video-library";

export { youtubeVideos };

export const featuredVideoId = "8qYMw935MF8";

const educationTypes = new Set([
  "DOCTOR_EXPLANATION",
  "TREATMENT_EXPLAINER",
  "PATIENT_EDUCATION",
  "RECOVERY",
  "FAQ",
  "PROCEDURE",
]);

export const publicEducationalVideos = youtubeVideos.filter(
  (video) => educationTypes.has(video.contentType) && !video.needsManualReview,
);

export const videoLibraryVideos = [...publicEducationalVideos].sort((left, right) => {
  if (left.videoId === featuredVideoId) return -1;
  if (right.videoId === featuredVideoId) return 1;
  return String(right.publishedAt || "").localeCompare(String(left.publishedAt || ""));
});

export const videoTopics = Array.from(
  new Set(videoLibraryVideos.map((video) => video.primaryTopic)),
).sort((left, right) => left.localeCompare(right));

function videoScore(video: YouTubeVideo, path: string) {
  let score = video.embedPriority === "HIGH" ? 20 : video.embedPriority === "MEDIUM" ? 10 : 0;
  if (video.primaryDestination === path) score += 80;
  if (video.secondaryDestinations.includes(path)) score += 50;
  if (path.includes("hair-transplant") && video.primaryTopic === "Hair Transplant") score += 30;
  if (path.includes("hair-loss") && video.primaryTopic === "Hair Loss") score += 30;
  if (path.includes("acne-scar") && video.primaryTopic === "Acne Scars") score += 30;
  if (path.includes("/acne") && video.primaryTopic === "Acne") score += 30;
  if (path.includes("pigment") && video.primaryTopic === "Pigmentation") score += 30;
  if (path.includes("laser-hair") && video.primaryTopic === "Laser Hair Reduction") score += 30;
  return score;
}

export function videosForPath(path: string, limit = 2) {
  return publicEducationalVideos
    .map((video) => ({ video, score: videoScore(video, path) }))
    .filter((item) => item.score >= 20)
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.video.publishedAt || "").localeCompare(left.video.publishedAt || ""),
    )
    .slice(0, limit)
    .map((item) => item.video);
}

export function formatVideoDuration(durationSeconds?: number) {
  if (!durationSeconds) return "";
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}
