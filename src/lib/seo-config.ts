import legacyRedirectRecords from "../data/legacy-redirects.json";

export const canonicalOrigin = "https://www.radianceclinics.com";

export const clinicIdentity = {
  name: "Radiance Skin & Hair Clinics",
  shortName: "Radiance Clinics",
  legalName: "Radiance Skin & Hair Clinics",
  doctor: "Dr. Satyarth Prakash",
  streetAddress: "Plot No. N/1-46, IRC Village, First Lane, Nayapalli",
  city: "Bhubaneswar",
  region: "Odisha",
  postalCode: "751015",
  countryCode: "IN",
  address:
    "Plot No. N/1-46, IRC Village, First Lane, Nayapalli, Bhubaneswar, Odisha 751015",
  landline: "0674 2552550",
  landlineTel: "+916742552550",
  primaryPhone: "+91 92383 21888",
  primaryPhoneTel: "+919238321888",
  secondaryPhone: "+91 92381 22550",
  secondaryPhoneTel: "+919238122550",
  whatsapp: "919238321888",
  email: "radiance.clinics@gmail.com",
} as const;

export const defaultSocialImage = "/og.png";

export const socialProfiles = [
  {
    label: "Instagram",
    href: "https://instagram.com/radianceskinandhairclinic",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@radianceclinics",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/RadianceSkinandHairClinics",
  },
] as const;

export const schemaIds = {
  organization: `${canonicalOrigin}/#organization`,
  clinic: `${canonicalOrigin}/#clinic`,
  website: `${canonicalOrigin}/#website`,
  doctor: `${canonicalOrigin}/about#person`,
  // Keep the historical property name as an alias while all structured data
  // moves to one stable person entity.
  physician: `${canonicalOrigin}/about#person`,
  editorialTeam: `${canonicalOrigin}/editorial-policy#editorial-team`,
} as const;

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

export const legacyRedirects: LegacyRedirect[] = legacyRedirectRecords.map(
  ({ source, destination }) => ({ source, destination, permanent: true }),
);

export const treatmentNavigationGroups = [
  {
    label: "Hair",
    links: [
      {
        label: "Hair restoration overview",
        href: "/treatments/hair-restoration",
      },
      {
        label: "Hair transplant in Bhubaneswar",
        href: "/hair-transplant-bhubaneswar",
      },
      {
        label: "Hair loss clinic in Bhubaneswar",
        href: "/hair-loss-clinic-bhubaneswar",
      },
      {
        label: "Alopecia areata assessment",
        href: "/alopecia-areata-treatment-bhubaneswar",
      },
      {
        label: "Hair patches, wigs and non-surgical replacement",
        href: "/non-surgical-hair-replacement-bhubaneswar",
      },
      {
        label: "FUE hair transplant planning",
        href: "/treatments/hair-restoration/fue-hair-transplant",
      },
      {
        label: "PRP / GFC scalp therapy",
        href: "/treatments/hair-restoration/prp-gfc-scalp-therapy",
      },
    ],
  },
  {
    label: "Skin",
    links: [
      { label: "Skin treatments overview", href: "/treatments/skin" },
      {
        label: "Skin clinic and specialist consultation in Bhubaneswar",
        href: "/skin-clinic-bhubaneswar",
      },
      { label: "Active acne treatment", href: "/acne-treatment-bhubaneswar" },
      {
        label: "Acne scar treatment",
        href: "/acne-scar-treatment-bhubaneswar",
      },
      { label: "Wart removal assessment", href: "/wart-removal-bhubaneswar" },
      {
        label: "Pigmentation treatment",
        href: "/pigmentation-treatment-bhubaneswar",
      },
    ],
  },
  {
    label: "Laser",
    links: [
      { label: "Laser treatments overview", href: "/treatments/laser" },
      {
        label: "Laser hair removal",
        href: "/laser-hair-removal-bhubaneswar",
      },
      {
        label: "Laser pigmentation program",
        href: "/treatments/skin-laser/laser-pigmentation-program",
      },
      {
        label: "Acne scar revision",
        href: "/treatments/skin-laser/acne-scar-revision",
      },
      {
        label: "Laser tattoo removal",
        href: "/tattoo-removal-bhubaneswar",
      },
    ],
  },
  {
    label: "Aesthetic Dermatology",
    links: [
      {
        label: "Aesthetic dermatology overview",
        href: "/treatments/aesthetic-dermatology",
      },
      {
        label: "Injectables and fillers",
        href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
      },
      { label: "Botox treatment", href: "/botox-treatment-bhubaneswar" },
      { label: "Dermal fillers", href: "/dermal-fillers-bhubaneswar" },
      {
        label: "Skin ageing and laxity",
        href: "/conditions/skin-ageing-laxity",
      },
    ],
  },
] as const;

export function absoluteUrl(path = "/") {
  const normalizedPath =
    path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${canonicalOrigin}${normalizedPath}`;
}

export function normalizedTel(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("0")) return `+91${digits.slice(1)}`;
  return value.startsWith("+") ? value : `+${digits}`;
}

export function directionsUrl(address: string = clinicIdentity.address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
