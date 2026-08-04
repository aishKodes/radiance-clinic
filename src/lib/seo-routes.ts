export const coreIndexableRoutes = [
  "/",
  "/about",
  "/treatments",
  "/conditions",
  "/knowledge",
  "/before-after",
  "/reviews",
  "/contact",
] as const;

export const plannedLandingRoutes = [
  "/hair-transplant-bhubaneswar",
  "/skin-clinic-bhubaneswar",
  "/laser-hair-removal-bhubaneswar",
  "/acne-scar-treatment-bhubaneswar",
  "/pigmentation-treatment-bhubaneswar",
] as const;

export const plannedLandingRouteSet = new Set<string>(plannedLandingRoutes);
