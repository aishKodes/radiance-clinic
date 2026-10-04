import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import { writeCsv } from "./seo-utils.mjs";

const root = process.cwd();
const baseUrl = (process.env.IMAGE_ALT_AUDIT_BASE_URL || "https://www.radianceclinics.com").replace(/\/$/, "");
const reportOrigin = "https://www.radianceclinics.com";

function reportUrl(value) {
  const url = new URL(value);
  return url.origin === new URL(baseUrl).origin
    ? `${reportOrigin}${url.pathname}${url.search}`
    : url.href;
}

function imageUrl(value, pageUrl) {
  if (!value || value.startsWith("data:")) return "";
  const resolved = new URL(value, pageUrl);
  if (resolved.pathname === "/_next/image") {
    const source = resolved.searchParams.get("url");
    if (source) return reportUrl(new URL(source, pageUrl).href);
  }
  return reportUrl(resolved.href);
}

function purposeFor(url, alt) {
  const value = `${url} ${alt}`.toLowerCase();
  if (/logo|favicon|brand/.test(value)) return "Clinic branding";
  if (/before|after|result|transformation/.test(value)) return "Treatment result example";
  if (/doctor|satyarth|consultation/.test(value)) return "Doctor or consultation";
  if (/award|certificate|recognition|badge|media|press/.test(value)) return "Recognition or media coverage";
  if (/clinic|interior|reception|treatment-room/.test(value)) return "Clinic environment";
  if (/youtube|thumbnail|video/.test(value)) return "Educational video preview";
  return "Page content image";
}

function recommendedAlt(currentAlt, purpose, decorative) {
  if (decorative) return "";
  if (currentAlt.trim()) return currentAlt.trim();
  return `REVIEW REQUIRED: add a concise ${purpose.toLowerCase()} description`;
}

async function sitemapRoutes() {
  const response = await fetch(`${baseUrl}/sitemap.xml`);
  if (!response.ok) throw new Error(`Unable to read sitemap.xml: HTTP ${response.status}`);
  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  return $("loc")
    .map((_, element) => $(element).text().trim())
    .get()
    .filter(Boolean)
    .map((url) => new URL(url).pathname);
}

async function fallbackRoutes() {
  const manifest = JSON.parse(await readFile(path.join(root, "seo/route-manifest.json"), "utf8"));
  return manifest.indexableRoutes.filter((route) => route.eligible).map((route) => route.path);
}

async function inspectPage(route) {
  const pageUrl = new URL(route, `${baseUrl}/`).href;
  const response = await fetch(pageUrl, { redirect: "follow" });
  if (!response.ok) throw new Error(`${pageUrl} returned HTTP ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const rows = [];

  $("img").each((_, element) => {
    const rawAlt = $(element).attr("alt");
    const currentAlt = rawAlt ?? "MISSING ALT ATTRIBUTE";
    const decorative = rawAlt === "";
    const url = imageUrl($(element).attr("src") || $(element).attr("data-src") || "", pageUrl);
    if (!url) return;
    const purpose = purposeFor(url, currentAlt);
    rows.push({
      url,
      page: reportUrl(pageUrl),
      purpose,
      current_alt: currentAlt,
      recommended_alt: recommendedAlt(rawAlt || "", purpose, decorative),
      decorative: decorative ? "yes" : "no",
    });
  });

  return rows;
}

async function main() {
  let routes;
  try {
    routes = await sitemapRoutes();
  } catch (error) {
    console.warn(`${error.message}; using the route manifest instead.`);
    routes = await fallbackRoutes();
  }

  const uniqueRoutes = [...new Set(routes)];
  const rows = [];
  const errors = [];
  for (let index = 0; index < uniqueRoutes.length; index += 5) {
    const batch = uniqueRoutes.slice(index, index + 5);
    const results = await Promise.allSettled(batch.map(inspectPage));
    results.forEach((result, resultIndex) => {
      if (result.status === "fulfilled") rows.push(...result.value);
      else errors.push(`${batch[resultIndex]}: ${result.reason?.message || result.reason}`);
    });
  }

  const deduped = [...new Map(rows.map((row) => [`${row.page}|${row.url}`, row])).values()]
    .sort((a, b) => a.page.localeCompare(b.page) || a.url.localeCompare(b.url));
  await writeCsv(
    path.join(root, "seo/image-alt-audit.csv"),
    ["url", "page", "purpose", "current_alt", "recommended_alt", "decorative"],
    deduped,
  );

  const reviewRequired = deduped.filter((row) => row.recommended_alt.startsWith("REVIEW REQUIRED")).length;
  console.log(`Image alt audit wrote ${deduped.length} page-image relationships across ${uniqueRoutes.length} routes.`);
  console.log(`Review required: ${reviewRequired}. Route errors: ${errors.length}.`);
  for (const error of errors) console.warn(`- ${error}`);
  if (errors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
