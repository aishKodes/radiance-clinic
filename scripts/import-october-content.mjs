import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "./import-doctor-articles.mjs";
import { doctorSources, expansionSources, releaseDate } from "./october-content-config.mjs";
import { readCsv, writeCsv } from "./seo-utils.mjs";

const root = process.cwd();
const incoming = process.env.RADIANCE_INCOMING || "/Users/aishwaryam/Downloads";
const archive = "content/doctor-articles/2026-10-27";
const packName = "Radiance_Hair_Transplant_Query_Expansion_Pack_Oct2026.md";
const packArchive = `content/hair-query-expansion/${packName}`;
const reviewEvidence = "Human clinic representative explicitly confirmed doctor approval of all ten drafts in this chat; exact medical review date not supplied.";
const transplant = "/hair-transplant-bhubaneswar";
const articles = [];
const supplements = {};
const audit = [];
const provenance = [];

function key(text) {
  return text.replace(/^\d+[.)]\s*/, "").replace(/[’‘]/g, "'").toLowerCase().trim();
}

function selectSections(blocks, headings) {
  const selected = [];
  for (const heading of headings) {
    const index = blocks.findIndex((block) => block.type === "heading" && key(block.text) === key(heading));
    if (index < 0) throw new Error(`Missing source heading: ${heading}`);
    let end = index + 1;
    while (end < blocks.length && !(blocks[end].type === "heading" && blocks[end].level <= blocks[index].level)) end++;
    selected.push(...blocks.slice(index, end));
  }
  return selected.map((block) => block.type === "heading" ? { ...block, text: block.text.replace(/^\d+[.)]\s*/, "") } : block);
}

function citedReferences(markdown, selected) {
  const ids = new Set([...selected.flatMap((block) => block.items || block.text).join(" ").matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1])));
  if (!ids.size) return [];
  const bibliography = markdown.split(/^#{1,3}\s+(?:Scientific References|References(?: and Further Reading)?)\s*$/im)[1]?.split(/^#{1,3}\s+(?:Medical|Additional)/im)[0];
  if (!bibliography) return [];
  return bibliography.split(/\n(?=(?:\*\*)?(?:\[\d+\]|\d+\.)\s*)/).flatMap((chunk) => {
    const id = chunk.trim().match(/^(?:\*\*)?(?:\[(\d+)\]|(\d+)\.)/);
    return id && ids.has(Number(id[1] || id[2])) ? [{ type: "paragraph", text: chunk.trim().replace(/\n+/g, " ") }] : [];
  });
}

function imageFor(hair) {
  const src = hair ? "/radiance-media-processed/landscape/radiance-hair-fall-condition.webp" : "/radiance-media-processed/landscape/radiance-doctor-satyarth-consultation-01.webp";
  return { src, desktopUrl: src, uncroppedUrl: src, alt: hair ? "Hair and scalp concern assessment" : "Dr. Satyarth Prakash discussing clinical care with visitors at Radiance Clinics", altText: hair ? "Hair and scalp concern assessment" : "Doctor-led consultation at Radiance Clinics" };
}

function readTime(blocks) {
  return `${Math.max(4, Math.ceil(blocks.flatMap((block) => block.items || block.text).join(" ").split(/\s+/).length / 220))} min read`;
}

function addSupplement(slug, content, file, isDoctor) {
  supplements[slug] ||= { additionalContent: [], sourceFiles: [], contributorIds: [], updatedAt: releaseDate };
  supplements[slug].additionalContent.push(...content);
  supplements[slug].sourceFiles.push(file);
  if (isDoctor && !supplements[slug].contributorIds.includes("dr-satyarth-prakash")) supplements[slug].contributorIds.push("dr-satyarth-prakash");
}

await mkdir(path.join(root, archive), { recursive: true });
await mkdir(path.dirname(path.join(root, packArchive)), { recursive: true });

for (const config of doctorSources) {
  const sourceFile = `${archive}/${config.file}`;
  // Import originals unchanged; source media is never copied into public/.
  try { await copyFile(path.join(incoming, config.file), path.join(root, sourceFile)); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const markdown = await readFile(path.join(root, sourceFile), "utf8");
  const { title, blocks } = parseMarkdown(markdown);
  if (!title || !blocks.length) throw new Error(`Empty source: ${sourceFile}`);
  const mergeTarget = config.target === "skin-care-doctor-bhubaneswar" ? "skin-clinic-bhubaneswar" : config.target;
  const targetUrl = mergeTarget === "skin-clinic-bhubaneswar" ? "/skin-clinic-bhubaneswar" : `/knowledge/${config.slug || mergeTarget}`;
  provenance.push({ file: sourceFile, sha256: createHash("sha256").update(markdown).digest("hex"), author: "Dr. Satyarth Prakash", target: targetUrl, action: config.action });
  audit.push({ source_file: sourceFile, title, primary_query: config.query, existing_equivalent: config.equivalent || targetUrl, overlap_score: config.overlap, recommended_action: config.action, target_url: targetUrl, commercial_owner: config.owner });
  if (config.target) {
    const selected = selectSections(blocks, config.sections);
    const refs = citedReferences(markdown, selected);
    if (refs.length) selected.push({ type: "heading", level: 3, text: "References for this clinical contribution" }, ...refs);
    addSupplement(mergeTarget, selected, sourceFile, true);
    Object.assign(supplements[mergeTarget], { primaryCommercialOwner: config.owner, reviewEvidence: "Doctor-supplied clinical contribution; source authorship confirmed by the clinic representative." });
    continue;
  }
  const hair = /hair|scalp|bald/.test(config.slug);
  articles.push({ slug: config.slug, title, category: hair ? "Hair & Scalp Health" : "Skin Health", readTime: readTime(blocks), excerpt: config.excerpt, body: blocks.filter((block) => block.type === "paragraph").slice(0, 3).map((block) => block.text), content: blocks, image: imageFor(hair), seoTitle: `${title.split(":")[0]} | Radiance Clinics`, seoDescription: config.excerpt, authorName: "Dr. Satyarth Prakash", authorType: "doctor", authorId: "dr-satyarth-prakash", publishedAt: releaseDate, updatedAt: releaseDate, medicalReviewStatus: "PUBLISHED", sourceType: "original", sourceFiles: [sourceFile], primaryCommercialOwner: config.owner, relatedTreatments: [config.owner], relatedConditions: config.conditions, relatedArticles: hair ? ["hair-loss-causes-and-assessment"] : ["skin-care-doctor-bhubaneswar"], videoWatchSlugs: config.video ? [config.video] : [], relatedAnswers: hair ? ["hair-thinning-vs-hair-fall"] : [], resultConditions: [], topicCluster: hair ? "Hair Loss Before Surgery" : "Skin Health" });
}

try { await copyFile(path.join(incoming, packName), path.join(root, packArchive)); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const pack = await readFile(path.join(root, packArchive), "utf8");
const sections = pack.split(/(?=^# ARTICLE \d+ — )/m);
for (const config of expansionSources) {
  const section = sections.find((part) => part.startsWith(`# ARTICLE ${config.number} — `));
  if (!section) throw new Error(`Missing pack article ${config.number}`);
  const seoTitle = section.match(/## SEO title\s+([^\n]+)/)?.[1];
  const excerpt = section.match(/## Meta description\s+([^\n]+)/)?.[1];
  const articleBody = section.split("## H1\n")[1]?.split("### Related pages")[0].trim();
  if (!seoTitle || !excerpt || !articleBody) throw new Error(`Incomplete pack article ${config.number}`);
  const { title, blocks } = parseMarkdown(`# ${articleBody}`);
  const sourceFile = `${packArchive}#article-${config.number}`;
  const base = { slug: config.slug, title, category: "Hair Transplant Planning", readTime: readTime(blocks), excerpt, body: blocks.filter((block) => block.type === "paragraph").slice(0, 3).map((block) => block.text), content: blocks, image: imageFor(true), seoTitle, seoDescription: excerpt, authorName: "Radiance Editorial Team", authorType: "editorial-team", authorId: "radiance-editorial-team", reviewerId: "dr-satyarth-prakash", reviewedBy: "Dr. Satyarth Prakash", reviewEvidence, publishedAt: releaseDate, updatedAt: releaseDate, medicalReviewStatus: "MEDICALLY_REVIEWED", sourceType: "original", sourceFiles: [sourceFile], primaryCommercialOwner: config.owner, relatedTreatments: [config.owner], relatedConditions: [`/concerns/hair-transplant/${config.concern}`], relatedArticles: config.slug === "hair-transplant-consultation-checklist" ? ["hair-transplant-cost-factors", "when-hair-transplant-may-not-be-right"] : ["hair-transplant-consultation-checklist"], relatedAnswers: config.answers, videoWatchSlugs: [config.video], resultConditions: config.results, topicCluster: config.cluster, references: [{ label: "American Academy of Dermatology: Hair transplant patient information", href: "https://www.aad.org/public/diseases/hair-loss/treatment/transplant" }, { label: "NHS: Hair transplant suitability, procedures and risks", href: "https://www.nhs.uk/tests-and-treatments/cosmetic-procedures/cosmetic-surgery/hair-transplant/" }] };
  if (config.action === "MERGE_INTO_EXISTING_CONCERN") {
    supplements[config.canonicalPath] = { ...Object.fromEntries(Object.entries(base).filter(([name]) => !["slug", "title", "publishedAt", "content", "body"].includes(name))), additionalContent: blocks };
  } else if (config.action === "MERGE_INTO_EXISTING_CANONICAL") {
    supplements[config.slug] = { ...supplements[config.slug], replacementContent: blocks, ...Object.fromEntries(Object.entries(base).filter(([name]) => !["slug", "title", "publishedAt", "content", "body"].includes(name))), updatedAt: releaseDate };
  } else articles.push(base);
  audit.push({ source_file: sourceFile, title, primary_query: config.query, existing_equivalent: config.canonicalPath || (config.action.startsWith("MERGE") ? `/knowledge/${config.slug}` : `/concerns/hair-transplant/${config.concern}`), overlap_score: config.overlap, recommended_action: config.action, target_url: config.canonicalPath || `/knowledge/${config.slug}`, commercial_owner: config.owner });
  provenance.push({ file: sourceFile, sha256: createHash("sha256").update(section).digest("hex"), author: "Radiance Editorial Team", reviewer: "Dr. Satyarth Prakash", reviewedAt: null, reviewEvidence, target: config.canonicalPath || `/knowledge/${config.slug}`, action: config.action });
}

const doctorTitles = {
  "round-bald-patch-scalp-causes": "Round Bald Patch on the Scalp: Causes & Assessment | Radiance",
  "tiny-facial-bumps-blackheads": "Tiny Facial Bumps, Blackheads & Acne Marks | Radiance Clinics",
  "dark-circles-despite-sleep": "Dark Circles Despite Enough Sleep? | Dr. Satyarth Prakash",
  "receding-hairline-early-thinning": "Receding Hairline & Early Thinning: Causes | Radiance Clinics",
  "sunscreen-sticky-oily-sweaty-skin": "Sticky Sunscreen on Oily, Sweaty Skin | Radiance Clinics",
  "skincare-products-burning-itching-reactions": "Skincare Burning or Itching? Product Reactions | Radiance",
  "early-age-hair-fall-treatment-decisions": "Early-Age Hair Fall: Treatment Decisions & Costs | Radiance",
};
for (const article of articles.filter((item) => item.authorType === "doctor")) {
  article.seoTitle = doctorTitles[article.slug] || article.seoTitle;
  if (article.relatedArticles?.includes("skin-care-doctor-bhubaneswar")) article.relatedArticles = [article.slug === "skincare-products-burning-itching-reactions" ? "sunscreen-sticky-oily-sweaty-skin" : "skincare-products-burning-itching-reactions"];
  if (article.slug === "tiny-facial-bumps-blackheads") article.relatedConditions = ["/concerns/acne/closed-comedones"];
  if (article.slug === "dark-circles-despite-sleep") article.relatedConditions = ["/concerns/pigmentation/under-eye-dark-circles"];
}
const header = '// Generated by scripts/import-october-content.mjs from preserved Markdown sources.\nimport type { Article, CmsArticleContentBlock } from "@/types/cms";\n\n';
await writeFile(path.join(root, "src/data/october-articles.generated.ts"), `${header}export const octoberArticles: Article[] = ${JSON.stringify(articles, null, 2)};\n\nexport const octoberArticleSupplements: Record<string, Partial<Article> & { additionalContent?: CmsArticleContentBlock[]; replacementContent?: CmsArticleContentBlock[] }> = ${JSON.stringify(supplements, null, 2)};\n`);
await writeFile(path.join(root, "content/hair-query-expansion/publication-provenance.json"), `${JSON.stringify({ releaseDate, reviewEvidence, sources: provenance }, null, 2)}\n`);
await writeCsv(path.join(root, "seo/new-content-cannibalisation-check.csv"), ["source_file", "title", "primary_query", "existing_equivalent", "overlap_score", "recommended_action", "target_url", "commercial_owner"], audit);

const queries = await readCsv(path.join(root, "seo/gsc-raw/hair-2026-10-27/28d-vs-previous/Queries.csv"));
const opportunities = [
  ["Can I get a hair transplant while my hair is still falling?", "transplant.*(?:active hair loss|still losing|still falling|ongoing hair loss)|(?:fall|loss).*before.*transplant", "can-transplant-while-hair-still-falling", "hair-transplant-consultation-checklist"],
  ["Is three months too early to judge a hair transplant?", "3 month|three month", "when-transplanted-hair-start-growing", "hair-transplant-aftercare"],
  ["Why is one side of my hair transplant growing slower?", "transplant.*(?:one side|uneven|slower)|(?:one side|uneven).*(?:transplant|growing)", "when-transplanted-hair-start-growing", "hair-transplant-aftercare"],
  ["Can hair transplant be done between existing thinning hairs?", "diffuse|thinning hair transplant", "", "hair-transplant-diffuse-thinning"],
  ["Does donor hair grow back after FUE extraction?", "what happens to donor area", "", "fue-hair-transplant-scars"],
  ["Can I get a second hair transplant?", "second|repeat transplant|another transplant", "can-i-get-second-hair-transplant", "second-hair-transplant"],
  ["How do I know if my donor area has been overharvested?", "overharvest", "can-hair-transplant-work-weak-donor", "fue-hair-transplant-scars"],
  ["Can a hair transplant make the donor area look thin?", "what happens to donor area|low donor area", "can-fue-make-donor-area-thin", "fue-hair-transplant-scars"],
  ["Why does a crown transplant appear slower than the hairline?", "crown.*growth|crown.*slow", "when-transplanted-hair-start-growing", "crown-vs-hairline-graft-priority"],
  ["Can I transplant only the temples?", "hairline edges and temples", "", "natural-hairline-design-hair-transplant"],
  ["Can transplanted hair be cut and styled normally later?", "transplant.*\\b(?:cut|cutting|style|styled|styling)\\b", "", "hair-transplant-aftercare"],
  ["Can I wear my hair very short after FUE?", "fue.*short|fue.*scar", "", "fue-hair-transplant-scars"],
  ["Can a previous unnatural hairline be repaired?", "unnatural|repair", "", "second-hair-transplant"],
  ["Can hair transplant fix diffuse frontal thinning?", "diffuse.*frontal", "", "hair-transplant-diffuse-thinning"],
  ["What happens if natural hair keeps thinning behind the transplant?", "transplant.*years|native hair", "can-transplanted-hair-fall-out-years-later", "why-hair-transplant-results-vary"],
  ["Is a very low hairline a bad idea?", "low hairline", "how-many-grafts-receding-hairline", "natural-hairline-design-hair-transplant"],
  ["Can hair transplant cover advanced baldness completely?", "advanced bald|severe bald", "can-hair-transplant-work-weak-donor", "hair-transplant-advanced-baldness"],
  ["Why do two people with the same graft count get different results?", "same.*graft|graft.*density|transplant.*density", "why-same-graft-count-different-results", "hair-transplant-density-graft-planning"],
  ["Can I do a hair transplant if I have dandruff?", "dandruff.*transplant", "can-dandruff-cause-hair-loss", "when-hair-transplant-may-not-be-right"],
  ["Should I treat hair loss before planning a transplant?", "(?:loss|fall).*before.*transplant|transplant.*active.*loss", "can-transplant-while-hair-still-falling", "when-hair-transplant-may-not-be-right"],
].map(([question, pattern, answer, guide]) => {
  const matching = queries.filter((row) => new RegExp(pattern, "i").test(row["Top queries"]));
  const impressions = matching.reduce((sum, row) => sum + Number(row["Last 28 days Impressions"]), 0);
  return { question, matching_queries: matching.length ? matching.map((row) => row["Top queries"]).join("; ") : "NOT_OBSERVED_IN_EXPORTED_ROWS", impressions: matching.length ? impressions : "NOT_OBSERVED", clicks: matching.length ? matching.reduce((sum, row) => sum + Number(row["Last 28 days Clicks"]), 0) : "NOT_OBSERVED", position: impressions ? (matching.reduce((sum, row) => sum + Number(row["Last 28 days Position"]) * Number(row["Last 28 days Impressions"]), 0) / impressions).toFixed(2) : "NOT_AVAILABLE", existing_answer: answer ? `/doctor-answers/${answer}` : "NO_EXACT_ANSWER; use guide until distinct demand is established", commercial_owner: guide === "hair-transplant-diffuse-thinning" ? "/hair-loss-clinic-bhubaneswar" : transplant, priority: impressions > 10 ? "P1" : "P2", matching_basis: "Related-intent regex; not an exact-question demand claim", report_window: "2026-09-28 to 2026-10-25", source: "Authenticated GSC URL-prefix export obtained 2026-10-27; missing rows are not zero demand" };
});
await writeCsv(path.join(root, "seo/hair-question-opportunities.csv"), ["question", "matching_queries", "impressions", "clicks", "position", "existing_answer", "commercial_owner", "priority", "matching_basis", "report_window", "source"], opportunities);
console.log(`Preserved ${doctorSources.length} doctor sources; prepared ${articles.length} unique articles and ${Object.keys(supplements).length} consolidation targets (including the new consultation guide). Ten editorial drafts approved by doctor; exact review date intentionally omitted.`);
