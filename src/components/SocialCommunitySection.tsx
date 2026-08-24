import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  Camera,
  MapPin,
  MessagesSquare,
  MonitorPlay,
  Play,
  ShieldCheck,
  Star,
} from "lucide-react";
import type {
  Article,
  ReviewSummary,
  SocialLink,
  SocialStat,
  VideoItem,
} from "@/types/cms";

const iconMap = {
  instagram: Camera,
  youtube: MonitorPlay,
  google: MapPin,
  facebook: MessagesSquare,
  linkedin: BriefcaseBusiness,
};

function imagePosition(image?: SocialLink["image"]) {
  const focal = image?.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

function statFor(platform: string, stats: SocialStat[]) {
  return stats.find((item) => item.platform === platform);
}

export function SocialCommunitySection({
  links,
  stats,
  reviewSummary,
  videos,
  articles,
}: {
  links: SocialLink[];
  stats: SocialStat[];
  reviewSummary: ReviewSummary;
  videos: VideoItem[];
  articles: Article[];
}) {
  if (!links.length && !videos.length && !articles.length) {
    return null;
  }

  const featured = links[0];
  const support = links.slice(1).filter((link) => link.platform !== "google");
  const googleLink =
    reviewSummary.googleMapsUrl ||
    links.find((link) => link.platform === "google")?.url ||
    "/reviews";

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
      {featured ? (
        <article className="gradient-border relative min-h-[31rem] min-w-0 overflow-hidden rounded-[1.45rem] bg-[var(--ink)] p-3 text-[var(--ivory)] shadow-[0_38px_130px_rgba(15,16,22,0.18)] sm:min-h-[38rem] sm:rounded-[2.8rem] sm:p-4">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--orchid)]/24 blur-3xl" />
          <div className="absolute -bottom-24 left-6 h-72 w-72 rounded-full bg-[var(--aqua)]/20 blur-3xl" />
          <div className="relative h-full overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/[0.06] sm:rounded-[2.25rem]">
            {featured.image ? (
              <Image
                src={featured.image.desktopUrl || featured.image.src}
                alt={featured.image.altText || featured.image.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                placeholder={featured.image.blurDataUrl ? "blur" : "empty"}
                blurDataURL={featured.image.blurDataUrl}
                className="object-cover opacity-80"
                style={{ objectPosition: imagePosition(featured.image) }}
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,22,0.12),rgba(15,16,22,0.86))]" />
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-2 text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[var(--champagne)] backdrop-blur sm:mb-5 sm:px-4 sm:text-[0.64rem] sm:tracking-[0.22em]">
                <ShieldCheck className="h-4 w-4" />
                Official clinic channels
              </div>
              <h3 className="font-serif text-4xl leading-[0.94] sm:text-6xl sm:leading-[0.88]">
                Follow Radiance Clinics
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/64">
                Watch treatment explainers and clinic updates through official
                Radiance Clinics channels.
              </p>
              <Link
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--champagne)]"
              >
                {featured.ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      ) : null}

      <div className="grid gap-5">
        <div className="grid gap-4 min-[380px]:grid-cols-2">
          {support.map((link) => {
            const Icon =
              iconMap[link.platform as keyof typeof iconMap] || ArrowUpRight;
            const stat = statFor(link.platform, stats);
            const value =
              link.platform === "google" && reviewSummary.googleRating
                ? `${reviewSummary.googleRating} rating`
                : stat?.value;

            return (
              <Link
                key={link.platform}
                href={
                  link.platform === "google"
                    ? reviewSummary.googleMapsUrl || link.url
                    : link.url
                }
                target="_blank"
                rel="noreferrer"
                className="group relative min-h-[14rem] min-w-0 overflow-hidden rounded-[1.35rem] border border-[var(--ink)]/10 bg-white/62 p-4 shadow-[0_24px_90px_rgba(15,16,22,0.08)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 sm:min-h-[17rem] sm:rounded-[2rem]"
              >
                {link.image ? (
                  <Image
                    src={link.image.src}
                    alt={link.image.altText || link.image.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 100vw"
                    placeholder={link.image.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={link.image.blurDataUrl}
                    className="object-cover opacity-26 transition duration-700 group-hover:scale-105 group-hover:opacity-36"
                    style={{ objectPosition: imagePosition(link.image) }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,237,0.76),rgba(255,247,237,0.98))]" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--ivory)] shadow-[0_18px_50px_rgba(15,16,22,0.18)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[var(--bronze)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
                      {link.handle || link.platform}
                    </p>
                    <h4 className="mt-3 font-serif text-3xl leading-none text-[var(--ink)]">
                      {link.label}
                    </h4>
                    <p className="mt-4 text-sm leading-6 text-[var(--ink)]/58">
                      {value ||
                        stat?.label ||
                        "Official Radiance Clinics profile."}
                    </p>
                    <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]/68">
                      {link.ctaLabel}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {videos.length ? (
          <div className="relative min-w-0 overflow-hidden rounded-[1.4rem] border border-[var(--ink)]/10 bg-white/58 p-4 shadow-[0_28px_100px_rgba(15,16,22,0.09)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-5">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[var(--bronze)]">
                  Our Videos
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-none text-[var(--ink)] sm:text-4xl">
                  Doctor-led treatment guidance.
                </h3>
              </div>
              <MonitorPlay className="hidden h-7 w-7 text-[var(--coral)] sm:block" />
            </div>
            <div
              data-lenis-prevent-touch
              className="mobile-scroll-row flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2"
            >
              {videos.slice(0, 4).map((video) => (
                <Link
                  key={video.title}
                  href={
                    video.href ||
                    "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="group w-[15.5rem] shrink-0 snap-start overflow-hidden rounded-[1.35rem] border border-white/70 bg-white shadow-[0_18px_70px_rgba(15,16,22,0.08)] sm:w-[18rem] sm:rounded-[1.7rem]"
                >
                  <div className="relative h-44 bg-[var(--mist)]">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail.src}
                        alt={video.thumbnail.altText || video.thumbnail.alt}
                        fill
                        sizes="288px"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.66))]" />
                    <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/24 bg-white/16 text-white backdrop-blur">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[var(--bronze)]">
                      {video.label}
                    </p>
                    <h4 className="mt-2 font-serif text-2xl leading-none text-[var(--ink)]">
                      {video.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="grid min-w-0 gap-5 lg:col-span-2 lg:grid-cols-[1.3fr_0.7fr]">
        {articles.length ? (
          <section className="min-w-0 rounded-[1.4rem] border border-[var(--ink)]/10 bg-white/62 p-4 shadow-[0_24px_90px_rgba(15,16,22,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
                  Doctor-reviewed articles
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-none text-[var(--ink)] sm:text-4xl">
                  Read before your consultation.
                </h3>
              </div>
              <BookOpenText className="hidden h-7 w-7 text-[var(--aqua)] sm:block" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <Link
                  key={article.slug}
                  href={`/knowledge/${article.slug}`}
                  className="group flex min-w-0 flex-col rounded-[1.15rem] border border-[var(--ink)]/10 bg-[var(--ivory)] p-4 transition hover:border-[var(--bronze)]/40 hover:bg-white"
                >
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[var(--bronze)]">
                    {article.category}
                  </p>
                  <h4 className="mt-3 text-lg font-extrabold leading-6 text-[var(--ink)]">
                    {article.title}
                  </h4>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--ink)]/60">
                    {article.excerpt}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)]/68">
                    Read article
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/knowledge"
              className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--bronze)]"
            >
              View all articles
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        ) : null}

        <aside className="flex min-w-0 flex-col rounded-[1.4rem] bg-[var(--ink)] p-6 text-[var(--ivory)] shadow-[0_28px_100px_rgba(15,16,22,0.16)] sm:rounded-[2rem] sm:p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--champagne)] text-[var(--ink)]">
            <Star className="h-5 w-5 fill-current" />
          </span>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
            Patient reviews
          </p>
          <h3 className="mt-3 font-serif text-4xl leading-none">
            Read patient feedback on Google.
          </h3>
          <p className="mt-5 text-sm leading-7 text-white/64">
            See patient feedback about consultations, clinic care and treatment
            planning on the clinic&apos;s Google profile.
          </p>
          {reviewSummary.googleRating ? (
            <p className="mt-5 font-mono text-2xl font-extrabold text-[var(--champagne)]">
              {reviewSummary.googleRating} rating
              {reviewSummary.googleReviewCount
                ? ` · ${reviewSummary.googleReviewCount} reviews`
                : ""}
            </p>
          ) : null}
          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href={googleLink}
              target={googleLink.startsWith("http") ? "_blank" : undefined}
              rel={googleLink.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink)] transition hover:bg-[var(--champagne)]"
            >
              Google Reviews
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/reviews"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              Reviews page
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
