import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Treatment } from "@/types/cms";
import { cn } from "@/lib/utils";

const accentStyles = {
  bronze: "from-[var(--champagne)]/22 via-white/64 to-[var(--ivory)] text-[var(--bronze)]",
  blue: "from-[var(--aqua)]/12 via-white/64 to-[var(--ivory)] text-[var(--aqua)]",
  charcoal: "from-[var(--ink)]/8 via-white/64 to-[var(--ivory)] text-[var(--ink)]",
  coral: "from-[var(--coral)]/12 via-white/64 to-[var(--ivory)] text-[var(--coral)]",
  orchid: "from-[var(--orchid)]/10 via-white/64 to-[var(--ivory)] text-[var(--orchid)]",
  aqua: "from-[var(--aqua)]/12 via-white/64 to-[var(--ivory)] text-[var(--aqua)]",
};

export function TreatmentCard({
  treatment,
  featured = false,
}: {
  treatment: Treatment;
  featured?: boolean;
}) {
  const Icon = treatment.icon;

  return (
    <Link
      href={`/treatments/${treatment.cluster}/${treatment.slug}`}
      className={cn(
        "gradient-border group relative block overflow-hidden rounded-[1.65rem] bg-white/62 p-4 shadow-[0_20px_64px_rgba(16,16,20,0.075)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(16,16,20,0.12)]",
        featured && "lg:col-span-2 lg:p-8",
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-28 bg-gradient-to-br opacity-90",
          accentStyles[treatment.accent],
        )}
      />
      <div className="relative z-10 flex h-full flex-col">
        {treatment.image ? (
          <div className="relative mb-6 h-48 overflow-hidden rounded-[1.55rem] bg-[var(--mist)]">
            <Image
              src={treatment.image.src}
              alt={treatment.image.alt}
              fill
              sizes={featured ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 360px, 100vw"}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,20,0.02),rgba(16,16,20,0.42))]" />
          </div>
        ) : null}
        <div className="mb-10 flex items-start justify-between gap-6">
          <span className="rounded-full border border-[var(--ink)]/10 bg-[var(--ivory)]/80 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[var(--ink)]/64">
            {treatment.clusterLabel}
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/80 text-[var(--ink)] shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--bronze)]">
          {treatment.eyebrow}
        </p>
        <h3 className="font-serif text-3xl leading-none text-[var(--ink)]">
          {treatment.title}
        </h3>
        <p className="mt-5 max-w-xl flex-1 text-sm leading-7 text-[var(--ink)]/66">
          {treatment.summary}
        </p>
        <div className="mt-8 flex items-center justify-between border-t border-[var(--ink)]/10 pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]/52">
            {treatment.duration}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ink)]">
            Learn More
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
