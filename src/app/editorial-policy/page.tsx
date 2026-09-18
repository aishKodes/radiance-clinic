import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BookOpenCheck, RefreshCw } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PremiumButton } from "@/components/PremiumButton";
import { medicalEducationDisclaimer, radianceEditorialTeam } from "@/data/doctor";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Editorial Policy | Radiance Clinics",
  description:
    "How Radiance Clinics creates, reviews and updates patient education for hair, skin, laser and aesthetic care.",
  path: "/editorial-policy",
});

const workflow = [
  "A patient question or search need is identified.",
  "Existing Radiance clinical knowledge and historical material are reviewed.",
  "Relevant Radiance doctor and video material is incorporated where it helps patients understand the topic.",
  "External medical references are used where a factual medical claim benefits from sourcing.",
  "Substantive medical content is reviewed by Dr. Satyarth Prakash for clinical accuracy and relevance.",
  "The page is published with author and review information where available.",
  "Content is updated when clinical information or verified service details change.",
];

export default function EditorialPolicyPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "Editorial Policy",
          description:
            "How Radiance Clinics creates, reviews and updates patient education.",
          path: "/editorial-policy",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Editorial Policy", path: "/editorial-policy" },
        ])}
      />

      <section className="bg-[var(--ink)] px-5 pb-20 pt-36 text-[var(--ivory)] sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
            {radianceEditorialTeam.name}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] sm:text-7xl">
            How Radiance medical content is created.
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Radiance Clinics publishes patient education to help people prepare for a consultation and understand common hair, skin, laser and aesthetic questions. It is designed to support, not replace, individual medical care.
          </p>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Medical review
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">
              Clinical oversight is visible, not implied.
            </h2>
          </div>
          <div className="max-w-3xl space-y-6 text-base leading-8 text-[var(--ink)]/68">
            <p>
              Substantive medical content on this website has been reviewed by Dr. Satyarth Prakash of Radiance Clinics, Bhubaneswar. Review focuses on medical accuracy, clinical relevance, safety language and realistic expectations.
            </p>
            <p>
              Pages identify the author workflow accurately. Most patient education is prepared by {radianceEditorialTeam.name}; a page is attributed to Dr. Satyarth Prakash only where he is the genuine author or answer source.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-extrabold text-[var(--aqua)] underline decoration-[var(--aqua)]/35 underline-offset-4 hover:decoration-[var(--aqua)]"
            >
              View Dr. Satyarth Prakash&apos;s profile
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
              Editorial workflow
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none text-[var(--ink)]">
              A clear review process for patient education.
            </h2>
          </div>
          <ol className="mt-12 grid gap-x-10 md:grid-cols-2">
            {workflow.map((step, index) => (
              <li key={step} className="flex gap-5 border-t border-[var(--ink)]/14 py-6">
                <span className="font-mono text-sm font-extrabold text-[var(--bronze)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-7 text-[var(--ink)]/72">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "No unsupported promises",
              text: "We avoid guaranteed outcomes, inferred treatment details and ranking claims that cannot be verified.",
            },
            {
              icon: BookOpenCheck,
              title: "Sources where they matter",
              text: "Educational pages can include reputable references when they clarify a material medical point.",
            },
            {
              icon: RefreshCw,
              title: "Reviewed and updated",
              text: "Medical and service content is revised when verified clinical information changes.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="border-t border-[var(--ink)]/14 py-6">
                <Icon className="h-6 w-6 text-[var(--bronze)]" />
                <h2 className="mt-6 text-xl font-extrabold text-[var(--ink)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ink)]/64">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-16 text-[var(--ivory)] sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-serif text-4xl leading-none">
              Educational information, individual assessment.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/66">
              {medicalEducationDisclaimer}
            </p>
          </div>
          <PremiumButton href="/contact" variant="ivory">
            Book consultation
          </PremiumButton>
        </div>
      </section>
    </>
  );
}
