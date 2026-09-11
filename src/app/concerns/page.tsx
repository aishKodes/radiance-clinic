import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ConcernSearch, type SearchDocument } from "@/components/ConcernSearch";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { concernCategories, concerns, doctorAnswers, medicalReviewer } from "@/data/concern-library";
import { resultCases } from "@/data/result-cases";
import { publicEducationalVideos } from "@/data/video-library";
import { getArticles, getTreatments } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { collectionPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Hair, Scalp & Skin Concern Library | Radiance Clinics",
  description:
    "Search patient-friendly guidance for hair loss, hair transplant, acne, scars, pigmentation, laser hair reduction and skin concerns.",
  path: "/concerns",
});

export default async function ConcernsPage() {
  const [treatments, articles] = await Promise.all([getTreatments(), getArticles()]);
  const documents: SearchDocument[] = [
    ...concerns.map((concern) => ({
      id: `concern:${concern.categorySlug}:${concern.slug}`,
      type: "Concerns" as const,
      title: concern.title,
      description: concern.summary,
      href: `/concerns/${concern.categorySlug}/${concern.slug}`,
      terms: concern.searchTerms,
    })),
    ...treatments.map((treatment) => ({
      id: `treatment:${treatment.cluster}:${treatment.slug}`,
      type: "Treatments" as const,
      title: treatment.title,
      description: treatment.summary,
      href: `/treatments/${treatment.cluster}/${treatment.slug}`,
      terms: [treatment.title, treatment.clusterLabel, ...treatment.idealFor, ...treatment.highlights],
    })),
    ...doctorAnswers.map((answer) => ({
      id: `answer:${answer.slug}`,
      type: "Doctor Answers" as const,
      title: answer.question,
      description: answer.conciseAnswer,
      href: `/doctor-answers/${answer.slug}`,
      terms: [answer.question, answer.conciseAnswer, answer.categorySlug.replaceAll("-", " ")],
    })),
    ...articles.map((article) => ({
      id: `guide:${article.slug}`,
      type: "Guides" as const,
      title: article.title,
      description: article.excerpt,
      href: `/knowledge/${article.slug}`,
      terms: [article.title, article.category, article.excerpt],
    })),
    ...publicEducationalVideos.map((video) => ({
      id: `video:${video.videoId}`,
      type: "Videos" as const,
      title: video.title,
      description: video.description || `${video.primaryTopic} video from Radiance Clinics.`,
      href: "/videos",
      terms: [video.title, video.primaryTopic, video.searchIntent, video.description],
    })),
    ...resultCases.map((result) => ({
      id: `result:${result.category}:${result.slug}`,
      type: "Results" as const,
      title: result.title,
      description: result.summary,
      href: result.indexable ? `/results/${result.category}/${result.slug}` : "/results",
      terms: [result.title, result.conditionName, result.treatment],
    })),
  ];

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          title: "Radiance Concern Library",
          description: "A structured patient education library for hair, scalp and skin concerns.",
          path: "/concerns",
          itemPaths: concernCategories.map((category) => `/concerns/${category.slug}`),
        })}
      />
      <section className="relative overflow-hidden bg-[var(--ivory)] px-5 pb-24 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(31,127,143,0.18),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(183,109,90,0.14),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--aqua)]">Concern library</p>
          <h1 className="max-w-6xl font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.86] text-[var(--ink)]">
            Start with what you notice.
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--ink)]/66 sm:text-xl sm:leading-9">
            Explore hair, scalp and skin concerns, treatment information and answers medically reviewed by {medicalReviewer.name}, with {medicalReviewer.experience}.
          </p>
        </div>
      </section>

      <ConcernSearch documents={documents} />

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Browse by category"
            title="A clear route from symptom to useful guidance."
            description="The library keeps medical synonyms and everyday patient wording together without creating duplicate pages for the same concern."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {concernCategories.map((category, index) => {
              const categoryConcerns = concerns.filter((concern) => concern.categorySlug === category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/concerns/${category.slug}`}
                  className="group flex min-h-[25rem] flex-col overflow-hidden rounded-[2rem] border border-[var(--ink)]/10 bg-white/64 p-7 shadow-[0_24px_80px_rgba(15,16,22,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[var(--bronze)]/40"
                >
                  <div className="flex items-start justify-between gap-5">
                    <span className="font-mono text-xs font-extrabold text-[var(--bronze)]">{String(index + 1).padStart(2, "0")}</span>
                    <ArrowUpRight className="h-5 w-5 text-[var(--aqua)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h2 className="mt-10 font-serif text-4xl leading-none text-[var(--ink)]">{category.label}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">{category.shortDescription}</p>
                  <ul className="mt-8 space-y-2 border-t border-[var(--ink)]/10 pt-6 text-sm font-semibold text-[var(--ink)]/66">
                    {category.featuredConcernSlugs.slice(0, 5).map((slug) => {
                      const concern = categoryConcerns.find((item) => item.slug === slug);
                      return concern ? <li key={slug}>{concern.title}</li> : null;
                    })}
                  </ul>
                  <span className="mt-auto pt-7 text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--bronze)]">
                    View all {categoryConcerns.length} concerns
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--champagne)]">Questions patients ask</p>
            <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.94] sm:text-7xl">Couldn&apos;t find your exact concern?</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">Review prepared answers or send a private question for triage. Questions are never published automatically.</p>
          </div>
          <Link href="/doctor-answers" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--champagne)] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]">
            Explore Doctor Answers
          </Link>
        </div>
      </section>
    </>
  );
}
