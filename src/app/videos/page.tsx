import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { VideoLibraryBrowser } from "@/components/VideoLibraryBrowser";
import { medicalReviewer } from "@/data/concern-library";
import { videoLibraryVideos, videoTopics } from "@/data/video-library";
import { pageMetadata } from "@/lib/metadata";
import { videoObjectJsonLd, webPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Hair Transplant, Skin & Laser Videos | Radiance Clinics",
  description:
    "Browse the official Radiance Clinics video library for hair transplant, hair loss, acne, pigmentation, laser and skin education.",
  path: "/videos",
});

export default function VideosPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance Clinics Video Library",
          description: "Official patient education and treatment videos from Radiance Clinics.",
          path: "/videos",
        })}
      />
      {videoLibraryVideos.slice(0, 12).map((video) => (
        <JsonLd key={video.videoId} data={videoObjectJsonLd(video)} />
      ))}
      <section className="relative overflow-hidden bg-[var(--ink)] px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(31,127,143,0.33),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(217,189,130,0.2),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--champagne)]">Official YouTube library</p>
          <h1 className="mt-5 max-w-6xl font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.86]">Watch before you decide.</h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/64">
            Explore {videoLibraryVideos.length} public educational videos selected from a mapped catalogue of 180. Clinical context is reviewed by {medicalReviewer.name}, with {medicalReviewer.experience}; individual results and suitability vary.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/48">
            Result and promotional videos stay out of this library until their website context is cleared. Videos open through a privacy-enhanced YouTube player only after you choose play; captions or subtitles depend on the source video.
          </p>
        </div>
      </section>
      <VideoLibraryBrowser videos={videoLibraryVideos} topics={videoTopics} />
    </>
  );
}
