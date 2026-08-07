import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getClinicSettings } from "@/data/site";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import {
  clinicIdentity,
  directionsUrl,
  normalizedTel,
} from "@/lib/seo-config";

export const metadata: Metadata = pageMetadata({
  title: "Contact Radiance Clinics Bhubaneswar",
  description:
    "Contact Radiance Clinics in Nayapalli, Bhubaneswar for doctor-led hair, skin, laser and aesthetic consultation appointments.",
  path: "/contact",
});

export default async function ContactPage() {
  const clinic = await getClinicSettings();
  const contactCards = [
    {
      label: "Call clinic",
      value: clinic.phone,
      href: `tel:${normalizedTel(clinic.phone)}`,
      icon: Phone,
    },
    ...(clinic.secondaryPhone
      ? [
          {
            label: "Alternate number",
            value: clinic.secondaryPhone,
            href: `tel:${normalizedTel(clinic.secondaryPhone)}`,
            icon: Phone,
          },
        ]
    : []),
    ...(clinic.landline
      ? [
          {
            label: "Clinic landline",
            value: clinic.landline,
            href: `tel:${clinicIdentity.landlineTel}`,
            icon: Phone,
          },
        ]
      : []),
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
      <JsonLd
        data={webPageJsonLd({
          title: "Contact Radiance Clinics",
          description:
            "Book a consultation at Radiance Clinics, Bhubaneswar.",
          path: "/contact",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Contact", path: "/contact" },
              ]}
            />
            <SectionHeader
              level="h1"
              eyebrow="Book consultation"
              title="Contact Radiance Clinics in Bhubaneswar."
              description="Share your concern, timeline and expectations. The clinic team can guide you toward the right consultation route."
            />
          </div>
          <div className="rounded-[2.5rem] border border-[#151515]/10 bg-[#151515] p-8 text-[#FBF7EF] shadow-[0_34px_100px_rgba(21,21,21,0.16)]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B78A4A]">
              Clinic address
            </p>
            <p className="mt-6 flex gap-3 text-sm leading-7 text-[#FBF7EF]/64">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B78A4A]" />
              {clinic.address}
            </p>
            <a
              href={directionsUrl(clinic.address)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#B78A4A] hover:text-white"
            >
              Get directions
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-5">
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

      <section className="bg-[#FBF7EF] px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-[#151515]/10 bg-white">
          <iframe
            title="Map showing Radiance Clinics in Nayapalli, Bhubaneswar"
            src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[22rem] w-full border-0 lg:h-[28rem]"
          />
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
