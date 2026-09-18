import type { Metadata } from "next";
import Link from "next/link";
import { Award, Microscope, ShieldCheck, Sparkles } from "lucide-react";
import { DoctorAuthority } from "@/components/DoctorAuthority";
import { JsonLd } from "@/components/JsonLd";
import { MediaCoverageStrip } from "@/components/MediaCoverageStrip";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { RelatedVideos } from "@/components/RelatedVideos";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { satyarthPrakash } from "@/data/doctor";
import { fallbackData } from "@/data/fallback";
import { clinicFacts } from "@/data/clinic-facts";
import { featuredMediaCoverage } from "@/data/media-coverage";
import { doctorAnswers } from "@/data/concern-library";
import { getArticles, getDoctorProfile } from "@/data/site";
import { videosForPath } from "@/data/video-library";
import { doctorProfilePageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `About ${fallbackData.siteSettings.doctor} | Radiance Clinics`,
  description:
    "Meet Dr. Satyarth Prakash and the doctor-led philosophy behind Radiance Clinics, Bhubaneswar.",
  path: "/about",
});

export default async function AboutPage() {
  const [doctor, articles] = await Promise.all([getDoctorProfile(), getArticles()]);
  const profileVideos = videosForPath("/about", 2);
  const doctorAuthoredArticles = articles.filter(
    (article) => article.authorId === "dr-satyarth-prakash" || article.authorType === "doctor",
  );
  const reviewedArticles = doctorAuthoredArticles.length
    ? doctorAuthoredArticles.slice(0, 3)
    : articles.slice(0, 3);
  const relatedAnswers = doctorAnswers.slice(0, 4);

  return (
    <>
      <JsonLd data={doctorProfilePageJsonLd()} />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.36em] text-[#1E6F86]">
              Doctor profile
            </p>
            <h1 className="font-serif text-[clamp(4rem,10vw,8.5rem)] leading-[0.86] tracking-normal text-[#151515]">
              Dr. Satyarth Prakash at Radiance Clinics
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {doctor.name} leads Radiance Clinics with a consultation-first
              approach across hair restoration, skin, laser and aesthetic
              medicine, informed by {clinicFacts.clinicalExperience.value} years of clinical experience.
              The focus is planning, proportion and medically grounded decision-making.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Diagnosis first",
                  text: "Concerns are assessed before treatment categories are suggested.",
                  icon: Microscope,
                },
                {
                  title: "Proportion aware",
                  text: "Aesthetic planning respects facial balance, expression and identity.",
                  icon: Sparkles,
                },
                {
                  title: "Safety conscious",
                  text: "Protocols consider skin type, downtime, medical history and maintenance.",
                  icon: ShieldCheck,
                },
                {
                  title: "Premium experience",
                  text: "The clinic experience is calm, private, clear and carefully paced.",
                  icon: Award,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-[#151515]/10 bg-white/54 p-6 shadow-[0_20px_70px_rgba(21,21,21,0.07)] backdrop-blur"
                  >
                    <Icon className="mb-8 h-6 w-6 text-[#B78A4A]" />
                    <h2 className="text-xl font-bold text-[#151515]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#151515]/62">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <StickyConsultationCard />
        </div>
      </section>

      <DoctorAuthority doctor={doctor} />

      <MediaCoverageStrip className="bg-[#FBF7EF]" />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Clinical focus
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">
              Care areas connected to the doctor profile.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--ink)]/68">
              {satyarthPrakash.bio}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {satyarthPrakash.clinicalAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group border-t border-[var(--ink)]/14 py-5 transition hover:border-[var(--bronze)]"
              >
                <h3 className="text-xl font-extrabold text-[var(--ink)]">
                  {area.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink)]/62">
                  {area.description}
                </p>
                <span className="mt-5 inline-flex text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--aqua)]">
                  Explore care
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Doctor-authored clinical education
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">
              Articles by Dr. Satyarth Prakash.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--ink)]/68">
              These patient guides are written by Dr. Satyarth Prakash. Other substantive Radiance medical content is reviewed for clinical accuracy before publication or update.
            </p>
            <Link
              href="/editorial-policy"
              className="mt-7 inline-flex text-sm font-extrabold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
            >
              Read the editorial policy
            </Link>
          </div>
          <div className="grid gap-3">
            {reviewedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}`}
                className="group flex items-start justify-between gap-5 border-t border-[var(--ink)]/14 py-5"
              >
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                    {article.authorType === "doctor" ? "Written by Dr. Satyarth Prakash" : "Knowledge guide"}
                  </span>
                  <span className="mt-2 block text-lg font-extrabold leading-7 text-[var(--ink)]">
                    {article.title}
                  </span>
                </span>
                <span className="text-[var(--aqua)]">&rarr;</span>
              </Link>
            ))}
            {relatedAnswers.map((answer) => (
              <Link
                key={answer.slug}
                href={`/doctor-answers/${answer.slug}`}
                className="group flex items-start justify-between gap-5 border-t border-[var(--ink)]/14 py-5"
              >
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                    Doctor answer
                  </span>
                  <span className="mt-2 block text-lg font-extrabold leading-7 text-[var(--ink)]">
                    {answer.question}
                  </span>
                </span>
                <span className="text-[var(--aqua)]">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedVideos
        videos={profileVideos}
        title="Watch relevant explanations from Radiance."
      />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
            External coverage
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">
            Media references connected to Radiance Clinics.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {featuredMediaCoverage.map((item) => (
              <a
                key={item.id}
                href={item.originalArticleUrl}
                target="_blank"
                rel="noreferrer"
                className="group border-t border-[var(--ink)]/14 py-5"
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                  {item.outletName} · {item.topicLabel}
                </span>
                <span className="mt-3 block text-xl font-extrabold leading-7 text-[var(--ink)]">
                  {item.articleTitle}
                </span>
              </a>
            ))}
          </div>
          <Link
            href="/media"
            className="mt-8 inline-flex text-sm font-extrabold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
          >
            View all selected media coverage
          </Link>
        </div>
      </section>

      <RelatedContent
        eyebrow="Treatment areas and patient guides"
        title="Explore doctor-led care at Radiance Clinics."
        items={[
          { href: "/treatments/hair-restoration", label: "Hair restoration", description: "Hair-loss assessment, transplant planning and scalp-support options." },
          { href: "/hair-transplant-bhubaneswar", label: "Hair transplant in Bhubaneswar", description: "Donor assessment, hairline planning and realistic restoration guidance." },
          { href: "/skin-clinic-bhubaneswar", label: "Skin clinic in Bhubaneswar", description: "Doctor-led assessment for acne, pigmentation, texture and skin ageing." },
          { href: "/treatments/skin", label: "Skin treatments", description: "Concern-led skin consultation and staged treatment planning." },
          { href: "/treatments/laser", label: "Laser treatments", description: "Skin-type aware laser planning, preparation and aftercare." },
          { href: "/treatments/aesthetic-dermatology", label: "Aesthetic dermatology", description: "Conservative planning focused on anatomy, expression and proportion." },
          { href: "/knowledge", label: "Patient knowledge library", description: "Read treatment and consultation guidance before booking." },
          { href: "/contact", label: "Contact Radiance Clinics", description: "Use the verified clinic address and appointment channels." },
        ]}
      />

      <section className="bg-[#FBF7EF] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeader
            eyebrow="Clinic philosophy"
            title="Premium does not mean excessive. It means precise."
            description="Radiance Clinics is designed for patients who want clear medical thinking, refined aesthetics and a composed environment."
          />
          <div className="rounded-[2.5rem] border border-[#151515]/10 bg-[#F7F1E8] p-8 shadow-[0_28px_90px_rgba(21,21,21,0.08)]">
            <div className="grid gap-6 md:grid-cols-3">
              {["Listen", "Assess", "Plan"].map((step) => (
                <div key={step}>
                  <p className="font-serif text-5xl text-[#B78A4A]">
                    {step}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#151515]/64">
                    A calm, transparent pathway before any intervention is
                    recommended.
                  </p>
                </div>
              ))}
            </div>
            <PremiumButton href="/contact" className="mt-10">
              Book consultation
            </PremiumButton>
          </div>
        </div>
      </section>
    </>
  );
}
