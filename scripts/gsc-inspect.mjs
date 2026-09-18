import path from "node:path";
import process from "node:process";
import { readCsv } from "./seo-utils.mjs";

const inspectionFile = path.join(process.cwd(), "seo", "gsc-url-inspection.csv");

async function main() {
  const rows = await readCsv(inspectionFile);
  if (!rows.length) throw new Error("No recorded URL Inspection results were found.");

  const missing = rows.filter((row) => !row.url || !row.index_status || !row.checked_at);
  if (missing.length) throw new Error(`${missing.length} URL Inspection rows are incomplete.`);

  const indexed = rows.filter((row) => /^(indexed|url is on google|on google)$/i.test(row.index_status.trim())).length;
  const pending = rows.length - indexed;
  console.log(`Validated ${rows.length} authenticated URL Inspection records: ${indexed} indexed, ${pending} pending or not indexed.`);
  console.log(`Latest recorded check: ${rows.map((row) => row.checked_at).sort().at(-1)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
