# Radiance Clinics Cannibalization Report

Generated from `seo/search-intent-map.csv` and the indexable route manifest for Step 2.

## Automated controls

- `npm run seo:audit` fails when two published indexable URLs use the same primary query theme.
- The audit also fails on duplicate rendered titles or descriptions.
- Every published intent-map URL must exist in the route manifest and have a valid parent.
- Draft city and case-detail URLs are excluded from the sitemap and published intent map.

## Current outcome

No exact primary-intent collision is present among the 34 indexable routes.

## Intent boundaries to preserve

| Page group | Primary role | Boundary |
| --- | --- | --- |
| `/hair-transplant-bhubaneswar` | Local transactional | Clinic-specific consultation and service intent in Bhubaneswar |
| `/treatments/hair-restoration/fue-hair-transplant` | Treatment research | FUE suitability and planning without duplicating the local landing page |
| `/treatments/hair-restoration` | Category discovery | Compares surgical and non-surgical hair pathways |
| `/conditions/hair-fall-thinning` | Concern education | Starts from symptoms and assessment rather than a procedure |
| `/results` | Result research | Consent-confirmed comparisons and limitations |
| `/before-after` | Interactive result viewing | Draggable comparison interface rather than a second results landing page |
| `/skin-clinic-bhubaneswar` | Broad local skin-clinic intent | Local consultation pathway across skin concerns |
| `/acne-scar-treatment-bhubaneswar` | Local acne-scar transaction | Acne-scar assessment in Bhubaneswar |
| `/treatments/skin-laser/acne-scar-revision` | Treatment research | Scar-revision planning and modality research |
| `/pigmentation-treatment-bhubaneswar` | Local pigmentation transaction | Pigmentation and melasma consultation in Bhubaneswar |
| `/treatments/skin-laser/laser-pigmentation-program` | Treatment research | Laser-program suitability and skin-type considerations |
| `/laser-hair-removal-bhubaneswar` | Local transactional | Laser hair removal in Bhubaneswar |
| `/treatments/skin-laser/laser-hair-reduction` | Treatment research | Device-led hair-reduction planning |

## Deferred collision risks

1. City pages must not be published by changing only the city name. Each needs verified travel context and genuinely distinct patient information.
2. A future hair-transplant cost article must answer pricing research without replacing the local service page's consultation intent.
3. Individual result pages must use a verified condition and clinical context. Generic numbered case pages would compete with one another and remain blocked.
4. Future acne-scar and pigmentation guides should target educational questions rather than duplicate the local commercial pages.

## Review cadence

Re-run `npm run seo:audit` whenever a route or intent-map row changes. After deployment, compare Google Search Console query overlap every four weeks and revise the map only from observed query data.
