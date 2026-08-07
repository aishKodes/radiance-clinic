import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { ResultPreviewGrid } from "@/components/ResultPreviewGrid";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { resultCases } from "@/data/result-cases";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Hair Transplant & Skin Treatment Results | Radiance Clinics",
  description:
    "Review consent-confirmed hair transplant, hair restoration and skin treatment comparisons from Radiance Clinics Bhubaneswar. Individual outcomes vary.",
  path: "/results",
});

export default function ResultsPage() {
  const hairCases = resultCases.filter((item) => item.category === "hair-transplant");
  const skinCases = resultCases.filter((item) => item.category === "skin");
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Results", path: "/results" },
  ];

  return (
    <>
      <JsonLd data={collectionPageJsonLd({
        title: "Patient Treatment Results",
        description: "Consent-confirmed hair and skin treatment comparisons at Radiance Clinics Bhubaneswar.",
        path: "/results",
        itemPaths: ["/before-after"],
      })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <section className="bg-[var(--mist)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">Patient results</p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Hair & Skin Treatment Results
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">
              These consent-confirmed comparisons show individual treatment outcomes. They are provided for discussion and do not predict another patient’s result.
            </p>
            <PremiumButton href="/before-after" className="mt-9">Open interactive comparisons</PremiumButton>
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <section id="hair-transplant-results" className="scroll-mt-28 bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Hair restoration</p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Hair Transplant Results & Hair Restoration Examples</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink)]/64">Condition names come from the approved comparison records. Graft counts and timelines are omitted where they have not been clinically verified.</p>
          <div className="mt-10"><ResultPreviewGrid cases={hairCases} limit={6} /></div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="/hair-transplant-bhubaneswar">Hair transplant planning</PremiumButton>
            <PremiumButton href="/conditions/hair-fall-thinning" variant="outline">Hair loss guidance</PremiumButton>
          </div>
        </div>
      </section>

      <section id="skin-results" className="scroll-mt-28 bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--aqua)]">Skin care</p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Skin Improvement Examples</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink)]/64">Treatment planning varies by concern, skin type and tolerance. These images are not a guarantee of outcome.</p>
          <div className="mt-10"><ResultPreviewGrid cases={skinCases} /></div>
          <PremiumButton href="/skin-clinic-bhubaneswar" className="mt-9">Skin consultation information</PremiumButton>
        </div>
      </section>
    </>
  );
}
