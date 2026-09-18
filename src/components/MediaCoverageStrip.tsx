import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredMediaOutlets } from "@/data/media-coverage";

export function MediaCoverageStrip({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section
      aria-labelledby="featured-media-title"
      className={`border-y border-[var(--ink)]/10 bg-white/44 px-4 py-9 sm:px-8 sm:py-11 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0">
          <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">
            Media Coverage
          </p>
          <h2
            id="featured-media-title"
            className="mt-2 font-serif text-2xl leading-none text-[var(--ink)] sm:text-3xl"
          >
            Featured in
          </h2>
        </div>

        <ul className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:flex lg:items-center lg:gap-8">
          {featuredMediaOutlets.map((item) => (
            <li key={item.id} className="min-w-0">
              <Link
                href="/media"
                className="flex h-12 items-center justify-center transition-opacity hover:opacity-70"
                aria-label={`Read ${item.outletName} coverage of Radiance Clinics`}
              >
                <Image
                  src={item.officialLogo.src}
                  alt={item.outletName}
                  width={item.officialLogo.width}
                  height={item.officialLogo.height}
                  sizes="(min-width: 1024px) 130px, 120px"
                  className="max-h-12 w-auto max-w-[8.5rem] object-contain"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/media"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-extrabold text-[var(--ink)] transition hover:text-[var(--bronze)]"
        >
          View media coverage
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
