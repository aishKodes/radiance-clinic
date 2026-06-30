import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import {
  getArticle,
  getArticleStaticParams,
} from "@/data/site";
import { articleJsonLd, webPageJsonLd } from "@/lib/schema";

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

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: {
      canonical: `/knowledge/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={webPageJsonLd({
          title: article.title,
          description: article.excerpt,
          path: `/knowledge/${slug}`,
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <article>
            <Link
              href="/knowledge"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#151515]/54 transition hover:text-[#151515]"
            >
              <ArrowLeft className="h-4 w-4" />
              Knowledge
            </Link>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[#1E6F86]">
              {article.category} - {article.readTime}
            </p>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] tracking-normal text-[#151515]">
              {article.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#151515]/68">
              {article.excerpt}
            </p>
          </article>
          <StickyConsultationCard />
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <article className="mx-auto max-w-3xl">
          <div className="space-y-7 text-xl leading-9 text-[#151515]/72">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
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
    </>
  );
}
