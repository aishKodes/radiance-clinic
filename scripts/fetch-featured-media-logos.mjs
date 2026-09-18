import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const destinationDirectory = path.join(process.cwd(), "public", "media-outlets");

const logos = [
  {
    filename: "hindustan-bytes.webp",
    sourceUrl: "https://hindustanbytes.com/uploads/logo/logo_685e399ef3d593.png",
  },
  {
    filename: "entrepreneur-hunt.webp",
    sourceUrl: "https://entrepreneurhunt.com/uploads/logo/logo_677ff553f23d23.png",
  },
  {
    filename: "hindustan-metro.webp",
    sourceUrl: "https://hindustanmetro.com/uploads/logo/favicon_69e4bdc74db0a5-24556124.png",
  },
  {
    filename: "loktej-business-news.webp",
    sourceUrl: "https://english.loktej.com/media/2023-02/loktej-english-new-square-logo.jpg",
  },
];

await mkdir(destinationDirectory, { recursive: true });

for (const logo of logos) {
  const response = await fetch(logo.sourceUrl, {
    headers: { "user-agent": "RadianceClinicsMediaImport/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch ${logo.sourceUrl}: ${response.status}`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  const optimized = await sharp(source, { failOn: "none" })
    .resize({ width: 280, height: 128, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toBuffer();

  await writeFile(path.join(destinationDirectory, logo.filename), optimized);
  console.log(`Wrote public/media-outlets/${logo.filename}`);
}
