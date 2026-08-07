import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { HairPlanningEstimator } from "@/components/HairPlanningEstimator";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TreatmentCard } from "@/components/TreatmentCard";
import {
  treatmentHubBySlug,
  treatmentHubs,
} from "@/data/search-taxonomy";
import { getArticles, getConditions, getTreatments } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/schema";

type Props = { params: Promise<{ cluster: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return treatmentHubs.map((hub) => ({ cluster: hub.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster } = await params;
  const hub = treatmentHubBySlug.get(cluster as never);
  if (!hub) return { title: "Treatment category" };
  return pageMetadata({
    title: hub.metaTitle,
    description: hub.metaDescription,
    path: `/treatments/${hub.slug}`,
  });
}

export default async function TreatmentCategoryPage({ params }: Props) {
  const { cluster } = await params;
  const hub = treatmentHubBySlug.get(cluster as never);
  if (!hub) notFound();

  const [treatments, conditions, articles] = await Promise.all([
    getTreatments(),
    getConditions(),
    getArticles(),
  ]);
  const path = `/treatments/${hub.slug}`;
  const selectedTreatments = treatments.filter((item) =>
    hub.treatmentPaths.includes(`/treatments/${item.cluster}/${item.slug}`),
  );
  const relatedItems = [
    ...conditions
      .filter((item) => hub.conditionPaths.includes(`/conditions/${item.slug}`))
      .map((item) => ({
        href: `/conditions/${item.slug}`,
        label: item.title,
        description: item.summary,
      })),
    ...articles
      .filter((item) => hub.articlePaths.includes(`/knowledge/${item.slug}`))
      .map((item) => ({
        href: `/knowledge/${item.slug}`,
        label: item.title,
        description: item.excerpt,
      })),
    {
      href: hub.resultsHref,
      label: "Consent-confirmed treatment results",
      description:
        "Review before and after comparisons with outcome variability stated clearly.",
    },
    {
      href: "/locations",
      label: "Visiting the Bhubaneswar clinic",
      description:
        "Find verified clinic details and guidance for patients travelling from elsewhere in Odisha.",
    },
  ];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Treatments", path: "/treatments" },
    { name: hub.label, path },
  ];

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          title: hub.title,
          description: hub.metaDescription,
          path,
          itemPaths: hub.treatmentPaths,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <section className="bg-[var(--mist)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">
              {hub.eyebrow}
            </p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              {hub.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">
              {hub.summary}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href="/contact">Book consultation</PremiumButton>
              <PremiumButton href={hub.commercialPaths[0]} variant="outline">
                Local treatment information
              </PremiumButton>
            </div>
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 text-base leading-8 text-[var(--ink)]/68">
            {hub.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div>
            <h2 className="font-serif text-4xl text-[var(--ink)]">
              What the consultation considers
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {hub.decisionPoints.map((item) => (
                <li key={item} className="flex gap-3 border-t border-[var(--ink)]/12 py-4 text-sm leading-6 text-[var(--ink)]/72">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bronze)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Treatment pathways</p>
              <h2 className="mt-4 font-serif text-4xl text-[var(--ink)] sm:text-5xl">Options to discuss after assessment</h2>
            </div>
            <Link href="/treatments" className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ink)]">
              All treatments <ArrowUpRight className="h-4 w-4 text-[var(--bronze)]" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {selectedTreatments.map((treatment) => (
              <TreatmentCard key={treatment.slug} treatment={treatment} />
            ))}
          </div>
        </div>
      </section>

      {hub.slug === "hair-restoration" ? <HairPlanningEstimator /> : null}

      <RelatedContent
        eyebrow="Conditions, guides and results"
        title="Choose the next useful page for your concern."
        items={relatedItems}
      />
    </>
  );
}
