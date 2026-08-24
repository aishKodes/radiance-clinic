# Search Console Indexation Report

Source: authenticated Google Search Console Pages export, last data date 21 August 2026.

| Status | URLs |
| --- | ---: |
| Total known URLs | 642 |
| Indexed | 230 |
| Not indexed | 412 |
| Not found (404) | 258 |
| Excluded by `noindex` | 44 |
| Page with redirect | 24 |
| Crawled, currently not indexed | 53 |
| Discovered, currently not indexed | 26 |
| Alternative page with proper canonical | 3 |
| Blocked by 403 | 3 |
| Server error (5xx) | 1 |
| Other 4xx | 0 |

## Recovery Priority

The migration 404 set is the dominant issue. High-confidence historical equivalents are handled through the one-hop redirect registry, while service URLs without a verified current equivalent remain in the migration report for clinic confirmation. The 44 intentional `noindex` URLs and 24 redirects require validation after deployment, but should not be converted into indexable pages solely to increase URL count.
