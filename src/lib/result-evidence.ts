type ResultSource = {
  id: string;
  category?: string;
  replacementAfter?: boolean;
  publish?: boolean;
};

export function originalComparisonSourceIds(sources: readonly ResultSource[]) {
  // Consent alone does not establish that a replacement image is an original clinical result.
  return new Set(
    sources
      .filter((source) => source.category === "before-after" && source.replacementAfter === false && source.publish !== false)
      .map((source) => source.id),
  );
}
