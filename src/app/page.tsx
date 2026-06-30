import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  Quote,
  ShieldCheck,
} from "lucide-react";
import {
  AnimatedAuroraBackground,
  ContourMeshOverlay,
  FloatingSkinCells,
  LuxuryNoiseOverlay,
  SciencePatternOverlay,
  SectionGlowMask,
} from "@/components/BackgroundEffects";
import { ClinicAmbienceGallery } from "@/components/ClinicAmbienceGallery";
import {DoctorAuthority} from "@/components/DoctorAuthority";
import {FAQAccordion} from "@/components/FAQAccordion";
import {JsonLd} from "@/components/JsonLd";
import {LuxuryHero} from "@/components/LuxuryHero";
import {OpenChatButton} from "@/components/OpenChatButton";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import {PremiumButton} from "@/components/PremiumButton";
import { RecognitionCarousel } from "@/components/RecognitionCarousel";
import {Reveal} from "@/components/Reveal";
import {SectionHeader} from "@/components/SectionHeader";
import { SocialCommunitySection } from "@/components/SocialCommunitySection";
import {TreatmentCard} from "@/components/TreatmentCard";
import {TreatmentUniverseSection} from "@/components/TreatmentUniverseSection";
import { TransformationShowcase } from "@/components/TransformationShowcase";
import {WhyChooseRadiance} from "@/components/WhyChooseRadiance";
import { skinTransformations as fallbackSkinTransformations } from "@/data/seed";
import {
  faqJsonLd,
  medicalClinicJsonLd,
  webPageJsonLd,
} from "@/lib/schema";
import { beforeAfterCasesToTransformations } from "@/lib/transformations";
import {
  getArticles,
  getBeforeAfterCases,
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
  getTestimonials,
  getTreatments,
  getVideoItems,
} from "@/data/site";

export default async function Home() {
  const [
    settings,
    homepage,
    doctor,
    treatments,
    articles,
    testimonials,
    beforeAfterCases,
    heroImages,
    proofStats,
    videos,
    galleryImages,
    recognitionItems,
    socialLinks,
    socialStats,
    reviewSummary,
  ] = await Promise.all([
    getClinicSettings(),
    getHomepageContent(),
    getDoctorProfile(),
    getTreatments(),
    getArticles(),
    getTestimonials(),
    getBeforeAfterCases(),
    getHeroImages(),
    getProofStats(),
    getVideoItems(),
    getGalleryImages(),
    getRecognitionItems(),
    getSocialLinks(),
    getSocialStats(),
    getReviewSummary(),
  ]);

  const featuredTreatments = treatments.slice(0, 8);
  const recentArticles = articles.slice(0, 3);
  const hairTransformations = beforeAfterCasesToTransformations(beforeAfterCases);

  return (
    <>
      <JsonLd data={medicalClinicJsonLd(settings)} />
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance Clinics Bhubaneswar",
          description:
            "Premium doctor-led hair, skin, laser and aesthetic care by Dr. Satyarth Prakash.",
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(homepage.faqs)} />

      <LuxuryHero
        homepage={{
          heroEyebrow: homepage.heroEyebrow,
          heroTitle: homepage.heroTitle,
          heroSubtitle: homepage.heroSubtitle,
          primaryCta: homepage.primaryCta,
          secondaryCta: homepage.secondaryCta,
          assistantTeaser: homepage.assistantTeaser,
          heroImages,
          stats: homepage.stats,
        }}
        settings={settings}
      />

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-12 sm:px-8">
        <SciencePatternOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
          {proofStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.04}>
              <div className="gradient-border h-full rounded-[2rem] bg-white/56 p-5 shadow-[0_22px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-[var(--bronze)]">
                  {stat.eyebrow || "Proof"}
                </p>
                <p className="mt-4 font-mono text-4xl font-extrabold leading-none text-[var(--ink)]">
                  {stat.value}
                </p>
                <h3 className="mt-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]/62">
                  {stat.label}
                </h3>
                {stat.description ? (
                  <p className="mt-4 text-sm leading-6 text-[var(--ink)]/58">
                    {stat.description}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ink)] px-5 py-24 text-[var(--ivory)] sm:px-8 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-55" />
        <ContourMeshOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0 opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
            <TransformationShowcase
              eyebrow="Hair Transformation Examples"
              title="Hair Transformation Examples"
              description="Explore selected hair restoration examples shared with consent. Results vary by individual and consultation is required."
              category="hair"
              transformations={hairTransformations}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <TransformationShowcase
              eyebrow="Skin Improvement Examples"
              title="Skin Improvement Examples"
              description="Selected skin improvement examples will be added as clinic-approved images become available."
              category="skin"
              transformations={fallbackSkinTransformations}
            />
          </Reveal>
        </div>
      </section>

      <section
        id="signature-treatments"
        className="relative isolate overflow-hidden bg-[var(--ivory)] px-5 py-24 sm:px-8 lg:py-32"
      >
        <AnimatedAuroraBackground className="z-0 opacity-42" />
        <SciencePatternOverlay className="z-0" />
        <FloatingSkinCells className="z-0" />
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
          <Reveal delay={0.08} className="mt-14">
            <TreatmentUniverseSection />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-24 sm:px-8 lg:py-32">
        <SectionGlowMask className="z-0" />
        <ContourMeshOverlay className="z-0 opacity-28" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Treatment Options"
                title="Choose the right service pathway."
                description="Each service begins with doctor-led assessment, realistic expectations and a clear plan for preparation, treatment and aftercare."
              />
            </Reveal>
            <PremiumButton href="/treatments" variant="outline">
              Explore all treatments
            </PremiumButton>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredTreatments.map((treatment, index) => (
              <Reveal key={treatment.slug} delay={index * 0.04}>
                <TreatmentCard treatment={treatment} featured={index === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DoctorAuthority doctor={doctor} />

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-24 sm:px-8 lg:py-32">
        <SectionGlowMask className="z-0 opacity-70" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-14">
              <SectionHeader
                eyebrow="Recognition"
                title="Recognition & Trust"
                description="Moments, certificates and recognitions from Radiance Clinics' journey in hair, skin and aesthetic care."
              />
          </Reveal>
          <Reveal delay={0.08}>
            <RecognitionCarousel items={recognitionItems} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-5 py-24 sm:px-8 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-38" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-14">
              <SectionHeader
                eyebrow="Official channels"
                title="Follow Radiance Clinics"
                description="Watch treatment explainers, patient stories and clinic updates across Radiance Clinics' official channels."
              />
          </Reveal>
          <SocialCommunitySection
            links={socialLinks}
            stats={socialStats}
            reviewSummary={reviewSummary}
            videos={videos}
          />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-24 sm:px-8 lg:py-32">
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
          <Reveal delay={0.08} className="mt-14">
            <WhyChooseRadiance items={homepage.whyChoose} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-5 py-24 sm:px-8 lg:py-32">
        <SectionGlowMask className="z-0 opacity-80" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Patient journey"
                title="A calmer path from concern to clinical plan."
                description="From first callback to consultation, assessment, treatment planning and review, the experience is designed to feel clear and reassuring."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[2rem] border border-[var(--ink)]/10 bg-white/60 p-5 shadow-[0_22px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl">
                <CalendarCheck className="mb-4 h-6 w-6 text-[var(--bronze)]" />
                <p className="text-sm leading-7 text-[var(--ink)]/62">
                  Consultation, mapping, procedure planning and maintenance are
                  handled as a careful patient journey, not a rushed package sale.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {homepage.journey.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 0.05}>
                  <div className="gradient-border h-full rounded-[2rem] bg-white/58 p-6 shadow-[0_24px_80px_rgba(15,16,22,0.08)] backdrop-blur-xl">
                    <div className="mb-10 flex items-center justify-between">
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

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-24 sm:px-8 lg:py-32">
        <ContourMeshOverlay className="z-0 opacity-30" />
        <LuxuryNoiseOverlay className="z-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal className="mb-14">
              <SectionHeader
                eyebrow="Clinic ambience"
                title="Designed for comfort, privacy and doctor-led care."
                description="A calm, modern clinic environment for consultation, treatment planning and care."
              />
          </Reveal>
          <ClinicAmbienceGallery images={galleryImages} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-5 py-24 sm:px-8 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeader
                eyebrow="Knowledge library"
                title="Learn before you book."
                description="Doctor-reviewed articles help patients understand treatment options, safety, preparation and realistic expectations."
              />
            </Reveal>
            <PremiumButton href="/knowledge" variant="outline">
              Open library
            </PremiumButton>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {recentArticles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.05}>
                <Link
                  href={`/knowledge/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[2.1rem] border border-[var(--ink)]/10 bg-white/60 p-4 shadow-[0_26px_90px_rgba(15,16,22,0.08)] backdrop-blur-xl transition duration-500 hover:-translate-y-1"
                >
                  {article.image ? (
                    <div className="relative h-56 overflow-hidden rounded-[1.6rem] bg-[var(--mist)]">
                      <Image
                        src={article.image.src}
                        alt={article.image.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.58))]" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/24 bg-white/16 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                        Doctor-reviewed
                      </span>
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-2 pt-6">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="rounded-full border border-[var(--ink)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]/52">
                        {article.category}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-[var(--bronze)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-serif text-3xl leading-none text-[var(--ink)]">
                      {article.title}
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-7 text-[var(--ink)]/62">
                      {article.excerpt}
                    </p>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]/45">
                      Dr. Satyarth Prakash - {article.readTime}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--mist)] px-5 py-24 sm:px-8 lg:py-32">
        <SciencePatternOverlay className="z-0 opacity-28" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
              <SectionHeader
              eyebrow="Patient Stories"
              title="Quiet confidence, not loud promises."
              description="Testimonials focus on clarity, comfort and planning rather than guaranteed outcomes."
            />
          </Reveal>
          <div className="grid gap-4">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.quote} delay={index * 0.05}>
                <figure className="rounded-[2rem] border border-[var(--ink)]/10 bg-white/58 p-6 shadow-[0_20px_70px_rgba(15,16,22,0.07)] backdrop-blur-xl">
                  <Quote className="mb-6 h-6 w-6 text-[var(--bronze)]" />
                  <blockquote className="text-xl leading-8 text-[var(--ink)]">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-bold text-[var(--ink)]/56">
                    {testimonial.name} - {testimonial.context}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ivory)] px-5 py-24 sm:px-8 lg:py-32">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeader
              eyebrow="Questions"
              title="The premium part is how carefully the plan is chosen."
              description="A few answers before your first visit."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <FAQAccordion items={homepage.faqs} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ink)] px-5 py-24 text-center text-[var(--ivory)] sm:px-8 lg:py-32">
        <AnimatedAuroraBackground className="z-0 opacity-80" />
        <FloatingSkinCells className="z-0 opacity-60" />
        <ContourMeshOverlay className="z-0 opacity-24" />
        <LuxuryNoiseOverlay className="z-0" />
        <Reveal className="relative z-10 mx-auto max-w-5xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[var(--champagne)]">
            Radiance Clinics
          </p>
          <h2 className="font-serif text-5xl leading-[0.92] tracking-normal sm:text-7xl">
            Start with doctor-led clarity. Leave with a plan that feels precise.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/66">
            Call, WhatsApp, request a consultation, or chat now for general
            service and booking guidance.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <PremiumButton href={`tel:${settings.phone}`} variant="ivory">
              Call
            </PremiumButton>
            <PremiumButton
              href={`https://wa.me/${settings.whatsapp}`}
              variant="outline"
              className="border-white/20 bg-white/5 text-[var(--ivory)] hover:bg-white/10"
            >
              WhatsApp
            </PremiumButton>
            <OpenBookingButton source="homepage_booking" className="border-white/20 bg-white/8 text-[var(--ivory)] hover:bg-white/14">
              Book Consultation
            </OpenBookingButton>
            <OpenChatButton className="border-white/20 bg-white/8 text-[var(--ivory)] hover:bg-white/14" />
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 text-left text-sm leading-7 text-white/58 backdrop-blur-xl">
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
