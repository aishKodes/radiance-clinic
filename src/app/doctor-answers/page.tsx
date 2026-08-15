import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { AskDoctorForm } from "@/components/AskDoctorForm";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { concernCategories, doctorAnswers, medicalReviewer } from "@/data/concern-library";
import { pageMetadata } from "@/lib/metadata";
import { collectionPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Doctor Answers: Hair & Skin Questions | Radiance Clinics",
  description:
    "Explore doctor-reviewed answers to specific patient hair, skin, laser and aesthetic questions, or submit a private question for clinical triage.",
  path: "/doctor-answers",
});

export default function DoctorAnswersPage() {
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          title: "Doctor Answers",
          description: "Patient questions and carefully prepared educational answers.",
          path: "/doctor-answers",
          itemPaths: doctorAnswers.map((answer) => `/doctor-answers/${answer.slug}`),
        })}
      />
      <section className="relative overflow-hidden bg-[var(--ink)] px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(31,127,143,0.3),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(217,189,130,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.32em] text-[var(--champagne)]">Questions patients ask</p>
          <h1 className="max-w-6xl font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.86]">Doctor Answers</h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/64">Clear, contextual answers medically reviewed by {medicalReviewer.name}, with more than 30 years of clinical experience.</p>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={`${doctorAnswers.length} doctor-reviewed answers`} title="Start with a specific question." description="Each page gives a contextual answer, explains when evaluation may help and links to related concerns and treatments." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {doctorAnswers.map((answer) => {
              const category = concernCategories.find((item) => item.slug === answer.categorySlug);
              return (
                <Link key={answer.slug} href={`/doctor-answers/${answer.slug}`} className="group flex min-h-80 flex-col rounded-[2rem] border border-[var(--ink)]/10 bg-white/64 p-7 shadow-[0_24px_80px_rgba(15,16,22,0.08)] transition hover:-translate-y-1 hover:border-[var(--aqua)]/35">
                  <div className="flex items-start justify-between gap-4"><span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--aqua)]">{category?.label}</span><ArrowUpRight className="h-5 w-5 text-[var(--bronze)]" /></div>
                  <h2 className="mt-10 font-serif text-4xl leading-none text-[var(--ink)]">{answer.question}</h2>
                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-[var(--ink)]/62">{answer.conciseAnswer}</p>
                  <p className="mt-auto flex items-center gap-2 pt-7 text-xs font-extrabold uppercase tracking-[0.13em] text-[var(--bronze)]"><ShieldCheck className="h-4 w-4" />Medically reviewed</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ask" className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <LockKeyhole className="h-8 w-8 text-[var(--aqua)]" />
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">Private by design</p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)] sm:text-6xl">Ask the Doctor.</h2>
            <p className="mt-6 text-base leading-8 text-[var(--ink)]/64">Contact details and any future image uploads remain private. Submission status begins at <strong>SUBMITTED</strong>; nothing becomes public without triage, anonymisation, drafting and doctor approval.</p>
          </div>
          <AskDoctorForm />
        </div>
      </section>
    </>
  );
}
