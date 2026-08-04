import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getClinicSettings, getReviews, reviewCategories } from "@/data/site";
import {
  breadcrumbJsonLd,
  medicalClinicJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Patient Reviews",
  description:
    "Permission-confirmed Radiance Clinics patient reviews and clinic experience notes for hair, skin, laser and aesthetic care.",
  alternates: {
    canonical: "/reviews",
  },
};

export default async function ReviewsPage() {
  const [reviews, clinic] = await Promise.all([
    getReviews(),
    getClinicSettings(),
  ]);
  const featured = reviews.filter((review) => review.featured).slice(0, 6);
  const visibleReviews = featured.length ? featured : reviews.slice(0, 9);

  return (
    <>
      <JsonLd data={medicalClinicJsonLd(clinic)} />
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance Clinics Patient Reviews",
          description:
            "Permission-confirmed patient reviews and clinic experience notes.",
          path: "/reviews",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />

      <section className="relative overflow-hidden bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(42,195,214,0.18),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,123,97,0.18),transparent_30%),radial-gradient(circle_at_62%_82%,rgba(124,77,255,0.12),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--aqua)]">
              Patient reviews
            </p>
            <h1 className="font-serif text-[clamp(4.6rem,10vw,9rem)] leading-[0.86] tracking-normal text-[var(--ink)]">
              Patient experiences at Radiance Clinics.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">
              Read what patients have shared about consultations, clinic care
              and treatment support. Individual experiences and results vary.
            </p>
          </div>
          <div className="rounded-[2.25rem] border border-white/60 bg-white/55 p-7 shadow-[0_30px_100px_rgba(16,16,20,0.11)] backdrop-blur-2xl">
            <ShieldCheck className="mb-8 h-7 w-7 text-[var(--aqua)]" />
            <p className="font-serif text-4xl leading-none text-[var(--ink)]">
              Reviews shared with permission.
            </p>
            <p className="mt-5 text-sm leading-7 text-[var(--ink)]/62">
              Published reviews reflect personal experiences and are not a
              promise of the same treatment result for every patient.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {reviewCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/reviews/${category.slug}`}
              className="group rounded-[2rem] border border-[var(--ink)]/10 bg-white/60 p-6 shadow-[0_24px_90px_rgba(16,16,20,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--aqua)]/50"
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white">
                  {category.label}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[var(--bronze)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="text-sm leading-7 text-[var(--ink)]/64">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Published reviews"
            title="What patients have shared."
            description="Patient comments are presented with consent and appropriate context. Experiences can differ according to the concern and treatment plan."
          />
          {visibleReviews.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleReviews.map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.slug}`}
                  className="group flex min-h-80 flex-col rounded-[2rem] border border-[var(--ink)]/10 bg-white/60 p-7 shadow-[0_24px_90px_rgba(16,16,20,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--bronze)]/45"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[var(--aqua)]">
                      {review.treatmentCategory.replaceAll("-", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[var(--bronze)]">
                      {Array.from({ length: Math.round(review.rating) }).map(
                        (_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ),
                      )}
                    </span>
                  </div>
                  <p className="flex-1 text-lg leading-8 text-[var(--ink)]/72">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-[var(--ink)]/10 pt-5">
                    <span className="font-bold text-[var(--ink)]">
                      {review.reviewerName}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[var(--bronze)]" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2.5rem] border border-[var(--ink)]/10 bg-white/60 p-8 shadow-[0_24px_90px_rgba(16,16,20,0.08)] backdrop-blur">
              <MessageCircle className="mb-8 h-7 w-7 text-[var(--aqua)]" />
              <h2 className="font-serif text-5xl leading-none text-[var(--ink)]">
                More patient reviews will be added after clinic review.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ink)]/64">
                Contact the clinic directly for consultation guidance and help
                choosing the appropriate appointment.
              </p>
              <PremiumButton href="/contact" className="mt-8">
                Contact Radiance Clinics
              </PremiumButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
