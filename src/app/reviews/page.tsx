import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getReviews } from "@/data/site";
import { getGoogleReviewsFeed } from "@/lib/google-reviews";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Radiance Clinics Reviews in Bhubaneswar",
  description:
    "Read Google and patient reviews of Radiance Clinics in Bhubaneswar for hair transplant, skin, laser and aesthetic care.",
  path: "/reviews",
});

const treatmentLinks = [
  {
    title: "Hair Transplant",
    description:
      "Hair restoration planning, FUE treatment and result examples.",
    href: "/hair-transplant-bhubaneswar",
  },
  {
    title: "Skin Clinic",
    description:
      "Doctor-led care for acne, scars, pigmentation and skin health.",
    href: "/skin-clinic-bhubaneswar",
  },
  {
    title: "Laser Hair Removal",
    description:
      "Laser hair reduction planned for skin type and treatment area.",
    href: "/laser-hair-removal-bhubaneswar",
  },
];

function reviewDate(value?: string, relativeValue?: string) {
  if (relativeValue) return relativeValue;
  if (!value) return "Google review";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Google review";

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function reviewCount(value?: number) {
  return value ? new Intl.NumberFormat("en-IN").format(value) : undefined;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[var(--bronze)]"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`h-4 w-4 ${
            index < Math.round(rating) ? "fill-current" : "opacity-25"
          }`}
        />
      ))}
    </span>
  );
}

export default async function ReviewsPage() {
  const [clinicReviews, googleReviews] = await Promise.all([
    getReviews(),
    getGoogleReviewsFeed(),
  ]);
  const featuredClinicReviews = clinicReviews
    .filter((review) => review.featured)
    .slice(0, 6);
  const visibleClinicReviews = featuredClinicReviews.length
    ? featuredClinicReviews
    : clinicReviews.slice(0, 6);
  const visibleGoogleReviews = googleReviews.reviews.slice(0, 12);
  const formattedReviewCount = reviewCount(googleReviews.totalReviewCount);
  const hasGoogleSummary = Boolean(
    googleReviews.rating || googleReviews.totalReviewCount,
  );

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance Clinics Reviews in Bhubaneswar",
          description:
            "Google and patient feedback about consultations and care at Radiance Clinics, Bhubaneswar.",
          path: "/reviews",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />

      <section className="bg-[var(--ivory)] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--aqua)]">
              Patient reviews
            </p>
            <h1 className="font-serif text-[clamp(3.35rem,7vw,6.75rem)] leading-[0.9] tracking-normal text-[var(--ink)]">
              Radiance Clinics reviews in Bhubaneswar.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--ink)]/68 sm:text-lg">
              Read patient feedback about doctor-led consultations, clinic care
              and treatment support for hair, skin, laser and aesthetic
              concerns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href={googleReviews.googleMapsUrl}>
                Read Google reviews
              </PremiumButton>
              <PremiumButton href="/contact" variant="outline">
                Book consultation
              </PremiumButton>
            </div>
          </div>

          <aside className="rounded-[1.5rem] bg-[var(--ink)] p-6 text-[var(--ivory)] shadow-[0_28px_90px_rgba(15,16,22,0.16)] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--champagne)] text-[var(--ink)]">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
                Google
              </span>
            </div>
            {hasGoogleSummary ? (
              <>
                <p className="mt-9 font-serif text-6xl leading-none text-white">
                  {googleReviews.rating?.toFixed(1) || "Google"}
                </p>
                <StarRating rating={googleReviews.rating || 5} />
                {formattedReviewCount ? (
                  <p className="mt-4 text-sm font-bold text-white/72">
                    {formattedReviewCount} Google reviews
                  </p>
                ) : null}
                <p className="mt-5 text-sm leading-7 text-white/58">
                  Rating and review count are supplied by the clinic&apos;s
                  Google profile.
                </p>
              </>
            ) : (
              <>
                <p className="mt-9 font-serif text-4xl leading-none text-white">
                  Current patient feedback on Google.
                </p>
                <p className="mt-5 text-sm leading-7 text-white/62">
                  Visit the official profile for the latest rating, review count
                  and patient comments.
                </p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section
        id="google-reviews"
        className="bg-[var(--mist)] px-5 py-16 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Google reviews"
            title={
              visibleGoogleReviews.length
                ? "Recent feedback from patients."
                : "Read current reviews on Google."
            }
            description={
              visibleGoogleReviews.length
                ? "Recent written reviews supplied directly by Google. Visit the clinic profile to see the complete and most current review history."
                : "The clinic's Google profile carries the latest rating, review count and patient feedback in one place."
            }
          />

          {visibleGoogleReviews.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleGoogleReviews.map((review) => (
                <article
                  key={review.id}
                  className="flex min-h-72 min-w-0 flex-col rounded-[1.25rem] border border-[var(--ink)]/10 bg-white/72 p-6 shadow-[0_20px_65px_rgba(15,16,22,0.07)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <StarRating rating={review.rating} />
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-[var(--aqua)]">
                      Google review
                    </span>
                  </div>
                  <blockquote className="mt-7 line-clamp-7 flex-1 text-base leading-7 text-[var(--ink)]/72">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <footer className="mt-7 flex items-end justify-between gap-4 border-t border-[var(--ink)]/10 pt-5">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[var(--ink)]">
                        {review.reviewerName}
                      </p>
                      <p className="mt-1 text-xs text-[var(--ink)]/48">
                        {reviewDate(
                          review.publishedAt,
                          review.relativePublishedAt,
                        )}
                      </p>
                    </div>
                    <Link
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${review.reviewerName}'s review on Google`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--ink)]/10 text-[var(--bronze)] transition hover:border-[var(--bronze)]/45 hover:bg-[var(--ivory)]"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 rounded-[1.5rem] bg-[var(--ink)] p-7 text-[var(--ivory)] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <MapPin className="h-7 w-7 text-[var(--aqua)]" />
                <h2 className="mt-6 font-serif text-4xl leading-none">
                  Open the official Radiance Clinics profile.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64">
                  View the latest patient comments, rating and directions
                  directly on Google.
                </p>
              </div>
              <PremiumButton href={googleReviews.googleMapsUrl} variant="ivory">
                View Google reviews
              </PremiumButton>
            </div>
          )}
        </div>
      </section>

      {visibleClinicReviews.length ? (
        <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Patient experiences"
              title="Feedback shared with the clinic."
              description="These comments describe individual experiences with consultation and care. Treatment experiences and results vary."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleClinicReviews.map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.slug}`}
                  className="group flex min-h-72 flex-col rounded-[1.25rem] border border-[var(--ink)]/10 bg-white/64 p-6 shadow-[0_20px_65px_rgba(15,16,22,0.07)] transition hover:-translate-y-1 hover:border-[var(--bronze)]/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--aqua)]">
                      {review.treatmentCategory.replaceAll("-", " ")}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-7 line-clamp-7 flex-1 text-base leading-7 text-[var(--ink)]/72">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                  <div className="mt-7 flex items-center justify-between border-t border-[var(--ink)]/10 pt-5">
                    <span className="font-bold text-[var(--ink)]">
                      {review.reviewerName}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--bronze)]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Explore care options"
            title="Continue with the treatment information you need."
            description="Review doctor-led treatment information, suitability guidance and consultation options for common concerns in Bhubaneswar."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {treatmentLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-52 flex-col rounded-[1.25rem] border border-[var(--ink)]/10 bg-[var(--mist)] p-6 transition hover:border-[var(--aqua)]/45 hover:bg-white"
              >
                <h3 className="font-serif text-3xl leading-none text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">
                  {item.description}
                </p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">
                  View treatment information
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-5 rounded-[1.5rem] border border-[var(--ink)]/10 bg-white/72 p-7 sm:p-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <ShieldCheck className="h-7 w-7 text-[var(--aqua)]" />
              <h2 className="mt-5 font-serif text-4xl leading-none text-[var(--ink)]">
                Reviews inform; consultation personalises care.
              </h2>
            </div>
            <div>
              <p className="text-sm leading-7 text-[var(--ink)]/64">
                Patient feedback can help you understand the clinic experience,
                but suitability, treatment choice and expected response require
                an individual medical consultation.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href="/contact" icon={CalendarCheck}>
                  Book appointment
                </PremiumButton>
                <PremiumButton
                  href={googleReviews.googleMapsUrl}
                  variant="outline"
                  icon={MessageCircle}
                >
                  All Google reviews
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
