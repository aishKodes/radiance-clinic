export const coreIndexableRoutes = [
  "/",
  "/about",
  "/treatments",
  "/conditions",
  "/knowledge",
  "/before-after",
  "/results",
  "/locations",
  "/reviews",
  "/contact",
] as const;

export const categoryHubRoutes = [
  "/treatments/hair-restoration",
  "/treatments/skin",
  "/treatments/laser",
  "/treatments/aesthetic-dermatology",
] as const;

export const localLandingRoutes = [
  "/hair-transplant-bhubaneswar",
  "/skin-clinic-bhubaneswar",
  "/laser-hair-removal-bhubaneswar",
  "/acne-scar-treatment-bhubaneswar",
  "/pigmentation-treatment-bhubaneswar",
] as const;

export const localLandingRouteSet = new Set<string>(localLandingRoutes);
