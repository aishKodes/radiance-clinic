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

export const defaultSocialImage =
  "/radiance-media-processed/portrait/doctor-hero.webp";

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
  physician: `${canonicalOrigin}/about#physician`,
} as const;

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

export const legacyRedirects: LegacyRedirect[] = [
  {
    source: "/treatment/hairfall/prp",
    destination: "/treatments/hair-restoration/prp-gfc-scalp-therapy",
    permanent: true,
  },
  {
    source: "/treatment/hairfall/gfc",
    destination: "/treatments/hair-restoration/prp-gfc-scalp-therapy",
    permanent: true,
  },
  {
    source: "/hair-loss-treatments",
    destination: "/hair-transplant-bhubaneswar",
    permanent: true,
  },
  {
    source: "/skin-care-treatments",
    destination: "/skin-clinic-bhubaneswar",
    permanent: true,
  },
  {
    source: "/acne-scars",
    destination: "/acne-scar-treatment-bhubaneswar",
    permanent: true,
  },
  {
    source: "/mole-wart-removal",
    destination: "/skin-clinic-bhubaneswar",
    permanent: true,
  },
  {
    source: "/laser-hair-removal-radiance",
    destination: "/laser-hair-removal-bhubaneswar",
    permanent: true,
  },
  {
    source: "/fillers",
    destination: "/treatments/aesthetic-dermatology/injectable-aesthetics",
    permanent: true,
  },
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  {
    source: "/dermatology-clinic-in-bhubaneswar",
    destination: "/skin-clinic-bhubaneswar",
    permanent: true,
  },
  {
    source: "/treatment/anti-ageing-therapies/ultherapy",
    destination: "/conditions/skin-ageing-laxity",
    permanent: true,
  },
  {
    source: "/post/a-complete-guide-to-know-about-botox-treatment",
    destination: "/treatments/aesthetic-dermatology/injectable-aesthetics",
    permanent: true,
  },
  ...[
    "cuttack",
    "puri",
    "rourkela",
    "sambalpur",
    "berhampur",
    "baripada",
  ].map((city) => ({
    source: `/hair-transplant-in-${city}`,
    destination: "/hair-transplant-bhubaneswar",
    permanent: true as const,
  })),
];

export const treatmentNavigationGroups = [
  {
    label: "Hair",
    links: [
      { label: "Hair restoration overview", href: "/treatments/hair-restoration" },
      { label: "Hair transplant in Bhubaneswar", href: "/hair-transplant-bhubaneswar" },
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
      { label: "Skin clinic in Bhubaneswar", href: "/skin-clinic-bhubaneswar" },
      { label: "Acne scar treatment", href: "/acne-scar-treatment-bhubaneswar" },
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
    ],
  },
  {
    label: "Aesthetic Dermatology",
    links: [
      { label: "Aesthetic dermatology overview", href: "/treatments/aesthetic-dermatology" },
      {
        label: "Injectables and fillers",
        href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
      },
      { label: "Skin ageing and laxity", href: "/conditions/skin-ageing-laxity" },
    ],
  },
] as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
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
