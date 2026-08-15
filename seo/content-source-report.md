# Content Source Report

Generated for the 2026-08-15 production content expansion.

| Source | Records discovered | Publicly integrated | Handling |
| --- | ---: | ---: | --- |
| Structured legacy website export | 300 | 6 rewritten guides plus merges into existing concern/treatment clusters | Every record is inventoried, dated, hashed and assigned an action. Raw bodies are not copied into the public app. |
| Legacy Markdown renderings | 283 | 0 direct imports | Used as human-readable source references; not treated as a blog by default. |
| Official Radiance Clinics YouTube channel | 182 catalogue entries; 180 accessible metadata records | 69 cleared educational videos in the searchable library; selected videos embedded contextually | Two unavailable videos (`9MbtGSwWgVs`, `23hD6aVgExQ`) are excluded. Review-flagged result/promotional videos remain in the internal catalogue only. No video files were downloaded. |
| Existing production content models | 62 approved concerns, 53 approved Doctor Answers, treatments, guides and result records | Existing approved/indexable set retained | Doctor review and indexability gates remain in place. |

## Migration decisions

- Scores from the supplied extraction are used for triage only. They do not establish medical accuracy, uniqueness or publication approval.
- The nine records in the rejected bucket are explicitly archived in the generated migration plan.
- Potentially overpromissory, outdated, shortcode-heavy or duplicate material remains in the review/merge workflow rather than being published.
- Six source-rich themes were rewritten into patient guides: hair-loss assessment, transplant aftercare, acne-scar planning, laser hair reduction expectations, transplant cost factors, and PRP/GFC questions.
- Genuine original publication dates are displayed on those guides; the medical review/update date is 2026-08-15.
- Provenance stores SHA-256 hashes and source paths rather than importing raw legacy bodies into the application bundle.

## YouTube decisions

- Public metadata was retrieved with an isolated `yt-dlp` metadata export; the checked-in refresh script can use a supplied export, a locally installed `yt-dlp`, or the official channel RSS merged with the existing catalogue.
- Automatic captions are recorded as caption availability. Only manual subtitle tracks set `transcriptAvailable`; no transcript text is currently published.
- Result and promotional videos remain in the internal catalogue and are flagged for manual review before they appear in the website library or are associated with a named case.
- View and like counts remain structured metadata only and are not used as permanent marketing copy.
