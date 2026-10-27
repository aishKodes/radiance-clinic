export const coreIndexableRoutes = [
  "/",
  "/about",
  "/treatments",
  "/concerns",
  "/doctor-answers",
  "/knowledge",
  "/videos",
  "/before-after",
  "/results",
  "/locations",
  "/reviews",
  "/media",
  "/editorial-policy",
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
  "/acne-treatment-bhubaneswar",
  "/hair-loss-clinic-bhubaneswar",
  "/male-pattern-hair-loss-treatment-bhubaneswar",
  "/female-hair-loss-treatment-bhubaneswar",
  "/crown-hair-transplant-bhubaneswar",
  "/hairline-correction-bhubaneswar",
  "/hair-transplant-repair-bhubaneswar",
  "/beard-moustache-transplant-bhubaneswar",
  "/alopecia-areata-treatment-bhubaneswar",
  "/non-surgical-hair-replacement-bhubaneswar",
  "/wart-removal-bhubaneswar",
  "/botox-treatment-bhubaneswar",
  "/dermal-fillers-bhubaneswar",
  "/tattoo-removal-bhubaneswar",
] as const;

export const localLandingRouteSet = new Set<string>(localLandingRoutes);
