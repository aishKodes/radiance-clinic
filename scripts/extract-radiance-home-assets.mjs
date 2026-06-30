#!/usr/bin/env node

import {writeFile} from "node:fs/promises";
import * as cheerio from "cheerio";

const url = process.argv[2] || "https://radianceclinics.com/";
const outputPath =
  process.argv[3] || "radiance-homepage-migration-reference.json";

function absolutize(value, baseUrl) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

const response = await fetch(url, {
  headers: {
    "user-agent":
      "Radiance Clinics migration reference script (non-destructive content inspection)",
  },
});

if (!response.ok) {
  throw new Error(`Could not fetch ${url}: ${response.status} ${response.statusText}`);
}

const html = await response.text();
const $ = cheerio.load(html);

const images = $("img")
  .map((_, element) => {
    const node = $(element);
    return {
      src: absolutize(node.attr("src") || node.attr("data-src"), url),
      alt: node.attr("alt") || "",
      width: node.attr("width") || "",
      height: node.attr("height") || "",
    };
  })
  .get()
  .filter((item) => item.src);

const videos = $("iframe, video, source, a")
  .map((_, element) => {
    const node = $(element);
    const src = node.attr("src") || node.attr("href");
    if (!src || !/(youtube|youtu\.be|vimeo|mp4|video)/i.test(src)) return null;
    return {
      type: element.tagName,
      src: absolutize(src, url),
      title: node.attr("title") || node.text().trim().replace(/\s+/g, " "),
    };
  })
  .get()
  .filter(Boolean);

const headings = $("h1, h2, h3")
  .map((_, element) => ({
    level: element.tagName.toLowerCase(),
    text: $(element).text().trim().replace(/\s+/g, " "),
  }))
  .get()
  .filter((item) => item.text);

const links = $("a")
  .map((_, element) => {
    const node = $(element);
    return {
      text: node.text().trim().replace(/\s+/g, " "),
      href: absolutize(node.attr("href"), url),
    };
  })
  .get()
  .filter((item) => item.href && item.text);

const result = {
  source: url,
  collectedAt: new Date().toISOString(),
  note: "Migration reference only. Review consent and rights before reusing any media.",
  counts: {
    images: images.length,
    videos: videos.length,
    headings: headings.length,
    links: links.length,
  },
  images,
  videos,
  headings,
  links,
};

await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
