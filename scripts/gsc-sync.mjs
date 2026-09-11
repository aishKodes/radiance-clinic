import path from "node:path";
import process from "node:process";
import {
  readCsv,
  writeCsv,
  numberValue,
  normalizeUrlPath,
  percentValue,
} from "./seo-utils.mjs";

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
    current.impressions_previous_28d = numberValue(
      row["Previous 28 days Impressions"],
    );
    current.ctr_previous_28d = percentValue(
      row["Previous 28 days CTR"],
    ).toFixed(2);
    current.position_previous_28d = numberValue(
      row["Previous 28 days Position"],
    ).toFixed(2);
    current.click_change_28d =
      numberValue(row["Last 28 days Clicks"]) - current.clicks_previous_28d;
    current.impression_change_28d =
      numberValue(row["Last 28 days Impressions"]) -
      current.impressions_previous_28d;
    byKey.set(key, current);
  }

  return [...byKey.values()];
}

function commercialWeight(query) {
  return /\b(treatment|clinic|doctor|specialist|transplant|removal|laser|prp|gfc|botox|filler|dermatologist)\b/i.test(
    query,
  )
    ? 15
    : 4;
}

function opportunityScore(row, mappedTarget) {
  const impressions = Number(row.impressions_28d || 0);
  const position = Number(row.position_28d || 0);
  const ctr = Number(row.ctr_28d || 0);
  const impressionSignal = Math.min(35, Math.log10(impressions + 1) * 12);
  const positionSignal =
    position >= 4 && position <= 30
      ? 25
      : position > 30 && position <= 60
        ? 12
        : 4;
  const ctrSignal = impressions >= 30 && ctr < 2 ? 15 : ctr < 4 ? 8 : 2;
  const mismatchSignal =
    mappedTarget?.action && mappedTarget.action !== "NO_ACTION" ? 10 : 0;
  return Math.min(
    100,
    Math.round(
      impressionSignal +
        positionSignal +
        ctrSignal +
        commercialWeight(row.key) +
        mismatchSignal,
    ),
  );
}

function queryIntent(query, mappedTarget) {
  if (mappedTarget?.intent) return mappedTarget.intent;
  if (/\bradiance\b/i.test(query)) return "branded";
  if (/\b(bhubaneswar|bbsr|odisha|near me)\b/i.test(query)) {
    return commercialWeight(query) === 15
      ? "local commercial"
      : "local informational";
  }
  if (/^(how|why|what|when|where|can|does|do|is|are|who)\b/i.test(query)) {
    return "informational";
  }
  return commercialWeight(query) === 15 ? "commercial" : "informational";
}

function absoluteTarget(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(
    normalizeUrlPath(value),
    "https://www.radianceclinics.com",
  ).toString();
}

function sameTarget(left, right) {
  if (!left || !right) return false;
  return normalizeUrlPath(left) === normalizeUrlPath(right);
}

function recoveryIssue(row, target, positionDelta, clickLoss) {
  if (
    target?.current_ranking_url &&
    target?.preferred_target_url &&
    !sameTarget(target.current_ranking_url, target.preferred_target_url)
  ) {
    return "old or non-preferred URL still ranking";
  }
  if (target?.cannibalization && !/^none$/i.test(target.cannibalization)) {
    return "query ownership split across URLs";
  }
  if (positionDelta >= 3 && clickLoss > 0)
    return "position decline requiring page-level review";
  if (clickLoss > 0) return "CTR or demand decline requiring validation";
  return "unresolved; insufficient page-level evidence";
}

function recoveryPriority(
  row,
  target,
  clickLoss,
  impressionLoss,
  positionDelta,
) {
  if (
    target?.priority === "P0" ||
    clickLoss >= 5 ||
    (Number(row.impressions_28d || 0) >= 250 && positionDelta >= 2)
  )
    return "P0";
  if (
    target?.priority === "P1" ||
    clickLoss >= 2 ||
    impressionLoss >= 50 ||
    positionDelta >= 5
  )
    return "P1";
  return "P2";
}

function expectedCtr(position) {
  if (position <= 3) return 5;
  if (position <= 10) return 2;
  return 1;
}

const implementedSnippetActions = new Map([
  [
    "/hair-transplant-bhubaneswar",
    "Implemented 2026-09-11: strengthened the meta description around doctor-led FUE planning, donor assessment and hairline design. Monitor clicks and CTR without changing the winning URL.",
  ],
  [
    "/skin-clinic-bhubaneswar",
    "Implemented 2026-09-11: strengthened the meta description and opening decision guidance for skin-clinic intent. Monitor clicks and CTR after consolidating keyword-variant pages.",
  ],
]);

async function main() {
  const queryRows = await loadDimension("Queries.csv", "Top queries");
  const pageRows = await loadDimension("Pages.csv", "Top pages");
  const targetRows = await readCsv(
    path.join(root, "seo", "gsc-query-target-map.csv"),
  ).catch(() => []);
  const targetByQuery = new Map(
    targetRows.map((row) => [row.query.toLowerCase(), row]),
  );
  const observations = await readCsv(
    path.join(root, "seo", "gsc-query-page-observations.csv"),
  ).catch(() => []);
  const pageInventory = await readCsv(
    path.join(root, "seo", "seo-page-inventory.csv"),
  ).catch(() => []);
  const metadataByPath = new Map(
    pageInventory.map((row) => [normalizeUrlPath(row.url), row]),
  );

  const metricHeaders = [
    "clicks_7d",
    "impressions_7d",
    "ctr_7d",
    "position_7d",
    "clicks_28d",
    "impressions_28d",
    "ctr_28d",
    "position_28d",
    "clicks_previous_28d",
    "impressions_previous_28d",
    "ctr_previous_28d",
    "position_previous_28d",
    "click_change_28d",
    "impression_change_28d",
    "clicks_3mo",
    "impressions_3mo",
    "ctr_3mo",
    "position_3mo",
  ];

  const queries = queryRows
    .map(({ key, ...metrics }) => ({ query: key, ...metrics }))
    .sort(
      (left, right) =>
        Number(right.impressions_28d || 0) - Number(left.impressions_28d || 0),
    );
  const pages = pageRows
    .map(({ key, ...metrics }) => ({
      page: key,
      path: normalizeUrlPath(key),
      ...metrics,
    }))
    .sort(
      (left, right) =>
        Number(right.impressions_28d || 0) - Number(left.impressions_28d || 0),
    );

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
        priority:
          score >= 75 ? "P0" : score >= 60 ? "P1" : score >= 42 ? "P2" : "P3",
        evidence:
          "Google Search Console export; no external search volume used",
      };
    })
    .filter((row) => row.impressions_28d >= 5)
    .sort(
      (left, right) =>
        right.opportunity_score - left.opportunity_score ||
        right.impressions_28d - left.impressions_28d,
    );

  const queryLossRecovery = queries
    .map((row) => {
      const target = targetByQuery.get(row.query.toLowerCase());
      const oldClicks = Number(row.clicks_previous_28d || 0);
      const currentClicks = Number(row.clicks_28d || 0);
      const oldImpressions = Number(row.impressions_previous_28d || 0);
      const currentImpressions = Number(row.impressions_28d || 0);
      const oldPosition = Number(row.position_previous_28d || 0);
      const currentPosition = Number(row.position_28d || 0);
      const positionDelta =
        oldPosition && currentPosition
          ? Number((currentPosition - oldPosition).toFixed(2))
          : 0;
      const clickLoss = Math.max(0, oldClicks - currentClicks);
      const impressionLoss = Math.max(0, oldImpressions - currentImpressions);
      const preferredTarget = absoluteTarget(
        target?.preferred_target_url || "",
      );

      return {
        query: row.query,
        intent: queryIntent(row.query, target),
        old_url: absoluteTarget(target?.current_ranking_url || ""),
        current_url: preferredTarget,
        old_clicks: oldClicks,
        current_clicks: currentClicks,
        old_impressions: oldImpressions,
        current_impressions: currentImpressions,
        old_position: oldPosition ? oldPosition.toFixed(2) : "",
        current_position: currentPosition ? currentPosition.toFixed(2) : "",
        position_delta: positionDelta,
        old_ctr: row.ctr_previous_28d || "0.00",
        current_ctr: row.ctr_28d || "0.00",
        click_loss: clickLoss,
        migration_issue: recoveryIssue(row, target, positionDelta, clickLoss),
        cannibalisation: target?.cannibalization || "not established",
        preferred_target_url: preferredTarget,
        recommended_action:
          target?.action ||
          (positionDelta >= 3
            ? "Review intent match, indexation and internal links"
            : "Validate query-to-page ownership before changing content"),
        priority: recoveryPriority(
          row,
          target,
          clickLoss,
          impressionLoss,
          positionDelta,
        ),
        _impressionLoss: impressionLoss,
      };
    })
    .filter(
      (row) =>
        row.old_impressions >= 5 &&
        (row.click_loss > 0 ||
          row._impressionLoss >= 10 ||
          Number(row.position_delta) >= 2),
    )
    .sort((left, right) => {
      const order = { P0: 0, P1: 1, P2: 2 };
      return (
        order[left.priority] - order[right.priority] ||
        right.click_loss - left.click_loss ||
        right._impressionLoss - left._impressionLoss
      );
    })
    .map((row) => {
      const output = { ...row };
      delete output._impressionLoss;
      return output;
    });

  const ctrOpportunities = queries
    .map((row) => {
      const target = targetByQuery.get(row.query.toLowerCase());
      const position = Number(row.position_28d || 0);
      const impressions = Number(row.impressions_28d || 0);
      const ctr = Number(row.ctr_28d || 0);
      const targetUrl =
        target?.preferred_target_url || target?.current_ranking_url || "";
      const metadata = metadataByPath.get(normalizeUrlPath(targetUrl));
      const implementedSnippetAction = implementedSnippetActions.get(
        normalizeUrlPath(targetUrl),
      );
      const hasLegacyMismatch = Boolean(
        target?.current_ranking_url &&
        target?.preferred_target_url &&
        !sameTarget(target.current_ranking_url, target.preferred_target_url),
      );

      return {
        query: row.query,
        url: absoluteTarget(targetUrl),
        position: position.toFixed(2),
        impressions,
        ctr: ctr.toFixed(2),
        title: metadata?.title || "",
        description: metadata?.description || "",
        recommended_test:
          implementedSnippetAction ||
          (hasLegacyMismatch
            ? "Consolidate the legacy ranking URL first, then test query-aligned title and description copy."
            : "Test a clearer query-aligned title and description while preserving the canonical page and medical tone."),
        _position: position,
      };
    })
    .filter(
      (row) =>
        row.url &&
        row.impressions >= 50 &&
        row._position >= 1 &&
        row._position <= 20 &&
        Number(row.ctr) < expectedCtr(row._position),
    )
    .sort(
      (left, right) =>
        right.impressions - left.impressions ||
        left._position - right._position,
    )
    .map((row) => {
      const output = { ...row };
      delete output._position;
      return output;
    });

  await Promise.all([
    writeCsv(
      path.join(root, "seo", "gsc-current-queries.csv"),
      ["query", ...metricHeaders],
      queries,
    ),
    writeCsv(
      path.join(root, "seo", "gsc-current-pages.csv"),
      ["page", "path", ...metricHeaders],
      pages,
    ),
    writeCsv(
      path.join(root, "seo", "gsc-query-page-map.csv"),
      [
        "query",
        "period",
        "average_position",
        "ranking_url",
        "clicks",
        "impressions",
        "source",
      ],
      observations,
    ),
    writeCsv(
      path.join(root, "seo", "gsc-opportunities.csv"),
      [
        "query",
        "clicks_28d",
        "impressions_28d",
        "ctr_28d",
        "position_28d",
        "clicks_previous_28d",
        "impressions_previous_28d",
        "current_ranking_url",
        "preferred_target_url",
        "action",
        "opportunity_score",
        "priority",
        "evidence",
      ],
      opportunities,
    ),
    writeCsv(
      path.join(root, "seo", "query-loss-recovery.csv"),
      [
        "query",
        "intent",
        "old_url",
        "current_url",
        "old_clicks",
        "current_clicks",
        "old_impressions",
        "current_impressions",
        "old_position",
        "current_position",
        "position_delta",
        "old_ctr",
        "current_ctr",
        "click_loss",
        "migration_issue",
        "cannibalisation",
        "preferred_target_url",
        "recommended_action",
        "priority",
      ],
      queryLossRecovery,
    ),
    writeCsv(
      path.join(root, "seo", "ctr-opportunities.csv"),
      [
        "query",
        "url",
        "position",
        "impressions",
        "ctr",
        "title",
        "description",
        "recommended_test",
      ],
      ctrOpportunities,
    ),
  ]);

  console.log(
    `Normalized ${queries.length} queries, ${pages.length} pages and ${observations.length} verified query-page observations.`,
  );
  console.log(
    `Prioritized ${opportunities.filter((row) => row.priority === "P0").length} P0 and ${opportunities.filter((row) => row.priority === "P1").length} P1 opportunities.`,
  );
  console.log(
    `Generated ${queryLossRecovery.length} query-loss recovery rows and ${ctrOpportunities.length} CTR test opportunities.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
