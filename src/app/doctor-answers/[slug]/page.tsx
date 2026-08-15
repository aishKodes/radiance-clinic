import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ClipboardCheck, Stethoscope } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { TrackedLink } from "@/components/TrackedLink";
import { concernCategories, doctorAnswers, getDoctorAnswer } from "@/data/concern-library";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return doctorAnswers.map((answer) => ({ slug: answer.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const answer = getDoctorAnswer(slug);
  if (!answer) return { title: "Doctor answer" };
  return pageMetadata({
    title: `${answer.question} | Radiance Clinics Answers`,
    description: answer.conciseAnswer,
    path: `/doctor-answers/${slug}`,
    index: answer.indexable,
  });
}

export default async function DoctorAnswerPage({ params }: Props) {
  const { slug } = await params;
  const answer = getDoctorAnswer(slug);
  if (!answer) notFound();
  const category = concernCategories.find((item) => item.slug === answer.categorySlug);
  const path = `/doctor-answers/${slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Doctor Answers", path: "/doctor-answers" },
    { name: answer.question, path },
  ];

  return (
    <>
      <JsonLd data={webPageJsonLd({ title: answer.question, description: answer.conciseAnswer, path })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <section className="bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--aqua)]">{category?.label || "Patient question"}</p>
            <h1 className="max-w-5xl font-serif text-[clamp(3.7rem,8vw,7.5rem)] leading-[0.9] text-[var(--ink)]">{answer.question}</h1>
          </div>
          <aside className="h-fit rounded-[2rem] border border-[var(--bronze)]/20 bg-white/64 p-6">
            <ClipboardCheck className="h-7 w-7 text-[var(--bronze)]" />
            <p className="mt-6 font-serif text-3xl leading-none text-[var(--ink)]">Prepared for medical review</p>
            <p className="mt-4 text-sm leading-7 text-[var(--ink)]/62">This is editorial guidance, not a published opinion attributed to Dr. Satyarth Prakash. It remains noindex until real review is completed.</p>
          </aside>
        </div>
      </section>

      <article className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Concise answer</p>
          <p className="mt-5 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">{answer.conciseAnswer}</p>
          <div className="mt-12 space-y-7 border-t border-[var(--ink)]/12 pt-10 text-lg leading-9 text-[var(--ink)]/68">
            {answer.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-12 rounded-[2rem] bg-[var(--ink)] p-7 text-white sm:p-9">
            <Stethoscope className="h-7 w-7 text-[var(--aqua)]" />
            <h2 className="mt-6 font-serif text-4xl leading-none">When evaluation may help</h2>
            <p className="mt-5 text-base leading-8 text-white/66">{answer.whenEvaluationMayHelp}</p>
          </div>
        </div>
      </article>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Continue researching</p>
            <div className="mt-6 grid gap-3">
              <Link href={answer.relatedConcern} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">Related concern<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></Link>
              {answer.relatedTreatment ? <TrackedLink href={answer.relatedTreatment.href} eventName="treatment_clicked" eventParameters={{ destination_path: answer.relatedTreatment.href, source: "doctor_answer" }} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{answer.relatedTreatment.label}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></TrackedLink> : null}
              {answer.relatedGuide ? <Link href={answer.relatedGuide.href} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{answer.relatedGuide.label}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></Link> : null}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">Related questions</p>
            <div className="mt-6 grid gap-3">
              {answer.relatedQuestions.map((relatedSlug) => {
                const related = getDoctorAnswer(relatedSlug);
                return related ? <TrackedLink key={relatedSlug} href={`/doctor-answers/${relatedSlug}`} eventName="related_question_clicked" eventParameters={{ answer_slug: relatedSlug }} className="flex items-center justify-between border-t border-[var(--ink)]/12 py-4 text-sm font-extrabold text-[var(--ink)]">{related.question}<ArrowUpRight className="h-4 w-4 text-[var(--aqua)]" /></TrackedLink> : null;
              })}
              <TrackedLink href="/doctor-answers#ask" eventName="related_question_clicked" eventParameters={{ source: "ask_another" }} className="mt-4 inline-flex text-sm font-extrabold text-[var(--aqua)]">Ask another private question</TrackedLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
