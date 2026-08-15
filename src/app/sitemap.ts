import type { MetadataRoute } from "next";
import {
  getArticleStaticParams,
  getConditionStaticParams,
  getReviewStaticParams,
  getSeoIndex,
  getTreatmentStaticParams,
} from "@/data/site";
import {
  categoryHubRoutes,
  concernHubRoutes,
  coreIndexableRoutes,
  localLandingRouteSet,
  localLandingRoutes,
} from "@/lib/seo-routes";
import { approvedConcerns, doctorAnswers } from "@/data/concern-library";
import { indexableLocationPages } from "@/data/location-pages";
import { indexableResultCases } from "@/data/result-cases";
import { absoluteUrl } from "@/lib/seo-config";
import { isIndexableRoute, normalizeRoutePath } from "@/lib/indexability";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [...coreIndexableRoutes, ...categoryHubRoutes, ...concernHubRoutes, ...localLandingRoutes];
  const locationRoutes = indexableLocationPages.map((page) => `/${page.slug}`);
  const resultRoutes = indexableResultCases.map((item) => `/results/${item.category}/${item.slug}`);
  const concernRoutes = approvedConcerns.map((item) => `/concerns/${item.categorySlug}/${item.slug}`);
  const answerRoutes = doctorAnswers
    .filter((answer) => answer.indexable && answer.status === "APPROVED" && answer.reviewedBy && answer.reviewedAt)
    .map((answer) => `/doctor-answers/${answer.slug}`);

  const [
    treatmentParams,
    conditionParams,
    articleParams,
    reviewParams,
    seoIndex,
  ] = await Promise.all([
    getTreatmentStaticParams(),
    getConditionStaticParams(),
    getArticleStaticParams(),
    getReviewStaticParams(),
    getSeoIndex(),
  ]);

  const treatmentRoutes = treatmentParams.map(
    (treatment) => `/treatments/${treatment.cluster}/${treatment.slug}`,
  );
  const conditionRoutes = conditionParams.map(
    (condition) => `/conditions/${condition.slug}`,
  );
  const articleRoutes = articleParams.map(
    (article) => `/knowledge/${article.slug}`,
  );
  const reviewRoutes = reviewParams.map((review) => `/reviews/${review.slug}`);
  const seoRoutes = [
    ...(seoIndex.staticRoutes || []),
    ...seoIndex.treatments.map((item) => item.url),
    ...seoIndex.conditions.map((item) => item.url),
    ...seoIndex.articles.map((item) => item.url),
    ...seoIndex.reviews.map((item) => item.url),
    ...seoIndex.reviews.map((item) => item.categoryUrl).filter(Boolean),
  ] as string[];

  const routes = Array.from(
    new Set(
      [
        ...staticRoutes,
        ...locationRoutes,
        ...resultRoutes,
        ...concernRoutes,
        ...answerRoutes,
        ...treatmentRoutes,
        ...conditionRoutes,
        ...articleRoutes,
        ...reviewRoutes,
        ...seoRoutes,
      ].map(normalizeRoutePath).filter(isIndexableRoute),
    ),
  );

  const updatedAtByRoute = new Map<string, string>();
  for (const item of [
    ...seoIndex.treatments,
    ...seoIndex.conditions,
    ...seoIndex.articles,
    ...seoIndex.reviews,
  ]) {
    if (item.updatedAt) updatedAtByRoute.set(normalizeRoutePath(item.url), item.updatedAt);
  }

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: updatedAtByRoute.get(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : localLandingRouteSet.has(route) ? 0.9 : 0.8,
  }));
}
