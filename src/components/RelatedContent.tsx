import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type RelatedContentItem = {
  href: string;
  label: string;
  description: string;
};

export function RelatedContent({
  eyebrow = "Continue researching",
  title,
  items,
}: {
  eyebrow?: string;
  title: string;
  items: RelatedContentItem[];
}) {
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.href, item])).values(),
  );

  if (!uniqueItems.length) return null;

  return (
    <section className="bg-[var(--mist)] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--bronze)]">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
          {title}
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uniqueItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-40 flex-col justify-between border-t border-[var(--ink)]/16 py-5 transition hover:border-[var(--bronze)]"
            >
              <ArrowUpRight className="h-5 w-5 self-end text-[var(--bronze)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <div>
                <h3 className="text-lg font-extrabold text-[var(--ink)]">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink)]/62">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
