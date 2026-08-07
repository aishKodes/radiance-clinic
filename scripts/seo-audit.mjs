import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { request as httpRequest } from "node:http";
import { load } from "cheerio";

const root = process.cwd();
const port = Number(process.env.SEO_AUDIT_PORT || 4317);
const externalBase = process.env.SEO_AUDIT_BASE_URL?.replace(/\/$/, "");
const localBase = externalBase || `http://127.0.0.1:${port}`;
const canonicalOrigin = "https://www.radianceclinics.com";
const redirectsOnly = process.argv.includes("--redirects-only");
const errors = [];
const warnings = [];

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const [headers, ...data] = rows;
  return data.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])),
  );
}

function reportError(message) {
  errors.push(message);
}

function expectedCanonical(pathname) {
  return `${canonicalOrigin}${pathname === "/" ? "/" : pathname}`;
}

function equivalentUrl(left, right) {
  try {
    const normalize = (value) => {
      const url = new URL(value);
      const pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
      return `${url.origin}${pathname}${url.search}`;
    };
    return normalize(left) === normalize(right);
  } catch {
    return false;
  }
}

function requestWithHost(pathname, host) {
  return new Promise((resolve, reject) => {
    const request = httpRequest(
      `${localBase}${pathname}`,
      { method: "GET", headers: { host } },
      (response) => {
        response.resume();
        response.on("end", () =>
          resolve({ status: response.statusCode, location: response.headers.location }),
        );
      },
    );
    request.on("error", reject);
    request.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const response = await fetch(`${localBase}/robots.txt`, {
        redirect: "manual",
      });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next.js server did not become ready at ${localBase}`);
}

function startServer() {
  if (externalBase) return null;
  return spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      cwd: root,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

function parseRedirectCsv(csv) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [legacyUrl, destinationUrl, status] = line.split(",");
      return { legacyUrl, destinationUrl, status };
    })
    .filter((row) => row.status === "active-permanent");
}

async function auditRedirects(redirects) {
  for (const redirect of redirects) {
    const sourcePath = redirect.legacyUrl || "/";
    const source = await fetch(`${localBase}${sourcePath}?seo_audit=1`, {
      redirect: "manual",
    });
    if (![301, 308].includes(source.status)) {
      reportError(`${redirect.legacyUrl}: expected one permanent redirect, received ${source.status}`);
      continue;
    }

    const location = source.headers.get("location");
    if (!location) {
      reportError(`${redirect.legacyUrl}: redirect is missing a Location header`);
      continue;
    }

    const resolved = new URL(location, canonicalOrigin);
    const expected = new URL(redirect.destinationUrl);
    if (resolved.pathname !== expected.pathname) {
      reportError(
        `${redirect.legacyUrl}: expected ${expected.pathname}, received ${resolved.pathname}`,
      );
    }
    if (resolved.searchParams.get("seo_audit") !== "1") {
      reportError(`${redirect.legacyUrl}: query parameters were not preserved`);
    }

    const destination = await fetch(`${localBase}${expected.pathname}`, {
      redirect: "manual",
    });
    if (destination.status !== 200) {
      reportError(
        `${redirect.legacyUrl}: destination ${expected.pathname} returned ${destination.status}`,
      );
    }
  }

  if (!externalBase) {
    const hostResponse = await requestWithHost(
      "/contact?seo_audit=1",
      "radianceclinics.com",
    );
    const location = hostResponse.location;
    if (
      ![301, 308].includes(hostResponse.status) ||
      location !== `${canonicalOrigin}/contact?seo_audit=1`
    ) {
      reportError(
        `non-www host consolidation failed: ${hostResponse.status} ${location || "no location"}`,
      );
    }
  }
}

async function auditRoutes(manifest) {
  const titleToPaths = new Map();
  const descriptionToPaths = new Map();
  const internalPaths = new Set();
  const manifestPaths = new Set(manifest.indexableRoutes.map((route) => route.path));
  const inboundLinks = new Map(
    manifest.indexableRoutes.map((route) => [route.path, new Set()]),
  );
  const imagePaths = new Set();

  for (const route of manifest.indexableRoutes) {
    if (route.eligible !== true) {
      reportError(`${route.path}: indexable manifest entry has not passed eligibility`);
    }
    if (route.parent && !manifestPaths.has(route.parent)) {
      reportError(`${route.path}: parent route ${route.parent} is not indexable`);
    }
    const response = await fetch(`${localBase}${route.path}`, {
      redirect: "manual",
    });
    if (response.status !== 200) {
      reportError(`${route.path}: expected 200, received ${response.status}`);
      continue;
    }

    const html = await response.text();
    const $ = load(html);
    const title = $("title").first().text().trim();
    const description = $('meta[name="description"]').attr("content")?.trim();
    const canonical = $('link[rel="canonical"]').attr("href");
    const ogUrl = $('meta[property="og:url"]').attr("content");
    const robots = $('meta[name="robots"]').attr("content") || "";
    const h1Count = $("h1").length;
    const h2Count = $("h2").length;

    if (!title) reportError(`${route.path}: missing title`);
    if (!description) reportError(`${route.path}: missing meta description`);
    if (!equivalentUrl(canonical, expectedCanonical(route.path))) {
      reportError(`${route.path}: canonical is ${canonical || "missing"}`);
    }
    if (!equivalentUrl(ogUrl, canonical)) {
      reportError(`${route.path}: og:url does not match canonical`);
    }
    if (/noindex/i.test(robots)) {
      reportError(`${route.path}: intended indexable route contains noindex`);
    }
    if (h1Count !== 1) {
      reportError(`${route.path}: expected one H1, found ${h1Count}`);
    }
    if (["treatment-hub", "treatment", "condition", "article", "local-service", "results-index", "location-index"].includes(route.type) && h2Count < 1) {
      reportError(`${route.path}: structured content is missing an H2 section`);
    }
    if (route.breadcrumb && $('nav[aria-label="Breadcrumb"]').length !== 1) {
      reportError(`${route.path}: visible breadcrumb is missing`);
    }

    if (title) titleToPaths.set(title, [...(titleToPaths.get(title) || []), route.path]);
    if (description) {
      descriptionToPaths.set(description, [
        ...(descriptionToPaths.get(description) || []),
        route.path,
      ]);
    }

    let hasBreadcrumbSchema = false;
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const parsed = JSON.parse($(element).text());
        if (parsed?.["@type"] === "BreadcrumbList") hasBreadcrumbSchema = true;
      } catch (error) {
        reportError(`${route.path}: invalid JSON-LD (${error.message})`);
      }
    });
    if (route.breadcrumb && !hasBreadcrumbSchema) {
      reportError(`${route.path}: BreadcrumbList JSON-LD is missing`);
    }

    $("img").each((_, image) => {
      if ($(image).attr("alt") === undefined) {
        reportError(`${route.path}: image is missing an alt attribute`);
      }
      const src = $(image).attr("src")?.trim();
      if (!src || src.startsWith("data:")) return;
      try {
        const url = new URL(src, canonicalOrigin);
        if (url.origin === canonicalOrigin) imagePaths.add(`${url.pathname}${url.search}`);
      } catch {
        reportError(`${route.path}: malformed image src ${src}`);
      }
    });

    $("a").each((_, anchor) => {
      const href = $(anchor).attr("href")?.trim();
      if (!href || href === "#" || /^javascript:/i.test(href)) {
        reportError(`${route.path}: empty or invalid anchor href`);
        return;
      }
      if (/^(mailto:|tel:|https:\/\/wa\.me\/|#)/i.test(href)) return;
      try {
        const url = new URL(href, canonicalOrigin);
        if (url.origin === canonicalOrigin) {
          const normalizedPath = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
          internalPaths.add(normalizedPath);
          if (manifestPaths.has(normalizedPath) && normalizedPath !== route.path) {
            inboundLinks.get(normalizedPath)?.add(route.path);
          }
        }
      } catch {
        reportError(`${route.path}: malformed href ${href}`);
      }
    });
  }

  for (const [title, paths] of titleToPaths) {
    if (paths.length > 1) reportError(`duplicate title "${title}": ${paths.join(", ")}`);
  }
  for (const [description, paths] of descriptionToPaths) {
    if (paths.length > 1) {
      reportError(`duplicate description "${description}": ${paths.join(", ")}`);
    }
  }

  for (const route of manifest.indexableRoutes) {
    if (route.path !== "/" && !(inboundLinks.get(route.path)?.size)) {
      reportError(`${route.path}: orphan page with zero internal inbound links`);
    }
  }

  for (const pathname of internalPaths) {
    if (/^\/(api|studio)(\/|$)/.test(pathname)) continue;
    const response = await fetch(`${localBase}${pathname}`, { redirect: "manual" });
    if (response.status === 404) reportError(`internal link returns 404: ${pathname}`);
    if ([301, 302, 307, 308].includes(response.status)) {
      warnings.push(`internal link redirects: ${pathname}`);
    }
  }


  const imageQueue = [...imagePaths];
  const workers = Array.from({ length: Math.min(6, imageQueue.length) }, async () => {
    while (imageQueue.length) {
      const imagePath = imageQueue.shift();
      const response = await fetch(`${localBase}${imagePath}`, { redirect: "follow" });
      if (!response.ok) reportError(`broken image ${imagePath}: returned ${response.status}`);
      await response.arrayBuffer();
    }
  });
  await Promise.all(workers);
}

function auditIntentMap(manifest, intentCsv) {
  const rows = parseCsv(intentCsv);
  const indexableRows = rows.filter((row) => row.indexable === "true" && row.status === "published");
  const manifestPaths = new Set(manifest.indexableRoutes.map((route) => route.path));
  const intentPaths = new Set(indexableRows.map((row) => row.url));
  const themes = new Map();

  for (const route of manifest.indexableRoutes) {
    if (!intentPaths.has(route.path)) reportError(`${route.path}: missing from search intent map`);
  }
  for (const row of indexableRows) {
    if (!manifestPaths.has(row.url)) reportError(`${row.url}: published intent-map URL missing from route manifest`);
    if (row.parent_url && !manifestPaths.has(row.parent_url)) reportError(`${row.url}: intent-map parent ${row.parent_url} is not indexable`);
    const theme = row.primary_query_theme.trim().toLowerCase();
    if (!theme) {
      reportError(`${row.url}: missing primary query theme`);
      continue;
    }
    themes.set(theme, [...(themes.get(theme) || []), row.url]);
  }
  for (const [theme, paths] of themes) {
    if (paths.length > 1) reportError(`duplicate primary query theme "${theme}": ${paths.join(", ")}`);
  }
}

async function auditSitemap(manifest) {
  const response = await fetch(`${localBase}/sitemap.xml`, { redirect: "manual" });
  if (response.status !== 200) {
    reportError(`/sitemap.xml returned ${response.status}`);
    return;
  }
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const uniqueUrls = new Set(urls);
  if (urls.length !== uniqueUrls.size) reportError("sitemap contains duplicate URLs");

  for (const route of manifest.indexableRoutes.filter((item) => item.sitemap)) {
    if (
      ![...uniqueUrls].some((value) =>
        equivalentUrl(value, expectedCanonical(route.path)),
      )
    ) {
      reportError(`sitemap is missing ${route.path}`);
    }
  }

  for (const value of uniqueUrls) {
    const url = new URL(value);
    if (url.origin !== canonicalOrigin) {
      reportError(`sitemap uses wrong host: ${value}`);
      continue;
    }
    const page = await fetch(`${localBase}${url.pathname}`, { redirect: "manual" });
    if (page.status !== 200) {
      reportError(`sitemap URL ${url.pathname} returned ${page.status}`);
      continue;
    }
    const $ = load(await page.text());
    if (!equivalentUrl($('link[rel="canonical"]').attr("href"), value)) {
      reportError(`sitemap URL ${url.pathname} is not self-canonical`);
    }
  }
}

async function auditNonIndexableRoutes(manifest) {
  for (const route of manifest.nonIndexableRoutes || []) {
    if (route.path.includes("*")) continue;
    const response = await fetch(`${localBase}${route.path}`, { redirect: "manual" });
    if (response.status === 404 || response.status === 410) continue;
    const html = await response.text();
    const $ = load(html);
    const robots = $('meta[name="robots"]').attr("content") || "";
    if (response.status === 200 && !/noindex/i.test(robots)) {
      reportError(`${route.path}: draft route is publicly indexable`);
    }
  }
}

async function main() {
  const [manifest, redirectCsv, intentCsv] = await Promise.all([
    readFile(`${root}/seo/route-manifest.json`, "utf8").then(JSON.parse),
    readFile(`${root}/seo/legacy-redirect-map.csv`, "utf8"),
    readFile(`${root}/seo/search-intent-map.csv`, "utf8"),
  ]);
  const server = startServer();

  try {
    await waitForServer();
    await auditRedirects(parseRedirectCsv(redirectCsv));
    if (!redirectsOnly) {
      auditIntentMap(manifest, intentCsv);
      await auditRoutes(manifest);
      await auditSitemap(manifest);
      await auditNonIndexableRoutes(manifest);
    }
  } finally {
    server?.kill("SIGTERM");
  }

  for (const warning of warnings) console.warn(`WARN: ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    console.error(`SEO audit failed with ${errors.length} error(s).`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `SEO audit passed: ${redirectsOnly ? "redirects" : "routes, redirects, links, sitemap and JSON-LD"}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
