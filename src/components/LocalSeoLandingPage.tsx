import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { PremiumButton } from "@/components/PremiumButton";
import type { LocalSeoPage } from "@/data/local-seo-pages";
import type { ClinicSettings } from "@/types/cms";
import { relationshipsFor } from "@/data/search-taxonomy";
import { ConversionLink } from "@/components/ConversionLink";
import { normalizedTel } from "@/lib/seo-config";
import { whatsappHref } from "@/lib/contact-links";

export function LocalSeoLandingPage({
  page,
  clinic,
}: {
  page: LocalSeoPage;
  clinic: ClinicSettings;
}) {
  const relationships = relationshipsFor(`/${page.slug}`);
  const contextualLinks = [
    ...page.relatedLinks,
    ...(relationships
      ? [
          { href: relationships.hub, label: "Treatment category overview", description: "Compare relevant treatment pathways and concerns." },
          ...relationships.articles.map((href) => ({ href, label: "Related patient guide", description: "Read practical guidance before choosing a treatment." })),
          { href: relationships.results, label: "Relevant treatment results", description: "Review consent-confirmed comparisons and realistic context." },
          { href: "/locations", label: "Visiting from elsewhere in Odisha", description: "Plan a visit to the verified Nayapalli, Bhubaneswar clinic." },
        ]
      : []),
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);

  return (
    <>
      <section className="relative flex min-h-[82svh] items-end overflow-hidden bg-[var(--ink)] px-5 pb-14 pt-36 text-white sm:px-8 sm:pb-20 lg:min-h-[46rem] lg:pb-24">
        <Image
          src={page.image}
          alt={page.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,16,22,0.94)_0%,rgba(15,16,22,0.76)_48%,rgba(15,16,22,0.26)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,22,0.16),rgba(15,16,22,0.68))]" />

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)] sm:tracking-[0.3em]">
            {page.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[0.94] tracking-normal sm:text-6xl lg:text-7xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
            {page.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenBookingButton
              source="cta"
              className="bg-white bg-none text-[var(--ink)] hover:bg-white"
            >
              Book Appointment
            </OpenBookingButton>
            <ConversionLink
              href={whatsappHref(clinic.whatsapp, `/${page.slug}`, page.serviceName)}
              eventName="whatsapp_click"
              topic={page.serviceName}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/10 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-white/18"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </ConversionLink>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">
              Consultation first
            </p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              {page.introductionTitle}
            </h2>
            <div className="mt-7 max-w-3xl space-y-5 text-base leading-8 text-[var(--ink)]/68">
              {page.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="self-start border-l-2 border-[var(--bronze)]/45 pl-6 lg:mt-8 lg:pl-8">
            <Stethoscope className="h-7 w-7 text-[var(--bronze)]" />
            <h2 className="mt-6 font-serif text-3xl text-[var(--ink)]">
              Care at Radiance Clinics
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ink)]/64">
              Consultations are led by Dr. Satyarth Prakash at Radiance Clinics
              in Bhubaneswar. Recommendations are based on examination,
              suitability and realistic expectations.
            </p>
            <p className="mt-5 flex gap-3 text-sm leading-7 text-[var(--ink)]/64">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--aqua)]" />
              {clinic.address}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-16 text-[var(--ivory)] sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
                Clinical assessment
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                {page.assessmentTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/64">
                {page.assessmentDescription}
              </p>
            </div>

            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {page.assessmentPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-b border-white/12 py-4 text-sm leading-7 text-white/76"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--champagne)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--bronze)]">
              Doctor-led approach
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              {page.approachTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink)]/66">
              {page.approachDescription}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.approachPoints.map((point, index) => (
              <div key={point} className="border-t border-[var(--ink)]/16 pt-5">
                <span className="font-mono text-xs font-bold text-[var(--aqua)]">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold leading-7 text-[var(--ink)]">
                  {point}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">
                What to expect
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
                A clear path from assessment to follow-up.
              </h2>
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {page.expectations.map((item, index) => (
                <li
                  key={item.title}
                  className="rounded-[1.25rem] border border-[var(--ink)]/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,16,22,0.06)]"
                >
                  <span className="font-mono text-xs font-bold text-[var(--bronze)]">
                    STEP 0{index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink)]/64">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--bronze)]">
                Related care
              </p>
              <h2 className="mt-4 font-serif text-4xl text-[var(--ink)] sm:text-5xl">
                Continue your research.
              </h2>
            </div>
            <PremiumButton href="/treatments" variant="outline">
              View all treatments
            </PremiumButton>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contextualLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-44 flex-col justify-between rounded-[1.25rem] border border-[var(--ink)]/10 bg-white p-6 transition hover:border-[var(--bronze)]/45"
              >
                <ArrowUpRight className="h-5 w-5 self-end text-[var(--bronze)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--ink)]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink)]/62">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">
              Questions patients ask
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              {page.serviceName} FAQs
            </h2>
          </div>
          <FAQAccordion items={page.faqs} />
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-16 text-center text-white sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <ShieldCheck className="mx-auto h-7 w-7 text-[var(--champagne)]" />
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Discuss suitability with the doctor before choosing treatment.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/64">
            Results, recovery and the number of sessions vary. A consultation is
            required to assess the concern and recommend an appropriate plan.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <OpenBookingButton
              source="cta"
              className="bg-white bg-none text-[var(--ink)] hover:bg-white"
            >
              Book Appointment
            </OpenBookingButton>
            <ConversionLink
              href={`tel:${normalizedTel(clinic.phone)}`}
              eventName="call_click"
              topic={page.serviceName}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.1em] transition hover:bg-white/10"
            >
              Call {clinic.phone}
            </ConversionLink>
          </div>
        </div>
      </section>
    </>
  );
}
