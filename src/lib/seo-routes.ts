export const coreIndexableRoutes = [
  "/",
  "/about",
  "/treatments",
  "/concerns",
  "/doctor-answers",
  "/conditions",
  "/knowledge",
  "/before-after",
  "/results",
  "/locations",
  "/reviews",
  "/contact",
  "/privacy-policy",
] as const;

export const concernHubRoutes = [
  "/concerns/hair-loss-scalp",
  "/concerns/hair-transplant",
  "/concerns/acne",
  "/concerns/acne-scars",
  "/concerns/pigmentation",
  "/concerns/skin-texture",
  "/concerns/aging-aesthetics",
  "/concerns/laser-hair-reduction",
  "/concerns/scars-stretch-marks",
  "/concerns/other-skin-concerns",
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
