import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowUpRight, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { TrackedLink } from "@/components/TrackedLink";
import { concerns, doctorAnswers, getConcern, getConcernCategory, medicalReviewer } from "@/data/concern-library";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return concerns.map((concern) => ({ category: concern.categorySlug, slug: concern.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const concern = getConcern(category, slug);
  if (!concern) return { title: "Concern" };
  return pageMetadata({
    title: concern.seoTitle,
    description: concern.seoDescription,
    path: `/concerns/${category}/${slug}`,
    index: concern.indexable,
  });
}

export default async function ConcernDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const concern = getConcern(categorySlug, slug);
  const category = getConcernCategory(categorySlug);
  if (!concern || !category) notFound();
  const path = `/concerns/${categorySlug}/${slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Concerns", path: "/concerns" },
    { name: category.label, path: `/concerns/${categorySlug}` },
    { name: concern.title, path },
  ];
  const answers = doctorAnswers.filter((answer) =>
    concern.doctorAnswers.includes(answer.slug) || answer.relatedConcern === path,
  );
  const relatedConcerns = concerns
    .filter((item) => item.categorySlug === categorySlug && item.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={webPageJsonLd({ title: concern.title, description: concern.summary, path })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <section className="bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--aqua)]">{category.label}</p>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] text-[var(--ink)]">{concern.title}</h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[var(--ink)]/68">{concern.summary}</p>
            <OpenBookingButton source="cta" className="mt-9">Book an assessment</OpenBookingButton>
          </div>
          <aside className="h-fit rounded-[2rem] border border-[var(--bronze)]/20 bg-white/64 p-6 shadow-[0_24px_80px_rgba(15,16,22,0.08)]">
            <ClipboardCheck className="h-7 w-7 text-[var(--bronze)]" />
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">Medical review</p>
            <p className="mt-3 font-serif text-3xl leading-none text-[var(--ink)]">Reviewed by {concern.reviewedBy}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">{medicalReviewer.experience}. Prepared by {concern.preparedBy}; reviewed for clinical clarity, safety and realistic expectations.</p>
            <p className="mt-5 text-xs font-semibold text-[var(--ink)]/48">Last reviewed {concern.reviewedAt}</p>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">In plain language</p><h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">What this term means.</h2></div>
          <p className="text-xl leading-9 text-[var(--ink)]/68">{concern.definition}</p>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <ContentList icon={CheckCircle2} eyebrow="What patients notice" title="Common signs and descriptions" items={concern.commonSigns} />
          <ContentList icon={AlertCircle} eyebrow="Possible explanations" title="Different causes can look similar" items={concern.possibleCauses} />
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">Professional assessment</p>
          <h2 className="mt-4 max-w-4xl font-serif text-5xl leading-none sm:text-7xl">How a consultation may clarify the concern.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {concern.howItIsAssessed.map((item) => <div key={item} className="rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-6 text-base leading-8 text-white/68"><ShieldCheck className="mb-5 h-5 w-5 text-[var(--aqua)]" />{item}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          <ContentBlock eyebrow="Treatment approach" title="Options follow the diagnosis" items={concern.treatmentApproaches} />
          <ContentBlock eyebrow="Avoid" title="What not to do" items={concern.whatNotToDo} />
          <ContentBlock eyebrow="Care" title="Useful next steps" items={concern.preventionOrCare} />
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Frequently asked</p><h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">Questions to take into consultation.</h2></div>
          <FAQAccordion items={concern.faq} />
        </div>
      </section>

      {answers.length ? (
        <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Questions patients ask</p>
            <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-[var(--ink)]">Prepared answers related to this concern.</h2>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {answers.map((answer) => <TrackedLink key={answer.slug} href={`/doctor-answers/${answer.slug}`} eventName="related_question_clicked" eventParameters={{ answer_slug: answer.slug }} className="group flex min-h-40 items-end justify-between gap-5 rounded-[1.5rem] border border-[var(--ink)]/10 bg-white/64 p-6 font-serif text-3xl leading-none text-[var(--ink)]">{answer.question}<ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--aqua)]" /></TrackedLink>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Related treatments and guides</p>
            <div className="mt-6 grid gap-3">
              {[...concern.clinicTreatments, ...concern.relatedArticles].map((item) => <TrackedLink key={item.href} href={item.href} eventName={item.href.startsWith("/treatments") ? "treatment_clicked" : "search_result_clicked"} eventParameters={{ destination_path: item.href, source: "concern_detail" }} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{item.label}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></TrackedLink>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Related concerns</p>
            <div className="mt-6 grid gap-3">
              {relatedConcerns.map((item) => <Link key={item.slug} href={`/concerns/${item.categorySlug}/${item.slug}`} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{item.title}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></Link>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContentList({ icon: Icon, eyebrow, title, items }: { icon: typeof CheckCircle2; eyebrow: string; title: string; items: string[] }) {
  return <article className="rounded-[2rem] border border-[var(--ink)]/10 bg-white/64 p-7"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)]">{title}</h2><ul className="mt-8 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--ink)]/68"><Icon className="mt-1 h-5 w-5 shrink-0 text-[var(--aqua)]" />{item}</li>)}</ul></article>;
}

function ContentBlock({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return <article className="border-t border-[var(--ink)]/14 pt-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)]">{title}</h2><ul className="mt-6 space-y-4 text-sm leading-7 text-[var(--ink)]/66">{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}
