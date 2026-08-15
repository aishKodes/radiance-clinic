"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, CircleHelp, Play, Search, Sparkles, Stethoscope, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { privateQueryMetrics, trackEvent } from "@/lib/analytics";

export type SearchDocument = {
  id: string;
  type: "Concerns" | "Treatments" | "Doctor Answers" | "Guides" | "Videos" | "Results";
  title: string;
  description: string;
  href: string;
  terms: string[];
};

const groupOrder: SearchDocument["type"][] = [
  "Concerns",
  "Treatments",
  "Doctor Answers",
  "Guides",
  "Videos",
  "Results",
];

const icons = {
  Concerns: Sparkles,
  Treatments: Stethoscope,
  "Doctor Answers": CircleHelp,
  Guides: BookOpen,
  Videos: Play,
  Results: Sparkles,
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function editDistance(left: string, right: string) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

function scoreDocument(document: SearchDocument, rawQuery: string) {
  const query = normalize(rawQuery);
  if (!query) return 0;
  const queryTokens = query.split(" ");
  const title = normalize(document.title);
  const termText = normalize(document.terms.join(" "));
  const haystack = `${title} ${termText} ${normalize(document.description)}`;
  let score = 0;

  if (title === query) score += 180;
  if (title.startsWith(query)) score += 90;
  if (haystack.includes(query)) score += 65;

  const words = Array.from(new Set(haystack.split(" ").filter(Boolean)));
  for (const token of queryTokens) {
    if (words.includes(token)) {
      score += 28;
      continue;
    }
    if (words.some((word) => word.startsWith(token) || token.startsWith(word))) {
      score += 18;
      continue;
    }
    if (
      token.length >= 4 &&
      words.some((word) => Math.abs(word.length - token.length) <= 2 && editDistance(word, token) <= 2)
    ) {
      score += 12;
    }
  }

  return score;
}

export function ConcernSearch({ documents }: { documents: SearchDocument[] }) {
  const [query, setQuery] = useState("");
  const started = useRef(false);
  const lastReported = useRef("");

  const results = useMemo(
    () =>
      documents
        .map((document) => ({ document, score: scoreDocument(document, query) }))
        .filter((result) => result.score >= 12)
        .sort((left, right) => right.score - left.score)
        .slice(0, 24),
    [documents, query],
  );

  const grouped = useMemo(
    () =>
      groupOrder
        .map((type) => ({
          type,
          results: results.filter((result) => result.document.type === type).slice(0, 6),
        }))
        .filter((group) => group.results.length),
    [results],
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    const timer = window.setTimeout(() => {
      const normalizedQuery = normalize(trimmed);
      if (lastReported.current === normalizedQuery) return;
      lastReported.current = normalizedQuery;
      const metrics = privateQueryMetrics(trimmed);
      trackEvent("search_query_submitted", {
        ...metrics,
        result_count: results.length,
      });
      if (!results.length) {
        trackEvent("no_results", metrics);
        void fetch("/api/search-signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metrics),
          keepalive: true,
        }).catch(() => undefined);
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [query, results.length]);

  return (
    <section aria-label="Concern search" className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 sm:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-[0_30px_100px_rgba(15,16,22,0.14)] backdrop-blur-2xl sm:p-6">
        <label className="relative block">
          <span className="sr-only">Search a concern, symptom or question</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--aqua)]" />
          <input
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (value.trim() && !started.current) {
                started.current = true;
                trackEvent("search_started", { surface: "concern_library" });
              }
            }}
            placeholder="Search a concern, symptom or question..."
            autoComplete="off"
            className="min-h-16 w-full rounded-[1.35rem] border border-[var(--ink)]/10 bg-[var(--ivory)] pl-14 pr-14 text-base font-semibold text-[var(--ink)] outline-none transition placeholder:font-medium placeholder:text-[var(--ink)]/40 focus:border-[var(--aqua)]/65 focus:ring-4 focus:ring-[var(--aqua)]/10 sm:text-lg"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)]/55"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        {!query.trim() ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {["hair fall", "acne scars", "dark spots", "large pores", "hair transplant shedding", "laser hair removal"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  if (!started.current) {
                    started.current = true;
                    trackEvent("search_started", { surface: "concern_library", source: "example" });
                  }
                }}
                className="rounded-full border border-[var(--ink)]/10 bg-white px-3 py-2 text-xs font-bold text-[var(--ink)]/60 transition hover:border-[var(--bronze)]/45 hover:text-[var(--ink)]"
              >
                {example}
              </button>
            ))}
          </div>
        ) : null}

        {query.trim().length >= 2 ? (
          <div className="mt-6 border-t border-[var(--ink)]/10 pt-5" aria-live="polite">
            {grouped.length ? (
              <div className="grid gap-7 lg:grid-cols-2">
                {grouped.map((group) => {
                  const Icon = icons[group.type];
                  return (
                    <div key={group.type}>
                      <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">
                        <Icon className="h-4 w-4" />
                        {group.type}
                      </h2>
                      <div className="mt-3 grid gap-2">
                        {group.results.map(({ document }, index) => (
                          <Link
                            key={document.id}
                            href={document.href}
                            onClick={() =>
                              trackEvent("search_result_clicked", {
                                content_type: document.type,
                                result_position: index + 1,
                                destination_path: document.href,
                              })
                            }
                            className="group flex items-start justify-between gap-4 rounded-2xl border border-[var(--ink)]/8 bg-[var(--mist)]/65 p-4 transition hover:border-[var(--aqua)]/35 hover:bg-white"
                          >
                            <span>
                              <span className="block text-sm font-extrabold text-[var(--ink)]">{document.title}</span>
                              <span className="mt-1 block text-xs leading-5 text-[var(--ink)]/56">{document.description}</span>
                            </span>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aqua)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.35rem] bg-[var(--mist)] p-6">
                <h2 className="font-serif text-3xl text-[var(--ink)]">No close match yet.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ink)]/62">
                  Try a shorter symptom phrase or ask the clinic. We record only query length and result count, never the medical wording you typed.
                </p>
                <Link href="/doctor-answers#ask" className="mt-5 inline-flex text-sm font-extrabold text-[var(--aqua)]">
                  Ask the Doctor safely
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
