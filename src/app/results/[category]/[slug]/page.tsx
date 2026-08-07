import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeforeAfterCompare } from "@/components/BeforeAfterCompare";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import {
  getIndexableResultCase,
  indexableResultCases,
} from "@/data/result-cases";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return indexableResultCases.map((item) => ({
    category: item.category,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const item = getIndexableResultCase(category, slug);
  if (!item) return { title: "Result", robots: { index: false, follow: false } };
  return pageMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/results/${category}/${slug}`,
    image: item.afterImage.desktopUrl || item.afterImage.src,
    imageAlt: `${item.conditionName} treatment result at Radiance Clinics Bhubaneswar`,
  });
}

export default async function ResultCasePage({ params }: Props) {
  const { category, slug } = await params;
  const item = getIndexableResultCase(category, slug);
  if (!item) notFound();
  const path = `/results/${category}/${slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Results", path: "/results" },
    { name: category === "hair-transplant" ? "Hair Transplant" : "Skin", path: `/results#${category === "hair-transplant" ? "hair-transplant-results" : "skin-results"}` },
    { name: item.conditionName, path },
  ];

  return <>
    <JsonLd data={webPageJsonLd({ title: item.title, description: item.metaDescription, path })} />
    <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    <section className="bg-[var(--mist)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--aqua)]">Consent-confirmed result</p>
          <h1 className="max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl">{item.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">{item.summary}</p>
        </div>
        <StickyConsultationCard />
      </div>
    </section>
    <section className="bg-[var(--ink)] px-5 py-16 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-4xl">Treatment comparison</h2>
        <div className="mt-8 max-w-2xl">
          <BeforeAfterCompare beforeImage={item.beforeImage} afterImage={item.afterImage} beforeAlt={`${item.conditionName} before treatment at Radiance Clinics Bhubaneswar`} afterAlt={`${item.conditionName} after treatment at Radiance Clinics Bhubaneswar; individual results vary`} label={item.conditionName} viewLabel={item.viewLabel} aspectRatio="4 / 3" />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62">Results vary by individual. Images are shared with consent and should be interpreted in consultation with the doctor.</p>
        <PremiumButton href="/contact" className="mt-8">Discuss suitability</PremiumButton>
      </div>
    </section>
    <RelatedContent title="Understand the treatment and concern." items={[
      { href: item.treatmentHref, label: `About ${item.treatment.toLowerCase()}`, description: "Review suitability, planning and treatment considerations." },
      { href: item.conditionHref, label: item.conditionName, description: "Read concern-led guidance before choosing a treatment." },
      { href: item.guideHref, label: "Patient guide", description: "Continue with related educational guidance." },
      { href: "/results", label: "More patient results", description: "Return to the consent-confirmed results collection." },
    ]} />
  </>;
}
