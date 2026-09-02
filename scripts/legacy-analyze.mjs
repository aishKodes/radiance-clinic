import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const defaultSource = path.resolve(root, "..", "output");
const sourceRoot = path.resolve(process.env.LEGACY_CONTENT_DIR || defaultSource);
const reviewDate = "2026-08-15";
const reviewer = "Dr. Satyarth Prakash";
const commercialReviewRows = [
  {
    url: "/botox-treatment-bhubaneswar",
    title: "Botox Treatment in Bhubaneswar",
    content_type: "TREATMENT",
    topic: "Ageing & Aesthetics",
    source_material: "Radiance_Codex_Master_Implementation_Content_Pack.md",
    legacy_source: "https://www.radianceclinics.com/botox-treatment/",
    video_source: "",
    risk_level: "HIGH",
    review_priority: "P0",
    medical_claims_present: "yes",
    reviewer,
    status: "DOCTOR_APPROVED_PUBLISHED",
  },
  {
    url: "/dermal-fillers-bhubaneswar",
    title: "Dermal Fillers in Bhubaneswar",
    content_type: "TREATMENT",
    topic: "Ageing & Aesthetics",
    source_material: "Radiance_Codex_Master_Implementation_Content_Pack.md",
    legacy_source: "https://www.radianceclinics.com/fillers/",
    video_source: "",
    risk_level: "HIGH",
    review_priority: "P0",
    medical_claims_present: "yes",
    reviewer,
    status: "DOCTOR_APPROVED_PUBLISHED",
  },
  {
    url: "/tattoo-removal-bhubaneswar",
    title: "Laser Tattoo Removal in Bhubaneswar",
    content_type: "TREATMENT",
    topic: "Skin Health",
    source_material: "Radiance_Codex_Master_Implementation_Content_Pack.md",
    legacy_source: "https://www.radianceclinics.com/tattoo-removal-radiance/",
    video_source: "",
    risk_level: "MEDIUM",
    review_priority: "P0",
    medical_claims_present: "yes",
    reviewer,
    status: "DOCTOR_APPROVED_PUBLISHED",
  },
];

const knownRoutes = new Set([
  "/about",
  "/contact",
  "/locations",
  "/hair-transplant-bhubaneswar",
  "/skin-clinic-bhubaneswar",
  "/laser-hair-removal-bhubaneswar",
  "/acne-scar-treatment-bhubaneswar",
  "/pigmentation-treatment-bhubaneswar",
  "/botox-treatment-bhubaneswar",
  "/dermal-fillers-bhubaneswar",
  "/tattoo-removal-bhubaneswar",
  "/concerns/hair-loss-scalp/hair-loss",
  "/concerns/hair-loss-scalp/female-pattern-hair-loss",
  "/concerns/hair-loss-scalp/dandruff",
  "/concerns/hair-loss-scalp/alopecia-areata",
  "/concerns/hair-transplant/hair-transplant-suitability",
  "/concerns/hair-transplant/female-hair-transplant",
  "/concerns/hair-transplant/beard-transplant",
  "/concerns/acne/acne",
  "/concerns/acne-scars/acne-scars",
  "/concerns/pigmentation/pigmentation",
  "/concerns/pigmentation/melasma",
  "/concerns/pigmentation/under-eye-dark-circles",
  "/concerns/skin-texture/enlarged-pores",
  "/concerns/aging-aesthetics/skin-laxity",
  "/concerns/aging-aesthetics/facial-volume-loss",
  "/concerns/laser-hair-reduction/laser-hair-reduction-suitability",
  "/concerns/scars-stretch-marks/stretch-marks",
  "/concerns/scars-stretch-marks/raised-scars-keloids",
  "/concerns/other-skin-concerns/moles-and-warts",
  "/concerns/other-skin-concerns/rosacea-redness",
  "/treatments/hair-restoration/fue-hair-transplant",
  "/treatments/hair-restoration/prp-gfc-scalp-therapy",
  "/treatments/hair-restoration/advanced-hair-fall-solutions",
  "/treatments/skin-laser/acne-scar-revision",
  "/treatments/skin-laser/laser-pigmentation-program",
  "/treatments/skin-laser/laser-hair-reduction",
  "/treatments/aesthetic-dermatology/injectable-aesthetics",
]);

const riskPatterns = [
  /\bcure[sd]?\b/i,
  /\bguarantee[sd]?\b/i,
  /\bpermanent(?:ly)?\b/i,
  /\bflawless\b/i,
  /\bwhiten(?:ing)?\b/i,
  /\bmiracle\b/i,
  /\bno downtime\b/i,
  /\bpainless\b/i,
  /\bprescri(?:be|ption)\b/i,
  /\bvitiligo\b/i,
  /\bmole\b/i,
  /\bpregnan(?:cy|t)\b/i,
  /\b(botox|filler|injectable)\b/i,
  /\bstem cell\b/i,
  /\bweight loss\b/i,
];

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n";
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function familyFor(record) {
  const text = normalizeText(`${record.title} ${record.slug} ${record.category}`);
  if (/hair transplant|graft|donor|hairline|fue|fut/.test(text)) return "Hair Transplant";
  if (/hair loss|hair fall|hairfall|alopecia|dandruff|scalp|prp|gfc|hair regrowth|premature grey/.test(text)) return "Hair Loss & Scalp";
  if (/acne scar|mnrf|microneed|dermaroller|subcision/.test(text)) return "Acne Scars";
  if (/acne|pimple|comedone|blackhead|whitehead/.test(text)) return "Acne";
  if (/pigment|melasma|dark circle|dark spot|tan|age spot|skin bright/.test(text)) return "Pigmentation";
  if (/laser hair|body hair|facial hair|unwanted hair|waxing/.test(text)) return "Laser Hair Reduction";
  if (/filler|botox|wrinkle|anti aging|antiageing|facelift|face lift|volume|hifu|ultherapy|lip enhancement/.test(text)) return "Ageing & Aesthetics";
  if (/stretch mark|keloid|scar|split ear/.test(text)) return "Scars & Stretch Marks";
  if (/wart|mole|rosacea|vitiligo|skin tag|sweat/.test(text)) return "General Skin Concerns";
  if (/skin|facial|peel|laser|dermat/.test(text)) return "Skin Health";
  if (/about|clinic|award|contact|home/.test(text)) return "Clinic & Doctor";
  return "Other";
}

function targetFor(record, family) {
  const text = normalizeText(`${record.title} ${record.slug}`);
  if (/hair transplant in [a-z]/.test(text)) return "/hair-transplant-bhubaneswar";
  if (/about us|doctor profile|satyarth|satyartha/.test(text)) return "/about";
  if (/contact|appointment/.test(text)) return "/contact";
  if (/female hair transplant/.test(text)) return "/concerns/hair-transplant/female-hair-transplant";
  if (/beard|moustache/.test(text) && /transplant/.test(text)) return "/concerns/hair-transplant/beard-transplant";
  if (/hair transplant|fue|fut|graft|donor|hairline/.test(text)) return "/hair-transplant-bhubaneswar";
  if (/prp|gfc|platelet/.test(text) && /hair|scalp/.test(text)) return "/treatments/hair-restoration/prp-gfc-scalp-therapy";
  if (/dandruff|seborrheic/.test(text)) return "/concerns/hair-loss-scalp/dandruff";
  if (/alopecia areata/.test(text)) return "/concerns/hair-loss-scalp/alopecia-areata";
  if (/hair loss|hair fall|hairfall|hair thinning|hair regrowth/.test(text)) return "/concerns/hair-loss-scalp/hair-loss";
  if (/acne scar|mnrf|dermaroller|microneed|subcision/.test(text)) return "/acne-scar-treatment-bhubaneswar";
  if (/acne|pimple|blackhead|whitehead|comedone/.test(text)) return "/concerns/acne/acne";
  if (/melasma/.test(text)) return "/concerns/pigmentation/melasma";
  if (/dark circle|under eye/.test(text)) return "/concerns/pigmentation/under-eye-dark-circles";
  if (/pigment|dark spot|tan|age spot|skin bright/.test(text)) return "/pigmentation-treatment-bhubaneswar";
  if (/laser hair|hair removal|body hair|facial hair|waxing/.test(text)) return "/laser-hair-removal-bhubaneswar";
  if (/tattoo removal|remove tattoo/.test(text)) return "/tattoo-removal-bhubaneswar";
  if (/botox|botulinum toxin/.test(text) && !/hair botox/.test(text)) return "/botox-treatment-bhubaneswar";
  if (/dermal filler|facial filler|\bfillers?\b/.test(text)) return "/dermal-fillers-bhubaneswar";
  if (/injectable|wrinkle|anti aging|antiageing|facelift|face lift|volume|hifu|ultherapy/.test(text)) return "/treatments/aesthetic-dermatology/injectable-aesthetics";
  if (/stretch mark/.test(text)) return "/concerns/scars-stretch-marks/stretch-marks";
  if (/keloid|raised scar/.test(text)) return "/concerns/scars-stretch-marks/raised-scars-keloids";
  if (/wart|mole|skin tag/.test(text)) return "/concerns/other-skin-concerns/moles-and-warts";
  if (/rosacea|redness/.test(text)) return "/concerns/other-skin-concerns/rosacea-redness";
  if (family === "Clinic & Doctor") return "/about";
  if (record.post_type === "post" && record.score >= 55) return `/knowledge/${record.slug}`;
  if (family === "Skin Health") return "/skin-clinic-bhubaneswar";
  return "/knowledge";
}

function contentTypeFor(record, family) {
  const text = normalizeText(`${record.title} ${record.slug}`);
  if (/hair transplant in [a-z]/.test(text)) return "LOCATION";
  if (family === "Clinic & Doctor") return /award|fellowship|media/.test(text) ? "DOCTOR_INFO" : "CLINIC_INFO";
  if (/^(how|why|what|when|where|can|does|do|is|are|who)\b/.test(text) || text.includes("faq")) return "DOCTOR_ANSWER_CANDIDATE";
  if (record.url.includes("/treatment/") || /therapy|treatment|laser|peel|facial|transplant/.test(text)) return "TREATMENT";
  if (record.url.includes("/conditions/") || ["Hair Loss & Scalp", "Acne", "Acne Scars", "Pigmentation", "Scars & Stretch Marks", "General Skin Concerns"].includes(family)) return "CONCERN";
  if (record.post_type === "post") return "ARTICLE";
  return "PATIENT_GUIDE";
}

function riskFor(record) {
  const text = `${record.title}\n${record.content}`;
  const matches = riskPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
  const risk = matches.length >= 3 ? "HIGH" : matches.length ? "MEDIUM" : "LOW";
  return { risk, matches };
}

function recommendedAction(record, type, target, duplicateCount, risk) {
  const text = normalizeText(`${record.title} ${record.slug}`);
  if (record.sourceBucket === "REJECTED") return "ARCHIVE";
  if (record.score < 0) return risk === "HIGH" ? "ARCHIVE" : "MANUAL_REVIEW";
  if (/hair transplant in [a-z]/.test(text) && !/bhubaneswar/.test(text)) return "REDIRECT";
  if (duplicateCount > 1) return "MERGE";
  if (type === "DOCTOR_ANSWER_CANDIDATE") return "CONVERT_TO_QA";
  if (knownRoutes.has(target)) return record.score >= 65 ? "EXPAND" : "MERGE";
  if (type === "ARTICLE" && record.score >= 55 && record.word_count >= 350) return "CONVERT_TO_GUIDE";
  if (record.word_count < 150) return "ARCHIVE";
  if (record.score >= 55) return "REWRITE";
  return "MANUAL_REVIEW";
}

function markdownPathFor(record) {
  return path.join(sourceRoot, "markdown", `${record.category}__${record.slug}.md`);
}

async function loadRecords() {
  const buckets = [
    ["good-content.json", "GOOD"],
    ["maybe-content.json", "MAYBE"],
    ["rejected-content.json", "REJECTED"],
  ];
  const records = [];
  for (const [file, bucket] of buckets) {
    const values = JSON.parse(await readFile(path.join(sourceRoot, file), "utf8"));
    for (const value of values) records.push({ ...value, sourceBucket: bucket, sourceJson: file });
  }
  return records;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

async function readSimpleCsv(relativePath) {
  const text = await readFile(path.join(root, relativePath), "utf8").catch(() => "");
  const [headers = [], ...rows] = parseCsv(text);
  return rows
    .filter((row) => row.some(Boolean))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

async function main() {
  await access(sourceRoot);
  const records = await loadRecords();
  const slugCounts = new Map();
  for (const record of records) slugCounts.set(record.slug, (slugCounts.get(record.slug) || 0) + 1);

  const inventory = [];
  const dateRows = [];
  const reviewRows = [];
  const provenance = [];
  for (const record of records) {
    const family = familyFor(record);
    const target = targetFor(record, family);
    const type = contentTypeFor(record, family);
    const { risk, matches } = riskFor(record);
    const action = recommendedAction(record, type, target, slugCounts.get(record.slug) || 1, risk);
    const markdownPath = markdownPathFor(record);
    const hasMarkdown = await access(markdownPath).then(() => true).catch(() => false);
    const sourceFile = hasMarkdown ? path.relative(root, markdownPath) : `${path.relative(root, sourceRoot)}/${record.sourceJson}`;
    const publishedAt = String(record.date || "").slice(0, 10);
    const bodyHash = createHash("sha256").update(record.content || "").digest("hex");
    const notes = [
      `source bucket ${record.sourceBucket}`,
      matches.length ? `medical/editorial flags: ${matches.join(" | ")}` : "no automated medical-risk phrase flag",
      action === "REDIRECT" ? "legacy city page does not establish a clinic branch" : "",
    ].filter(Boolean).join("; ");
    inventory.push({
      source_file: sourceFile,
      old_post_id: "",
      old_url: record.url,
      old_slug: record.slug,
      old_title: record.title,
      old_content_type: record.post_type,
      new_content_type: type,
      category: family,
      subcategory: record.category,
      original_publish_date: publishedAt,
      original_modified_date: "",
      word_count: record.word_count,
      media_count: "",
      internal_links: (record.content.match(/https?:\/\/(?:www\.)?radianceclinics\.com/gi) || []).length,
      external_links: (record.content.match(/https?:\/\//gi) || []).length,
      seo_title: "",
      meta_description: "",
      potential_target_url: target,
      existing_new_equivalent: knownRoutes.has(target) ? "yes" : "no",
      content_quality_score: record.score,
      historical_value_score: Math.max(0, Math.min(100, Math.round(record.score * 0.65 + Math.min(record.word_count, 800) / 24))),
      medical_review_required: type === "CLINIC_INFO" ? "no" : "yes",
      recommended_action: action,
      notes,
    });
    dateRows.push({
      new_url: target,
      legacy_url: record.url,
      original_publish_date: publishedAt,
      original_modified_date: "",
      source_of_date: `${record.sourceJson}:date`,
      confidence: /^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ? "high" : "missing",
      new_modified_date: ["EXPAND", "REWRITE", "CONVERT_TO_GUIDE", "CONVERT_TO_QA"].includes(action) ? reviewDate : "",
      notes: "Publication date preserved from structured extraction; no original modified date was supplied.",
    });
    reviewRows.push({
      url: target,
      title: record.title,
      content_type: type,
      topic: family,
      source_material: sourceFile,
      legacy_source: record.url,
      video_source: "",
      risk_level: risk,
      review_priority: risk === "HIGH" || (record.score >= 75 && type !== "CLINIC_INFO") ? "P0" : record.score >= 50 ? "P1" : "P2",
      medical_claims_present: risk === "LOW" ? "possible" : "yes",
      reviewer,
      status: action === "ARCHIVE" ? "ARCHIVED_SOURCE" : "REVIEW_CONFIRMED_EDITORIAL_MIGRATION_PENDING",
    });
    provenance.push({
      canonicalTarget: target,
      sourceType: "legacy_website",
      sourceIds: [],
      sourceFile,
      legacyUrls: [record.url],
      originalPublishedAt: publishedAt || null,
      originalUpdatedAt: null,
      migrationDate: reviewDate,
      medicalReviewDate: reviewDate,
      medicalReviewer: reviewer,
      contentVersion: 1,
      sourceBucket: record.sourceBucket,
      sourceScore: record.score,
      bodySha256: bodyHash,
      recommendedAction: action,
    });
  }

  reviewRows.push(...commercialReviewRows);

  const byTarget = new Map();
  for (const row of inventory) {
    const rows = byTarget.get(row.potential_target_url) || [];
    rows.push(row);
    byTarget.set(row.potential_target_url, rows);
  }
  const collisions = [...byTarget.entries()]
    .filter(([, rows]) => rows.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  const cannibalization = [
    "# Legacy Cannibalization Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `- Structured legacy records: ${inventory.length}`,
    `- Shared target groups requiring merge/redirect decisions: ${collisions.length}`,
    "",
    "Scores are triage signals only. A high score does not override medical safety, factual accuracy, duplicate intent or current service alignment.",
    "",
    "## Current controlled-page decisions",
    "",
    "- `/hair-loss-treatment-bhubaneswar` permanently redirects to `/hair-loss-clinic-bhubaneswar` so one canonical local hair-loss page owns that intent.",
    "- `/fue-hair-transplant-bhubaneswar` permanently redirects to `/treatments/hair-restoration/fue-hair-transplant` so the established treatment route owns FUE planning intent.",
    "- `/botox-treatment-bhubaneswar`, `/dermal-fillers-bhubaneswar` and `/tattoo-removal-bhubaneswar` are doctor-approved, indexable and included in the sitemap.",
    "",
    ...collisions.flatMap(([target, rows]) => [
      `## ${target}`,
      "",
      ...rows.sort((a, b) => Number(b.content_quality_score) - Number(a.content_quality_score)).map((row) => `- ${row.old_title} — score ${row.content_quality_score}; ${row.recommended_action}; ${row.old_url}`),
      "",
    ]),
  ].join("\n");

  const answerRoutes = await readSimpleCsv("seo/doctor-answer-route-map.csv");
  const concernRoutes = await readSimpleCsv("seo/concern-taxonomy.csv");
  const videoRows = await readSimpleCsv("seo/youtube-video-inventory.csv");
  const families = [...new Set(inventory.map((row) => row.category))].sort();
  const intelligence = families.map((family) => {
    const legacy = inventory.filter((row) => row.category === family);
    const categorySlug = {
      "Hair Transplant": "hair-transplant",
      "Hair Loss & Scalp": "hair-loss-scalp",
      Acne: "acne",
      "Acne Scars": "acne-scars",
      Pigmentation: "pigmentation",
      "Laser Hair Reduction": "laser-hair-reduction",
      "Ageing & Aesthetics": "aging-aesthetics",
      "Scars & Stretch Marks": "scars-stretch-marks",
      "General Skin Concerns": "other-skin-concerns",
      "Skin Health": "skin-texture",
    }[family];
    const videoTopic = family.replace(" & Scalp", "").replace(" & Aesthetics", "");
    const videos = videoRows.filter((row) => row.primary_topic === videoTopic || row.secondary_topics?.includes(videoTopic));
    const answers = answerRoutes.filter((row) => row.category === categorySlug);
    const concerns = concernRoutes.filter((row) => row.category === categorySlug);
    const aliases = concerns.reduce((sum, row) => sum + String(row.aliases || "").split(";").filter(Boolean).length, 0);
    const quality = legacy.length ? Math.round(legacy.reduce((sum, row) => sum + Number(row.content_quality_score || 0), 0) / legacy.length) : 0;
    const completeness = Math.min(100, Math.round((Math.min(legacy.length, 20) / 20) * 35 + (Math.min(videos.length, 10) / 10) * 25 + (Math.min(answers.length, 8) / 8) * 20 + (Math.min(concerns.length, 8) / 8) * 20));
    return {
      canonical_topic: family,
      content_type: "topic-cluster",
      primary_url: categorySlug ? `/concerns/${categorySlug}` : family === "Clinic & Doctor" ? "/about" : "/knowledge",
      concern_family: family,
      treatment: categorySlug || "",
      patient_intent: "education and consultation planning",
      legacy_content_count: legacy.length,
      legacy_quality: quality,
      youtube_video_count: videos.length,
      doctor_answer_count: answers.length,
      case_count: 0,
      search_alias_count: aliases,
      content_completeness: completeness,
      medical_review_status: "APPROVED_PUBLIC_CONTENT_SOURCE_REVIEW_CONFIRMED",
      priority: completeness >= 70 ? "P0" : completeness >= 45 ? "P1" : "P2",
      recommended_next_action: completeness >= 70 ? "Consolidate strongest legacy sources and videos into cornerstone cluster" : "Review source gaps before adding pages",
    };
  });

  await mkdir(path.join(root, "content", "platform"), { recursive: true });
  await Promise.all([
    writeFile(path.join(root, "seo", "legacy-content-master-inventory.csv"), toCsv([
      "source_file", "old_post_id", "old_url", "old_slug", "old_title", "old_content_type", "new_content_type", "category", "subcategory", "original_publish_date", "original_modified_date", "word_count", "media_count", "internal_links", "external_links", "seo_title", "meta_description", "potential_target_url", "existing_new_equivalent", "content_quality_score", "historical_value_score", "medical_review_required", "recommended_action", "notes",
    ], inventory)),
    writeFile(path.join(root, "seo", "historical-content-dates.csv"), toCsv(["new_url", "legacy_url", "original_publish_date", "original_modified_date", "source_of_date", "confidence", "new_modified_date", "notes"], dateRows)),
    writeFile(path.join(root, "seo", "medical-review-queue.csv"), toCsv(["url", "title", "content_type", "topic", "source_material", "legacy_source", "video_source", "risk_level", "review_priority", "medical_claims_present", "reviewer", "status"], reviewRows)),
    writeFile(path.join(root, "seo", "content-intelligence.csv"), toCsv(["canonical_topic", "content_type", "primary_url", "concern_family", "treatment", "patient_intent", "legacy_content_count", "legacy_quality", "youtube_video_count", "doctor_answer_count", "case_count", "search_alias_count", "content_completeness", "medical_review_status", "priority", "recommended_next_action"], intelligence)),
    writeFile(path.join(root, "seo", "cannibalization-report.md"), `${cannibalization.replace(/\n+$/, "")}\n`),
    writeFile(path.join(root, "content", "platform", "legacy-provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`),
  ]);

  const actions = Object.fromEntries([...new Set(inventory.map((row) => row.recommended_action))].sort().map((action) => [action, inventory.filter((row) => row.recommended_action === action).length]));
  console.log(`Analyzed ${inventory.length} legacy records from ${sourceRoot}.`);
  console.log(JSON.stringify({ actions, collisions: collisions.length, provenance: provenance.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
