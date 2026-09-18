import { clinicFacts } from "@/data/clinic-facts";
import { radianceMedia } from "@/data/real-media";

export const doctorProfilePath = "/about";

// This is the single public record used for the doctor page, review modules
// and structured data. Fields that need clinic confirmation are intentionally
// omitted rather than inferred from marketing or legacy material.
export const satyarthPrakash = {
  id: "dr-satyarth-prakash",
  name: "Dr. Satyarth Prakash",
  role: "Founder and lead doctor at Radiance Clinics",
  experience: clinicFacts.clinicalExperience.value,
  profilePath: doctorProfilePath,
  profileImage: radianceMedia.doctorProfile,
  bio: "Dr. Satyarth Prakash leads doctor-led consultations at Radiance Clinics across hair restoration, skin, laser and aesthetic care. The consultation approach centres on assessment, safety and realistic treatment planning.",
  clinicalAreas: [
    {
      label: "Hair restoration",
      href: "/treatments/hair-restoration",
      description: "Hair-loss assessment, transplant planning and scalp-support pathways.",
    },
    {
      label: "Skin care",
      href: "/treatments/skin",
      description: "Concern-led planning for acne, scars, pigmentation and skin quality.",
    },
    {
      label: "Laser treatments",
      href: "/treatments/laser",
      description: "Skin-type aware suitability, preparation and aftercare guidance.",
    },
    {
      label: "Aesthetic dermatology",
      href: "/treatments/aesthetic-dermatology",
      description: "Conservative, anatomy-aware aesthetic treatment planning.",
    },
  ],
} as const;

export const radianceEditorialTeam = {
  id: "radiance-editorial-team",
  name: "Radiance Editorial Team",
  policyPath: "/editorial-policy",
} as const;

export const medicalEducationDisclaimer =
  "This content is intended for general patient education and does not replace an individual medical consultation. Diagnosis, treatment suitability, recovery and results vary between patients.";
