import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { clinicIdentity, directionsUrl } from "@/lib/seo-config";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Visit Radiance Clinics from Across Odisha | Bhubaneswar",
  description:
    "Plan a visit to the verified Radiance Clinics location in Nayapalli, Bhubaneswar, including contact, directions and outstation appointment guidance.",
  path: "/locations",
});

export default function LocationsPage() {
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }];
  return <>
    <JsonLd data={webPageJsonLd({ title: "Visiting Radiance Clinics from across Odisha", description: "Verified clinic location and outstation visit planning for Radiance Clinics in Bhubaneswar.", path: "/locations" })} />
    <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    <section className="bg-[var(--mist)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--aqua)]">Clinic location</p>
          <h1 className="max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl lg:text-7xl">Visiting Radiance Clinics from across Odisha</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">Radiance Clinics operates from its verified clinic in Nayapalli, Bhubaneswar. Patients travelling from Cuttack, Puri, Rourkela, Sambalpur, Berhampur, Baripada and elsewhere in Odisha should confirm appointment timing before travel.</p>
        </div>
        <StickyConsultationCard />
      </div>
    </section>
    <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-4xl text-[var(--ink)] sm:text-5xl">The verified Bhubaneswar clinic</h2>
          <address className="mt-7 space-y-5 not-italic text-base leading-8 text-[var(--ink)]/68">
            <p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[var(--bronze)]" />{clinicIdentity.address}</p>
            <p className="flex gap-3"><Phone className="mt-1 h-5 w-5 shrink-0 text-[var(--bronze)]" /><span>{clinicIdentity.primaryPhone}<br />{clinicIdentity.secondaryPhone}</span></p>
          </address>
          <PremiumButton href={directionsUrl(clinicIdentity.address)} className="mt-8">Get directions</PremiumButton>
        </div>
        <div>
          <h2 className="font-serif text-4xl text-[var(--ink)]">Planning an outstation visit</h2>
          <ul className="mt-7 space-y-4 text-sm leading-7 text-[var(--ink)]/68">
            <li className="border-t border-[var(--ink)]/12 pt-4">Call or WhatsApp the clinic before arranging travel so the correct consultation slot can be confirmed.</li>
            <li className="border-t border-[var(--ink)]/12 pt-4">Do not assume a procedure will take place on the first visit. Suitability and the plan require assessment.</li>
            <li className="border-t border-[var(--ink)]/12 pt-4">Discuss recovery, transport and any follow-up requirements with the clinic before booking accommodation or return travel.</li>
            <li className="border-t border-[var(--ink)]/12 pt-4">Radiance Clinics does not claim branches or local offices in the other Odisha cities listed above.</li>
          </ul>
        </div>
      </div>
    </section>
    <RelatedContent title="Plan the treatment research before travelling." items={[
      { href: "/hair-transplant-bhubaneswar", label: "Hair transplant in Bhubaneswar", description: "Review consultation, donor assessment and restoration planning." },
      { href: "/treatments/hair-restoration", label: "Hair restoration options", description: "Compare surgical and non-surgical hair pathways." },
      { href: "/contact", label: "Contact and directions", description: "Use the verified address, phone numbers and map." },
    ]} />
  </>;
}
