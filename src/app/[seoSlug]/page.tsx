import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LocalSeoLandingPage } from "@/components/LocalSeoLandingPage";
import { localSeoPageBySlug, localSeoPages } from "@/data/local-seo-pages";
import { getClinicSettings } from "@/data/site";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  medicalClinicJsonLd,
  medicalServiceJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

type Props = {
  params: Promise<{ seoSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localSeoPages.map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = localSeoPageBySlug.get(seoSlug);

  if (!page) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/${page.slug}`;

  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: path,
      type: "website",
      images: [
        {
          url: page.image,
          alt: page.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [page.image],
    },
  };
}

export default async function LocalServicePage({ params }: Props) {
  const { seoSlug } = await params;
  const page = localSeoPageBySlug.get(seoSlug);

  if (!page) {
    notFound();
  }

  const clinic = await getClinicSettings();
  const path = `/${page.slug}`;

  return (
    <>
      <JsonLd data={medicalClinicJsonLd(clinic)} />
      <JsonLd
        data={webPageJsonLd({
          title: page.metaTitle,
          description: page.metaDescription,
          path,
        })}
      />
      <JsonLd
        data={medicalServiceJsonLd({
          name: page.serviceName,
          description: page.metaDescription,
          path,
          settings: clinic,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page.title, path },
        ])}
      />
      <JsonLd data={faqJsonLd(page.faqs)} />
      <LocalSeoLandingPage page={page} clinic={clinic} />
    </>
  );
}
