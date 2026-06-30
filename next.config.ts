import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
  images: {
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
