import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleContent } from "@/components/ArticleContent";
import { JsonLd } from "@/components/JsonLd";
import { MedicalReview } from "@/components/MedicalReview";
import { PremiumButton } from "@/components/PremiumButton";
import { RelatedVideos } from "@/components/RelatedVideos";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import {
  getArticle,
  getArticles,
  getArticleStaticParams,
} from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { relationshipsFor } from "@/data/search-taxonomy";
import { videosForPath } from "@/data/video-library";
import { articleJsonLd, breadcrumbJsonLd, videoObjectJsonLd, webPageJsonLd } from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getArticleStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article" };
  }

  return pageMetadata({
    title: article.seoTitle || `${article.title} | Radiance Clinics`,
    description: article.seoDescription || article.excerpt,
    path: `/knowledge/${slug}`,
    image: article.image?.src,
    imageAlt: article.image?.alt,
    type: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([
    getArticle(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }
  const path = `/knowledge/${slug}`;
  const relationships = relationshipsFor(path);
  const videos = videosForPath(path, 2);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Knowledge", path: "/knowledge" },
    { name: article.title, path },
  ];
  const explicitlyRelatedArticles = (article.relatedArticles || [])
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedArticles = [
    ...explicitlyRelatedArticles,
    ...articles.filter(
      (item) =>
        item.slug !== article.slug &&
        !explicitlyRelatedArticles.some((related) => related.slug === item.slug),
    ),
  ].slice(0, 2);
  const featuredImageAlt = article.category.includes("Hair")
    ? "Dr. Satyarth Prakash discussing hair restoration planning at Radiance Clinics"
    : article.category.includes("Laser")
      ? "Laser treatment equipment room at Radiance Clinics Bhubaneswar"
      : "Doctor consultation space at Radiance Clinics Bhubaneswar";
  const explicitRelatedLinks = [
    ...(article.relatedTreatments || []),
    ...(article.relatedConditions || []),
  ].map((href) => ({
    href,
    label: href.includes("prp-gfc")
      ? "PRP and GFC scalp therapy"
      : href.includes("hair-transplant") || href.includes("fue-hair")
        ? "Hair transplant planning"
        : href.includes("hair-loss") || href.includes("hair-fall")
          ? "Hair loss and scalp guidance"
          : href.includes("laser-hair")
            ? "Laser hair reduction"
            : href.includes("acne-scar")
              ? "Acne scar assessment and treatment"
              : href.includes("/acne")
                ? "Active acne guidance"
                : "Related clinical guidance",
  }));
  const relatedTreatmentLinks = explicitRelatedLinks.length
    ? explicitRelatedLinks
    : relationships
    ? [
        { label: "Treatment category overview", href: relationships.hub },
        ...relationships.treatments.slice(0, 2).map((href) => ({
          label: href.includes("prp-gfc")
            ? "PRP and GFC scalp therapy"
            : href.includes("laser-hair")
              ? "Laser hair reduction"
              : href.includes("injectable")
                ? "Injectable aesthetic planning"
                : href.includes("acne-scar")
                  ? "Acne scar revision"
                  : "Related treatment information",
          href,
        })),
        ...relationships.conditions.slice(0, 1).map((href) => ({
          label: "Related condition guidance",
          href,
        })),
      ]
    : article.category.includes("Hair")
    ? [
        { label: "Hair transplant in Bhubaneswar", href: "/hair-transplant-bhubaneswar" },
        {
          label: "PRP / GFC scalp therapy",
          href: "/treatments/hair-restoration/prp-gfc-scalp-therapy",
        },
      ]
    : article.category.includes("Laser")
      ? [
          { label: "Skin clinic in Bhubaneswar", href: "/skin-clinic-bhubaneswar" },
          {
            label: "Laser hair removal in Bhubaneswar",
            href: "/laser-hair-removal-bhubaneswar",
          },
        ]
      : [
          {
            label: "Injectables and fillers planning",
            href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
          },
          { label: "Skin ageing and laxity", href: "/conditions/skin-ageing-laxity" },
        ];

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={webPageJsonLd({
          title: article.title,
          description: article.excerpt,
          path,
          medicalReview:
            article.authorType !== "doctor" &&
            Boolean(article.reviewerId || article.reviewedBy),
        })}
      />
      {videos.map((video) => <JsonLd key={video.videoId} data={videoObjectJsonLd(video)} />)}
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <article>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[#1E6F86]">
              {article.category} - {article.readTime}
            </p>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[#151515]">
              {article.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {article.excerpt}
            </p>
            {article.publishedAt || article.updatedAt ? (
              <dl className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#151515]/58">
                {article.publishedAt ? (
                  <div className="flex gap-2"><dt>Published</dt><dd><time dateTime={article.publishedAt}>{article.publishedAt}</time></dd></div>
                ) : null}
                {article.updatedAt ? (
                  <div className="flex gap-2"><dt>Updated</dt><dd><time dateTime={article.updatedAt}>{article.updatedAt}</time></dd></div>
                ) : null}
              </dl>
            ) : null}
            <MedicalReview
              authorName={article.authorName || "Radiance Editorial Team"}
              authorType={article.authorType}
              reviewedAt={article.reviewedAt}
              className="mt-8 max-w-3xl"
            />
          </article>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <article className="mx-auto max-w-3xl">
          {article.image ? (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-[var(--mist)]">
              <Image
                src={article.image.src || article.image.desktopUrl}
                alt={article.image.alt || featuredImageAlt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <ArticleContent body={article.body} content={article.content} />
          {article.references?.length ? (
            <section className="mt-14 border-t border-[#151515]/12 pt-9" aria-labelledby="article-references">
              <h2 id="article-references" className="font-serif text-4xl leading-none text-[#151515]">
                References
              </h2>
              <ol className="mt-6 space-y-4 text-sm leading-7 text-[#151515]/68">
                {article.references.map((reference) => (
                  <li key={reference.href}>
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
                    >
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          <div className="mt-12 rounded-[2rem] border border-[#151515]/10 bg-[#F7F1E8] p-7">
            <p className="text-sm leading-7 text-[#151515]/66">
              This article is educational and does not replace consultation. A
              treatment plan should be selected after doctor-led assessment.
            </p>
            <PremiumButton href="/contact" className="mt-7">
              Book consultation
            </PremiumButton>
          </div>
        </article>
      </section>

      <RelatedVideos videos={videos} title="Continue with official video guidance." />

      {relatedArticles.length ? (
        <section className="bg-[#F7F1E8] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl text-[#151515]">Related treatment information</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {relatedTreatmentLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start justify-between gap-4 rounded-[1rem] border border-[#151515]/10 bg-white/60 p-5 text-sm font-bold leading-6 text-[#151515] transition hover:border-[#B78A4A]/45"
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#B78A4A]" />
                </Link>
              ))}
            </div>
            <h2 className="mt-12 font-serif text-4xl text-[#151515]">Related patient guidance</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {relatedArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/knowledge/${item.slug}`}
                  className="flex items-start justify-between gap-4 rounded-[1rem] border border-[#151515]/10 bg-white/60 p-5 text-sm font-bold leading-6 text-[#151515] transition hover:border-[#B78A4A]/45"
                >
                  {item.title}
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#B78A4A]" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
