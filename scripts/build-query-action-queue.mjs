import { readFile, writeFile } from "node:fs/promises";

const inputPath = "seo/2026-09-ranking-recovery.csv";
const outputPath = "seo/query-action-queue.csv";

function parseCsvRow(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvRow(lines.shift() || "");
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvRow(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function classify(row) {
  const query = row.query.toLowerCase();
  const evidence = `${row.problem_type} ${row.mapping_evidence}`.toLowerCase();
  const current = row.current_url || "";
  const target = row.target_page || "";
  const clickLoss = Math.max(0, number(row.previous_clicks) - number(row.current_clicks));
  const positionChange = number(row.position_change);
  const ctrChange = number(row.ctr_change_percentage_points);

  if (/cannibal|ownership split/.test(evidence)) return "CANNIBALISATION";
  if (current && target && !current.endsWith(target) && /old|non-preferred|redirect|mismatch/.test(evidence)) {
    return "WRONG_PAGE_RANKING";
  }
  if (/migration|redirect/.test(evidence)) return "MIGRATION_REDIRECT_LOSS";
  if (/hair patch|hair wig/.test(query)) return "CONTENT_GAP";
  if (/near me|bhubaneswar/.test(query) && /local|gbp/.test(evidence)) return "LOCAL_GBP_PROBLEM";
  if (clickLoss > 0 && positionChange < 2 && ctrChange < 0) return "CTR_PROBLEM";
  if (!number(row.previous_impressions) && number(row.current_impressions)) return "NEW_QUERY_DISCOVERY";
  if (positionChange >= 3 && clickLoss > 0) return "WRONG_PAGE_RANKING";
  return "NORMAL_VOLATILITY";
}

const input = await readFile(inputPath, "utf8");
const rows = parseCsv(input)
  .filter((row) => row.query)
  .map((row) => {
    const lostClicks = Math.max(0, number(row.previous_clicks) - number(row.current_clicks));
    const classification = classify(row);
    return {
      query: row.query,
      classification,
      old_page: row.previous_url,
      current_page: row.current_url,
      target_page: row.target_page,
      lost_clicks: lostClicks,
      old_clicks: row.previous_clicks,
      current_clicks: row.current_clicks,
      old_impressions: row.previous_impressions,
      current_impressions: row.current_impressions,
      old_position: row.previous_position,
      current_position: row.current_position,
      ctr_change_percentage_points: row.ctr_change_percentage_points,
      required_action: row.recommended_action,
      priority: row.priority,
      evidence: row.mapping_evidence,
      source_window: row.window,
      checked_at: row.checked_at,
    };
  })
  .sort(
    (left, right) =>
      ({ P0: 0, P1: 1, P2: 2, P3: 3 }[left.priority] ?? 9) -
        ({ P0: 0, P1: 1, P2: 2, P3: 3 }[right.priority] ?? 9) ||
      right.lost_clicks - left.lost_clicks ||
      left.query.localeCompare(right.query),
  );

const headers = [
  "query",
  "classification",
  "old_page",
  "current_page",
  "target_page",
  "lost_clicks",
  "old_clicks",
  "current_clicks",
  "old_impressions",
  "current_impressions",
  "old_position",
  "current_position",
  "ctr_change_percentage_points",
  "required_action",
  "priority",
  "evidence",
  "source_window",
  "checked_at",
];

await writeFile(
  outputPath,
  `${[headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`,
);
console.log(`Query action queue written for ${rows.length} Search Console query records.`);
