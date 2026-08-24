import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { writeCsv } from "./seo-utils.mjs";

const root = process.cwd();
const port = Number(process.env.LIGHTHOUSE_PORT || 3014);
const externalBase = process.env.LIGHTHOUSE_URL;
const baseUrl = externalBase || `http://127.0.0.1:${port}`;

async function waitForServer() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not become ready at ${baseUrl}`);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

async function audit(formFactor) {
  const outputPath = path.join(root, "seo", `lighthouse-${formFactor}.json`);
  const args = [
    "--yes",
    "lighthouse",
    baseUrl,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${outputPath}`,
  ];
  if (formFactor === "desktop") args.push("--preset=desktop");
  await run("npx", args);
  return JSON.parse(await readFile(outputPath, "utf8"));
}

async function main() {
  const server = externalBase
    ? null
    : spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, PORT: String(port) },
      });

  try {
    await waitForServer();
    const results = [];
    for (const formFactor of ["mobile", "desktop"]) {
      const report = await audit(formFactor);
      const metric = (id) => report.audits[id]?.numericValue || 0;
      results.push({
        form_factor: formFactor,
        performance: Math.round((report.categories.performance?.score || 0) * 100),
        accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
        best_practices: Math.round((report.categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((report.categories.seo?.score || 0) * 100),
        fcp_ms: Math.round(metric("first-contentful-paint")),
        lcp_ms: Math.round(metric("largest-contentful-paint")),
        tbt_ms: Math.round(metric("total-blocking-time")),
        cls: metric("cumulative-layout-shift").toFixed(3),
        speed_index_ms: Math.round(metric("speed-index")),
      });
    }
    await writeCsv(path.join(root, "seo", "lighthouse-summary.csv"), [
      "form_factor", "performance", "accessibility", "best_practices", "seo",
      "fcp_ms", "lcp_ms", "tbt_ms", "cls", "speed_index_ms",
    ], results);
    for (const result of results) {
      console.log(`${result.form_factor}: performance ${result.performance}, accessibility ${result.accessibility}, SEO ${result.seo}, LCP ${result.lcp_ms}ms, TBT ${result.tbt_ms}ms`);
    }
  } finally {
    server?.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
