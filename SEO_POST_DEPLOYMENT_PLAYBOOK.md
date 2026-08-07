# Radiance Clinics SEO Post-Deployment Playbook

## Day 0

1. Deploy the production build and confirm the primary domain is `https://www.radianceclinics.com`.
2. Smoke-test `/`, `/treatments`, all four treatment hubs, `/results`, `/locations`, `/contact` and the five local commercial pages.
3. Test representative apex and HTTP requests for one-hop consolidation to HTTPS `www`.
4. Test every active legacy redirect in `seo/legacy-redirect-map.csv` and confirm a single permanent redirect to a 200 destination.
5. Confirm production pages are indexable and Vercel preview URLs remain `noindex`.
6. Check canonical, Open Graph URL, title, description, H1, visible breadcrumb and schema on representative page types.
7. Open `/robots.txt` and `/sitemap.xml`; confirm the preferred host and absence of draft city/case URLs.
8. Submit `https://www.radianceclinics.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
9. Request indexing for the four category hubs, `/results` and `/locations` after live inspection.

## Days 1-7

1. Inspect Google Search Console Page indexing and crawl errors daily.
2. Review duplicate canonical, redirected URL, soft 404 and server error reports.
3. Compare indexed legacy URLs with their new destinations.
4. Inspect production logs for repeated 404s and add redirects only where a genuine equivalent exists.
5. Verify that no draft city or result-detail URL appears in search or the sitemap.
6. Check rendered mobile pages and Core Web Vitals field data when available.
7. Confirm Google Business Profile NAP matches the website exactly.

## Weeks 2-4

1. Compare impressions and queries for hubs, local pages, treatments and conditions.
2. Inspect `Crawled - currently not indexed`, soft 404 and duplicate-canonical groups.
3. Check whether local commercial pages and treatment detail pages are separating by the intents in `seo/search-intent-map.csv`.
4. Inspect query overlap described in `seo/cannibalization-report.md`.
5. Review Core Web Vitals by template and device.
6. Add stronger contextual links only where Search Console shows a relevant relationship.
7. Do not publish city pages until their clinic inputs satisfy `src/data/location-pages.ts`.

## Months 2-3

1. Export pages and queries ranking in positions 4-20.
2. Improve those pages using actual query evidence and medically reviewed information.
3. Expand case coverage only after consent scope, clinical context and timelines are supplied.
4. Commission the high-priority guides in `seo/content-gap-register.csv` and assign medical review.
5. Strengthen relevant citations and backlinks from genuine local and medical-industry sources.
6. Recheck Google Business Profile categories, services, appointment link and NAP.
7. Review pages with declining clicks before changing titles or intent ownership.

## Release checklist

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `npm run test:redirects`
- `npm run seo:audit`
- Production canonical and robots check
- Sitemap diff review
- Search intent map update for every new indexable URL
