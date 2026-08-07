import { MapPin } from "lucide-react";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PremiumButton } from "@/components/PremiumButton";
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
        <div className="space-y-5 text-base leading-8 text-[var(--ink)]/68">{page.uniqueIntroduction?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <aside className="border-l-2 border-[var(--bronze)]/45 pl-6"><MapPin className="h-6 w-6 text-[var(--bronze)]" /><h2 className="mt-5 font-serif text-3xl text-[var(--ink)]">Verified clinic location</h2><p className="mt-4 text-sm leading-7 text-[var(--ink)]/64">{clinicIdentity.address}</p></aside>
      </div>
    </section>
  </>;
}
