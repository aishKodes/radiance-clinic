import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { getConditions } from "@/data/site";
import { webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Conditions",
  description:
    "Explore skin, hair and aesthetic concerns treated at Radiance Clinics, Bhubaneswar.",
  alternates: {
    canonical: "/conditions",
  },
};

export default async function ConditionsPage() {
  const conditions = await getConditions();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Conditions",
          description:
            "Concern-led pathways for hair fall, acne scars, pigmentation and skin ageing.",
          path: "/conditions",
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <SectionHeader
            eyebrow="Concerns"
            title="Start with what you are noticing."
            description="Radiance Clinics organizes care around concerns first, then maps suitable treatment options after clinical review."
          />
          <StickyConsultationCard />
        </div>
      </section>
      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {conditions.map((condition) => (
            <Link
              key={condition.slug}
              href={`/conditions/${condition.slug}`}
              className="group rounded-[2rem] border border-[#151515]/10 bg-white/58 p-7 shadow-[0_24px_80px_rgba(21,21,21,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#B78A4A]/45"
            >
              <div className="mb-12 flex justify-between gap-6">
                <span className="rounded-full border border-[#151515]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#151515]/52">
                  Concern
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#B78A4A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h2 className="font-serif text-4xl leading-none text-[#151515]">
                {condition.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-[#151515]/64">
                {condition.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {condition.signs.slice(0, 3).map((sign) => (
                  <span
                    key={sign}
                    className="rounded-full bg-[#F7F1E8] px-3 py-1.5 text-xs font-semibold text-[#151515]/58"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
