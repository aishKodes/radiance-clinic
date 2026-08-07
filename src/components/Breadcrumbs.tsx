import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function Breadcrumbs({
  items,
  inverse = false,
}: {
  items: BreadcrumbItem[];
  inverse?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em]",
          inverse ? "text-white/62" : "text-[var(--ink)]/52",
        )}
      >
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1.5">
              {index ? (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-50" />
              ) : null}
              {current ? (
                <span
                  aria-current="page"
                  className={cn(
                    "truncate",
                    inverse ? "text-white/82" : "text-[var(--ink)]/72",
                  )}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    "transition",
                    inverse ? "hover:text-white" : "hover:text-[var(--aqua)]",
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
