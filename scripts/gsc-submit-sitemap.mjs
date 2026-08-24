import process from "node:process";

const siteUrl = process.env.GSC_SITE_URL || "https://www.radianceclinics.com/";
const sitemapUrl = process.env.GSC_SITEMAP_URL || "https://www.radianceclinics.com/sitemap.xml";
const accessToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN;

async function main() {
  const response = await fetch(sitemapUrl, { redirect: "manual" });
  if (!response.ok || !/xml/i.test(response.headers.get("content-type") || "")) {
    throw new Error(`${sitemapUrl} is not a fetchable XML sitemap (${response.status}).`);
  }

  if (!accessToken) {
    throw new Error("Set GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN to submit through the Search Console API. The command verified the live sitemap but did not submit it.");
  }

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const submission = await fetch(endpoint, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!submission.ok) throw new Error(`Search Console sitemap submission failed (${submission.status}): ${await submission.text()}`);
  console.log(`Submitted ${sitemapUrl} for ${siteUrl}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
