import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getClinicSettings } from "@/data/site";
import { medicalClinicJsonLd, webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a consultation at Radiance Clinics, Bhubaneswar for hair, skin, laser and aesthetic care.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const clinic = await getClinicSettings();
  const contactCards = [
    {
      label: "Call",
      value: clinic.phone,
      href: `tel:${clinic.phone.replace(/\s/g, "")}`,
      icon: Phone,
    },
    {
      label: "WhatsApp",
      value: "Start consultation chat",
      href: `https://wa.me/${clinic.whatsapp}`,
      icon: MessageCircle,
    },
    {
      label: "Email",
      value: clinic.email,
      href: `mailto:${clinic.email}`,
      icon: Mail,
    },
  ];

  return (
    <>
      <JsonLd data={medicalClinicJsonLd(clinic)} />
      <JsonLd
        data={webPageJsonLd({
          title: "Contact Radiance Clinics",
          description:
            "Book a consultation at Radiance Clinics, Bhubaneswar.",
          path: "/contact",
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeader
            eyebrow="Book consultation"
            title="Begin with a private, doctor-led assessment."
            description="Share your concern, timeline and expectations. The clinic team can guide you toward the right consultation route."
          />
          <div className="rounded-[2.5rem] border border-[#151515]/10 bg-[#151515] p-8 text-[#FBF7EF] shadow-[0_34px_100px_rgba(21,21,21,0.16)]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B78A4A]">
              Clinic hours
            </p>
            <p className="mt-5 font-serif text-5xl leading-none">
              {clinic.hours}
            </p>
            <p className="mt-6 flex gap-3 text-sm leading-7 text-[#FBF7EF]/64">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B78A4A]" />
              {clinic.address}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="group rounded-[2rem] border border-[#151515]/10 bg-white/58 p-7 shadow-[0_24px_80px_rgba(21,21,21,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#B78A4A]/45"
              >
                <Icon className="mb-12 h-6 w-6 text-[#1E6F86]" />
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B78A4A]">
                  {item.label}
                </p>
                <p className="mt-4 text-lg font-bold text-[#151515]">
                  {item.value}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="bg-[#151515] px-5 py-24 text-center text-[#FBF7EF] sm:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[#B78A4A]">
            Radiance Clinics, Bhubaneswar
          </p>
          <h2 className="font-serif text-5xl leading-[0.94] sm:text-7xl">
            Plan the treatment only after the diagnosis is clear.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#FBF7EF]/68">
            Hair, skin, laser and aesthetic decisions deserve time, privacy and
            medical judgement.
          </p>
          <PremiumButton
            href={`https://wa.me/${clinic.whatsapp}`}
            variant="ivory"
            className="mt-10"
          >
            Message on WhatsApp
          </PremiumButton>
        </div>
      </section>
    </>
  );
}
