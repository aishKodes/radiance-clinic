import Link from "next/link";
import {ArrowUpRight, Orbit, Sparkles} from "lucide-react";
import {treatmentUniverse} from "@/data/seed";
import {cn} from "@/lib/utils";

const colorMap = {
  bronze:
    "from-[var(--champagne)]/24 via-white/72 to-[var(--bronze)]/10 text-[var(--bronze)]",
  aqua: "from-[var(--aqua)]/14 via-white/72 to-[var(--aqua)]/8 text-[var(--aqua)]",
  coral:
    "from-[var(--coral)]/14 via-white/72 to-[var(--coral)]/8 text-[var(--coral)]",
  orchid:
    "from-[var(--orchid)]/12 via-white/72 to-[var(--orchid)]/7 text-[var(--orchid)]",
};

export function TreatmentUniverseSection() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 hidden h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--ink)]/8 lg:block" />
      <div className="absolute left-1/2 top-1/2 hidden h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--bronze)]/14 lg:block" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:grid-rows-2">
        {treatmentUniverse.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "gradient-border group relative min-h-64 overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-6 shadow-[0_22px_70px_rgba(15,16,22,0.07)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(15,16,22,0.12)]",
              colorMap[item.accent],
              index === 0 && "lg:col-span-3",
              index === 1 && "lg:col-span-2",
              index === 2 && "lg:col-span-2",
              index === 3 && "lg:col-span-2",
              index === 4 && "lg:col-span-2",
              index === 5 && "lg:col-span-2",
              index === 6 && "lg:col-span-1",
            )}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-current/10 blur-2xl transition duration-500 group-hover:scale-110" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-10 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/72 text-[var(--ink)] shadow-sm">
                  {index % 2 === 0 ? (
                    <Orbit className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[var(--ink)]/46 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[var(--ink)]/42">
                Treatment Option
              </p>
              <h3 className="mt-3 font-serif text-4xl leading-[0.92] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-sm flex-1 text-sm leading-7 text-[var(--ink)]/62">
                {item.text}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
