import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OpenBookingButton } from "@/components/OpenBookingButton";

const hairConcernRoutes = [
  { label: "Hair fall", href: "/hair-loss-clinic-bhubaneswar" },
  { label: "Thinning", href: "/hair-loss-clinic-bhubaneswar" },
  { label: "Receding hairline", href: "/hairline-correction-bhubaneswar" },
  { label: "Crown baldness", href: "/crown-hair-transplant-bhubaneswar" },
  { label: "Patchy loss", href: "/alopecia-areata-treatment-bhubaneswar" },
  {
    label: "Previous transplant concern",
    href: "/hair-transplant-repair-bhubaneswar",
  },
  {
    label: "Hair patch / non-surgical option",
    href: "/non-surgical-hair-replacement-bhubaneswar",
  },
] as const;

export function HairIntakeWidget() {
  return (
    <section
      aria-labelledby="hair-intake-title"
      className="border-y border-[var(--ink)]/10 bg-white px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--aqua)]">
              Find the right starting point
            </p>
            <h2
              id="hair-intake-title"
              className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl"
            >
              What are you noticing?
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ink)]/64">
              Choose the closest concern to reach the relevant information.
              This is not a diagnosis; the doctor confirms the appropriate next
              step during consultation.
            </p>
            <div className="mt-7">
              <OpenBookingButton source="cta">
                Book Hair &amp; Scalp Assessment
              </OpenBookingButton>
            </div>
          </div>

          <nav aria-label="Hair concern pathways" className="grid gap-3 sm:grid-cols-2">
            {hairConcernRoutes.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-h-16 items-center justify-between gap-4 rounded-[1rem] border border-[var(--ink)]/10 bg-[var(--ivory)] px-5 py-4 text-sm font-extrabold text-[var(--ink)] transition hover:border-[var(--bronze)]/45 hover:bg-white"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--bronze)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
