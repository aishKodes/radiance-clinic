import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const root = process.cwd();

async function loadTypeScriptModule(relativePath) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: relativePath,
  }).outputText;
  const commonJsModule = { exports: {} };
  const evaluator = new Function("exports", "module", "require", output);
  evaluator(commonJsModule.exports, commonJsModule, (specifier) => {
    throw new Error(`Unexpected runtime import in content data: ${specifier}`);
  });
  return commonJsModule.exports;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n";
}

function words(values) {
  return values
    .flat(Infinity)
    .filter((value) => typeof value === "string")
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (seen.has(normalized)) duplicates.add(normalized);
    seen.add(normalized);
  }
  return [...duplicates];
}

async function main() {
  const data = await loadTypeScriptModule("src/data/concern-library.ts");
  const concerns = data.concerns;
  const categories = data.concernCategories;
  const answers = data.doctorAnswers;
  const errors = [];
  const warnings = [];
  const rows = [];

  if (concerns.length < 50 || concerns.length > 80) {
    errors.push(`Initial concern library must contain 50-80 topics; found ${concerns.length}.`);
  }

  const paths = concerns.map((item) => `/concerns/${item.categorySlug}/${item.slug}`);
  const pathSet = new Set(paths);
  const answerPaths = answers.map((item) => `/doctor-answers/${item.slug}`);
  const answerSlugSet = new Set(answers.map((item) => item.slug));
  for (const duplicate of duplicateValues(paths)) errors.push(`Duplicate concern path: ${duplicate}`);
  for (const duplicate of duplicateValues(concerns.map((item) => item.seoTitle))) errors.push(`Duplicate SEO title: ${duplicate}`);
  for (const duplicate of duplicateValues(answerPaths)) errors.push(`Duplicate doctor-answer path: ${duplicate}`);
  for (const duplicate of duplicateValues(answers.map((item) => item.question))) errors.push(`Duplicate doctor-answer question: ${duplicate}`);

  for (const category of categories) {
    const count = concerns.filter((concern) => concern.categorySlug === category.slug).length;
    if (count < 3) errors.push(`${category.slug}: category has only ${count} concerns.`);
  }

  for (const concern of concerns) {
    const pathValue = `/concerns/${concern.categorySlug}/${concern.slug}`;
    const category = categories.find((item) => item.slug === concern.categorySlug);
    const wordCount = words([
      concern.summary,
      concern.definition,
      concern.commonSigns,
      concern.possibleCauses,
      concern.howItIsAssessed,
      concern.whenToSeekProfessionalAdvice,
      concern.treatmentApproaches,
      concern.whatNotToDo,
      concern.preventionOrCare,
      concern.expectedCourse,
      concern.faq.map((item) => [item.question, item.answer]),
      category?.introduction || [],
    ]);
    const issues = [];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(concern.slug)) issues.push("invalid-slug");
    if (concern.summary.length < 55) issues.push("short-summary");
    if (concern.seoDescription.length < 100 || concern.seoDescription.length > 180) issues.push("meta-description-length");
    if (concern.searchTerms.length < 5) issues.push("weak-search-vocabulary");
    if (concern.clinicTreatments.length < 1) issues.push("missing-treatment-link");
    if (concern.faq.length < 2) issues.push("missing-faq-depth");
    if (wordCount < 300) issues.push("thin-content");
    if (
      concern.indexable &&
      concern.medicalReviewRequired &&
      (concern.status !== "APPROVED" || !concern.reviewedBy || !concern.reviewedAt)
    ) {
      issues.push("indexable-without-real-medical-review");
    }
    if (!concern.indexable && concern.status === "APPROVED") warnings.push(`${pathValue}: approved but not indexable.`);
    if (issues.length) errors.push(`${pathValue}: ${issues.join(", ")}`);
    rows.push({
      path: pathValue,
      title: concern.title,
      category: concern.categorySlug,
      status: concern.status,
      indexable: concern.indexable,
      medical_review_required: concern.medicalReviewRequired,
      reviewer: concern.reviewedBy || "",
      reviewed_at: concern.reviewedAt || "",
      word_count: wordCount,
      search_term_count: concern.searchTerms.length,
      issue_count: issues.length,
      issues: issues.join(";"),
    });
  }

  for (const answer of answers) {
    const answerPath = `/doctor-answers/${answer.slug}`;
    if (answer.indexable && (answer.status !== "APPROVED" || !answer.reviewedBy || !answer.reviewedAt)) {
      errors.push(`${answerPath}: indexable without real doctor review.`);
    }
    if (words([answer.conciseAnswer, answer.explanation, answer.whenEvaluationMayHelp]) < 55) {
      errors.push(`${answerPath}: answer is too thin.`);
    }
    if (!categories.some((category) => category.slug === answer.categorySlug)) errors.push(`${answerPath}: unknown category.`);
    if (!pathSet.has(answer.relatedConcern)) errors.push(`${answerPath}: related concern does not exist.`);
    for (const relatedSlug of answer.relatedQuestions) {
      if (relatedSlug === answer.slug) errors.push(`${answerPath}: links to itself as a related question.`);
      if (!answerSlugSet.has(relatedSlug)) errors.push(`${answerPath}: related question ${relatedSlug} does not exist.`);
    }
  }

  const taxonomyRows = concerns.map((concern) => ({
    canonical_path: `/concerns/${concern.categorySlug}/${concern.slug}`,
    category: concern.categorySlug,
    canonical_name: concern.title,
    aliases: concern.aliases.join(";"),
    patient_language_terms: concern.patientLanguageTerms.join(";"),
    primary_intent: concern.primaryIntent,
    status: concern.status,
    medical_review_required: concern.medicalReviewRequired,
    reviewed_by: concern.reviewedBy || "",
    reviewed_at: concern.reviewedAt || "",
    indexable: concern.indexable,
    updated_at: concern.updatedAt,
  }));
  const routeRows = concerns.map((concern) => ({
    route: `/concerns/${concern.categorySlug}/${concern.slug}`,
    route_type: "concern",
    parent_hub: `/concerns/${concern.categorySlug}`,
    canonical: `/concerns/${concern.categorySlug}/${concern.slug}`,
    sitemap: concern.indexable,
    robots: concern.indexable ? "index,follow" : "noindex,nofollow",
    status: concern.status,
  }));
  const answerRouteRows = answers.map((answer) => ({
    route: `/doctor-answers/${answer.slug}`,
    route_type: "doctor-answer",
    parent_hub: "/doctor-answers",
    canonical: `/doctor-answers/${answer.slug}`,
    category: answer.categorySlug,
    sitemap: answer.indexable,
    robots: answer.indexable ? "index,follow" : "noindex,nofollow",
    status: answer.status,
    reviewed_by: answer.reviewedBy || "",
    reviewed_at: answer.reviewedAt || "",
  }));
  const concernLinkingRows = concerns.flatMap((concern) => {
    const source = `/concerns/${concern.categorySlug}/${concern.slug}`;
    return [
      { source, destination: `/concerns/${concern.categorySlug}`, relationship: "parent-category" },
      ...concern.clinicTreatments.map((item) => ({ source, destination: item.href, relationship: "related-treatment" })),
      ...concern.relatedArticles.map((item) => ({ source, destination: item.href, relationship: "related-guide" })),
      ...concern.doctorAnswers.map((slug) => ({ source, destination: `/doctor-answers/${slug}`, relationship: "doctor-answer" })),
    ];
  });
  const answerLinkingRows = answers.flatMap((answer) => {
    const source = `/doctor-answers/${answer.slug}`;
    return [
      { source, destination: "/doctor-answers", relationship: "parent-hub" },
      { source, destination: answer.relatedConcern, relationship: "related-concern" },
      ...(answer.relatedTreatment ? [{ source, destination: answer.relatedTreatment.href, relationship: "related-treatment" }] : []),
      ...(answer.relatedGuide ? [{ source, destination: answer.relatedGuide.href, relationship: "related-guide" }] : []),
      ...answer.relatedQuestions.map((slug) => ({ source, destination: `/doctor-answers/${slug}`, relationship: "related-question" })),
    ];
  });
  const linkingRows = [...concernLinkingRows, ...answerLinkingRows];
  const synonymPayload = Object.fromEntries(
    concerns.map((concern) => [
      `/concerns/${concern.categorySlug}/${concern.slug}`,
      { canonical: concern.title, aliases: concern.aliases, patientLanguageTerms: concern.patientLanguageTerms },
    ]),
  );

  const report = [
    "# Concern Content Quality Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `- Concern pages audited: ${concerns.length}`,
    `- Category hubs audited: ${categories.length}`,
    `- Doctor answers audited: ${answers.length}`,
    `- Indexable concern pages: ${concerns.filter((item) => item.indexable).length}`,
    `- Approved concern pages: ${concerns.filter((item) => item.status === "APPROVED" && item.indexable).length}`,
    `- Approved Doctor Answer pages: ${answers.filter((item) => item.status === "APPROVED" && item.indexable).length}`,
    `- Errors: ${errors.length}`,
    `- Warnings: ${warnings.length}`,
    "",
    "## Review gate",
    "",
    "All substantial medical concern pages require a real reviewer and review date before `indexable` may be set to true. The audit fails if that rule is violated.",
    "",
    "## Errors",
    "",
    ...(errors.length ? errors.map((error) => `- ${error}`) : ["- None."]),
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ["- None."]),
    "",
    "## Page detail",
    "",
    "| Route | Status | Indexable | Words | Issues |",
    "| --- | --- | ---: | ---: | --- |",
    ...rows.map((row) => `| ${row.path} | ${row.status} | ${row.indexable} | ${row.word_count} | ${row.issues || "None"} |`),
    "",
  ].join("\n");

  const existingGapPath = path.join(root, "seo", "content-gap-register.csv");
  const existingGap = await readFile(existingGapPath, "utf8").catch(() => "");
  const existingRows = existingGap
    .split(/\r?\n/)
    .filter((line, index) => index > 0 && line && !line.startsWith("/concerns/"));
  const gapHeader = "suggested_url,topic,intent,priority,reason,verified_information_available,medical_input_required,image_assets_required,status";
  const concernGapRows = concerns.map((concern) =>
    [
      `/concerns/${concern.categorySlug}/${concern.slug}`,
      concern.title,
      concern.primaryIntent,
      concern.featured ? "P0" : "P1",
      concern.indexable ? "Doctor-reviewed and approved for indexation" : "Prepared content awaits real medical review before indexation",
      concern.indexable ? "doctor-reviewed" : "editorial-draft",
      concern.indexable ? "no" : "yes",
      "no",
      concern.status.toLowerCase().replaceAll("_", "-"),
    ].map(csvCell).join(","),
  );

  await Promise.all([
    writeFile(path.join(root, "seo", "content-quality-report.md"), report),
    writeFile(path.join(root, "seo", "concern-taxonomy.csv"), toCsv(["canonical_path", "category", "canonical_name", "aliases", "patient_language_terms", "primary_intent", "status", "medical_review_required", "reviewed_by", "reviewed_at", "indexable", "updated_at"], taxonomyRows)),
    writeFile(path.join(root, "seo", "concern-route-map.csv"), toCsv(["route", "route_type", "parent_hub", "canonical", "sitemap", "robots", "status"], routeRows)),
    writeFile(path.join(root, "seo", "doctor-answer-route-map.csv"), toCsv(["route", "route_type", "parent_hub", "canonical", "category", "sitemap", "robots", "status", "reviewed_by", "reviewed_at"], answerRouteRows)),
    writeFile(path.join(root, "seo", "content-internal-linking-graph.csv"), toCsv(["source", "destination", "relationship"], linkingRows)),
    writeFile(path.join(root, "seo", "search-synonyms.json"), `${JSON.stringify(synonymPayload, null, 2)}\n`),
    writeFile(existingGapPath, `${gapHeader}\n${[...existingRows, ...concernGapRows].join("\n")}\n`),
    writeFile(path.join(root, "seo", "no-result-search-report.csv"), "captured_at,query_length,token_count,result_count,privacy_note\n"),
  ]);

  if (errors.length) {
    console.error(`Content audit failed with ${errors.length} error(s). See seo/content-quality-report.md.`);
    process.exitCode = 1;
    return;
  }
  console.log(`Content audit passed for ${concerns.length} concerns, ${categories.length} hubs and ${answers.length} approved answers.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
