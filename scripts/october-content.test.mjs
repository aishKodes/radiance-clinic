import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";
import { parseMarkdown } from "./import-doctor-articles.mjs";
import { doctorSources, expansionSources } from "./october-content-config.mjs";
import { readCsv } from "./seo-utils.mjs";

async function loadTs(file) {
  const source = await readFile(file, "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

const { octoberArticles, octoberArticleSupplements } = await loadTs("src/data/october-articles.generated.ts");
const { articleInlineTokens } = await loadTs("src/lib/article-inline.ts");

test("all 18 doctor originals have preserved source hashes and an explicit publication decision", async () => {
  const provenance = JSON.parse(await readFile("content/hair-query-expansion/publication-provenance.json", "utf8"));
  const sources = provenance.sources.filter((source) => source.author === "Dr. Satyarth Prakash");
  assert.equal(sources.length, 18);
  for (const source of sources) {
    assert.equal(createHash("sha256").update(await readFile(source.file)).digest("hex"), source.sha256);
    assert.ok(source.target.startsWith("/knowledge/") || source.target === "/skin-clinic-bhubaneswar");
  }
  assert.equal((await readCsv("seo/new-content-cannibalisation-check.csv")).length, 28);
});

test("unique authorship and overlap decisions match the approved sources", () => {
  assert.equal(octoberArticles.length, 15);
  assert.equal(octoberArticles.filter((article) => article.authorType === "doctor").length, 7);
  assert.equal(new Set(octoberArticles.map((article) => article.slug)).size, 15);
  assert.ok(!octoberArticles.some((article) => article.slug === "crown-vs-hairline-hair-transplant"));
  assert.ok(octoberArticleSupplements["crown-vs-hairline-graft-priority"].replacementContent.length);
  for (const article of octoberArticles) {
    assert.ok(article.primaryCommercialOwner?.startsWith("/"));
    assert.equal(article.publishedAt, "2026-10-27");
    assert.equal(article.reviewedAt, undefined);
    if (article.authorType === "doctor") assert.equal(article.authorId, "dr-satyarth-prakash");
    else {
      assert.equal(article.authorId, "radiance-editorial-team");
      assert.equal(article.reviewerId, "dr-satyarth-prakash");
      assert.ok(article.reviewEvidence);
    }
  }
});

test("approved expansion prose is imported without rewriting", async () => {
  const pack = await readFile("content/hair-query-expansion/Radiance_Hair_Transplant_Query_Expansion_Pack_Oct2026.md", "utf8");
  for (const config of expansionSources) {
    const section = pack.split(/(?=^# ARTICLE \d+ — )/m).find((part) => part.startsWith(`# ARTICLE ${config.number} — `));
    const body = section.split("## H1\n")[1].split("### Related pages")[0].trim();
    const imported = config.canonicalPath ? octoberArticleSupplements[config.canonicalPath].additionalContent : config.action.startsWith("MERGE") ? octoberArticleSupplements[config.slug].replacementContent : octoberArticles.find((article) => article.slug === config.slug).content;
    assert.deepEqual(imported, parseMarkdown(`# ${body}`).blocks);
  }
  for (const config of doctorSources.filter((item) => item.slug)) {
    const source = await readFile(`content/doctor-articles/2026-10-27/${config.file}`, "utf8");
    assert.deepEqual(octoberArticles.find((article) => article.slug === config.slug).content, parseMarkdown(source).blocks);
  }
});

test("inline references are links, unsafe schemes are not executable", () => {
  assert.deepEqual(articleInlineTokens("Read [AAD](https://www.aad.org/public) and **plan**."), [
    { type: "text", text: "Read " }, { type: "link", text: "AAD", href: "https://www.aad.org/public" }, { type: "text", text: " and " }, { type: "strong", text: "plan" }, { type: "text", text: "." },
  ]);
  assert.ok(!articleInlineTokens("[unsafe](javascript:alert)").some((token) => token.type === "link"));
  assert.ok(!articleInlineTokens("[external](//untrusted.example)").some((token) => token.type === "link"));
  assert.equal(articleInlineTokens("[Hair assessment](/hair-loss-clinic-bhubaneswar)")[0].href, "/hair-loss-clinic-bhubaneswar");
});

test("question opportunities never represent missing exported rows as zero demand", async () => {
  const rows = await readCsv("seo/hair-question-opportunities.csv");
  assert.equal(rows.length, 20);
  for (const row of rows.filter((item) => item.matching_queries === "NOT_OBSERVED_IN_EXPORTED_ROWS")) {
    assert.equal(row.impressions, "NOT_OBSERVED");
    assert.equal(row.clicks, "NOT_OBSERVED");
  }
  assert.ok(!rows.find((row) => row.question.includes("cut and styled")).matching_queries.includes("cuttack"));
  assert.ok(!rows.find((row) => row.question.includes("growing slower")).matching_queries.includes("receding"));
  assert.ok(!rows.find((row) => row.question.includes("still falling")).matching_queries.includes("shedding after"));
});

test("new article evidence excludes replacement, unpublished and unverified image sources", async () => {
  const { originalComparisonSourceIds } = await loadTs("src/lib/result-evidence.ts");
  const manifest = JSON.parse(await readFile("public/radiance-media-processed/manifest.json", "utf8"));
  const originals = originalComparisonSourceIds(manifest.items);
  assert.ok(originals.size > 0);
  for (const source of manifest.items.filter((item) => item.replacementAfter)) {
    assert.ok(!originals.has(source.id));
  }
  assert.deepEqual([...originalComparisonSourceIds([
    { id: "original", category: "before-after", replacementAfter: false },
    { id: "unknown", category: "before-after" },
    { id: "unpublished", category: "before-after", replacementAfter: false, publish: false },
  ])], ["original"]);
});

test("first Hair CTA is queued before analytics loads and keeps landing attribution", async () => {
  const { initializeAnalyticsQueue, trackConversionEvent, rememberLeadAttribution } = await loadTs("src/lib/analytics.ts");
  const storage = new Map();
  const oldWindow = globalThis.window;
  const oldDocument = globalThis.document;
  globalThis.window = { location: { pathname: "/knowledge/second-hair-transplant", search: "?utm_source=google" }, sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) } };
  globalThis.document = { referrer: "https://www.google.com/" };
  try {
    rememberLeadAttribution();
    initializeAnalyticsQueue("G-TEST");
    initializeAnalyticsQueue("G-TEST");
    window.location.pathname = "/hair-transplant-bhubaneswar";
    trackConversionEvent("hair_call_click", { path: window.location.pathname, page_type: "local_service", topic: "hair transplant" });
    assert.equal(window.dataLayer.length, 3);
    assert.equal(Array.from(window.dataLayer[1])[0], "config");
    const event = Array.from(window.dataLayer[2]);
    assert.equal(event[1], "hair_call_click");
    assert.equal(event[2].landing_path, "/knowledge/second-hair-transplant");
    assert.equal(event[2].referral_source, "google");
  } finally {
    globalThis.window = oldWindow;
    globalThis.document = oldDocument;
  }
});
