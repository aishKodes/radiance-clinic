import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, ShieldCheck } from "lucide-react";
import {
  AnimatedAuroraBackground,
  ContourMeshOverlay,
  FloatingSkinCells,
  LuxuryNoiseOverlay,
  SciencePatternOverlay,
  SectionGlowMask,
} from "@/components/BackgroundEffects";
import { ClinicAmbienceGallery } from "@/components/ClinicAmbienceGallery";
import { DoctorAuthority } from "@/components/DoctorAuthority";
import { MediaCoverageStrip } from "@/components/MediaCoverageStrip";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { LuxuryHero } from "@/components/LuxuryHero";
import { OpenChatButton } from "@/components/OpenChatButton";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { PremiumButton } from "@/components/PremiumButton";
import { RecognitionCarousel } from "@/components/RecognitionCarousel";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialCommunitySection } from "@/components/SocialCommunitySection";
import { TreatmentUniverseSection } from "@/components/TreatmentUniverseSection";
import { treatmentHubs } from "@/data/search-taxonomy";
import { TransformationShowcase } from "@/components/TransformationShowcase";
import { WhyChooseRadiance } from "@/components/WhyChooseRadiance";
import {
  anilKapoorRecognitionImage,
  doctorPatientHeroImage,
  hairTransformationExamples,
  premiumHeroSupportImages,
  premiumServiceCards,
  skinTransformationExamples,
} from "@/data/homepage-media";
import { localLandingByTreatmentSlug } from "@/data/local-seo-pages";
import { getGoogleReviewsFeed } from "@/lib/google-reviews";
import { webPageJsonLd } from "@/lib/schema";
import {
  getArticles,
  getClinicSettings,
  getDoctorProfile,
  getGalleryImages,
  getHeroImages,
  getHomepageContent,
  getProofStats,
  getRecognitionItems,
  getReviewSummary,
  getSocialLinks,
  getSocialStats,
  getVideoItems,
} from "@/data/site";
import type { CmsImage } from "@/types/cms";
import { pageMetadata } from "@/lib/metadata";
import { normalizedTel } from "@/lib/seo-config";
import { whatsappHref } from "@/lib/contact-links";
import { ConversionLink } from "@/components/ConversionLink";

export const metadata: Metadata = pageMetadata({
  title: "Radiance Clinics Bhubaneswar | Hair Transplant, Skin & Laser Clinic",
  description:
    "Doctor-led hair transplant, hair restoration, skin, laser and aesthetic treatments by Dr. Satyarth Prakash at Radiance Clinics, Bhubaneswar.",
  path: "/",
  image: "/radiance-media-processed/portrait/doctor-hero.webp",
  imageAlt: "Dr. Satyarth Prakash at Radiance Clinics Bhubaneswar",
});

function isAnilKapoorImage(image?: CmsImage) {
  const evidence = [
    image?.id,
    image?.filename,
    image?.src,
    image?.desktopUrl,
    image?.alt,
    image?.altText,
  ]
    .filter(Boolean)
    .join(" ");

  return /anil[-_\s]+kapoor/i.test(evidence);
}

function imageIdentityKeys(image?: CmsImage) {
  if (!image) return [];

  return [
    image.id,
    image.contentHash,
    image.normalizedBasename,
    image.src,
    image.desktopUrl,
    image.thumbnailUrl,
  ].filter((value): value is string => Boolean(value));
}

const priorityLocalCarePages = [
  { href: "/hair-transplant-bhubaneswar", label: "Hair transplant in Bhubaneswar" },
  { href: "/hair-loss-clinic-bhubaneswar", label: "Hair loss clinic in Bhubaneswar" },
  { href: "/skin-clinic-bhubaneswar", label: "Skin clinic in Bhubaneswar" },
  { href: "/laser-hair-removal-bhubaneswar", label: "Laser hair removal in Bhubaneswar" },
  { href: "/acne-scar-treatment-bhubaneswar", label: "Acne scar treatment in Bhubaneswar" },
  { href: "/pigmentation-treatment-bhubaneswar", label: "Pigmentation treatment in Bhubaneswar" },
] as const;

export default async function Home() {
  const [
    settings,
    homepage,
    doctor,
    articles,
    heroImages,
    proofStats,
    videos,
    galleryImages,
    recognitionItems,
    socialLinks,
    socialStats,
    clinicReviewSummary,
    googleReviewFeed,
  ] = await Promise.all([
    getClinicSettings(),
    getHomepageContent(),
    getDoctorProfile(),
    getArticles(),
    getHeroImages(),
    getProofStats(),
    getVideoItems(),
    getGalleryImages(),
    getRecognitionItems(),
    getSocialLinks(),
    getSocialStats(),
    getReviewSummary(),
    getGoogleReviewsFeed(),
  ]);

  const featuredTreatments = premiumServiceCards;
  const recentArticles = articles.slice(0, 3);
  const seenHeroImages = new Set<string>();
  const homepageHeroImages = [
    ...heroImages.filter((image) => !isAnilKapoorImage(image)),
    ...premiumHeroSupportImages,
    doctorPatientHeroImage,
    anilKapoorRecognitionImage,
  ].filter((image) => {
    const key = image.id || image.src;
    if (!key || seenHeroImages.has(key)) return false;
    seenHeroImages.add(key);
    return true;
  });
  const supportingRecognitionItems = recognitionItems.filter(
    (item) => !isAnilKapoorImage(item.image || item.badge),
  );
  const recognitionImageKeys = new Set(
    supportingRecognitionItems.flatMap((item) =>
      imageIdentityKeys(item.image || item.badge),
    ),
  );
  const clinicGalleryImages = galleryImages.filter((item) => {
    if (isAnilKapoorImage(item.image)) return false;
    return !imageIdentityKeys(item.image).some((key) =>
      recognitionImageKeys.has(key),
    );
  });
  const reviewSummary = {
    ...clinicReviewSummary,
    googleRating:
      googleReviewFeed.rating?.toFixed(1) || clinicReviewSummary.googleRating,
    googleReviewCount:
      googleReviewFeed.totalReviewCount?.toLocaleString("en-IN") ||
      clinicReviewSummary.googleReviewCount,
    googleMapsUrl:
      googleReviewFeed.googleMapsUrl || clinicReviewSummary.googleMapsUrl,
    featuredReviewExcerpts: googleReviewFeed.reviews.length
      ? googleReviewFeed.reviews.map((review) => review.text)
      : clinicReviewSummary.featuredReviewExcerpts,
  };

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance Clinics Bhubaneswar",
          description:
            "Premium doctor-led hair, skin, laser and aesthetic care by Dr. Satyarth Prakash.",
          path: "/",
        })}
      />
      <LuxuryHero
        homepage={{
          heroEyebrow: homepage.heroEyebrow,
          heroTitle: homepage.heroTitle,
          heroSubtitle: homepage.heroSubtitle,
          primaryCta: homepage.primaryCta,
          secondaryCta: homepage.secondaryCta,
          assistantTeaser: homepage.assistantTeaser,
          heroImages: homepageHeroImages,
          stats: homepage.stats,
        }}
        settings={settings}
      />

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-12 sm:px-8">
        <SciencePatternOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto grid min-w-0 max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
          {proofStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.04}>
              <div className="gradient-border h-full min-w-0 rounded-[1.35rem] bg-white/56 p-4 shadow-[0_22px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-5">
                <p className="text-[0.58rem] font-extrabold uppercase leading-4 tracking-[0.14em] text-[var(--bronze)] sm:text-[0.62rem] sm:tracking-[0.24em]">
                  {stat.eyebrow || "Proof"}
                </p>
                <p className="mt-3 break-words font-mono text-2xl font-extrabold leading-none text-[var(--ink)] sm:mt-4 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.7rem] font-extrabold uppercase leading-5 tracking-[0.1em] text-[var(--ink)]/62 sm:text-sm sm:tracking-[0.16em]">
                  {stat.label}
                </p>
                {stat.description ? (
                  <p className="mt-3 hidden text-sm leading-6 text-[var(--ink)]/58 sm:mt-4 sm:block">
                    {stat.description}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ink)] px-4 py-16 text-[var(--ivory)] sm:px-8 sm:py-20 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-55" />
        <ContourMeshOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0 opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
            <TransformationShowcase
              eyebrow="Hair Transformation Examples"
              title="Hair Transplant Results & Hair Restoration Examples"
              description="Selected hair restoration examples shared with consent. Results vary by individual and consultation is required."
              category="hair"
              transformations={hairTransformationExamples}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-8 sm:mt-12">
            <TransformationShowcase
              eyebrow="Skin Improvement Examples"
              title="Skin Improvement Examples"
              description="Selected examples for skin concerns such as acne scars, pigmentation, melasma and rejuvenation, shared with consent."
              category="skin"
              transformations={skinTransformationExamples}
            />
          </Reveal>
        </div>
      </section>

      <section
        id="signature-treatments"
        className="relative isolate overflow-hidden bg-[var(--ivory)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32"
      >
        <SciencePatternOverlay className="z-0" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
            <SectionHeader
              eyebrow="Signature Treatments"
              title="Hair, skin, laser and aesthetic care, clearly organized."
              description="Explore hair restoration, hair transplant planning, hair fall care, skin and laser treatments, pigmentation care, acne scar revision and subtle aesthetic dermatology."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-9 sm:mt-14">
            <TreatmentUniverseSection />
          </Reveal>
          <nav aria-label="Treatment category guides" className="mt-10 grid gap-3 border-t border-[var(--ink)]/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {treatmentHubs.map((hub) => (
              <ConversionLink key={hub.slug} href={`/treatments/${hub.slug}`} eventName="treatment_cta_click" topic={hub.label} className="group flex items-center justify-between gap-3 py-3 text-sm font-extrabold text-[var(--ink)]">
                {hub.label}
                <ArrowUpRight className="h-4 w-4 text-[var(--bronze)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </ConversionLink>
            ))}
          </nav>
          <nav aria-label="Popular clinic services in Bhubaneswar" className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-[var(--ink)]/10 pt-7">
            {priorityLocalCarePages.map((item) => (
              <ConversionLink key={item.href} href={item.href} eventName="treatment_cta_click" topic={item.label} className="inline-flex items-center gap-2 text-sm font-bold leading-6 text-[var(--ink)]/70 underline decoration-[var(--bronze)]/45 underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--bronze)]">
                {item.label}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--bronze)]" />
              </ConversionLink>
            ))}
          </nav>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <SectionGlowMask className="z-0" />
        <ContourMeshOverlay className="z-0 opacity-28" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-9 flex min-w-0 flex-col justify-between gap-6 sm:mb-12 sm:gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Treatment Options"
                title="Choose the right service pathway."
                description="Each service begins with doctor-led assessment, realistic expectations and a clear plan for preparation, treatment and aftercare."
              />
            </Reveal>
            <PremiumButton href="/treatments" variant="outline" eventName="treatment_cta_click">
              Explore all treatments
            </PremiumButton>
          </div>
          <div
            data-lenis-prevent-touch
            className="mobile-scroll-row flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4"
          >
            {featuredTreatments.map((treatment, index) => (
              <Reveal
                key={treatment.title}
                delay={index * 0.04}
                className="w-[82vw] max-w-[20rem] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <ConversionLink
                  href={
                    localLandingByTreatmentSlug[treatment.slug] ||
                    `/treatments/${treatment.cluster}/${treatment.slug}`
                  }
                  eventName="treatment_cta_click"
                  topic={treatment.title}
                  className="group block h-full min-w-0 overflow-hidden rounded-[1.25rem] border border-[var(--ink)]/10 bg-white shadow-[0_22px_76px_rgba(15,16,22,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_96px_rgba(15,16,22,0.12)] sm:rounded-[1.4rem]"
                >
                  {treatment.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--mist)]">
                      <Image
                        src={treatment.image.src}
                        alt={treatment.image.altText || treatment.image.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        placeholder={
                          treatment.image.blurDataUrl ? "blur" : "empty"
                        }
                        blurDataURL={treatment.image.blurDataUrl}
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.36))]" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold text-[var(--ink)]">
                      {treatment.title}
                    </h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--ink)]/64">
                      {treatment.summary}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-[var(--ink)]/10 pt-4">
                      <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">
                        Learn More
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[var(--ink)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </ConversionLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DoctorAuthority doctor={doctor} />

      <MediaCoverageStrip />

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <SectionGlowMask className="z-0 opacity-70" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-9 sm:mb-14">
            <SectionHeader
              eyebrow="Recognition"
              title="Recognition & Trust"
              description="Moments, certificates and recognitions from Radiance Clinics' work in hair, skin and aesthetic care."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <RecognitionCarousel items={supportingRecognitionItems} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-38" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-9 sm:mb-14">
            <SectionHeader
              eyebrow="Videos, articles & reviews"
              title="Stay informed between visits."
              description="Preview doctor-led videos, read treatment guidance and visit patient-review channels before booking."
            />
          </Reveal>
          <SocialCommunitySection
            links={socialLinks}
            stats={socialStats}
            reviewSummary={reviewSummary}
            videos={videos}
            articles={recentArticles}
          />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <SciencePatternOverlay className="z-0 opacity-34" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
            <SectionHeader
              eyebrow="Why choose Radiance"
              title="Why patients choose Radiance."
              description="Doctor-led consultations, advanced equipment, privacy, clear aftercare and realistic guidance for hair, skin, laser and aesthetic concerns."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-9 sm:mt-14">
            <WhyChooseRadiance items={homepage.whyChoose} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <SectionGlowMask className="z-0 opacity-80" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-9 grid min-w-0 gap-6 sm:mb-14 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Care process"
                title="A calmer path from concern to clinical plan."
                description="From first callback to consultation, assessment, treatment planning and review, the experience is designed to feel clear and reassuring."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[1.35rem] border border-[var(--ink)]/10 bg-white/60 p-5 shadow-[0_22px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
                <CalendarCheck className="mb-4 h-6 w-6 text-[var(--bronze)]" />
                <p className="text-sm leading-7 text-[var(--ink)]/62">
                  Consultation, mapping, procedure planning and maintenance are
                  handled as a careful care process, not a rushed package sale.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="grid gap-4 min-[380px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {homepage.journey.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 0.05}>
                  <div className="gradient-border h-full rounded-[1.35rem] bg-white/58 p-5 shadow-[0_24px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
                    <div className="mb-7 flex items-center justify-between sm:mb-10">
                      <span className="font-mono text-4xl font-extrabold text-[var(--bronze)]">
                        0{index + 1}
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--ivory)]">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[var(--ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="clinic-gallery"
        className="relative isolate scroll-mt-28 overflow-hidden bg-[var(--mist)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32"
      >
        <ContourMeshOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-9 sm:mb-14">
            <SectionHeader
              eyebrow="Clinic Gallery"
              title="Inside Radiance Clinics"
              description="A closer look at the clinic environment, doctor-led consultations, recognition moments and patient care spaces."
            />
          </Reveal>
          <ClinicAmbienceGallery images={clinicGalleryImages} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-4 py-16 sm:px-8 sm:py-20 lg:py-32">
        <div className="relative z-10 mx-auto grid min-w-0 max-w-7xl gap-9 sm:gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeader
              eyebrow="Questions"
              title="Careful assessment comes before every treatment plan."
              description="Clear answers to common questions before your first visit."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <FAQAccordion items={homepage.faqs} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ink)] px-4 py-16 text-center text-[var(--ivory)] sm:px-8 sm:py-20 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-80" />
        <FloatingSkinCells className="z-0 opacity-60" />
        <ContourMeshOverlay className="z-0 opacity-24" />
        <LuxuryNoiseOverlay className="z-0" />
        <Reveal className="relative z-10 mx-auto max-w-5xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[var(--champagne)]">
            Radiance Clinics
          </p>
          <h2 className="font-serif text-4xl leading-[0.94] tracking-normal sm:text-7xl">
            Start with doctor-led clarity. Leave with a plan that feels precise.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/66">
            Call, WhatsApp, request a consultation, or chat now for general
            service and booking guidance.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <PremiumButton href={`tel:${normalizedTel(settings.phone)}`} variant="ivory">
              Call
            </PremiumButton>
            <PremiumButton
              href={whatsappHref(settings.whatsapp, "/")}
              variant="outline"
              className="border-white/20 bg-white/5 text-[var(--ivory)] hover:bg-white/10"
            >
              WhatsApp
            </PremiumButton>
            <OpenBookingButton
              source="homepage_booking"
              className="border-white/20 bg-white/8 text-[var(--ivory)] hover:bg-white/14"
            >
              Book Consultation
            </OpenBookingButton>
            <OpenChatButton className="border-white/20 bg-white/8 text-[var(--ivory)] hover:bg-white/14" />
          </div>
          <div className="mx-auto mt-9 flex max-w-3xl items-start gap-3 rounded-[1.35rem] border border-white/12 bg-white/[0.07] p-4 text-left text-sm leading-7 text-white/58 backdrop-blur-xl sm:mt-10 sm:rounded-[2rem] sm:p-5">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[var(--champagne)]" />
            Treatment suitability, timelines and expected outcomes require an
            in-person or doctor-led consultation. The site and AI assistant are
            for service guidance and appointment support.
          </div>
        </Reveal>
      </section>
    </>
  );
}
