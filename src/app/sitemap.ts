import type { MetadataRoute } from "next";
import {
  getArticleStaticParams,
  getConditionStaticParams,
  getReviewStaticParams,
  getSeoIndex,
  getTreatmentStaticParams,
} from "@/data/site";
import {
  coreIndexableRoutes,
  localLandingRouteSet,
  localLandingRoutes,
} from "@/lib/seo-routes";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [...coreIndexableRoutes, ...localLandingRoutes];

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
        ...treatmentRoutes,
        ...conditionRoutes,
        ...articleRoutes,
        ...reviewRoutes,
        ...seoRoutes,
      ].filter(Boolean),
    ),
  );

  return routes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : localLandingRouteSet.has(route) ? 0.9 : 0.8,
  }));
}
