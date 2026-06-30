import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, ShieldCheck, Sparkles } from "lucide-react";

import { PremiumButton } from "@/components/PremiumButton";

export const metadata: Metadata = {
  title: "Radiance Admin",
  description:
    "Radiance Clinics content is managed through the custom PHP and MySQL admin panel.",
  robots: {
    index: false,
    follow: false,
  },
};

const adminUrl = "https://admin.radianceclinics.com";
const apiUrl = "https://api.radianceclinics.com";

export default function StudioRoutePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--ivory)] px-5 py-28 text-[var(--ink)] sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(42,195,214,0.26),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(255,123,97,0.22),transparent_34%),radial-gradient(circle_at_52%_74%,rgba(124,77,255,0.18),transparent_38%),linear-gradient(135deg,#fff7ed,#f3ede3)]" />
      <div className="absolute inset-0 -z-10 opacity-45 [background-image:linear-gradient(rgba(15,16,22,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,16,22,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em] text-[var(--bronze)] shadow-[0_18px_60px_rgba(15,16,22,0.08)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Custom CMS Active
          </div>

          <h1 className="max-w-3xl text-balance font-serif text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Radiance content now lives in the Hostinger admin.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[rgba(15,16,22,0.68)]">
            Sanity is no longer the primary CMS for this site. The Vercel
            frontend reads published content from the custom PHP and MySQL API,
            with premium fallback content if the API is temporarily unavailable.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <PremiumButton href={adminUrl} icon={ArrowRight}>
              Open Admin Panel
            </PremiumButton>
            <PremiumButton href="/" variant="outline">
              View Website
            </PremiumButton>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/65 bg-white/55 p-5 shadow-[0_28px_110px_rgba(15,16,22,0.16)] backdrop-blur-2xl">
          <div className="rounded-[1.5rem] border border-white/70 bg-[rgba(255,247,237,0.72)] p-6">
            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-[0_18px_48px_rgba(15,16,22,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(42,195,214,0.14)] text-[var(--aqua)]">
                  <Database className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-3xl tracking-[-0.03em]">
                  API-first publishing
                </h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(15,16,22,0.62)]">
                  Content is served from{" "}
                  <Link
                    className="font-semibold text-[var(--bronze)] underline decoration-[var(--champagne)] underline-offset-4"
                    href={apiUrl}
                  >
                    api.radianceclinics.com
                  </Link>{" "}
                  and edited through the custom admin on Hostinger.
                </p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-[0_18px_48px_rgba(15,16,22,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(183,133,58,0.14)] text-[var(--bronze)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-3xl tracking-[-0.03em]">
                  Safe frontend fallback
                </h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(15,16,22,0.62)]">
                  If the API is offline, the website still renders the premium
                  homepage, treatments, articles, gallery, video, and assistant
                  knowledge from local fallback data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
