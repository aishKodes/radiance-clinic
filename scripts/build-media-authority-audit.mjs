import { readFile, writeFile } from "node:fs/promises";

const inputPath = "seo/media-import-records.json";
const outputPath = "seo/media-authority.csv";

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function hasDoctorMention(record) {
  const text = [record.title, record.page_title, record.summary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /dr\.?\s+satyarth|dr\.?\s+satyartha|satyarth/.test(text)
    ? "yes"
    : "not verified";
}

function hasClinicMention(record) {
  const text = [record.title, record.page_title, record.summary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes("radiance") ? "yes" : "not verified";
}

const source = JSON.parse(await readFile(inputPath, "utf8"));
const records = Array.isArray(source.records) ? source.records : [];
const headers = [
  "publication",
  "headline",
  "url",
  "date",
  "doctor_mentioned",
  "clinic_mentioned",
  "topic",
  "backlink_present",
  "backlink_target",
  "recommended_target",
  "priority",
  "verification_status",
  "source_record",
  "audited_at",
];
const rows = records
  .map((record) => ({
    publication: record.outlet_name || record.outlet_hint || "Unidentified outlet",
    headline: record.title || record.page_title || "",
    url: record.canonical_article_url || record.article_url || "",
    date: record.publication_date || record.source_date || "",
    doctor_mentioned: hasDoctorMention(record),
    clinic_mentioned: hasClinicMention(record),
    topic: record.topic_label || record.topic || "",
    backlink_present: record.backlink_present ? "yes" : "no",
    backlink_target: record.current_backlink_target || "",
    recommended_target: record.desired_radiance_target || "",
    priority: record.outreach_priority || "",
    verification_status: record.verification_status || "unverified",
    source_record: record.source || "",
    audited_at: record.audited_at || source.generatedAt || "",
  }))
  .sort((left, right) =>
    left.publication.localeCompare(right.publication) || left.url.localeCompare(right.url),
  );

await writeFile(
  outputPath,
  `${[headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`,
);

console.log(`Media authority audit written for ${rows.length} source records.`);
