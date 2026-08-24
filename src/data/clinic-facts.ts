import type { HomepageContent, ProofStat, Stat } from "@/types/cms";

export const clinicFacts = {
  clinicalExperience: {
    value: "20+",
    label: "Years of Clinical Experience",
    description: "Doctor-led hair, skin, laser and aesthetic care.",
  },
  happyClients: {
    value: "60,000+",
    label: "Happy Clients",
    description: "Clients have visited Radiance for hair, skin, laser and aesthetic concerns.",
  },
  heroEyebrow:
    "20+ Years of Clinical Experience | US FDA Approved Technology | Doctor-Led Care",
} as const;

function verifiedStat<T extends Stat | ProofStat>(stat: T): T {
  const identity = `${stat.icon || ""} ${stat.label}`.toLowerCase();

  if (/experience|years/.test(identity)) {
    return { ...stat, ...clinicFacts.clinicalExperience };
  }

  if (/patient|client/.test(identity)) {
    return { ...stat, ...clinicFacts.happyClients };
  }

  return stat;
}

export function applyVerifiedClinicFacts(homepage: HomepageContent): HomepageContent {
  return {
    ...homepage,
    heroEyebrow: clinicFacts.heroEyebrow,
    stats: homepage.stats.map(verifiedStat),
    proofStats: homepage.proofStats.map(verifiedStat),
  };
}
