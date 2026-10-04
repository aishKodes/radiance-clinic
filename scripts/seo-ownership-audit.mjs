import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { readCsv } from "./seo-utils.mjs";

const root = process.cwd();
const failures = [];
const allowedRoles = new Set([
  "COMMERCIAL_LOCAL",
  "TREATMENT_PROCEDURE",
  "CONCERN",
  "KNOWLEDGE",
  "DOCTOR_ANSWER",
  "VIDEO",
  "RESULT",
]);

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const itemPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(itemPath);
      return /\.(?:js|jsx|ts|tsx|json)$/.test(entry.name) ? [itemPath] : [];
    }),
  );
  return files.flat();
}

function routeIsIndexable(route, manifest) {
  const pathname = route.split(/[?#]/, 1)[0] || "/";
  return (
    manifest.indexableRoutes.some((item) => item.path === pathname && item.eligible) ||
    manifest.dynamicIndexablePrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

async function main() {
  const ownership = JSON.parse(await read("seo/topic-ownership.json"));
  const queryRows = await readCsv(path.join(root, "seo/query-url-ownership.csv"));
  const routeManifest = JSON.parse(await read("seo/route-manifest.json"));
  const topicIds = new Set();
  const canonicalOwners = new Set();
  const ownedQueries = new Set();

  check(ownership.evidence?.source?.includes("Search Console"), "Topic ownership must identify its Search Console evidence.");
  check(Array.isArray(ownership.topics) && ownership.topics.length >= 8, "Expected at least eight governed topic clusters.");

  for (const topic of ownership.topics || []) {
    check(!topicIds.has(topic.id), `Duplicate topic ID: ${topic.id}`);
    topicIds.add(topic.id);
    check(allowedRoles.has(topic.canonicalRole), `Invalid canonical role for ${topic.id}: ${topic.canonicalRole}`);
    check(!canonicalOwners.has(topic.canonicalOwner), `Canonical owner assigned to multiple topics: ${topic.canonicalOwner}`);
    canonicalOwners.add(topic.canonicalOwner);
    check(routeIsIndexable(topic.canonicalOwner, routeManifest), `Canonical owner is not indexable: ${topic.canonicalOwner}`);
    check(Array.isArray(topic.queries) && topic.queries.length > 0, `No owned queries for ${topic.id}.`);
    check(Array.isArray(topic.supportingPages) && topic.supportingPages.length > 0, `No supporting pages for ${topic.id}.`);
    check(Boolean(topic.commercialOwner), `No commercial owner recorded for ${topic.id}.`);
    for (const field of ["treatmentPages", "concernPages", "knowledgePages", "doctorAnswers", "videos", "results"]) {
      check(Array.isArray(topic[field]), `${topic.id} is missing ${field}.`);
      for (const route of topic[field] || []) {
        check(routeIsIndexable(route, routeManifest), `${topic.id} ${field} route is not indexable: ${route}`);
      }
    }

    for (const query of topic.queries || []) {
      const normalized = query.trim().toLowerCase();
      check(!ownedQueries.has(normalized), `Query assigned to multiple topics: ${query}`);
      ownedQueries.add(normalized);
    }

    for (const support of topic.supportingPages || []) {
      check(allowedRoles.has(support.role), `Invalid support role for ${support.path}: ${support.role}`);
      check(support.path !== topic.canonicalOwner, `Canonical owner repeated as support page for ${topic.id}.`);
      check(routeIsIndexable(support.path, routeManifest), `Supporting page is not indexable: ${support.path}`);
    }
  }

  const rowsByQuery = new Set();
  for (const row of queryRows) {
    const key = row.query.trim().toLowerCase();
    check(!rowsByQuery.has(key), `Duplicate query row in ownership CSV: ${row.query}`);
    rowsByQuery.add(key);
    const topic = ownership.topics.find((item) => item.id === row.topic);
    check(Boolean(topic), `Ownership CSV references unknown topic: ${row.topic}`);
    check(topic?.canonicalOwner === row.preferred_canonical_owner, `Preferred owner mismatch for query: ${row.query}`);
  }

  const files = (await sourceFiles(path.join(root, "src"))).filter(
    (file) => !file.endsWith("youtube-library.generated.ts"),
  );
  const outdatedExperienceClaim = /\b30\+\s*(?:years?)?|\b(?:over|more than)\s+30\s+years|\bthree decades(?:\s+of)?/i;
  for (const file of files) {
    const body = await readFile(file, "utf8");
    check(!outdatedExperienceClaim.test(body), `Outdated 30+ years claim found in ${path.relative(root, file)}.`);
  }

  const [seoConfig, clinicFacts, mediaManifest, seed, socialSection] = await Promise.all([
    read("src/lib/seo-config.ts"),
    read("src/data/clinic-facts.ts"),
    read("src/data/media-manifest.ts"),
    read("src/data/seed.ts"),
    read("src/components/SocialCommunitySection.tsx"),
  ]);
  check(seoConfig.includes("Radiance Skin & Hair Clinics"), "Official clinic name is missing from SEO configuration.");
  check(seoConfig.includes("+91 92383 21888"), "Primary clinic phone is missing from SEO configuration.");
  check(
    clinicFacts.includes('value: "20+"') && clinicFacts.includes('label: "Years of Clinical Experience"'),
    "Approved 20+ years fact is missing from the central fact record.",
  );
  check(!/youtube\.com\/[^"'\s?]+\?/.test(`${mediaManifest}\n${seed}\n${socialSection}`), "Tracked YouTube channel URL found in visible source data.");

  if (failures.length) {
    console.error(`SEO ownership audit failed (${failures.length}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`SEO ownership audit passed: ${ownership.topics.length} topics, ${ownedQueries.size} owned queries, ${queryRows.length} GSC evidence rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
