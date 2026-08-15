"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LiteYouTubeVideo } from "@/components/LiteYouTubeVideo";
import type { YouTubeVideo } from "@/types/video-library";

const pageSize = 24;

export function VideoLibraryBrowser({
  videos,
  topics,
}: {
  videos: YouTubeVideo[];
  topics: string[];
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return videos.filter((video) => {
      if (topic !== "All topics" && video.primaryTopic !== topic) return false;
      if (!normalizedQuery) return true;
      return `${video.title} ${video.description} ${video.primaryTopic}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, topic, videos]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search videos</span>
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--aqua)]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(pageSize);
              }}
              placeholder="Search hair transplant, acne, pigmentation..."
              className="min-h-14 w-full rounded-full border border-[var(--ink)]/10 bg-white/78 pl-14 pr-5 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[var(--aqua)]/60"
            />
          </label>
          <select
            aria-label="Filter videos by topic"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setVisibleCount(pageSize);
            }}
            className="min-h-14 rounded-full border border-[var(--ink)]/10 bg-white/78 px-5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[var(--aqua)]/60"
          >
            <option>All topics</option>
            {topics.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <p className="mt-6 text-sm font-semibold text-[var(--ink)]/55" aria-live="polite">
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length} public videos
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visible.map((video) => <LiteYouTubeVideo key={video.videoId} video={video} />)}
        </div>
        {visibleCount < filtered.length ? (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + pageSize)}
              className="min-h-12 rounded-full bg-[var(--ink)] px-7 text-xs font-extrabold uppercase tracking-[0.14em] text-white"
            >
              Load more videos
            </button>
          </div>
        ) : null}
        {!filtered.length ? (
          <div className="mt-10 rounded-[2rem] bg-white/70 p-8 text-center">
            <h2 className="font-serif text-4xl text-[var(--ink)]">No matching video yet.</h2>
            <p className="mt-3 text-sm text-[var(--ink)]/60">Try a shorter topic or browse all topics.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
