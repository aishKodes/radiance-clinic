import { readFile } from "node:fs/promises";
import {
  numberValue,
  readCsv,
  writeCsv,
} from "./seo-utils.mjs";

const checkedAt = "2026-09-24";
const gscSourceWindow =
  "Authenticated Google Search Console Performance UI: last 7 days and last 28 complete days compared with previous 28 complete days. Exact migration-period API export is unavailable in the current property session.";
const hairQueryPattern = /\b(hair|fue|gfc|prp|alopecia|scalp|dandruff|tricholog|hairline|beard|wig|patch|minoxidil)\b/i;
const freshQueryOverrides = {
  "hair patch in bhubaneswar": {
    clicks_28d: "0",
    impressions_28d: "35",
    position_28d: "15.7",
    clicks_previous_28d: "2",
    impressions_previous_28d: "92",
    position_previous_28d: "6.2",
    current_page: "https://www.radianceclinics.com/non-surgical-hair-replacement-bhubaneswar",
    source_window:
      "Authenticated GSC exact-query Pages report, last 28 complete days compared with previous 28 complete days, transcribed 2026-09-24. Canonical replacement appeared at position 10.2 for 13 impressions; legacy /hair-patch/ retained historical signals only.",
  },
  "hair wig in bhubaneswar": {
    clicks_28d: "0",
    impressions_28d: "4",
    position_28d: "12",
    clicks_previous_28d: "1",
    impressions_previous_28d: "18",
    position_previous_28d: "6.8",
    current_page: "https://www.radianceclinics.com/non-surgical-hair-replacement-bhubaneswar",
    source_window:
      "Authenticated GSC exact-query report, last 28 complete days compared with previous 28 complete days, transcribed 2026-09-24.",
  },
  "hair transplant in rourkela": {
    clicks_28d: "0",
    impressions_28d: "18",
    position_28d: "7.8",
    clicks_previous_28d: "0",
    impressions_previous_28d: "9",
    position_previous_28d: "12.2",
    source_window:
      "Authenticated GSC exact-query report, last 28 complete days compared with previous 28 complete days, transcribed 2026-09-24.",
  },
  "hair transplant in bhubaneswar": {
    clicks_28d: "5",
    impressions_28d: "601",
    position_28d: "5.4",
    clicks_previous_28d: "15",
    impressions_previous_28d: "631",
    position_previous_28d: "8.2",
    current_page: "https://www.radianceclinics.com/",
    source_window:
      "Authenticated GSC exact-query Pages report, last 28 complete days compared with previous 28 complete days, transcribed 2026-09-24. The homepage remains the observed query owner; the dedicated page is a supporting commercial destination.",
  },
};

function valueOrBlank(value) {
  return String(value ?? "").trim();
}

function numericOrBlank(value) {
  const raw = valueOrBlank(value);
  return raw ? numberValue(raw) : "";
}

function targetForQuery(query) {
  const normalized = query.toLowerCase();
  if (/radiance/.test(normalized)) return "/";
  if (/hair\s*(patch|wig|system)|non.?surgical hair replacement/.test(normalized)) {
    return "/non-surgical-hair-replacement-bhubaneswar";
  }
  if (/hair transplant.*rourkela|rourkela.*hair transplant/.test(normalized)) {
    return "/hair-transplant-rourkela";
  }
  if (/fue/.test(normalized)) return "/treatments/hair-restoration/fue-hair-transplant";
  if (/\b(prp|gfc)\b/.test(normalized)) {
    return "/treatments/hair-restoration/prp-gfc-scalp-therapy";
  }
  if (/alopecia/.test(normalized)) return "/alopecia-areata-treatment-bhubaneswar";
  if (/dandruff|scalp/.test(normalized)) return "/concerns/hair-loss-scalp/dandruff";
  if (/hairline|crown|male pattern/.test(normalized)) {
    return "/concerns/hair-loss-scalp/male-pattern-hair-loss";
  }
  if (/beard/.test(normalized)) return "/concerns/hair-transplant/beard-transplant";
  if (/transplant/.test(normalized)) return "/hair-transplant-bhubaneswar";
  return "/hair-loss-clinic-bhubaneswar";
}

function actionForQuery(query, targetPage, classification) {
  if (targetPage === "/") {
    return "Preserve the homepage as the observed owner for this branded query and maintain clear links to the relevant hair treatment pathways.";
  }
  if (targetPage === "/non-surgical-hair-replacement-bhubaneswar") {
    return "Strengthen the canonical hair patch and wig page, keep legacy redirects one hop, and inspect the canonical URL after deployment.";
  }
  if (targetPage === "/hair-transplant-rourkela") {
    return "Preserve the verified Rourkela travel page, maintain the contextual Bhubaneswar clinic link, and inspect the exact page only after a material query decline.";
  }
  if (classification === "CTR_PROBLEM") {
    return "Review the exact query-page snippet before changing a protected title or H1; preserve the established query owner unless evidence shows a mismatch.";
  }
  if (targetPage.includes("prp-gfc")) {
    return "Strengthen the existing PRP and GFC treatment page with related guides and doctor video context; do not create synonym pages.";
  }
  if (targetPage.includes("hair-transplant")) {
    return "Strengthen the existing hair transplant owner with relevant internal links, results and decision content; do not create a keyword-variant URL.";
  }
  return "Strengthen the existing hair-loss owner with concern, guide and doctor-answer links; use URL Inspection only for a confirmed indexation question.";
}

function priorityForQuery(query, currentClicks, previousClicks, currentImpressions) {
  const normalized = query.toLowerCase();
  if (/hair\s*(patch|wig)/.test(normalized)) return "P0";
  if (/hair transplant|hair clinic|hair doctor|hair specialist/.test(normalized)) {
    return previousClicks > currentClicks || currentImpressions >= 100 ? "P0" : "P1";
  }
  return currentImpressions >= 100 ? "P1" : "P2";
}

function inferredClassification(query, row, mappedClassification) {
  if (mappedClassification) return mappedClassification;
  const clicks = numericOrBlank(row.clicks_28d);
  const previousClicks = numericOrBlank(row.clicks_previous_28d);
  const impressions = numericOrBlank(row.impressions_28d);
  const previousImpressions = numericOrBlank(row.impressions_previous_28d);
  const position = numericOrBlank(row.position_28d);
  const previousPosition = numericOrBlank(row.position_previous_28d);
  if (previousImpressions === 0 && impressions > 0) return "NEW_QUERY_DISCOVERY";
  if (previousClicks > clicks && previousImpressions > impressions) {
    return "TRAFFIC_DECLINE_REQUIRES_QUERY_PAGE_REVIEW";
  }
  if (position && previousPosition && position - previousPosition >= 3) {
    return "POSITION_DECLINE_REQUIRES_QUERY_PAGE_REVIEW";
  }
  if (impressions >= 50 && position > 0 && position <= 10 && clicks === 0) {
    return "CTR_PROBLEM";
  }
  return "MONITOR";
}

function queryRows(currentQueries, actionQueue) {
  const actionByQuery = new Map(
    actionQueue.map((row) => [valueOrBlank(row.query).toLowerCase(), row]),
  );

  return currentQueries
    .filter((row) => hairQueryPattern.test(valueOrBlank(row.query)))
    .map((row) => {
      const query = valueOrBlank(row.query);
      const override = freshQueryOverrides[query.toLowerCase()];
      const observed = { ...row, ...override };
      const action = actionByQuery.get(query.toLowerCase());
      const currentClicks = numericOrBlank(observed.clicks_28d);
      const previousClicks = numericOrBlank(observed.clicks_previous_28d);
      const currentImpressions = numericOrBlank(observed.impressions_28d);
      const previousImpressions = numericOrBlank(observed.impressions_previous_28d);
      const targetPage = /radiance/i.test(query)
        ? "/"
        : valueOrBlank(action?.target_page) || targetForQuery(query);
      const classification = inferredClassification(query, observed, valueOrBlank(action?.classification));
      const ctrChange =
        numericOrBlank(observed.ctr_28d) === "" || numericOrBlank(observed.ctr_previous_28d) === ""
          ? ""
          : Number(
              (
                Number(numericOrBlank(observed.ctr_28d)) -
                Number(numericOrBlank(observed.ctr_previous_28d))
              ).toFixed(2),
            );

      return {
        query,
        old_page: valueOrBlank(action?.old_page),
        current_page: valueOrBlank(override?.current_page) || valueOrBlank(action?.current_page),
        old_clicks_28d: previousClicks,
        current_clicks_28d: currentClicks,
        old_impressions_28d: previousImpressions,
        current_impressions_28d: currentImpressions,
        old_position_28d: numericOrBlank(observed.position_previous_28d),
        current_position_28d: numericOrBlank(observed.position_28d),
        ctr_change_percentage_points: ctrChange,
        clicks_7d: numericOrBlank(observed.clicks_7d),
        impressions_7d: numericOrBlank(observed.impressions_7d),
        position_7d: numericOrBlank(observed.position_7d),
        probable_cause: classification,
        target_page: targetPage,
        required_action: actionForQuery(query, targetPage, classification),
        priority: priorityForQuery(query, currentClicks || 0, previousClicks || 0, currentImpressions || 0),
        pre_migration_data: "No direct migration-period export available in current authenticated GSC session",
        source_window: override?.source_window || gscSourceWindow,
        checked_at: checkedAt,
      };
    })
    .sort(
      (left, right) =>
        String(left.priority).localeCompare(String(right.priority)) ||
        Number(right.old_clicks_28d || 0) - Number(left.old_clicks_28d || 0) ||
        Number(right.current_impressions_28d || 0) - Number(left.current_impressions_28d || 0),
    );
}

const hairIndexationRows = [
  ["/", "Protected homepage query owner", "P0", "standard"],
  ["/treatments/hair-restoration", "Hair restoration hub", "P0", "standard"],
  ["/hair-loss-clinic-bhubaneswar", "Hair loss commercial owner", "P0", "standard"],
  ["/hair-transplant-bhubaneswar", "Hair transplant commercial page", "P0", "standard"],
  ["/non-surgical-hair-replacement-bhubaneswar", "Hair patch and wig canonical owner", "P0", "standard"],
  ["/treatments/hair-restoration/fue-hair-transplant", "FUE planning page", "P0", "standard"],
  ["/treatments/hair-restoration/prp-gfc-scalp-therapy", "PRP and GFC treatment page", "P0", "standard"],
  ["/treatments/hair-restoration/advanced-hair-fall-solutions", "Hair fall treatment page", "P1", "standard"],
  ["/alopecia-areata-treatment-bhubaneswar", "Alopecia assessment page", "P1", "standard"],
  ["/hair-transplant-rourkela", "Verified Rourkela travel page", "P1", "standard"],
  ["/concerns/hair-loss-scalp/male-pattern-hair-loss", "Male pattern hair loss concern", "P1", "standard"],
  ["/concerns/hair-loss-scalp/female-pattern-hair-loss", "Female pattern hair loss concern", "P1", "standard"],
  ["/concerns/hair-loss-scalp/receding-hairline", "Receding hairline concern", "P1", "standard"],
  ["/concerns/hair-loss-scalp/dandruff", "Dandruff and scalp concern", "P2", "standard"],
  ["/concerns/hair-transplant/beard-transplant", "Beard transplant concern", "P2", "standard"],
  ["/knowledge/hair-loss-causes-and-assessment", "Hair loss education guide", "P1", "standard"],
  ["/knowledge/hair-transplant-aftercare", "Hair transplant aftercare guide", "P1", "standard"],
  ["/knowledge/hair-transplant-cost-factors", "Hair transplant cost guide", "P1", "standard"],
  ["/knowledge/prp-gfc-hair-restoration-guide", "PRP and GFC guide", "P1", "standard"],
];

async function loadVerifiedVideoWatchRows() {
  const [watchPageSource, youtubeSource] = await Promise.all([
    readFile("src/data/video-watch-pages.ts", "utf8"),
    readFile("src/data/youtube-library.generated.ts", "utf8"),
  ]);
  const selectedPages = Array.from(
    watchPageSource.matchAll(
      /slug: "([^"]+)",\s+videoId: "([^"]+)",/g,
    ),
    ([, slug, videoId]) => ({ slug, videoId }),
  );
  const start = youtubeSource.indexOf("[", youtubeSource.indexOf("export const youtubeVideos"));
  const end = youtubeSource.lastIndexOf("] satisfies YouTubeVideo[]");
  const videos = JSON.parse(youtubeSource.slice(start, end + 1));
  const videoById = new Map(videos.map((video) => [video.videoId, video]));

  return selectedPages.map((page) => {
    const video = videoById.get(page.videoId);
    if (!video) throw new Error(`Missing verified YouTube video ${page.videoId}`);
    return { ...page, video };
  });
}

async function build() {
  const [currentQueries, actionQueue, inspections, hairVideoWatchPages] = await Promise.all([
    readCsv("seo/gsc-current-queries.csv"),
    readCsv("seo/query-action-queue.csv"),
    readCsv("seo/gsc-url-inspection.csv"),
    loadVerifiedVideoWatchRows(),
  ]);
  const inspectionByPath = new Map(
    inspections.map((row) => {
      const url = new URL(row.url);
      return [url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, ""), row];
    }),
  );

  await writeCsv(
    "seo/hair-query-recovery.csv",
    [
      "query",
      "old_page",
      "current_page",
      "old_clicks_28d",
      "current_clicks_28d",
      "old_impressions_28d",
      "current_impressions_28d",
      "old_position_28d",
      "current_position_28d",
      "ctr_change_percentage_points",
      "clicks_7d",
      "impressions_7d",
      "position_7d",
      "probable_cause",
      "target_page",
      "required_action",
      "priority",
      "pre_migration_data",
      "source_window",
      "checked_at",
    ],
    queryRows(currentQueries, actionQueue),
  );

  await writeCsv(
    "seo/hair-indexation-recovery.csv",
    [
      "url",
      "role",
      "priority",
      "sitemap",
      "gsc_index_status",
      "last_crawl",
      "crawled_as",
      "crawl_allowed",
      "fetch_result",
      "indexing_allowed",
      "user_canonical",
      "google_canonical",
      "next_action",
      "evidence",
      "checked_at",
    ],
    hairIndexationRows.map(([path, role, priority, sitemap]) => {
      const inspection = inspectionByPath.get(path);
      const url = `https://www.radianceclinics.com${path === "/" ? "/" : path}`;
      return {
        url,
        role,
        priority,
        sitemap,
        gsc_index_status: inspection?.index_status || "URL_INSPECTION_REQUIRED",
        last_crawl: inspection?.last_crawl || "",
        crawled_as: inspection?.crawled_as || "",
        crawl_allowed: inspection?.crawl_allowed || "",
        fetch_result: inspection?.fetch_result || "",
        indexing_allowed: inspection?.indexing_allowed || "",
        user_canonical: inspection?.user_canonical || "",
        google_canonical: inspection?.google_canonical || "",
        next_action: inspection
          ? "Retain current technical configuration and monitor query/page performance."
          : "Use URL Inspection after deployment; do not treat absence from this CSV as non-indexed.",
        evidence: inspection
          ? inspection.source
          : "No direct GSC URL Inspection record is available in the repository.",
        checked_at: inspection?.checked_at || checkedAt,
      };
    }),
  );

  await writeCsv(
    "seo/video-indexing-recovery.csv",
    [
      "watch_page",
      "video_id",
      "video_title",
      "topic",
      "page_indexed",
      "video_detected",
      "video_indexed",
      "reason_or_next_action",
      "sitemap",
      "checked_at",
    ],
    hairVideoWatchPages.map((page) => ({
      watch_page: `https://www.radianceclinics.com/videos/${page.slug}`,
      video_id: page.video.videoId,
      video_title: page.video.title,
      topic: page.video.primaryTopic,
      page_indexed: "PENDING_DEPLOYMENT_AND_INSPECTION",
      video_detected: "PENDING_VIDEO_INDEXING_REPORT",
      video_indexed: "PENDING_VIDEO_INDEXING_REPORT",
      reason_or_next_action: "Deploy first, then inspect selected P0 pages in Search Console. Do not infer video index status from an embedded player.",
      sitemap: "https://www.radianceclinics.com/video-sitemap.xml",
      checked_at: checkedAt,
    })),
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
