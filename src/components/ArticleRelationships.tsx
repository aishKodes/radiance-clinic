import Image from "next/image";
import Link from "next/link";
import { doctorAnswers } from "@/data/concern-library";
import { hairTransformationExamples } from "@/data/homepage-media";
import type { Article } from "@/types/cms";

export function ArticleRelationships({ article }: { article: Pick<Article, "relatedAnswers" | "resultConditions"> }) {
  const answers = (article.relatedAnswers || []).map((slug) => doctorAnswers.find((answer) => answer.slug === slug)).filter((answer) => Boolean(answer));
  const result = hairTransformationExamples.find((item) => item.consentConfirmed === true && article.resultConditions?.includes(item.conditionName || "") && item.beforeAfterPairs?.[0]?.before && item.beforeAfterPairs?.[0]?.after);
  const pair = result?.beforeAfterPairs?.[0];
  if (!answers.length && !pair) return null;
  return <div className="mt-12 border-t border-[var(--ink)]/12 pt-8">
    {answers.length ? <nav aria-label="Related doctor answers">
      <h2 className="font-serif text-3xl text-[var(--ink)]">Related Doctor Answers</h2>
      <ul className="mt-5 divide-y divide-[var(--ink)]/10">
        {answers.map((answer) => answer ? <li key={answer.slug}><Link className="block py-4 text-base font-bold leading-7 text-[var(--aqua)] underline underline-offset-4" href={`/doctor-answers/${answer.slug}`}>{answer.question}</Link></li> : null)}
      </ul>
    </nav> : null}
    {pair && result ? <figure className="mt-8">
      <h2 className="font-serif text-3xl text-[var(--ink)]">A Related Hair Transformation Example</h2>
      <Link href="/results#hair-transplant-results" className="mt-5 grid grid-cols-2 gap-2 overflow-hidden rounded-lg">
        {[["Before", pair.before], ["After", pair.after]].map(([label, value]) => {
          const image = value as typeof pair.before;
          return <div key={String(label)}><div className="relative aspect-[4/3] bg-[var(--mist)]"><Image src={image.desktopUrl || image.src} alt={`${result.conditionName}: ${String(label).toLowerCase()} treatment at Radiance Clinics Bhubaneswar`} fill sizes="(max-width: 768px) 45vw, 360px" className="object-cover" /></div><p className="py-2 text-sm font-bold">{String(label)}</p></div>;
        })}
      </Link>
      <figcaption className="mt-2 text-sm leading-6 text-[var(--ink)]/60">{result.conditionName}. View the full comparison in the results library. Individual outcomes vary.</figcaption>
    </figure> : null}
  </div>;
}
