import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TreatmentCard } from "@/components/TreatmentCard";
import {
  getCondition,
  getConditionStaticParams,
  getTreatments,
} from "@/data/site";
import { webPageJsonLd } from "@/lib/schema";

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

  return {
    title: condition.seoTitle || condition.title,
    description: condition.seoDescription || condition.summary,
    alternates: {
      canonical: `/conditions/${slug}`,
    },
  };
}

export default async function ConditionDetailPage({ params }: Props) {
  const { slug } = await params;
  const condition = await getCondition(slug);

  if (!condition) {
    notFound();
  }

  const treatments = await getTreatments();
  const related = treatments.filter((treatment) =>
    condition.relatedTreatments.includes(treatment.title),
  );

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: condition.title,
          description: condition.summary,
          path: `/conditions/${slug}`,
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Link
              href="/conditions"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#151515]/54 transition hover:text-[#151515]"
            >
              <ArrowLeft className="h-4 w-4" />
              Concerns
            </Link>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[#151515]">
              {condition.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {condition.summary}
            </p>
            <PremiumButton href="/contact" className="mt-10">
              Book assessment
            </PremiumButton>
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
    </>
  );
}
