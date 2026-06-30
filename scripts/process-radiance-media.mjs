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

const categoryAliases = new Map([
  ["01-hero", "hero"],
  ["hero", "hero"],
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
};

const help = `Usage:
  npm run process:media
  npm run process:media -- --input ../radiance-media-raw --out ../radiance-media-processed

Defaults:
  --input radiance-media-raw
  --out   radiance-media-processed

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
    input: "public/radiance-media-raw",
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

async function loadManifestMetadata(inputRoot) {
  const candidates = [
    path.join(inputRoot, "media-manifest.csv"),
    path.join(inputRoot, "manifest.csv"),
  ];
  const byFilename = new Map();
  const byRelativePath = new Map();
  const byStem = new Map();
  const loadedFiles = [];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;

    loadedFiles.push(candidate);
    const rows = parseCsv(await readFile(candidate, "utf8"));
    for (const row of rows) {
      const filename =
        row.filename ||
        row.file_name ||
        row.new_filename ||
        row.original_filename ||
        row.original_generated_filename ||
        "";
      const relativePath = row.relative_path || row.raw_relative_path || row.path || "";
      const stem = slugify(path.parse(filename).name || filename);

      if (filename) byFilename.set(filename.toLowerCase(), row);
      if (relativePath) byRelativePath.set(normalizeSlashes(relativePath).toLowerCase(), row);
      if (stem) byStem.set(stem, row);
    }
  }

  return { byFilename, byRelativePath, byStem, loadedFiles };
}

function metadataForFile(metadataIndex, info) {
  const filename = info.originalFilename.toLowerCase();
  const relative = info.rawRelativePath.toLowerCase();
  const stem = slugify(path.parse(info.originalFilename).name);

  return (
    metadataIndex.byRelativePath.get(relative) ||
    metadataIndex.byFilename.get(filename) ||
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
      "No Radiance logo source found. Add radiance-logo-primary or radiance-logo-mark to public/radiance-media-raw/08-logo-brand.",
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
  const phaseToken = tokens.find((token) =>
    token === "before" ||
    token === "after" ||
    /^before\d*$/i.test(token) ||
    /^after\d*$/i.test(token) ||
    /^bfore\d*$/i.test(token),
  );
  const phase = phaseToken
    ? /^after/i.test(phaseToken)
      ? "after"
      : "before"
    : "";
  const caseIndex = tokens.findIndex((token) => /^case[a-z0-9]+$/i.test(token));
  const beforeAfterRoot = relativePathParts.findIndex(
    (part) => canonicalCategory(part) === "before-after",
  );
  const caseFolder = relativePathParts.find((part) => /^case[a-z0-9]+$/i.test(slugify(part)));
  const folderAfterRoot =
    beforeAfterRoot >= 0 && relativePathParts[beforeAfterRoot + 1]
      ? canonicalCategory(relativePathParts[beforeAfterRoot + 1])
      : "";
  const folderSubject =
    folderAfterRoot && !/^case[a-z0-9]+$/i.test(folderAfterRoot)
      ? folderAfterRoot
      : "";

  if (!phase || (caseIndex < 0 && !caseFolder)) {
    return null;
  }

  const caseId = caseIndex >= 0 ? tokens[caseIndex] : slugify(caseFolder);
  const phaseIndex = phaseToken ? tokens.indexOf(phaseToken) : tokens.lastIndexOf(phase);
  const viewTokens =
    caseIndex >= 0
      ? tokens.slice(caseIndex + 1, phaseIndex)
      : tokens.slice(0, phaseIndex).filter((token) => !/^b?fore\d*$/i.test(token) && !/^after\d*$/i.test(token));
  const view = viewTokens.join("-") || "primary";
  const role = view === "primary" ? phase : `${view}-${phase}`;
  const subjectTokens =
    caseIndex >= 0
      ? tokens
          .slice(tokens[0] === "radiance" ? 1 : 0, caseIndex)
          .filter((token) => token !== "ba" && token !== "before" && token !== "after")
      : [];
  const subject = folderSubject || subjectTokens.join("-") || "hair-transplant";

  return {
    subject,
    usage: role,
    caseId,
    beforeAfterRole: camelCaseRole(role),
    beforeAfterView: view,
    beforeAfterPhase: phase,
    pairKey: `${subject}-${caseId}`,
  };
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
  const isBeforeAfter =
    dirCategory === "before-after" ||
    stemTokens.includes("ba") ||
    stemTokens.includes("before") ||
    stemTokens.includes("after");

  if (isBeforeAfter) {
    const beforeAfter = parseBeforeAfter(stem, relativePathParts);
    if (!beforeAfter) {
      parseWarnings.push(
        `${normalizeSlashes(relativePath)}: before/after filename could not be parsed into treatment, case id, view and before/after role.`,
      );
    }
    const subject =
      beforeAfter?.subject ||
      canonicalCategory(relativePathParts[1] || "") ||
      "before-after";
    const role = beforeAfter?.usage || "case";
    const caseId = beforeAfter?.caseId || "";

    return {
      originalFilename: parsed.base,
      rawRelativePath: normalizeSlashes(relativePath),
      category: "before-after",
      detectedType: detectedTypes["before-after"],
      subject,
      usage: role,
      role,
      sequence: "",
      caseId,
      beforeAfterRole: beforeAfter?.beforeAfterRole || null,
      beforeAfterView: beforeAfter?.beforeAfterView || null,
      beforeAfterPhase: beforeAfter?.beforeAfterPhase || null,
      pairKey: beforeAfter?.pairKey || (caseId ? `${subject}-${caseId}` : ""),
      baseSlug: slugify(beforeAfter ? `radiance-ba-${subject}-${caseId}-${role}` : stem),
      recommendedWebsiteUsage: recommendedWebsiteUsage("before-after", role, subject),
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

  if (certificateLike && !isKnownCategory(dirCategory)) {
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

  return {
    originalFilename: parsed.base,
    rawRelativePath: normalizeSlashes(relativePath),
    category,
    detectedType: detectedTypes[category] || "image",
    subject,
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
      "logo-brand": "brand-system",
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
      : "Clinic ambience gallery, patient journey and contact page";
  }

  if (category === "equipment") {
    return "Treatment detail pages, equipment showcase, Skin & Laser section";
  }

  if (category === "before-after") {
    return `Consent-led before/after preview for ${subject.replaceAll("-", " ")}; publish only after consent review`;
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
  await mkdir(path.join(outRoot, "originals"), { recursive: true });
  await mkdir(path.join(outRoot, "blur"), { recursive: true });

  for (const variant of variants) {
    await mkdir(path.join(outRoot, variant.dir), { recursive: true });
  }
}

async function writeVariant(inputPath, outputPath, variant, format) {
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

  await base.avif({ quality: 70, effort: 6 }).toFile(outputPath);
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

  const originalRelative = normalizeSlashes(path.join("originals", safeRelativePath(info.rawRelativePath)));
  const originalOutputPath = path.join(outRoot, originalRelative);
  await mkdir(path.dirname(originalOutputPath), { recursive: true });
  await copyFile(filePath, originalOutputPath);

  const generated = {};

  for (const variant of variants) {
    const webpRelative = normalizeSlashes(path.join(variant.dir, `${slug}.webp`));
    const avifRelative = normalizeSlashes(path.join(variant.dir, `${slug}.avif`));

    await writeVariant(filePath, path.join(outRoot, webpRelative), variant, "webp");
    await writeVariant(filePath, path.join(outRoot, avifRelative), variant, "avif");

    generated[variant.key] = {
      webp: webpRelative,
      avif: avifRelative,
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
    false,
  );

  return {
    id: slug,
    filename: info.originalFilename,
    originalFilename: info.originalFilename,
    originalRelativePath: originalRelative,
    rawRelativePath: info.rawRelativePath,
    category,
    detectedType: detectedTypes[category] || info.detectedType,
    type: detectedTypes[category] || info.detectedType,
    subject,
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

function pairImagePayload(item) {
  return {
    id: item.id,
    role: item.role,
    beforeAfterRole: item.beforeAfterRole,
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
  const requiredRoles = ["frontBefore", "frontAfter", "angleBefore", "angleAfter"];

  for (const item of manifest) {
    if (item.category !== "before-after" || !item.caseId || !item.beforeAfterRole) {
      continue;
    }

    const key = item.beforeAfterPairKey || `${item.subject}-${item.caseId}`;
    const pair = pairMap.get(key) || {
      pairKey: key,
      caseId: item.caseId,
      category: item.subject,
      treatmentCategory: item.subject,
      title: item.title || titleFromSlug(`${item.subject} ${item.caseId}`),
      patientLabel: `Case ${String(item.caseId).replace(/^case/i, "").toUpperCase()}`,
      timeGap: item.timeGap || "",
      disclaimer: item.disclaimer || "",
      consentConfirmed: false,
      publish: true,
      featured: false,
      sortOrder: item.sortOrder || 0,
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
    pair.images[item.beforeAfterRole] = imagePayload;

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
      if (!pair.frontBefore && pair.before) pair.frontBefore = pair.before;
      if (!pair.frontAfter && pair.after) pair.frontAfter = pair.after;

      const missing = requiredRoles
        .filter((role) => !pair[role])
        .map((role) => role.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`));

      if (missing.length) {
        warnings.push(`${pair.pairKey}: missing ${missing.join(" and ")} image.`);
      }

      if (!pair.consentConfirmed) {
        warnings.push(
          `${pair.pairKey}: consent_confirmed is not true in media-manifest.csv; public before/after publishing should stay disabled.`,
        );
      }

      return {
        ...pair,
        complete: missing.length === 0,
        warnings: missing.length ? [`Missing ${missing.join(" and ")} image.`] : [],
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.pairKey.localeCompare(b.pairKey));

  return { pairs, warnings };
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

  const sourceFiles = (await walkImages(inputRoot)).map((filePath) => ({
    filePath,
    inputRoot,
  }));
  const enhancedCertificatesRoot = path.resolve("public/radiance-certificates-enhanced");
  const publicRoot = path.resolve("public");

  if (existsSync(enhancedCertificatesRoot) && !enhancedCertificatesRoot.startsWith(inputRoot)) {
    const certificateFiles = await walkImages(enhancedCertificatesRoot);
    sourceFiles.push(
      ...certificateFiles.map((filePath) => ({
        filePath,
        inputRoot: publicRoot,
      })),
    );
  }

  if (!sourceFiles.length) {
    throw new Error(`No supported images found in ${inputRoot}`);
  }

  const metadataIndex = await loadManifestMetadata(inputRoot);

  console.log("Radiance media pipeline");
  console.log(`Input: ${inputRoot}`);
  console.log(`Output: ${outRoot}`);
  console.log(`Images found: ${sourceFiles.length}`);
  console.log(`CSV manifests: ${metadataIndex.loadedFiles.length ? metadataIndex.loadedFiles.join(", ") : "none"}`);
  console.log("");

  const manifest = [];
  const warnings = [];
  const errors = [];
  const usedSlugs = new Set();
  let skipped = 0;

  await generateBrandingAssets({ inputRoot, publicRoot, warnings });

  for (const source of sourceFiles) {
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
      formats: ["webp", "avif"],
      webpQuality: 88,
      avifQuality: 70,
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
