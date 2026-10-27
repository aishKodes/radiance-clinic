import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const wordpressIdPattern = /^\d+$/;
const wordpressIdKeys = ["p", "page_id", "attachment_id"] as const;
const wordpressFeedValues = new Set(["rss", "rss2", "atom", "rdf"]);

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  let hasLegacyWordPressParameter = false;

  for (const key of wordpressIdKeys) {
    const value = destination.searchParams.get(key);
    if (value && wordpressIdPattern.test(value)) {
      destination.searchParams.delete(key);
      hasLegacyWordPressParameter = true;
    }
  }

  const feed = destination.searchParams.get("feed")?.toLowerCase();
  if (feed && wordpressFeedValues.has(feed)) {
    destination.searchParams.delete("feed");
    hasLegacyWordPressParameter = true;
  }

  if (!hasLegacyWordPressParameter) {
    return NextResponse.next();
  }

  // Remove WordPress-only modifiers when a recognised legacy lookup is present.
  destination.searchParams.delete("post_type");
  destination.searchParams.delete("preview");

  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: "/",
};
