import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { clinic } from "@/data/seed";
import { PremiumButton } from "@/components/PremiumButton";
import { OpenBookingButton } from "@/components/OpenBookingButton";

export function StickyConsultationCard({ hair = false }: { hair?: boolean }) {
  return (
    <aside className="min-w-0 self-start rounded-[2rem] border border-[#151515]/10 bg-white/64 p-6 shadow-[0_24px_80px_rgba(21,21,21,0.1)] backdrop-blur-xl lg:sticky lg:top-28">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B78A4A]">
        Consultation
      </p>
      <h3 className="mt-4 font-serif text-3xl leading-tight text-[#151515]">
        Start with a doctor-led assessment.
      </h3>
      <div className="mt-7 space-y-4 text-sm text-[#151515]/68">
        <p className="flex gap-3">
          <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1E6F86]" />
          {hair ? "Doctor-led hair-loss, donor-area and scalp assessment." : "Personalized planning for skin, hair, laser or aesthetic care."}
        </p>
        {clinic.hours ? <p className="flex gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#1E6F86]" />
          {clinic.hours}
        </p> : null}
        <p className="flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1E6F86]" />
          {clinic.city}, {clinic.region}
        </p>
      </div>
      {hair ? <OpenBookingButton source="cta" className="mt-8 w-full">Book Hair &amp; Scalp Assessment</OpenBookingButton> : <PremiumButton href="/contact" className="mt-8 w-full">
        Book consultation
      </PremiumButton>}
    </aside>
  );
}

