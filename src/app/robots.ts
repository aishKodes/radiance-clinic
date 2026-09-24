import type { MetadataRoute } from "next";
import { canonicalOrigin } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  const isVercelPreview =
    Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

  if (isVercelPreview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: [
      `${canonicalOrigin}/sitemap.xml`,
      `${canonicalOrigin}/video-sitemap.xml`,
    ],
    host: canonicalOrigin,
  };
}
