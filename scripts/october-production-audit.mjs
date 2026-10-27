import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";
import ts from "typescript";
import { readCsv, writeCsv } from "./seo-utils.mjs";

const base = (process.env.CONTENT_AUDIT_BASE_URL || "http://localhost:4324").replace(/\/$/, "");
const canonicalOrigin = "https://www.radianceclinics.com";
const source = await readFile("src/data/october-articles.generated.ts", "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { octoberArticles } = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
const decisions = await readCsv("seo/new-content-cannibalisation-check.csv");
const routes = [...new Set(decisions.map((row) => row.target_url)), ...["can-fue-make-donor-area-thin", "why-same-graft-count-different-results", "can-transplant-while-hair-still-falling", "can-i-get-second-hair-transplant"].map((slug) => `/doctor-answers/${slug}`)];

async function request(path) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await fetch(`${base}${path}`, { redirect: "manual" }); }
    catch (error) { if (attempt === 2) throw error; }
  }
}

const sitemap = await (await request("/sitemap.xml")).text();
const discovery = await Promise.all(["/knowledge", "/about", "/treatments/hair-restoration", "/doctor-answers", "/hair-transplant-bhubaneswar"].map(async (route) => load(await (await request(route)).text())));
const failures = [];
const observations = [];
const checkedLinks = new Map();
for (const route of routes) {
  const response = await request(route);
  const $ = load(await response.text());
  const issues = [];
  const canonical = $('link[rel="canonical"]').attr("href");
  if (response.status !== 200) issues.push(`HTTP ${response.status}`);
  if (canonical !== `${canonicalOrigin}${route}`) issues.push(`canonical ${canonical}`);
  if (/noindex/i.test($('meta[name="robots"]').attr("content") || "")) issues.push("noindex");
  if ($("h1").length !== 1) issues.push("not exactly one H1");
  if (!sitemap.includes(`${canonicalOrigin}${route}</loc>`)) issues.push("not in sitemap");
  if (!discovery.some(($page) => $page(`a[href="${route}"]`).length)) issues.push("no audited discovery link");
  const schemas = $("script[type='application/ld+json']").toArray().map((element) => {
    try { return JSON.parse($(element).text()); } catch { issues.push("invalid JSON-LD"); return {}; }
  });
  const article = octoberArticles.find((item) => `/knowledge/${item.slug}` === route);
  if (article) {
    const articleSchema = schemas.find((item) => item["@type"] === "Article");
    if (!articleSchema?.headline || !articleSchema.datePublished || !articleSchema.dateModified) issues.push("Article metadata incomplete");
    if (articleSchema?.reviewedBy) issues.push("reviewedBy must be on the WebPage, not Article");
    if (article.authorType === "doctor" && articleSchema?.author?.["@id"] !== `${canonicalOrigin}/about#person`) issues.push("doctor author entity missing");
    if (article.authorType !== "doctor" && !schemas.some((item) => item.reviewedBy?.["@id"] === `${canonicalOrigin}/about#person`)) issues.push("WebPage reviewer entity missing");
    if (!$("main").text().includes(article.authorType === "doctor" ? "Written by Dr. Satyarth Prakash" : "Medically reviewed by Dr. Satyarth Prakash")) issues.push("visible attribution missing");
    if (!$(`a[href="${article.primaryCommercialOwner}"]`).length) issues.push("commercial owner link missing");
    if (article.category.includes("Hair") && !$("main").text().includes("Book Hair & Scalp Assessment")) issues.push("Hair CTA missing");
    for (const link of $("main a[href^='/']").toArray()) {
      const href = $(link).attr("href").split(/[?#]/)[0];
      if (!checkedLinks.has(href)) checkedLinks.set(href, (await request(href)).status);
      if (checkedLinks.get(href) >= 400) issues.push(`broken link ${href}`);
    }
  }
  observations.push({ route, status: response.status, canonical, sitemap: "yes", discovery_link: issues.includes("no audited discovery link") ? "no" : "yes", structured_data: issues.some((issue) => /JSON-LD|entity|Article/.test(issue)) ? "fail" : "pass", checked_at: new Date().toISOString(), source: base, result: issues.length ? issues.join("; ") : "PASS", gsc_index_status: "NOT_INSPECTED_IN_THIS_HTTP_AUDIT" });
  if (issues.length) failures.push(`${route}: ${issues.join("; ")}`);
}
await writeCsv("seo/october-content-release-checks.csv", Object.keys(observations[0]), observations);
await writeFile("seo/october-content-release-summary.json", `${JSON.stringify({ base, routes: routes.length, uniqueArticles: octoberArticles.length, checkedInternalLinks: checkedLinks.size, failures }, null, 2)}\n`);
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`October content audit passed: ${routes.length} article/answer routes, ${checkedLinks.size} internal links, canonicals, author/reviewer entities, Article JSON-LD, sitemap and discovery.`);
