import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { load } from "cheerio";

const root = process.cwd();
const inputArgument = process.argv.find((value) => value.startsWith("--input="));
const inputPath = path.resolve(
  root,
  inputArgument?.slice("--input=".length) ||
    process.env.RADIANCE_WXR_PATH ||
    "../radiance.xml",
);

function tagValue(source, tag) {
  const match = source.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
  );
  return (match?.[1] || "").trim();
}

function decode(value) {
  if (!value) return "";
  return load(`<body>${value}</body>`, { xmlMode: false })("body").text().trim();
}

function cleanContent(value) {
  const $ = load(value || "");
  $("script,style,form,noscript,iframe").remove();
  return $("body")
    .text()
    .replace(/\[[^\]]{1,180}\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n";
}

function normalizedPath(value, slug) {
  try {
    const url = new URL(value);
    return url.pathname === "/" ? "/" : `${url.pathname.replace(/\/+$/, "")}/`;
  } catch {
    return slug ? `/${slug}/` : "";
  }
}

const exactDestinations = new Map([
  ["/", "/"],
  ["/about-us/", "/about"],
  ["/contact-us/", "/contact"],
  ["/locations/", "/locations"],
  ["/skin-care-treatments/", "/skin-clinic-bhubaneswar"],
  ["/hair-loss-treatments/", "/hair-transplant-bhubaneswar"],
  ["/hair-transplantation/", "/hair-transplant-bhubaneswar"],
  ["/acne-scars/", "/acne-scar-treatment-bhubaneswar"],
  ["/laser-hair-removal-radiance/", "/laser-hair-removal-bhubaneswar"],
  ["/skin-pigmentation/", "/pigmentation-treatment-bhubaneswar"],
  ["/tan-removal/", "/pigmentation-treatment-bhubaneswar"],
  ["/sunspot-removal/", "/concerns/pigmentation/sunspots"],
  ["/dandruff-treatment/", "/concerns/hair-loss-scalp/dandruff"],
  ["/alopecia-treatment/", "/concerns/hair-loss-scalp/alopecia-areata"],
  ["/hair-loss-causes/", "/concerns/hair-loss-scalp/hair-loss"],
  ["/female-hair-transplant/", "/concerns/hair-transplant/female-hair-transplant"],
  ["/beard-mustache-transplant/", "/concerns/hair-transplant/beard-transplant"],
  ["/botox-treatment/", "/treatments/aesthetic-dermatology/injectable-aesthetics"],
  ["/fillers/", "/treatments/aesthetic-dermatology/injectable-aesthetics"],
  ["/treatment/acne-treatment/", "/concerns/acne/acne"],
  ["/treatment/acne-scars/", "/concerns/acne-scars/acne-scars"],
  ["/treatment/pigmentation/", "/concerns/pigmentation/pigmentation"],
]);

function migrationSuggestion(item) {
  const exact = exactDestinations.get(item.path);
  if (exact) return { destination: exact, confidence: "high", action: "rewrite-review-and-redirect" };
  const text = `${item.title} ${item.slug}`.toLowerCase();
  if (item.type === "attachment") {
    return { destination: "", confidence: "n/a", action: "media-rights-and-usage-review" };
  }
  if (/hair transplant|hair restoration|hairline|graft/.test(text)) {
    return { destination: "/concerns/hair-transplant", confidence: "low", action: "merge-candidate" };
  }
  if (/hair loss|hair fall|alopecia|dandruff|scalp/.test(text)) {
    return { destination: "/concerns/hair-loss-scalp", confidence: "low", action: "merge-candidate" };
  }
  if (/acne scar/.test(text)) {
    return { destination: "/concerns/acne-scars", confidence: "low", action: "merge-candidate" };
  }
  if (/acne|pimple/.test(text)) {
    return { destination: "/concerns/acne", confidence: "low", action: "merge-candidate" };
  }
  if (/pigment|melasma|dark circle|sunspot|tan /.test(text)) {
    return { destination: "/concerns/pigmentation", confidence: "low", action: "merge-candidate" };
  }
  if (/laser hair|unwanted hair|hair removal/.test(text)) {
    return { destination: "/concerns/laser-hair-reduction", confidence: "low", action: "merge-candidate" };
  }
  return { destination: "/knowledge", confidence: "low", action: "editorial-triage" };
}

function riskFlags(text) {
  const checks = [
    ["guaranteed-claim", /guarantee(?:d)?|100% result/i],
    ["permanence-claim", /permanent (?:solution|removal|cure|result)/i],
    ["best-superlative", /\bbest\b|number\s*1|no\.\s*1/i],
    ["medical-review", /treat|diagnos|medicine|therapy|procedure|surgery/i],
    ["obsolete-technology-claim", /stem cell|bio hair transplant|skin whitening/i],
  ];
  return checks.filter(([, expression]) => expression.test(text)).map(([label]) => label);
}

async function main() {
  const xml = await readFile(inputPath, "utf8");
  const itemSources = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  const items = itemSources
    .map((source) => {
      const type = tagValue(source, "wp:post_type");
      if (!new Set(["page", "post", "attachment"]).has(type)) return null;
      const title = decode(tagValue(source, "title"));
      const slug = decode(tagValue(source, "wp:post_name"));
      const url = decode(tagValue(source, "link"));
      const attachmentUrl = decode(tagValue(source, "wp:attachment_url"));
      const rawContent = tagValue(source, "content:encoded");
      const content = cleanContent(rawContent);
      const status = tagValue(source, "wp:status");
      const publishedAt = tagValue(source, "wp:post_date_gmt") || tagValue(source, "wp:post_date");
      const pathValue = normalizedPath(url, slug);
      const flags = riskFlags(`${title} ${content}`);
      return {
        type,
        status,
        title,
        slug,
        url,
        path: pathValue,
        attachmentUrl,
        publishedAt,
        wordCount: content ? content.split(/\s+/).length : 0,
        content,
        flags,
      };
    })
    .filter(Boolean);

  const publicContent = items.filter((item) => item.type === "attachment" || item.status === "publish");
  const inventoryRows = publicContent.map((item) => ({
    legacy_url: item.url || item.attachmentUrl,
    path: item.path,
    content_type: item.type,
    status: item.status,
    title: item.title,
    slug: item.slug,
    published_at: item.publishedAt,
    word_count: item.wordCount,
    media_url: item.attachmentUrl,
    medical_or_claim_flags: item.flags.join(";"),
    privacy_note: "WordPress form and Flamingo records intentionally excluded",
  }));

  const contentItems = publicContent.filter((item) => item.type === "page" || item.type === "post");
  const migrationRows = contentItems.map((item) => {
    const suggestion = migrationSuggestion(item);
    return {
      legacy_url: item.url,
      legacy_title: item.title,
      legacy_type: item.type,
      historical_publish_date: item.publishedAt,
      suggested_destination: suggestion.destination,
      action: suggestion.action,
      equivalence_confidence: suggestion.confidence,
      medical_review_required: item.flags.includes("medical-review") ? "true" : "editorial-review",
      auto_publish: "false",
      notes: item.flags.join(";"),
    };
  });

  const candidates = contentItems.map((item) => {
    const suggestion = migrationSuggestion(item);
    return {
      legacyUrl: item.url,
      historicalPublishedAt: item.publishedAt,
      type: item.type,
      title: item.title,
      slug: item.slug,
      wordCount: item.wordCount,
      suggestedDestination: suggestion.destination,
      migrationAction: suggestion.action,
      equivalenceConfidence: suggestion.confidence,
      reviewStatus: "READY_FOR_EDITORIAL_TRIAGE",
      medicalReviewRequired: item.flags.includes("medical-review"),
      riskFlags: item.flags,
      extractedText: item.content.slice(0, 8000),
    };
  });

  await mkdir(path.join(root, "seo"), { recursive: true });
  await mkdir(path.join(root, "content", "migration-review"), { recursive: true });
  await Promise.all([
    writeFile(
      path.join(root, "seo", "old-content-inventory.csv"),
      toCsv(
        ["legacy_url", "path", "content_type", "status", "title", "slug", "published_at", "word_count", "media_url", "medical_or_claim_flags", "privacy_note"],
        inventoryRows,
      ),
    ),
    writeFile(
      path.join(root, "seo", "content-migration-map.csv"),
      toCsv(
        ["legacy_url", "legacy_title", "legacy_type", "historical_publish_date", "suggested_destination", "action", "equivalence_confidence", "medical_review_required", "auto_publish", "notes"],
        migrationRows,
      ),
    ),
    writeFile(
      path.join(root, "content", "migration-review", "candidates.json"),
      `${JSON.stringify({ generatedAt: new Date().toISOString(), source: path.basename(inputPath), autoPublish: false, candidates }, null, 2)}\n`,
    ),
    writeFile(
      path.join(root, "content", "migration-review", "README.md"),
      "# Legacy content review queue\n\nGenerated by `npm run content:migrate-old`. Nothing in this directory is imported into public routes automatically. Each candidate requires editorial triage, claim cleanup, destination review and medical review where indicated. WordPress contact and Flamingo submission records are intentionally excluded.\n",
    ),
  ]);

  console.log(`Migrated ${contentItems.length} review candidates and inventoried ${publicContent.length} public content/media records from ${inputPath}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
