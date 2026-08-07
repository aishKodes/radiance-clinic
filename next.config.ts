import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalOrigin, legacyRedirects } from "./src/lib/seo-config";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const isVercelPreview =
  Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const apiImagePattern = (() => {
  if (!apiBaseUrl) return null;

  try {
    const url = new URL(apiBaseUrl);

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      pathname: "/**",
    };
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async headers() {
    if (!isVercelPreview) return [];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "radianceclinics.com" }],
        destination: `${canonicalOrigin}/:path*`,
        permanent: true,
      },
      ...legacyRedirects,
    ];
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1280, 1600, 1920],
    imageSizes: [32, 44, 64, 96, 128, 192, 256, 384, 512, 768],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "api.radianceclinics.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.radianceclinics.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "radianceclinics.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      ...(apiImagePattern ? [apiImagePattern] : []),
    ],
  },
};

export default nextConfig;
