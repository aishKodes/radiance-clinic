import Image from "next/image";
import type {GalleryImage} from "@/types/cms";

export function ClinicAmbienceSection({images}: {images: GalleryImage[]}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.slice(0, 4).map((item, index) => (
          <div
            key={item.title}
            className={[
              "group relative overflow-hidden rounded-[2rem] border border-white/58 bg-white shadow-[0_28px_90px_rgba(15,16,22,0.12)]",
              index === 0 ? "min-h-[29rem] sm:row-span-2" : "min-h-[14rem]",
            ].join(" ")}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.68))]" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[var(--champagne)]">
                {item.category}
              </p>
              <h3 className="mt-2 font-serif text-3xl leading-none">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/62">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--ink)]/10 bg-white/58 p-7 shadow-[0_30px_100px_rgba(15,16,22,0.1)] backdrop-blur-xl">
        <div className="absolute -right-20 top-10 h-52 w-52 rounded-full bg-[var(--orchid)]/16 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[var(--aqua)]/18 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--bronze)]">
            Ambience & equipment
          </p>
          <h3 className="mt-5 font-serif text-5xl leading-[0.92] text-[var(--ink)]">
            Designed to feel calm, modern and medically precise.
          </h3>
          <p className="mt-6 text-base leading-8 text-[var(--ink)]/62">
            A calm, modern clinic environment supports consultation, treatment
            planning and patient comfort at every step.
          </p>
          <div className="mt-10 grid gap-3">
            {[
              "Comfortable consultation and treatment spaces",
              "Clinic rooms, technology and ambience",
              "Doctor-led planning in a private setting",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--ink)]/10 bg-white/62 px-4 py-3 text-sm font-extrabold text-[var(--ink)]/68"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
