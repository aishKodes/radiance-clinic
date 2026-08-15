import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClinicalContentSections } from "@/components/ClinicalContentSections";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { RelatedVideos } from "@/components/RelatedVideos";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TreatmentCard } from "@/components/TreatmentCard";
import {
  getTreatment,
  getTreatments,
  getTreatmentStaticParams,
} from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { relationshipsFor } from "@/data/search-taxonomy";
import { videosForPath } from "@/data/video-library";
import {
  breadcrumbJsonLd,
  medicalServiceJsonLd,
  videoObjectJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

type Props = {
  params: Promise<{ cluster: string; slug: string }>;
};

export async function generateStaticParams() {
  return getTreatmentStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster, slug } = await params;
  const treatment = await getTreatment(cluster, slug);

  if (!treatment) {
    return {
      title: "Treatment",
    };
  }

  return pageMetadata({
    title:
      treatment.seoTitle ||
      `${treatment.title} in Bhubaneswar | Radiance Clinics`,
    description: treatment.seoDescription || treatment.summary,
    path: `/treatments/${cluster}/${slug}`,
    image: treatment.image?.src,
    imageAlt: treatment.image?.alt,
  });
}

export default async function TreatmentDetailPage({ params }: Props) {
  const { cluster, slug } = await params;
  const treatment = await getTreatment(cluster, slug);

  if (!treatment) {
    notFound();
  }

  const Icon = treatment.icon;
  const treatments = await getTreatments();
  const related = treatments
    .filter(
      (item) =>
        item.cluster === treatment.cluster && item.slug !== treatment.slug,
    )
    .slice(0, 3);
  const path = `/treatments/${cluster}/${slug}`;
  const videos = videosForPath(path, 2);
  const relationships = relationshipsFor(path);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Treatments", path: "/treatments" },
    { name: treatment.clusterLabel, path: relationships?.hub || `/treatments#${cluster}` },
    { name: treatment.title, path },
  ];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: treatment.title,
          description: treatment.summary,
          path,
        })}
      />
      {videos.map((video) => <JsonLd key={video.videoId} data={videoObjectJsonLd(video)} />)}
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={medicalServiceJsonLd({
          name: treatment.title,
          description: treatment.summary,
          path,
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#151515]/10 bg-white/46 px-4 py-2 backdrop-blur">
              <Icon className="h-4 w-4 text-[#B78A4A]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#151515]/58">
                {treatment.clusterLabel}
              </span>
            </div>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[#151515]">
              {treatment.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {treatment.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <PremiumButton href="/contact">Book consultation</PremiumButton>
              <PremiumButton href={relationships?.results || "/results"} variant="outline">
                View treatment results
              </PremiumButton>
            </div>
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {[
            ["Typical duration", treatment.duration],
            ["Downtime", treatment.recovery],
            ["Planning style", treatment.eyebrow],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[2rem] border border-[#151515]/10 bg-white/58 p-6 shadow-[0_20px_70px_rgba(21,21,21,0.07)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1E6F86]">
                {label}
              </p>
              <p className="mt-4 font-serif text-4xl leading-none text-[#151515]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F7F1E8] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Ideal for"
              title="Suitability is decided in consultation."
              description="These are common reasons patients ask about this treatment. Final recommendations depend on medical review, skin or scalp assessment and expectations."
            />
            <div className="mt-8 grid gap-3">
              {treatment.idealFor.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-full border border-[#151515]/10 bg-white/48 px-5 py-4 text-sm font-semibold text-[#151515]"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#B78A4A]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-[#151515]/10 bg-[#151515] p-8 text-[#FBF7EF] shadow-[0_34px_100px_rgba(21,21,21,0.16)]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B78A4A]">
              Protocol highlights
            </p>
            <div className="mt-10 space-y-6">
              {treatment.highlights.map((item, index) => (
                <div key={item} className="flex gap-5">
                  <span className="font-serif text-4xl text-[#B78A4A]">
                    0{index + 1}
                  </span>
                  <p className="border-b border-white/10 pb-6 text-lg leading-8 text-[#FBF7EF]/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClinicalContentSections
        sections={[
          { title: "Treatment overview", items: treatment.overview },
          { title: "Who may ask about this treatment", items: treatment.candidateInfo },
          { title: "Procedure planning", items: treatment.procedureSteps },
          { title: "Recovery and timeline", items: [...(treatment.timeline || []), ...(treatment.aftercare || [])] },
          { title: "Limitations and risks", items: [...(treatment.limitations || []), ...(treatment.risks || [])] },
        ]}
        faqs={treatment.faq}
      />

      <RelatedVideos videos={videos} title="Watch this treatment topic before consultation." />

      {related.length ? (
        <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Related protocols"
              title="Continue exploring this treatment family."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TreatmentCard key={item.slug} treatment={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {relationships ? (
        <RelatedContent
          eyebrow="Conditions, guides and results"
          title="Continue with related clinical information."
          items={[
            { href: relationships.hub, label: `${treatment.clusterLabel} overview`, description: "Compare related care pathways and the concerns they address." },
            ...relationships.conditions.map((href) => ({ href, label: href.includes("hair-fall") ? "Hair fall and thinning" : href.includes("acne") ? "Acne and acne scars" : href.includes("pigmentation") ? "Pigmentation and melasma" : "Skin ageing and laxity", description: "Review concern-led guidance before selecting treatment." })),
            ...relationships.articles.map((href) => ({ href, label: "Related patient guide", description: "Read practical preparation and decision-making guidance." })),
            { href: relationships.results, label: "Consent-confirmed treatment results", description: "Review individual comparisons with outcome variability stated clearly." },
            { href: "/locations", label: "Visiting from elsewhere in Odisha", description: "Plan an appointment at the verified Bhubaneswar clinic." },
          ]}
        />
      ) : null}
    </>
  );
}
