import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, ShieldCheck, Star } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import {
  getClinicSettings,
  getReview,
  getReviews,
  getReviewStaticParams,
  isReviewCategory,
  reviewCategories,
} from "@/data/site";
import {
  breadcrumbJsonLd,
  reviewJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getReviewStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = reviewCategories.find((item) => item.slug === slug);

  if (category) {
    return {
      title: `${category.label} Reviews`,
      description: category.description,
      alternates: {
        canonical: `/reviews/${slug}`,
      },
    };
  }

  const review = await getReview(slug);

  if (!review) {
    return { title: "Review" };
  }

  return {
    title: `Review from ${review.reviewerName}`,
    description: review.reviewText.slice(0, 155),
    alternates: {
      canonical: `/reviews/${slug}`,
    },
  };
}

export default async function ReviewRoutePage({ params }: Props) {
  const { slug } = await params;

  if (isReviewCategory(slug)) {
    return <ReviewCategoryPage slug={slug} />;
  }

  const [review, clinic] = await Promise.all([
    getReview(slug),
    getClinicSettings(),
  ]);

  if (!review) {
    notFound();
  }

  return (
    <>
      <JsonLd data={reviewJsonLd(review, clinic)} />
      <JsonLd
        data={webPageJsonLd({
          title: `Review from ${review.reviewerName}`,
          description: review.reviewText,
          path: `/reviews/${slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
          { name: review.reviewerName, path: `/reviews/${slug}` },
        ])}
      />

      <section className="relative overflow-hidden bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(42,195,214,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(255,123,97,0.16),transparent_32%),radial-gradient(circle_at_58%_82%,rgba(124,77,255,0.12),transparent_34%)]" />
        <article className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.38fr]">
          <div>
            <Link
              href="/reviews"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[var(--ink)]/54 transition hover:text-[var(--ink)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Reviews
            </Link>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[var(--aqua)]">
              {review.treatmentCategory.replaceAll("-", " ")}
            </p>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[var(--ink)]">
              Patient experience from {review.reviewerName}
            </h1>
            <div className="mt-8 flex items-center gap-1 text-[var(--bronze)]">
              {Array.from({ length: Math.round(review.rating) }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>
          <div className="h-fit rounded-[2.25rem] border border-white/60 bg-white/55 p-7 shadow-[0_30px_100px_rgba(16,16,20,0.11)] backdrop-blur-2xl">
            <ShieldCheck className="mb-8 h-7 w-7 text-[var(--aqua)]" />
            <p className="font-serif text-4xl leading-none text-[var(--ink)]">
              Permission-confirmed review
            </p>
            <p className="mt-5 text-sm leading-7 text-[var(--ink)]/62">
              Review content is published for trust and context only. Individual
              results and experiences can vary.
            </p>
          </div>
        </article>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <article className="mx-auto max-w-4xl rounded-[2.5rem] border border-[var(--ink)]/10 bg-white/62 p-8 shadow-[0_30px_110px_rgba(16,16,20,0.1)] backdrop-blur md:p-12">
          <p className="font-serif text-4xl leading-tight text-[var(--ink)] md:text-6xl">
            &ldquo;{review.reviewText}&rdquo;
          </p>
          <div className="mt-10 grid gap-5 border-t border-[var(--ink)]/10 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--bronze)]">
                Reviewer
              </p>
              <p className="mt-3 font-bold text-[var(--ink)]">
                {review.reviewerName}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--bronze)]">
                Source
              </p>
              <p className="mt-3 font-bold capitalize text-[var(--ink)]">
                {review.source?.replaceAll("_", " ") || "Clinic record"}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--bronze)]">
                Date
              </p>
              <p className="mt-3 font-bold text-[var(--ink)]">
                {review.reviewedAt || "Recorded by clinic"}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {review.sourceUrl ? (
              <PremiumButton href={review.sourceUrl}>
                View source <ExternalLink className="ml-2 h-4 w-4" />
              </PremiumButton>
            ) : null}
            <PremiumButton href="/contact" variant="outline">
              Book consultation
            </PremiumButton>
          </div>
        </article>
      </section>
    </>
  );
}

async function ReviewCategoryPage({ slug }: { slug: string }) {
  const category = reviewCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const reviews = await getReviews(slug);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: `${category.label} Reviews`,
          description: category.description,
          path: `/reviews/${slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
          { name: category.label, path: `/reviews/${slug}` },
        ])}
      />
      <section className="relative overflow-hidden bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(42,195,214,0.17),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(124,77,255,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/reviews"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[var(--ink)]/54 transition hover:text-[var(--ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            All reviews
          </Link>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--aqua)]">
              Review category
            </p>
            <h1 className="font-serif text-[clamp(4.6rem,10vw,9rem)] leading-[0.86] tracking-normal text-[var(--ink)]">
              {category.label} reviews
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">
              {category.description}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {reviews.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.slug}`}
                  className="group flex min-h-80 flex-col rounded-[2rem] border border-[var(--ink)]/10 bg-white/60 p-7 shadow-[0_24px_90px_rgba(16,16,20,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--bronze)]/45"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[var(--aqua)]">
                      {category.label}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[var(--bronze)]" />
                  </div>
                  <p className="flex-1 text-lg leading-8 text-[var(--ink)]/72">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                  <p className="mt-8 border-t border-[var(--ink)]/10 pt-5 font-bold text-[var(--ink)]">
                    {review.reviewerName}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-[var(--ink)]/10 bg-white/62 p-8 shadow-[0_30px_110px_rgba(16,16,20,0.1)] backdrop-blur">
              <h2 className="font-serif text-5xl leading-none text-[var(--ink)]">
                No permission-confirmed reviews published in this category yet.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ink)]/64">
                The CMS is ready for source-linked review entries once the
                clinic approves them for public display.
              </p>
              <PremiumButton href="/contact" className="mt-8">
                Contact the clinic
              </PremiumButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
