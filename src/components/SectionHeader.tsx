import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto min-w-0 max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      <p
        className={cn(
          "mb-3 text-[0.68rem] font-extrabold uppercase leading-5 tracking-[0.22em] sm:mb-4 sm:text-xs sm:tracking-[0.34em]",
          inverse ? "text-[var(--champagne)]" : "text-[var(--aqua)]",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-serif text-[2.15rem] leading-[0.98] tracking-normal sm:text-5xl lg:text-6xl",
          inverse ? "text-[var(--ivory)]" : "text-[var(--ink)]",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-[0.95rem] leading-7 sm:mt-6 sm:text-lg sm:leading-8",
            inverse ? "text-white/64" : "text-[var(--ink)]/68",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
