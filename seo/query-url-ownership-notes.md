# Query-to-URL Ownership Evidence

Updated: 2026-10-04

## Report windows

- Current query-to-page ownership: authenticated Google Search Console, Web search, all devices and countries, 2026-06-30 through 2026-09-29.
- Migration comparison: the best available authenticated comparison in `seo/2026-09-gsc-observations.json`, last 28 complete days through 2026-09-15 compared with the previous 28 days.
- Historical corroboration: `seo/query-loss-recovery.csv`, `seo/gsc-current-pages.csv`, `seo/gsc-query-page-map.csv` and the live redirect map.

Missing query rows are recorded as unavailable or no rows returned for that report window. They are not treated as zero demand or an indexation verdict.

## Confirmed overlaps

- Hair transplant: the homepage still receives most clicks for the local query while the intended service page is weak. Preserve the homepage signal and strengthen the service-page relationship instead of forcing an immediate rewrite.
- Hair loss: homepage, hair-loss landing page, treatment hub and education pages appear for adjacent intent. Their roles are now explicit in `seo/topic-ownership.json`.
- PRP/GFC: the procedure page is the canonical treatment owner; the homepage and redirected legacy pages still contribute visibility.
- Hair patch/wig: historic URLs held visibility. They now redirect directly to the verified non-surgical replacement page.
- Acne scars: the doctor-authored guide can rank for educational intent while the local page owns consultation intent. It is retained and linked rather than deleted.
- Pigmentation: the local page owns consultation intent; the laser program, concern pages and Doctor Answers support narrower intent.
- Laser hair removal: the homepage and legacy URL still appear, but the local landing page is the permanent owner.

## Consolidated taxonomy

The four `/conditions/...` gateway pages had no independent rows in the available Search Console page export and duplicated the more complete Concern structure. They are removed from the sitemap and internal navigation and redirect directly to the appropriate concern hub. Existing `/post/...` pages with meaningful historical performance remain governed by the reviewed legacy redirect map; no bulk deletion was performed.
