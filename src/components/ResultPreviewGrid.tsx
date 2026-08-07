import Image from "next/image";
import Link from "next/link";
import type { ResultCase } from "@/data/result-cases";

function imageSource(image: ResultCase["beforeImage"]) {
  return image.desktopUrl || image.src;
}

export function ResultPreviewGrid({
  cases,
  limit,
}: {
  cases: ResultCase[];
  limit?: number;
}) {
  const displayed = typeof limit === "number" ? cases.slice(0, limit) : cases;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {displayed.map((item) => (
        <article
          key={`${item.category}-${item.slug}`}
          className="overflow-hidden rounded-[1.25rem] border border-[var(--ink)]/10 bg-white"
        >
          <div className="grid grid-cols-2 bg-[var(--mist)]">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={imageSource(item.beforeImage)}
                  alt={`${item.conditionName} before ${item.treatment.toLowerCase()} at Radiance Clinics Bhubaneswar`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink)]/56">
                Before
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden border-l border-[var(--ink)]/10">
                <Image
                  src={imageSource(item.afterImage)}
                  alt={`${item.conditionName} after ${item.treatment.toLowerCase()} at Radiance Clinics Bhubaneswar; individual results vary`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink)]/56">
                After
              </figcaption>
            </figure>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aqua)]">
              {item.treatment}
            </p>
            <h3 className="mt-3 text-xl font-extrabold text-[var(--ink)]">
              {item.conditionName}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--ink)]/62">
              Consent-confirmed treatment comparison. Individual outcomes vary.
            </p>
            <Link
              href={item.treatmentHref}
              className="mt-5 inline-flex text-sm font-extrabold text-[var(--bronze)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
            >
              Learn about {item.treatment.toLowerCase()}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
