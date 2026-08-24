import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { numberValue, readCsv } from "./seo-utils.mjs";

const root = process.cwd();

async function main() {
  const [queries, pages, opportunities, migration, inspections, redirects] = await Promise.all([
    readCsv(path.join(root, "seo", "gsc-current-queries.csv")),
    readCsv(path.join(root, "seo", "gsc-current-pages.csv")),
    readCsv(path.join(root, "seo", "gsc-opportunities.csv")),
    readCsv(path.join(root, "seo", "migration-loss-report.csv")),
    readCsv(path.join(root, "seo", "gsc-url-inspection.csv")),
    readCsv(path.join(root, "seo", "legacy-redirect-map.csv")),
  ]);

  const totals = queries.reduce((sum, row) => ({
    clicks28: sum.clicks28 + numberValue(row.clicks_28d),
    impressions28: sum.impressions28 + numberValue(row.impressions_28d),
  }), { clicks28: 0, impressions28: 0 });
  const p0 = opportunities.filter((row) => row.priority === "P0");
  const activeRedirects = redirects.filter((row) => row.status === "active-permanent");
  const unresolvedP0 = migration.filter((row) => row.priority === "P0" && row.redirect_exists !== "yes");
  const indexedInspections = inspections.filter((row) => /on google|indexed/i.test(row.index_status));
  const top = opportunities.slice(0, 12);

  const report = [
    "# SEO Command Center",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Current Evidence",
    "",
    `- Search Console query rows: ${queries.length}`,
    `- Search Console page rows: ${pages.length}`,
    `- Summed 28-day clicks across exported queries: ${totals.clicks28}`,
    `- Summed 28-day impressions across exported queries: ${totals.impressions28}`,
    `- P0 opportunities: ${p0.length}`,
    `- Authenticated URL inspections recorded: ${inspections.length} (${indexedInspections.length} indexed)`,
    `- One-hop redirects in the production registry: ${activeRedirects.length}`,
    `- Historical P0 rows still requiring verification or content decisions: ${unresolvedP0.length}`,
    "",
    "## Highest Scored Opportunities",
    "",
    "| Query | 28d impressions | Position | Target | Action | Score |",
    "| --- | ---: | ---: | --- | --- | ---: |",
    ...top.map((row) => `| ${row.query} | ${row.impressions_28d} | ${row.position_28d} | ${row.preferred_target_url || "Review"} | ${row.action} | ${row.opportunity_score} |`),
    "",
    "Scores use only Search Console evidence and site relevance signals; no external search volume is invented.",
  ].join("\n");

  await writeFile(path.join(root, "seo", "seo-command-center-report.md"), `${report}\n`, "utf8");
  console.log(`Generated SEO command-center report with ${top.length} current opportunities.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
