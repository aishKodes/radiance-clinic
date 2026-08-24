import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const channelHandle = "https://www.youtube.com/@RadianceClinics/videos";
const channelId = "UCOVCxAsGI2NIyWgwzzBenJA";
const channelTitle = "Radiance Clinic";
const sourcePath = path.join(root, "content", "platform", "youtube-source.json");

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(";") : String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n";
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function decodeXml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function isoDate(value) {
  const text = String(value || "");
  if (/^\d{8}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

function isoDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return undefined;
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const remaining = rounded % 60;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${remaining || (!hours && !minutes) ? `${remaining}S` : ""}`;
}

function topicFor(text) {
  if (/acne scar|pimple scar|mnrf|micro.?need|subcision|co2 laser/.test(text)) return "Acne Scars";
  if (/acne|pimple|blackhead|whitehead/.test(text)) return "Acne";
  if (/hair transplant|graft|donor area|hairline|fue|fut|transplanted hair/.test(text)) return "Hair Transplant";
  if (/hair loss|hair fall|hairfall|alopecia|dandruff|scalp|prp|gfc|hair regrowth|grey hair|white hair/.test(text)) return "Hair Loss";
  if (/laser hair|hair removal|unwanted hair|facial hair|underarm hair|body hair/.test(text)) return "Laser Hair Reduction";
  if (/pigment|melasma|dark spot|dark circle|tan|skin tone/.test(text)) return "Pigmentation";
  if (/botox|botulinum toxin/.test(text)) return "Botox";
  if (/dermal filler|facial filler|\bfillers?\b/.test(text)) return "Dermal Fillers";
  if (/tattoo removal|remove tattoo/.test(text)) return "Tattoo Removal";
  if (/injectable|wrinkle|anti.?aging|anti.?ageing|facelift|hifu|ultherapy|volume loss/.test(text)) return "Aesthetic Dermatology";
  if (/stretch mark|keloid|scar/.test(text)) return "Scars & Stretch Marks";
  if (/wart|mole|rosacea|vitiligo|skin tag/.test(text)) return "General Skin Concerns";
  if (/skin|facial|peel|laser|glow|hydra/.test(text)) return "Skin Health";
  if (/clinic|radiance|award|media|interview/.test(text)) return "Clinic & Doctor";
  return "Other";
}

function destinationsFor(topic, contentType) {
  const values = {
    "Hair Transplant": ["/hair-transplant-bhubaneswar", "/concerns/hair-transplant", "/treatments/hair-restoration/fue-hair-transplant"],
    "Hair Loss": ["/concerns/hair-loss-scalp", "/treatments/hair-restoration/advanced-hair-fall-solutions", "/knowledge/how-to-plan-hair-restoration"],
    Acne: ["/concerns/acne", "/skin-clinic-bhubaneswar", "/doctor-answers/why-acne-keeps-returning"],
    "Acne Scars": ["/acne-scar-treatment-bhubaneswar", "/concerns/acne-scars", "/treatments/skin-laser/acne-scar-revision"],
    Pigmentation: ["/pigmentation-treatment-bhubaneswar", "/concerns/pigmentation", "/treatments/skin-laser/laser-pigmentation-program"],
    "Laser Hair Reduction": ["/laser-hair-removal-bhubaneswar", "/concerns/laser-hair-reduction", "/treatments/skin-laser/laser-hair-reduction"],
    "Aesthetic Dermatology": ["/treatments/aesthetic-dermatology/injectable-aesthetics", "/concerns/aging-aesthetics", "/knowledge/premium-aesthetic-consultation"],
    Botox: ["/botox-treatment-bhubaneswar", "/treatments/aesthetic-dermatology/injectable-aesthetics", "/concerns/aging-aesthetics/forehead-lines"],
    "Dermal Fillers": ["/dermal-fillers-bhubaneswar", "/treatments/aesthetic-dermatology/injectable-aesthetics", "/concerns/aging-aesthetics/facial-volume-loss"],
    "Tattoo Removal": ["/tattoo-removal-bhubaneswar", "/treatments/laser", "/skin-clinic-bhubaneswar"],
    "Scars & Stretch Marks": ["/concerns/scars-stretch-marks", "/skin-clinic-bhubaneswar", "/knowledge/laser-skin-treatments-safety"],
    "General Skin Concerns": ["/concerns/other-skin-concerns", "/skin-clinic-bhubaneswar", "/doctor-answers/when-should-mole-be-checked"],
    "Skin Health": ["/skin-clinic-bhubaneswar", "/concerns/skin-texture", "/knowledge/skin-care-doctor-bhubaneswar"],
    "Clinic & Doctor": ["/about", "/videos", "/contact"],
    Other: ["/videos", "/knowledge", "/concerns"],
  }[topic] || ["/videos", "/knowledge", "/concerns"];
  if (["HAIR_TRANSPLANT_RESULT", "SKIN_RESULT", "PATIENT_TESTIMONIAL"].includes(contentType)) return ["/results", ...values.slice(0, 2)];
  return values;
}

function classify(raw) {
  const title = normalize(raw.title);
  const description = normalize(raw.description);
  const titleText = title.toLowerCase();
  const descriptionText = description.toLowerCase();
  const text = `${titleText} ${descriptionText}`;
  const durationSeconds = Number(raw.durationSeconds || raw.duration || 0) || undefined;
  const isShort = Boolean(raw.webpage_url?.includes("/shorts/")) || /#shorts?\b/.test(text) || (durationSeconds ? durationSeconds <= 60 : false);
  const titleTopic = topicFor(titleText);
  const topic = ["Other", "Clinic & Doctor"].includes(titleTopic)
    ? topicFor(descriptionText)
    : titleTopic;
  let contentType = "PATIENT_EDUCATION";
  if (/before.?after|result|testimonial|patient experience|transformation/.test(titleText)) contentType = topic === "Hair Transplant" ? "HAIR_TRANSPLANT_RESULT" : "SKIN_RESULT";
  else if (/dr\.?\s*satyarth|dr\.?\s*satyartha|doctor explains|explained by doctor|expert explains/.test(text)) contentType = "DOCTOR_EXPLANATION";
  else if (/after.?care|recovery|day by day|post.?operative|do.s and don.ts/.test(text)) contentType = "RECOVERY";
  else if (/procedure|surgery|live treatment|how .* works/.test(text)) contentType = "PROCEDURE";
  else if (/clinic tour|inside radiance|our clinic/.test(text)) contentType = "CLINIC_TOUR";
  else if (/award|honou?r|recognition/.test(text)) contentType = "AWARD";
  else if (/interview|news|media|television|tv/.test(text)) contentType = "MEDIA_APPEARANCE";
  else if (/^(can|does|do|is|are|why|what|when|how)\b/.test(titleText) || /\?$/.test(title)) contentType = "FAQ";
  else if (/treatment|therapy|laser|transplant|facial|peel/.test(text)) contentType = "TREATMENT_EXPLAINER";
  else if (isShort) contentType = "SHORT";
  if (raw.id === "8qYMw935MF8") contentType = "DOCTOR_EXPLANATION";
  const destinations = destinationsFor(topic, contentType);
  const explicitDoctor = /dr\.?\s*satyarth|dr\.?\s*satyartha|satyarth prakash|satyartha prakash/.test(text);
  const captionsAvailable = Boolean(
    raw.captionsAvailable ||
      Object.keys(raw.subtitles || {}).length ||
      Object.keys(raw.automatic_captions || {}).length,
  );
  const needsManualReview = ["HAIR_TRANSPLANT_RESULT", "SKIN_RESULT", "PATIENT_TESTIMONIAL", "PROMOTIONAL", "OUTDATED"].includes(contentType) || /100%|guarantee|permanent cure|best in india/.test(text);
  const priority = raw.id === "8qYMw935MF8" || ["DOCTOR_EXPLANATION", "RECOVERY", "FAQ", "TREATMENT_EXPLAINER"].includes(contentType) ? "HIGH" : isShort ? "LOW" : "MEDIUM";
  return {
    videoId: raw.id,
    url: raw.webpage_url || raw.original_url || `https://www.youtube.com/watch?v=${raw.id}`,
    title,
    description: (description || `${topic} video from Radiance Clinics.`).slice(0, 420),
    fullDescription: description,
    publishedAt: isoDate(raw.upload_date || raw.release_date || raw.timestamp),
    duration: isoDuration(durationSeconds),
    durationSeconds,
    thumbnail: raw.thumbnail || `https://i.ytimg.com/vi/${raw.id}/hqdefault.jpg`,
    channelId: raw.channel_id || channelId,
    channelTitle: normalize(raw.channel || raw.uploader || channelTitle),
    viewCount: Number.isFinite(raw.view_count) ? raw.view_count : undefined,
    likeCount: Number.isFinite(raw.like_count) ? raw.like_count : undefined,
    playlist: normalize(raw.playlist_title || ""),
    contentType,
    primaryTopic: topic,
    secondaryTopics: [],
    treatment: destinations.find((value) => value.startsWith("/treatments/")) || "",
    concern: destinations.find((value) => value.startsWith("/concerns/")) || "",
    doctor: explicitDoctor ? "Dr. Satyarth Prakash" : "",
    location: /bhubaneswar|odisha/.test(text) ? "Bhubaneswar, Odisha" : "",
    patientCase: ["HAIR_TRANSPLANT_RESULT", "SKIN_RESULT", "PATIENT_TESTIMONIAL"].includes(contentType) ? "candidate-only" : "",
    searchIntent: contentType === "RECOVERY" ? "recovery guidance" : contentType.includes("RESULT") ? "result research" : `${topic.toLowerCase()} education`,
    primaryDestination: destinations[0],
    secondaryDestinations: destinations.slice(1, 3),
    embedPriority: priority,
    transcriptAvailable: Boolean(
      raw.transcriptAvailable || Object.keys(raw.subtitles || {}).length,
    ),
    captionsAvailable,
    isShort,
    needsManualReview,
  };
}

async function hasExecutable(name) {
  try {
    await execFileAsync("which", [name]);
    return true;
  } catch {
    return false;
  }
}

async function fromNdjson(inputPath) {
  const text = await readFile(inputPath, "utf8");
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function fetchWithYtDlp() {
  const { stdout } = await execFileAsync(
    "yt-dlp",
    ["--flat-playlist", "--skip-download", "--ignore-errors", "--no-warnings", "--dump-json", channelHandle],
    { maxBuffer: 1024 * 1024 * 32 },
  );
  return stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function fetchFeed() {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!response.ok) throw new Error(`YouTube feed returned ${response.status}`);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
  const text = (source, tag) => decodeXml(
    source
      .match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]
      ?.replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim(),
  );
  return entries.map((entry) => {
    const id = text(entry, "yt:videoId");
    return {
      id,
      title: text(entry, "title"),
      description: text(entry, "media:description"),
      upload_date: text(entry, "published")?.replace(/\D/g, "").slice(0, 8),
      webpage_url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: entry.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1],
      channel_id: channelId,
      channel: channelTitle,
    };
  });
}

async function main() {
  const inputIndex = process.argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? path.resolve(process.argv[inputIndex + 1]) : process.env.YOUTUBE_METADATA_FILE;
  let rawVideos;
  let retrieval;
  const existing = JSON.parse(await readFile(sourcePath, "utf8").catch(() => "[]"));
  const existingById = new Map(existing.map((video) => [video.videoId, video]));
  if (inputPath) {
    rawVideos = await fromNdjson(inputPath);
    retrieval = "yt-dlp metadata export supplied to --input";
  } else if (await hasExecutable("yt-dlp")) {
    rawVideos = await fetchWithYtDlp();
    const feedById = new Map(
      (await fetchFeed().catch(() => [])).map((video) => [video.id, video]),
    );
    rawVideos = rawVideos.map((video) => ({
      ...video,
      ...(feedById.get(video.id) || {}),
    }));
    retrieval = "yt-dlp public metadata merged with official channel RSS";
  } else {
    const feedVideos = await fetchFeed();
    const merged = new Map(existing.map((video) => [video.videoId, video]));
    for (const raw of feedVideos) merged.set(raw.id, classify(raw));
    rawVideos = [...merged.values()].map((video) => ({ ...video, id: video.videoId }));
    retrieval = "official public RSS merged with existing catalogue; install yt-dlp for a full metadata refresh";
  }

  const videos = rawVideos
    .map((raw) => {
      const id = raw.id || raw.videoId;
      const previous = existingById.get(id) || {};
      return {
        ...previous,
        ...raw,
        id,
        description: raw.description || previous.fullDescription || previous.description,
        upload_date: raw.upload_date || raw.release_date || previous.publishedAt,
        duration: raw.duration || previous.durationSeconds,
        webpage_url: raw.webpage_url || raw.url || previous.url,
        thumbnail: raw.thumbnail || previous.thumbnail,
        channel_id: raw.channel_id || previous.channelId,
        channel: raw.channel || raw.uploader || previous.channelTitle,
        transcriptAvailable: previous.transcriptAvailable,
        captionsAvailable: previous.captionsAvailable,
      };
    })
    .filter((video) => video?.id && video.title)
    .map(classify);
  const deduped = [...new Map(videos.map((video) => [video.videoId, video])).values()]
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));

  const inventory = deduped.map((video) => ({
    video_id: video.videoId,
    url: video.url,
    title: video.title,
    description: video.fullDescription || video.description,
    published_at: video.publishedAt || "",
    duration: video.duration || "",
    thumbnail: video.thumbnail,
    playlist: video.playlist || "",
    content_type: video.contentType,
    primary_topic: video.primaryTopic,
    secondary_topics: video.secondaryTopics,
    treatment: video.treatment || "",
    concern: video.concern || "",
    doctor: video.doctor || "",
    location: video.location || "",
    patient_case: video.patientCase || "",
    search_intent: video.searchIntent,
    best_destination_url: video.primaryDestination,
    embed_priority: video.embedPriority,
    transcript_available: video.transcriptAvailable,
    needs_manual_review: video.needsManualReview,
    notes: retrieval,
  }));
  const mapRows = deduped.map((video) => ({
    video_id: video.videoId,
    video_url: video.url,
    title: video.title,
    published_at: video.publishedAt || "",
    primary_topic: video.primaryTopic,
    primary_destination: video.primaryDestination,
    secondary_destination_1: video.secondaryDestinations[0] || "",
    secondary_destination_2: video.secondaryDestinations[1] || "",
    embed_type: "youtube-nocookie-facade",
    video_schema: Boolean(video.publishedAt && video.thumbnail),
    transcript_used: false,
    notes: video.needsManualReview ? "Metadata mapped; editorial verification required before case association." : "Public metadata mapped to a visible contextual destination.",
  }));
  const publicData = deduped.map((video) => {
    const publicVideo = { ...video };
    delete publicVideo.fullDescription;
    return publicVideo;
  });
  const generatedTs = `import type { YouTubeVideo } from "@/types/video-library";\n\nexport const youtubeVideos = ${JSON.stringify(publicData, null, 2)} satisfies YouTubeVideo[];\n`;

  await mkdir(path.join(root, "content", "platform"), { recursive: true });
  await Promise.all([
    writeFile(path.join(root, "seo", "youtube-video-inventory.csv"), toCsv(["video_id", "url", "title", "description", "published_at", "duration", "thumbnail", "playlist", "content_type", "primary_topic", "secondary_topics", "treatment", "concern", "doctor", "location", "patient_case", "search_intent", "best_destination_url", "embed_priority", "transcript_available", "needs_manual_review", "notes"], inventory)),
    writeFile(path.join(root, "seo", "youtube-content-map.csv"), toCsv(["video_id", "video_url", "title", "published_at", "primary_topic", "primary_destination", "secondary_destination_1", "secondary_destination_2", "embed_type", "video_schema", "transcript_used", "notes"], mapRows)),
    writeFile(sourcePath, `${JSON.stringify(publicData, null, 2)}\n`),
    writeFile(path.join(root, "src", "data", "youtube-library.generated.ts"), generatedTs),
  ]);
  console.log(`Synchronized ${deduped.length} unique public YouTube videos (${retrieval}).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
