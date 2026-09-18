import { readFile } from "node:fs/promises";
import { readCsv, writeCsv } from "./seo-utils.mjs";

const data = JSON.parse(
  await readFile("seo/2026-09-gsc-observations.json", "utf8"),
);
const tracker = new Set([
  "skin specialist in bhubaneswar",
  "skin care doctor bhubaneswar",
  "hair patch in bhubaneswar",
  "hair wig in bhubaneswar",
  "hair transplant in rourkela",
  "weight loss clinic bhubaneswar",
  "dermatologist in bhubaneswar",
]);
function target(query) {
  if (/hair patch|hair wig/.test(query))
    return "/non-surgical-hair-replacement-bhubaneswar";
  if (/rourkela/.test(query)) return "/hair-transplant-rourkela";
  if (/transplant/.test(query)) return "/hair-transplant-bhubaneswar";
  if (/hair doctor|hair specialist|hair clinic/.test(query))
    return "/hair-loss-clinic-bhubaneswar";
  if (/laser hair/.test(query)) return "/laser-hair-removal-bhubaneswar";
  if (/dermatologist|skin specialist|skin care doctor/.test(query))
    return "/skin-clinic-bhubaneswar";
  if (/aesthetic/.test(query)) return "/treatments/aesthetic-dermatology";
  if (/microblading|weight loss/.test(query)) return "";
  if (/prakash/.test(query)) return "/about";
  return "/";
}
const rows = data.queries.map((values) => {
  const [
    query,
    current_clicks,
    previous_clicks,
    current_impressions,
    previous_impressions,
    current_ctr,
    previous_ctr,
    current_position,
    previous_position,
  ] = values;
  const mapping = data.queryPageMappings[query];
  const position_change =
    current_impressions && previous_impressions && current_position !== null
      ? +(current_position - previous_position).toFixed(1)
      : "";
  const lost = previous_clicks - current_clicks;
  let problem_type = !current_impressions
    ? "NO_CURRENT_QUERY_VISIBILITY"
    : position_change > 3
      ? "RANKING_DECLINE"
      : lost > 0
        ? "CTR_OR_DEMAND_LOSS"
        : "STABLE_OR_IMPROVING";
  let recommended_action =
    lost > 0
      ? "Inspect exact query-page mapping and snippet before changing winning title; monitor clicks not sitewide average position"
      : "Preserve existing URL/title; add contextual links to canonical owner and monitor";
  if (/hair patch|hair wig/.test(query)) {
    problem_type = "MIGRATION_INTENT_GAP_AND_WRONG_PAGE";
    recommended_action =
      "Consolidate legacy coverage URLs; strengthen patch/wig content and incoming links; inspect/request indexing of canonical replacement";
  }
  if (/microblading|weight loss/.test(query)) {
    problem_type = "SERVICE_CONFIRMATION_REQUIRED";
    recommended_action =
      "Obtain current doctor-approved service scope; do not recreate outdated medical claims";
  }
  const target_page = target(query);
  return {
    query,
    previous_url: mapping?.previous || "",
    current_url: mapping?.current || "",
    previous_clicks,
    current_clicks,
    previous_impressions,
    current_impressions,
    previous_position: previous_impressions ? previous_position : "",
    current_position: current_impressions ? current_position : "",
    position_change,
    previous_ctr,
    current_ctr,
    ranking_tracker_status: tracker.has(query)
      ? "N/A (user supplied; not a Google index verdict)"
      : "",
    google_index_status:
      "URL_INSPECTION_REQUIRED; query visibility is not index status",
    problem_type,
    recommended_action,
    priority:
      lost >= 3 || /hair patch|hair wig/.test(query)
        ? "P0"
        : lost > 0 || tracker.has(query)
          ? "P1"
          : "P2",
    target_page,
    ctr_change_percentage_points: +(
      parseFloat(current_ctr) - parseFloat(previous_ctr)
    ).toFixed(1),
    mapping_evidence:
      mapping?.detail || "NOT_JOINED: retrieve exact query Pages report",
    window: data.window,
    checked_at: data.checkedAt,
    source: data.source,
  };
});
for (const query of data.missingExactQueries)
  rows.push({
    query,
    ranking_tracker_status: "N/A (user supplied)",
    google_index_status: "UNKNOWN",
    problem_type: /weight/.test(query)
      ? "SERVICE_CONFIRMATION_REQUIRED"
      : "QUERY_DATA_UNAVAILABLE",
    recommended_action: /weight/.test(query)
      ? "Confirm current medical weight management versus cosmetic contouring before publication"
      : "Retrieve exact-query export/API data; strengthen existing skin owner, no duplicate page",
    priority: "P1",
    target_page: target(query),
    window: data.window,
    checked_at: data.checkedAt,
    source: data.source,
  });
await writeCsv(
  "seo/2026-09-ranking-recovery.csv",
  [
    "query",
    "previous_url",
    "current_url",
    "previous_clicks",
    "current_clicks",
    "previous_impressions",
    "current_impressions",
    "previous_position",
    "current_position",
    "position_change",
    "previous_ctr",
    "current_ctr",
    "ranking_tracker_status",
    "google_index_status",
    "problem_type",
    "recommended_action",
    "priority",
    "target_page",
    "ctr_change_percentage_points",
    "mapping_evidence",
    "window",
    "checked_at",
    "source",
  ],
  rows,
);
await writeCsv(
  "seo/protected-keywords.csv",
  [
    "query",
    "ranking_url",
    "position",
    "clicks",
    "impressions",
    "last_checked",
    "protected_status",
    "scope",
    "source",
  ],
  rows
    .filter(
      (row) =>
        row.previous_clicks > 0 ||
        row.current_clicks > 0 ||
        (row.current_position && row.current_position <= 10),
    )
    .map((row) => ({
      query: row.query,
      ranking_url: row.current_url || row.previous_url || "",
      position: row.current_position,
      clicks: row.current_clicks,
      impressions: row.current_impressions,
      last_checked: data.checkedAt,
      protected_status: "PROTECTED",
      scope:
        "Query-level metrics; URL unknown unless exact-query page table was inspected. Protection does not imply top-10 commercial owner is confirmed.",
      source: data.source,
    })),
);
await writeCsv(
  "seo/daily-ranking-watch.csv",
  [
    "checked_at",
    "window",
    "query",
    "clicks",
    "previous_clicks",
    "impressions",
    "previous_impressions",
    "position",
    "previous_position",
    "status",
    "reason",
    "consecutive_observations",
  ],
  rows
    .filter((row) => tracker.has(row.query))
    .map((row) => ({
      checked_at: data.checkedAt,
      window: data.window,
      query: row.query,
      clicks: row.current_clicks,
      previous_clicks: row.previous_clicks,
      impressions: row.current_impressions,
      previous_impressions: row.previous_impressions,
      position: row.current_position,
      previous_position: row.previous_position,
      status:
        row.current_position && row.position_change <= 0 ? "GREEN" : "WATCH",
      reason:
        row.current_position && row.position_change <= 0
          ? "Stable/improving first observation; no rewrite"
          : "Single observation; ORANGE requires 3 successive declines; technical/index checks recorded separately",
      consecutive_observations: 1,
    })),
);
console.log(
  `Recorded ${rows.length} fresh query recovery observations; unknown mappings retained as blank.`,
);

const ctr = await readCsv("seo/ctr-opportunities.csv");
const additions = [
  {
    query: "hair patch in bhubaneswar",
    url: "https://www.radianceclinics.com/non-surgical-hair-replacement-bhubaneswar",
    position: 20.9,
    impressions: 22,
    ctr: 0,
    title:
      "Hair Patch & Non-Surgical Hair Replacement in Bhubaneswar | Radiance",
    description:
      "Discuss hair patches, wigs and non-surgical hair systems at Radiance Clinics, Bhubaneswar. Understand matching, fitting, scalp care, refitting and costs before choosing.",
    recommended_test:
      "Implemented 2026-09-18: title/description and explicit patch/wig content on canonical TARGET, not current ranking homepage. Metrics are query aggregates; inspect canonical indexing and monitor after deployment.",
  },
  {
    query: "hair transplant in bhubaneswar",
    url: "https://www.radianceclinics.com/",
    position: 3.8,
    impressions: 607,
    ctr: 1,
    title:
      "Radiance Clinics Bhubaneswar | Hair Transplant, Skin & Laser Clinic",
    description: "Protected homepage snippet retained",
    recommended_test:
      "Observed 2026-09-18 exact-query page metrics: clicks 16 to 6; CTR 2.8% to 1%; page position 3.3 to 3.8. Preserve winning URL/title; inspect competing snippets and search appearance before an approved single-variable test. NOT a title change.",
  },
];
const retained = ctr.filter(
  (row) =>
    !additions.some((item) => item.query === row.query && item.url === row.url),
);
await writeCsv(
  "seo/ctr-opportunities.csv",
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
  [...retained, ...additions],
);
