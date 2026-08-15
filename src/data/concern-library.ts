import type {
  Concern,
  ConcernCategory,
  DoctorAnswer,
} from "@/types/concern";

const updatedAt = "2026-08-15";
const preparedBy = "Radiance Editorial Team";

const treatmentLinks = {
  hairAssessment: {
    href: "/treatments/hair-restoration/advanced-hair-fall-solutions",
    label: "Hair fall assessment and planning",
  },
  hairTransplant: {
    href: "/treatments/hair-restoration/fue-hair-transplant",
    label: "FUE hair transplant planning",
  },
  scalpTherapy: {
    href: "/treatments/hair-restoration/prp-gfc-scalp-therapy",
    label: "PRP and GFC scalp therapy",
  },
  acneScars: {
    href: "/treatments/skin-laser/acne-scar-revision",
    label: "Acne scar revision",
  },
  pigmentation: {
    href: "/treatments/skin-laser/laser-pigmentation-program",
    label: "Pigmentation treatment planning",
  },
  laserHair: {
    href: "/treatments/skin-laser/laser-hair-reduction",
    label: "Laser hair reduction",
  },
  aesthetics: {
    href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
    label: "Aesthetic consultation and planning",
  },
  skinConsultation: {
    href: "/skin-clinic-bhubaneswar",
    label: "Skin consultation in Bhubaneswar",
  },
} as const;

export const concernCategories: ConcernCategory[] = [
  {
    slug: "hair-loss-scalp",
    label: "Hair Loss & Scalp",
    shortDescription: "Shedding, thinning, pattern hair loss and scalp changes.",
    introduction: [
      "Hair loss is a symptom rather than a single diagnosis. The pattern, speed of change, scalp condition, age, medical history and family history all help narrow the possibilities.",
      "This library separates everyday patient descriptions such as a widening part or sudden shedding from the conditions that may produce them. It is designed to help patients prepare for assessment, not self-diagnose.",
    ],
    issueGroups: ["Shedding", "Pattern thinning", "Patchy loss", "Scalp health"],
    relatedTreatments: [treatmentLinks.hairAssessment, treatmentLinks.scalpTherapy],
    usefulGuides: [
      { href: "/knowledge/how-to-plan-hair-restoration", label: "How to plan hair restoration" },
    ],
    featuredConcernSlugs: ["hair-loss", "hair-thinning", "male-pattern-hair-loss", "female-pattern-hair-loss", "dandruff"],
    indexable: true,
  },
  {
    slug: "hair-transplant",
    label: "Hair Transplant",
    shortDescription: "Suitability, donor planning, recovery and growth questions.",
    introduction: [
      "Hair transplant decisions depend on diagnosis, donor capacity, future hair-loss risk and realistic design. A procedure name or graft number alone does not describe a safe long-term plan.",
      "These pages explain the questions patients commonly raise before and after transplantation, including hairline planning, temporary shedding and the growth timeline.",
    ],
    issueGroups: ["Suitability", "Planning", "Recovery", "Growth timeline"],
    relatedTreatments: [treatmentLinks.hairTransplant],
    usefulGuides: [
      { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
      { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    ],
    featuredConcernSlugs: ["hair-transplant-suitability", "hairline-design", "post-transplant-shedding", "hair-transplant-growth-timeline"],
    indexable: true,
  },
  {
    slug: "acne",
    label: "Acne",
    shortDescription: "Blocked pores, inflamed breakouts and recurring adult acne.",
    introduction: [
      "Acne may appear as clogged pores, inflamed spots or deeper tender lesions. Treatment choices change with acne type, severity, scarring risk, sensitivity and possible triggers.",
      "The aim is to control active disease and reduce new marks or scars. Aggressive home extraction and frequent product switching can make assessment more difficult.",
    ],
    issueGroups: ["Comedonal acne", "Inflammatory acne", "Deep acne", "Recurring acne"],
    relatedTreatments: [treatmentLinks.skinConsultation, treatmentLinks.acneScars],
    usefulGuides: [
      { href: "/knowledge/skin-care-doctor-bhubaneswar", label: "When a skin-care doctor can help" },
    ],
    featuredConcernSlugs: ["acne", "closed-comedones", "inflammatory-acne", "cystic-acne", "adult-acne"],
    indexable: true,
  },
  {
    slug: "acne-scars",
    label: "Acne Scars",
    shortDescription: "Ice-pick, boxcar, rolling and deep acne scars.",
    introduction: [
      "Acne scars are not all the same. Narrow deep pits, sharp-edged depressions, tethered rolling scars and flat colour changes respond to different approaches.",
      "A scar plan usually starts after active acne is controlled and may combine methods over time. Improvement is a realistic goal; complete erasure is not.",
    ],
    issueGroups: ["Indented scars", "Deep scars", "Post-acne marks", "Mixed scar patterns"],
    relatedTreatments: [treatmentLinks.acneScars],
    usefulGuides: [
      { href: "/acne-scar-treatment-bhubaneswar", label: "Acne scar treatment planning" },
    ],
    featuredConcernSlugs: ["acne-scars", "ice-pick-scars", "boxcar-scars", "rolling-scars", "deep-acne-scars"],
    indexable: true,
  },
  {
    slug: "pigmentation",
    label: "Pigmentation",
    shortDescription: "Melasma, dark spots, tanning and uneven tone.",
    introduction: [
      "Pigmentation describes many different colour changes, from post-acne marks and sunspots to melasma. Similar-looking patches may have different triggers and recurrence patterns.",
      "Assessment considers skin type, distribution, recent inflammation, sun exposure, hormones, medicines and previous treatment before a plan is discussed.",
    ],
    issueGroups: ["Patchy pigmentation", "Post-inflammatory marks", "Sun-related spots", "Under-eye and lip concerns"],
    relatedTreatments: [treatmentLinks.pigmentation, treatmentLinks.skinConsultation],
    usefulGuides: [
      { href: "/pigmentation-treatment-bhubaneswar", label: "Pigmentation consultation in Bhubaneswar" },
    ],
    featuredConcernSlugs: ["pigmentation", "melasma", "sunspots", "uneven-skin-tone", "under-eye-dark-circles"],
    indexable: true,
  },
  {
    slug: "skin-texture",
    label: "Skin Texture",
    shortDescription: "Visible pores, roughness, dehydration and dull-looking skin.",
    introduction: [
      "Texture concerns can come from dryness, congestion, acne scarring, sun exposure or gradual collagen change. What looks like one issue in photographs may have several layers in person.",
      "A useful plan separates skin-barrier care from procedures and avoids treating sensitive or inflamed skin too aggressively.",
    ],
    issueGroups: ["Pores", "Roughness", "Dehydration", "Early lines"],
    relatedTreatments: [treatmentLinks.skinConsultation],
    usefulGuides: [
      { href: "/knowledge/best-skin-clinic-bhubaneswar", label: "Choosing professional skin care" },
    ],
    featuredConcernSlugs: ["enlarged-pores", "rough-skin-texture", "dull-skin", "fine-lines"],
    indexable: true,
  },
  {
    slug: "aging-aesthetics",
    label: "Ageing & Aesthetics",
    shortDescription: "Skin laxity, expression lines and facial volume changes.",
    introduction: [
      "Facial ageing combines skin-quality change, bone and fat-compartment change, muscle movement and sun exposure. A single procedure rarely addresses every layer.",
      "Consultation should clarify the degree of change a patient wants and explain conservative options, limitations, maintenance and recovery without pressuring treatment.",
    ],
    issueGroups: ["Skin laxity", "Volume change", "Expression lines", "Under-eye ageing"],
    relatedTreatments: [treatmentLinks.aesthetics],
    usefulGuides: [
      { href: "/knowledge/premium-aesthetic-consultation", label: "Aesthetic consultation guide" },
    ],
    featuredConcernSlugs: ["skin-laxity", "facial-volume-loss", "forehead-lines", "under-eye-bags"],
    indexable: true,
  },
  {
    slug: "laser-hair-reduction",
    label: "Laser Hair Reduction",
    shortDescription: "Suitability, ingrown hair and realistic reduction expectations.",
    introduction: [
      "Laser hair reduction targets pigmented hair follicles during active growth. Results vary with hair colour and thickness, skin type, treatment area, hormonal factors and session timing.",
      "The correct device, calibrated settings, preparation and aftercare matter. The goal is lasting reduction, not an unsafe promise of permanent removal for every person.",
    ],
    issueGroups: ["Facial hair", "Body hair", "Ingrown hair", "Skin-type suitability"],
    relatedTreatments: [treatmentLinks.laserHair],
    usefulGuides: [
      { href: "/knowledge/laser-skin-treatments-safety", label: "Laser safety guide" },
      { href: "/laser-hair-removal-bhubaneswar", label: "Laser hair reduction in Bhubaneswar" },
    ],
    featuredConcernSlugs: ["unwanted-facial-hair", "ingrown-hair", "laser-hair-reduction-suitability", "laser-hair-removal-dark-skin"],
    indexable: true,
  },
  {
    slug: "scars-stretch-marks",
    label: "Scars & Stretch Marks",
    shortDescription: "Stretch marks and scars after injury or surgery.",
    introduction: [
      "Scars change as they mature. Their colour, thickness, depth, location, symptoms and tendency to grow beyond the original injury influence what may help.",
      "Treatment generally aims to improve texture, colour or comfort rather than remove a scar completely. Raised or rapidly changing scars deserve assessment before cosmetic procedures.",
    ],
    issueGroups: ["Stretch marks", "Surgical scars", "Injury scars", "Raised scars"],
    relatedTreatments: [treatmentLinks.skinConsultation],
    usefulGuides: [
      { href: "/knowledge/laser-skin-treatments-safety", label: "Laser treatment safety" },
    ],
    featuredConcernSlugs: ["stretch-marks", "surgical-scars", "traumatic-scars", "raised-scars-keloids"],
    indexable: true,
  },
  {
    slug: "other-skin-concerns",
    label: "Other Skin Concerns",
    shortDescription: "Moles, warts, redness and excessive sweating.",
    introduction: [
      "Some visible skin changes should be identified before cosmetic treatment is considered. A changing mole, persistent redness or a lesion assumed to be a wart may require a different pathway.",
      "These pages help patients recognise when in-person examination matters and avoid self-treatment that could mask useful diagnostic clues.",
    ],
    issueGroups: ["Growths", "Redness", "Sweating", "Assessment-first concerns"],
    relatedTreatments: [treatmentLinks.skinConsultation],
    usefulGuides: [
      { href: "/knowledge/skin-care-doctor-bhubaneswar", label: "When to consult a skin specialist" },
    ],
    featuredConcernSlugs: ["moles-and-warts", "rosacea-redness", "excessive-sweating"],
    indexable: true,
  },
];

type ConcernSeed = {
  categorySlug: string;
  slug: string;
  title: string;
  aliases: string[];
  summary: string;
  definition: string;
  signs: string[];
  causes: string[];
  notices?: string[];
  clinicTreatments?: Concern["clinicTreatments"];
  related?: string[];
  answers?: string[];
  featured?: boolean;
};

const categoryCare: Record<string, Pick<Concern, "howItIsAssessed" | "whenToSeekProfessionalAdvice" | "treatmentApproaches" | "whatNotToDo" | "preventionOrCare" | "expectedCourse">> = {
  "hair-loss-scalp": {
    howItIsAssessed: ["History of onset, shedding pattern, medicines, nutrition, illness and family history", "Scalp and hair-shaft examination, with tests considered only when the clinical picture indicates them"],
    whenToSeekProfessionalAdvice: ["Loss is sudden, patchy, painful or associated with scalp inflammation", "Shedding continues, the parting widens or the hairline changes despite routine care"],
    treatmentApproaches: ["Treat the identified cause and protect remaining hair", "Discuss medical, scalp-support or restoration pathways only after diagnosis"],
    whatNotToDo: ["Do not start multiple supplements or prescription products without assessment", "Avoid tight hairstyles, harsh traction and repeated aggressive scalp procedures"],
    preventionOrCare: ["Use gentle scalp care and record the timing of major health or medication changes", "Photograph the same areas in similar light monthly rather than checking repeatedly each day"],
    expectedCourse: ["Hair cycles change slowly, so meaningful review often takes months", "Progress depends on the cause, duration and whether follicles remain capable of growth"],
  },
  "hair-transplant": {
    howItIsAssessed: ["Diagnosis, age, progression, donor density and hair calibre are reviewed together", "Hairline, coverage priorities, graft distribution and long-term maintenance are planned rather than guessed"],
    whenToSeekProfessionalAdvice: ["You are considering surgery or are unsure whether loss is stable", "Recovery is accompanied by increasing pain, discharge, fever or rapidly worsening redness"],
    treatmentApproaches: ["Preserve existing hair where appropriate and plan surgery only for suitable candidates", "Use conservative donor harvesting and age-appropriate design"],
    whatNotToDo: ["Do not choose a clinic on graft count or price alone", "Do not pick, scratch or apply unapproved products during recovery"],
    preventionOrCare: ["Follow the operating clinic's written aftercare and contact them when something looks unusual", "Protect donor supply by planning for future loss, not only today's hairline"],
    expectedCourse: ["Early shedding can occur before new growth becomes visible", "Growth and cosmetic maturation are gradual and vary by patient and treated area"],
  },
  acne: {
    howItIsAssessed: ["Lesion type, distribution, severity, scarring risk and current products are reviewed", "Possible hormonal, medicine, friction and lifestyle contributors are considered without assuming one cause"],
    whenToSeekProfessionalAdvice: ["Acne is painful, deep, scarring or affecting confidence", "Breakouts persist despite a simple consistent routine or worsen quickly"],
    treatmentApproaches: ["Control active acne first and reduce the chance of new marks or scars", "Choose topical, oral or procedural support according to severity and medical suitability"],
    whatNotToDo: ["Do not squeeze deep spots or repeatedly scrub inflamed skin", "Avoid adding several strong actives at once"],
    preventionOrCare: ["Use a gentle cleanser, non-comedogenic moisturiser and regular sun protection", "Introduce treatment changes gradually and follow one reviewed plan consistently"],
    expectedCourse: ["Acne improves over weeks to months rather than overnight", "Maintenance may be needed because new lesions can recur after initial control"],
  },
  "acne-scars": {
    howItIsAssessed: ["Active acne and scar types are assessed separately", "Lighting from different angles helps identify depth, sharp edges, tethering and colour change"],
    whenToSeekProfessionalAdvice: ["Scars are deep, mixed or continuing to form", "You are considering resurfacing, needling, subcision or another procedure"],
    treatmentApproaches: ["Match each scar pattern to the most suitable technique", "Use staged combination plans when one method cannot address every scar"],
    whatNotToDo: ["Do not perform deep home needling, strong peels or scar extraction", "Avoid promises that scars can be completely erased"],
    preventionOrCare: ["Control new acne and use sun protection to reduce contrast from post-acne marks", "Allow adequate healing time between procedures"],
    expectedCourse: ["Improvement is usually gradual and partial", "Different scars on the same face may respond at different rates"],
  },
  pigmentation: {
    howItIsAssessed: ["The colour, depth, distribution and trigger pattern are examined", "Skin type, sun exposure, inflammation, hormones, medicines and prior procedures are reviewed"],
    whenToSeekProfessionalAdvice: ["Pigmentation is new, rapidly changing, itchy or associated with another skin change", "Patches keep returning or darken after products or procedures"],
    treatmentApproaches: ["Identify and limit triggers before selecting topical or procedural options", "Use skin-type aware plans to reduce irritation and rebound darkening"],
    whatNotToDo: ["Avoid unlabelled lightening mixtures and prolonged unsupervised steroid creams", "Do not combine strong peels, scrubs and lasers on irritated skin"],
    preventionOrCare: ["Use broad-spectrum sun protection consistently", "Protect the skin barrier and address inflammation early"],
    expectedCourse: ["Many pigment concerns fade slowly and can recur", "Maintenance and trigger control often matter as much as the initial treatment"],
  },
  "skin-texture": {
    howItIsAssessed: ["Texture is examined for dryness, congestion, scarring, fine lines and sun-related change", "Sensitivity, barrier health and current product use shape the plan"],
    whenToSeekProfessionalAdvice: ["Roughness is persistent, inflamed, itchy or associated with acne scars", "You are considering peels, energy devices or repeated facials"],
    treatmentApproaches: ["Restore barrier function before escalating treatment", "Match exfoliation or procedures to the actual texture cause and recovery tolerance"],
    whatNotToDo: ["Do not scrub, peel or layer acids until the skin feels raw", "Avoid judging pores or texture only from magnified phone photographs"],
    preventionOrCare: ["Use gentle cleansing, moisturiser and sun protection consistently", "Introduce active products slowly"],
    expectedCourse: ["Hydration-related texture may improve earlier than scars or collagen change", "Ongoing care is usually needed to maintain smoother-looking skin"],
  },
  "aging-aesthetics": {
    howItIsAssessed: ["Skin quality, facial movement, proportion and volume distribution are assessed together", "The consultation clarifies priorities, degree of desired change and medical history"],
    whenToSeekProfessionalAdvice: ["You are considering injectables, energy devices or other procedures", "A change is sudden, one-sided or accompanied by symptoms"],
    treatmentApproaches: ["Separate skin-quality care from volume, movement and laxity concerns", "Prefer conservative staged planning over treating every visible line"],
    whatNotToDo: ["Do not select dose or product from social-media trends", "Avoid procedures from unqualified providers"],
    preventionOrCare: ["Use sun protection and a consistent skin-care routine", "Allow time to review subtle changes before adding treatment"],
    expectedCourse: ["Ageing continues, so results and maintenance vary", "A natural-looking plan usually prioritises proportion and expression over maximum correction"],
  },
  "laser-hair-reduction": {
    howItIsAssessed: ["Skin type, hair colour, thickness, treatment area and recent tanning are reviewed", "Medicines, irritation and possible hormonal contributors are considered before treatment"],
    whenToSeekProfessionalAdvice: ["Hair growth changes suddenly or is accompanied by menstrual or other hormonal symptoms", "You have a history of burns, pigment change or skin sensitivity after laser"],
    treatmentApproaches: ["Use an appropriate device and conservative calibrated settings", "Plan repeated sessions around hair-growth cycles and reassess response"],
    whatNotToDo: ["Do not wax or pluck immediately before a laser course", "Avoid treatment over recently tanned, infected or irritated skin"],
    preventionOrCare: ["Follow shaving, sun-avoidance and aftercare instructions from the treating clinic", "Report blistering or marked pigment change promptly"],
    expectedCourse: ["Hair reduction develops over multiple sessions", "Maintenance may be needed and fine, light or hormonally driven hair can respond less predictably"],
  },
  "scars-stretch-marks": {
    howItIsAssessed: ["Age, colour, depth, thickness, symptoms and location are documented", "A tendency to form raised scars and the original cause are considered"],
    whenToSeekProfessionalAdvice: ["A scar is painful, itchy, rapidly growing or extends beyond the original injury", "You are considering a procedure on a recent or raised scar"],
    treatmentApproaches: ["Choose care according to scar maturity and type", "Combine colour, texture and symptom treatments only where appropriate"],
    whatNotToDo: ["Do not cut, burn or use strong acids on scars at home", "Avoid treating a growing raised scar as a simple dark mark"],
    preventionOrCare: ["Protect healing skin from sun and follow wound-care advice", "Seek early review if a scar becomes raised or symptomatic"],
    expectedCourse: ["Scars remodel over many months", "Treatment can improve appearance or comfort but does not recreate uninjured skin"],
  },
  "other-skin-concerns": {
    howItIsAssessed: ["The concern is examined in person before cosmetic treatment is discussed", "History, change over time, symptoms and skin distribution help distinguish similar-looking conditions"],
    whenToSeekProfessionalAdvice: ["A growth changes size, shape or colour, bleeds, ulcerates or does not heal", "Redness, sweating or irritation is persistent and affects daily life"],
    treatmentApproaches: ["Confirm the diagnosis first", "Discuss medical or procedural options only after safety and suitability are clear"],
    whatNotToDo: ["Do not burn, cut or apply acids to an unidentified growth", "Avoid concealing important changes with repeated home treatment"],
    preventionOrCare: ["Photograph changes with a date and seek assessment when warning signs appear", "Use gentle skin care while the cause is unclear"],
    expectedCourse: ["The course depends on the diagnosis", "Some concerns are harmless and stable while others need monitoring or medical treatment"],
  },
};

const seeds: ConcernSeed[] = [
  { categorySlug: "hair-loss-scalp", slug: "hair-loss", title: "Hair Loss", aliases: ["hairfall", "hair fall", "losing hair"], summary: "A starting point for understanding persistent shedding, thinning and changes in hair density.", definition: "Hair loss describes a reduction in hair number or density. It can be temporary or progressive, diffuse or patterned, and may arise from more than one factor at the same time.", signs: ["More hair on the pillow or shower drain", "Reduced ponytail thickness", "Visible scalp", "A changing hairline"], causes: ["Pattern hair loss", "Temporary shedding after illness or stress", "Nutritional or medical factors", "Inflammatory or patchy hair-loss conditions"], featured: true },
  { categorySlug: "hair-loss-scalp", slug: "hair-thinning", title: "Hair Thinning", aliases: ["thin hair", "less hair density", "scalp showing"], summary: "Reduced density may be gradual even when daily shedding does not look dramatic.", definition: "Hair thinning means the scalp becomes more visible because individual hairs become finer, fewer follicles are actively growing, or both changes occur together.", signs: ["A broader parting", "Less volume while styling", "Scalp visible in bright light", "Finer hair around the front or crown"], causes: ["Male or female pattern hair loss", "Long-lasting shedding", "Breakage", "Age-related density change"], featured: true },
  { categorySlug: "hair-loss-scalp", slug: "sudden-hair-shedding", title: "Sudden Hair Shedding", aliases: ["sudden hairfall", "hair coming out in handfuls", "excessive shedding"], summary: "A noticeable increase in shedding often follows a trigger, but timing and other symptoms matter.", definition: "Sudden diffuse shedding can occur when more follicles than usual shift into a resting and shedding phase. The trigger may precede the shedding by several weeks or months.", signs: ["Hair releases during washing or combing", "Diffuse volume loss", "No single bald patch", "A recent illness, stressor or medicine change"], causes: ["Fever or illness", "Major stress or surgery", "Postpartum change", "Nutritional, thyroid or medicine-related factors"] },
  { categorySlug: "hair-loss-scalp", slug: "male-pattern-hair-loss", title: "Male Pattern Hair Loss", aliases: ["male pattern baldness", "androgenetic alopecia", "balding crown"], summary: "A progressive pattern that commonly affects the temples, frontal hairline and crown.", definition: "Male pattern hair loss is a genetically influenced process in which susceptible follicles gradually produce finer, shorter hairs in a recognisable distribution.", signs: ["Temple recession", "Crown thinning", "Finer hairs in affected areas", "Family history of pattern loss"], causes: ["Genetic follicle sensitivity", "Age and progression over time", "Coexisting shedding or scalp conditions"], featured: true, clinicTreatments: [treatmentLinks.hairAssessment, treatmentLinks.hairTransplant] },
  { categorySlug: "hair-loss-scalp", slug: "female-pattern-hair-loss", title: "Female Pattern Hair Loss", aliases: ["female hair thinning", "widening part", "female androgenetic alopecia"], summary: "Gradual thinning often appears as a wider part or reduced density over the top of the scalp.", definition: "Female pattern hair loss is a progressive reduction in hair density that often preserves the frontal edge while widening the central parting or reducing overall top density.", signs: ["Widening central part", "Reduced ponytail volume", "Diffuse top thinning", "Gradual progression"], causes: ["Genetic susceptibility", "Age and hormonal context", "Coexisting iron, thyroid or shedding issues"], featured: true },
  { categorySlug: "hair-loss-scalp", slug: "receding-hairline", title: "Receding Hairline", aliases: ["hairline going back", "temple recession", "M shaped hairline"], summary: "Temple or frontal recession may reflect pattern hair loss, traction or a naturally maturing hairline.", definition: "A receding hairline describes backward movement or reduced density at the frontal edge and temples. Shape alone does not establish the cause or predict future loss.", signs: ["Deeper temple corners", "Finer frontal hairs", "Asymmetry", "Progressive change in photographs"], causes: ["Male pattern hair loss", "Traction", "Scarring conditions", "Normal hairline maturation"] },
  { categorySlug: "hair-loss-scalp", slug: "widening-part", title: "Widening Hair Part", aliases: ["broad parting", "scalp visible in part", "female thinning part"], summary: "A part that looks broader over time can be an early sign of diffuse or pattern thinning.", definition: "A widening part is a visual change rather than a diagnosis. It may reflect smaller hair calibre, fewer growing hairs or a styling and lighting difference.", signs: ["More scalp visible along the part", "Reduced top volume", "Part width increases in comparable photos", "Hairline may remain intact"], causes: ["Female pattern hair loss", "Diffuse shedding", "Hair breakage", "Age-related change"] },
  { categorySlug: "hair-loss-scalp", slug: "alopecia-areata", title: "Patchy Hair Loss (Alopecia Areata)", aliases: ["coin shaped bald patch", "patchy alopecia", "round bald spot"], summary: "Smooth, well-defined patches of loss need medical assessment rather than cosmetic camouflage alone.", definition: "Alopecia areata is an immune-mediated form of hair loss that often produces smooth round or oval patches and can affect scalp or facial hair.", signs: ["Sudden smooth patch", "Short tapering hairs", "Eyebrow or beard involvement", "Nail changes in some people"], causes: ["Immune activity around follicles", "Genetic susceptibility", "Other autoimmune associations"] },
  { categorySlug: "hair-loss-scalp", slug: "dandruff", title: "Dandruff & Flaky Scalp", aliases: ["flaky scalp", "white flakes", "scalp scaling"], summary: "Flakes may come from dandruff, irritation, psoriasis or another scalp condition.", definition: "Dandruff commonly causes loose scalp flakes with variable itch and oiliness. Thick scale, marked redness or hair loss may point to a different or additional diagnosis.", signs: ["Loose white or yellowish flakes", "Itch", "Oily or dry-feeling scalp", "Flaking around hairline or ears"], causes: ["Seborrhoeic tendency", "Product irritation", "Dryness", "Psoriasis or fungal scalp disease"] },
  { categorySlug: "hair-loss-scalp", slug: "itchy-scalp", title: "Itchy Scalp", aliases: ["scalp itching", "itching with hair fall", "irritated scalp"], summary: "Persistent scalp itch deserves assessment when there is redness, scale, pain or hair loss.", definition: "Scalp itch can arise from barrier irritation, dandruff, allergy, infection, psoriasis or inflammatory hair-loss conditions. Scratching can add breakage and secondary irritation.", signs: ["Frequent scratching", "Redness or scale", "Tender areas", "Product-related flares"], causes: ["Dandruff", "Contact irritation", "Psoriasis", "Infection or inflammation"] },

  { categorySlug: "hair-transplant", slug: "hair-transplant-suitability", title: "Hair Transplant Suitability", aliases: ["am I eligible for hair transplant", "hair transplant candidate", "can I get transplant"], summary: "Suitability depends on diagnosis, donor capacity, progression and expectations, not age or baldness grade alone.", definition: "A suitable transplant candidate has a restoration goal that can be supported by available donor hair and a plan for future loss. Active disease or unrealistic coverage expectations may change the recommendation.", signs: ["Stable pattern loss", "Usable donor density", "Clear restoration priorities", "Willingness to plan long term"], causes: ["Pattern hair loss suitable for redistribution", "Scarring or other loss only in selected circumstances"], featured: true, answers: ["is-hair-transplant-painful"] },
  { categorySlug: "hair-transplant", slug: "female-hair-transplant", title: "Female Hair Transplant", aliases: ["hair transplant for women", "female hairline transplant", "women hair transplant"], summary: "Selected women may be candidates, but diffuse thinning and donor stability require careful assessment.", definition: "Female hair transplantation redistributes suitable donor follicles to selected areas. It is not appropriate for every widening part or diffuse loss pattern.", signs: ["Stable localised recession", "Traction-related loss after stabilisation", "Suitable donor density", "Realistic coverage goals"], causes: ["Female pattern loss in selected cases", "Stable traction loss", "Scarring after specialist assessment"] },
  { categorySlug: "hair-transplant", slug: "beard-transplant", title: "Beard & Moustache Transplant", aliases: ["beard transplant", "patchy beard transplant", "moustache hair transplant"], summary: "Facial-hair transplantation requires careful angle, direction and density planning.", definition: "A beard or moustache transplant places donor scalp follicles into selected facial areas. Natural-looking direction and conservative density are central to planning.", signs: ["Stable sparse areas", "Scarring with suitable skin", "Clear design goals", "Adequate donor supply"], causes: ["Genetic sparse growth", "Stable scars", "Previous injury"] },
  { categorySlug: "hair-transplant", slug: "donor-area-thinning", title: "Donor Area Thinning", aliases: ["weak donor area", "thin back hair", "overharvested donor"], summary: "The donor area must support both current extraction and the appearance of the scalp after healing.", definition: "Donor thinning may be pre-existing, diffuse or related to previous harvesting. It can limit graft availability and makes further extraction a cautious decision.", signs: ["Scalp visibility at the back or sides", "Patchy extraction pattern", "Low hair calibre", "Previous transplant scars"], causes: ["Diffuse pattern loss", "Overharvesting", "Scarring", "Naturally low density"] },
  { categorySlug: "hair-transplant", slug: "hairline-design", title: "Hairline Design", aliases: ["natural hairline", "hairline shape", "front hair transplant design"], summary: "A durable hairline balances facial proportion, donor limits, age and expected future loss.", definition: "Hairline design is the planned position, contour, irregularity and density transition at the front of a transplant. A lower line is not automatically a better line.", signs: ["Preference for age-appropriate proportion", "Need to frame the face", "Temple recession", "Limited donor supply"], causes: ["Pattern loss and individual facial anatomy"], featured: true },
  { categorySlug: "hair-transplant", slug: "graft-number-planning", title: "Hair Transplant Graft Planning", aliases: ["how many grafts", "graft count", "hair transplant density calculator"], summary: "Graft numbers should follow a mapped area and donor strategy rather than a sales target.", definition: "Graft planning estimates how donor follicular units can be distributed across priority zones. Hair calibre, curl, colour contrast and existing density all affect visual coverage.", signs: ["Different priority zones", "Variable donor density", "Need for staged coverage", "Existing miniaturised hair"], causes: ["Extent of loss", "Hair characteristics", "Donor limitations"] },
  { categorySlug: "hair-transplant", slug: "post-transplant-shedding", title: "Shedding After Hair Transplant", aliases: ["transplanted hair falling", "hair fall after transplant", "post transplant shedding"], summary: "Temporary shedding of implanted hair shafts can occur before new growth begins.", definition: "After transplantation, some implanted hair shafts enter a shedding phase while follicles remain beneath the skin. Clinical review is needed if shedding is accompanied by concerning symptoms.", signs: ["Short implanted hairs shed", "Timing in early recovery", "Skin otherwise settling", "No progressive infection signs"], causes: ["Normal cycling after transplantation", "Shock-related shedding", "Scalp inflammation when recovery is not routine"], featured: true, answers: ["shedding-after-hair-transplant", "when-transplanted-hair-start-growing"] },
  { categorySlug: "hair-transplant", slug: "shock-loss", title: "Shock Loss", aliases: ["hair loss around transplant", "shock shedding", "native hair falling after transplant"], summary: "Temporary shedding can affect existing or donor-area hair after a procedure, but the pattern should be reviewed.", definition: "Shock loss refers to shedding of existing hair after surgical stress. Recovery varies, and miniaturised or damaged follicles may not behave the same as healthy hair.", signs: ["Shedding near treated areas", "Change after surgery", "Diffuse or localised loss", "Variable regrowth"], causes: ["Surgical stress on follicles", "Pre-existing miniaturisation", "Donor or recipient trauma"], answers: ["what-is-shock-loss"] },
  { categorySlug: "hair-transplant", slug: "hair-transplant-growth-timeline", title: "Hair Transplant Growth Timeline", aliases: ["when hair transplant grows", "hair transplant months", "transplant result time"], summary: "Growth is gradual, uneven at first and continues to mature over many months.", definition: "The transplant timeline includes initial healing, possible shedding, early new growth and later thickening. Exact timing varies and photographs should be compared under similar conditions.", signs: ["Early crusting and healing", "Possible shedding", "Fine new hairs", "Progressive thickening and styling change"], causes: ["Normal hair-cycle biology", "Individual healing and growth rates"], featured: true, answers: ["when-transplanted-hair-start-growing"] },

  { categorySlug: "acne", slug: "acne", title: "Acne", aliases: ["pimples", "breakouts", "zits"], summary: "Acne can include clogged pores, inflamed spots and deeper lesions, often at the same time.", definition: "Acne is an inflammatory condition of the pilosebaceous unit. Oil, follicular blockage, microbes and inflammation contribute in different proportions.", signs: ["Whiteheads or blackheads", "Red bumps", "Pustules", "Deep tender lesions"], causes: ["Oil and follicular blockage", "Hormonal influence", "Inflammation", "Occlusive products or friction"], featured: true },
  { categorySlug: "acne", slug: "closed-comedones", title: "Closed Comedones (Whiteheads)", aliases: ["whiteheads", "tiny bumps on forehead", "small skin coloured bumps", "bumps that do not pop"], summary: "Small skin-coloured or white bumps form when a pore is blocked beneath a closed surface.", definition: "Closed comedones are non-inflamed acne lesions caused by retained keratin and oil in a follicle whose opening is not exposed to air.", signs: ["Tiny uniform bumps", "Forehead or cheek congestion", "Rough feel", "Occasional progression to inflamed spots"], causes: ["Comedogenic products", "Oil and dead-skin retention", "Hormonal acne tendency", "Occlusion and friction"], featured: true },
  { categorySlug: "acne", slug: "blackheads", title: "Blackheads (Open Comedones)", aliases: ["open pores with black dots", "black spots in pores", "open comedones"], summary: "The dark surface of a blackhead is oxidised material, not trapped dirt.", definition: "Open comedones develop when a blocked follicle remains open at the surface. The contents darken through oxidation.", signs: ["Dark pinpoint plugs", "Common on nose and central face", "Minimal redness", "May coexist with whiteheads"], causes: ["Follicular blockage", "Oil production", "Acne tendency", "Occlusive products"] },
  { categorySlug: "acne", slug: "inflammatory-acne", title: "Inflammatory Acne", aliases: ["red pimples", "pus pimples", "painful acne"], summary: "Red papules and pustules signal inflammation and carry a greater risk of marks than simple clogged pores.", definition: "Inflammatory acne includes red raised lesions and pustules produced when a blocked follicle triggers a stronger inflammatory response.", signs: ["Red tender bumps", "Pustules", "Clusters of breakouts", "Dark or red marks after healing"], causes: ["Inflamed blocked follicles", "Hormonal influence", "Friction or picking", "Delayed treatment of active acne"], featured: true },
  { categorySlug: "acne", slug: "cystic-acne", title: "Deep or Cystic Acne", aliases: ["big painful pimples", "under skin acne", "nodular acne"], summary: "Deep tender lesions need timely medical care because scarring risk is higher.", definition: "Nodular or cyst-like acne consists of deep inflammatory lesions under the skin. Patients often use 'cystic' for any painful lump, so examination matters.", signs: ["Deep painful lumps", "Long healing time", "Swelling", "Scars or dark marks"], causes: ["Severe follicular inflammation", "Hormonal and genetic tendency", "Delayed or inadequate control"], featured: true },
  { categorySlug: "acne", slug: "hormonal-acne", title: "Hormonal Acne", aliases: ["period pimples", "jawline acne", "PCOS acne"], summary: "Breakouts that cluster around the lower face or menstrual cycle may have a hormonal pattern, but location alone is not diagnostic.", definition: "Hormonal acne refers to acne influenced by androgen activity or hormonal fluctuation. It can coexist with comedonal acne, product-related flares or other conditions.", signs: ["Jawline or lower-face flares", "Cycle-related recurrence", "Deep tender spots", "Possible menstrual or hair-growth changes"], causes: ["Normal hormonal fluctuation", "Polycystic ovary syndrome in some patients", "Androgen sensitivity", "Stress and sleep changes"] },
  { categorySlug: "acne", slug: "adult-acne", title: "Adult Acne", aliases: ["acne after 25", "late acne", "adult pimples"], summary: "Acne can persist from adolescence or begin in adulthood, often with sensitivity and pigmentation concerns.", definition: "Adult acne is acne present beyond the teenage years. Its triggers, distribution and tolerance of treatment can differ from adolescent acne.", signs: ["Recurring lower-face breakouts", "Comedones with inflamed spots", "Post-acne pigmentation", "Sensitive or dry skin alongside acne"], causes: ["Hormonal influence", "Cosmetics or hair products", "Stress and sleep disruption", "Medicines or underlying conditions"], featured: true },
  { categorySlug: "acne", slug: "acne-purging-vs-breakout", title: "Skin Purging vs Acne Breakout", aliases: ["purging or breakout", "new product pimples", "retinol purge"], summary: "A flare after starting a product is not automatically harmless purging.", definition: "Purging is a temporary acceleration of comedone turnover in acne-prone areas after certain active ingredients. Irritation or new acne in unusual areas may be a true breakout or reaction.", signs: ["Timing after a new active", "Location in usual acne areas", "Burning or rash suggests irritation", "Persistence beyond the expected adjustment period"], causes: ["Retinoid or exfoliant introduction", "Irritant dermatitis", "Comedogenic formulation", "Coincidental acne flare"] },

  { categorySlug: "acne-scars", slug: "acne-scars", title: "Acne Scars", aliases: ["pimple holes", "acne pits", "face holes after pimples"], summary: "True scars change skin texture; flat red or brown marks are a different post-acne concern.", definition: "Acne scars form when inflammation alters collagen during healing. They may be indented, raised or mixed, and are different from flat colour changes.", signs: ["Pits or depressions", "Rolling shadows", "Sharp-edged scars", "Raised firm scars"], causes: ["Deep or prolonged inflammation", "Picking or delayed acne control", "Individual healing tendency"], featured: true },
  { categorySlug: "acne-scars", slug: "ice-pick-scars", title: "Ice Pick Acne Scars", aliases: ["tiny deep acne holes", "pinpoint pits", "needle scars"], summary: "Narrow deep pits need approaches that reach the scar rather than surface polishing alone.", definition: "Ice-pick scars are narrow, deep, sharply defined depressions that extend into the dermis and cast small dark points in angled light.", signs: ["Narrow deep openings", "Pinpoint shadows", "Common on cheeks", "Little surface width compared with depth"], causes: ["Deep inflammatory acne", "Collagen loss along a narrow tract"], featured: true },
  { categorySlug: "acne-scars", slug: "boxcar-scars", title: "Boxcar Acne Scars", aliases: ["square acne scars", "sharp edged pits", "crater scars"], summary: "Round or oval depressions with defined edges may be shallow or deep.", definition: "Boxcar scars have broader bases and relatively sharp borders. Depth and edge character influence which procedures may be considered.", signs: ["Round or oval depressions", "Defined edges", "Shadowing in side light", "Mixed shallow and deep scars"], causes: ["Inflammatory acne with collagen loss", "Individual scar remodelling"], featured: true },
  { categorySlug: "acne-scars", slug: "rolling-scars", title: "Rolling Acne Scars", aliases: ["wavy acne scars", "uneven rolling skin", "tethered acne scars"], summary: "Broad shallow depressions can create wave-like shadows when fibrous bands tether the skin.", definition: "Rolling scars are broad depressions with sloping edges, often caused by tethering beneath the skin. Their appearance changes with light and skin movement.", signs: ["Undulating texture", "Soft-edged depressions", "Worse in side lighting", "Temporary flattening when skin is stretched"], causes: ["Fibrous tethering", "Collagen loss after inflammatory acne"], featured: true },
  { categorySlug: "acne-scars", slug: "post-acne-red-marks", title: "Red Marks After Acne", aliases: ["red acne marks", "post acne redness", "PIE"], summary: "Flat red or pink marks are vascular post-inflammatory changes, not indented scars.", definition: "Post-inflammatory erythema is persistent redness after acne inflammation. It is more visible in some skin types and should be distinguished from active acne and brown pigmentation.", signs: ["Flat pink or red spots", "No surface depression", "Follows healed acne", "Changes with temperature or pressure"], causes: ["Dilated superficial vessels after inflammation", "Ongoing irritation"] },
  { categorySlug: "acne-scars", slug: "post-inflammatory-hyperpigmentation", title: "Dark Marks After Acne", aliases: ["pimple marks", "acne pigmentation", "brown acne spots", "PIH"], summary: "Flat brown or grey marks can remain after acne, especially when inflammation or picking is significant.", definition: "Post-inflammatory hyperpigmentation is excess pigment produced after skin inflammation. It is not a permanent scar, although fading can be slow.", signs: ["Flat brown or grey spots", "Matches previous acne sites", "Darkens with sun exposure", "No indentation"], causes: ["Inflammation", "Picking", "Irritating treatment", "Sun exposure"] },
  { categorySlug: "acne-scars", slug: "deep-acne-scars", title: "Deep Acne Scars", aliases: ["very deep pimple holes", "severe acne scarring", "deep face pits"], summary: "Deep mixed scars usually need staged combination planning and realistic improvement goals.", definition: "Deep acne scarring may combine ice-pick, deep boxcar and tethered scars. Surface-only treatment is unlikely to address every component.", signs: ["Deep visible depressions", "Mixed scar shapes", "Strong shadowing", "History of severe inflammatory acne"], causes: ["Nodular or cystic acne", "Delayed control", "Individual collagen response"], featured: true },

  { categorySlug: "pigmentation", slug: "pigmentation", title: "Facial Pigmentation", aliases: ["dark patches", "skin pigmentation", "face darkening"], summary: "Pigmentation is an umbrella term; pattern and trigger determine what it may represent.", definition: "Facial pigmentation means areas of increased colour caused by excess melanin, deposited pigment or another skin process. It includes several distinct conditions.", signs: ["Brown or grey patches", "Uneven tone", "Dark marks after inflammation", "Sun-related worsening"], causes: ["Melasma", "Post-inflammatory change", "Sunspots", "Friction, medicines or other skin conditions"], featured: true },
  { categorySlug: "pigmentation", slug: "melasma", title: "Melasma", aliases: ["facial pigmentation", "brown patches", "patches on cheeks", "pregnancy pigmentation"], summary: "Melasma is a recurring pattern of facial pigmentation influenced by light, hormones and individual susceptibility.", definition: "Melasma causes symmetrical brown or grey-brown facial patches, commonly on the cheeks, forehead or upper lip. It often needs long-term trigger control.", signs: ["Symmetrical facial patches", "Cheek, forehead or upper-lip involvement", "Worsening with light or heat", "Recurrence after improvement"], causes: ["Genetic susceptibility", "Sun and visible light", "Hormonal influence", "Heat and irritation in some patients"], featured: true },
  { categorySlug: "pigmentation", slug: "sunspots", title: "Sunspots", aliases: ["age spots", "solar lentigines", "brown sun spots"], summary: "Well-defined brown spots on exposed skin often reflect cumulative sun exposure, but new changing lesions need assessment.", definition: "Sunspots are flat pigmented macules that develop on chronically exposed skin. Examination distinguishes them from other pigmented growths.", signs: ["Flat defined brown spots", "Face or backs of hands", "Gradual appearance", "More numerous with sun exposure"], causes: ["Cumulative ultraviolet exposure", "Age and individual susceptibility"], featured: true },
  { categorySlug: "pigmentation", slug: "uneven-skin-tone", title: "Uneven Skin Tone", aliases: ["patchy skin colour", "uneven complexion", "face colour uneven"], summary: "Uneven tone may combine pigmentation, redness, tanning, dryness and shadow from texture.", definition: "Uneven skin tone is a visual description rather than a diagnosis. Separating colour change from texture and vascular redness avoids treating the wrong layer.", signs: ["Patchy colour", "Mixture of red and brown areas", "Dull or dry zones", "Worse after sun exposure"], causes: ["Post-inflammatory change", "Tanning", "Melasma", "Redness or texture variation"] },
  { categorySlug: "pigmentation", slug: "tanning", title: "Sun Tan & Persistent Darkening", aliases: ["tan removal", "sun darkening", "face tan"], summary: "Tanning is a protective pigment response; persistent patchiness may include additional pigmentation concerns.", definition: "A tan develops when ultraviolet exposure stimulates melanin production. Repeated exposure also contributes to uneven pigment and premature skin ageing.", signs: ["Darkening after outdoor exposure", "Sharp clothing or watch lines", "Uneven exposed areas", "Dry or irritated skin after sun"], causes: ["Ultraviolet exposure", "Inadequate sun protection", "Photosensitising factors"] },
  { categorySlug: "pigmentation", slug: "lip-pigmentation", title: "Lip Pigmentation", aliases: ["dark lips", "black lips", "uneven lip colour"], summary: "Lip darkening may relate to natural variation, irritation, habits, medicines or other causes.", definition: "Lip pigmentation describes increased or uneven colour of the vermilion or surrounding skin. A recent change, symptoms or a focal lesion should be examined.", signs: ["Diffuse darkening", "Patchy lip colour", "Dryness or irritation", "Change after a new product"], causes: ["Natural pigmentation", "Irritant or allergic lip products", "Smoking or friction", "Medicines or medical conditions"] },
  { categorySlug: "pigmentation", slug: "under-eye-dark-circles", title: "Under-Eye Dark Circles", aliases: ["dark circles", "black under eyes", "eye pigmentation"], summary: "Dark circles can reflect pigment, visible vessels, shadowing, skin thickness or a combination.", definition: "Under-eye darkness is an appearance created by several anatomical and skin factors. Stretching the skin and changing lighting can help reveal whether pigment or shadow predominates.", signs: ["Brown or bluish tone", "Hollow-related shadow", "Prominent tear trough", "Seasonal allergy or rubbing"], causes: ["Genetic pigmentation", "Thin skin and visible vessels", "Volume-related shadow", "Allergy, rubbing and sun exposure"], featured: true },

  { categorySlug: "skin-texture", slug: "enlarged-pores", title: "Visible or Enlarged Pores", aliases: ["open pores", "big pores", "holes on nose"], summary: "Pores cannot be erased, but congestion, oil and surrounding skin quality can change how visible they look.", definition: "Visible pores are follicular openings made more noticeable by oil, blockage, hair, skin laxity or textural contrast.", signs: ["Prominent openings on nose or cheeks", "Oiliness or blackheads", "Texture visible in side light", "Greater appearance with laxity"], causes: ["Genetics and oil production", "Comedones", "Sun-related collagen change", "Ageing"] },
  { categorySlug: "skin-texture", slug: "rough-skin-texture", title: "Rough Skin Texture", aliases: ["bumpy skin", "uneven skin texture", "sandpaper face"], summary: "Roughness may come from dryness, congestion, inflammation or scarring and should not automatically be scrubbed.", definition: "Rough texture is an uneven surface feel or appearance. Barrier dryness and follicular bumps need different care from scars or sun-related change.", signs: ["Dry flakes", "Small bumps", "Make-up sits unevenly", "Sensitivity after exfoliation"], causes: ["Barrier dryness", "Comedones", "Keratin build-up", "Acne scars or sun damage"] },
  { categorySlug: "skin-texture", slug: "dull-skin", title: "Dull-Looking Skin", aliases: ["no glow", "tired skin", "lifeless face"], summary: "Dullness is often a mix of dryness, surface build-up, uneven pigment and light reflection.", definition: "Dull-looking skin is a subjective reduction in brightness or evenness rather than a diagnosis. Sleep, barrier health, pigment and texture all contribute.", signs: ["Reduced brightness", "Dry surface", "Uneven colour", "Skin looks tired despite rest"], causes: ["Dehydration", "Sun exposure", "Irritating routines", "Uneven pigment or texture"] },
  { categorySlug: "skin-texture", slug: "fine-lines", title: "Fine Lines", aliases: ["small wrinkles", "early wrinkles", "crepey skin"], summary: "Fine lines can reflect movement, dryness and gradual collagen change.", definition: "Fine lines are shallow creases that may become more visible with facial movement, dehydration or sun-related loss of skin elasticity.", signs: ["Lines around eyes or mouth", "More visible when smiling", "Crepey texture", "Improvement after moisturising if dryness contributes"], causes: ["Facial movement", "Sun exposure", "Age-related collagen change", "Dryness"] },
  { categorySlug: "skin-texture", slug: "dehydrated-skin", title: "Dehydrated Skin", aliases: ["tight skin", "skin lacking water", "dry but oily skin"], summary: "Dehydration describes low water content and can occur even when the skin is oily.", definition: "Dehydrated skin may feel tight, look dull and show temporary fine lines because barrier function and water retention are impaired.", signs: ["Tightness after cleansing", "Temporary fine lines", "Stinging with products", "Oiliness with surface dryness"], causes: ["Harsh cleansing", "Over-exfoliation", "Dry climate or air conditioning", "Barrier irritation"] },

  { categorySlug: "aging-aesthetics", slug: "skin-laxity", title: "Skin Laxity", aliases: ["loose skin", "sagging face", "skin tightening"], summary: "Laxity reflects gradual changes in collagen, elastin, support structures and facial volume.", definition: "Skin laxity is reduced firmness or recoil. Its appearance depends on skin quality and deeper facial anatomy, so treatment categories are not interchangeable.", signs: ["Jawline softness", "Loose cheek or neck skin", "Reduced firmness", "Changes that progress gradually"], causes: ["Age-related collagen change", "Sun exposure", "Weight change", "Genetic anatomy"], featured: true },
  { categorySlug: "aging-aesthetics", slug: "facial-volume-loss", title: "Facial Volume Loss", aliases: ["sunken cheeks", "face hollowing", "volume loss"], summary: "Changes in fat compartments and bone support can create hollows or altered facial proportion.", definition: "Facial volume loss describes a reduction or redistribution of soft-tissue fullness. It may create shadow and should be distinguished from skin laxity alone.", signs: ["Cheek hollowing", "Temple hollows", "Deeper folds", "Under-eye shadow"], causes: ["Ageing", "Weight loss", "Genetic facial structure", "Illness-related change"] },
  { categorySlug: "aging-aesthetics", slug: "forehead-lines", title: "Forehead & Frown Lines", aliases: ["forehead wrinkles", "11 lines", "expression lines"], summary: "Movement lines and lines visible at rest require different conversations about expectations.", definition: "Forehead and frown lines form through repeated muscle movement, skin quality and gradual loss of elasticity. Their pattern depends on individual expression and anatomy.", signs: ["Horizontal forehead lines", "Vertical frown lines", "Visible mainly with movement or also at rest", "Brow-position change"], causes: ["Facial expression", "Sun exposure", "Age-related skin change"] },
  { categorySlug: "aging-aesthetics", slug: "under-eye-bags", title: "Under-Eye Bags", aliases: ["eye bags", "puffy under eyes", "under eye hollow"], summary: "Puffiness, fat prominence, fluid retention and hollow-related shadow can look similar in photographs.", definition: "Under-eye bags describe fullness or shadow beneath the eyes. The cause may be structural, fluid-related or combined with pigmentation and skin laxity.", signs: ["Persistent lower-lid fullness", "Morning puffiness", "Tear-trough shadow", "Loose or crepey skin"], causes: ["Genetic anatomy", "Age-related support change", "Fluid retention and allergy", "Volume-related shadow"] },

  { categorySlug: "laser-hair-reduction", slug: "unwanted-facial-hair", title: "Unwanted Facial Hair", aliases: ["chin hair", "upper lip hair", "facial hair women"], summary: "Hair pattern, thickness and possible hormonal changes guide whether laser is likely to help.", definition: "Unwanted facial hair may be genetically normal, hormonally influenced or part of a broader change. Coarse dark hair generally responds differently from fine light hair.", signs: ["Coarse chin or upper-lip hair", "Frequent plucking", "Skin irritation", "Recent increase with hormonal symptoms"], causes: ["Genetic hair pattern", "Hormonal sensitivity", "Polycystic ovary syndrome in some patients", "Medicines"] },
  { categorySlug: "laser-hair-reduction", slug: "ingrown-hair", title: "Ingrown Hair", aliases: ["hair growing inside skin", "razor bumps", "pseudofolliculitis"], summary: "Curved or cut hairs can re-enter the skin, causing bumps, inflammation and dark marks.", definition: "An ingrown hair occurs when a hair grows into or becomes trapped beneath the skin surface. Repeated inflammation can resemble acne and leave pigmentation.", signs: ["Bumps after shaving or waxing", "Visible trapped hair", "Tender pustules", "Dark marks"], causes: ["Curly hair", "Close shaving", "Waxing or plucking", "Friction"] },
  { categorySlug: "laser-hair-reduction", slug: "strawberry-legs", title: "Strawberry Legs", aliases: ["black dots on legs", "dark pores legs", "spotted legs after shaving"], summary: "Dark follicular dots may reflect hair stubble, blocked follicles, irritation or keratosis pilaris.", definition: "Strawberry legs is a patient term for visible dark follicular openings on the legs. It is not one diagnosis and may need a combined skin and hair-removal approach.", signs: ["Dark dots at follicles", "Roughness", "Worse after shaving", "Occasional ingrown hairs"], causes: ["Hair stubble", "Follicular plugging", "Shaving irritation", "Keratosis pilaris"] },
  { categorySlug: "laser-hair-reduction", slug: "laser-hair-reduction-suitability", title: "Laser Hair Reduction Suitability", aliases: ["am I suitable for laser", "laser hair removal candidate", "laser consultation"], summary: "Suitability depends on the contrast between hair pigment and skin, treatment area, medicines and recent sun exposure.", definition: "Laser hair reduction is most predictable when target hairs contain enough pigment and settings can be used safely for the patient's skin type.", signs: ["Coarse pigmented hair", "Stable treatment area", "No active irritation", "Ability to follow sun and session guidance"], causes: ["Unwanted hair suitable for light-based follicle targeting"], featured: true },
  { categorySlug: "laser-hair-reduction", slug: "laser-hair-removal-dark-skin", title: "Laser Hair Reduction for Darker Skin", aliases: ["laser hair removal Indian skin", "laser for brown skin", "laser hair removal dark skin"], summary: "Darker skin can be treated, but device selection and conservative calibrated settings are especially important.", definition: "In darker skin, epidermal melanin competes with hair pigment for laser energy. Appropriate wavelength, cooling and settings help reduce burn and pigment-change risk.", signs: ["Brown or deeper skin tone", "Coarse dark target hair", "History of post-inflammatory pigmentation", "Need for careful test settings"], causes: ["Unwanted hair with higher skin-pigment considerations"], featured: true },

  { categorySlug: "scars-stretch-marks", slug: "stretch-marks", title: "Stretch Marks", aliases: ["striae", "pregnancy stretch marks", "body lines"], summary: "Stretch marks change colour and texture as they mature; early red marks differ from older pale marks.", definition: "Stretch marks are linear dermal scars that develop when skin changes rapidly under hormonal and mechanical influence.", signs: ["Red, purple or pale lines", "Abdomen, thighs, hips or arms", "Soft wrinkled texture", "Development after growth or weight change"], causes: ["Pregnancy", "Growth spurts", "Weight or muscle change", "Corticosteroid exposure or medical conditions"] },
  { categorySlug: "scars-stretch-marks", slug: "surgical-scars", title: "Surgical Scars", aliases: ["operation scar", "stitch marks", "post surgery scar"], summary: "Scar care depends on healing stage, tension, colour, thickness and symptoms.", definition: "A surgical scar is the skin's repair line after an incision. It normally remodels over time, but may widen, darken, thicken or remain symptomatic.", signs: ["Linear scar", "Early redness", "Itch or tightness", "Widening or raised areas"], causes: ["Normal wound healing", "Tension or infection", "Individual scar tendency", "Sun exposure during healing"] },
  { categorySlug: "scars-stretch-marks", slug: "traumatic-scars", title: "Traumatic & Injury Scars", aliases: ["accident scar", "cut mark", "injury scar"], summary: "Injury scars can combine colour, contour and tissue-loss changes.", definition: "Traumatic scars follow cuts, abrasions, burns or deeper injury. Their shape and depth reflect the original damage and the way it healed.", signs: ["Irregular contour", "Colour mismatch", "Tethering or tissue loss", "Symptoms such as itch or pain"], causes: ["Cuts or abrasions", "Burns", "Infection", "Delayed or complex healing"] },
  { categorySlug: "scars-stretch-marks", slug: "raised-scars-keloids", title: "Raised Scars & Keloids", aliases: ["keloid", "thick scar", "growing scar"], summary: "A raised scar that grows beyond the original injury needs careful assessment before any procedure.", definition: "Hypertrophic scars remain within the original wound, while keloids extend beyond it. Both involve excess scar tissue and may itch or hurt.", signs: ["Firm raised tissue", "Growth beyond wound edges", "Itch or tenderness", "Common on chest, shoulders or ears"], causes: ["Individual keloid tendency", "Skin injury or piercing", "Inflammation and wound tension"] },

  { categorySlug: "other-skin-concerns", slug: "moles-and-warts", title: "Moles, Skin Tags & Warts", aliases: ["mole removal", "wart removal", "skin growth"], summary: "Different growths can look similar, so identification comes before cosmetic removal.", definition: "Moles are pigment-cell growths, skin tags are soft benign folds and warts are viral growths. A photograph or patient label alone may not reliably distinguish them.", signs: ["Pigmented or skin-coloured growth", "Rough or smooth surface", "Stable or changing appearance", "Irritation from friction"], causes: ["Benign moles", "Skin tags", "Human papillomavirus warts", "Other benign or concerning lesions"] },
  { categorySlug: "other-skin-concerns", slug: "rosacea-redness", title: "Persistent Facial Redness & Rosacea", aliases: ["red face", "rosacea", "facial flushing"], summary: "Recurring central-face redness may involve flushing, visible vessels, bumps or sensitivity.", definition: "Rosacea is a chronic inflammatory facial condition with variable redness, flushing, vessels and acne-like bumps. Other rashes can resemble it.", signs: ["Central-face flushing", "Persistent redness", "Visible small vessels", "Burning or acne-like bumps"], causes: ["Rosacea susceptibility", "Heat, alcohol or spice triggers", "Sun exposure", "Barrier sensitivity"] },
  { categorySlug: "other-skin-concerns", slug: "excessive-sweating", title: "Excessive Sweating", aliases: ["hyperhidrosis", "too much sweating", "sweaty palms"], summary: "Sweating beyond temperature or activity needs context, particularly when it begins suddenly or occurs at night.", definition: "Hyperhidrosis is sweating that is excessive for the body's cooling needs. It may be localised or associated with another medical factor.", signs: ["Sweaty palms, soles or underarms", "Clothing impact", "Daily-life interference", "Sudden generalised or night sweating"], causes: ["Primary focal hyperhidrosis", "Medicines", "Hormonal or metabolic factors", "Other medical conditions"] },
];

function concernFaq(seed: ConcernSeed) {
  return [
    {
      question: `Can ${seed.title.toLowerCase()} be diagnosed from a photograph?`,
      answer: "A photograph can document appearance but may not show texture, depth, scalp findings or warning signs. A diagnosis and personalised plan may require history and in-person examination.",
    },
    {
      question: `Is there one best treatment for ${seed.title.toLowerCase()}?`,
      answer: "Not usually. The appropriate pathway depends on the cause, severity, skin or hair characteristics, previous treatment, medical suitability and the result you hope to achieve.",
    },
  ];
}

function buildConcern(seed: ConcernSeed): Concern {
  const category = concernCategories.find((item) => item.slug === seed.categorySlug);
  const care = categoryCare[seed.categorySlug];
  if (!category || !care) throw new Error(`Unknown concern category: ${seed.categorySlug}`);
  return {
    slug: seed.slug,
    categorySlug: seed.categorySlug,
    title: seed.title,
    shortName: seed.title,
    aliases: seed.aliases,
    patientLanguageTerms: seed.aliases,
    primaryIntent: `${seed.title.toLowerCase()} guidance`,
    secondaryIntents: ["symptoms", "possible causes", "assessment", "treatment options"],
    summary: seed.summary,
    definition: seed.definition,
    commonSigns: seed.signs,
    possibleCauses: seed.causes,
    whatPatientsOftenNotice: seed.notices || seed.signs.slice(0, 3),
    ...care,
    expectedCourse: [
      ...care.expectedCourse,
      "An online description cannot predict an individual response. Progress is best judged with a consistent plan, comparable photographs where useful, and review when the pattern or symptoms change.",
    ],
    clinicTreatments: seed.clinicTreatments || category.relatedTreatments,
    faq: concernFaq(seed),
    doctorAnswers: seed.answers || [],
    relatedConcerns: seed.related || [],
    relatedArticles: category.usefulGuides,
    references: [],
    preparedBy,
    updatedAt,
    seoTitle: `${seed.title}: Signs, Causes & Assessment | Radiance Clinics`,
    seoDescription: `Learn the signs, possible causes, assessment and care pathways for ${seed.title.toLowerCase()}. Patient-friendly guidance from Radiance Clinics.`,
    medicalReviewRequired: true,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
    featured: Boolean(seed.featured),
    searchTerms: Array.from(new Set([seed.title, ...seed.aliases, ...seed.signs, ...seed.causes])),
  };
}

export const concerns: Concern[] = seeds.map(buildConcern);

export const concernsByCategory = new Map(
  concernCategories.map((category) => [
    category.slug,
    concerns.filter((concern) => concern.categorySlug === category.slug),
  ]),
);

export const concernByPath = new Map(
  concerns.map((concern) => [
    `/concerns/${concern.categorySlug}/${concern.slug}`,
    concern,
  ]),
);

export function getConcern(categorySlug: string, slug: string) {
  return concerns.find(
    (concern) => concern.categorySlug === categorySlug && concern.slug === slug,
  );
}

export function getConcernCategory(slug: string) {
  return concernCategories.find((category) => category.slug === slug);
}

export const doctorAnswers: DoctorAnswer[] = [
  {
    slug: "is-hair-transplant-painful",
    question: "Is a hair transplant painful?",
    categorySlug: "hair-transplant",
    conciseAnswer: "Local anaesthesia is used to reduce procedural pain, while pressure, pulling or brief discomfort may still be noticed. Recovery sensations vary and should be discussed with the treating surgeon.",
    explanation: ["Comfort depends on the anaesthetic technique, procedure length, individual sensitivity and how the donor and recipient areas are handled.", "Pain that becomes stronger rather than settling, especially with fever, discharge or increasing redness, needs prompt contact with the operating clinic."],
    whenEvaluationMayHelp: "A pre-procedure consultation is the right time to discuss anxiety, previous anaesthetic reactions, medicines and the clinic's pain-control and aftercare protocol.",
    relatedConcern: "/concerns/hair-transplant/hair-transplant-suitability",
    relatedTreatment: treatmentLinks.hairTransplant,
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedQuestions: ["shedding-after-hair-transplant", "when-transplanted-hair-start-growing"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "shedding-after-hair-transplant",
    question: "Is shedding after a hair transplant normal?",
    categorySlug: "hair-transplant",
    conciseAnswer: "Shedding of implanted hair shafts can occur during early recovery while follicles remain under the skin. The timing and accompanying scalp signs determine whether review is needed.",
    explanation: ["The transplanted hair shaft and the follicle are not the same thing. A shaft can shed before a new growth cycle begins.", "Increasing redness, pus, fever, worsening pain or unusual patchy donor change should not be dismissed as routine shedding."],
    whenEvaluationMayHelp: "Contact the operating clinic whenever recovery differs from the written aftercare plan or you are worried about the donor or recipient area.",
    relatedConcern: "/concerns/hair-transplant/post-transplant-shedding",
    relatedTreatment: treatmentLinks.hairTransplant,
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedQuestions: ["what-is-shock-loss", "when-transplanted-hair-start-growing"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "when-transplanted-hair-start-growing",
    question: "When does transplanted hair start growing?",
    categorySlug: "hair-transplant",
    conciseAnswer: "Visible growth is gradual and usually follows an early healing and shedding phase. Exact milestones vary, so the operating clinic's reviewed timeline should guide expectations.",
    explanation: ["Early hairs may be fine, uneven and difficult to judge in changing light. Density and calibre continue to mature after growth first appears.", "Monthly photographs with the same angle, hairstyle and lighting are more useful than daily inspection."],
    whenEvaluationMayHelp: "Follow-up is useful when growth, scalp symptoms or donor healing differ from the clinic's expected course.",
    relatedConcern: "/concerns/hair-transplant/hair-transplant-growth-timeline",
    relatedTreatment: treatmentLinks.hairTransplant,
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedQuestions: ["shedding-after-hair-transplant", "what-is-shock-loss"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "what-is-shock-loss",
    question: "What is shock loss after a hair transplant?",
    categorySlug: "hair-transplant",
    conciseAnswer: "Shock loss describes shedding of existing hair after procedural stress. It can be temporary, but weak miniaturised follicles and donor trauma need individual assessment.",
    explanation: ["It may occur near the recipient area or, less commonly, in a donor area that has been stressed.", "The pattern, timing and condition of the scalp matter more than the label alone."],
    whenEvaluationMayHelp: "Ask the operating surgeon to review unexpected density loss, especially when it is sharply patchy, painful or associated with skin change.",
    relatedConcern: "/concerns/hair-transplant/shock-loss",
    relatedTreatment: treatmentLinks.hairTransplant,
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedQuestions: ["shedding-after-hair-transplant", "when-transplanted-hair-start-growing"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "hair-thinning-vs-hair-fall",
    question: "What is the difference between hair fall and hair thinning?",
    categorySlug: "hair-loss-scalp",
    conciseAnswer: "Hair fall describes shedding; hair thinning describes reduced visible density or calibre. A person can have one without noticing much of the other.",
    explanation: ["Pattern hair loss may progress through miniaturisation without dramatic shedding. Temporary shedding may be heavy but later recover if the trigger resolves.", "History, scalp examination and comparable photographs help separate these patterns."],
    whenEvaluationMayHelp: "Seek assessment when shedding persists, the part widens, the hairline recedes or loss is patchy or symptomatic.",
    relatedConcern: "/concerns/hair-loss-scalp/hair-thinning",
    relatedTreatment: treatmentLinks.hairAssessment,
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedQuestions: [],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "why-acne-keeps-returning",
    question: "Why does my acne keep returning?",
    categorySlug: "acne",
    conciseAnswer: "Acne can recur because the underlying tendency remains, treatment was stopped early, triggers continue or the original condition was not acne alone.",
    explanation: ["Oil, follicular blockage, inflammation, hormones, products and friction can contribute in different combinations.", "A maintenance plan may be needed after active acne improves."],
    whenEvaluationMayHelp: "Review is helpful for painful, scarring, persistent or sudden adult-onset acne and when hormonal symptoms are present.",
    relatedConcern: "/concerns/acne/acne",
    relatedTreatment: treatmentLinks.skinConsultation,
    relatedGuide: { href: "/knowledge/skin-care-doctor-bhubaneswar", label: "How a skin-care doctor can help" },
    relatedQuestions: ["which-acne-scar-treatment-is-best"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "can-deep-acne-scars-improve",
    question: "Can deep acne scars improve?",
    categorySlug: "acne-scars",
    conciseAnswer: "Deep acne scars can often be improved, but complete removal is not a realistic promise. Mixed scar types frequently need staged combination treatment.",
    explanation: ["Narrow deep scars, sharp-edged depressions and tethered rolling scars respond to different techniques.", "Active acne, skin type, downtime and pigment risk affect the sequence."],
    whenEvaluationMayHelp: "An in-person scar assessment can identify morphology and explain which scars are likely to respond to each approach.",
    relatedConcern: "/concerns/acne-scars/deep-acne-scars",
    relatedTreatment: treatmentLinks.acneScars,
    relatedGuide: { href: "/acne-scar-treatment-bhubaneswar", label: "Acne scar consultation" },
    relatedQuestions: ["which-acne-scar-treatment-is-best"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "which-acne-scar-treatment-is-best",
    question: "Which acne scar treatment is best?",
    categorySlug: "acne-scars",
    conciseAnswer: "There is no single best procedure for every acne scar. The useful question is which method fits each scar type, skin type and recovery preference.",
    explanation: ["A patient may have ice-pick, boxcar and rolling scars together, with post-acne pigment adding further contrast.", "Combination plans are common because one procedure cannot correct every layer."],
    whenEvaluationMayHelp: "Assessment is needed before resurfacing, needling, subcision or focal scar procedures are selected.",
    relatedConcern: "/concerns/acne-scars/acne-scars",
    relatedTreatment: treatmentLinks.acneScars,
    relatedGuide: { href: "/acne-scar-treatment-bhubaneswar", label: "Acne scar consultation" },
    relatedQuestions: ["can-deep-acne-scars-improve"],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "why-melasma-returns",
    question: "Why does melasma come back?",
    categorySlug: "pigmentation",
    conciseAnswer: "Melasma has a recurring tendency because light, heat, hormones and individual pigment susceptibility can continue after visible patches improve.",
    explanation: ["Aggressive treatment can inflame skin and worsen pigment in some patients.", "Consistent sun and visible-light protection plus a maintenance plan are often central to control."],
    whenEvaluationMayHelp: "Review is useful when patches change, treatment irritates the skin or pigmentation repeatedly rebounds.",
    relatedConcern: "/concerns/pigmentation/melasma",
    relatedTreatment: treatmentLinks.pigmentation,
    relatedGuide: { href: "/pigmentation-treatment-bhubaneswar", label: "Pigmentation consultation" },
    relatedQuestions: [],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
  {
    slug: "laser-hair-reduction-permanent",
    question: "Does laser hair removal permanently remove hair?",
    categorySlug: "laser-hair-reduction",
    conciseAnswer: "Laser is more accurately described as long-term hair reduction. Response and maintenance vary by hair type, skin type, area and hormonal factors.",
    explanation: ["Coarse pigmented hair usually provides a clearer laser target than fine or light hair.", "New or hormonally stimulated hair can appear even after a good initial response."],
    whenEvaluationMayHelp: "A consultation should assess device suitability, skin type, expectations and any sudden or hormonally associated hair growth.",
    relatedConcern: "/concerns/laser-hair-reduction/laser-hair-reduction-suitability",
    relatedTreatment: treatmentLinks.laserHair,
    relatedGuide: { href: "/knowledge/laser-skin-treatments-safety", label: "Laser safety guide" },
    relatedQuestions: [],
    preparedBy,
    updatedAt,
    status: "READY_FOR_MEDICAL_REVIEW",
    indexable: false,
  },
];

export function getDoctorAnswer(slug: string) {
  return doctorAnswers.find((answer) => answer.slug === slug);
}

export const approvedConcerns = concerns.filter(
  (concern) =>
    concern.indexable &&
    concern.status === "APPROVED" &&
    (!concern.medicalReviewRequired || Boolean(concern.reviewedBy && concern.reviewedAt)),
);
