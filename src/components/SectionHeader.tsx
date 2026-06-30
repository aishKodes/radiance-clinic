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
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      <p
        className={cn(
          "mb-4 text-xs font-extrabold uppercase tracking-[0.34em]",
          inverse ? "text-[var(--champagne)]" : "text-[var(--aqua)]",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-serif text-4xl leading-[0.95] tracking-normal sm:text-5xl lg:text-6xl",
          inverse ? "text-[var(--ivory)]" : "text-[var(--ink)]",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base leading-8 sm:text-lg",
            inverse ? "text-white/64" : "text-[var(--ink)]/68",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
