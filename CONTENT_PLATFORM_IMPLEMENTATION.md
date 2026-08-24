# Radiance Content Platform Implementation

## 1. Source files discovered

The supplied `output` directory contains 300 structured legacy records across good, maybe and rejected JSON buckets, a 300-row scoring CSV, and 283 Markdown renderings. The latest official YouTube refresh discovered 183 unique public videos.

## 2. Old content extracted

All 300 records are represented in `seo/legacy-content-master-inventory.csv`. The analysis command reads the structured export directly and records title, URL, type, category, word count, score, source file, target and action.

## 3. Old content classification

Records are classified into concern, treatment, article, Doctor Answer candidate, patient guide, location, doctor information or clinic information, and then into clinical topic families. Scores are triage signals only.

## 4. Historical date policy

Legacy publication dates are preserved in `seo/historical-content-dates.csv`. Dates render as `datePublished`; substantive 2026-08-15 review work renders as `dateModified` and `reviewedAt`. Missing modified dates are not invented.

## 5. Content migrated

Six high-value themes were rewritten into current patient guides: hair-loss assessment, hair-transplant aftercare, acne-scar planning, laser hair reduction expectations, hair-transplant cost factors and PRP/GFC questions. Raw legacy HTML and WordPress shortcodes were not imported.

## 6. Content merged

The analysis recommends 116 merges and identifies 16 shared-target groups. Overlapping sources feed canonical concern, treatment, local-service or guide destinations instead of creating competing pages.

## 7. Content intentionally archived

All nine records from the supplied rejected bucket are marked `ARCHIVE`. Thin, unsafe, outdated, irrelevant or unverifiable material remains out of the public application.

## 8. YouTube retrieval implementation

`scripts/youtube-sync.mjs` accepts a full NDJSON metadata export, can run installed `yt-dlp`, and otherwise refreshes through the official channel RSS while retaining the full checked-in catalogue. No video media is downloaded.

## 9. Number of videos discovered

The current channel refresh found 183 unique public videos. All 183 are stored in `content/platform/youtube-source.json` and the typed generated library; 135 cleared educational videos are available to the website through the lightweight video library and contextual mapping layer.

## 10. Video categories

Videos are classified by content type and topic. The largest cluster is Hair Transplant, with additional Hair Loss, Acne, Acne Scars, Pigmentation, Laser Hair Reduction, Skin Health, Aesthetic Dermatology, Scars and clinic/doctor material.

## 11. Video mappings

Every accessible video has a primary destination, up to two secondary destinations, search intent, topic, priority and review flag. The complete mapping is in `seo/youtube-content-map.csv`.

## 12. Transcript handling

Caption availability is recorded separately from a manual transcript. No automatic-caption text is published. Transcript-derived claims or quotations require editorial and medical review before future use.

## 13. Concern hierarchy

The existing ten concern families, 62 approved concern entities and symptom/search aliases remain canonical. Legacy sources and videos enrich those clusters without generating synonym pages.

## 14. Search implementation

The concern-library search now indexes concerns, treatments, 53 Doctor Answers, guides, public educational videos and result records. Patient wording stays client-side; analytics stores only privacy-preserving length/count metrics.

## 15. Doctor Answers integration

Existing approved Doctor Answers remain indexable and medically reviewed. Related educational videos can appear on answer pages; candidate questions identified from legacy or video metadata remain in editorial reports rather than auto-publishing.

## 16. Cases integration

Public result videos are classified and review-flagged, remain out of the website library, and are not automatically linked to a named case. Existing consent and indexability gates remain authoritative for result pages.

## 17. Related-content engine

`videosForPath()` scores destination matches, topic matches, education type and embed priority. Concern, treatment, guide and Doctor Answer pages receive up to two relevant, non-review-flagged educational videos.

## 18. Structured data

Visible embedded videos receive `VideoObject` JSON-LD using real titles, descriptions, thumbnails, upload dates, ISO durations, public content URLs and privacy-enhanced embed URLs. Guides retain Article, WebPage and reviewer schema.

## 19. Sitemap/indexability rules

`/videos` and the six substantive guides are indexable and included in the sitemap. There are no one-video-per-page mirrors. Draft, unapproved and archived legacy records are excluded.

## 20. Medical-review workflow

`seo/medical-review-queue.csv` carries source, topic, risk, priority, reviewer and status for all legacy records and new treatment drafts. The verified clinic experience statement is 20+ years of clinical experience. Archived sources stay archived, and new medically substantive treatment pages remain `READY_FOR_MEDICAL_REVIEW` and non-indexable until approval.

## 21. Admin/data architecture

Human-edited clinical entities remain separate from generated source catalogues. Generated YouTube data lives under `content/platform` and `src/data`; legacy provenance stores paths, dates, actions and hashes. This structure can move to a CMS without changing public URLs.

## 22. Performance strategy

YouTube embeds use a thumbnail facade and load the privacy-enhanced iframe only after play. The library renders 24 items at a time. Thumbnails use the existing Next image allow-list and no video files are bundled.

## 23. Scripts created

- `npm run youtube:sync` refreshes video metadata, mapping CSVs and typed data.
- `npm run legacy:analyze` regenerates legacy inventory, dates, provenance, review queue, cannibalisation and intelligence reports.
- `npm run content:report` refreshes sources and runs content audits.
- `npm run content:audit` now includes platform integrity checks.

## 24. Tests performed

The release gate includes lint, TypeScript, content audit, content-platform audit, SEO audit, redirect audit and a production Next build. The audit verifies IDs, URLs, dates, ISO durations, uniqueness, catalogue counts, provenance hashes, archive handling and route-manifest inclusion.

## 25. Remaining clinic inputs required

The clinic should provide explicit case-to-video links and consent state, approved transcript excerpts if desired, current service availability for deferred legacy topics, any reliable legacy modified dates, and hosting/deployment access if GitHub pushes do not trigger the production site.
