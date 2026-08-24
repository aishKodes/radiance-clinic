# Radiance Clinics Emergency SEO Recovery - August 2026

## Current Problem

The migration replaced a large WordPress URL set without a complete equivalence map. Search Console reports 642 known URLs, of which 412 are not indexed; 258 are currently classified as not found. Several valuable queries continue to rank through the homepage or legacy URLs instead of the intended treatment page.

## Search Console Findings

Authenticated exports were captured for 7 days, 28 days, the previous 28 days and 3 months, including query, page, date, device and country views. The latest complete periods showed 519 clicks and 51,080 impressions in 28 days, compared with 532 clicks and 56,607 impressions in the previous 28 days. The three-month period showed 1,751 clicks and 178,823 impressions. Detailed normalized files are in `seo/gsc-current-queries.csv`, `seo/gsc-current-pages.csv`, `seo/gsc-query-page-map.csv` and `seo/gsc-opportunities.csv`.

The strongest current mismatch is commercial hair, skin, laser and PRP/GFC intent still accruing mainly to `/`. The recovery protects homepage relevance while adding direct crawlable routes to stronger dedicated pages.

## Ranking Findings

Tracked #1-5 queries are recorded in `seo/protected-ranking-pages.csv` with a default action of **PRESERVE + STRENGTHEN**. The homepage title, H1 and core doctor-led proposition were not materially rewritten. City visibility for Berhampur, Cuttack, Puri, Sambalpur, Rourkela and Baripada is recovered through useful outstation pages that explicitly state treatment takes place in Bhubaneswar.

## Migration Losses

The migration report contains 299 unique historical URLs. The production registry currently has 65 high-confidence one-hop permanent redirects. Redirect chains, duplicate sources and unrelated homepage fallbacks are rejected by the SEO audit. Hair wig/patch, tattoo removal, microblading, piercing, split-ear repair, vitiligo and lip-pigmentation URLs remain deferred until the clinic confirms service status and a true equivalent destination.

## Fixes Implemented

- Centralized the verified `20+ Years of Clinical Experience` and `60,000+ Happy Clients` facts so public CMS values cannot reintroduce outdated homepage statistics.
- Added a desktop floating WhatsApp action and a mobile `Call | WhatsApp | Book Appointment` bar with contextual WhatsApp text and privacy-safe CTA events.
- Added one source of truth for legacy redirects and made the runtime and audit use it.
- Added canonical local intent routes to the route manifest, sitemap and internal relationship graph.
- Preserved the `www` canonical host and verified self-canonicals for the existing priority pages.
- Repaired `robots.txt` crawler rules and produced a linked Markdown `llms.txt`.
- Reduced homepage client JavaScript and hidden DOM by removing animation-library hydration, rendering only the active treatment tab and deferring analytics.
- Kept the doctor image as the stable hero LCP image while retaining the controllable recognition slideshow.
- Fixed contrast, heading order and link distinction issues without redesigning the homepage.
- Upgraded Next.js to 16.3.2 and removed the production dependency vulnerability reported by `npm audit --omit=dev`.

## Pages Created

- `/acne-treatment-bhubaneswar` - active acne treatment and assessment intent
- `/hair-loss-clinic-bhubaneswar` - hair-loss diagnosis and treatment-planning intent
- `/wart-removal-bhubaneswar` - wart assessment and removal intent
- `/hair-transplant-cuttack`
- `/hair-transplant-puri`
- `/hair-transplant-berhampur`
- `/hair-transplant-sambalpur`
- `/hair-transplant-rourkela`
- `/hair-transplant-baripada`

The following evidence-backed commercial routes are implemented as non-indexable review pages and are excluded from the sitemap until medical approval:

- `/botox-treatment-bhubaneswar`
- `/dermal-fillers-bhubaneswar`
- `/tattoo-removal-bhubaneswar`

The six city pages contain unique travel, consultation and follow-up guidance. They do not claim a clinic branch outside Bhubaneswar.

## Pages Strengthened

The homepage now distributes authority through contextual links to hair transplant, hair loss, skin clinic, active acne, acne scars, laser hair reduction, PRP/GFC, results and doctor-led information. Existing canonical destinations for hair transplant, skin clinic, laser hair reduction and PRP/GFC remain stable.

## Redirects Added

The complete active and deferred registry is documented in `seo/legacy-redirect-map.csv`. High-value old city routes redirect directly to their respective outstation pages. Old acne, hair-loss, laser, PRP/GFC, booking, category and selected article routes go directly to verified equivalents.

## Sitemap

`https://www.radianceclinics.com/sitemap.xml` is valid, returns 200, is referenced by `robots.txt` and contains indexable canonical URLs only. The failed historical `sitemap_index.xml` submission remains visible in Search Console. Submission of the replacement sitemap is intentionally pending until this recovery build is live and the final authenticated confirmation is granted.

## Indexation

Search Console reports 230 indexed and 412 not indexed URLs. Six pre-existing priority URLs were inspected and confirmed on Google with successful fetches, allowed indexing and matching user/Google canonicals. The nine new URLs must be inspected after production deployment; an initial not-indexed state is expected for newly published pages and must not be misreported as an error.

## Performance

The mobile Lighthouse baseline was performance 71, accessibility 92, SEO 100, LCP 7,754 ms and TBT 167 ms. The final local production run reached performance 81, accessibility 100, SEO 100, LCP 4,900 ms and TBT 68 ms. Desktop reached performance 98, accessibility 100, SEO 100, LCP 1,051 ms and TBT 0 ms. The remaining mobile LCP work is principally image delivery and network latency rather than animation-library execution.

## Google Business Profile

Authenticated access confirms one verified location and 2,276 Google reviews. The profile name is keyword-stuffed and the address format differs from the website, but no identity field was changed without clinic confirmation. See `seo/google-business-profile-audit.md`.

## Remaining P0 Issues

- Submit and verify `/sitemap.xml` in Search Console after the production deployment.
- Inspect the nine newly published local and city URLs after deployment.
- Decide true replacements for externally linked hair wig and hair patch URLs.
- Investigate the single 5xx URL, three 403 URLs and the 44 `noindex` URLs from the exported coverage tables.
- Confirm GBP name, address, categories, hours, services and appointment link.

## Next 7 Days

Monitor query/page movement daily for protected terms, validate the first recrawl of redirected URLs, answer genuine Business Profile reviews, resolve the externally linked hair-system URLs, and strengthen the highest-impression P0 pages only where Search Console confirms a mismatch.

## Next 30 Days

Review the crawled/discovered-not-indexed groups, recover medically reviewed legacy guides by topic rather than bulk publishing, improve selected official YouTube descriptions, build legitimate professional/local citations, and compare the next complete 28-day period against the recovery baseline.
