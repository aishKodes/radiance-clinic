import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import {
  medicalEducationDisclaimer,
  radianceEditorialTeam,
  satyarthPrakash,
} from "@/data/doctor";

type MedicalReviewProps = {
  authorName?: string;
  authorType?: "editorial-team" | "doctor";
  reviewedAt?: string;
  variant?: "reviewed" | "answered";
  compact?: boolean;
  className?: string;
};

function formatReviewDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function MedicalReview({
  authorName,
  authorType = "editorial-team",
  reviewedAt,
  variant = "reviewed",
  compact = false,
  className = "",
}: MedicalReviewProps) {
  const isDoctorAuthored = authorType === "doctor";
  const heading =
    variant === "answered"
      ? `Answered by ${satyarthPrakash.name}`
      : isDoctorAuthored
        ? `Written by ${satyarthPrakash.name}`
      : `Medically reviewed by ${satyarthPrakash.name}`;
  const image = satyarthPrakash.profileImage;

  return (
    <aside
      aria-label={heading}
      className={`rounded-[1.25rem] border border-[var(--bronze)]/25 bg-white/70 p-5 shadow-[0_16px_48px_rgba(15,16,22,0.06)] ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--bronze)]/25 bg-[var(--mist)]">
          <Image
            src={image.uncroppedUrl || image.src}
            alt={`Dr. Satyarth Prakash, ${satyarthPrakash.role}`}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-[var(--bronze)]">
            <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
            {isDoctorAuthored ? "Doctor author" : "Medical oversight"}
          </p>
          <p className="mt-2 text-base font-extrabold leading-6 text-[var(--ink)]">
            {heading}
          </p>
          {!compact ? (
            <p className="mt-2 text-sm leading-6 text-[var(--ink)]/64">
              {isDoctorAuthored
                ? "This article was written by Dr. Satyarth Prakash and published by Radiance Clinics."
                : "This clinical content has been reviewed for medical accuracy and relevance to patient care at Radiance Clinics, Bhubaneswar."}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs leading-5 text-[var(--ink)]/58">
        {!isDoctorAuthored && authorName ? (
          <span>Written by {authorName || radianceEditorialTeam.name}</span>
        ) : null}
        {reviewedAt ? (
          <time dateTime={reviewedAt}>Last reviewed {formatReviewDate(reviewedAt)}</time>
        ) : null}
        <Link
          href={satyarthPrakash.profilePath}
          className="font-bold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
        >
          View doctor profile
        </Link>
      </div>

      {!compact ? (
        <p className="mt-4 border-t border-[var(--ink)]/10 pt-4 text-xs leading-5 text-[var(--ink)]/48">
          {medicalEducationDisclaimer}
        </p>
      ) : null}
    </aside>
  );
}
