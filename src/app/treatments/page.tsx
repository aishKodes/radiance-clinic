import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TreatmentCard } from "@/components/TreatmentCard";
import { getTreatments } from "@/data/site";
import { webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Explore doctor-led hair restoration, skin, laser and aesthetic treatments at Radiance Clinics, Bhubaneswar.",
  alternates: {
    canonical: "/treatments",
  },
};

export default async function TreatmentsPage() {
  const treatments = await getTreatments();
  const clusters = Array.from(
    new Map(
      treatments.map((treatment) => [
        treatment.cluster,
        treatment.clusterLabel,
      ]),
    ).entries(),
  );

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Treatments at Radiance Clinics",
          description:
            "Doctor-led skin, laser, hair restoration and aesthetic care in Bhubaneswar.",
          path: "/treatments",
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <SectionHeader
              eyebrow="Treatment options"
              title="Treatments planned around your concern."
              description="Explore doctor-led care across hair restoration, skin, laser and aesthetic dermatology. Every treatment pathway begins with an assessment of suitability."
            />
            <div className="mt-10 flex flex-wrap gap-3">
              {clusters.map(([slug, label]) => (
                <a
                  key={slug}
                  href={`#${slug}`}
                  className="rounded-full border border-[#151515]/10 bg-white/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#151515]/58 backdrop-blur transition hover:border-[#B78A4A]/50 hover:text-[#151515]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-20">
          {clusters.map(([cluster, label]) => (
            <div key={cluster} id={cluster} className="scroll-mt-32">
              <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#1E6F86]">
                    {label}
                  </p>
                  <h2 className="font-serif text-5xl leading-none text-[#151515]">
                    {label}
                  </h2>
                </div>
                <PremiumButton href="/contact" variant="outline">
                  Discuss suitability
                </PremiumButton>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {treatments
                  .filter((treatment) => treatment.cluster === cluster)
                  .map((treatment) => (
                    <TreatmentCard key={treatment.slug} treatment={treatment} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
