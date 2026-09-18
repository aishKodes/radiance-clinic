import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LocalSeoLandingPage } from "@/components/LocalSeoLandingPage";
import { LocationSeoLandingPage } from "@/components/LocationSeoLandingPage";
import { localSeoPageBySlug, localSeoPages } from "@/data/local-seo-pages";
import { indexableLocationPageBySlug, indexableLocationPages } from "@/data/location-pages";
import { getClinicSettings } from "@/data/site";
import {
  breadcrumbJsonLd,
  medicalServiceJsonLd,
  webPageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ seoSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...localSeoPages, ...indexableLocationPages].map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = localSeoPageBySlug.get(seoSlug);
  const locationPage = indexableLocationPageBySlug.get(seoSlug);

  if (!page && !locationPage) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  if (locationPage) {
    return pageMetadata({
      title: locationPage.metaTitle || locationPage.title || locationPage.service,
      description: locationPage.metaDescription || `Verified visit information for ${locationPage.service.toLowerCase()} patients travelling from ${locationPage.city} to Radiance Clinics Bhubaneswar.`,
      path: `/${locationPage.slug}`,
    });
  }

  const path = `/${page!.slug}`;

  return pageMetadata({
    title: page!.metaTitle,
    description: page!.metaDescription,
    path,
    image: page!.image,
    imageAlt: page!.imageAlt,
    index: page!.indexable !== false,
  });
}

export default async function LocalServicePage({ params }: Props) {
  const { seoSlug } = await params;
  const page = localSeoPageBySlug.get(seoSlug);
  const locationPage = indexableLocationPageBySlug.get(seoSlug);

  if (!page && !locationPage) {
    notFound();
  }

  if (locationPage) {
    const path = `/${locationPage.slug}`;
    const title = locationPage.title || locationPage.service;
    const description = locationPage.metaDescription || `Outstation appointment information for patients travelling from ${locationPage.city} to Radiance Clinics Bhubaneswar.`;
    return <>
      <JsonLd data={webPageJsonLd({ title, description, path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: locationPage.city, path }])} />
      <LocationSeoLandingPage page={locationPage} />
    </>;
  }

  const clinic = await getClinicSettings();
  const path = `/${page!.slug}`;

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: page!.metaTitle,
          description: page!.metaDescription,
          path,
          medicalReview: true,
        })}
      />
      <JsonLd
        data={medicalServiceJsonLd({
          name: page!.serviceName,
          description: page!.metaDescription,
          path,
          settings: clinic,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page!.title, path },
        ])}
      />
      <div className="absolute left-5 top-28 z-20 max-w-[calc(100vw-2.5rem)] sm:left-8">
        <Breadcrumbs
          inverse
          items={[
            { name: "Home", path: "/" },
            { name: page!.title, path },
          ]}
        />
      </div>
      <LocalSeoLandingPage page={page!} clinic={clinic} />
    </>
  );
}
