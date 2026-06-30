"use client";

import { BeforeAfterCaseShowcase } from "@/components/BeforeAfterCaseShowcase";
import type { BeforeAfterCase } from "@/types/cms";

export function DynamicBeforeAfterCaseShowcase({
  cases,
}: {
  cases: BeforeAfterCase[];
}) {
  return <BeforeAfterCaseShowcase cases={cases} />;
}
