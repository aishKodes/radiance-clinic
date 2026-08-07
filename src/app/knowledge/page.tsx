import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyConsultationCard } from "@/components/StickyConsultationCard";
import { getArticles } from "@/data/site";
import { webPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { treatmentHubs } from "@/data/search-taxonomy";

export const metadata: Metadata = pageMetadata({
  title: "Hair, Skin & Aesthetic Knowledge | Radiance Clinics",
  description:
    "Patient education on hair restoration, laser skin care and aesthetic medicine from Radiance Clinics, Bhubaneswar.",
  path: "/knowledge",
});

export default async function KnowledgePage() {
  const articles = await getArticles();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Knowledge Library",
          description:
            "Patient education for premium skin, hair and aesthetic care decisions.",
          path: "/knowledge",
        })}
      />
      <section className="bg-[#F7F1E8] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <SectionHeader
            level="h1"
            eyebrow="Knowledge library"
            title="Read before you decide."
            description="Concise, clinically grounded articles for patients comparing aesthetic, hair restoration and laser options."
          />
          <StickyConsultationCard />
        </div>
      </section>
      <nav aria-label="Knowledge topic clusters" className="bg-[#F7F1E8] px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {treatmentHubs.map((hub) => (
            <Link key={hub.slug} href={`/treatments/${hub.slug}`} className="border-t border-[#151515]/15 py-5 text-sm font-extrabold text-[#151515] transition hover:border-[#B78A4A]">
              {hub.label} guides and treatments
            </Link>
          ))}
        </div>
      </nav>
      <section className="bg-[#FBF7EF] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/knowledge/${article.slug}`}
              className="group flex min-h-96 flex-col rounded-[2rem] border border-[#151515]/10 bg-white/58 p-6 shadow-[0_24px_80px_rgba(21,21,21,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#B78A4A]/45"
            >
              {article.image ? (
                <div className="relative mb-6 h-48 overflow-hidden rounded-[1.45rem] bg-[var(--mist)]">
                  <Image
                    src={article.image.src}
                    alt={article.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="mb-12 flex items-center justify-between">
                <span className="rounded-full border border-[#151515]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#151515]/52">
                  {article.category}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#B78A4A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h2 className="font-serif text-4xl leading-none text-[#151515]">
                {article.title}
              </h2>
              <p className="mt-5 flex-1 text-sm leading-7 text-[#151515]/62">
                {article.excerpt}
              </p>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#151515]/45">
                {article.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
