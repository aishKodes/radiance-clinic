import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { concernCategories, concernsByCategory, doctorAnswers, getConcernCategory } from "@/data/concern-library";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return concernCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getConcernCategory(slug);
  if (!category) return { title: "Concern category" };
  return pageMetadata({
    title: `${category.label} Concerns | Radiance Clinics`,
    description: category.shortDescription,
    path: `/concerns/${slug}`,
  });
}

export default async function ConcernCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getConcernCategory(slug);
  if (!category) notFound();
  const items = concernsByCategory.get(slug) || [];
  const answers = doctorAnswers.filter((answer) => answer.categorySlug === slug);
  const path = `/concerns/${slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Concerns", path: "/concerns" },
    { name: category.label, path },
  ];

  return (
    <>
      <JsonLd data={collectionPageJsonLd({ title: category.label, description: category.shortDescription, path, itemPaths: items.map((item) => `${path}/${item.slug}`) })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <section className="bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.38fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--aqua)]">Concern category</p>
              <h1 className="font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] text-[var(--ink)]">{category.label}</h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[var(--ink)]/66">{category.shortDescription}</p>
            </div>
            <div className="rounded-[2rem] border border-[var(--ink)]/10 bg-white/60 p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Explore by issue</p>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-[var(--ink)]/68">
                {category.issueGroups.map((group) => <li key={group} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--aqua)]" />{group}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          {category.introduction.map((paragraph) => <p key={paragraph} className="text-lg leading-9 text-[var(--ink)]/68">{paragraph}</p>)}
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={`${items.length} focused topics`} title="Choose the description closest to what you notice." description="These pages are educational and do not diagnose. Topics awaiting real medical review remain excluded from search-engine indexing." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((concern) => (
              <Link key={concern.slug} href={`/concerns/${slug}/${concern.slug}`} className="group flex min-h-72 flex-col rounded-[1.65rem] border border-[var(--ink)]/10 bg-white/62 p-6 transition hover:-translate-y-1 hover:border-[var(--aqua)]/38">
                <div className="flex justify-between gap-4"><span className="rounded-full bg-[var(--mist)] px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[var(--bronze)]">{concern.status === "READY_FOR_MEDICAL_REVIEW" ? "Review ready" : concern.status}</span><ArrowUpRight className="h-5 w-5 text-[var(--aqua)]" /></div>
                <h2 className="mt-9 font-serif text-3xl leading-none text-[var(--ink)]">{concern.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">{concern.summary}</p>
                <span className="mt-auto pt-6 text-xs font-extrabold uppercase tracking-[0.13em] text-[var(--bronze)]">Read guidance</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Related care</p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">Treatment and guide pathways.</h2>
            <div className="mt-8 grid gap-3">
              {[...category.relatedTreatments, ...category.usefulGuides].map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{item.label}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></Link>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Questions patients ask</p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">Prepared answers for this category.</h2>
            <div className="mt-8 grid gap-3">
              {answers.length ? answers.map((answer) => <Link key={answer.slug} href={`/doctor-answers/${answer.slug}`} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{answer.question}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></Link>) : <Link href="/doctor-answers#ask" className="text-sm font-extrabold text-[var(--aqua)]">Ask a private question</Link>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
