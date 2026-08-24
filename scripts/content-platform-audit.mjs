import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function lineCount(relativePath) {
  return (await read(relativePath)).trim().split(/\r?\n/).length;
}

async function main() {
  const videos = JSON.parse(await read("content/platform/youtube-source.json"));
  const provenance = JSON.parse(await read("content/platform/legacy-provenance.json"));
  const migratedGuides = JSON.parse(await read("content/platform/migrated-guide-provenance.json"));
  const today = new Date().toISOString().slice(0, 10);

  check(videos.length >= 180, `Expected at least 180 accessible YouTube videos; found ${videos.length}.`);
  check(new Set(videos.map((video) => video.videoId)).size === videos.length, "Duplicate YouTube video IDs found.");
  for (const video of videos) {
    check(/^[A-Za-z0-9_-]{11}$/.test(video.videoId), `Invalid YouTube ID: ${video.videoId}`);
    check(video.url?.startsWith("https://"), `Invalid YouTube URL for ${video.videoId}.`);
    check(video.thumbnail?.startsWith("https://"), `Invalid thumbnail for ${video.videoId}.`);
    check(Boolean(video.title), `Missing title for ${video.videoId}.`);
    check(Boolean(video.description), `Missing description for ${video.videoId}.`);
    check(video.primaryDestination?.startsWith("/"), `Invalid destination for ${video.videoId}.`);
    check(Array.isArray(video.secondaryDestinations), `Missing secondary destinations for ${video.videoId}.`);
    if (video.publishedAt) {
      check(validDate(video.publishedAt), `Invalid video date for ${video.videoId}.`);
      check(video.publishedAt <= today, `Future video date for ${video.videoId}: ${video.publishedAt}.`);
    }
    if (video.duration) check(/^PT(?=\d|T)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/.test(video.duration), `Invalid ISO duration for ${video.videoId}.`);
  }

  check(provenance.length === 300, `Expected 300 legacy provenance records; found ${provenance.length}.`);
  check(provenance.every((item) => /^[a-f0-9]{64}$/.test(item.bodySha256)), "Legacy body hashes are incomplete.");
  check(provenance.every((item) => item.medicalReviewer === "Dr. Satyarth Prakash"), "Legacy review attribution is incomplete.");
  check(provenance.filter((item) => item.sourceBucket === "REJECTED").every((item) => item.recommendedAction === "ARCHIVE"), "Rejected legacy sources must stay archived.");
  check(migratedGuides.length === 6, `Expected six curated migrated guides; found ${migratedGuides.length}.`);
  check(migratedGuides.every((item) => item.reviewedBy === "Dr. Satyarth Prakash" && validDate(item.displayPublishedAt)), "Migrated-guide review or publication dates are incomplete.");

  check((await lineCount("seo/youtube-video-inventory.csv")) === videos.length + 1, "YouTube inventory CSV count does not match source JSON.");
  check((await lineCount("seo/youtube-content-map.csv")) === videos.length + 1, "YouTube mapping CSV count does not match source JSON.");
  check((await lineCount("seo/legacy-content-master-inventory.csv")) === provenance.length + 1, "Legacy inventory CSV count does not match provenance JSON.");
  check((await lineCount("seo/historical-content-dates.csv")) === provenance.length + 1, "Historical-date report count does not match legacy provenance.");
  const medicalReviewQueue = await read("seo/medical-review-queue.csv");
  check(
    medicalReviewQueue.trim().split(/\r?\n/).length === provenance.length + 4,
    "Medical-review queue count does not match legacy provenance and commercial review pages.",
  );
  for (const route of [
    "/botox-treatment-bhubaneswar",
    "/dermal-fillers-bhubaneswar",
    "/tattoo-removal-bhubaneswar",
  ]) {
    check(
      medicalReviewQueue.includes(`${route},`) &&
        medicalReviewQueue.includes("READY_FOR_MEDICAL_REVIEW"),
      `${route} is missing from the medical-review queue.`,
    );
  }

  const generatedLibrary = await read("src/data/youtube-library.generated.ts");
  check(generatedLibrary.includes("satisfies YouTubeVideo[]"), "Generated typed video library is missing.");
  const routeManifest = JSON.parse(await read("seo/route-manifest.json"));
  check(routeManifest.indexableRoutes.some((route) => route.path === "/videos"), "/videos is absent from the route manifest.");

  if (failures.length) {
    console.error(`Content-platform audit failed (${failures.length}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  const counts = Object.fromEntries(
    [...new Set(videos.map((video) => video.primaryTopic))]
      .sort()
      .map((topic) => [topic, videos.filter((video) => video.primaryTopic === topic).length]),
  );
  console.log("Content-platform audit passed.");
  console.log(JSON.stringify({ videos: videos.length, legacyRecords: provenance.length, videoTopics: counts }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
