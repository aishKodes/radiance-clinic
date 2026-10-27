import path from "node:path";
import process from "node:process";
import { readCsv, writeCsv, numberValue, percentValue, normalizeUrlPath } from "./seo-utils.mjs";

const root = process.cwd();
const exportRoot = path.join(root, "seo/gsc-raw/hair-2026-10-27");
const checkedAt = "2026-10-27";

const windows = [
  {
    id: "7d_vs_previous_7d",
    file: path.join(exportRoot, "7d-vs-previous/Queries.csv"),
    currentPrefix: "Last 7 days",
    oldPrefix: "Previous 7 days",
  },
  {
    id: "28d_vs_previous_28d",
    file: path.join(exportRoot, "28d-vs-previous/Queries.csv"),
    currentPrefix: "Last 28 days",
    oldPrefix: "Previous 28 days",
  },
  {
    id: "latest_28d_vs_strongest_pre_migration_28d",
    file: path.join(exportRoot, "current-vs-pre-migration/Queries.csv"),
    currentPrefix: "25/09/2026 - 22/10/2026",
    oldPrefix: "10/06/2026 - 07/07/2026",
  },
];

function isHairRestorationQuery(query) {
  const text = query.toLowerCase();
  return !/laser hair|hair removal|electrolysis|waxing|body hair removal/.test(text);
}

function classify(query) {
  const text = query.toLowerCase();
  if (/radiance/.test(text)) return "brand";
  if (/wig|patch|hair fix|hair system|non.?surgical/.test(text)) return "non-surgical hair replacement";
  if (/repair|failed|bad transplant|overharvest|pluggy/.test(text)) return "hair transplant repair";
  if (/beard|moustache|mustache/.test(text)) return "beard and moustache transplant";
  if (/crown|vertex/.test(text)) return "crown restoration";
  if (/hairline|temple|receding/.test(text)) return "hairline correction";
  if (/female|women|woman|widening part/.test(text)) return "female hair loss";
  if (/male pattern|bald/.test(text)) return "male pattern hair loss";
  if (/prp|gfc/.test(text)) return "PRP and GFC";
  if (/transplant|fue|fut|graft/.test(text)) return "hair transplant";
  return "hair loss and scalp consultation";
}

function ownerFor(query, intent) {
  const text = query.toLowerCase();
  if (intent === "brand") return "/";
  if (intent === "non-surgical hair replacement") return "/non-surgical-hair-replacement-bhubaneswar";
  if (intent === "hair transplant repair") return "/hair-transplant-repair-bhubaneswar";
  if (intent === "beard and moustache transplant") return "/beard-moustache-transplant-bhubaneswar";
  if (intent === "crown restoration") return "/crown-hair-transplant-bhubaneswar";
  if (intent === "hairline correction") return "/hairline-correction-bhubaneswar";
  if (intent === "female hair loss") return "/female-hair-loss-treatment-bhubaneswar";
  if (intent === "male pattern hair loss") return "/male-pattern-hair-loss-treatment-bhubaneswar";
  if (intent === "PRP and GFC") return "/treatments/hair-restoration/prp-gfc-scalp-therapy";
  if (intent === "hair transplant") return "/hair-transplant-bhubaneswar";
  if (/alopecia|patchy loss/.test(text)) return "/alopecia-areata-treatment-bhubaneswar";
  return "/hair-loss-clinic-bhubaneswar";
}

function issueFor({ clickLoss, oldImpressions, currentImpressions, positionDelta, oldCtr, currentCtr }) {
  if (clickLoss > 0 && currentImpressions < oldImpressions * 0.7) return "DEMAND_OR_VISIBILITY_LOSS";
  if (clickLoss > 0 && currentCtr + 0.25 < oldCtr) return "CTR_LOSS";
  if (clickLoss > 0 && positionDelta > 2) return "RANKING_DECLINE";
  if (currentImpressions > oldImpressions && currentCtr < oldCtr) return "CTR_OPPORTUNITY";
  if (clickLoss > 0) return "CLICK_LOSS_REQUIRES_QUERY_PAGE_REVIEW";
  return "STABLE_OR_IMPROVING";
}

function actionFor(issue, owner) {
  if (issue === "CTR_LOSS" || issue === "CTR_OPPORTUNITY") {
    return `Inspect the exact query-page result and snippet for ${owner}; preserve protected titles unless the page mapping confirms a mismatch.`;
  }
  if (issue === "RANKING_DECLINE") {
    return `Confirm the ranking URL, canonical and internal links for ${owner}; strengthen evidence and relevant anchors without changing the owner.`;
  }
  if (issue === "DEMAND_OR_VISIBILITY_LOSS") {
    return `Compare pre-migration ranking URLs and redirects, then consolidate useful historical signals on ${owner}.`;
  }
  if (issue === "CLICK_LOSS_REQUIRES_QUERY_PAGE_REVIEW") {
    return `Inspect query-to-page ownership before changing content; reinforce ${owner} from the Hair hub, results and relevant guides.`;
  }
  return `Keep ${owner} as the selected owner and monitor comparable windows before further changes.`;
}

const historicalRows = await readCsv(path.join(root, "seo/hair-query-recovery.csv"));
const historicalByQuery = new Map(
  historicalRows.map((row) => [row.query.toLowerCase(), row]),
);
const recoveryRows = [];

for (const window of windows) {
  const rows = await readCsv(window.file);
  for (const row of rows) {
    const query = row["Top queries"]?.trim();
    if (!query || !isHairRestorationQuery(query)) continue;

    const oldClicks = numberValue(row[`${window.oldPrefix} Clicks`]);
    const currentClicks = numberValue(row[`${window.currentPrefix} Clicks`]);
    const oldImpressions = numberValue(row[`${window.oldPrefix} Impressions`]);
    const currentImpressions = numberValue(row[`${window.currentPrefix} Impressions`]);
    const oldPosition = numberValue(row[`${window.oldPrefix} Position`]);
    const currentPosition = numberValue(row[`${window.currentPrefix} Position`]);
    const oldCtr = percentValue(row[`${window.oldPrefix} CTR`]);
    const currentCtr = percentValue(row[`${window.currentPrefix} CTR`]);
    const clickLoss = oldClicks - currentClicks;
    if (clickLoss <= 0) continue;
    const positionDelta = oldPosition && currentPosition ? currentPosition - oldPosition : "";
    const intent = classify(query);
    const preferredOwner = ownerFor(query, intent);
    const history = historicalByQuery.get(query.toLowerCase());
    const issue = issueFor({
      clickLoss,
      oldImpressions,
      currentImpressions,
      positionDelta: numberValue(positionDelta),
      oldCtr,
      currentCtr,
    });
    const commercial = intent !== "brand";

    recoveryRows.push({
      query,
      intent,
      old_url: normalizeUrlPath(history?.old_page || ""),
      current_url: normalizeUrlPath(history?.current_page || ""),
      old_clicks: oldClicks,
      current_clicks: currentClicks,
      click_loss: clickLoss,
      old_impressions: oldImpressions,
      current_impressions: currentImpressions,
      old_position: oldPosition || "",
      current_position: currentPosition || "",
      position_delta:
        typeof positionDelta === "number" ? positionDelta.toFixed(2) : "",
      old_ctr: `${oldCtr}%`,
      current_ctr: `${currentCtr}%`,
      preferred_owner: preferredOwner,
      index_status: "URL_INSPECTION_REQUIRED; performance data is not index status",
      issue,
      action: actionFor(issue, preferredOwner),
      priority:
        clickLoss >= 2 || (commercial && oldImpressions >= 100)
          ? "P0"
          : oldImpressions >= 50
            ? "P1"
            : "P2",
      comparison_window: window.id,
      source: "Authenticated Google Search Console URL-prefix property; Web; all countries and devices",
      checked_at: checkedAt,
      _commercialScore: commercial ? 1 : 0,
    });
  }
}

recoveryRows.sort(
  (a, b) =>
    b.click_loss - a.click_loss ||
    b._commercialScore - a._commercialScore ||
    b.old_impressions - a.old_impressions,
);

await writeCsv(
  path.join(root, "seo/hair-revenue-recovery.csv"),
  [
    "query",
    "intent",
    "old_url",
    "current_url",
    "old_clicks",
    "current_clicks",
    "click_loss",
    "old_impressions",
    "current_impressions",
    "old_position",
    "current_position",
    "position_delta",
    "old_ctr",
    "current_ctr",
    "preferred_owner",
    "index_status",
    "issue",
    "action",
    "priority",
    "comparison_window",
    "source",
    "checked_at",
  ],
  recoveryRows,
);

const legacyRows = await readCsv(
  path.join(root, "seo/legacy-content-master-inventory.csv"),
);
const redirectRows = await readCsv(path.join(root, "seo/legacy-redirect-map.csv"));
const redirectBySource = new Map(
  redirectRows.map((row) => [normalizeUrlPath(row.legacy_url), row]),
);
const hairPattern = /hair|transplant|prp|gfc|fue|beard|moustache|mustache|bald|alopecia|wig|patch|crown|hairline/i;
const legacyHairRows = legacyRows
  .filter((row) =>
    hairPattern.test(
      [row.old_url, row.old_slug, row.old_title, row.category, row.subcategory].join(" "),
    ),
  )
  .map((row) => {
    const oldPath = normalizeUrlPath(row.old_url);
    const redirect = redirectBySource.get(oldPath);
    const target = redirect?.destination_url || row.potential_target_url || "";
    return {
      old_url: row.old_url,
      old_title: row.old_title,
      content_type: row.old_content_type,
      historical_value_score: row.historical_value_score,
      proposed_target: target,
      redirect_status: redirect?.status || "NO_ACTIVE_REDIRECT_RECORDED",
      equivalence_confidence: redirect?.equivalence_confidence || "unverified",
      disposition: redirect?.status === "active-permanent"
        ? "B_DIRECT_ONE_HOP_301"
        : row.existing_new_equivalent === "yes"
          ? "A_RETAINED_OR_EQUIVALENT"
          : row.recommended_action === "CONVERT_TO_GUIDE" || row.recommended_action === "CONVERT_TO_QA"
            ? "C_SUPPORTING_CONTENT_CANDIDATE"
            : "D_REVIEW_FOR_404_OR_410",
      action: redirect?.notes || row.notes,
    };
  })
  .sort(
    (a, b) =>
      numberValue(b.historical_value_score) - numberValue(a.historical_value_score),
  );

await writeCsv(
  path.join(root, "seo/legacy-hair-url-audit.csv"),
  [
    "old_url",
    "old_title",
    "content_type",
    "historical_value_score",
    "proposed_target",
    "redirect_status",
    "equivalence_confidence",
    "disposition",
    "action",
  ],
  legacyHairRows,
);

console.log(
  `Hair revenue recovery written: ${recoveryRows.length} query-window rows; ${legacyHairRows.length} legacy Hair records audited.`,
);
