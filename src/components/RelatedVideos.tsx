import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LiteYouTubeVideo } from "@/components/LiteYouTubeVideo";
import type { YouTubeVideo } from "@/types/video-library";

export function RelatedVideos({
  videos,
  title = "Watch the doctor-reviewed topic library",
}: {
  videos: YouTubeVideo[];
  title?: string;
}) {
  if (!videos.length) return null;
  return (
    <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">From the official Radiance channel</p>
            <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-[var(--ink)]">{title}</h2>
          </div>
          <Link href="/videos" className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--aqua)]">
            Explore all videos <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {videos.map((video) => <LiteYouTubeVideo key={video.videoId} video={video} />)}
        </div>
      </div>
    </section>
  );
}
