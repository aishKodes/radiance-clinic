import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getArticles } from "@/data/site";
import type { Article } from "@/types/cms";

const decisionLinks = [
  ["Is transplantation right for me?", "when-hair-transplant-may-not-be-right"],
  ["How is donor density assessed?", "hair-transplant-consultation-checklist"],
  ["How many grafts make sense?", "hair-transplant-density-graft-planning"],
  ["Should crown or hairline come first?", "crown-vs-hairline-graft-priority"],
  ["What does FUE leave in the donor area?", "fue-hair-transplant-scars"],
  ["What if I need another transplant later?", "second-hair-transplant"],
];

const clusterLabels: Record<string, string> = {
  Planning: "Considering a Hair Transplant?",
  Suitability: "Is Surgery the Right Next Step?",
  "After a Previous Procedure": "After a Previous Procedure",
  Results: "Understanding Results",
  "Hair Loss Before Surgery": "Hair Loss Before Surgery",
};

export async function HairPlanningLibrary({
  articles: suppliedArticles,
  decisions = false,
}: {
  articles?: Article[];
  decisions?: boolean;
}) {
  const articles = suppliedArticles || await getArticles();
  const library = articles.filter((article) => article.topicCluster && article.topicCluster !== "Skin Health");
  return (
    <section aria-labelledby={decisions ? "hair-decision-title" : "hair-library-title"} className="border-y border-[var(--ink)]/10 bg-white px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-normal text-[var(--aqua)]">Hair Transplant Planning Library</p>
        <h2 id={decisions ? "hair-decision-title" : "hair-library-title"} className="mt-4 max-w-3xl scroll-mt-28 font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
          {decisions ? "Before You Decide on a Hair Transplant" : "Clear answers for each stage of the decision"}
        </h2>
        {decisions ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decisionLinks.filter(([, slug]) => library.some((article) => article.slug === slug)).map(([label, slug]) => (
              <Link key={slug} href={`/knowledge/${slug}`} className="flex items-start justify-between gap-4 rounded-lg border border-[var(--ink)]/12 p-5 text-base font-bold leading-6 hover:border-[var(--aqua)]">
                {label}<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--aqua)]" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(clusterLabels).map(([cluster, label]) => {
              const items = library.filter((article) => article.topicCluster === cluster);
              if (!items.length) return null;
              return <nav key={cluster} aria-label={label}>
                <h3 className="border-b border-[var(--ink)]/15 pb-3 text-lg font-bold">{label}</h3>
                {items.map((article) => <Link key={article.slug} href={`/knowledge/${article.slug}`} className="flex items-start justify-between gap-3 border-b border-[var(--ink)]/8 py-3 text-sm leading-6 text-[var(--ink)]/75 hover:text-[var(--aqua)]">{article.title}<ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" /></Link>)}
                {cluster === "Planning" ? <Link href="/concerns/hair-transplant/hairline-design" className="flex items-start justify-between gap-3 border-b border-[var(--ink)]/8 py-3 text-sm leading-6 text-[var(--ink)]/75 hover:text-[var(--aqua)]">Natural hairline design<ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" /></Link> : null}
              </nav>;
            })}
          </div>
        )}
        <Link href={decisions ? "/treatments/hair-restoration#hair-library-title" : "/hair-transplant-bhubaneswar"} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--aqua)]">
          {decisions ? "Explore the complete Hair planning library" : "Hair transplant assessment in Bhubaneswar"}<ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
