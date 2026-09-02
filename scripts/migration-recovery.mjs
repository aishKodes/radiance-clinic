import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { normalizeUrlPath, numberValue, readCsv, writeCsv } from "./seo-utils.mjs";

const root = process.cwd();
const canonicalOrigin = "https://www.radianceclinics.com";
const checkLive = process.argv.includes("--live");

const deferred = [
  ["/hair-patch", "No verified current hair-system page", "Service scope and replacement content need clinic confirmation"],
  ["/hair-wig", "No verified current hair-system page", "Service scope and replacement content need clinic confirmation"],
  ["/treatment/non-surgical-facial-enhancements/micro-blading", "No verified current microblading page", "Confirm the current service before rebuilding"],
  ["/body-piercing", "No verified current body-piercing page", "Do not redirect to an unrelated clinic page"],
  ["/ear-piercing", "No verified current ear-piercing page", "Do not redirect to an unrelated clinic page"],
  ["/split-ear-repair", "No verified current split-ear repair page", "Confirm clinical scope before rebuilding"],
  ["/vitiligo-3", "No medically reviewed vitiligo page", "Medical review and current service verification required"],
  ["/treatment/premium-services/lip-pigmentation", "No verified equivalent for lip pigmentation", "Do not conflate cosmetic lip work with general pigmentation treatment"],
].map(([source, reason, notes]) => ({ source, reason, notes }));

function absolutePath(value) {
  return new URL(normalizeUrlPath(value), canonicalOrigin).toString();
}

async function liveStatuses(paths) {
  const queue = [...paths];
  const statuses = new Map();
  const workers = Array.from({ length: Math.min(12, queue.length) }, async () => {
    while (queue.length) {
      const pathname = queue.shift();
      try {
        const response = await fetch(absolutePath(pathname), {
          method: "HEAD",
          redirect: "manual",
          signal: AbortSignal.timeout(8000),
        });
        statuses.set(pathname, String(response.status));
      } catch {
        statuses.set(pathname, "request-failed");
      }
    }
  });
  await Promise.all(workers);
  return statuses;
}

async function main() {
  const [inventory, notFoundRows, pageRows, redirectRecords] = await Promise.all([
    readCsv(path.join(root, "seo", "legacy-content-master-inventory.csv")),
    readCsv(path.join(root, "seo", "gsc-raw", "not-found", "Table.csv")),
    readCsv(path.join(root, "seo", "gsc-current-pages.csv")),
    readFile(path.join(root, "src", "data", "legacy-redirects.json"), "utf8").then(JSON.parse),
  ]);

  const redirects = new Map(redirectRecords.map((item) => [normalizeUrlPath(item.source), item]));
  const deferredByPath = new Map(deferred.map((item) => [item.source, item]));
  const notFound = new Set(notFoundRows.map((row) => normalizeUrlPath(row.URL)));
  const gscByPath = new Map(pageRows.map((row) => [normalizeUrlPath(row.page), row]));
  const uniqueInventory = new Map();
  for (const item of inventory) {
    const pathname = normalizeUrlPath(item.old_url);
    if (!pathname || pathname === "/") continue;
    const existing = uniqueInventory.get(pathname);
    if (!existing || numberValue(item.historical_value_score) > numberValue(existing.historical_value_score)) {
      uniqueInventory.set(pathname, item);
    }
  }

  const paths = [...uniqueInventory.keys()];
  const statuses = checkLive ? await liveStatuses(paths) : new Map();
  const report = paths.map((pathname) => {
    const old = uniqueInventory.get(pathname);
    const redirect = redirects.get(pathname);
    const deferredItem = deferredByPath.get(pathname);
    const potentialTarget = normalizeUrlPath(old.potential_target_url || "");
    const equivalent = redirect?.destination || (old.existing_new_equivalent === "yes" ? potentialTarget : "");
    const oldMetrics = gscByPath.get(pathname);
    const currentMetrics = equivalent ? gscByPath.get(normalizeUrlPath(equivalent)) : undefined;
    const impressions = numberValue(oldMetrics?.impressions_28d);
    const historicalValue = numberValue(old.historical_value_score);
    const migrationAction = redirect
      ? "REDIRECT"
      : deferredItem
        ? "VERIFY_SERVICE"
        : old.existing_new_equivalent === "yes"
          ? "REVIEW_EQUIVALENCE"
          : "REBUILD_OR_ARCHIVE";
    const priority = impressions >= 50 || historicalValue >= 85
      ? "P0"
      : impressions >= 10 || historicalValue >= 70
        ? "P1"
        : "P2";

    return {
      old_url: absolutePath(pathname),
      old_title: old.old_title,
      old_topic: old.category || old.new_content_type,
      old_content_length: old.word_count,
      new_equivalent: equivalent ? absolutePath(equivalent) : "",
      current_http_status: statuses.get(pathname) || (notFound.has(pathname) ? "GSC_404_EXPORT" : "not-live-checked"),
      redirect_exists: redirect ? "yes" : "no",
      current_indexed_url: currentMetrics && numberValue(currentMetrics.impressions_28d) > 0 ? absolutePath(equivalent) : "",
      gsc_old_impressions_if_available: oldMetrics?.impressions_28d || 0,
      gsc_current_impressions: currentMetrics?.impressions_28d || 0,
      migration_action: migrationAction,
      priority,
    };
  }).sort((left, right) => {
    const order = { P0: 0, P1: 1, P2: 2 };
    return order[left.priority] - order[right.priority] || numberValue(right.gsc_old_impressions_if_available) - numberValue(left.gsc_old_impressions_if_available);
  });

  const redirectMap = [
    ...redirectRecords.map((item) => ({
      legacy_url: item.source,
      destination_url: absolutePath(item.destination),
      status: "active-permanent",
      reason: item.reason,
      equivalence_confidence: item.confidence,
      notes: item.notes,
    })),
    ...deferred.map((item) => ({
      legacy_url: item.source,
      destination_url: "",
      status: "deferred-verification",
      reason: item.reason,
      equivalence_confidence: "none",
      notes: item.notes,
    })),
  ].sort((left, right) => left.legacy_url.localeCompare(right.legacy_url));

  await Promise.all([
    writeCsv(path.join(root, "seo", "migration-loss-report.csv"), [
      "old_url", "old_title", "old_topic", "old_content_length", "new_equivalent",
      "current_http_status", "redirect_exists", "current_indexed_url",
      "gsc_old_impressions_if_available", "gsc_current_impressions", "migration_action", "priority",
    ], report),
    writeCsv(path.join(root, "seo", "legacy-redirect-map.csv"), [
      "legacy_url", "destination_url", "status", "reason", "equivalence_confidence", "notes",
    ], redirectMap),
  ]);

  console.log(`Mapped ${redirectRecords.length} one-hop redirects and ${deferred.length} verified gaps.`);
  console.log(`Generated migration analysis for ${report.length} unique historical URLs${checkLive ? " with live status checks" : " using the saved GSC 404 export"}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
