import { Cpu, Microscope, ShieldCheck } from "lucide-react";
import { PremiumImageCard } from "@/components/PremiumImageCard";
import type { GalleryImage } from "@/types/cms";

export function EquipmentFeatureStrip({ images }: { images: GalleryImage[] }) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
      <div className="relative overflow-hidden rounded-[2.6rem] border border-white/12 bg-[var(--ink)] p-8 text-[var(--ivory)] shadow-[0_34px_120px_rgba(15,16,22,0.18)]">
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-[var(--aqua)]/24 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-[var(--coral)]/18 blur-3xl" />
        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-white/10 text-[var(--champagne)]">
            <Microscope className="h-6 w-6" />
          </span>
          <p className="mt-12 text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--aqua)]">
            Advanced equipment
          </p>
          <h3 className="mt-5 font-serif text-5xl leading-[0.9]">
            Advanced Technology. Personalised Treatment Planning.
          </h3>
          <p className="mt-6 text-sm leading-7 text-white/64">
            Technology supports doctor-led assessment, calibrated settings,
            suitability checks and clear aftercare. No device is presented as a
            blanket promise.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              { label: "Skin-type aware settings", icon: Cpu },
              { label: "Doctor-led treatment planning", icon: ShieldCheck },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3 text-sm font-extrabold text-white/74"
              >
                <Icon className="h-4 w-4 text-[var(--champagne)]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {images.slice(0, 3).map((item, index) => (
          <PremiumImageCard
            key={`${item.category}-${item.title}`}
            image={item.image}
            label={item.category}
            title={item.title}
            caption={item.caption}
            aspect={index === 0 ? "aspect-[4/5] md:aspect-auto" : "aspect-[4/5]"}
            sizes="(min-width: 1024px) 26vw, 100vw"
            className={index === 0 ? "md:row-span-2" : ""}
          />
        ))}
      </div>
    </div>
  );
}
