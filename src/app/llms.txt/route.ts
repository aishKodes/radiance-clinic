import {
  getArticles,
  getClinicSettings,
  getConditions,
  getTreatments,
} from "@/data/site";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const [clinic, treatments, conditions, articles] = await Promise.all([
    getClinicSettings(),
    getTreatments(),
    getConditions(),
    getArticles(),
  ]);

  const lines = [
    "# Radiance Skin & Hair Clinics",
    "",
    `Radiance Skin & Hair Clinics is a doctor-led clinic in Nayapalli, Bhubaneswar. Clinical information on this website is presented for patient education and appointment planning and does not replace an individual consultation.`,
    "",
    "## Important Pages",
    `- [Home](${siteUrl}/)`,
    `- [About Radiance Clinics](${siteUrl}/about)`,
    `- [Dr. Satyarth Prakash](${siteUrl}/about)`,
    `- [Hair Transplant in Bhubaneswar](${siteUrl}/hair-transplant-bhubaneswar)`,
    `- [Skin Clinic in Bhubaneswar](${siteUrl}/skin-clinic-bhubaneswar)`,
    `- [Acne Scar Treatment](${siteUrl}/acne-scar-treatment-bhubaneswar)`,
    `- [Laser Hair Reduction](${siteUrl}/laser-hair-removal-bhubaneswar)`,
    `- [Concerns Library](${siteUrl}/concerns)`,
    `- [Doctor Answers](${siteUrl}/doctor-answers)`,
    `- [Knowledge Library](${siteUrl}/knowledge)`,
    `- [Treatment Results](${siteUrl}/results)`,
    `- [Contact and Appointments](${siteUrl}/contact)`,
    "",
    "## Main Topics",
    `- [Hair Loss](${siteUrl}/concerns/hair-loss-scalp)`,
    `- [Hair Transplant](${siteUrl}/concerns/hair-transplant)`,
    `- [Scalp](${siteUrl}/concerns/hair-loss-scalp)`,
    `- [Acne](${siteUrl}/concerns/acne)`,
    `- [Acne Scars](${siteUrl}/concerns/acne-scars)`,
    `- [Pigmentation](${siteUrl}/concerns/pigmentation)`,
    `- [Laser Hair Reduction](${siteUrl}/concerns/laser-hair-reduction)`,
    `- [Aesthetic Dermatology](${siteUrl}/treatments/aesthetic-dermatology)`,
    "",
    "## Current Treatments",
    ...treatments.map((item) => `- [${item.title}](${siteUrl}/treatments/${item.cluster}/${item.slug})`),
    "",
    "## Patient Guides",
    ...articles.map((item) => `- [${item.title}](${siteUrl}/knowledge/${item.slug})`),
    "",
    "## Conditions",
    ...conditions.map((item) => `- [${item.title}](${siteUrl}/conditions/${item.slug})`),
    "",
    "## Official Media",
    `- [Radiance Clinics YouTube channel](https://www.youtube.com/@RadianceClinics)`,
    `- [Official video library](${siteUrl}/videos)`,
    `- [Hair restoration video guides](${siteUrl}/videos#hair-restoration-video-guides)`,
    "",
    `Clinic: ${clinic.name}, ${clinic.city}, ${clinic.region}`,
    `Doctor: ${clinic.doctor}`,
    `Address: ${clinic.address || `${clinic.city}, ${clinic.region}`}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
