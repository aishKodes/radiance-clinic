export type ArticleInlineToken =
  | { type: "text" | "strong" | "em"; text: string }
  | { type: "link"; text: string; href: string };

export function articleInlineTokens(value: string): ArticleInlineToken[] {
  const parts = value.split(/(\[[^\]]+\]\([^\s)]+\)|https?:\/\/[^\s<>]+|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.filter(Boolean).map((part) => {
    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      const [, text, href] = link;
      return /^(https?:\/\/|\/(?!\/)|#)/i.test(href)
        ? { type: "link", text, href }
        : { type: "text", text };
    }
    if (/^https?:\/\//.test(part)) return { type: "link", text: part, href: part };
    if (part.startsWith("**") && part.endsWith("**")) return { type: "strong", text: part.slice(2, -2) };
    if (part.startsWith("*") && part.endsWith("*")) return { type: "em", text: part.slice(1, -1) };
    return { type: "text", text: part.replace(/^>\s*/, "") };
  });
}
