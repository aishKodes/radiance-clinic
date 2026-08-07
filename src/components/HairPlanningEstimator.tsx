import { PremiumButton } from "@/components/PremiumButton";

export function HairPlanningEstimator() {
  return (
    <section className="bg-[var(--ink)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--champagne)]">Educational planning</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Hair restoration estimates require scalp assessment.</h2>
          <p id="estimator-guidance" className="mt-5 text-sm leading-7 text-white/64">Radiance Clinics does not calculate a graft range from a generic online formula. Pattern stability, treatment area, donor capacity and long-term planning need individual review.</p>
          <PremiumButton href="/contact" variant="ivory" className="mt-8">Book hair assessment</PremiumButton>
        </div>
        <form aria-describedby="estimator-guidance" className="grid gap-4 rounded-[1.25rem] border border-white/12 bg-white/[0.06] p-6">
          <fieldset disabled className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-white/78">Area of concern<select className="min-h-12 rounded-lg border border-white/16 bg-white/10 px-4 text-white/58"><option>Assessed during consultation</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-white/78">Donor-area measurements<input value="Clinical assessment required" readOnly className="min-h-12 rounded-lg border border-white/16 bg-white/10 px-4 text-white/58" /></label>
            <output className="sm:col-span-2 rounded-lg border border-[var(--champagne)]/30 bg-[var(--champagne)]/10 p-5 text-sm leading-7 text-white/72">No numerical graft estimate is shown without a clinic-approved method and individual donor assessment.</output>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
