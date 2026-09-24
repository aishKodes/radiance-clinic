import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LiteYouTubeVideo } from "@/components/LiteYouTubeVideo";
import { MedicalReview } from "@/components/MedicalReview";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedContent } from "@/components/RelatedContent";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import {
  hairVideoWatchPages,
  videoWatchPageBySlug,
} from "@/data/video-watch-pages";
import { pageMetadata } from "@/lib/metadata";
import {
  breadcrumbJsonLd,
  videoObjectJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return hairVideoWatchPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = videoWatchPageBySlug.get(slug);

  if (!page) {
    return { title: "Video" };
  }

  return pageMetadata({
    title: `${page.pageTitle} | Radiance Clinics`,
    description: page.pageDescription,
    path: `/videos/${page.slug}`,
    image: page.video.thumbnail,
    imageAlt: page.pageTitle,
  });
}

export default async function VideoWatchPage({ params }: Props) {
  const { slug } = await params;
  const page = videoWatchPageBySlug.get(slug);

  if (!page) {
    notFound();
  }

  const path = `/videos/${page.slug}`;
  const relatedWatchPages = hairVideoWatchPages
    .filter((item) => item.video.videoId !== page.video.videoId)
    .slice(0, 2);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Videos", path: "/videos" },
    { name: page.pageTitle, path },
  ];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: page.pageTitle,
          description: page.pageDescription,
          path,
          medicalReview: true,
        })}
      />
      <JsonLd data={videoObjectJsonLd(page.video, path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <section className="bg-[var(--mist)] px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_0.36fr]">
          <article className="min-w-0">
            <Breadcrumbs items={breadcrumbs} />
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Official Radiance Clinics video
            </p>
            <h1 className="mt-4 max-w-5xl font-serif text-5xl leading-[0.94] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              {page.pageTitle}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--ink)]/68">
              {page.pageDescription}
            </p>
            <MedicalReview
              authorName="Radiance Editorial Team"
              className="mt-8 max-w-3xl"
            />
          </article>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <LiteYouTubeVideo video={page.video} />
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-16 text-[var(--ivory)] sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
              Video context
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              What this official video covers.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
              {page.summary}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Key questions addressed
            </h2>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {page.keyQuestions.map((question) => (
                <li
                  key={question}
                  className="border-t border-white/14 py-5 text-base leading-7 text-white/76"
                >
                  {question}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href="/contact" variant="ivory">
                Book a hair consultation
              </PremiumButton>
              <PremiumButton href="/videos" variant="ghost" className="text-white hover:bg-white/10">
                Browse all videos
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>

      <RelatedContent
        eyebrow="Continue your research"
        title="Related hair guidance and clinical questions."
        items={[
          {
            href: page.relatedTreatment.href,
            label: page.relatedTreatment.label,
            description: "Understand the consultation and planning pathway connected to this topic.",
          },
          {
            href: page.relatedGuide.href,
            label: page.relatedGuide.label,
            description: "Read the related patient guide before making a treatment decision.",
          },
          {
            href: page.relatedAnswer.href,
            label: page.relatedAnswer.label,
            description: "Read a concise doctor-reviewed answer to a related question.",
          },
          {
            href: "/before-after",
            label: "Hair restoration examples",
            description: "Review consent-led hair restoration examples with clinical context.",
          },
          ...relatedWatchPages.map((item) => ({
            href: `/videos/${item.slug}`,
            label: item.pageTitle,
            description: "Read the clinical context around another official Radiance Clinics video.",
          })),
        ]}
      />
    </>
  );
}
