import { legacyRedirects } from "@/lib/seo-config";

const privatePrefixes = ["/api", "/studio"];
const redirectSources = new Set(legacyRedirects.map((item) => item.source));

export function normalizeRoutePath(value: string) {
  try {
    const pathname = value.startsWith("http") ? new URL(value).pathname : value;
    if (pathname === "/") return "/";
    return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  } catch {
    return "";
  }
}

export function isIndexableRoute(value: string) {
  const path = normalizeRoutePath(value);
  if (!path || path.includes("?") || path.includes("#")) return false;
  if (privatePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return false;
  }
  return !redirectSources.has(path);
}

export type ProgrammaticPageCandidate = {
  slug: string;
  title?: string;
  description?: string;
  bodyText?: string;
  parentPath?: string;
  contextualLinks?: string[];
  canonicalPath?: string;
  status?: string;
  hasVerifiedUserValue?: boolean;
  missingVerifiedFields?: string[];
};

export function evaluateProgrammaticPageEligibility(
  candidate: ProgrammaticPageCandidate,
) {
  const reasons: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug)) reasons.push("invalid slug");
  if (candidate.status !== "published") reasons.push("not published");
  if (!candidate.title || candidate.title.length < 20) reasons.push("missing unique H1");
  if (!candidate.description || candidate.description.length < 70) reasons.push("missing metadata description");
  if (!candidate.bodyText || candidate.bodyText.length < 350) reasons.push("insufficient unique content");
  if (!candidate.parentPath) reasons.push("missing parent hub");
  if ((candidate.contextualLinks?.length || 0) < 2) reasons.push("insufficient contextual links");
  if (!candidate.canonicalPath || normalizeRoutePath(candidate.canonicalPath) !== candidate.canonicalPath) reasons.push("invalid canonical path");
  if (!candidate.hasVerifiedUserValue) reasons.push("verified user value not established");
  reasons.push(...(candidate.missingVerifiedFields || []));
  return { eligible: reasons.length === 0, reasons: Array.from(new Set(reasons)) };
}
