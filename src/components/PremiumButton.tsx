import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PremiumButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "charcoal" | "ivory" | "outline" | "ghost";
  className?: string;
  icon?: LucideIcon;
};

const variants = {
  charcoal:
    "border-transparent bg-[linear-gradient(135deg,var(--ink),#27201a)] text-[var(--ivory)] shadow-[0_18px_55px_rgba(16,16,20,0.22)] hover:shadow-[0_22px_70px_rgba(156,107,52,0.18)]",
  ivory:
    "border-white/70 bg-[rgba(255,247,237,0.88)] text-[var(--ink)] shadow-[0_18px_45px_rgba(255,247,237,0.24)] hover:bg-white",
  outline:
    "border-[var(--ink)]/12 bg-white/42 text-[var(--ink)] hover:border-[var(--bronze)]/55 hover:bg-white/80",
  ghost:
    "border-transparent bg-transparent text-[var(--ink)] hover:bg-[var(--ink)]/5",
};

export function PremiumButton({
  href,
  children,
  variant = "charcoal",
  className,
  icon: Icon = ArrowRight,
}: PremiumButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </>
  );

  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 py-3 text-sm font-extrabold tracking-[0.1em] uppercase transition duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--aqua)]/50 focus:ring-offset-2 focus:ring-offset-[var(--ivory)]",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return <button className={classes}>{content}</button>;
}
