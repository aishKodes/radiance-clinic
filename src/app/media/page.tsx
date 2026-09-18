import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { featuredMediaCoverage } from "@/data/media-coverage";
import { pageMetadata } from "@/lib/metadata";
import {
  breadcrumbJsonLd,
  mediaCoverageCollectionJsonLd,
  webPageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Radiance in the Media",
  description:
    "Verified external coverage of Dr. Satyarth Prakash and Radiance Clinics across hair restoration and skin care.",
  path: "/media",
});

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function MediaPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Radiance in the Media",
          description:
            "Verified external coverage of Dr. Satyarth Prakash and Radiance Clinics.",
          path: "/media",
        })}
      />
      <JsonLd data={mediaCoverageCollectionJsonLd(featuredMediaCoverage)} />
      <JsonLd
        data={
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Radiance in the Media", path: "/media" },
          ])
        }
      />

      <section className="border-b border-[var(--ink)]/10 bg-[var(--ink)] px-5 pb-16 pt-36 text-[var(--ivory)] sm:px-8 sm:pb-20 lg:pb-24 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
            External Coverage
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.94] sm:text-7xl">
            Radiance in the Media
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            Selected verified coverage of Dr. Satyarth Prakash and Radiance
            Clinics. Each link opens the original article on the publication&apos;s
            website.
          </p>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Selected coverage
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-[var(--ink)] sm:text-5xl">
              Coverage connected to care patients ask about.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredMediaCoverage.map((item) => (
              <article
                key={item.id}
                className="flex min-w-0 flex-col border border-[var(--ink)]/10 bg-white p-6 shadow-[0_20px_70px_rgba(15,16,22,0.06)] sm:p-8"
              >
                <div className="flex min-h-16 items-center justify-between gap-5 border-b border-[var(--ink)]/10 pb-5">
                  <Image
                    src={item.officialLogo.src}
                    alt={item.outletName}
                    width={item.officialLogo.width}
                    height={item.officialLogo.height}
                    sizes="(min-width: 768px) 180px, 150px"
                    className="max-h-14 w-auto max-w-[11rem] object-contain object-left"
                  />
                  <span className="shrink-0 text-right text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[var(--bronze)]">
                    {item.topicLabel}
                  </span>
                </div>

                <h3 className="mt-7 font-serif text-3xl leading-[1.02] text-[var(--ink)]">
                  {item.articleTitle}
                </h3>
                <p className="mt-5 text-sm leading-7 text-[var(--ink)]/66">
                  {item.summary}
                </p>
                <p className="mt-6 flex items-center gap-2 text-sm text-[var(--ink)]/58">
                  <CalendarDays className="h-4 w-4 text-[var(--bronze)]" />
                  <time dateTime={item.publicationDate}>
                    {formatPublicationDate(item.publicationDate)}
                  </time>
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--ink)]/10 pt-6">
                  <a
                    href={item.originalArticleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--ink)] transition hover:text-[var(--bronze)]"
                  >
                    Read Original Article
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <Link
                    href={item.relatedPage.href}
                    className="text-sm font-bold text-[var(--ink)]/68 underline decoration-[var(--bronze)]/50 underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--bronze)]"
                  >
                    {item.relatedPage.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
