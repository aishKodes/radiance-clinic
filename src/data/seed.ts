import {
  Activity,
  BadgeCheck,
  Bot,
  Brain,
  CalendarCheck,
  CircleCheck,
  Droplets,
  Gem,
  HeartPulse,
  Microscope,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  WandSparkles,
  Waves,
  Zap,
} from "lucide-react";
import type {
  Article,
  AssistantSettings,
  BeforeAfterCase,
  ClinicSettings,
  Condition,
  DoctorProfile,
  GalleryImage,
  HomepageContent,
  MediaLogo,
  ProofStat,
  ReviewSummary,
  RecognitionItem,
  SocialLink,
  SocialStat,
  Stat,
  Testimonial,
  Treatment,
  Transformation,
  VideoItem,
} from "@/types/cms";
import {
  radianceMedia,
  realBeforeAfterCases,
  realClinicGallery,
  realEquipmentGallery,
  realHeroImages,
  realRecognitionItems,
  realReviewSummary,
  realSocialLinks,
  realSocialStats,
} from "@/data/real-media";
import { beforeAfterCasesToTransformations } from "@/lib/transformations";
import { clinicIdentity } from "@/lib/seo-config";

export const clinic: ClinicSettings = {
  name: clinicIdentity.name,
  legalName: clinicIdentity.legalName,
  city: clinicIdentity.city,
  region: clinicIdentity.region,
  address: clinicIdentity.address,
  phone: clinicIdentity.primaryPhone,
  secondaryPhone: clinicIdentity.secondaryPhone,
  landline: clinicIdentity.landline,
  whatsapp: clinicIdentity.whatsapp,
  email: clinicIdentity.email,
  doctor: clinicIdentity.doctor,
  tagline: "Doctor-led hair, skin, laser and aesthetic care.",
  hours: "",
  socialLinks: realSocialLinks,
  socialStats: realSocialStats,
  reviewSummary: realReviewSummary,
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Doctor" },
  { href: "/treatments", label: "Treatments" },
  { href: "/concerns", label: "Concerns" },
  { href: "/results", label: "Results" },
  { href: "/reviews", label: "Reviews" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/videos", label: "Videos" },
  { href: "/contact", label: "Visit" },
];

export const stats: Stat[] = [
  {
    value: "25,000+",
    label: "Happy Patients",
    description: "A visible trust signal from the current Radiance Clinics presence.",
  },
  {
    value: "30+",
    label: "Years Experience",
    description: "Long-running doctor-led clinical and aesthetic care.",
  },
  {
    value: "YouTube",
    label: "YouTube Community",
    description: "Treatment explainers, patient stories and clinic updates.",
    href: "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l",
    external: true,
    icon: "youtube",
  },
  {
    value: "Bhubaneswar",
    label: "Odisha",
    description: "Premium aesthetic medicine for the city and region.",
  },
];

export const treatments: Treatment[] = [
  {
    slug: "fue-hair-transplant",
    cluster: "hair-restoration",
    clusterLabel: "Hair Restoration",
    title: "FUE Hair Transplant Planning",
    eyebrow: "Hairline design + donor strategy",
    summary:
      "Doctor-led assessment for hairline architecture, graft planning and long-term scalp health.",
    description:
      "A considered restoration pathway that starts with diagnosis, donor-zone analysis and realistic aesthetic planning before any procedure is recommended.",
    duration: "Personalized",
    recovery: "Discussed during consultation",
    idealFor: ["Pattern hair loss", "Hairline recession", "Density concerns"],
    highlights: [
      "Hairline proportion mapping",
      "Donor-area evaluation",
      "Long-term maintenance planning",
    ],
    icon: Activity,
    accent: "bronze",
    image: radianceMedia.doctorConsultation,
  },
  {
    slug: "prp-gfc-scalp-therapy",
    cluster: "hair-restoration",
    clusterLabel: "Hair Restoration",
    title: "PRP / GFC Scalp Therapy",
    eyebrow: "Regenerative scalp support",
    summary:
      "Platelet-derived and growth-factor focused therapies planned around diagnosis and maintenance.",
    description:
      "A non-surgical support option for selected hair-loss patterns, often used as part of a broader scalp and hair preservation plan.",
    duration: "30-60 min",
    recovery: "Minimal downtime",
    idealFor: ["Early thinning", "Maintenance", "Scalp vitality"],
    highlights: [
      "Medical screening first",
      "Protocol-led sessions",
      "Progress reviewed over time",
    ],
    icon: Droplets,
    accent: "aqua",
    image: radianceMedia.doctorCabin,
  },
  {
    slug: "advanced-hair-fall-solutions",
    cluster: "hair-restoration",
    clusterLabel: "Hair Restoration",
    title: "Advanced Hair Fall Solutions",
    eyebrow: "Diagnosis-led hair preservation",
    summary:
      "Scalp, shedding and pattern-loss review before selecting medical, regenerative or procedural pathways.",
    description:
      "A structured consultation for hair fall concerns that reviews triggers, scalp condition, density pattern and realistic maintenance.",
    duration: "Personalized",
    recovery: "Usually no downtime",
    idealFor: ["Hair fall", "Diffuse thinning", "Maintenance planning"],
    highlights: [
      "Trigger and scalp review",
      "Medical and regenerative options discussed",
      "Progress tracking over time",
    ],
    icon: Activity,
    accent: "aqua",
    image: radianceMedia.hairBeforeFront,
  },
  {
    slug: "laser-pigmentation-program",
    cluster: "skin-laser",
    clusterLabel: "Skin & Laser",
    title: "Laser Pigmentation Program",
    eyebrow: "Tone, texture and clarity",
    summary:
      "A calibrated approach for visible pigmentation, uneven tone and photo-damage concerns.",
    description:
      "Laser and topical plans are selected after skin typing, trigger review and tolerance assessment to protect the skin barrier.",
    duration: "20-45 min",
    recovery: "Varies by device",
    idealFor: ["Pigmentation", "Sun spots", "Uneven tone"],
    highlights: [
      "Skin-type calibrated settings",
      "Barrier-first preparation",
      "Maintenance guidance",
    ],
    icon: Zap,
    accent: "aqua",
    image: radianceMedia.equipmentRoomTwo,
  },
  {
    slug: "laser-hair-reduction",
    cluster: "skin-laser",
    clusterLabel: "Skin & Laser",
    title: "Laser Hair Reduction",
    eyebrow: "Device-led hair reduction",
    summary:
      "Skin-type aware laser planning for hair reduction with preparation, spacing and aftercare explained.",
    description:
      "A calibrated laser pathway for suitable patients, with settings, session spacing and pigment-risk considerations discussed before treatment.",
    duration: "15-60 min",
    recovery: "Minimal downtime",
    idealFor: ["Unwanted hair", "Ingrown-hair tendency", "Long-term grooming support"],
    highlights: [
      "Skin-type assessment",
      "Session plan and aftercare guidance",
      "No unsafe permanent-result promises",
    ],
    icon: Zap,
    accent: "coral",
    image: radianceMedia.equipmentRoomOne,
  },
  {
    slug: "acne-scar-revision",
    cluster: "skin-laser",
    clusterLabel: "Skin & Laser",
    title: "Acne Scar Revision",
    eyebrow: "Texture refinement",
    summary:
      "Layered planning for acne marks, textural scars and post-inflammatory changes.",
    description:
      "Scar care may include energy devices, resurfacing, subcision-style planning or topical support based on scar type and skin response.",
    duration: "45-90 min",
    recovery: "Planned by intensity",
    idealFor: ["Acne scars", "Textural unevenness", "Post-acne marks"],
    highlights: [
      "Scar morphology assessment",
      "Phased treatment planning",
      "No one-size-fits-all plans",
    ],
    icon: ScanFace,
    accent: "orchid",
    image: radianceMedia.consultationRoom,
  },
  {
    slug: "injectable-aesthetics",
    cluster: "aesthetic-dermatology",
    clusterLabel: "Aesthetic Dermatology",
    title: "Anti-ageing / Fillers Planning",
    eyebrow: "Subtle proportion work",
    summary:
      "Conservative, facially aware aesthetic planning focused on refinement rather than over-treatment.",
    description:
      "A consultation-led pathway for selected neuromodulator or filler indications with anatomy, movement and proportion at the center.",
    duration: "30-60 min",
    recovery: "Usually brief",
    idealFor: ["Fine lines", "Facial balance", "Volume assessment"],
    highlights: [
      "Natural-expression priority",
      "Anatomy-led mapping",
      "Conservative dose philosophy",
    ],
    icon: Syringe,
    accent: "coral",
    image: radianceMedia.doctorProfile,
  },
  {
    slug: "bridal-glow-protocol",
    cluster: "skin-wellness",
    clusterLabel: "Skin Wellness",
    title: "Event Skin Protocols",
    eyebrow: "Camera-ready, barrier-safe",
    summary:
      "Timed skin programs for weddings, public appearances and milestone events.",
    description:
      "A staged plan for glow, texture, hydration and calmness, created around your event date and skin tolerance.",
    duration: "4-12 week plans",
    recovery: "Low-downtime focus",
    idealFor: ["Events", "Dullness", "Hydration"],
    highlights: [
      "Timeline-based planning",
      "Barrier-respecting treatments",
      "Review-led adjustments",
    ],
    icon: Sparkles,
    accent: "orchid",
    image: radianceMedia.clinicReception,
  },
];

export const conditions: Condition[] = [
  {
    slug: "hair-fall-thinning",
    title: "Hair Fall & Thinning",
    summary:
      "Diagnosis-led pathways for shedding, pattern thinning and scalp health changes.",
    relatedTreatments: ["FUE Hair Transplant Planning", "PRP / GFC Scalp Therapy"],
    signs: ["Widening part", "Receding hairline", "Visible scalp", "Increased shedding"],
    image: radianceMedia.hairBeforeFront,
  },
  {
    slug: "acne-acne-scars",
    title: "Acne & Acne Scars",
    summary:
      "Medical control for active acne with staged texture refinement when skin is ready.",
    relatedTreatments: ["Acne Scar Revision", "Laser Pigmentation Program"],
    signs: ["Breakouts", "Marks", "Pitted scars", "Inflammation"],
    image: radianceMedia.equipmentRoomTwo,
  },
  {
    slug: "pigmentation-melasma",
    title: "Pigmentation & Melasma",
    summary:
      "Trigger-aware treatment planning for stubborn pigmentation and uneven tone.",
    relatedTreatments: ["Laser Pigmentation Program", "Event Skin Protocols"],
    signs: ["Brown patches", "Uneven tone", "Sun sensitivity", "Recurring marks"],
    image: radianceMedia.consultationRoom,
  },
  {
    slug: "skin-ageing-laxity",
    title: "Skin Ageing & Laxity",
    summary:
      "Subtle aesthetic and skin-quality programs designed around facial balance.",
    relatedTreatments: ["Injectable Aesthetic Planning", "Event Skin Protocols"],
    signs: ["Fine lines", "Volume shifts", "Texture change", "Dullness"],
    image: radianceMedia.doctorProfile,
  },
];

export const articles: Article[] = [
  {
    slug: "how-to-plan-hair-restoration",
    title: "How to Think About Hair Restoration Before Booking a Procedure",
    category: "Hair Restoration",
    readTime: "5 min read",
    excerpt:
      "A practical guide to diagnosis, donor planning and realistic expectations before hair restoration.",
    body: [
      "Hair restoration planning should begin with diagnosis, not procedure selection. Pattern, pace, age, donor quality and medical history all influence the right pathway.",
      "A strong plan also includes maintenance. For many patients, non-surgical support and scalp-health review are part of protecting existing hair over time.",
      "The goal is proportion and naturalness. Good hairline planning respects age, facial structure and future density needs.",
    ],
    image: radianceMedia.doctorConsultation,
  },
  {
    slug: "laser-skin-treatments-safety",
    title: "Laser Skin Treatments: What Safety-First Clinics Check",
    category: "Skin & Laser",
    readTime: "4 min read",
    excerpt:
      "Why skin typing, settings, preparation and aftercare matter in laser-based aesthetic medicine.",
    body: [
      "Laser treatments are not interchangeable. Device selection and settings must be calibrated to skin type, pigment risk and treatment goal.",
      "A barrier-first approach reduces unnecessary irritation. Preparation and aftercare are often as important as the session itself.",
      "Good consultations explain what is realistic, what may need staged sessions and when laser should be delayed.",
    ],
    image: radianceMedia.equipmentRoomTwo,
  },
  {
    slug: "premium-aesthetic-consultation",
    title: "What Makes an Aesthetic Consultation Feel Premium and Medical",
    category: "Aesthetic Care",
    readTime: "3 min read",
    excerpt:
      "Premium care is less about excess and more about listening, restraint and precise planning.",
    body: [
      "A premium aesthetic consultation should feel calm, specific and honest. The doctor should understand your goals before recommending treatments.",
      "Restraint matters. The best aesthetic work protects expression, proportion and identity.",
      "Documentation, review points and aftercare make the experience more predictable and more medically grounded.",
    ],
    image: radianceMedia.doctorCabin,
  },
  {
    slug: "best-skin-clinic-bhubaneswar",
    title: "Looking for Expert Skin Care in Bhubaneswar? Where Should You Go?",
    category: "Skin Health",
    readTime: "6 min read",
    excerpt:
      "What to look for in a trusted skin clinic, from assessment and personalised planning to realistic long-term care.",
    body: [
      "Healthy-looking skin often needs more than basic home care. Acne, pigmentation, dullness, uneven texture, scars, signs of ageing and sun damage may need professional evaluation and targeted treatment. A trusted clinic combines experienced guidance, modern procedures and personalised care rather than offering the same package to every patient.",
      "Every person's skin behaves differently. Skin type, lifestyle, environmental exposure, age and existing conditions affect how it responds. A professional consultation can examine the underlying concern before treatment is selected and can reduce trial and error with unsuitable products.",
      "Depending on the skin, a plan may focus on active acne, acne scars, pigmentation, uneven tone, texture, fine lines or sun damage. Chemical peels, laser-based procedures, rejuvenation treatments or supportive facials may be discussed only after skin type, severity, tolerance and goals are considered.",
      "Personalised planning matters more than trends. A useful plan explains preparation, sun protection, aftercare, maintenance and realistic limits. Good skin care is not only a quick cosmetic change; it combines appropriate professional treatment with consistent daily habits.",
      "When comparing skin clinics in Bhubaneswar, look at the consultation process, doctor-led assessment, treatment range, technology, safety guidance and whether the clinic sets honest expectations. Radiance Clinics offers individual consultation pathways for acne, pigmentation, scars, ageing concerns and overall skin quality.",
    ],
    image: radianceMedia.consultationRoom,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    seoTitle: "Expert Skin Care & Skin Clinic in Bhubaneswar | Radiance",
    seoDescription:
      "Learn what makes a trusted skin clinic stand out and how personalised assessment supports acne, pigmentation, scar and skin-quality care.",
    relatedTreatments: ["/skin-clinic-bhubaneswar", "/treatments/skin"],
    relatedConditions: ["/conditions/acne-acne-scars", "/conditions/pigmentation-melasma"],
  },
  {
    slug: "skin-care-doctor-bhubaneswar",
    title: "How Can a Skin Care Doctor in Bhubaneswar Help You Achieve Healthier Skin?",
    category: "Skin Health",
    readTime: "6 min read",
    excerpt:
      "How professional assessment can clarify acne, pigmentation, scars, ageing and persistent skin changes before treatment.",
    body: [
      "Healthy, clear skin is not only about appearance; it also reflects how the skin is protected and cared for. Persistent acne, pigmentation, uneven texture, early ageing, sun damage or recurring irritation often need more than over-the-counter products. Professional assessment can help identify likely causes and avoid unsuitable procedures.",
      "Skin problems that look similar can have different causes. Pigmentation may follow sun exposure, hormonal change, acne or another skin condition. Persistent acne can involve oil, blocked follicles, hormones, friction, stress or medicines. A skin-care doctor examines the pattern and history rather than relying on a label alone.",
      "Treatment options vary with the concern. Acne, scars, uneven tone, sun damage, fine lines, enlarged pores and dull-looking skin may require different combinations of home care, chemical peels, laser-based procedures or rejuvenation treatments. The correct option depends on skin type, medical suitability and the desired degree of change.",
      "Age, sensitivity, medical history, sun exposure, previous procedures and daily products all influence planning. A consultation is also the place to discuss preparation, aftercare and a realistic maintenance routine.",
      "Consider seeking assessment for persistent acne, dark spots, stubborn pigmentation, repeated breakouts, visible scars, premature signs of ageing or texture changes that do not improve with a simple routine. Early review can reduce prolonged product experimentation and help protect the skin barrier.",
      "Radiance Clinics provides consultation-led skin care in Bhubaneswar. Recommendations are made after evaluating the individual concern; no article or online answer can replace that examination.",
    ],
    image: radianceMedia.doctorConsultation,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    seoTitle: "Skin Care Doctor & Skin Specialist in Bhubaneswar | Radiance",
    seoDescription:
      "See how a skin-care doctor can assess acne, pigmentation, scars, ageing and persistent skin changes using personalised planning.",
    relatedTreatments: ["/skin-clinic-bhubaneswar", "/treatments/skin"],
    relatedConditions: ["/conditions/acne-acne-scars", "/conditions/pigmentation-melasma"],
  },
  {
    slug: "hair-loss-causes-and-assessment",
    title: "Hair Loss Causes: What a Proper Assessment Should Check",
    category: "Hair & Scalp",
    readTime: "8 min read",
    excerpt:
      "A practical guide to patterns, triggers, scalp findings and the questions that help separate temporary shedding from progressive hair loss.",
    body: [
      "Hair loss is a description, not a diagnosis. Increased shedding, a widening part, recession at the temples, patchy loss and hair breakage can look similar at first but point to different processes. The useful starting point is to describe what changed, where it changed and how quickly it happened rather than choosing a treatment from a photograph or advertisement.",
      "Timing provides important context. A doctor may ask when shedding began, whether it followed illness, major stress, surgery, childbirth, restrictive dieting, a new medicine or another health change, and whether close relatives have a similar pattern. This history helps distinguish a short-term shedding event from inherited pattern thinning or an inflammatory scalp problem, although examination is still needed.",
      "Pattern matters as much as the number of hairs seen in a comb. Gradual thinning at the crown or hairline can behave differently from diffuse shedding across the scalp. Smooth patches, broken hairs, scaling, pain, redness or scarring deserve prompt assessment because they may require a different work-up and should not be covered with a generic regrowth package.",
      "A scalp and donor-area examination can assess density distribution, shaft variation, miniaturisation, inflammation and the quality of the hair available for long-term planning. When the history suggests a nutritional, hormonal or medical contributor, the doctor may discuss focused tests rather than ordering the same panel for everyone.",
      "Treatment is selected after the likely cause and activity are understood. Depending on the diagnosis, planning may include treating a scalp disorder, correcting a relevant trigger with the appropriate clinician, medical hair-preservation options, platelet-derived support for selected patients, camouflage strategies or transplant assessment. Not every person needs every layer, and transplanted hair does not remove the need to consider future loss of existing hair.",
      "Progress is best judged with consistent photographs, the same lighting and realistic review intervals. Hair cycles are slow, so day-to-day counting can create anxiety without showing whether density is stabilising. A useful plan states what will be measured, when it will be reviewed and what would make the plan change.",
      "Seek earlier evaluation for sudden or patchy loss, scalp pain or inflammation, loss involving eyebrows or eyelashes, visible scarring, or shedding accompanied by other health symptoms. Online guidance can help prepare questions, but it cannot identify the cause from a description alone.",
    ],
    image: radianceMedia.doctorConsultation,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2023-08-13",
    seoTitle: "Hair Loss Causes & Scalp Assessment Guide | Radiance Clinics",
    seoDescription:
      "Understand common hair-loss patterns, triggers, scalp checks and when doctor-led assessment may help before choosing treatment.",
    relatedTreatments: ["/treatments/hair-restoration/advanced-hair-fall-solutions", "/treatments/hair-restoration/prp-gfc-scalp-therapy"],
    relatedConditions: ["/concerns/hair-loss-scalp/hair-loss", "/concerns/hair-loss-scalp/alopecia-areata"],
  },
  {
    slug: "hair-transplant-aftercare",
    title: "Hair Transplant Aftercare: A Practical Recovery Guide",
    category: "Hair Transplant",
    readTime: "8 min read",
    excerpt:
      "How to protect grafts, care for the donor area and understand the recovery questions that should be answered by your surgical team.",
    body: [
      "Hair transplant aftercare begins with the written instructions provided by the operating team. Technique, graft placement, donor management and an individual medical history can change what is appropriate, so a general internet checklist should never override the surgeon's directions or replace contact with the clinic when something feels wrong.",
      "In the early recovery period, the priorities are usually protecting the implanted area from rubbing or pressure, keeping the scalp clean in the instructed way and avoiding unapproved products. Ask the clinic to demonstrate washing, explain sleeping-position advice and clarify when hats or helmets may be used, because vague instructions are difficult to follow at home.",
      "Small crusts, temporary redness and tenderness can occur after a procedure, but the degree and duration vary. Do not pick crusts or try to speed their removal. The donor area also needs attention: excessive rubbing, scratching or self-directed medication can irritate healing skin and make it harder for the team to interpret new symptoms.",
      "Exercise, swimming, sun exposure, travel and return to work should be discussed before the procedure, especially if a job involves heat, dust, a helmet or strenuous activity. Recovery plans are more useful when they fit the patient's actual routine rather than relying on a single fixed timeline for everyone.",
      "Temporary shedding of some transplanted hair shafts may occur while follicles move through their growth cycle. Visible growth is gradual and uneven, and early appearance is not a final result. The clinic should explain expected review points, how photographs will be standardised and when existing non-transplanted hair will be reassessed.",
      "Contact the treating team promptly for worsening pain, spreading redness, increasing swelling, pus-like discharge, persistent bleeding, fever, an allergic-type reaction or any symptom the clinic has asked you to report. Sending a clear photograph may help triage, but urgent symptoms still require direct medical evaluation.",
      "The best time to clarify aftercare is before surgery. Leave the consultation knowing who to contact, what supplies are genuinely needed, which routine medicines have been discussed, what not to apply and how follow-up will work if you live outside Bhubaneswar.",
    ],
    image: radianceMedia.doctorConsultation,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2025-02-15",
    seoTitle: "Hair Transplant Aftercare & Recovery Guide | Radiance Clinics",
    seoDescription:
      "Prepare for hair transplant aftercare with practical guidance on graft protection, washing, activity, follow-up and warning signs.",
    relatedTreatments: ["/treatments/hair-restoration/fue-hair-transplant", "/hair-transplant-bhubaneswar"],
    relatedConditions: ["/concerns/hair-transplant/hair-transplant-suitability"],
  },
  {
    slug: "acne-scar-types-and-treatment-planning",
    title: "Acne Scar Types and Why Treatment Planning Is Layered",
    category: "Acne Scars",
    readTime: "8 min read",
    excerpt:
      "A guide to textural scars, post-acne marks and why different scar patterns may need different treatment combinations.",
    body: [
      "Acne scars are not one uniform condition. Narrow deep pits, broader depressions, rolling tethered areas and raised scars behave differently because the shape and depth of tissue change are different. Brown or red post-acne marks may be very visible but are not the same as a structural indentation, so they should not automatically be treated with the same procedure.",
      "Active acne usually needs to be controlled before an intensive scar programme. Continuing breakouts can create new marks and scars while old ones are being treated. A consultation should therefore review current acne, skin sensitivity, previous medicines and procedures, pigment response, tendency to form raised scars and the amount of downtime a patient can realistically manage.",
      "Lighting and movement help reveal scar morphology. Rolling scars may become more visible when light crosses the face, while narrow pits may need close examination. Standardised photographs create a more honest baseline than heavily processed selfies and make it easier to review gradual change over a series of sessions.",
      "Treatment may be layered because a device that improves one feature may not address another. Depending on the examination, a doctor may discuss resurfacing, microneedling or radiofrequency microneedling, release of selected tethered scars, focal techniques for deep pits, or a plan for residual colour. The sequence, intensity and combination should be chosen for the individual skin type and scar pattern.",
      "No method removes every scar or guarantees completely smooth skin. Improvement is usually gradual, and some scars respond more than others. Risk discussions should include temporary redness and swelling as well as the possibility of prolonged pigment change, irritation, infection or additional scarring, with particular care around skin type and aftercare.",
      "Sun protection, gentle barrier care and following the post-procedure plan matter. Adding acids, scrubs or unapproved actives during recovery can increase irritation without making the treatment work faster. Tell the clinic about important events or travel so the programme can be paced around recovery rather than rushed.",
      "A strong consultation ends with a prioritised plan: which scar type is being targeted first, why that step was chosen, what change is realistic, how response will be measured and when the plan will be reviewed. That is more useful than choosing a procedure only because it is popular online.",
    ],
    image: radianceMedia.equipmentRoomTwo,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2023-08-10",
    seoTitle: "Acne Scar Types & Treatment Planning Guide | Radiance Clinics",
    seoDescription:
      "Learn how acne scar types differ and why resurfacing, microneedling, subcision-style planning and pigment care may be sequenced.",
    relatedTreatments: ["/acne-scar-treatment-bhubaneswar", "/treatments/skin-laser/acne-scar-revision"],
    relatedConditions: ["/concerns/acne-scars/acne-scars", "/concerns/acne/acne"],
  },
  {
    slug: "laser-hair-reduction-expectations",
    title: "Laser Hair Reduction: Sessions, Safety and Realistic Expectations",
    category: "Skin & Laser",
    readTime: "7 min read",
    excerpt:
      "What laser hair reduction can and cannot do, why sessions are spaced and what a skin-type-aware consultation should cover.",
    body: [
      "Laser hair reduction aims to reduce the amount, thickness and rate of regrowth of suitable hair. It should not be presented as guaranteed permanent removal of every hair. Response varies with hair colour and thickness, skin type, body area, hormonal influences, device choice and whether the hair is in a responsive growth phase at the time of treatment.",
      "Multiple sessions are commonly discussed because all follicles are not active together. Session spacing depends on the body area and observed regrowth rather than a universal calendar. Maintenance may be appropriate for some patients, particularly when an underlying hormonal driver continues to influence new growth.",
      "A safety-focused consultation checks skin type, recent tanning or sun exposure, current irritation, previous reactions, medicines and products that may change sensitivity. The clinician should also examine whether the target hair is coarse and pigmented enough to respond; very fine, light or grey hair may respond poorly to commonly used laser wavelengths.",
      "Device parameters should be adjusted to the patient and the area. More energy is not automatically better. A patch test or conservative starting point may be considered when skin response is uncertain, and cooling, eye protection and careful technique are basic parts of a controlled session.",
      "Temporary redness or follicle-centred swelling can occur. Pigment change, burns, blistering or paradoxical hair stimulation are among the risks that should be discussed, particularly when settings, skin preparation or sun exposure are unsuitable. Report an unexpected reaction rather than applying aggressive home remedies.",
      "Preparation and aftercare instructions vary, but they should cover how to manage visible hair between sessions, which products to pause if advised, sun protection and when to contact the clinic. Waxing or plucking can interfere with the hair target, so ask what grooming method the clinic recommends during a course.",
      "The most useful outcome measure is not a promise of zero hair. Compare regrowth density, hair thickness, grooming frequency and skin comfort over time using consistent photographs and follow-up. A review should also consider whether a medical evaluation is appropriate when hair growth changes suddenly or is accompanied by other symptoms.",
    ],
    image: radianceMedia.equipmentRoomOne,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2023-08-09",
    seoTitle: "Laser Hair Reduction Sessions & Safety Guide | Radiance Clinics",
    seoDescription:
      "Understand laser hair reduction sessions, skin-type assessment, likely response, risks, aftercare and realistic maintenance expectations.",
    relatedTreatments: ["/laser-hair-removal-bhubaneswar", "/treatments/skin-laser/laser-hair-reduction"],
    relatedConditions: ["/concerns/laser-hair-reduction/laser-hair-reduction-suitability"],
  },
  {
    slug: "hair-transplant-cost-factors",
    title: "What Affects Hair Transplant Cost? A Planning Checklist",
    category: "Hair Transplant",
    readTime: "7 min read",
    excerpt:
      "The clinical and practical factors behind a hair transplant estimate—and why graft price alone cannot describe the full plan.",
    body: [
      "A hair transplant estimate is meaningful only after the area of loss, donor supply and long-term objective are assessed. A low headline price may exclude important parts of planning or may assume a graft number before the scalp has been examined. A high number is not automatically evidence of a better plan either.",
      "The size and location of the target area influence the amount of work, but density goals must be balanced against donor capacity. Hair calibre, colour contrast, curl, existing miniaturised hair and the design of the hairline affect how visual coverage is created. Two people with a similar-looking hairline may therefore need different strategies.",
      "Technique, surgical-team time, procedure length, anaesthesia planning, consumables and follow-up structure can affect the estimate. Ask what the quotation includes, who performs each stage, how grafts are counted, what happens if the final safe graft number differs from the preliminary estimate and whether review visits are included.",
      "Travel and recovery also belong in the budget. Patients coming from outside Bhubaneswar may need to plan transport, accommodation and time away from work. Choosing a date that allows proper recovery can be more sensible than paying extra for a rushed schedule around an event.",
      "Do not ignore the cost of protecting existing hair. Transplantation redistributes available follicles; it does not stop progressive loss elsewhere. Depending on the diagnosis, long-term follow-up or a hair-preservation plan may be discussed separately, and those commitments should be understood before surgery.",
      "Common costly mistakes include booking before diagnosis, selecting an unrealistic hairline, using donor hair too aggressively, hiding medical information, or assuming a second procedure can always correct the first. Revision work may be limited by scarring and the donor hair already used, which is why the first plan should be conservative and future-aware.",
      "Bring the same checklist to every consultation: diagnosis, target design, estimated graft range, donor limits, who performs the procedure, inclusions, recovery support, long-term maintenance and realistic limits. Compare the quality and transparency of the plan—not only a single price per graft.",
    ],
    image: radianceMedia.doctorConsultation,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2026-01-30",
    seoTitle: "Hair Transplant Cost Factors & Planning Checklist | Radiance",
    seoDescription:
      "See what influences a hair transplant estimate, including donor supply, graft planning, team, follow-up, travel and long-term hair care.",
    relatedTreatments: ["/hair-transplant-bhubaneswar", "/treatments/hair-restoration/fue-hair-transplant"],
    relatedConditions: ["/concerns/hair-transplant/hair-transplant-suitability"],
  },
  {
    slug: "prp-gfc-hair-restoration-guide",
    title: "PRP and GFC for Hair Loss: Questions to Ask Before Treatment",
    category: "Hair & Scalp",
    readTime: "7 min read",
    excerpt:
      "A diagnosis-first guide to platelet-derived scalp therapies, patient selection, session planning and evidence-aware expectations.",
    body: [
      "PRP and growth-factor concentrate, often shortened to GFC, are platelet-derived scalp procedures discussed as supportive options for selected hair-loss patterns. They are not substitutes for identifying why hair is thinning, and they should not be described as a universal cure or a guaranteed way to regrow hair.",
      "The consultation should first clarify whether the pattern is compatible with a treatment that aims to support existing follicles. Progressive pattern thinning may be approached differently from sudden shedding, alopecia areata, active scalp inflammation, scarring hair loss or breakage. When the diagnosis is uncertain, adding procedures can delay more appropriate evaluation.",
      "PRP generally involves preparing a platelet-rich fraction from the patient's blood; GFC systems use a prepared growth-factor-focused product derived from platelets. Processing methods and protocols vary, so broad comparisons based only on the label can be misleading. Ask which system is used, why it is being proposed and how sterility and handling are controlled.",
      "Patient selection includes medical history, scalp condition, current medicines and factors that may affect blood collection or healing. Disclose relevant illness, pregnancy, bleeding history, allergies and all medicines or supplements. The treating doctor decides whether a procedure is appropriate and whether any additional assessment is needed.",
      "A plan should state the proposed session schedule, how response will be measured and what other treatment is being continued. Standardised photographs and repeat scalp assessment are more reliable than judging a few days after an injection. Because hair growth cycles are slow, expectations should be set over meaningful review intervals.",
      "Temporary discomfort, tenderness, swelling, bruising or headache can occur, and any injection procedure carries risks such as infection or an unexpected reaction. The clinic should explain preparation, aftercare, when to resume hair products and which symptoms require contact. Never stop prescribed medication only because an online article suggests doing so.",
      "Ask the practical questions before committing: What is the diagnosis? What outcome is realistic for this pattern? Is the goal reduced shedding, improved calibre or maintenance? How many reviews are built into the plan? What would make the doctor stop or change the protocol? Clear answers are more valuable than package-based promises.",
    ],
    image: radianceMedia.doctorCabin,
    authorName: "Radiance Clinics Content Team",
    publishedAt: "2025-10-31",
    seoTitle: "PRP & GFC Hair Treatment Questions | Radiance Clinics",
    seoDescription:
      "Learn how PRP and GFC scalp therapies are assessed, what the procedures involve, likely limitations, risks and questions to ask.",
    relatedTreatments: ["/treatments/hair-restoration/prp-gfc-scalp-therapy", "/treatments/hair-restoration/advanced-hair-fall-solutions"],
    relatedConditions: ["/concerns/hair-loss-scalp/hair-loss"],
  },
].map((article) => ({
  ...article,
  reviewedBy: "Dr. Satyarth Prakash",
  reviewedAt: "2026-08-15",
  updatedAt: article.updatedAt || "2026-08-15",
}));

export const testimonials: Testimonial[] = [
  {
    name: "Patient, Bhubaneswar",
    context: "Skin consultation",
    quote:
      "The consultation felt detailed and calm. I liked that the plan started with skin health instead of pushing a package.",
  },
  {
    name: "Patient, Odisha",
    context: "Hair assessment",
    quote:
      "The hairline discussion was very realistic. I understood what could be planned and what should be maintained over time.",
  },
  {
    name: "Patient, Bhubaneswar",
    context: "Laser program",
    quote:
      "The clinic experience felt premium without feeling intimidating. Every step and aftercare point was explained clearly.",
  },
];

export const beforeAfterCases: BeforeAfterCase[] = realBeforeAfterCases;

const allTransformations = beforeAfterCasesToTransformations(beforeAfterCases);

export const hairTransformations: Transformation[] = allTransformations.filter(
  (item) => item.category === "hair",
);

export const skinTransformations: Transformation[] = allTransformations.filter(
  (item) => item.category === "skin",
);

export const proofStats: ProofStat[] = [
  {
    eyebrow: "Patients",
    value: "25,000+",
    label: "Happy patients",
    description:
      "Patients visit Radiance for hair, skin, laser and aesthetic concerns.",
  },
  {
    eyebrow: "Experience",
    value: "30+",
    label: "Years of experience",
    description:
      "Long-running doctor-led aesthetic, hair and skin care experience.",
  },
  {
    eyebrow: "Recognition",
    value: "2025",
    label: "Best Business badge",
    description:
      "ThreeBestRated recognition, shown as a clinic milestone.",
  },
  {
    eyebrow: "Location",
    value: "BBSR",
    label: "Bhubaneswar, Odisha",
    description:
      "A premium clinic experience for patients across the city and region.",
  },
];

export const treatmentUniverse = [
  {
    title: "Hair Restoration",
    text: "Hairline design, scalp assessment and long-range density planning.",
    href: "/treatments/hair-restoration/fue-hair-transplant",
    accent: "bronze" as const,
  },
  {
    title: "Hair Transplant",
    text: "FUE planning with donor-zone review and realistic suitability checks.",
    href: "/treatments/hair-restoration/fue-hair-transplant",
    accent: "aqua" as const,
  },
  {
    title: "Hair Fall Solutions",
    text: "Medical and regenerative pathways for shedding, thinning and maintenance.",
    href: "/treatments/hair-restoration/advanced-hair-fall-solutions",
    accent: "orchid" as const,
  },
  {
    title: "Skin & Laser",
    text: "Laser plans selected around skin type, barrier health and downtime.",
    href: "/treatments/skin-laser/laser-pigmentation-program",
    accent: "coral" as const,
  },
  {
    title: "Pigmentation",
    text: "Trigger-aware plans for uneven tone, melasma tendency and photo-damage.",
    href: "/treatments/skin-laser/laser-pigmentation-program",
    accent: "aqua" as const,
  },
  {
    title: "Acne / Acne Scars",
    text: "Active acne control and staged scar-texture refinement.",
    href: "/treatments/skin-laser/acne-scar-revision",
    accent: "orchid" as const,
  },
  {
    title: "Anti-ageing / Fillers",
    text: "Conservative facial balance planning with anatomy and restraint.",
    href: "/treatments/aesthetic-dermatology/injectable-aesthetics",
    accent: "bronze" as const,
  },
];

export const videoItems: VideoItem[] = [
  {
    title: "The Complete Hair Transplant Guide",
    label: "Featured Guide",
    description:
      "A detailed Radiance Clinics video guide to hair transplant planning, the procedure, recovery and expectations.",
    youtubeId: "8qYMw935MF8",
    href: "https://youtu.be/8qYMw935MF8?si=usENtf9ygZmREo0R",
    thumbnail: radianceMedia.doctorConsultation,
  },
  {
    title: "Skin & Laser Safety",
    label: "Our Videos",
    description:
      "A patient-friendly video space for safety, preparation and aftercare guidance.",
    href: "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l",
    thumbnail: radianceMedia.equipmentRoomTwo,
  },
  {
    title: "Acne Scar Consultation",
    label: "Patient Education",
    description:
      "Doctor-led guidance on consultation, treatment selection and realistic expectations.",
    href: "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l",
    thumbnail: radianceMedia.doctorProfile,
  },
  {
    title: "Aesthetic Consultation",
    label: "Community",
    description:
      "Videos explaining assessment, planning and aftercare for aesthetic treatments.",
    href: "https://youtube.com/@radianceclinics?si=MwbMHVfdlLk2C95l",
    thumbnail: radianceMedia.clinicReception,
  },
];

export const galleryImages: GalleryImage[] = realClinicGallery;

export const equipmentGalleryImages: GalleryImage[] = realEquipmentGallery;

export const recognitionItems: RecognitionItem[] = realRecognitionItems;

export const mediaLogos: MediaLogo[] = [
  {
    title: "Best Business 2025",
    label: "Recognition",
    image: radianceMedia.badge2025,
  },
  { title: "Radiance Videos", label: "Video community" },
  { title: "Doctor Authored", label: "Recent posts" },
  { title: "Consultation First", label: "Patient education" },
];

export const socialLinks: SocialLink[] = realSocialLinks;
export const socialStats: SocialStat[] = realSocialStats;
export const reviewSummary: ReviewSummary = realReviewSummary;

export const whyChoose = [
  {
    title: "Advanced equipment, carefully selected",
    text: "Technology is positioned as a tool inside diagnosis-led planning, not as a one-size-fits-all promise.",
  },
  {
    title: "Personalized consultation",
    text: "Skin type, scalp pattern, goals, timing and downtime are discussed before building a plan.",
  },
  {
    title: "Patient-first care",
    text: "The experience is designed around clarity, consent, aftercare and realistic expectations.",
  },
  {
    title: "Same-day procedure pathways",
    text: "Where medically suitable, the clinic can guide efficient consultation-to-procedure planning.",
  },
];

export const assistantSettings: AssistantSettings = {
  title: "Radiance AI Assistant",
  intro:
    "Ask about treatments or request a consultation.",
  disclaimer:
    "This assistant can help with services, appointments, and general guidance. It does not provide medical advice or diagnosis.",
  quickPrompts: [
    "Hair transplant",
    "Book consultation",
  ],
};

export const patientJourney = [
  {
    title: "Doctor Consultation",
    text: "Your goals, medical history, skin or scalp condition and timing are reviewed before treatment planning.",
    icon: Stethoscope,
  },
  {
    title: "Precision Mapping",
    text: "Clinical imaging, facial proportion, skin type or donor-zone evaluation guides the plan.",
    icon: Microscope,
  },
  {
    title: "Treatment Plan",
    text: "A phased plan is explained with preparation, downtime, review dates and maintenance.",
    icon: CalendarCheck,
  },
  {
    title: "Review & Maintenance",
    text: "Progress is reviewed honestly so the plan can be adjusted with restraint and care.",
    icon: ShieldCheck,
  },
];

export const authorityPoints = [
  { label: "Doctor-led care", icon: BadgeCheck },
  { label: "Aesthetic restraint", icon: Gem },
  { label: "Medical diagnosis first", icon: Brain },
  { label: "Modern treatment planning", icon: Bot },
  { label: "Skin-barrier aware", icon: HeartPulse },
  { label: "Evidence-informed care", icon: CircleCheck },
];

export const faqs = [
  {
    question: "Do I need a consultation before booking a procedure?",
    answer:
      "Yes. Radiance Clinics prioritizes doctor-led assessment before recommending hair, skin, laser or injectable treatments.",
  },
  {
    question: "Can I see before-and-after photographs?",
    answer:
      "Appropriate case documentation can be discussed during consultation with consent and context. The website avoids unsupported result claims.",
  },
  {
    question: "Are treatments customized?",
    answer:
      "Yes. Plans are selected after reviewing concerns, medical history, skin or scalp type, expectations, downtime and maintenance.",
  },
];

export const doctorProfile: DoctorProfile = {
  name: clinic.doctor,
  role: "Founder and lead doctor, Radiance Clinics",
  shortBio:
    "More than 30 years of doctor-led hair restoration, skin, laser and aesthetic care with clinical restraint, proportion-aware planning and safety-first care.",
  authorityPoints: authorityPoints.map((point) => point.label),
};

export const homepageContent: HomepageContent = {
  heroEyebrow: "30+ Years of Clinical Experience | US FDA Approved Technology | Doctor-Led Care",
  heroTitle: "Advanced Skin, Hair & Aesthetic Clinic",
  heroSubtitle:
    "Doctor-led hair transplant, skin, laser and aesthetic treatments by Dr. Satyarth Prakash at Radiance Clinics, Bhubaneswar.",
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "WhatsApp", href: `https://wa.me/${clinic.whatsapp}` },
  assistantTeaser: {
    label: "Chat Now",
    text: "Ask about treatments or request a consultation.",
  },
  heroImages: [
    ...realHeroImages,
  ],
  stats,
  proofStats,
  whyChoose,
  journey: patientJourney,
  faqs,
};

export const signatureVisuals = [
  { label: "FUE", icon: Waves },
  { label: "Laser", icon: Zap },
  { label: "Skin", icon: WandSparkles },
  { label: "Scalp", icon: Droplets },
];
