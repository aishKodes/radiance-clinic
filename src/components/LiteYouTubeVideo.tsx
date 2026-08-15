"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import { formatVideoDuration } from "@/data/video-library";
import { trackEvent } from "@/lib/analytics";
import type { YouTubeVideo } from "@/types/video-library";

export function LiteYouTubeVideo({ video }: { video: YouTubeVideo }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article id={`video-${video.videoId}`} className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-[var(--ink)]/10 bg-white/70 shadow-[0_24px_70px_rgba(15,16,22,0.08)]">
      <div className="relative aspect-video bg-[var(--ink)]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${video.title}`}
            onClick={() => {
              setPlaying(true);
              trackEvent("video_played", {
                video_id: video.videoId,
                video_topic: video.primaryTopic,
              });
            }}
            className="group absolute inset-0 w-full text-left"
          >
            <Image
              src={video.thumbnail}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/48 via-transparent to-black/10" />
            <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)] shadow-2xl transition group-hover:scale-105">
              <Play className="h-6 w-6 fill-current" />
            </span>
            {video.durationSeconds ? (
              <span className="absolute bottom-3 right-3 rounded-md bg-black/78 px-2 py-1 text-xs font-bold text-white">
                {formatVideoDuration(video.durationSeconds)}
              </span>
            ) : null}
          </button>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[var(--bronze)]">
          <span>{video.primaryTopic}</span>
          {video.publishedAt ? <time dateTime={video.publishedAt}>{video.publishedAt}</time> : null}
        </div>
        <h3 className="mt-4 font-serif text-3xl leading-none text-[var(--ink)]">{video.title}</h3>
        {video.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--ink)]/62">{video.description}</p>
        ) : null}
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--aqua)]"
        >
          Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
