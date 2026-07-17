#!/usr/bin/env node
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const supportedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".svg",
  ".tif",
  ".tiff",
]);

const variants = [
  { key: "heroDesktop", dir: "hero-desktop", width: 2400, height: 1400 },
  { key: "heroMobile", dir: "hero-mobile", width: 1200, height: 1500 },
  { key: "landscape", dir: "landscape", width: 1200, height: 800 },
  { key: "portrait", dir: "portrait", width: 900, height: 1200 },
  { key: "square", dir: "square", width: 1000, height: 1000 },
  { key: "thumb", dir: "thumb", width: 500, height: 500 },
];

const generatedFormats = ["webp"];
const sourceFormatFolders = new Set(["jpg", "jpeg", "png", "webp", "avif", "tif", "tiff"]);

const categoryAliases = new Map([
  ["01-hero", "hero"],
  ["hero", "hero"],
  ["gallery", "gallery"],
  ["new-gallery", "gallery"],
  ["gallery-raw", "gallery"],
  ["clinic-gallery", "clinic-ambience"],
  ["doctor-gallery", "doctor"],
  ["02-doctor", "doctor"],
  ["01-doctor", "doctor"],
  ["doctor", "doctor"],
  ["03-before-after", "before-after"],
  ["04-before-after", "before-after"],
  ["before-after", "before-after"],
  ["ba", "before-after"],
  ["04-awards-recognition", "recognition"],
  ["05-awards-certificates", "recognition"],
  ["award", "recognition"],
  ["awards", "recognition"],
  ["awards-recognition", "recognition"],
  ["awards-certificates", "recognition"],
  ["certificate", "recognition"],
  ["certificates", "recognition"],
  ["certificates-enhanced", "recognition"],
  ["radiance-certificates-enhanced", "recognition"],
  ["recognition", "recognition"],
  ["05-clinic-ambience", "clinic-ambience"],
  ["02-clinic-interior", "clinic-ambience"],
  ["clinic", "clinic-ambience"],
  ["clinic-ambience", "clinic-ambience"],
  ["clinic-interior", "clinic-ambience"],
  ["interior", "clinic-ambience"],
  ["06-equipment", "equipment"],
  ["03-equipment", "equipment"],
  ["equipment", "equipment"],
  ["07-social-media", "social-media"],
  ["social", "social-media"],
  ["social-media", "social-media"],
  ["08-logo-brand", "logo-brand"],
  ["logo", "logo-brand"],
  ["brand", "logo-brand"],
  ["logo-brand", "logo-brand"],
  ["09-press-newspaper", "press-newspaper"],
  ["press", "press-newspaper"],
  ["newspaper", "press-newspaper"],
  ["press-newspaper", "press-newspaper"],
  ["06-team", "team"],
  ["team", "team"],
  ["07-videos", "videos"],
  ["video", "videos"],
  ["videos", "videos"],
  ["generic", "generic-service-card"],
  ["generic-card", "generic-service-card"],
  ["generic-cards", "generic-service-card"],
  ["card", "generic-service-card"],
  ["cards", "generic-service-card"],
  ["service", "generic-service-card"],
  ["services", "generic-service-card"],
  ["service-card", "generic-service-card"],
  ["service-cards", "generic-service-card"],
  ["premium-visuals", "generic-service-card"],
  ["radiance-premium-visuals", "generic-service-card"],
  ["hero-support", "hero-support"],
  ["category-tab", "category-tab-visual"],
  ["category-tabs", "category-tab-visual"],
  ["category-visual", "category-tab-visual"],
  ["category-visuals", "category-tab-visual"],
  ["skin-before-after", "skin-before-after"],
  ["skin-before-after-separated", "skin-before-after"],
  ["radiance-skin-before-after-separated", "skin-before-after"],
  ["radiance-skin-before-after-separated-2", "skin-before-after"],
  ["radiance-next-5-skin-before-after", "skin-before-after"],
  ["hair-before-after", "hair-before-after"],
  ["radiance-hair-before-after", "hair-before-after"],
  ["radiance-additional-hair-before-after", "hair-before-after"],
]);

const detectedTypes = {
  hero: "hero-image",
  doctor: "doctor-photo",
  "before-after": "before-after",
  recognition: "recognition",
  "clinic-ambience": "clinic-ambience",
  equipment: "equipment",
  "social-media": "social-proof",
  "logo-brand": "brand-asset",
  "press-newspaper": "press",
  team: "team-photo",
  videos: "video-asset",
  gallery: "clinic-gallery",
  "generic-service-card": "generic_service_card",
  "skin-before-after": "skin_before_after",
  "hair-before-after": "hair_before_after",
  "hero-support": "hero_support",
  "category-tab-visual": "category_tab_visual",
};

const help = `Usage:
  npm run process:media
  npm run process:media -- --input ../radiance-media-raw --out ../radiance-media-processed

Defaults:
  --input radiance-media-raw
  --out   public/radiance-media-processed

Required raw structure:
  radiance-media-raw/
    01-hero/
    02-doctor/
    03-before-after/case001/
    04-awards-recognition/
    05-clinic-ambience/
    06-equipment/
    07-social-media/
    08-logo-brand/
    09-press-newspaper/
    media-manifest.csv

Strict examples:
  radiance-hero-anil-kapoor-feature-01.jpg
  radiance-doctor-satyarth-consultation-01.jpg
  radiance-ba-hair-transplant-case001-front-before.jpg
  radiance-ba-hair-transplant-case001-front-after.jpg
  radiance-ba-hair-transplant-case001-angle-before.jpg
  radiance-ba-hair-transplant-case001-angle-after.jpg

Accepted image formats:
  jpg, jpeg, png, webp, avif, tif, tiff`;

function parseArgs(argv) {
  const args = {
    input: "radiance-media-raw",
    out: "public/radiance-media-processed",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const next = argv[index + 1];
    args[key] = next && !next.startsWith("--") ? argv[++index] : true;
  }

  return args;
}

function normalizeSlashes(value) {
  return value.split(path.sep).join("/");
}

function stripNumberPrefix(value) {
  return value.replace(/^\d+-/, "");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function canonicalCategory(value) {
  const normalized = stripNumberPrefix(slugify(value || ""));
  return categoryAliases.get(normalized) || normalized || "general";
}

function camelCaseRole(value) {
  const parts = slugify(value).split("-").filter(Boolean);
  return parts
    .map((part, index) =>
      index === 0 ? part : `${part.charAt(0).toUpperCase()}${part.slice(1)}`,
    )
    .join("");
}

function titleFromSlug(value) {
  return slugify(value)
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

const conditionAliases = [
  { pattern: /^(acne-scar|acne-scars|acne-scar-treatment)$/, slug: "acne-scars", name: "Acne Scars", treatment: "Acne Scar Treatment" },
  { pattern: /^acne$/, slug: "acne", name: "Acne", treatment: "Acne Treatment" },
  { pattern: /^(pigmentation|pigmentation-removal|pigmentation-melasma|laser-pigmentation|laser-pigmentation-treatment)$/, slug: "pigmentation", name: "Pigmentation", treatment: "Pigmentation Treatment" },
  { pattern: /^melasma$/, slug: "melasma", name: "Melasma", treatment: "Pigmentation Treatment" },
  { pattern: /^(hair-transplant|crown-hair-transplant|frontal-mid-scalp-hair-transplant)$/, slug: "hair-transplant", name: "Hair Transplant", treatment: "Hair Transplant" },
  { pattern: /^(fue|fue-hair-transplant)$/, slug: "fue-hair-transplant", name: "FUE Hair Transplant", treatment: "FUE Hair Transplant" },
  { pattern: /^(prp|gfc|prp-therapy|gfc-therapy|prp-hair-therapy|prp-gfc|prp-gfc-therapy|prp-gfc-scalp-therapy)$/, slug: "prp-gfc-therapy", name: "PRP / GFC Therapy", treatment: "PRP / GFC Therapy" },
  { pattern: /^(laser-hair-removal|laser-hair-reduction|underarm-laser-reduction)$/, slug: "laser-hair-removal", name: "Laser Hair Removal", treatment: "Laser Hair Removal" },
  { pattern: /^(anti-ageing|anti-aging|anti-ageing-service|anti-aging-service)$/, slug: "anti-ageing", name: "Anti Ageing", treatment: "Anti Ageing" },
  { pattern: /^(botox-fillers|botox-and-fillers|botox|dermal-fillers|injectable-aesthetics)$/, slug: "botox-fillers", name: "Botox & Fillers", treatment: "Botox & Fillers" },
  { pattern: /^(skin-rejuvenation|skin-rejuvenation-service|uneven-skin-tone|open-pores|oily-skin|dull-skin)$/, slug: "skin-rejuvenation", name: "Skin Rejuvenation", treatment: "Skin Rejuvenation" },
  { pattern: /^hair-fall$/, slug: "hair-fall", name: "Hair Fall", treatment: "Hair Fall Treatment" },
  { pattern: /^beard-transplant$/, slug: "beard-transplant", name: "Beard Transplant", treatment: "Hair Transplant" },
  { pattern: /^receding-hairline$/, slug: "receding-hairline", name: "Receding Hairline", treatment: "Hair Transplant" },
  { pattern: /^female-pattern-hair-loss$/, slug: "female-pattern-hair-loss", name: "Female Pattern Hair Loss", treatment: "Hair Restoration" },
  { pattern: /^male-temporal-recession$/, slug: "male-temporal-recession", name: "Male Temporal Recession", treatment: "Hair Transplant" },
  { pattern: /^male-diffuse-frontal-thinning$/, slug: "male-diffuse-frontal-thinning", name: "Male Diffuse Frontal Thinning", treatment: "Hair Restoration" },
  { pattern: /^female-frontal-hairline-thinning$/, slug: "female-frontal-hairline-thinning", name: "Female Frontal Hairline Thinning", treatment: "Hair Restoration" },
  { pattern: /^advanced-male-pattern-baldness$/, slug: "advanced-male-pattern-baldness", name: "Advanced Male Pattern Baldness", treatment: "Hair Transplant" },
  { pattern: /^female-widening-part$/, slug: "female-widening-part", name: "Female Widening Part", treatment: "Hair Restoration" },
  { pattern: /^dark-circles$/, slug: "dark-circles", name: "Dark Circles", treatment: "Under Eye Rejuvenation" },
  { pattern: /^rosacea-redness$/, slug: "rosacea-redness", name: "Rosacea / Redness", treatment: "Redness Treatment" },
  { pattern: /^facial-mole$/, slug: "facial-mole", name: "Facial Mole", treatment: "Mole Treatment" },
  { pattern: /^skin-tags$/, slug: "skin-tags", name: "Skin Tags", treatment: "Skin Tag Treatment" },
  { pattern: /^bridal-dermatology$/, slug: "bridal-dermatology", name: "Bridal Dermatology", treatment: "Bridal Dermatology" },
  { pattern: /^under-eye-rejuvenation$/, slug: "under-eye-rejuvenation", name: "Under Eye Rejuvenation", treatment: "Under Eye Rejuvenation" },
  { pattern: /^skin-skin$/, slug: "skin", name: "Skin", treatment: "Skin Treatment" },
  { pattern: /^skin$/, slug: "skin", name: "Skin", treatment: "Skin Treatment Options" },
  { pattern: /^hair$/, slug: "hair", name: "Hair", treatment: "Hair Treatment Options" },
  { pattern: /^laser$/, slug: "laser", name: "Laser", treatment: "Laser Treatment Options" },
  { pattern: /^aesthetics$/, slug: "aesthetics", name: "Aesthetics", treatment: "Aesthetic Treatment Options" },
];

const viewAliases = new Map([
  ["front", "front"],
  ["frontal", "front"],
  ["side", "side"],
  ["angle", "side"],
  ["angled", "side"],
  ["second", "second"],
  ["top", "crown"],
  ["crown", "crown"],
  ["closeup", "closeup"],
  ["close-up", "closeup"],
  ["profile", "side"],
]);

const subjectStopTokens = new Set([
  "radiance",
  "ba",
  "before",
  "after",
  "bfore",
  "front",
  "frontal",
  "side",
  "angle",
  "angled",
  "second",
  "top",
  "crown",
  "closeup",
  "close",
  "up",
  "view",
  "case",
  "card",
  "cards",
  "service",
  "services",
  "condition",
  "conditions",
  "treatment",
  "treatments",
  "category",
  "tab",
  "visual",
  "example",
  "set",
]);

function normalizeCondition(value) {
  const normalized = stripNumberPrefix(slugify(value || ""));
  const direct = conditionAliases.find((item) => item.pattern.test(normalized));

  if (direct) return direct;

  if (/^fue(?:-|$)/.test(normalized)) {
    return conditionAliases.find((item) => item.slug === "fue-hair-transplant");
  }

  if (/(^|-)prp(-|$)|(^|-)gfc(-|$)/.test(normalized)) {
    return conditionAliases.find((item) => item.slug === "prp-gfc-therapy");
  }

  if (/laser-hair-(removal|reduction)/.test(normalized)) {
    return conditionAliases.find((item) => item.slug === "laser-hair-removal");
  }

  if (/botox.*filler|filler.*botox/.test(normalized)) {
    return conditionAliases.find((item) => item.slug === "botox-fillers");
  }

  if (/skin-rejuvenation|uneven-skin-tone|open-pores|oily-skin|dull-skin/.test(normalized)) {
    return conditionAliases.find((item) => item.slug === "skin-rejuvenation");
  }

  return {
    slug: normalized,
    name: titleFromSlug(normalized),
    treatment: titleFromSlug(normalized),
    unknown: Boolean(normalized),
  };
}

function phaseFromTokens(tokens) {
  const phaseToken = [...tokens].reverse().find((token) =>
    token === "before" ||
    token === "after" ||
    /^before\d*$/i.test(token) ||
    /^after\d*$/i.test(token) ||
    /^bfore\d*$/i.test(token),
  );

  if (!phaseToken) return { phase: "", phaseToken: "" };
  return {
    phase: /^after/i.test(phaseToken) ? "after" : "before",
    phaseToken,
  };
}

function viewFromTokens(tokens) {
  const viewToken = tokens.find((token) => viewAliases.has(token));
  return viewToken ? viewAliases.get(viewToken) : "primary";
}

function viewLabel(view) {
  if (view === "front" || view === "primary") return "Front View";
  if (view === "side" || view === "second") return "Side View / Second View";
  if (view === "crown") return "Crown View";
  if (view === "closeup") return "Close-up View";
  return titleFromSlug(view);
}

function roleForView(view, phase) {
  if (view === "primary") return phase;
  if (view === "side" || view === "second") return `angle-${phase}`;
  return `${view}-${phase}`;
}

function subjectFromTokens(tokens) {
  const subjectTokens = tokens.filter((token) => {
    if (!token || /^\d+$/.test(token) || /^[a-z]?\d+$/i.test(token)) return false;
    if (/^case[a-z0-9]+$/i.test(token)) return false;
    return !subjectStopTokens.has(token);
  });

  return subjectTokens.join("-");
}

function folderSubject(relativePathParts) {
  const folders = relativePathParts.slice(0, -1).map((part) => stripNumberPrefix(slugify(part)));
  const preferred = [...folders].reverse().find((part) => {
    if (!part || /^case[a-z0-9]+$/i.test(part)) return false;
    if (isKnownCategory(canonicalCategory(part))) return false;
    if (/before-after|separated|additional|next|premium|visuals|webp|jpg|png/.test(part)) return false;
    return true;
  });

  return preferred || "";
}

function inferTransformationCategory(subjectSlug, combinedText) {
  if (/laser-hair-(removal|reduction)/.test(subjectSlug) || /skin|acne|pigmentation|melasma|mole|wart|tag|rosacea|pores|circle|rejuvenation|anti-age|botox|filler/.test(combinedText)) {
    return "skin";
  }

  if (/hair|fue|prp|gfc|beard|bald|scalp|crown|thinning|recession|hairline|transplant/.test(combinedText)) {
    return "hair";
  }

  return "";
}

function publicTitleFor(category, conditionName, treatment) {
  const normalized = slugify(conditionName);

  if (category === "hair") {
    if (/fall|thinning|pattern|widening/.test(normalized)) return "Hair Fall Improvement";
    if (/prp|gfc/.test(slugify(treatment))) return "PRP / GFC Hair Therapy Example";
    return "Hair Transplant Transformation";
  }

  if (normalized === "acne-scars") return "Acne Scar Improvement";
  if (normalized === "pigmentation") return "Pigmentation Improvement";
  if (normalized === "melasma") return "Melasma Improvement";
  if (/laser-hair-removal/.test(normalized)) return "Laser Hair Reduction Example";
  if (/rejuvenation|pores|tone|oily|dull/.test(normalized)) return "Skin Rejuvenation Example";
  if (/anti-ageing/.test(normalized)) return "Anti Ageing Example";

  return "Skin Improvement Example";
}

function organizedClassification(stem, relativePathParts) {
  const pathText = slugify(relativePathParts.join("-"));
  const stemText = slugify(stem);
  const combined = `${pathText}-${stemText}`;

  if (/preview|contact-sheet|contactsheet/.test(combined)) {
    return "generic-service-card";
  }

  const hasBeforeAfter =
    /(^|-)before-after(-|$)|(^|-)before(-|$)|(^|-)after(-|$)|(^|-)bfore/.test(combined);
  const hasSkin =
    /skin|acne|pigmentation|melasma|laser-hair|anti-age|botox|filler|mole|wart|tag|rosacea|pores|circle|rejuvenation|tone|oily/.test(
      combined,
    );
  const hasHair =
    /hair|fue|prp|gfc|beard|bald|scalp|crown|thinning|recession|hairline|transplant/.test(
      combined,
    );

  if (hasBeforeAfter && (/laser-hair-(removal|reduction)/.test(combined) || (hasSkin && !hasHair))) {
    return "skin-before-after";
  }

  if (hasBeforeAfter && hasHair) {
    return "hair-before-after";
  }

  if (/doctor-gallery|(^|-)doctor(-|$)|satyarth|consultation/.test(combined)) {
    return "doctor";
  }

  if (/clinic-gallery|media-clinic|clinic-ambience|clinic-interior|reception|waiting|lounge|treatment-room/.test(combined)) {
    return "clinic-ambience";
  }

  if (/awards-recognition|award|recognition|certificate|badge|press|newspaper|media-mention/.test(combined)) {
    return /press|newspaper|media-mention/.test(combined) ? "press-newspaper" : "recognition";
  }

  if (/(^|-)gallery(-|$)|new-gallery|gallery-raw/.test(combined)) {
    return "gallery";
  }

  if (/hero|smiling|happy-patient|patient-hero|doctor-consultation/.test(combined)) {
    return "hero-support";
  }

  if (/category|tab-background|treatment-tab/.test(combined)) {
    return "category-tab-visual";
  }

  if (/generic|card|service|premium-visuals|condition|bridal|under-eye/.test(combined)) {
    return "generic-service-card";
  }

  return "";
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y", "published", "enabled"].includes(normalized)) {
      return true;
    }
    if (["0", "false", "no", "n", "hidden", "disabled"].includes(normalized)) {
      return false;
    }
  }
  return fallback;
}

function parseNumber(value, fallback = null) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function isKnownCategory(category) {
  return Boolean(detectedTypes[category]);
}

function parseSequenceToken(token) {
  if (!token) return { sequence: "", sequenceNumber: null, warning: "" };

  if (/^\d{1,4}$/.test(token) || /^[a-z]\d{1,4}$/i.test(token)) {
    const digits = token.match(/\d+/)?.[0] || "";
    return {
      sequence: token,
      sequenceNumber: digits ? Number(digits) : null,
      warning: "",
    };
  }

  const mixed = token.match(/^(\d{1,4})([a-z]+)$/i);
  if (mixed) {
    return {
      sequence: mixed[1],
      sequenceNumber: Number(mixed[1]) + 0.1,
      warning: `non-standard sequence token "${token}" was interpreted as "${mixed[1]}"; rename to a clean numbered suffix when possible.`,
    };
  }

  return { sequence: "", sequenceNumber: null, warning: "" };
}

function normalizeCsvKey(key) {
  return slugify(key).replaceAll("-", "_");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeCsvKey);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

async function loadManifestMetadata(manifestRoots) {
  const roots = Array.isArray(manifestRoots) ? manifestRoots : [manifestRoots];
  const candidates = roots.flatMap((root) => [
    path.join(root, "media-manifest.csv"),
    path.join(root, "manifest.csv"),
  ]);
  const byFilename = new Map();
  const byRelativePath = new Map();
  const byStem = new Map();
  const loadedFiles = [];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;

    loadedFiles.push(candidate);
    const rows = parseCsv(await readFile(candidate, "utf8"));
    const manifestDir = path.dirname(candidate);

    for (const row of rows) {
      const filenames = [
        row.filename ||
          row.file_name ||
          row.new_filename ||
          row.original_filename ||
          row.original_generated_filename ||
          "",
        row.jpg_filename,
        row.webp_filename,
        row.png_filename,
        row.jpg,
        row.webp,
        row.png,
      ].filter(Boolean);
      const relativePaths = [
        row.relative_path,
        row.raw_relative_path,
        row.path,
        ...filenames,
      ].filter(Boolean);

      if (row.condition && !row.title) row.title = row.condition;
      if (row.recommended_use && !row.usage) row.usage = row.recommended_use;
      if (row.stage && !row.phase) row.phase = row.stage;

      for (const filename of filenames) {
        const basename = path.basename(filename).toLowerCase();
        const stem = slugify(path.parse(filename).name || filename);

        if (basename) byFilename.set(basename, row);
        if (filename) byFilename.set(filename.toLowerCase(), row);
        if (stem) byStem.set(stem, row);
      }

      for (const relativePath of relativePaths) {
        const normalized = normalizeSlashes(relativePath).toLowerCase();
        const fullFromManifest = normalizeSlashes(
          path.relative(process.cwd(), path.join(manifestDir, relativePath)),
        ).toLowerCase();

        if (normalized) byRelativePath.set(normalized, row);
        if (fullFromManifest) byRelativePath.set(fullFromManifest, row);
      }
    }
  }

  return { byFilename, byRelativePath, byStem, loadedFiles };
}

function metadataForFile(metadataIndex, info) {
  const filename = info.originalFilename.toLowerCase();
  const basename = path.basename(filename);
  const relative = info.rawRelativePath.toLowerCase();
  const stem = slugify(path.parse(info.originalFilename).name);

  return (
    metadataIndex.byRelativePath.get(relative) ||
    metadataIndex.byFilename.get(filename) ||
    metadataIndex.byFilename.get(basename) ||
    metadataIndex.byStem.get(stem) ||
    {}
  );
}

function safeRelativePath(relativePath) {
  const parsed = path.parse(relativePath);
  const dir = parsed.dir
    .split(path.sep)
    .filter(Boolean)
    .map((segment) => slugify(segment) || "folder")
    .join(path.sep);
  const filename = `${slugify(parsed.name) || "image"}${parsed.ext.toLowerCase()}`;
  return dir ? path.join(dir, filename) : filename;
}

function shortHash(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 8);
}

async function fileContentHash(filePath) {
  const buffer = await readFile(filePath);
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function uniqueSlug(baseSlug, relativePath, usedSlugs) {
  const normalized = slugify(baseSlug) || `radiance-${shortHash(relativePath)}`;

  if (!usedSlugs.has(normalized)) {
    usedSlugs.add(normalized);
    return normalized;
  }

  const withHash = `${normalized}-${shortHash(relativePath)}`;
  usedSlugs.add(withHash);
  return withHash;
}

async function walkImages(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (supportedExtensions.has(ext)) {
        files.push(absolutePath);
      }
    }
  }

  await walk(rootDir);
  return files.sort((a, b) => a.localeCompare(b));
}

async function discoverSupplementalFolders({ inputRoot, publicRoot, outRoot }) {
  const roots = [];
  const seen = new Set([path.resolve(inputRoot), path.resolve(outRoot)]);
  const localRawRoot = path.resolve("raw-media");

  async function addRoot(root) {
    if (!existsSync(root)) return;

    const absolutePath = path.resolve(root);
    if (seen.has(absolutePath)) return;
    if (absolutePath.startsWith(path.resolve(outRoot))) return;

    roots.push(absolutePath);
    seen.add(absolutePath);
  }

  const requestedGalleryRoots = [
    path.join(inputRoot, "gallery"),
    path.join(inputRoot, "clinic-gallery"),
    path.join(inputRoot, "doctor-gallery"),
    path.join(inputRoot, "new-gallery"),
    path.join(inputRoot, "05-clinic-ambience"),
    path.join(inputRoot, "04-awards-recognition"),
    path.join(publicRoot, "media", "gallery"),
    path.join(publicRoot, "media", "clinic-gallery"),
    path.join(publicRoot, "media", "recognition"),
    path.join(publicRoot, "media", "clinic"),
    path.join(publicRoot, "gallery-raw"),
    path.join(localRawRoot, "gallery"),
    path.join(localRawRoot, "clinic-gallery"),
    path.join(localRawRoot, "doctor-gallery"),
    path.join(localRawRoot, "new-gallery"),
    path.join(localRawRoot, "gallery-raw"),
  ];

  for (const root of requestedGalleryRoots) {
    await addRoot(root);
  }

  async function addMatchingChildren(root) {
    if (!existsSync(root)) return;

    const entries = await readdir(root, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const absolutePath = path.resolve(root, entry.name);
      if (seen.has(absolutePath)) continue;
      if (absolutePath.startsWith(path.resolve(outRoot))) continue;
      if (entry.name.startsWith(".")) continue;

      const folderText = slugify(entry.name);
      const matches =
        /gallery|clinic|doctor|recognition|award|certificate|press|newspaper|generic|card|service|premium-visuals|skin.*before.*after|before.*after.*skin|hair.*before.*after|before.*after.*hair/.test(
          folderText,
        );

      if (!matches) continue;

      await addRoot(absolutePath);
    }
  }

  await addMatchingChildren(inputRoot);
  await addMatchingChildren(localRawRoot);
  await addMatchingChildren(publicRoot);

  return roots.sort((a, b) => a.localeCompare(b));
}

function isSameOrInside(parent, child) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function firstExisting(paths) {
  return paths.find((candidate) => existsSync(candidate)) || "";
}

async function copyIfDifferent(sourcePath, outputPath) {
  if (!sourcePath || path.resolve(sourcePath) === path.resolve(outputPath)) return;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await copyFile(sourcePath, outputPath);
}

function icoFromPng(pngBuffer, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const directory = Buffer.alloc(16);
  directory.writeUInt8(size >= 256 ? 0 : size, 0);
  directory.writeUInt8(size >= 256 ? 0 : size, 1);
  directory.writeUInt8(0, 2);
  directory.writeUInt8(0, 3);
  directory.writeUInt16LE(1, 4);
  directory.writeUInt16LE(32, 6);
  directory.writeUInt32LE(pngBuffer.length, 8);
  directory.writeUInt32LE(22, 12);

  return Buffer.concat([header, directory, pngBuffer]);
}

async function writeIconPng(sourcePath, outputPath, size) {
  const buffer = await sharp(sourcePath, { failOn: "none" })
    .rotate()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, quality: 95 })
    .toBuffer();

  await writeFile(outputPath, buffer);
  return buffer;
}

async function generateBrandingAssets({ inputRoot, publicRoot, warnings }) {
  const rawLogoRoot = path.join(inputRoot, "08-logo-brand");
  const primarySvg = firstExisting([
    path.join(rawLogoRoot, "radiance-logo-primary.svg"),
    path.join(rawLogoRoot, "radiance-logo.svg"),
  ]);
  const primaryPng = firstExisting([
    path.join(rawLogoRoot, "radiance-logo-primary.png"),
    path.join(rawLogoRoot, "radiance-logo.png"),
    path.join(publicRoot, "radiance-logo-primary.png"),
  ]);
  const markSvg = firstExisting([
    path.join(rawLogoRoot, "radiance-logo-mark.svg"),
    path.join(rawLogoRoot, "radiance-favicon-source.svg"),
  ]);
  const markPng = firstExisting([
    path.join(rawLogoRoot, "radiance-logo-mark.png"),
    path.join(rawLogoRoot, "radiance-favicon-source.png"),
    path.join(publicRoot, "radiance-logo-mark.png"),
    path.join(publicRoot, "radiance-logo.png"),
  ]);
  const logoSource = primarySvg || primaryPng || markSvg || markPng;
  const iconSource = markSvg || markPng || primarySvg || primaryPng || path.join(publicRoot, "radiance-logo.png");

  if (!logoSource && !existsSync(iconSource)) {
    warnings.push(
      "No Radiance logo source found. Add radiance-logo-primary or radiance-logo-mark to radiance-media-raw/08-logo-brand.",
    );
    return;
  }

  if (primarySvg) {
    await copyIfDifferent(primarySvg, path.join(publicRoot, "radiance-logo.svg"));
  }

  if (primaryPng || (!primarySvg && markPng)) {
    await copyIfDifferent(primaryPng || markPng, path.join(publicRoot, "radiance-logo.png"));
  }

  if (markSvg) {
    await copyIfDifferent(markSvg, path.join(publicRoot, "radiance-logo-mark.svg"));
  }

  if (markPng) {
    await copyIfDifferent(markPng, path.join(publicRoot, "radiance-logo-mark.png"));
  }

  if (!existsSync(iconSource)) {
    warnings.push("Logo source was found, but no usable favicon source could be resolved.");
    return;
  }

  const icon16 = await writeIconPng(iconSource, path.join(publicRoot, "favicon-16x16.png"), 16);
  const icon32 = await writeIconPng(iconSource, path.join(publicRoot, "favicon-32x32.png"), 32);
  await writeIconPng(iconSource, path.join(publicRoot, "apple-touch-icon.png"), 180);
  await writeIconPng(iconSource, path.join(publicRoot, "icon-192.png"), 192);
  await writeIconPng(iconSource, path.join(publicRoot, "icon-512.png"), 512);
  await writeFile(path.join(publicRoot, "favicon.ico"), icoFromPng(icon32, 32));
  void icon16;

  await writeFile(
    path.join(publicRoot, "site.webmanifest"),
    `${JSON.stringify(
      {
        name: "Radiance Clinics Bhubaneswar",
        short_name: "Radiance Clinics",
        description:
          "Doctor-led hair, skin, laser and aesthetic care in Bhubaneswar.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#FBF7F0",
        theme_color: "#0F1016",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
}

function parseBeforeAfter(stem, relativePathParts) {
  const normalizedStem = slugify(stem);
  const strictMatch = normalizedStem.match(
    /^radiance-ba-(.+?)-(case[a-z0-9]+)-(.+?)-(before|after)$/i,
  );

  if (strictMatch) {
    const view = strictMatch[3];
    const phase = strictMatch[4];
    const role = `${view}-${phase}`;

    return {
      subject: strictMatch[1],
      usage: role,
      caseId: strictMatch[2],
      beforeAfterRole: camelCaseRole(role),
      beforeAfterView: view,
      beforeAfterPhase: phase,
      pairKey: `${strictMatch[1]}-${strictMatch[2]}`,
    };
  }

  const legacyMatch = normalizedStem.match(
    /^radiance-ba-(.+?)-(case[a-z0-9]+)-(before|after)$/i,
  );

  if (legacyMatch) {
    return {
      subject: legacyMatch[1],
      usage: legacyMatch[3],
      caseId: legacyMatch[2],
      beforeAfterRole: legacyMatch[3],
      beforeAfterView: "primary",
      beforeAfterPhase: legacyMatch[3],
      pairKey: `${legacyMatch[1]}-${legacyMatch[2]}`,
    };
  }

  const tokens = normalizedStem.split("-");
  const { phase, phaseToken } = phaseFromTokens(tokens);
  const caseIndex = tokens.findIndex((token) => /^case[a-z0-9]+$/i.test(token));
  const beforeAfterRoot = relativePathParts.findIndex(
    (part) => ["before-after", "skin-before-after", "hair-before-after"].includes(canonicalCategory(part)),
  );
  const caseFolder = relativePathParts.find((part) => /^case[a-z0-9]+$/i.test(slugify(part)));
  const folderAfterRoot =
    beforeAfterRoot >= 0 && beforeAfterRoot + 1 < relativePathParts.length - 1
      ? canonicalCategory(relativePathParts[beforeAfterRoot + 1])
      : "";
  const folderSubject =
    folderAfterRoot && !/^case[a-z0-9]+$/i.test(folderAfterRoot)
      ? folderAfterRoot
      : "";

  if (!phase) {
    return null;
  }

  const folderSubjectFallback = folderSubject || folderSubjectFromManifestPath(relativePathParts);
  const caseId = caseIndex >= 0 ? tokens[caseIndex] : caseFolder ? slugify(caseFolder) : "";
  const phaseIndex = phaseToken ? tokens.indexOf(phaseToken) : tokens.lastIndexOf(phase);
  const viewTokens =
    caseIndex >= 0
      ? tokens.slice(caseIndex + 1, phaseIndex)
      : tokens
          .slice(0, phaseIndex)
          .filter((token) => !/^b?fore\d*$/i.test(token) && !/^after\d*$/i.test(token));
  const view = viewFromTokens(viewTokens.length ? viewTokens : tokens);
  const role = roleForView(view, phase);
  const subjectTokens =
    caseIndex >= 0
      ? tokens
          .slice(tokens[0] === "radiance" ? 1 : 0, caseIndex)
          .filter((token) => token !== "ba" && token !== "before" && token !== "after")
      : tokens.slice(0, phaseIndex >= 0 ? phaseIndex : tokens.length);
  const rawSubject =
    folderSubjectFallback ||
    subjectFromTokens(subjectTokens) ||
    subjectFromTokens(tokens) ||
    "before-after";
  const condition = normalizeCondition(rawSubject);
  const subject = condition.slug || rawSubject;
  const folderKey = slugify(relativePathParts.slice(0, -1).join("-"));
  const pairKey = caseId ? `${subject}-${caseId}` : `${subject}-${folderKey || "default"}`;

  return {
    subject,
    usage: role,
    caseId,
    beforeAfterRole: camelCaseRole(role),
    beforeAfterView: view,
    beforeAfterViewLabel: viewLabel(view),
    beforeAfterPhase: phase,
    pairKey,
    conditionName: condition.name,
    treatment: condition.treatment,
    conditionUnknown: Boolean(condition.unknown),
  };
}

function folderSubjectFromManifestPath(relativePathParts) {
  return folderSubject(relativePathParts);
}

function normalizeStandardRole({ category, role, usage, subject, stem }) {
  const text = slugify([category, role, usage, subject, stem].join("-"));

  if (
    (category === "doctor" || category === "hero") &&
    /radiance-doctor-satyarth-hero-primary-02|doctor-hero|hero-primary-02/.test(text)
  ) {
    return { role: "hero_primary", usage: "hero-primary", subject: "satyarth" };
  }

  if (
    (category === "doctor" || category === "hero") &&
    /radiance-doctor-satyarth-hero-primary-01|doctor-image|hero-primary-01/.test(text)
  ) {
    return { role: "hero_secondary", usage: "hero-secondary", subject: "satyarth" };
  }

  if (category === "logo-brand") {
    if (/logo-primary|radiance-logo-primary/.test(text)) {
      return { role: "logo_primary", usage: "logo-primary", subject: "radiance" };
    }

    if (/logo-mark|favicon-source|radiance-logo-mark|radiance-favicon-source/.test(text)) {
      return { role: "logo_mark", usage: "logo-mark", subject: "radiance" };
    }
  }

  if (category === "recognition" || category === "logo-brand" || category === "press-newspaper") {
    if (/threebest|threebestrated|best-business|trust-badge/.test(text)) {
      return { role: "trust_badge", usage: "trust-badge", subject };
    }

    if (/anil-kapoor|celebrity/.test(text)) {
      return { role: "recognition_moment", usage: "recognition-moment", subject };
    }

    if (category === "press-newspaper" || /press|newspaper|media-feature|clipping/.test(text)) {
      return { role: "press_clipping", usage: "press-clipping", subject };
    }

    if (/award|ceremony|event|stage/.test(text) && !/certificate|cert/.test(text)) {
      return { role: "award_event", usage: "award-event", subject };
    }

    if (/certificate|cert|ima|ishrs|ahrs|fue-asia|haircon|aesthetic/.test(text)) {
      return { role: "certificate", usage: "certificate", subject };
    }
  }

  return { role, usage, subject };
}

function canonicalRoleValue(role, usage = "") {
  const normalizedRole = slugify(role);
  const normalizedUsage = slugify(usage);
  const combined = `${normalizedRole} ${normalizedUsage}`;

  if (/hero-primary/.test(combined)) return "hero_primary";
  if (/hero-secondary/.test(combined)) return "hero_secondary";
  if (/logo-primary/.test(combined)) return "logo_primary";
  if (/logo-mark|favicon-source/.test(combined)) return "logo_mark";
  if (/trust-badge|threebest|threebestrated|best-business/.test(combined)) return "trust_badge";
  if (/award-event/.test(combined)) return "award_event";
  if (/recognition-moment/.test(combined)) return "recognition_moment";
  if (/press-clipping/.test(combined)) return "press_clipping";
  if (/certificate/.test(combined)) return "certificate";

  return normalizedRole;
}

function displayModeFor({ category, role, usage, subject, stem }) {
  const text = slugify([category, role, usage, subject, stem].join("-"));

  if (
    category === "logo-brand" ||
    category === "press-newspaper" ||
    /certificate|cert|trust-badge|badge|threebest|threebestrated|press|newspaper|clipping/.test(text)
  ) {
    return "contain";
  }

  return "cover";
}

function parseMediaInfo(filePath, inputRoot) {
  const relativePath = path.relative(inputRoot, filePath);
  const relativePathParts = relativePath.split(path.sep);
  const parsed = path.parse(filePath);
  const stem = parsed.name;
  const stemTokens = slugify(stem).split("-").filter(Boolean);
  const dirCategory =
    relativePathParts.length > 1 ? canonicalCategory(relativePathParts[0] || "") : "general";
  const parseWarnings = [];
  const organizedCategory = organizedClassification(stem, relativePathParts);
  const isPreviewSheet = /preview|contact-sheet|contactsheet/.test(slugify(stem));
  const isBeforeAfter =
    !isPreviewSheet &&
    (["before-after", "skin-before-after", "hair-before-after"].includes(dirCategory) ||
      ["skin-before-after", "hair-before-after"].includes(organizedCategory) ||
      stemTokens.includes("ba") ||
      stemTokens.includes("before") ||
      stemTokens.includes("after"));

  if (isBeforeAfter) {
    const beforeAfter = parseBeforeAfter(stem, relativePathParts);
    if (!beforeAfter) {
      parseWarnings.push(
        `${normalizeSlashes(relativePath)}: before/after filename could not be parsed into treatment, view and before/after role.`,
      );
    }
    const subject =
      beforeAfter?.subject ||
      canonicalCategory(relativePathParts[1] || "") ||
      "before-after";
    const role = beforeAfter?.usage || "case";
    const caseId = beforeAfter?.caseId || "";
    const category =
      organizedCategory === "skin-before-after" || organizedCategory === "hair-before-after"
        ? organizedCategory
        : "before-after";
    const transformationCategory =
      category === "skin-before-after"
        ? "skin"
        : category === "hair-before-after"
          ? "hair"
          : inferTransformationCategory(subject, slugify([subject, relativePath].join("-"))) || "hair";
    const condition = beforeAfter?.conditionName
      ? normalizeCondition(beforeAfter.conditionName)
      : normalizeCondition(subject);
    const conditionName = condition.name || titleFromSlug(subject);
    const treatment = beforeAfter?.treatment || condition.treatment || conditionName;

    if (condition.unknown) {
      parseWarnings.push(
        `${normalizeSlashes(relativePath)}: unknown condition name "${conditionName}" was parsed from filename/folder; add a normalization alias if this should be public-facing.`,
      );
    }

    return {
      originalFilename: parsed.base,
      rawRelativePath: normalizeSlashes(relativePath),
      category,
      detectedType: detectedTypes[category] || detectedTypes["before-after"],
      mediaClassification: detectedTypes[category] || detectedTypes["before-after"],
      transformationCategory,
      subject,
      conditionName,
      publicTitle: publicTitleFor(transformationCategory, conditionName, treatment),
      treatment,
      usage: role,
      role,
      sequence: "",
      caseId,
      beforeAfterRole: beforeAfter?.beforeAfterRole || null,
      beforeAfterView: beforeAfter?.beforeAfterView || null,
      beforeAfterViewLabel: beforeAfter?.beforeAfterViewLabel || null,
      beforeAfterPhase: beforeAfter?.beforeAfterPhase || null,
      pairKey: beforeAfter?.pairKey || (caseId ? `${subject}-${caseId}` : ""),
      baseSlug: slugify(beforeAfter ? `radiance-ba-${subject}-${caseId || beforeAfter.pairKey}-${role}` : stem),
      recommendedWebsiteUsage: recommendedWebsiteUsage(category, role, subject),
      parseWarnings,
    };
  }

  let tokens = [...stemTokens];
  const hasRadiancePrefix = tokens[0] === "radiance";
  if (hasRadiancePrefix) tokens = tokens.slice(1);

  const categoryToken = tokens[0] || dirCategory;
  const certificateLike = /(^|-)cert(ificate)?|certificate/.test(slugify(stem));
  const categoryFromName = canonicalCategory(categoryToken);
  let category = "general";

  if (organizedCategory && isKnownCategory(organizedCategory)) {
    category = organizedCategory;
  } else if (certificateLike && !isKnownCategory(dirCategory)) {
    category = "recognition";
    parseWarnings.push(
      `${normalizeSlashes(relativePath)}: certificate-like filename was classified as recognition; rename to radiance-certificate-... for cleaner parsing.`,
    );
  } else if (isKnownCategory(categoryFromName)) {
    category = categoryFromName;
    tokens.shift();
  } else if (isKnownCategory(dirCategory)) {
    category = dirCategory;
    if (hasRadiancePrefix) {
      parseWarnings.push(
        `${normalizeSlashes(relativePath)}: filename category "${categoryToken}" is not recognized; classified by folder as "${category}".`,
      );
    }
  } else {
    category = categoryFromName === "general" ? dirCategory : categoryFromName;
    parseWarnings.push(
      `${normalizeSlashes(relativePath)}: file could not be classified into a known Radiance category.`,
    );
  }

  if (!hasRadiancePrefix) {
    parseWarnings.push(
      `${normalizeSlashes(relativePath)}: filename does not follow the radiance-category-subject-use-seq convention.`,
    );
  }

  let sequence = "";
  let sequenceNumber = null;

  if (tokens.length) {
    const parsedSequence = parseSequenceToken(tokens[tokens.length - 1]);
    if (parsedSequence.sequence) {
      sequence = parsedSequence.sequence;
      sequenceNumber = parsedSequence.sequenceNumber;
      tokens.pop();
      if (parsedSequence.warning) {
        parseWarnings.push(`${normalizeSlashes(relativePath)}: ${parsedSequence.warning}`);
      }
    }
  }

  const isCertificate =
    category === "recognition" &&
    (certificateLike || categoryToken === "certificate" || tokens[0] === "certificate");
  const isHeroGallery = category === "hero" && tokens[0] === "gallery";

  if (isCertificate && tokens[0] === "certificate") {
    tokens = tokens.slice(1);
  }

  const cleanRole = tokens.join("-") || defaultUsage(category);
  let role = isCertificate
    ? `certificate-${cleanRole}`
    : isHeroGallery
      ? cleanRole
      : cleanRole;
  let usage = isCertificate
    ? "certificate"
    : isHeroGallery
      ? "hero-gallery"
      : tokens.length > 1
        ? tokens[tokens.length - 1]
        : role;
  let subject = isCertificate
    ? cleanRole
    : isHeroGallery
      ? tokens.slice(1).join("-") || "gallery"
      : tokens.length > 1
        ? tokens.slice(0, -1).join("-")
        : role;

  const standard = normalizeStandardRole({ category, role, usage, subject, stem });
  role = standard.role;
  usage = standard.usage;
  subject = standard.subject;

  if (role === "hero_primary" && sequenceNumber === null) {
    sequence = sequence || "02";
    sequenceNumber = 2;
  }

  if (role === "hero_secondary" && sequenceNumber === null) {
    sequence = sequence || "01";
    sequenceNumber = 1;
  }

  const parsedCondition = ["generic-service-card", "category-tab-visual", "hero-support"].includes(category)
    ? normalizeCondition(subject || role)
    : null;

  if (
    parsedCondition?.unknown &&
    category !== "hero-support" &&
    !/preview|contact-sheet|visuals-preview/.test(slugify(stem))
  ) {
    parseWarnings.push(
      `${normalizeSlashes(relativePath)}: unknown condition name "${parsedCondition.name}" was parsed from filename/folder; add a normalization alias if this should be public-facing.`,
    );
  }

  return {
    originalFilename: parsed.base,
    rawRelativePath: normalizeSlashes(relativePath),
    category,
    detectedType: detectedTypes[category] || "image",
    mediaClassification: detectedTypes[category] || "image",
    subject,
    conditionName: parsedCondition?.name || "",
    publicTitle: parsedCondition
      ? publicTitleFor(
          inferTransformationCategory(parsedCondition.slug, slugify([subject, role, relativePath].join("-"))) || "skin",
          parsedCondition.name,
          parsedCondition.treatment,
        )
      : "",
    treatment: parsedCondition?.treatment || "",
    usage,
    role,
    sequence,
    sequenceNumber,
    caseId: "",
    beforeAfterRole: null,
    beforeAfterView: null,
    beforeAfterPhase: null,
    pairKey: "",
    baseSlug: slugify(stem),
    recommendedWebsiteUsage: recommendedWebsiteUsage(category, usage, subject),
    displayMode: displayModeFor({ category, role, usage, subject, stem }),
    parseWarnings,
  };
}

function defaultUsage(category) {
  return (
    {
      hero: "hero",
      doctor: "doctor-authority",
      "clinic-ambience": "clinic-gallery",
      equipment: "treatment-equipment",
      recognition: "trust-proof",
      "social-media": "social-proof",
      "press-newspaper": "press",
      team: "team-section",
      videos: "video-thumbnail",
      gallery: "clinic-gallery",
      "logo-brand": "brand-system",
      "generic-service-card": "premium-service-card",
      "hero-support": "homepage-hero-support",
      "category-tab-visual": "treatment-category-tab",
      "skin-before-after": "skin-before-after",
      "hair-before-after": "hair-before-after",
    }[category] || "website"
  );
}

function recommendedWebsiteUsage(category, usage, subject) {
  const normalizedUsage = slugify(usage);

  if (category === "hero") {
    return "Homepage hero collage and above-the-fold proof composition";
  }

  if (category === "doctor" && normalizedUsage.includes("hero")) {
    return "Hero collage, About page, Doctor authority section";
  }

  if (category === "doctor") {
    return "Meet the Doctor, About page, consultation trust sections";
  }

  if (category === "clinic-ambience") {
    return normalizedUsage.includes("wide")
      ? "Homepage hero collage, clinic ambience gallery, contact page"
      : "Clinic ambience gallery, patient care and contact page";
  }

  if (category === "equipment") {
    return "Treatment detail pages, equipment showcase, Skin & Laser section";
  }

  if (category === "before-after") {
    return `Consent-led before/after preview for ${subject.replaceAll("-", " ")}; publish only after consent review`;
  }

  if (category === "hair-before-after") {
    return `Hair Transformation Examples for ${subject.replaceAll("-", " ")}`;
  }

  if (category === "skin-before-after") {
    return `Skin Improvement Examples for ${subject.replaceAll("-", " ")}`;
  }

  if (category === "generic-service-card") {
    return "Premium homepage service cards and treatment option cards";
  }

  if (category === "hero-support") {
    return "Homepage hero support visual";
  }

  if (category === "gallery") {
    return "Inside Radiance Clinics gallery";
  }

  if (category === "category-tab-visual") {
    return "Homepage treatment category tabs";
  }

  if (category === "recognition") {
    return "Doctor authority, trust proof strip, recognition and press sections";
  }

  if (category === "social-media") {
    return "Social and video community section, trust cards, contact page";
  }

  if (category === "press-newspaper") {
    return "Recognition, press and trust milestone sections";
  }

  if (category === "team") {
    return "About page, team section, contact support area";
  }

  if (category === "videos") {
    return "Our Videos carousel, knowledge cards, YouTube/reel thumbnails";
  }

  if (category === "logo-brand") {
    return "Navigation logo, Open Graph fallback, admin branding and social previews";
  }

  return "General website image slot";
}

function rotatedDimensions(metadata) {
  const orientation = Number(metadata.orientation || 1);
  const swaps = [5, 6, 7, 8].includes(orientation);

  return {
    width: swaps ? metadata.height : metadata.width,
    height: swaps ? metadata.width : metadata.height,
  };
}

function sizeWarnings(width, height, relativePath) {
  const warnings = [];

  if (!width || !height) {
    return [`${relativePath}: could not read dimensions.`];
  }

  if (width < 1200 || height < 800) {
    warnings.push(
      `${relativePath}: image is too small for premium web use (${width}x${height}); replace with a higher-resolution original if possible.`,
    );
  } else if (width < 2400 || height < 1400) {
    warnings.push(
      `${relativePath}: below heroDesktop target (${width}x${height}); generated hero variants may be upscaled.`,
    );
  }

  return warnings;
}

async function ensureOutputDirs(outRoot) {
  await mkdir(outRoot, { recursive: true });
  await mkdir(path.join(outRoot, "blur"), { recursive: true });

  for (const variant of variants) {
    await mkdir(path.join(outRoot, variant.dir), { recursive: true });
  }
}

async function writeVariant(inputPath, outputPath, variant, format) {
  if (existsSync(outputPath)) return;

  const base = sharp(inputPath, { failOn: "none" })
    .rotate()
    .resize({
      width: variant.width,
      height: variant.height,
      fit: "cover",
      position: sharp.strategy.attention,
      kernel: sharp.kernel.lanczos3,
    });

  if (format === "webp") {
    await base.webp({ quality: 88, smartSubsample: true, effort: 5 }).toFile(outputPath);
    return;
  }

  throw new Error(`Unsupported generated image format: ${format}`);
}

async function processImage({ filePath, inputRoot, outRoot, usedSlugs, metadataIndex }) {
  const info = parseMediaInfo(filePath, inputRoot);
  const manifestMeta = metadataForFile(metadataIndex, info);
  const category = canonicalCategory(manifestMeta.category || info.category);
  const role = canonicalRoleValue(
    manifestMeta.role || info.role || manifestMeta.usage || info.usage,
    manifestMeta.usage || info.usage,
  );
  const subject = slugify(manifestMeta.subject || info.subject);
  const slug = uniqueSlug(info.baseSlug, info.rawRelativePath, usedSlugs);
  const metadata = await sharp(filePath, { failOn: "none" }).metadata();
  const dimensions = rotatedDimensions(metadata);
  const fileStats = await stat(filePath);
  const contentHash = await fileContentHash(filePath);
  const warnings = sizeWarnings(dimensions.width, dimensions.height, info.rawRelativePath);
  warnings.push(...(info.parseWarnings || []));

  if (!isKnownCategory(category)) {
    warnings.push(
      `${info.rawRelativePath}: "${category}" is not a known website media category; image will be in manifest but may not appear automatically.`,
    );
  }

  const originalRelative = "";

  const generated = {};

  for (const variant of variants) {
    const formatEntries = {};

    for (const format of generatedFormats) {
      const relativePath = normalizeSlashes(path.join(variant.dir, `${slug}.${format}`));
      await writeVariant(filePath, path.join(outRoot, relativePath), variant, format);
      formatEntries[format] = relativePath;
    }

    generated[variant.key] = {
      ...formatEntries,
      width: variant.width,
      height: variant.height,
    };
  }

  const blurBuffer = await sharp(filePath, { failOn: "none" })
    .rotate()
    .resize({ width: 24, height: 24, fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 45, mozjpeg: true })
    .toBuffer();
  const blurPlaceholder = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
  const blurImageRelative = normalizeSlashes(path.join("blur", `${slug}.jpg`));
  const blurTextRelative = normalizeSlashes(path.join("blur", `${slug}.txt`));
  await writeFile(path.join(outRoot, blurImageRelative), blurBuffer);
  await writeFile(path.join(outRoot, blurTextRelative), `${blurPlaceholder}\n`);

  const displayTitle = titleFromSlug(subject || role || slug);
  const altText =
    manifestMeta.alt_text ||
    manifestMeta.alt ||
    `${displayTitle} - Radiance Clinics`;
  const focalPointX = parseNumber(manifestMeta.focal_point_x ?? manifestMeta.focal_x, 0.5);
  const defaultFocalY =
    category === "doctor" && /hero[-_]?primary|hero[-_]?secondary/.test(role)
      ? 0.38
      : 0.5;
  const focalPointY = parseNumber(manifestMeta.focal_point_y ?? manifestMeta.focal_y, defaultFocalY);
  const sortOrder = parseNumber(manifestMeta.sort_order, 0);
  const displayMode =
    manifestMeta.display_mode ||
    manifestMeta.displayMode ||
    info.displayMode ||
    displayModeFor({ category, role, usage: manifestMeta.usage || info.usage, subject, stem: info.originalFilename });
  const consentConfirmed = parseBoolean(
    manifestMeta.consent_confirmed ??
      manifestMeta.patient_consent_confirmed ??
      manifestMeta.consent,
    ["before-after", "skin-before-after", "hair-before-after"].includes(category),
  );
  const normalizedCondition = normalizeCondition(
    manifestMeta.condition || info.conditionName || subject || role || slug,
  );
  const hasConditionName = Boolean(info.conditionName || manifestMeta.condition);
  const conditionName = hasConditionName ? normalizedCondition.name : "";
  const treatment =
    manifestMeta.treatment || info.treatment || (conditionName ? normalizedCondition.treatment : "");
  const transformationCategory =
    info.transformationCategory ||
    (conditionName
      ? inferTransformationCategory(
          normalizedCondition.slug,
          slugify([subject, role, info.rawRelativePath].join("-")),
        )
      : "");
  const publicTitle =
    manifestMeta.public_title ||
    info.publicTitle ||
    (conditionName && transformationCategory
      ? publicTitleFor(transformationCategory, conditionName, treatment)
      : "");

  return {
    id: slug,
    filename: info.originalFilename,
    originalFilename: info.originalFilename,
    originalRelativePath: originalRelative,
    rawRelativePath: info.rawRelativePath,
    category,
    detectedType: detectedTypes[category] || info.detectedType,
    type: detectedTypes[category] || info.detectedType,
    mediaClassification: info.mediaClassification || detectedTypes[category] || info.detectedType,
    transformationCategory,
    subject,
    conditionName,
    publicTitle,
    treatment,
    usage: manifestMeta.usage || info.usage,
    role,
    title: manifestMeta.title || displayTitle,
    altText,
    alt_text: altText,
    caption: manifestMeta.caption || "",
    displayMode,
    contentHash,
    normalizedBasename: slugify(path.parse(info.originalFilename).name),
    focalPointX,
    focalPointY,
    focal_point_x: focalPointX,
    focal_point_y: focalPointY,
    sortOrder,
    sort_order: sortOrder,
    featured: parseBoolean(manifestMeta.featured, false),
    publish: parseBoolean(manifestMeta.publish ?? manifestMeta.is_published, true),
    consentConfirmed,
    consent_confirmed: consentConfirmed,
    timeGap: manifestMeta.time_gap || "",
    disclaimer: manifestMeta.disclaimer || "",
    desktop_url: generated.heroDesktop.webp,
    mobile_url: generated.heroMobile.webp,
    thumb_url: generated.thumb.webp,
    blur_data_url: blurPlaceholder,
    sequence: info.sequence || null,
    sequenceNumber: parseNumber(manifestMeta.sequence_number, info.sequenceNumber),
    caseId: info.caseId || null,
    beforeAfterRole: info.beforeAfterRole,
    beforeAfterView: info.beforeAfterView || null,
    beforeAfterViewLabel: info.beforeAfterViewLabel || null,
    beforeAfterPhase: info.beforeAfterPhase || null,
    beforeAfterPairKey: info.pairKey || null,
    width: dimensions.width,
    height: dimensions.height,
    original: {
      path: originalRelative,
      width: dimensions.width,
      height: dimensions.height,
      format: metadata.format || path.extname(filePath).slice(1).toLowerCase(),
      sizeBytes: fileStats.size,
    },
    generated,
    blur: {
      placeholder: blurPlaceholder,
      imagePath: blurImageRelative,
      textPath: blurTextRelative,
    },
    recommendedWebsiteUsage: recommendedWebsiteUsage(category, manifestMeta.usage || info.usage, subject),
    warnings,
  };
}

function sourceExtensionPriority(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".webp") return 60;
  if (ext === ".jpg" || ext === ".jpeg") return 50;
  if (ext === ".png") return 40;
  if (ext === ".svg") return 30;
  if (ext === ".avif") return 20;
  if (ext === ".tif" || ext === ".tiff") return 10;
  return 0;
}

function sourceDedupeKey(source) {
  const relativePath = normalizeSlashes(path.relative(source.inputRoot, source.filePath));
  const parsed = path.parse(relativePath);
  const dirParts = parsed.dir
    .split("/")
    .filter(Boolean)
    .filter((part, index, parts) => {
      const isLastDir = index === parts.length - 1;
      return !(isLastDir && sourceFormatFolders.has(part.toLowerCase()));
    });
  const stem = slugify(parsed.name) || parsed.name;
  return normalizeSlashes(path.join(...dirParts, stem)).toLowerCase();
}

function dedupeSourceFiles(sourceFiles) {
  const byKey = new Map();
  let duplicates = 0;

  for (const source of sourceFiles) {
    const key = sourceDedupeKey(source);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, source);
      continue;
    }

    duplicates += 1;

    if (sourceExtensionPriority(source.filePath) > sourceExtensionPriority(existing.filePath)) {
      byKey.set(key, source);
    }
  }

  return {
    files: Array.from(byKey.values()).sort((a, b) => a.filePath.localeCompare(b.filePath)),
    duplicates,
  };
}

function pairImagePayload(item) {
  return {
    id: item.id,
    role: item.role,
    beforeAfterRole: item.beforeAfterRole,
    beforeAfterView: item.beforeAfterView,
    beforeAfterViewLabel: item.beforeAfterViewLabel,
    beforeAfterPhase: item.beforeAfterPhase,
    originalFilename: item.originalFilename,
    originalRelativePath: item.originalRelativePath,
    desktop: item.generated.heroDesktop,
    mobile: item.generated.heroMobile,
    thumb: item.generated.thumb,
    landscape: item.generated.landscape,
    portrait: item.generated.portrait,
    square: item.generated.square,
    altText: item.altText,
    caption: item.caption,
    blurDataUrl: item.blur_data_url,
  };
}

function buildBeforeAfterPairs(manifest) {
  const pairMap = new Map();
  const warnings = [];
  const supportedCategories = new Set(["before-after", "skin-before-after", "hair-before-after"]);

  for (const item of manifest) {
    if (!supportedCategories.has(item.category) || !item.beforeAfterPhase) {
      continue;
    }

    const inferredCategory =
      item.transformationCategory ||
      (item.category === "skin-before-after"
        ? "skin"
        : item.category === "hair-before-after"
          ? "hair"
          : inferTransformationCategory(item.subject, slugify([item.subject, item.rawRelativePath].join("-"))) || "hair");
    const condition = normalizeCondition(item.conditionName || item.subject);
    const conditionName = item.conditionName || condition.name || titleFromSlug(item.subject);
    const treatment = item.treatment || condition.treatment || conditionName;
    const key = item.beforeAfterPairKey || `${inferredCategory}-${condition.slug || item.subject}-${item.caseId || "set"}`;
    const pair = pairMap.get(key) || {
      id: key,
      pairKey: key,
      caseId: item.caseId || key,
      category: inferredCategory,
      conditionName,
      publicTitle: item.publicTitle || publicTitleFor(inferredCategory, conditionName, treatment),
      treatment,
      treatmentCategory: item.subject,
      title: item.publicTitle || publicTitleFor(inferredCategory, conditionName, treatment),
      patientLabel: item.publicTitle || publicTitleFor(inferredCategory, conditionName, treatment),
      timeGap: item.timeGap || "",
      disclaimer:
        item.disclaimer ||
        "Results vary by individual. Images are shared with consent. A consultation is required.",
      consentConfirmed: false,
      publish: true,
      featured: false,
      sortOrder: item.sortOrder || 0,
      views: {},
      beforeAfterPairs: [],
      additionalImages: [],
      duplicateImages: [],
      frontBefore: null,
      frontAfter: null,
      angleBefore: null,
      angleAfter: null,
      before: null,
      after: null,
      images: {},
      extraImages: [],
      complete: false,
      recommendedWebsiteUsage: item.recommendedWebsiteUsage,
    };

    const imagePayload = pairImagePayload(item);
    const view = item.beforeAfterView || "primary";
    const viewGroup = pair.views[view] || {
      view,
      viewLabel: item.beforeAfterViewLabel || viewLabel(view),
      before: null,
      after: null,
      duplicates: [],
    };
    const phase = item.beforeAfterPhase === "after" ? "after" : "before";
    const existing = viewGroup[phase];

    if (existing) {
      const selected = preferPairImage(existing, imagePayload);
      const duplicate = selected === existing ? imagePayload : existing;
      viewGroup[phase] = selected;
      viewGroup.duplicates.push(duplicate);
      pair.duplicateImages.push(duplicate);
      warnings.push(
        `${key}: duplicate ${viewGroup.viewLabel} ${phase} image "${duplicate.originalFilename}" kept in manifest; selected "${selected.originalFilename}" for the public pair.`,
      );
    } else {
      viewGroup[phase] = imagePayload;
    }

    pair.views[view] = viewGroup;
    pair.images[item.beforeAfterRole || `${view}-${phase}`] = imagePayload;

    if (Object.prototype.hasOwnProperty.call(pair, item.beforeAfterRole)) {
      pair[item.beforeAfterRole] = imagePayload;
    } else {
      pair.extraImages.push(imagePayload);
    }

    if (item.beforeAfterRole === "before") pair.before = imagePayload;
    if (item.beforeAfterRole === "after") pair.after = imagePayload;

    pair.consentConfirmed = pair.consentConfirmed || item.consentConfirmed;
    pair.publish = pair.publish && item.publish;
    pair.featured = pair.featured || item.featured;
    pair.sortOrder = Math.min(pair.sortOrder || item.sortOrder || 0, item.sortOrder || 0);
    pair.timeGap = pair.timeGap || item.timeGap || "";
    pair.disclaimer = pair.disclaimer || item.disclaimer || "";

    pairMap.set(key, pair);
  }

  const pairs = Array.from(pairMap.values())
    .map((pair) => {
      const orderedViews = Object.values(pair.views).sort(compareViewGroups);
      const completeViews = [];
      const additionalImages = [];

      for (const view of orderedViews) {
        if (view.before && view.after) {
          completeViews.push({
            viewLabel: view.viewLabel,
            before: view.before,
            after: view.after,
          });
          continue;
        }

        if (view.before || view.after) {
          const missing = view.before ? "after" : "before";
          const present = view.before || view.after;
          warnings.push(`${pair.pairKey}: unpaired ${view.viewLabel} image is missing ${missing}.`);
          additionalImages.push(present);
        }
      }

      const primary = completeViews[0];
      const secondary = completeViews[1];
      const crown = completeViews.find((view) => /crown|top/i.test(view.viewLabel));

      pair.beforeAfterPairs = completeViews;
      pair.additionalImages = [...additionalImages, ...pair.duplicateImages];
      pair.frontBefore = pair.frontBefore || primary?.before || null;
      pair.frontAfter = pair.frontAfter || primary?.after || null;
      pair.angleBefore = pair.angleBefore || secondary?.before || null;
      pair.angleAfter = pair.angleAfter || secondary?.after || null;
      pair.topBefore = pair.topBefore || crown?.before || null;
      pair.topAfter = pair.topAfter || crown?.after || null;
      if (!pair.before && pair.frontBefore) pair.before = pair.frontBefore;
      if (!pair.after && pair.frontAfter) pair.after = pair.frontAfter;

      if (!completeViews.length) {
        warnings.push(`${pair.pairKey}: no valid before/after transformation pair was found.`);
      }

      if (!pair.consentConfirmed) {
        warnings.push(
          `${pair.pairKey}: consent_confirmed is not true in media-manifest.csv; public before/after publishing should stay disabled.`,
        );
      }

      return {
        ...pair,
        complete: completeViews.length > 0,
        warnings: completeViews.length ? [] : ["Missing a complete before/after image pair."],
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.pairKey.localeCompare(b.pairKey));

  return { pairs, warnings };
}

function imageExtensionPriority(image) {
  const filename = String(image.originalFilename || "").toLowerCase();
  if (filename.endsWith(".webp")) return 5;
  if (filename.endsWith(".avif")) return 4;
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return 3;
  if (filename.endsWith(".png")) return 2;
  return 1;
}

function preferPairImage(current, candidate) {
  return imageExtensionPriority(candidate) > imageExtensionPriority(current)
    ? candidate
    : current;
}

function compareViewGroups(a, b) {
  const priority = {
    primary: 0,
    front: 0,
    side: 1,
    second: 1,
    angle: 1,
    crown: 2,
    top: 2,
    closeup: 3,
  };

  return (priority[a.view] ?? 10) - (priority[b.view] ?? 10) || a.view.localeCompare(b.view);
}

function duplicateWarnings(manifest) {
  const warnings = [];
  const groups = [
    {
      label: "normalized basename",
      key: (item) => item.normalizedBasename,
    },
    {
      label: "content hash",
      key: (item) => item.contentHash,
    },
  ];

  for (const group of groups) {
    const seen = new Map();

    for (const item of manifest) {
      const key = group.key(item);
      if (!key) continue;

      const bucket = seen.get(key) || [];
      bucket.push(item);
      seen.set(key, bucket);
    }

    for (const [key, bucket] of seen) {
      if (bucket.length < 2) continue;

      warnings.push(
        `Duplicate ${group.label} "${key}" appears in: ${bucket
          .map((item) => item.rawRelativePath)
          .join(", ")}.`,
      );
    }
  }

  return warnings;
}

function printSummary({ processed, skipped, warnings, errors, outRoot, loadedManifestFiles }) {
  console.log("");
  console.log("Radiance media processing complete.");
  console.log(`Output: ${outRoot}`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`CSV manifests: ${loadedManifestFiles.length ? loadedManifestFiles.join(", ") : "none"}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);

  if (warnings.length) {
    console.log("");
    console.log("Warnings:");
    for (const warning of warnings) {
      console.warn(`[WARN] ${warning}`);
    }
  }

  if (errors.length) {
    console.log("");
    console.log("Errors:");
    for (const error of errors) {
      console.error(`[ERROR] ${error}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(help);
    return;
  }

  const inputRoot = path.resolve(String(args.input));
  const outRoot = path.resolve(String(args.out));

  if (!existsSync(inputRoot)) {
    throw new Error(`Input folder not found: ${inputRoot}`);
  }

  await ensureOutputDirs(outRoot);

  const publicRoot = path.resolve("public");
  const supplementalFolders = await discoverSupplementalFolders({
    inputRoot,
    publicRoot,
    outRoot,
  });
  const rawSourceFiles = (await walkImages(inputRoot)).map((filePath) => ({
    filePath,
    inputRoot,
  }));
  const sourceFiles = [...rawSourceFiles];
  const enhancedCertificatesRoot = firstExisting([
    path.resolve("raw-media/radiance-certificates-enhanced"),
    path.resolve("public/radiance-certificates-enhanced"),
  ]);

  for (const folder of supplementalFolders) {
    if (isSameOrInside(inputRoot, folder)) continue;

    const files = await walkImages(folder);
    sourceFiles.push(
      ...files.map((filePath) => ({
        filePath,
        inputRoot: path.dirname(folder),
      })),
    );
  }

  if (enhancedCertificatesRoot && existsSync(enhancedCertificatesRoot) && !enhancedCertificatesRoot.startsWith(inputRoot)) {
    const certificateFiles = await walkImages(enhancedCertificatesRoot);
    sourceFiles.push(
      ...certificateFiles.map((filePath) => ({
        filePath,
        inputRoot: path.dirname(enhancedCertificatesRoot),
      })),
    );
  }

  if (!sourceFiles.length) {
    throw new Error(`No supported images found in ${inputRoot}`);
  }

  const dedupedSources = dedupeSourceFiles(sourceFiles);

  const metadataIndex = await loadManifestMetadata([
    inputRoot,
    ...supplementalFolders,
    enhancedCertificatesRoot || "",
  ]);

  console.log("Radiance media pipeline");
  console.log(`Input: ${inputRoot}`);
  console.log(`Output: ${outRoot}`);
  console.log(`Images found: ${sourceFiles.length}`);
  console.log(`Images after dedupe: ${dedupedSources.files.length}`);
  console.log(`Duplicate source variants skipped: ${dedupedSources.duplicates}`);
  console.log(
    `Supplemental folders: ${supplementalFolders.length ? supplementalFolders.join(", ") : "none"}`,
  );
  console.log(`CSV manifests: ${metadataIndex.loadedFiles.length ? metadataIndex.loadedFiles.join(", ") : "none"}`);
  console.log("");

  const manifest = [];
  const warnings = [];
  const errors = [];
  const usedSlugs = new Set();
  let skipped = 0;

  await generateBrandingAssets({ inputRoot, publicRoot, warnings });

  for (const source of dedupedSources.files) {
    const { filePath, inputRoot: sourceInputRoot } = source;
    const relativePath = normalizeSlashes(path.relative(sourceInputRoot, filePath));

    try {
      const item = await processImage({
        filePath,
        inputRoot: sourceInputRoot,
        outRoot,
        usedSlugs,
        metadataIndex,
      });
      manifest.push(item);
      warnings.push(...item.warnings);
      console.log(`[OK] ${relativePath} -> ${item.id}`);
    } catch (error) {
      skipped += 1;
      errors.push(`${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`[ERROR] ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const beforeAfter = buildBeforeAfterPairs(manifest);
  warnings.push(...duplicateWarnings(manifest));
  warnings.push(...beforeAfter.warnings);

  const manifestPayload = {
    generatedAt: new Date().toISOString(),
    inputRoot,
    outputRoot: outRoot,
    counts: {
      processed: manifest.length,
      skipped,
      warnings: warnings.length,
      errors: errors.length,
    },
    variants: variants.map((variant) => ({
      key: variant.key,
      directory: variant.dir,
      width: variant.width,
      height: variant.height,
      formats: generatedFormats,
      webpQuality: 88,
    })),
    items: manifest.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
    ),
    warnings,
    errors,
  };

  const beforeAfterPayload = {
    generatedAt: manifestPayload.generatedAt,
    pairs: beforeAfter.pairs,
    warnings: beforeAfter.warnings,
  };

  await writeFile(path.join(outRoot, "manifest.json"), `${JSON.stringify(manifestPayload, null, 2)}\n`);
  await writeFile(path.join(outRoot, "before-after-pairs.json"), `${JSON.stringify(beforeAfterPayload, null, 2)}\n`);

  printSummary({
    processed: manifest.length,
    skipped,
    warnings,
    errors,
    outRoot,
    loadedManifestFiles: metadataIndex.loadedFiles,
  });

  if (errors.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`[FATAL] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
