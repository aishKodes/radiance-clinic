import type { Metadata } from "next";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { TransformationShowcase } from "@/components/TransformationShowcase";
import {
  hairTransformationExamples,
  skinTransformationExamples,
} from "@/data/homepage-media";
import { webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Hair Transplant & Skin Before and After Results",
  description:
    "Consent-led before and after examples at Radiance Clinics, Bhubaneswar, with realistic clinical context.",
  alternates: {
    canonical: "/before-after",
  },
};

export default function BeforeAfterPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Before and After Case Previews",
          description:
            "Consent-led, context-aware before and after examples at Radiance Clinics.",
          path: "/before-after",
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <SectionHeader
            eyebrow="Before / after"
            title="Before and after images should clarify, not oversell."
            description="Radiance Clinics shares approved case examples with consent, timeline context and realistic discussion. A consultation is required to understand suitability."
          />
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#151515] px-5 py-20 text-[#FBF7EF] sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            {
              title: "Consent-led",
              text: "Patient images are handled with permission and privacy awareness.",
              icon: LockKeyhole,
            },
            {
              title: "Context-first",
              text: "Timeline, angles, diagnosis and treatment plan matter when reviewing outcomes.",
              icon: ShieldCheck,
            },
            {
              title: "No guarantees",
              text: "Results vary by biology, diagnosis, treatment intensity and maintenance.",
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl"
              >
                <Icon className="mb-10 h-6 w-6 text-[#B78A4A]" />
                <h2 className="font-serif text-4xl leading-none">
                  {item.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#FBF7EF]/64">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#151515] px-5 py-20 text-[#FBF7EF] sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <TransformationShowcase
            eyebrow="Hair Transformation Examples"
            title="Hair Transplant Results & Hair Restoration Examples"
            description="Selected hair restoration examples shared with consent. Results vary by individual and consultation is required."
            category="hair"
            transformations={hairTransformationExamples}
          />
          <div className="mt-12">
            <TransformationShowcase
              eyebrow="Skin Improvement Examples"
              title="Skin Improvement Examples"
              description="Selected examples for skin concerns such as acne scars, pigmentation, melasma and rejuvenation, shared with consent."
              category="skin"
              transformations={skinTransformationExamples}
            />
          </div>
          <PremiumButton href="/contact" className="mt-10">
            Discuss case suitability
          </PremiumButton>
        </div>
      </section>
    </>
  );
}
