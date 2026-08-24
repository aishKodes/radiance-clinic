import path from "node:path";
import process from "node:process";
import { readCsv, writeCsv, numberValue, normalizeUrlPath, percentValue } from "./seo-utils.mjs";

const root = process.cwd();
const rawRoot = path.join(root, "seo", "gsc-raw");

const periods = [
  { id: "7d", directory: "7d" },
  { id: "28d", directory: "28d" },
  { id: "3mo", directory: "3mo" },
];

async function loadDimension(filename, keyColumn) {
  const byKey = new Map();

  for (const period of periods) {
    const rows = await readCsv(path.join(rawRoot, period.directory, filename));
    for (const row of rows) {
      const key = row[keyColumn]?.trim();
      if (!key) continue;
      const current = byKey.get(key) || { key };
      current[`clicks_${period.id}`] = numberValue(row.Clicks);
      current[`impressions_${period.id}`] = numberValue(row.Impressions);
      current[`ctr_${period.id}`] = percentValue(row.CTR).toFixed(2);
      current[`position_${period.id}`] = numberValue(row.Position).toFixed(2);
      byKey.set(key, current);
    }
  }

  const comparison = await readCsv(path.join(rawRoot, "compare-28d", filename));
  for (const row of comparison) {
    const key = row[keyColumn]?.trim();
    if (!key) continue;
    const current = byKey.get(key) || { key };
    current.clicks_previous_28d = numberValue(row["Previous 28 days Clicks"]);
    current.impressions_previous_28d = numberValue(row["Previous 28 days Impressions"]);
    current.ctr_previous_28d = percentValue(row["Previous 28 days CTR"]).toFixed(2);
    current.position_previous_28d = numberValue(row["Previous 28 days Position"]).toFixed(2);
    current.click_change_28d = numberValue(row["Last 28 days Clicks"]) - current.clicks_previous_28d;
    current.impression_change_28d = numberValue(row["Last 28 days Impressions"]) - current.impressions_previous_28d;
    byKey.set(key, current);
  }

  return [...byKey.values()];
}

function commercialWeight(query) {
  return /\b(treatment|clinic|doctor|specialist|transplant|removal|laser|prp|gfc|botox|filler|dermatologist)\b/i.test(query) ? 15 : 4;
}

function opportunityScore(row, mappedTarget) {
  const impressions = Number(row.impressions_28d || 0);
  const position = Number(row.position_28d || 0);
  const ctr = Number(row.ctr_28d || 0);
  const impressionSignal = Math.min(35, Math.log10(impressions + 1) * 12);
  const positionSignal = position >= 4 && position <= 30 ? 25 : position > 30 && position <= 60 ? 12 : 4;
  const ctrSignal = impressions >= 30 && ctr < 2 ? 15 : ctr < 4 ? 8 : 2;
  const mismatchSignal = mappedTarget?.action && mappedTarget.action !== "NO_ACTION" ? 10 : 0;
  return Math.min(100, Math.round(impressionSignal + positionSignal + ctrSignal + commercialWeight(row.key) + mismatchSignal));
}

async function main() {
  const queryRows = await loadDimension("Queries.csv", "Top queries");
  const pageRows = await loadDimension("Pages.csv", "Top pages");
  const targetRows = await readCsv(path.join(root, "seo", "gsc-query-target-map.csv")).catch(() => []);
  const targetByQuery = new Map(targetRows.map((row) => [row.query.toLowerCase(), row]));
  const observations = await readCsv(path.join(root, "seo", "gsc-query-page-observations.csv")).catch(() => []);

  const metricHeaders = [
    "clicks_7d", "impressions_7d", "ctr_7d", "position_7d",
    "clicks_28d", "impressions_28d", "ctr_28d", "position_28d",
    "clicks_previous_28d", "impressions_previous_28d", "ctr_previous_28d", "position_previous_28d",
    "click_change_28d", "impression_change_28d",
    "clicks_3mo", "impressions_3mo", "ctr_3mo", "position_3mo",
  ];

  const queries = queryRows
    .map(({ key, ...metrics }) => ({ query: key, ...metrics }))
    .sort((left, right) => Number(right.impressions_28d || 0) - Number(left.impressions_28d || 0));
  const pages = pageRows
    .map(({ key, ...metrics }) => ({ page: key, path: normalizeUrlPath(key), ...metrics }))
    .sort((left, right) => Number(right.impressions_28d || 0) - Number(left.impressions_28d || 0));

  const opportunities = queries
    .map((row) => {
      const target = targetByQuery.get(row.query.toLowerCase());
      const score = opportunityScore(row, target);
      return {
        query: row.query,
        clicks_28d: row.clicks_28d || 0,
        impressions_28d: row.impressions_28d || 0,
        ctr_28d: row.ctr_28d || "0.00",
        position_28d: row.position_28d || "0.00",
        clicks_previous_28d: row.clicks_previous_28d || 0,
        impressions_previous_28d: row.impressions_previous_28d || 0,
        current_ranking_url: target?.current_ranking_url || "",
        preferred_target_url: target?.preferred_target_url || "",
        action: target?.action || "REVIEW",
        opportunity_score: score,
        priority: score >= 75 ? "P0" : score >= 60 ? "P1" : score >= 42 ? "P2" : "P3",
        evidence: "Google Search Console export; no external search volume used",
      };
    })
    .filter((row) => row.impressions_28d >= 5)
    .sort((left, right) => right.opportunity_score - left.opportunity_score || right.impressions_28d - left.impressions_28d);

  await Promise.all([
    writeCsv(path.join(root, "seo", "gsc-current-queries.csv"), ["query", ...metricHeaders], queries),
    writeCsv(path.join(root, "seo", "gsc-current-pages.csv"), ["page", "path", ...metricHeaders], pages),
    writeCsv(path.join(root, "seo", "gsc-query-page-map.csv"), ["query", "period", "average_position", "ranking_url", "clicks", "impressions", "source"], observations),
    writeCsv(path.join(root, "seo", "gsc-opportunities.csv"), ["query", "clicks_28d", "impressions_28d", "ctr_28d", "position_28d", "clicks_previous_28d", "impressions_previous_28d", "current_ranking_url", "preferred_target_url", "action", "opportunity_score", "priority", "evidence"], opportunities),
  ]);

  console.log(`Normalized ${queries.length} queries, ${pages.length} pages and ${observations.length} verified query-page observations.`);
  console.log(`Prioritized ${opportunities.filter((row) => row.priority === "P0").length} P0 and ${opportunities.filter((row) => row.priority === "P1").length} P1 opportunities.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
