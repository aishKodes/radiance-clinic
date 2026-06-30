import Image from "next/image";
import Link from "next/link";
import {Play, Radio, UsersRound} from "lucide-react";
import type {MediaLogo, VideoItem} from "@/types/cms";

export function VideoCommunitySection({
  videos,
  logos,
}: {
  videos: VideoItem[];
  logos: MediaLogo[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
      <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--ink)]/10 bg-[var(--ink)] p-7 text-[var(--ivory)] shadow-[0_32px_110px_rgba(15,16,22,0.22)]">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[var(--aqua)]/28 blur-3xl" />
        <div className="absolute -bottom-20 left-4 h-48 w-48 rounded-full bg-[var(--coral)]/22 blur-3xl" />
        <div className="relative">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/12">
            <Radio className="h-6 w-6 text-[var(--champagne)]" />
          </div>
          <p className="mt-14 text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--aqua)]">
            Our Videos
          </p>
          <h3 className="mt-4 font-serif text-5xl leading-[0.9]">
            Education that feels like a premium consultation preview.
          </h3>
          <p className="mt-6 text-base leading-8 text-white/62">
            Radiance can showcase recent videos and posts by Dr. Satyarth
            Prakash here, helping patients understand care pathways before they
            book.
          </p>
          <div className="mt-8 grid gap-3">
            {logos.map((logo) => (
              <div
                key={logo.title}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3"
              >
                <UsersRound className="h-4 w-4 text-[var(--champagne)]" />
                <span className="text-sm font-extrabold">{logo.title}</span>
                {logo.label ? (
                  <span className="ml-auto text-xs font-bold uppercase tracking-[0.16em] text-white/44">
                    {logo.label}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {videos.map((video, index) => {
          const content = (
            <div className="group relative h-[29rem] w-[19rem] shrink-0 overflow-hidden rounded-[2rem] border border-white/55 bg-white shadow-[0_28px_90px_rgba(15,16,22,0.14)]">
              {video.thumbnail ? (
                <Image
                  src={video.thumbnail.src}
                  alt={video.thumbnail.alt}
                  fill
                  sizes="310px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,22,0.05),rgba(15,16,22,0.82))]" />
              <div className="absolute left-5 top-5 rounded-full border border-white/24 bg-white/14 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                {video.label}
              </div>
              <div className="absolute left-5 top-1/2 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)] shadow-[0_18px_55px_rgba(0,0,0,0.24)] transition group-hover:scale-105">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <p className="font-mono text-sm font-extrabold text-[var(--champagne)]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-none text-white">
                  {video.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {video.description}
                </p>
              </div>
            </div>
          );

          return video.href ? (
            <Link
              key={video.title}
              href={video.href}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </Link>
          ) : (
            <div key={video.title}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
