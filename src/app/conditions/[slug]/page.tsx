import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClinicalContentSections } from "@/components/ClinicalContentSections";
import { JsonLd } from "@/components/JsonLd";
import { MedicalReview } from "@/components/MedicalReview";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TreatmentCard } from "@/components/TreatmentCard";
import {
  getCondition,
  getConditionStaticParams,
  getTreatments,
} from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { relationshipsFor } from "@/data/search-taxonomy";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getConditionStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const condition = await getCondition(slug);

  if (!condition) {
    return { title: "Condition" };
  }

  return pageMetadata({
    title:
      condition.seoTitle ||
      `${condition.title} Treatment Guidance | Radiance Clinics`,
    description: condition.seoDescription || condition.summary,
    path: `/conditions/${slug}`,
    image: condition.image?.src,
    imageAlt: condition.image?.alt,
  });
}

export default async function ConditionDetailPage({ params }: Props) {
  const { slug } = await params;
  const condition = await getCondition(slug);

  if (!condition) {
    notFound();
  }

  const path = `/conditions/${slug}`;
  const relationships = relationshipsFor(path);
  const treatments = await getTreatments();
  const related = treatments.filter((treatment) => {
    const treatmentPath = `/treatments/${treatment.cluster}/${treatment.slug}`;
    return relationships?.treatments.includes(treatmentPath) ||
      condition.relatedTreatments.includes(treatment.title);
  });
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Conditions", path: "/conditions" },
    { name: condition.title, path },
  ];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: condition.title,
          description: condition.summary,
          path,
          medicalReview: true,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[#151515]">
              {condition.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {condition.summary}
            </p>
            <PremiumButton href="/contact" className="mt-10">
              Book assessment
            </PremiumButton>
            <MedicalReview compact className="mt-8 max-w-3xl" />
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Common signs"
            title="What patients often notice before booking."
            description="These signs are not a diagnosis. They help frame what the consultation should investigate."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {condition.signs.map((sign) => (
              <div
                key={sign}
                className="flex items-center gap-3 rounded-full border border-[#151515]/10 bg-white/58 px-5 py-4 text-sm font-semibold text-[#151515]"
              >
                <CheckCircle2 className="h-5 w-5 text-[#B78A4A]" />
                {sign}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClinicalContentSections
        sections={[
          { title: "Overview", items: condition.overview },
          { title: "Common causes", items: condition.commonCauses },
          { title: "Common types", items: condition.commonTypes },
          { title: "How professional assessment may help", items: condition.assessment },
          { title: "Important limitations", items: condition.limitations },
        ]}
        faqs={condition.faq}
      />

      <section className="bg-[#F7F1E8] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Related treatments"
            title="Possible pathways to discuss with the doctor."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((treatment) => (
              <TreatmentCard key={treatment.slug} treatment={treatment} />
            ))}
          </div>
        </div>
      </section>
      {relationships ? (
        <RelatedContent
          eyebrow="Related guidance and results"
          title="Understand the available pathways before consultation."
          items={[
            { href: relationships.hub, label: "Treatment category overview", description: "Compare related treatment pathways and assessment considerations." },
            ...relationships.articles.map((href) => ({ href, label: "Related patient guide", description: "Read practical guidance connected to this concern." })),
            { href: relationships.results, label: "Relevant treatment results", description: "View consent-confirmed comparisons without guaranteed-outcome claims." },
            ...relationships.commercial.slice(0, 1).map((href) => ({ href, label: "Bhubaneswar consultation information", description: "Review the local consultation approach and clinic pathway." })),
          ]}
        />
      ) : null}
    </>
  );
}
