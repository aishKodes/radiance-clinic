import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import type { LocationSeoPage } from "@/data/location-pages";
import { clinicIdentity, directionsUrl } from "@/lib/seo-config";

export function LocationSeoLandingPage({ page }: { page: LocationSeoPage }) {
  return <>
    <section className="bg-[var(--mist)] px-5 pb-20 pt-40 sm:px-8 lg:pb-28 lg:pt-48">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: page.city, path: `/${page.slug}` }]} />
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--aqua)]">Outstation patient information</p>
        <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl lg:text-7xl">{page.title}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">Treatment takes place at the verified Radiance Clinics location in Nayapalli, Bhubaneswar. This page does not represent a branch in {page.city}.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><OpenBookingButton source="cta">Book consultation</OpenBookingButton><PremiumButton href={directionsUrl(clinicIdentity.address)} variant="outline">Get directions</PremiumButton></div>
      </div>
    </section>
    <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.55fr]">
        <div>
          <h2 className="font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Assessment before travel and treatment</h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-[var(--ink)]/68">{page.uniqueIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <aside className="border-l-2 border-[var(--bronze)]/45 pl-6"><MapPin className="h-6 w-6 text-[var(--bronze)]" /><h2 className="mt-5 font-serif text-3xl text-[var(--ink)]">Verified clinic location</h2><p className="mt-4 text-sm leading-7 text-[var(--ink)]/64">{clinicIdentity.address}</p></aside>
      </div>
    </section>
    <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Visit planning</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Before travelling from {page.city}</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--ink)]/64">{page.verifiedPatientContext}</p>
          </div>
          <ol className="divide-y divide-[var(--ink)]/12 border-y border-[var(--ink)]/12">
            {page.verifiedTravelGuidance.map((guidance, index) => (
              <li key={guidance} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 text-sm leading-7 text-[var(--ink)]/68">
                <span className="font-mono font-extrabold text-[var(--bronze)]">0{index + 1}</span>
                <span>{guidance}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
    <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--aqua)]">Common questions</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Planning a visit from {page.city}</h2>
          <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ink)] underline decoration-[var(--bronze)] decoration-2 underline-offset-4">
            Contact Radiance Clinics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <FAQAccordion items={page.faqs} />
      </div>
    </section>
    <RelatedContent title="Review the treatment and clinic before travelling." items={[
      { href: "/hair-transplant-bhubaneswar", label: "Hair transplant in Bhubaneswar", description: "Understand donor assessment, hairline planning and realistic coverage." },
      { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE planning", description: "Read how suitability and donor strategy are assessed." },
      { href: "/knowledge/hair-transplant-aftercare", label: "Hair transplant aftercare", description: "Prepare questions about recovery and follow-up." },
    ]} />
  </>;
}
