import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { Fraunces, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { BookingModal } from "@/components/BookingModal";
import { DeferredGoogleAnalytics } from "@/components/DeferredGoogleAnalytics";
import { DynamicChatbotDock } from "@/components/DynamicChatbotDock";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { fallbackData } from "@/data/fallback";
import { getAssistantSettings, getClinicSettings } from "@/data/site";
import { canonicalOrigin, defaultSocialImage } from "@/lib/seo-config";
import {
  medicalClinicJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/schema";
import { googleAnalyticsId } from "@/lib/analytics-config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  verification: {
    google: "ij_K80AdENETIUwU-aGsVvf0nUue052w6HNz_nzxcn0",
  },
  title: {
    default: "Radiance Clinics Bhubaneswar | Hair, Skin & Aesthetic Care",
    template: "%s | Radiance Clinics Bhubaneswar",
  },
  description:
    "Doctor-led skin, laser, hair restoration and aesthetic care by Dr. Satyarth Prakash at Radiance Clinics, Bhubaneswar.",
  alternates: { canonical: canonicalOrigin },
  openGraph: {
    title: "Radiance Clinics Bhubaneswar",
    description: fallbackData.siteSettings.tagline,
    type: "website",
    locale: "en_IN",
    siteName: "Radiance Clinics",
    url: canonicalOrigin,
    images: [
      {
        url: defaultSocialImage,
        alt: "Radiance Clinics skin, hair and aesthetic knowledge",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Radiance Clinics Bhubaneswar",
    description:
      "Doctor-led hair, skin, laser and aesthetic care in Bhubaneswar.",
    images: [defaultSocialImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

function publicFile(pathname: string) {
  return path.join(process.cwd(), "public", pathname);
}

function resolveHeaderLogo() {
  const candidates = [
    { url: "/radiance-logo.svg", mode: "primary" as const },
    { url: "/radiance-logo-primary.png", mode: "primary" as const },
    { url: "/radiance-logo-mark.svg", mode: "mark" as const },
    { url: "/radiance-logo-mark.png", mode: "mark" as const },
    { url: "/radiance-logo.png", mode: "mark" as const },
  ];

  return (
    candidates.find((candidate) =>
      existsSync(publicFile(candidate.url.slice(1))),
    ) || null
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [assistantSettings, clinicSettings] = await Promise.all([
    getAssistantSettings(),
    getClinicSettings(),
  ]);
  const headerLogo = resolveHeaderLogo();

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${manrope.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--ivory)] text-[var(--ink)]">
        <JsonLd data={organizationJsonLd(clinicSettings)} />
        <JsonLd data={medicalClinicJsonLd(clinicSettings)} />
        <JsonLd data={websiteJsonLd()} />
        <SiteHeader
          settings={clinicSettings}
          logoUrl={headerLogo?.url}
          logoMode={headerLogo?.mode}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={clinicSettings} />
        <FloatingCTA settings={clinicSettings} />
        <BookingModal settings={clinicSettings} />
        <DynamicChatbotDock settings={assistantSettings} />
        <DeferredGoogleAnalytics measurementId={googleAnalyticsId} />
      </body>
    </html>
  );
}
