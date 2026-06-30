"use client";

import dynamic from "next/dynamic";
import type { BeforeAfterCase } from "@/types/cms";

const RealResultsShowcase = dynamic(
  () =>
    import("@/components/RealResultsShowcase").then(
      (module) => module.RealResultsShowcase,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[32rem] rounded-[2.6rem] border border-white/12 bg-white/[0.08] shadow-[0_42px_140px_rgba(0,0,0,0.18)] backdrop-blur-xl" />
    ),
  },
);

export function DynamicRealResultsShowcase({
  cases,
}: {
  cases: BeforeAfterCase[];
}) {
  return <RealResultsShowcase cases={cases} />;
}
