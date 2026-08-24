import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  clinicIdentity,
  directionsUrl,
  socialProfiles,
  treatmentNavigationGroups,
} from "@/lib/seo-config";
import { medicalReviewer } from "@/data/concern-library";
import type { ClinicSettings } from "@/types/cms";
import { ConversionLink } from "@/components/ConversionLink";
import { clinicFacts } from "@/data/clinic-facts";

const clinicLinks = [
  { label: "About the doctor", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Concern library", href: "/concerns" },
  { label: "Doctor answers", href: "/doctor-answers" },
  { label: "Legacy conditions", href: "/conditions" },
  { label: "Patient results", href: "/results" },
  { label: "Interactive comparisons", href: "/before-after" },
  { label: "Patient reviews", href: "/reviews" },
  { label: "Knowledge library", href: "/knowledge" },
  { label: "Video library", href: "/videos" },
  { label: "Contact and directions", href: "/contact" },
  { label: "Visiting from across Odisha", href: "/locations" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

export function SiteFooter({ settings }: { settings: ClinicSettings }) {
  const featuredTreatmentLinks: { label: string; href: string }[] =
    treatmentNavigationGroups.flatMap((group) =>
      (group.links as readonly { label: string; href: string }[]).slice(0, 2),
    );

  return (
    <footer className="border-t border-white/10 bg-[var(--ink)] px-5 pb-28 pt-16 text-[var(--ivory)] sm:px-8 sm:pb-12 lg:pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.75fr_0.95fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl text-white">
            Radiance Clinics
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">
            Doctor-led hair, skin, laser and aesthetic care in Bhubaneswar.
          </p>
          <address className="mt-7 space-y-4 text-sm not-italic leading-6 text-white/70">
            <a
              href={directionsUrl(settings.address)}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 transition hover:text-white"
            >
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--champagne)]" />
              <span>{settings.address}</span>
            </a>
            <div className="flex gap-3">
              <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--champagne)]" />
              <div className="flex flex-col gap-1">
                {settings.landline ? (
                  <ConversionLink href={`tel:${clinicIdentity.landlineTel}`} eventName="call_click" className="hover:text-white">
                    {settings.landline}
                  </ConversionLink>
                ) : null}
                <ConversionLink href={`tel:${clinicIdentity.primaryPhoneTel}`} eventName="call_click" className="hover:text-white">
                  {settings.phone}
                </ConversionLink>
                {settings.secondaryPhone ? (
                  <ConversionLink href={`tel:${clinicIdentity.secondaryPhoneTel}`} eventName="call_click" className="hover:text-white">
                    {settings.secondaryPhone}
                  </ConversionLink>
                ) : null}
              </div>
            </div>
            <a href={`mailto:${settings.email}`} className="flex gap-3 hover:text-white">
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--champagne)]" />
              {settings.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--champagne)]">
            Clinic
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-white/68">
            {clinicLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--champagne)]">
            Treatment information
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-white/68">
            {featuredTreatmentLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--champagne)]">
            Official profiles
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-white/68">
            {socialProfiles.map((profile) => (
              <li key={profile.href}>
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Radiance Clinics on ${profile.label}`}
                  className="transition hover:text-white"
                >
                  {profile.label}
                </a>
              </li>
            ))}
          </ul>
          <ConversionLink
            href="/contact"
            eventName="book_appointment_click"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--champagne)] px-5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:bg-white"
          >
            Book appointment
          </ConversionLink>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/58 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {settings.legalName}</p>
        <p>Medical content reviewed by <Link href={medicalReviewer.profilePath} className="text-white underline decoration-white/50 underline-offset-2 hover:decoration-white">{medicalReviewer.name}</Link> · {clinicFacts.clinicalExperience.value} years of clinical experience · General information, not a consultation.</p>
      </div>
    </footer>
  );
}
