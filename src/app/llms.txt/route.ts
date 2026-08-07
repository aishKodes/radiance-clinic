import {
  getArticles,
  getClinicSettings,
  getConditions,
  getReviews,
  getTreatments,
  reviewCategories,
} from "@/data/site";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const [clinic, treatments, conditions, articles, reviews] = await Promise.all([
    getClinicSettings(),
    getTreatments(),
    getConditions(),
    getArticles(),
    getReviews(),
  ]);

  const lines = [
    "# Radiance Clinics",
    "",
    `Website: ${siteUrl}`,
    `Clinic: ${clinic.name}, ${clinic.city}, ${clinic.region}`,
    `Doctor: ${clinic.doctor}`,
    "",
    "This site provides general service, appointment and clinic information only. It does not provide medical diagnosis, prescription, treatment guarantees or emergency advice.",
    "",
    "## Key Pages",
    `- Home: ${siteUrl}/`,
    `- Treatments: ${siteUrl}/treatments`,
    `- Hair Restoration: ${siteUrl}/treatments/hair-restoration`,
    `- Skin Treatments: ${siteUrl}/treatments/skin`,
    `- Laser Treatments: ${siteUrl}/treatments/laser`,
    `- Aesthetic Dermatology: ${siteUrl}/treatments/aesthetic-dermatology`,
    `- Conditions: ${siteUrl}/conditions`,
    `- Knowledge Library: ${siteUrl}/knowledge`,
    `- Before/After Policy: ${siteUrl}/before-after`,
    `- Patient Results: ${siteUrl}/results`,
    `- Clinic Location and Outstation Visits: ${siteUrl}/locations`,
    `- Reviews: ${siteUrl}/reviews`,
    `- Contact: ${siteUrl}/contact`,
    ...(reviews.length
      ? [
          "",
          "## Review Categories",
          ...reviewCategories
            .filter((category) =>
              reviews.some(
                (review) => review.treatmentCategory === category.slug,
              ),
            )
            .map(
              (category) =>
                `- ${category.label}: ${siteUrl}/reviews/${category.slug}`,
            ),
        ]
      : []),
    "",
    "## Treatments",
    ...treatments.map((item) => `- ${item.title}: ${siteUrl}/treatments/${item.cluster}/${item.slug}`),
    "",
    "## Conditions",
    ...conditions.map((item) => `- ${item.title}: ${siteUrl}/conditions/${item.slug}`),
    "",
    "## Articles",
    ...articles.map((item) => `- ${item.title}: ${siteUrl}/knowledge/${item.slug}`),
    "",
    "## Published Reviews",
    ...(reviews.length
      ? reviews.map((item) => `- Review from ${item.reviewerName}: ${siteUrl}/reviews/${item.slug}`)
      : [`- Current patient reviews: ${siteUrl}/reviews`]),
    "",
    "## Contact",
    `- Phone: ${clinic.phone || "Contact page"}`,
    ...(clinic.secondaryPhone
      ? [`- Alternate phone: ${clinic.secondaryPhone}`]
      : []),
    `- WhatsApp: ${clinic.whatsapp || "Contact page"}`,
    `- Address: ${clinic.address || `${clinic.city}, ${clinic.region}`}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
