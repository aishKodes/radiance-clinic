import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CirclePlay,
  Newspaper,
  Quote,
  Stethoscope,
} from "lucide-react";
import type { HairPageExperience } from "@/data/hair-page-experience";
import { hairTransformationExamples } from "@/data/homepage-media";
import { featuredMediaCoverage } from "@/data/media-coverage";
import { satyarthPrakash } from "@/data/doctor";
import { verifiedGoogleReviewsSnapshot } from "@/data/google-reviews-snapshot";
import { videoWatchPageBySlug } from "@/data/video-watch-pages";
import type { CmsImage, Transformation } from "@/types/cms";

function firstAfterImage(item: Transformation): CmsImage | undefined {
  return item.beforeAfterPairs?.[0]?.after || item.frontAfter || item.angleAfter;
}

export function HairEvidence({
  experience,
}: {
  experience: HairPageExperience;
}) {
  const cases = experience.resultConditions
    .map((condition) =>
      hairTransformationExamples.find(
        (item) =>
          item.consentConfirmed !== false &&
          item.conditionName?.toLowerCase() === condition.toLowerCase() &&
          firstAfterImage(item),
      ),
    )
    .filter((item): item is Transformation => Boolean(item))
    .slice(0, 2);
  const video = videoWatchPageBySlug.get(experience.videoSlug);
  const reviews = experience.reviewIds
    .map((id) =>
      verifiedGoogleReviewsSnapshot.reviews.find((review) => review.id === id),
    )
    .filter(
      (review): review is (typeof verifiedGoogleReviewsSnapshot.reviews)[number] =>
        Boolean(review),
    )
    .slice(0, 1);
  const media = experience.showHairMediaCoverage
    ? featuredMediaCoverage.find((item) => item.topic === "hair-transplant")
    : undefined;

  return (
    <section
      aria-labelledby="hair-evidence-title"
      className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--bronze)]">
            Evidence from Radiance
          </p>
          <h2
            id="hair-evidence-title"
            className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl"
          >
            Real clinic evidence to support an informed decision.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink)]/66">
            Review consent-confirmed examples, doctor education and independent
            coverage in context. Images and reviews reflect individual
            experiences and do not guarantee another patient&apos;s result.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {cases.map((item, index) => {
            const after = firstAfterImage(item)!;
            return (
              <Link
                key={item.id}
                href="/results#hair-transplant-results"
                className={`group relative min-h-[22rem] overflow-hidden rounded-[1.25rem] bg-[var(--ink)] ${
                  index === 0 ? "lg:col-span-5" : "lg:col-span-4"
                }`}
              >
                <Image
                  src={after.desktopUrl || after.src}
                  alt={`${item.conditionName || item.treatment} hair restoration result example at Radiance Clinics Bhubaneswar`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(15,16,22,0.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-[var(--champagne)]">
                    Consent-confirmed result example
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">
                    {item.conditionName || item.treatment}
                  </h3>
                  <p className="mt-2 text-sm text-white/64">
                    View the comparison and individual-results context.
                  </p>
                </div>
              </Link>
            );
          })}

          {video ? (
            <Link
              href={`/videos/${video.slug}`}
              className={`group overflow-hidden rounded-[1.25rem] border border-[var(--ink)]/10 bg-white ${
                cases.length ? "lg:col-span-3" : "lg:col-span-5"
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-[var(--ink)]">
                <Image
                  src={`https://img.youtube.com/vi/${video.video.videoId}/hqdefault.jpg`}
                  alt={`${video.pageTitle} by Radiance Clinics`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.02]"
                />
                <CirclePlay className="absolute left-5 top-5 h-10 w-10 text-white" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-[var(--aqua)]">
                  Watch the doctor explain
                </p>
                <h3 className="mt-3 text-xl font-extrabold leading-7 text-[var(--ink)]">
                  {video.pageTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ink)]/62">
                  {video.summary}
                </p>
              </div>
            </Link>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href={experience.guide.href}
            className="group border-t border-[var(--ink)]/16 py-5"
          >
            <ArrowUpRight className="h-5 w-5 text-[var(--bronze)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <h3 className="mt-5 text-lg font-extrabold text-[var(--ink)]">
              {experience.guide.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink)]/62">
              Medically reviewed patient education from Radiance Clinics.
            </p>
          </Link>

          <Link
            href={satyarthPrakash.profilePath}
            className="group border-t border-[var(--ink)]/16 py-5"
          >
            <Stethoscope className="h-5 w-5 text-[var(--aqua)]" />
            <h3 className="mt-5 text-lg font-extrabold text-[var(--ink)]">
              {satyarthPrakash.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink)]/62">
              {satyarthPrakash.experience} of doctor-led clinical experience.
            </p>
          </Link>

          {reviews.map((review) => (
            <a
              key={review.id}
              href={review.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="border-t border-[var(--ink)]/16 py-5"
            >
              <Quote className="h-5 w-5 text-[var(--bronze)]" />
              <blockquote className="mt-5 text-sm leading-6 text-[var(--ink)]/70">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ink)]/48">
                {review.reviewerName} · Google review
              </p>
            </a>
          ))}

          {media ? (
            <Link href="/media" className="group border-t border-[var(--ink)]/16 py-5">
              <Newspaper className="h-5 w-5 text-[var(--aqua)]" />
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]/48">
                In the media · {media.outletName}
              </p>
              <h3 className="mt-2 text-lg font-extrabold leading-7 text-[var(--ink)]">
                {media.articleTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink)]/62">
                View the verified publication record and original article link.
              </p>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
