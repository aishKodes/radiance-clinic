import type { Metadata } from "next";
import { Award, Microscope, ShieldCheck, Sparkles } from "lucide-react";
import { DoctorAuthority } from "@/components/DoctorAuthority";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { fallbackData } from "@/data/fallback";
import { clinicFacts } from "@/data/clinic-facts";
import { getDoctorProfile } from "@/data/site";
import { webPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { physicianJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: `About ${fallbackData.siteSettings.doctor} | Radiance Clinics`,
  description:
    "Meet Dr. Satyarth Prakash and the doctor-led philosophy behind Radiance Clinics, Bhubaneswar.",
  path: "/about",
});

export default async function AboutPage() {
  const doctor = await getDoctorProfile();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: `About ${fallbackData.siteSettings.doctor}`,
          description:
            "Doctor-led aesthetic, skin, laser and hair restoration care at Radiance Clinics.",
          path: "/about",
        })}
      />
      <JsonLd data={physicianJsonLd()} />
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
