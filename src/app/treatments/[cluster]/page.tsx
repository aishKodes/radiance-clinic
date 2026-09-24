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
import { hairVideoWatchPages } from "@/data/video-watch-pages";
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
  const hairResearchItems = hub.slug === "hair-restoration"
    ? [
        {
          href: "/hair-transplant-bhubaneswar",
          label: "Hair transplant in Bhubaneswar",
          description: "Compare transplant planning, donor assessment, recovery and realistic expectations with a doctor-led clinic.",
        },
        {
          href: "/hair-loss-clinic-bhubaneswar",
          label: "Hair loss assessment in Bhubaneswar",
          description: "Understand how progressive thinning and shedding are assessed before a treatment pathway is recommended.",
        },
        {
          href: "/non-surgical-hair-replacement-bhubaneswar",
          label: "Hair patch and non-surgical replacement",
          description: "Explore hair-system and hair-patch options, maintenance needs and how they compare with other approaches.",
        },
        {
          href: "/concerns/hair-loss-scalp/male-pattern-hair-loss",
          label: "Male pattern hair loss and crown thinning",
          description: "Understand progressive temple, frontal and crown thinning before comparing options.",
        },
        {
          href: "/concerns/hair-loss-scalp/female-pattern-hair-loss",
          label: "Female hair loss and widening part",
          description: "Review the assessment questions for gradual density changes and a widening part.",
        },
        {
          href: "/concerns/hair-loss-scalp/receding-hairline",
          label: "Receding hairline guidance",
          description: "Explore why a changing hairline needs long-term planning, not a fixed graft number.",
        },
        {
          href: "/concerns/hair-loss-scalp/dandruff",
          label: "Dandruff and flaky scalp guidance",
          description: "Learn when ongoing scalp scale, redness or itch needs assessment.",
        },
        {
          href: "/concerns/hair-transplant/beard-transplant",
          label: "Beard and moustache transplant guidance",
          description: "Understand the planning questions for selected facial-hair restoration concerns.",
        },
        {
          href: "/concerns/hair-transplant/hairline-design",
          label: "Hairline design guidance",
          description: "Review why facial proportion, donor limits and future hair loss matter in design.",
        },
      ]
    : [];
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

      {hairResearchItems.length ? (
        <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
                Hair concerns and planning
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
                Start with the concern, then compare the appropriate pathway.
              </h2>
            </div>
            <div className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {hairResearchItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group border-t border-[var(--ink)]/14 py-5"
                >
                  <h3 className="text-xl font-extrabold text-[var(--ink)] transition group-hover:text-[var(--aqua)]">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink)]/64">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hub.slug === "hair-restoration" ? (
        <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Official video guides
            </p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Watch a doctor-led explanation before consultation.
            </h2>
            <div className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {hairVideoWatchPages.slice(0, 6).map((page) => (
                <Link
                  key={page.slug}
                  href={`/videos/${page.slug}`}
                  className="group border-t border-[var(--ink)]/14 py-5"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                    {page.video.primaryTopic}
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold leading-7 text-[var(--ink)] transition group-hover:text-[var(--aqua)]">
                    {page.pageTitle}
                  </h3>
                </Link>
              ))}
            </div>
            <Link
              href="/videos#hair-restoration-video-guides"
              className="mt-8 inline-flex text-sm font-extrabold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
            >
              Browse all hair restoration video guides
            </Link>
          </div>
        </section>
      ) : null}

      <RelatedContent
        eyebrow="Conditions, guides and results"
        title="Choose the next useful page for your concern."
        items={relatedItems}
      />
    </>
  );
}
