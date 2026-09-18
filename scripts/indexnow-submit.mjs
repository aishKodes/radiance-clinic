import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const key = process.env.INDEXNOW_KEY?.trim();
const host = "www.radianceclinics.com";
const baseUrl = `https://${host}`;
const rawUrls = process.argv.slice(2).filter(Boolean);

if (!key) {
  throw new Error("Set INDEXNOW_KEY before notifying IndexNow. No URL was submitted.");
}
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  throw new Error("INDEXNOW_KEY must be an 8-128 character verification key.");
}
if (!rawUrls.length) {
  throw new Error("Pass one or more changed canonical paths, for example: npm run indexnow:submit -- /media");
}

const keyFile = path.join(process.cwd(), "public", `${key}.txt`);
await access(keyFile).catch(() => {
  throw new Error(`Create public/${key}.txt containing the exact IndexNow key before submission.`);
});
const keyFileValue = (await readFile(keyFile, "utf8")).trim();
if (keyFileValue !== key) {
  throw new Error(`public/${key}.txt does not contain the configured IndexNow key.`);
}

const urlList = Array.from(
  new Set(
    rawUrls.map((value) => new URL(value, baseUrl).toString()),
  ),
);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${baseUrl}/${key}.txt`, urlList }),
  signal: AbortSignal.timeout(10000),
});
if (!response.ok) {
  throw new Error(`IndexNow notification failed (${response.status}): ${await response.text()}`);
}
console.log(`IndexNow notified for ${urlList.length} changed URL(s).`);
