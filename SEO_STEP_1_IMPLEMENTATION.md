# Radiance Clinics Technical SEO Step 1

## 1. Architecture discovered

- Framework: Next.js 16.2.7 App Router with React 19 and TypeScript.
- Rendering: core pages are statically rendered; treatments, conditions, local service pages, and knowledge articles use `generateStaticParams`; API and Studio routes are server-rendered.
- Data: the frontend reads the custom public PHP/MySQL API through `src/data/site.ts` and falls back to typed local content in `src/data/fallback.ts` and `src/data/seed.ts`.
- Media: local source media stays outside deployment; optimized public derivatives are served from `public/radiance-media-processed` through `next/image`.
- Reviews: server-side Google Business Profile or Places retrieval is optional, cached for one hour, and renders nothing fabricated when credentials/data are unavailable.
- Analytics: no GA4, Google Tag Manager, or other analytics implementation was found. Nothing was removed.

## 2. Changes made

- Enforced `https://www.radianceclinics.com` as the canonical origin in metadata, schema, sitemap, robots, and absolute internal references.
- Added one-hop permanent host and legacy URL redirects in `next.config.ts` from a centralized redirect list.
- Disabled Next.js automatic trailing-slash normalization so historical trailing-slash URLs go directly to their final destination instead of through a chain.
- Added `X-Robots-Tag: noindex, nofollow, noarchive` and a blocking robots policy for Vercel preview deployments only. Production remains indexable.
- Added a metadata helper that emits unique title, description, canonical, Open Graph, and Twitter metadata.
- Removed meta keywords and automatic FAQ structured data.
- Added stable Organization, MedicalClinic, WebSite, Physician, WebPage, Service, Article, and Breadcrumb IDs/relationships using visible verified fields only.
- Added crawlable desktop/mobile treatment navigation, a global crawlable footer, exact NAP, normalized telephone links, official social profiles, and visible breadcrumbs.
- Added the exact address and a lazy-loaded titled map to the Contact page. Opening hours are intentionally omitted pending verification.
- Upgraded the article template for featured images, contextual alt text, optional author/reviewer/published/updated fields, related treatment links, related articles, metadata, and Article JSON-LD.
- Corrected misleading homepage service labels and moved the existing doctor hero visual ahead of stats on mobile.
- Limited Next image generation to a 1920px maximum and enabled AVIF/WebP output. The secondary hero slide is lazy-loaded.
- Added route inventory, redirect inventory, page inventory, and a production-rendered SEO validation command.

## 3. Exact files changed

Configuration and documentation:

- `.env.example`
- `README.md`
- `next.config.ts`
- `package.json`
- `SEO_STEP_1_IMPLEMENTATION.md`
- `seo/legacy-redirect-map.csv`
- `seo/route-manifest.json`
- `seo/seo-page-inventory.csv`
- `scripts/seo-audit.mjs`
- `scripts/process-radiance-media.mjs`

SEO/data infrastructure:

- `src/lib/seo-config.ts`
- `src/lib/metadata.ts`
- `src/lib/indexability.ts`
- `src/lib/schema.ts`
- `src/lib/utils.ts`
- `src/lib/google-reviews.ts`
- `src/data/seed.ts`
- `src/data/site.ts`
- `src/data/homepage-media.ts`
- `src/types/cms.ts`

Application routes:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/[seoSlug]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/before-after/page.tsx`
- `src/app/conditions/page.tsx`
- `src/app/conditions/[slug]/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/knowledge/page.tsx`
- `src/app/knowledge/[slug]/page.tsx`
- `src/app/reviews/page.tsx`
- `src/app/reviews/[slug]/page.tsx`
- `src/app/treatments/page.tsx`
- `src/app/treatments/[cluster]/[slug]/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/llms.txt/route.ts`

Components:

- `src/components/Breadcrumbs.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/SiteHeader.tsx`
- `src/components/SectionHeader.tsx`
- `src/components/LuxuryHero.tsx`
- `src/components/HeroMediaCollage.tsx`

## 4. Redirect strategy

- Framework-native 308 redirects are used because Next.js preserves the method and query parameters.
- Apex-host requests are sent directly to the preferred HTTPS `www` host with the full path/query retained.
- Active migration redirects resolve in one hop to an indexable 200 destination and are tested by `npm run test:redirects` and `npm run seo:audit`.
- No unrelated legacy URL is sent to the homepage.
- The complete implemented/deferred mapping and confidence level is in `seo/legacy-redirect-map.csv`.

## 5. Outstanding legacy URLs

These remain intentionally unmapped because no current page is genuinely equivalent:

- `/hair-wig/`
- `/hair-patch/`
- `/tattoo-removal-radiance/`
- `/treatment/stretch-marks/dermaroller/`
- `/vitiligo-3/`

## 6. Pages Step 2 must build or verify

- Genuine non-surgical hair system pages for hair wig and hair patch intent.
- Tattoo removal page, only if the clinic verifies the service.
- Stretch mark/dermaroller page, only after medical/service verification.
- Medically reviewed vitiligo page.
- A rewritten Botox educational article to replace the broad temporary treatment redirect.
- Genuine Cuttack, Puri, Rourkela, Sambalpur, Berhampur, and Baripada hair-transplant landing pages. After publication, update each city redirect to its matching page.
- A dedicated mole/wart removal page if the clinic wants deeper search coverage.
- Ultherapy content only if the clinic verifies that it currently offers the treatment.

## 7. Schema architecture

- Stable IDs live in `src/lib/seo-config.ts`.
- Global Organization, MedicalClinic, and WebSite entities render once from the root layout.
- The About page adds the Physician entity; content pages connect WebPage, Service, Article, and Breadcrumb entities to the global graph.
- No aggregate rating, review count, award, credential, medical specialty, coordinates, price range, outcome, or opening-hours claim is emitted.
- FAQ content remains visible but FAQPage JSON-LD is not generated automatically.

## 8. Metadata architecture

- `pageMetadata()` in `src/lib/metadata.ts` is the shared generator for title, description, canonical, Open Graph, Twitter, image, and indexability.
- Dynamic treatment, condition, article, review, and local pages derive unique values from their actual content.
- All absolute metadata uses `https://www.radianceclinics.com`.
- Meta keywords were removed.

## 9. Performance improvements

- Next image variants now stop at 1920px; thumbnail widths use the configured image-size set.
- AVIF and WebP response formats are enabled.
- Only the primary hero image is preloaded; the recognition slide is lazy-loaded.
- Header logo images have explicit dimensions instead of `fill` behavior that generated a 3840px fallback URL.
- Contact map loading is deferred.
- Google reviews are cached server-side and do not require a blocking third-party widget.
- Public media currently contains no individual file larger than 4 MB. The public directory remains approximately 114 MB across optimized derivatives.

## 10. Remaining risks

- The supplied NAP should be checked against the live Google Business Profile before deployment. Opening hours remain omitted until confirmed.
- The live Vercel project must mark `www.radianceclinics.com` as the primary production domain; app-level redirects cannot control Vercel's pre-application HTTP/TLS edge hop.
- No analytics implementation exists in this repository. Confirm whether tracking is injected outside the repo before adding GA4/GTM or conversion events.
- Google review count/rating depends on valid server-side API credentials. The UI correctly falls back to the official Google profile link when unavailable.
- Article author, reviewer, and dates remain hidden until the CMS supplies genuine values.
- The media directory has many optimized variants; future media processing should continue deduplication and avoid committing raw sources.

## 11. Deployment instructions

1. Deploy the current repository to the Vercel production project.
2. In Vercel Domains, attach both apex and `www`, then set `www.radianceclinics.com` as the primary domain and redirect the apex directly to it.
3. Keep `NEXT_PUBLIC_SITE_URL=https://www.radianceclinics.com` for consistency, although canonical generation is protected by the central production constant.
4. Keep all Google API/OAuth values server-side. Never expose them with `NEXT_PUBLIC_` prefixes.
5. Run `npm run build` followed by `npm run seo:audit` before each SEO-sensitive release.
6. After deployment, test representative apex/http URLs at the edge to confirm there is one external hop.

## 12. Search platform actions requiring human access

Google Search Console:

- Verify a Domain property for `radianceclinics.com` and, if useful operationally, the `https://www.radianceclinics.com/` URL-prefix property.
- Submit `https://www.radianceclinics.com/sitemap.xml`.
- Inspect the homepage, five local commercial pages, major treatment pages, and representative migrated legacy URLs.
- Monitor Page indexing, Crawl stats, Core Web Vitals, and redirect/404 reports after deployment.
- Export additional historical 404/redirect data and append qualified mappings to the centralized redirect inventory.

Bing Webmaster Tools:

- Verify the preferred site and submit the same sitemap.
- Monitor crawl errors and migrated URLs.

Google Business Profile:

- Confirm exact business name, address, phones, email, primary category, profile URL, and opening hours.
- Supply API credentials only if the clinic wants cached live review retrieval.

## Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:redirects
npm run seo:audit
```

`seo:audit` validates production-rendered titles, descriptions, canonicals, Open Graph URLs, H1s, robots directives, internal links, redirects, sitemap URLs, image alt attributes, and JSON-LD syntax.
