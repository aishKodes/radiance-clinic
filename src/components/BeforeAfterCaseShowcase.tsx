"use client";

import { TransformationShowcase } from "@/components/TransformationShowcase";
import { beforeAfterCasesToTransformations } from "@/lib/transformations";
import type { BeforeAfterCase } from "@/types/cms";

export function BeforeAfterCaseShowcase({ cases }: { cases: BeforeAfterCase[] }) {
  return (
    <TransformationShowcase
      eyebrow="Hair Transformation Examples"
      title="Hair Transformation Examples"
      description="Explore selected hair restoration examples shared with consent. Results vary by individual and consultation is required."
      category="hair"
      transformations={beforeAfterCasesToTransformations(cases)}
    />
  );
}
