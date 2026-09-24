import { hairVideoWatchPages } from "@/data/video-watch-pages";
import { absoluteUrl } from "@/lib/seo-config";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const urls = hairVideoWatchPages
    .map((page) => {
      const video = page.video;
      const duration = video.durationSeconds
        ? `\n      <video:duration>${video.durationSeconds}</video:duration>`
        : "";
      const publicationDate = video.publishedAt
        ? `\n      <video:publication_date>${escapeXml(video.publishedAt)}</video:publication_date>`
        : "";
      const viewCount = video.viewCount
        ? `\n      <video:view_count>${video.viewCount}</video:view_count>`
        : "";

      return `  <url>\n    <loc>${absoluteUrl(`/videos/${page.slug}`)}</loc>\n    <video:video>\n      <video:title>${escapeXml(video.title)}</video:title>\n      <video:description>${escapeXml(page.pageDescription)}</video:description>\n      <video:thumbnail_loc>${escapeXml(video.thumbnail)}</video:thumbnail_loc>\n      <video:player_loc>${escapeXml(`https://www.youtube-nocookie.com/embed/${video.videoId}`)}</video:player_loc>${duration}${publicationDate}${viewCount}\n      <video:uploader>${escapeXml(video.channelTitle)}</video:uploader>\n    </video:video>\n  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
