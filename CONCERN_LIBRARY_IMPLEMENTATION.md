# Radiance Concern Library Implementation

## Release summary

This release adds a scalable concern-led information architecture without auto-publishing unreviewed medical content.

- 10 indexable category hubs under `/concerns`
- 62 structured concern pages across P0 and P1 topic groups
- typo-tolerant grouped local search across concerns, treatments, prepared answers, guides and consent-confirmed result records
- `/doctor-answers` architecture with 10 substantive prepared answers
- private Ask the Doctor API contract and spam honeypot
- medical review workflow enforced by the content audit and sitemap gate
- WordPress WXR recovery tooling for the supplied `radiance.xml`
- privacy-safe analytics events and Google Analytics `G-GBJJHP7NZT`
- two supplied skin-care articles and the featured hair-transplant YouTube guide

## Routes

### Public indexable discovery routes

- `/concerns`
- `/concerns/hair-loss-scalp`
- `/concerns/hair-transplant`
- `/concerns/acne`
- `/concerns/acne-scars`
- `/concerns/pigmentation`
- `/concerns/skin-texture`
- `/concerns/aging-aesthetics`
- `/concerns/laser-hair-reduction`
- `/concerns/scars-stretch-marks`
- `/concerns/other-skin-concerns`
- `/doctor-answers`

### Review-gated routes

- `/concerns/[category]/[slug]`
- `/doctor-answers/[slug]`

These routes are available to patients and carry self-canonical metadata, but they render `noindex` until a real approval record is present. They are not included in the sitemap.

## Editorial and medical review workflow

Supported statuses:

1. `DRAFT`
2. `READY_FOR_MEDICAL_REVIEW`
3. `APPROVED`
4. `PUBLISHED`
5. `NEEDS_UPDATE`

Substantial medical content uses `medicalReviewRequired: true`. It may be indexed only when all of the following are true:

- `status` is `APPROVED`
- `indexable` is `true`
- `reviewedBy` contains the verified reviewer
- `reviewedAt` contains the real review date

`npm run content:audit` fails if an indexable page violates this rule. No reviewer or review date has been invented in this release. All 62 concern pages and 10 answer pages begin at `READY_FOR_MEDICAL_REVIEW`.

## Content model

The concern model stores canonical naming, aliases, patient-language terms, intent, signs, possible causes, assessment, treatment categories, clinic relationships, self-care cautions, FAQs, answer relationships, references, editorial dates and indexability.

The frontend gracefully omits sections that are not relevant. Content is held in one data layer rather than duplicated across hard-coded route components, making it suitable for a future Hostinger API or admin system.

Future backend collections should preserve the fields in `src/types/concern.ts` and use stable IDs for:

- concerns
- categories
- treatments
- articles
- doctor answers
- cases
- FAQs
- doctors
- relationships
- review and revision history

## Search behaviour

The concern search is local, lightweight and typo tolerant. It uses:

- exact and phrase matching
- title and prefix weighting
- token overlap
- edit-distance matching for common misspellings
- canonical aliases and patient-language terms

Results are grouped into Concerns, Treatments, Doctor Answers, Guides and Results. Search state remains in the component and does not create crawlable query URLs.

### Search privacy

Google Analytics receives only:

- query length
- token count
- result count
- result content type
- result position
- destination path

The query wording and private medical question text are never sent to analytics. No-result signals use the same limited metrics. `SEARCH_SIGNAL_WEBHOOK_URL` can later receive these anonymised counters for an admin report.

## Ask the Doctor contract

`POST /api/questions` validates:

- optional display name
- category
- question
- optional private contact detail
- consent
- hidden spam field

Accepted payloads begin with status `SUBMITTED` and explicitly set `publishAutomatically: false`. The endpoint forwards only to the server-side `QUESTION_SUBMISSION_WEBHOOK_URL`. If secure storage is not configured, it returns an honest unavailable response instead of pretending the question was saved.

Future workflow statuses are:

- `SUBMITTED`
- `SPAM_CHECKED`
- `TRIAGED`
- `ANSWER_DRAFTED`
- `DOCTOR_REVIEW`
- `ANSWERED`
- `PUBLISHED`
- `MERGED`
- `REJECTED`

## Analytics events

- `search_started`
- `search_query_submitted`
- `search_result_clicked`
- `no_results`
- `question_submitted`
- `related_question_clicked`
- `treatment_clicked`
- `consultation_clicked`

Google Analytics loads once from the root layout with measurement ID `G-GBJJHP7NZT`.

## Legacy content recovery

Run:

```bash
npm run content:migrate-old
```

The default input is `../radiance.xml`. Use `--input=/absolute/path/to/export.xml` to select another WXR file.

The migration reads only WordPress pages, posts and attachments. It deliberately excludes Contact Form 7 and Flamingo records so private enquiries do not enter the content-review repository.

Generated outputs:

- `seo/old-content-inventory.csv`
- `seo/content-migration-map.csv`
- `content/migration-review/candidates.json`
- `content/migration-review/README.md`

No candidate is imported into public routes. Every item has a review status, risk flags, a suggested destination and `autoPublish: false`.

## Content quality audit

Run:

```bash
npm run content:audit
```

The audit checks:

- initial release contains 50–80 concerns
- valid unique routes and SEO titles
- category coverage
- substantive content depth
- search vocabulary
- FAQ and treatment relationships
- medical review/indexability gates
- substantive doctor-answer depth

Generated outputs:

- `seo/content-quality-report.md`
- `seo/concern-taxonomy.csv`
- `seo/concern-route-map.csv`
- `seo/search-synonyms.json`
- `seo/content-gap-register.csv`
- `seo/content-internal-linking-graph.csv`
- `seo/no-result-search-report.csv`

## Production configuration

Server-only variables:

```bash
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-flash
QUESTION_SUBMISSION_WEBHOOK_URL=
SEARCH_SIGNAL_WEBHOOK_URL=
```

The assistant prefers DeepSeek when configured, then Gemini, then the existing rules-based safe fallback. Private keys must remain in local/Vercel environment settings and must never be committed.

## Approval checklist for an individual page

Before making a medical page indexable:

1. verify service alignment and treatment links;
2. verify terminology, risks, expectations and warning signs;
3. add primary references where useful;
4. obtain an actual review from the named doctor;
5. record reviewer and date;
6. set status to `APPROVED`;
7. set `indexable: true`;
8. rerun `npm run content:audit`, `npm run build` and `npm run seo:audit`.
