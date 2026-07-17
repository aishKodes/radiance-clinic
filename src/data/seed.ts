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

export const clinic: ClinicSettings = {
  name: "Radiance Clinics",
  legalName: "Radiance Clinics, Bhubaneswar",
  city: "Bhubaneswar",
  region: "Odisha",
  address:
    "Radiance Clinics, Bhubaneswar, Odisha, India",
  phone: "+91 99370 00000",
  whatsapp: "919937000000",
  email: "care@radianceclinics.in",
  doctor: "Dr. Satyarth Prakash",
  tagline: "Doctor-led hair, skin, laser and aesthetic care.",
  hours: "Mon-Sat, 10:00 AM-7:00 PM",
  socialLinks: realSocialLinks,
  socialStats: realSocialStats,
  reviewSummary: realReviewSummary,
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Doctor" },
  { href: "/treatments", label: "Treatments" },
  { href: "/conditions", label: "Concerns" },
  { href: "/before-after", label: "Results" },
  { href: "/reviews", label: "Reviews" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/contact", label: "Visit" },
];

export const stats: Stat[] = [
  {
    value: "25,000+",
    label: "Happy Patients",
    description: "A visible trust signal from the current Radiance Clinics presence.",
  },
  {
    value: "20+",
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
];

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
    value: "20+",
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
    title: "Hair Restoration Planning",
    label: "Doctor Explains",
    description:
      "Doctor-led guidance on diagnosis-first hair restoration planning.",
    href: "https://www.youtube.com/",
    thumbnail: radianceMedia.doctorConsultation,
  },
  {
    title: "Skin & Laser Safety",
    label: "Our Videos",
    description:
      "A patient-friendly video space for safety, preparation and aftercare guidance.",
    href: "https://www.youtube.com/",
    thumbnail: radianceMedia.equipmentRoomTwo,
  },
  {
    title: "Acne Scar Consultation",
    label: "Patient Education",
    description:
      "A short-form education slot for recent posts by Dr. Satyarth Prakash.",
    href: "https://www.youtube.com/",
    thumbnail: radianceMedia.doctorProfile,
  },
  {
    title: "Aesthetic Consultation",
    label: "Community",
    description:
      "Videos that explain what happens before aesthetic treatment planning.",
    href: "https://www.youtube.com/",
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
    text: "Photography, facial proportion, skin type or donor-zone evaluation guides the plan.",
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
    "Doctor-led hair restoration, skin, laser and aesthetic care with clinical restraint, proportion-aware planning and safety-first care.",
  authorityPoints: authorityPoints.map((point) => point.label),
};

export const homepageContent: HomepageContent = {
  heroEyebrow: "20+ Years of Excellence | US FDA Approved Technology | Expert Dermatologists",
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
