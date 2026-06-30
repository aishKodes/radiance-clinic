import Image from "next/image";
import {
  authorityPoints,
  clinic,
  doctorProfile as seedDoctorProfile,
} from "@/data/seed";
import { radianceMedia } from "@/data/real-media";
import {
  AnimatedAuroraBackground,
  LuxuryNoiseOverlay,
  SciencePatternOverlay,
} from "@/components/BackgroundEffects";
import { OpenBookingButton } from "@/components/OpenBookingButton";
import { PremiumButton } from "@/components/PremiumButton";
import type { DoctorProfile } from "@/types/cms";

function imagePosition(image: { focalPoint?: { x: number; y: number } }) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

export function DoctorAuthority({
  doctor = seedDoctorProfile,
}: {
  doctor?: DoctorProfile;
}) {
  const doctorImage = doctor.image || radianceMedia.doctorConsultation || radianceMedia.doctorProfile;

  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink)] px-5 py-24 text-[var(--ivory)] sm:px-8 lg:py-32">
      <AnimatedAuroraBackground className="z-0 opacity-70" />
      <SciencePatternOverlay className="z-0 opacity-20" />
      <LuxuryNoiseOverlay className="z-0" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative rounded-[3rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_36px_120px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(41,195,209,0.34),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(255,122,89,0.28),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(124,58,237,0.34),transparent_28%)]" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] border border-white/12 bg-[radial-gradient(circle_at_30%_20%,rgba(42,195,214,0.18),transparent_32%),var(--ink)] sm:aspect-[16/12] lg:aspect-[4/5]">
            <Image
              src={doctorImage.desktopUrl || doctorImage.src}
              alt={doctorImage.altText || doctorImage.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              placeholder={doctorImage.blurDataUrl ? "blur" : "empty"}
              blurDataURL={doctorImage.blurDataUrl}
              className="object-contain"
              style={{ objectPosition: imagePosition(doctorImage) }}
            />
          </div>
          <div className="relative mt-4 rounded-[2rem] border border-white/12 bg-[rgba(16,16,20,0.55)] p-5 backdrop-blur-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--champagne)]">
              Founder and lead doctor
            </p>
            <p className="mt-3 font-serif text-3xl leading-none text-white sm:text-4xl">
              {doctor.name || clinic.doctor}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Doctor-led consultations with careful assessment, realistic
              guidance and treatment planning.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.36em] text-[var(--aqua)]">
            Meet the doctor
          </p>
          <h2 className="font-serif text-5xl leading-[0.9] tracking-normal sm:text-6xl lg:text-7xl">
            Led by {doctor.name || clinic.doctor}
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--ivory)]/74">
            {doctor.shortBio}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <PremiumButton href="/about" variant="ivory">
              Doctor profile
            </PremiumButton>
            <OpenBookingButton
              source="homepage_booking"
              className="border-white/20 bg-white/5 text-[var(--ivory)] hover:bg-white/10"
            >
              Plan a consultation
            </OpenBookingButton>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {authorityPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.label}
                  className="gradient-border rounded-[1.5rem] bg-white/[0.07] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                >
                  <Icon className="mb-8 h-6 w-6 text-[var(--champagne)]" />
                  <p className="text-lg font-bold text-[var(--ivory)]">
                    {doctor.authorityPoints[index] || point.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
