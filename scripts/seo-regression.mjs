import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const origin = "https://www.radianceclinics.com";
const baselineFile = new URL(
  "../seo/protected-route-baseline.json",
  import.meta.url,
);
const protectedPagesFile = new URL(
  "../seo/protected-pages.json",
  import.meta.url,
);
const protectedPaths = [
  "/",
  "/about",
  "/media",
  "/editorial-policy",
  "/skin-clinic-bhubaneswar",
  "/hair-loss-clinic-bhubaneswar",
  "/hair-transplant-bhubaneswar",
  "/non-surgical-hair-replacement-bhubaneswar",
  "/laser-hair-removal-bhubaneswar",
  "/acne-scar-treatment-bhubaneswar",
  "/botox-treatment-bhubaneswar",
  "/dermal-fillers-bhubaneswar",
  "/tattoo-removal-bhubaneswar",
  "/knowledge/adult-acne-hormones-pcos-insulin-resistance-bhubaneswar",
  "/knowledge/bhubaneswar-water-hair-fall-hard-water",
  "/knowledge/exosome-skin-treatment-bhubaneswar",
  "/knowledge/why-tanning-despite-sunscreen-bhubaneswar",
  "/knowledge/acne-scar-treatment-bhubaneswar",
  ...["rourkela", "cuttack", "puri", "berhampur", "sambalpur", "baripada"].map(
    (city) => `/hair-transplant-${city}`,
  ),
];

export function validatePage(expected, actual) {
  const errors = [];
  if (actual.status !== 200) errors.push(`HTTP ${actual.status}`);
  if (/noindex|none/i.test(actual.robots)) errors.push("unexpected noindex");
  if (
    actual.canonical !==
    `${origin}${expected.path === "/" ? "" : expected.path}`
  )
    errors.push("canonical changed");
  if (!actual.inSitemap) errors.push("removed from sitemap");
  if (actual.h1Count !== 1)
    errors.push(`expected one H1, found ${actual.h1Count}`);
  if (actual.title !== expected.title)
    errors.push("title changed without baseline approval");
  if (actual.h1 !== expected.h1)
    errors.push("H1 changed without baseline approval");
  if (!actual.inboundLink)
    errors.push("no crawlable link from audited discovery pages");
  if (!actual.schemaValid) errors.push("invalid or missing structured data");
  return errors;
}

async function main() {
  const capture = process.argv.includes("--capture");
  if (capture && existsSync(baselineFile))
    throw new Error(
      "Baseline already exists; review and explicitly approve individual changes instead of overwriting it.",
    );
  let server;
  const base = process.env.SEO_REGRESSION_BASE_URL || "http://localhost:4321";
  try {
    if (!process.env.SEO_REGRESSION_BASE_URL) {
      server = spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", "start", "-p", "4321"],
        { stdio: "ignore" },
      );
      let ready = false;
      for (let attempt = 0; attempt < 60; attempt++) {
        try {
          if ((await fetch(`${base}/robots.txt`)).ok) {
            ready = true;
            break;
          }
        } catch {}
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (!ready)
        throw new Error(
          "Regression server did not start; build the project first.",
        );
    }
    const [sitemapResponse, videoSitemapResponse] = await Promise.all([
      fetch(`${base}/sitemap.xml`),
      fetch(`${base}/video-sitemap.xml`),
    ]);
    if (!sitemapResponse.ok)
      throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
    if (!videoSitemapResponse.ok)
      throw new Error(`Video sitemap HTTP ${videoSitemapResponse.status}`);
    const sitemap = await sitemapResponse.text();
    const videoSitemap = await videoSitemapResponse.text();
    const discovery = [
      "/",
      "/about",
      "/locations",
      "/treatments",
      "/treatments/hair-restoration",
      "/treatments/skin",
      "/treatments/laser",
      "/treatments/aesthetic-dermatology",
      "/knowledge",
      "/doctor-answers",
      "/videos",
    ];
    const links = new Set(["/"]);
    for (const path of discovery) {
      const response = await fetch(`${base}${path}`);
      const $ = load(await response.text());
      $("a[href]").each((_, element) => {
        const url = new URL($(element).attr("href"), base);
        if ([new URL(base).host, new URL(origin).host].includes(url.host))
          links.add(url.pathname.replace(/\/$/, "") || "/");
      });
    }
    const baseline = capture
      ? { pages: protectedPaths.map((path) => ({ path })) }
      : JSON.parse(await readFile(baselineFile, "utf8"));
    const protectedPageConfig = JSON.parse(
      await readFile(protectedPagesFile, "utf8"),
    );
    const failures = [];
    const baselinePathSet = new Set(baseline.pages.map((page) => page.path));
    for (const protectedPage of protectedPageConfig.pages) {
      if (!baselinePathSet.has(protectedPage.path)) {
        failures.push(`${protectedPage.path}: missing from protected route baseline`);
      }
    }
    for (const expected of baseline.pages) {
      const response = await fetch(`${base}${expected.path}`, {
        redirect: "manual",
      });
      const $ = load(await response.text());
      const scripts = $("script[type='application/ld+json']").toArray();
      let schemaValid = scripts.length > 0;
      for (const element of scripts) {
        try {
          JSON.parse($(element).text());
        } catch {
          schemaValid = false;
        }
      }
      const actual = {
        status: response.status,
        robots: `${$("meta[name=robots]").attr("content") || ""} ${response.headers.get("x-robots-tag") || ""}`,
        canonical: $("link[rel=canonical]").attr("href"),
        title: $("title").text(),
        h1: $("h1").first().text().trim(),
        h1Count: $("h1").length,
        inSitemap:
          sitemap.includes(
            `<loc>${origin}${expected.path === "/" ? "" : expected.path}</loc>`,
          ) ||
          (expected.path === "/" && sitemap.includes(`<loc>${origin}/</loc>`)) ||
          videoSitemap.includes(
            `<loc>${origin}${expected.path === "/" ? "" : expected.path}</loc>`,
          ),
        inboundLink: links.has(expected.path),
        schemaValid,
      };
      if (capture) {
        expected.title = actual.title;
        expected.h1 = actual.h1;
      }
      for (const error of validatePage(expected, actual))
        failures.push(`${expected.path}: ${error}`);
      if (
        expected.path === "/" &&
        $("meta[name=google-site-verification]").attr("content") !==
          "ij_K80AdENETIUwU-aGsVvf0nUue052w6HNz_nzxcn0"
      )
        failures.push("GSC ownership verification token missing");
    }
    const redirects = JSON.parse(
      await readFile(
        new URL("../src/data/legacy-redirects.json", import.meta.url),
        "utf8",
      ),
    );
    for (const { source, destination } of redirects.filter((row) =>
      /^\/hair-(patch|wig)(\/|$)|^\/hair-transplant-in-(rourkela|cuttack|puri|berhampur|sambalpur|baripada)/.test(
        row.source,
      ),
    )) {
      const response = await fetch(`${base}${source}`, { redirect: "manual" });
      const location = response.headers.get("location");
      if (
        ![301, 308].includes(response.status) ||
        !location ||
        new URL(location, base).pathname !== destination
      )
        failures.push(`${source}: permanent redirect changed`);
      else if (
        (await fetch(new URL(location, base), { redirect: "manual" }))
          .status !== 200
      )
        failures.push(`${source}: redirect chain or broken destination`);
      if (sitemap.includes(`<loc>${origin}${source}</loc>`))
        failures.push(`${source}: legacy redirect source in sitemap`);
    }
    if (failures.length) throw new Error(failures.join("\n"));
    if (capture)
      await writeFile(
        baselineFile,
        `${JSON.stringify({ capturedAt: new Date().toISOString(), source: base, ...baseline }, null, 2)}\n`,
      );
    console.log(
      `SEO regression passed: ${baseline.pages.length} protected routes, verification token, sitemap, discovery links and legacy recovery redirects.`,
    );
  } finally {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = new Promise((resolve) => server.once("exit", resolve));
      server.kill("SIGTERM");
      await exited;
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
