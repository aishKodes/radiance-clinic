import { FAQAccordion } from "@/components/FAQAccordion";

export type ClinicalSection = {
  title: string;
  items?: string[];
};

export function ClinicalContentSections({
  sections,
  faqs,
}: {
  sections: ClinicalSection[];
  faqs?: { question: string; answer: string }[];
}) {
  const visibleSections = sections.filter((section) => section.items?.length);
  if (!visibleSections.length && !faqs?.length) return null;

  return <section className="bg-[var(--ivory)] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
    <div className="mx-auto max-w-7xl space-y-14">
      {visibleSections.map((section) => (
        <div key={section.title} className="grid gap-7 lg:grid-cols-[0.58fr_1.42fr]">
          <h2 className="font-serif text-4xl leading-tight text-[var(--ink)]">{section.title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.items?.map((item) => <li key={item} className="border-t border-[var(--ink)]/12 py-4 text-sm leading-7 text-[var(--ink)]/68">{item}</li>)}
          </ul>
        </div>
      ))}
      {faqs?.length ? (
        <div className="grid gap-7 lg:grid-cols-[0.58fr_1.42fr]">
          <h2 className="font-serif text-4xl leading-tight text-[var(--ink)]">Questions patients ask</h2>
          <FAQAccordion items={faqs} />
        </div>
      ) : null}
    </div>
  </section>;
}
