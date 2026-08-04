export type LocalSeoPage = {
  slug: string;
  serviceName: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  heroDescription: string;
  image: string;
  imageAlt: string;
  introductionTitle: string;
  introduction: string[];
  assessmentTitle: string;
  assessmentDescription: string;
  assessmentPoints: string[];
  approachTitle: string;
  approachDescription: string;
  approachPoints: string[];
  expectations: { title: string; text: string }[];
  relatedLinks: { href: string; label: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

const mediaBase = "/radiance-media-processed/landscape";

export const localSeoPages: LocalSeoPage[] = [
  {
    slug: "hair-transplant-bhubaneswar",
    serviceName: "Hair Transplant",
    metaTitle: "Hair Transplant in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Plan a doctor-led FUE hair transplant in Bhubaneswar with donor-area assessment, hairline design and realistic restoration guidance at Radiance Clinics.",
    eyebrow: "Doctor-led hair restoration",
    title: "Hair Transplant in Bhubaneswar",
    heroDescription:
      "A considered approach to FUE hair transplant planning with Dr. Satyarth Prakash, focused on diagnosis, donor preservation and a natural-looking hairline.",
    image: `${mediaBase}/radiance-hair-transplant-service.webp`,
    imageAlt:
      "Hair transplant consultation and restoration planning at Radiance Clinics Bhubaneswar",
    introductionTitle:
      "A hair transplant plan should begin with the donor area, not a graft number.",
    introduction: [
      "Hair loss can have different causes, timelines and patterns. A consultation at Radiance Clinics begins by reviewing the scalp, the stability of hair loss, the available donor area and the areas where restoration may be useful.",
      "Not every person with hair fall needs surgery. Medical or regenerative support may be more appropriate when shedding is active, thinning is early or donor reserves should be protected for the future.",
    ],
    assessmentTitle: "What the hair transplant consultation evaluates",
    assessmentDescription:
      "The purpose of the assessment is to decide whether surgery is suitable and how to plan it responsibly.",
    assessmentPoints: [
      "Pattern, progression and likely stability of hair loss",
      "Donor density, scalp condition and hair characteristics",
      "Hairline proportion in relation to age and facial structure",
      "Medical history, previous treatment and current medication",
      "Long-term preservation of existing and donor hair",
      "Expected coverage, density limits and aftercare requirements",
    ],
    approachTitle: "Natural-looking restoration is planned over the long term",
    approachDescription:
      "FUE planning considers how each graft is used, where density matters most and how the result may age with the patient. The final plan is confirmed only after an in-person review.",
    approachPoints: [
      "Hairline design based on facial proportion",
      "Conservative donor harvesting strategy",
      "Graft distribution for visible coverage",
      "Clear preparation and post-procedure guidance",
    ],
    expectations: [
      {
        title: "Consultation",
        text: "The doctor reviews hair loss, scalp health, donor capacity and previous treatment before discussing options.",
      },
      {
        title: "Individual plan",
        text: "Hairline design, estimated graft needs, procedure stages and realistic limitations are explained for the individual patient.",
      },
      {
        title: "Follow-up",
        text: "Recovery, shedding phases, growth timelines and maintenance of existing hair are reviewed after the procedure.",
      },
    ],
    relatedLinks: [
      {
        href: "/treatments/hair-restoration/fue-hair-transplant",
        label: "FUE hair transplant planning",
        description:
          "Read about donor strategy, hairline planning and suitability.",
      },
      {
        href: "/conditions/hair-fall-thinning",
        label: "Hair fall and thinning",
        description:
          "Understand common signs and diagnosis-led treatment pathways.",
      },
      {
        href: "/before-after",
        label: "Hair restoration examples",
        description:
          "Review consent-led examples with realistic clinical context.",
      },
    ],
    faqs: [
      {
        question: "How is hair transplant suitability assessed?",
        answer:
          "Suitability depends on the cause and stability of hair loss, donor-area quality, scalp health, age, medical history and realistic coverage goals. These factors require an individual examination.",
      },
      {
        question: "Does FUE leave a linear scar?",
        answer:
          "FUE removes follicular units individually rather than creating a linear donor strip. Small extraction marks can still occur, and healing varies between patients.",
      },
      {
        question: "When does transplanted hair begin to grow?",
        answer:
          "Early shedding is common after a transplant. New growth usually develops gradually over several months, with timing and density varying by individual biology and treatment plan.",
      },
      {
        question: "Can a hair transplant guarantee a particular density?",
        answer:
          "No. Achievable coverage depends on donor supply, hair characteristics, the size of the area and future hair loss. The consultation should establish realistic expectations before treatment.",
      },
    ],
  },
  {
    slug: "skin-clinic-bhubaneswar",
    serviceName: "Skin Consultation",
    metaTitle: "Skin Clinic in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Visit Radiance Clinics for doctor-led skin consultation in Bhubaneswar for acne, scars, pigmentation, ageing, texture and laser treatment planning.",
    eyebrow: "Skin, laser and aesthetic care",
    title: "Skin Clinic in Bhubaneswar",
    heroDescription:
      "Doctor-led consultation for acne, scars, pigmentation, skin texture, ageing concerns and laser suitability at Radiance Clinics.",
    image: `${mediaBase}/radiance-skin-category.webp`,
    imageAlt: "Doctor-led skin consultation at Radiance Clinics in Bhubaneswar",
    introductionTitle:
      "Skin treatment works best when the concern and skin type are understood first.",
    introduction: [
      "A visible skin concern may be influenced by inflammation, sun exposure, hormones, products, medication or the skin barrier. Radiance Clinics begins with a clinical review before recommending a procedure or device.",
      "The treatment plan may combine home care, medical treatment, procedures or laser sessions. The sequence is selected around the active concern, skin tolerance, downtime and the patient's priorities.",
    ],
    assessmentTitle: "What happens during a skin consultation",
    assessmentDescription:
      "A structured assessment helps separate the main concern from factors that may trigger or maintain it.",
    assessmentPoints: [
      "Current concern, duration and previous treatment",
      "Skin type, sensitivity and barrier condition",
      "Acne activity, scar type or pigmentation pattern",
      "Sun exposure, products and relevant lifestyle factors",
      "Suitability for peels, devices, lasers or injectables",
      "Downtime preferences and a practical maintenance plan",
    ],
    approachTitle: "A treatment sequence designed around the skin",
    approachDescription:
      "Active inflammation or irritation may need control before texture or pigmentation procedures begin. Staged planning helps the doctor review response and adjust intensity safely.",
    approachPoints: [
      "Diagnosis before procedure selection",
      "Skin-type aware device settings",
      "Barrier support and aftercare guidance",
      "Review-based changes to the treatment plan",
    ],
    expectations: [
      {
        title: "Listen",
        text: "The consultation begins with the concern, previous experience, sensitivities and the result the patient is hoping to achieve.",
      },
      {
        title: "Assess",
        text: "The doctor examines the skin and explains which factors may need treatment first.",
      },
      {
        title: "Plan",
        text: "Suitable options, session spacing, home care, downtime and review points are discussed clearly.",
      },
    ],
    relatedLinks: [
      {
        href: "/acne-scar-treatment-bhubaneswar",
        label: "Acne scar treatment",
        description:
          "Learn how different scar patterns are assessed and treated.",
      },
      {
        href: "/pigmentation-treatment-bhubaneswar",
        label: "Pigmentation treatment",
        description: "Explore diagnosis-led care for melasma and uneven tone.",
      },
      {
        href: "/treatments",
        label: "All skin and laser treatments",
        description:
          "Compare treatment pathways available at Radiance Clinics.",
      },
    ],
    faqs: [
      {
        question: "Which skin concerns can be discussed at Radiance Clinics?",
        answer:
          "Patients commonly consult for acne, acne scars, pigmentation, melasma, redness, enlarged pores, uneven texture, hair concerns and signs of skin ageing. A diagnosis is made during consultation.",
      },
      {
        question: "Will treatment be recommended at the first visit?",
        answer:
          "The doctor may recommend home care, medication, a procedure, further review or a combination. Some concerns need inflammation or barrier health to improve before procedures begin.",
      },
      {
        question: "Are laser treatments suitable for every skin type?",
        answer:
          "Suitability and settings depend on skin type, the concern, recent sun exposure and pigment risk. An assessment and appropriate preparation are important before laser treatment.",
      },
      {
        question: "How many skin treatment sessions are needed?",
        answer:
          "The number and spacing of sessions vary with the diagnosis, treatment type, response and maintenance needs. A session plan is discussed after assessment rather than promised in advance.",
      },
    ],
  },
  {
    slug: "laser-hair-removal-bhubaneswar",
    serviceName: "Laser Hair Reduction",
    metaTitle: "Laser Hair Removal in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Doctor-supervised laser hair reduction in Bhubaneswar with skin-type assessment, calibrated settings and aftercare guidance at Radiance Clinics.",
    eyebrow: "Skin-type aware laser care",
    title: "Laser Hair Removal in Bhubaneswar",
    heroDescription:
      "A doctor-supervised laser hair reduction plan with appropriate settings, session spacing and practical aftercare for suitable skin and hair types.",
    image: `${mediaBase}/radiance-laser-hair-removal-service.webp`,
    imageAlt:
      "Laser hair reduction treatment planning at Radiance Clinics Bhubaneswar",
    introductionTitle:
      "Laser hair reduction should be calibrated for the skin, hair and treatment area.",
    introduction: [
      "Laser treatment targets pigment in the hair follicle. Hair colour, thickness, skin type, recent tanning and the treatment area all influence the choice of settings and the likely response.",
      "Because hair grows in cycles, treatment is planned as a series of appropriately spaced sessions. The aim is progressive reduction, not an unrealistic promise that every hair will disappear permanently.",
    ],
    assessmentTitle: "What is checked before laser hair reduction",
    assessmentDescription:
      "The consultation and patch-test process help identify suitable settings and reduce avoidable irritation or pigment changes.",
    assessmentPoints: [
      "Skin type, tanning and recent sun exposure",
      "Hair colour, thickness and density",
      "Treatment area and history of irritation or ingrown hair",
      "Medication, hormonal concerns and relevant medical history",
      "Previous waxing, threading or laser sessions",
      "Preparation, session spacing and aftercare requirements",
    ],
    approachTitle: "Progressive reduction with review between sessions",
    approachDescription:
      "Settings can be adjusted as hair becomes finer and the skin response is observed. Consistent spacing and avoiding hair removal from the root help the treatment work as intended.",
    approachPoints: [
      "Skin and hair assessment before treatment",
      "Patch testing when clinically appropriate",
      "Calibrated energy and cooling measures",
      "Clear sun protection and aftercare advice",
    ],
    expectations: [
      {
        title: "Preparation",
        text: "Patients are guided on shaving, sun exposure, products and medicines that may affect the session.",
      },
      {
        title: "Treatment",
        text: "The area is treated with settings selected for the skin and hair profile, with comfort and skin response monitored.",
      },
      {
        title: "Review",
        text: "Hair reduction and skin response are reviewed before the next session and settings are adjusted where appropriate.",
      },
    ],
    relatedLinks: [
      {
        href: "/treatments/skin-laser/laser-hair-reduction",
        label: "Laser hair reduction treatment",
        description:
          "Review suitability, session planning and treatment highlights.",
      },
      {
        href: "/skin-clinic-bhubaneswar",
        label: "Skin clinic consultation",
        description:
          "Discuss sensitivity, ingrown hair and other skin concerns.",
      },
      {
        href: "/contact",
        label: "Book a consultation",
        description: "Contact Radiance Clinics for treatment-area guidance.",
      },
    ],
    faqs: [
      {
        question: "Is laser hair removal permanent?",
        answer:
          "The medically accurate term is laser hair reduction. Many patients see a lasting reduction after a course of sessions, but maintenance may be needed and response varies by hair, skin and hormonal factors.",
      },
      {
        question: "How many laser hair reduction sessions are usually planned?",
        answer:
          "Multiple sessions are usually required because hairs are treated during different growth cycles. The number and interval depend on the area, hair pattern and individual response.",
      },
      {
        question: "Can laser hair reduction be used on darker skin tones?",
        answer:
          "It may be suitable when the device and settings are selected carefully for the skin type. Assessment, sun-exposure history and experienced supervision are important for pigment safety.",
      },
      {
        question: "Should hair be waxed before a laser session?",
        answer:
          "Waxing, threading and epilation remove the follicular target and are usually avoided before treatment. The clinic will provide area-specific shaving and preparation instructions.",
      },
    ],
  },
  {
    slug: "acne-scar-treatment-bhubaneswar",
    serviceName: "Acne Scar Treatment",
    metaTitle: "Acne Scar Treatment in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Doctor-led acne scar treatment in Bhubaneswar with scar-type assessment and staged options for texture, marks and active acne at Radiance Clinics.",
    eyebrow: "Scar-type led treatment planning",
    title: "Acne Scar Treatment in Bhubaneswar",
    heroDescription:
      "Individual assessment for active acne, post-acne marks and textural scars, followed by a staged treatment plan suited to the scar pattern and skin type.",
    image: `${mediaBase}/radiance-acne-scar-service.webp`,
    imageAlt:
      "Acne scar assessment and treatment consultation at Radiance Clinics Bhubaneswar",
    introductionTitle:
      "Acne marks and acne scars are different concerns and often need different treatment.",
    introduction: [
      "Flat red or brown marks can improve differently from indented or raised scars. Textural scars may also include several patterns on the same face, which is why a single procedure is not always the best approach.",
      "Active acne is usually brought under control before intensive scar procedures. This reduces the risk of new scars developing while the existing texture is being treated.",
    ],
    assessmentTitle: "How acne scars are assessed",
    assessmentDescription:
      "The doctor examines scar depth, shape, location and skin response before discussing a combination or staged plan.",
    assessmentPoints: [
      "Whether acne is active, controlled or recurring",
      "Ice-pick, rolling, boxcar, raised or mixed scar patterns",
      "Post-inflammatory redness or pigmentation",
      "Skin type, sensitivity and tendency to form dark marks",
      "Previous procedures, medication and healing response",
      "Acceptable downtime and realistic improvement goals",
    ],
    approachTitle: "Different scar layers may need different methods",
    approachDescription:
      "Depending on the assessment, the plan may include resurfacing, microneedling-based treatment, radiofrequency, targeted techniques, peels or medical skin care. Recommendations are individualized.",
    approachPoints: [
      "Control active acne before scar revision",
      "Match the procedure to scar morphology",
      "Plan intensity around skin type and downtime",
      "Review texture and pigmentation between stages",
    ],
    expectations: [
      {
        title: "Scar mapping",
        text: "The consultation identifies the dominant scar types and separates texture concerns from active acne and pigmentation.",
      },
      {
        title: "Staged sessions",
        text: "Treatment may be sequenced so deeper scars, surface texture and marks can be addressed appropriately.",
      },
      {
        title: "Skin recovery",
        text: "Aftercare, sun protection and review appointments help guide healing and the timing of the next stage.",
      },
    ],
    relatedLinks: [
      {
        href: "/treatments/skin-laser/acne-scar-revision",
        label: "Acne scar revision",
        description: "Read about staged treatment planning for scar texture.",
      },
      {
        href: "/conditions/acne-acne-scars",
        label: "Acne and acne scars",
        description: "Understand common signs and related treatment pathways.",
      },
      {
        href: "/before-after",
        label: "Skin improvement examples",
        description:
          "View consent-led examples with individual-result context.",
      },
    ],
    faqs: [
      {
        question: "Can acne scars be removed completely?",
        answer:
          "Complete removal cannot be guaranteed. Treatment aims to improve the visibility and texture of scars, with the degree of improvement depending on scar type, depth, skin response and the chosen plan.",
      },
      {
        question: "Which treatment is best for acne scars?",
        answer:
          "There is no single best procedure for every scar. Rolling, boxcar, ice-pick and raised scars respond differently, and mixed patterns often need a combination or staged approach.",
      },
      {
        question: "Should active acne be treated before acne scars?",
        answer:
          "Usually, active breakouts should be controlled before intensive scar treatment so that new scars are less likely to form during the revision process.",
      },
      {
        question: "Is there downtime after acne scar treatment?",
        answer:
          "Downtime varies by procedure and intensity. Redness, swelling, dryness or temporary darkening may occur. The clinic explains expected recovery and aftercare before treatment.",
      },
    ],
  },
  {
    slug: "pigmentation-treatment-bhubaneswar",
    serviceName: "Pigmentation Treatment",
    metaTitle: "Pigmentation Treatment in Bhubaneswar | Radiance Clinics",
    metaDescription:
      "Doctor-led pigmentation and melasma treatment in Bhubaneswar with trigger review, skin-type assessment and barrier-aware care at Radiance Clinics.",
    eyebrow: "Pigmentation and melasma care",
    title: "Pigmentation Treatment in Bhubaneswar",
    heroDescription:
      "A diagnosis-led plan for melasma, post-acne marks, sun-related pigmentation and uneven tone, with attention to skin type and recurrence risk.",
    image: `${mediaBase}/radiance-pigmentation-melasma-service.webp`,
    imageAlt:
      "Pigmentation and melasma consultation at Radiance Clinics Bhubaneswar",
    introductionTitle:
      "Pigmentation treatment depends on why the pigment appeared and how the skin responds.",
    introduction: [
      "Melasma, sun spots and post-inflammatory marks can look similar but behave differently. Hormones, heat, ultraviolet exposure, inflammation and unsuitable products may all contribute to recurring pigment.",
      "The plan may include sun protection, topical treatment, peels, laser or other procedures. Strong treatment is not always better, especially when the skin barrier is irritated or the pigment is prone to rebound.",
    ],
    assessmentTitle: "What the pigmentation consultation considers",
    assessmentDescription:
      "Identifying the pigment pattern and possible triggers helps the doctor choose a safer sequence of treatment.",
    assessmentPoints: [
      "Location, depth and pattern of visible pigmentation",
      "Melasma, sun-related change or post-inflammatory marks",
      "Skin type, sensitivity and barrier condition",
      "Hormonal, medical and medication history where relevant",
      "Sun, heat and product-related triggers",
      "Previous peels, lasers and the skin's response",
    ],
    approachTitle: "Control triggers while treating visible pigment",
    approachDescription:
      "Pigmentation care often needs both correction and maintenance. The plan is reviewed over time because response, tolerance and recurrence vary between patients.",
    approachPoints: [
      "Daily photoprotection and trigger reduction",
      "Barrier support before intensive procedures",
      "Skin-type aware peels or device settings",
      "Maintenance planning for recurring conditions",
    ],
    expectations: [
      {
        title: "Diagnosis",
        text: "The doctor distinguishes the likely pigment pattern and checks for inflammation, sensitivity and relevant triggers.",
      },
      {
        title: "Correction",
        text: "Home care and procedures are selected according to pigment depth, skin type and tolerance rather than a fixed package.",
      },
      {
        title: "Maintenance",
        text: "Sun protection, trigger management and periodic review help support the result after visible improvement.",
      },
    ],
    relatedLinks: [
      {
        href: "/treatments/skin-laser/laser-pigmentation-program",
        label: "Laser pigmentation program",
        description:
          "Review the clinic's calibrated pigmentation treatment pathway.",
      },
      {
        href: "/conditions/pigmentation-melasma",
        label: "Pigmentation and melasma",
        description: "Learn about common signs and related treatment options.",
      },
      {
        href: "/skin-clinic-bhubaneswar",
        label: "Skin clinic consultation",
        description: "Discuss skin sensitivity, acne marks and other concerns.",
      },
    ],
    faqs: [
      {
        question: "Is melasma the same as other pigmentation?",
        answer:
          "No. Melasma is a recurring pigment condition influenced by factors such as hormones, light and heat. Sun spots and post-acne marks have different causes and may need different treatment plans.",
      },
      {
        question: "Can laser make pigmentation worse?",
        answer:
          "Unsuitable settings, recent tanning, inflammation or inadequate aftercare can increase pigment risk. Laser should be selected only after skin-type assessment and may not be the first option for every patient.",
      },
      {
        question: "How long does pigmentation treatment take?",
        answer:
          "Improvement is usually gradual. Timing depends on the diagnosis, pigment depth, triggers, treatment tolerance and consistency with sun protection and home care.",
      },
      {
        question: "Can pigmentation return after treatment?",
        answer:
          "Some forms, especially melasma and post-inflammatory pigmentation, can recur. Maintenance, sun protection and management of triggers remain important after improvement.",
      },
    ],
  },
];

export const localSeoPageBySlug = new Map(
  localSeoPages.map((page) => [page.slug, page]),
);

export const localLandingByTreatmentSlug: Record<string, string> = {
  "fue-hair-transplant": "/hair-transplant-bhubaneswar",
  "laser-hair-reduction": "/laser-hair-removal-bhubaneswar",
  "acne-scar-revision": "/acne-scar-treatment-bhubaneswar",
  "laser-pigmentation-program": "/pigmentation-treatment-bhubaneswar",
};
