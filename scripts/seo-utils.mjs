import { readFile, writeFile } from "node:fs/promises";

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    if (row.some(Boolean)) rows.push(row);
  }

  const [headers = [], ...data] = rows;
  return data.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])),
  );
}

export async function readCsv(filePath) {
  return parseCsv(await readFile(filePath, "utf8"));
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(headers, rows) {
  return `${[
    headers,
    ...rows.map((row) => headers.map((header) => row[header] ?? "")),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`;
}

export async function writeCsv(filePath, headers, rows) {
  await writeFile(filePath, toCsv(headers, rows), "utf8");
}

export function normalizeUrlPath(value) {
  if (!value) return "";
  try {
    const url = new URL(value, "https://www.radianceclinics.com");
    const pathname = decodeURI(url.pathname);
    return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  } catch {
    return String(value).replace(/^https?:\/\/(?:www\.)?radianceclinics\.com/i, "").replace(/\/+$/, "") || "/";
  }
}

export function numberValue(value) {
  return Number(String(value || "0").replaceAll(",", "")) || 0;
}

export function percentValue(value) {
  return Number(String(value || "0").replace("%", "")) || 0;
}
