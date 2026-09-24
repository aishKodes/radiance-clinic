import { youtubeVideos } from "@/data/youtube-library.generated";
import type { YouTubeVideo } from "@/types/video-library";

export type VideoWatchPage = {
  slug: string;
  pageTitle: string;
  pageDescription: string;
  summary: string;
  keyQuestions: string[];
  relatedTreatment: { href: string; label: string };
  relatedGuide: { href: string; label: string };
  relatedAnswer: { href: string; label: string };
  video: YouTubeVideo;
};

type VideoWatchPageDefinition = Omit<VideoWatchPage, "video"> & {
  videoId: string;
};

// These pages are intentionally selected from the verified official library.
// They are education-first videos with a clear patient question, not a bulk
// mirror of every channel upload.
const hairVideoWatchPageDefinitions: VideoWatchPageDefinition[] = [
  {
    slug: "hair-transplant-costs-and-clinic-choice",
    videoId: "sBVuXKjqcmM",
    pageTitle: "Hair Transplant Cost and Clinic Choice: Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on the questions to ask when comparing hair transplant cost, planning and clinic standards.",
    summary: "This video discusses why a hair transplant decision should consider planning, technique, donor management and follow-up rather than a quoted price alone.",
    keyQuestions: ["What should a hair transplant estimate include?", "Why can graft number and cost vary between plans?", "What should be discussed before choosing a clinic?"],
    relatedTreatment: { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-transplant-cost-factors", label: "Hair transplant cost factors guide" },
    relatedAnswer: { href: "/doctor-answers/how-many-grafts-receding-hairline", label: "How graft planning is assessed" },
  },
  {
    slug: "hair-transplant-aftercare-day-by-day",
    videoId: "PhbvumkbZBs",
    pageTitle: "Hair Transplant Aftercare: Day-by-Day Video Guide",
    pageDescription: "Watch an official Radiance Clinics hair transplant aftercare video covering recovery questions and practical points to clarify with the treating team.",
    summary: "This video covers the recovery questions patients commonly raise after a hair transplant, including caring for the scalp and knowing when to contact the treating team.",
    keyQuestions: ["What aftercare instructions should be clarified before surgery?", "How should the scalp be protected during early recovery?", "Which recovery symptoms should be discussed with the clinic?"],
    relatedTreatment: { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE hair transplant planning" },
    relatedGuide: { href: "/knowledge/hair-transplant-aftercare", label: "Hair transplant aftercare guide" },
    relatedAnswer: { href: "/doctor-answers/shedding-after-hair-transplant", label: "Shedding after hair transplant" },
  },
  {
    slug: "hair-loss-treatment-options",
    videoId: "MrMZVFY1XtI",
    pageTitle: "Hair Loss Treatment Options: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash explain why hair loss treatment begins with the cause, pattern and scalp assessment rather than one universal procedure.",
    summary: "Dr. Satyarth Prakash discusses why hair loss needs an individual assessment and how treatment options can differ depending on the pattern, scalp and clinical context.",
    keyQuestions: ["Why is the cause of hair loss important?", "When are non-surgical options discussed?", "When should hair loss be assessed in person?"],
    relatedTreatment: { href: "/hair-loss-clinic-bhubaneswar", label: "Hair loss clinic in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/hair-thinning-vs-hair-fall", label: "Hair thinning versus hair fall" },
  },
  {
    slug: "is-hair-transplant-painful",
    videoId: "e1_CJ4QjtaU",
    pageTitle: "Is a Hair Transplant Painful? Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on discomfort, local anaesthesia and recovery questions to raise during a hair transplant consultation.",
    summary: "This video discusses the discomfort and recovery questions that patients often raise before hair transplant planning. Individual anaesthesia and recovery advice require a clinical consultation.",
    keyQuestions: ["What discomfort questions should be discussed before surgery?", "How is local anaesthesia considered in a procedure plan?", "What recovery expectations should be clarified?"],
    relatedTreatment: { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-transplant-aftercare", label: "Hair transplant aftercare guide" },
    relatedAnswer: { href: "/doctor-answers/when-transplanted-hair-start-growing", label: "Hair transplant recovery timeline" },
  },
  {
    slug: "main-causes-of-hair-fall",
    videoId: "Lu8PX0YsIpU",
    pageTitle: "Main Causes of Hair Fall: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash explain common factors behind hair fall and why an assessment may be needed before selecting a treatment.",
    summary: "Dr. Satyarth Prakash discusses common reasons for hair fall and the importance of identifying the pattern and scalp context before considering a treatment pathway.",
    keyQuestions: ["What can contribute to hair fall?", "Why can similar-looking hair loss have different causes?", "When should persistent shedding be assessed?"],
    relatedTreatment: { href: "/hair-loss-clinic-bhubaneswar", label: "Hair loss assessment in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/why-hair-falls-more-on-wash-days", label: "Why hair can appear to fall more on wash days" },
  },
  {
    slug: "does-hair-dye-damage-hair",
    videoId: "WignJ9dQJGM",
    pageTitle: "Does Hair Dye Damage Hair? Video Guide",
    pageDescription: "Watch an official Radiance Clinics video addressing hair dye, breakage and scalp questions patients may want to raise during a hair consultation.",
    summary: "This video discusses hair-colouring concerns and why breakage, scalp irritation and progressive thinning should not be assumed to have the same cause.",
    keyQuestions: ["Can hair dye and hair fall be confused with one another?", "When should scalp irritation be assessed?", "What information should be shared during consultation?"],
    relatedTreatment: { href: "/hair-loss-clinic-bhubaneswar", label: "Hair and scalp assessment" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/hair-thinning-vs-hair-fall", label: "Hair thinning versus hair fall" },
  },
  {
    slug: "hair-transplant-myths-and-facts",
    videoId: "S-iOA7L3gbM",
    pageTitle: "Hair Transplant Myths and Facts: Video Guide",
    pageDescription: "Watch an official Radiance Clinics hair transplant video on common misconceptions and the clinical questions that should guide a consultation.",
    summary: "This video addresses common hair transplant misconceptions and returns the decision to donor assessment, planning and realistic expectations.",
    keyQuestions: ["What should not be assumed from online hair transplant claims?", "Why do donor limits matter?", "What makes an individual consultation important?"],
    relatedTreatment: { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE hair transplant planning" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/can-hair-transplant-work-weak-donor", label: "Hair transplant planning with a weak donor area" },
  },
  {
    slug: "why-is-my-hair-falling",
    videoId: "k93g6kBe1SM",
    pageTitle: "Why Is My Hair Falling? Doctor Video",
    pageDescription: "Watch an official Radiance Clinics video on persistent hair fall, pattern changes and the reasons a doctor-led assessment can be useful.",
    summary: "This video explains why persistent hair fall should be considered in context, including the speed of change, density pattern and scalp symptoms.",
    keyQuestions: ["What changes in hair fall should be noticed?", "Why does the pattern of loss matter?", "When should a doctor-led assessment be considered?"],
    relatedTreatment: { href: "/hair-loss-clinic-bhubaneswar", label: "Hair loss clinic in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/can-stress-cause-sudden-hair-shedding", label: "Sudden hair shedding and stress" },
  },
  {
    slug: "hair-fall-during-bathing",
    videoId: "QIrzuJAEO-Y",
    pageTitle: "Hair Fall During Bathing: Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on hair fall noticed while bathing and the signs that may justify a scalp or hair-loss assessment.",
    summary: "This video discusses why loose hairs may be noticed during washing and why ongoing shedding should be assessed alongside pattern changes and scalp symptoms.",
    keyQuestions: ["Why can more loose hair be noticed on wash days?", "What changes should be monitored over time?", "When should shedding be assessed?"],
    relatedTreatment: { href: "/hair-loss-clinic-bhubaneswar", label: "Hair loss assessment in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/why-hair-falls-more-on-wash-days", label: "Why hair can appear to fall more on wash days" },
  },
  {
    slug: "can-hair-fall-be-reversed",
    videoId: "RVP4ItWm_r8",
    pageTitle: "Can Hair Fall Be Reversed? Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on why the outlook for hair loss depends on the cause, pattern and individual clinical assessment.",
    summary: "This video discusses the difference between temporary shedding, progressive thinning and other hair-loss patterns. Treatment suitability and response vary by diagnosis.",
    keyQuestions: ["Why does the cause of hair loss affect the outlook?", "What is the difference between shedding and progressive thinning?", "What should be assessed before choosing a treatment?"],
    relatedTreatment: { href: "/treatments/hair-restoration/advanced-hair-fall-solutions", label: "Hair fall assessment and planning" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/hair-thinning-vs-hair-fall", label: "Hair thinning versus hair fall" },
  },
  {
    slug: "hair-transplant-safety",
    videoId: "2LR2hoFp-tE",
    pageTitle: "Hair Transplant Safety: Doctor Video",
    pageDescription: "Watch an official Radiance Clinics video on hair transplant safety questions, donor planning and the importance of individual suitability assessment.",
    summary: "This video discusses safety questions patients should bring to a hair transplant consultation, including suitability, donor planning and aftercare.",
    keyQuestions: ["What safety questions should be raised before surgery?", "Why does donor assessment matter?", "What limitations should be discussed in consultation?"],
    relatedTreatment: { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/can-hair-transplant-work-weak-donor", label: "Hair transplant planning with a weak donor area" },
  },
  {
    slug: "hair-transplant-graft-planning",
    videoId: "NDjLAH5OOs4",
    pageTitle: "Hair Transplant Graft Planning: Video Guide",
    pageDescription: "Watch an official Radiance Clinics video explaining why hair transplant graft planning is assessed individually rather than set from a single photograph.",
    summary: "This video discusses the factors that influence graft planning, including the planned area, donor supply, hair characteristics and long-term goals.",
    keyQuestions: ["Why is graft planning individual?", "What affects donor and coverage planning?", "Why should an estimate follow an examination?"],
    relatedTreatment: { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE hair transplant planning" },
    relatedGuide: { href: "/knowledge/hair-transplant-cost-factors", label: "Hair transplant cost factors guide" },
    relatedAnswer: { href: "/doctor-answers/how-many-grafts-receding-hairline", label: "How graft planning is assessed" },
  },
  {
    slug: "hair-patch-vs-hair-transplant",
    videoId: "Kc-kwamHiJI",
    pageTitle: "Hair Patch Versus Hair Transplant: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash discuss the difference between a hair patch and hair transplant planning for people considering hair replacement options.",
    summary: "Dr. Satyarth Prakash discusses why a hair patch and a hair transplant serve different purposes. The right option depends on whether immediate cosmetic coverage, surgery or another pathway is suitable.",
    keyQuestions: ["How does a hair patch differ from a hair transplant?", "When may non-surgical replacement be considered?", "Why is a consultation needed before comparing options?"],
    relatedTreatment: { href: "/non-surgical-hair-replacement-bhubaneswar", label: "Hair patch and non-surgical replacement" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/can-hair-transplant-work-weak-donor", label: "Hair transplant planning with a weak donor area" },
  },
  {
    slug: "choosing-a-hair-transplant-clinic",
    videoId: "8qYMw935MF8",
    pageTitle: "Choosing a Hair Transplant Clinic: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash discuss the consultation, donor planning and follow-up questions that matter when comparing hair transplant clinics.",
    summary: "Dr. Satyarth Prakash discusses how to compare hair transplant clinics through the quality of assessment, donor planning, realistic expectations and follow-up.",
    keyQuestions: ["What should be assessed before surgery is recommended?", "Why should donor planning be discussed?", "What follow-up questions should be clarified?"],
    relatedTreatment: { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/how-many-grafts-receding-hairline", label: "How graft planning is assessed" },
  },
  {
    slug: "receding-hairline-options",
    videoId: "YAjkqyKW1Jk",
    pageTitle: "Receding Hairline: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash discuss receding hairline concerns, planning questions and why a lower hairline is not automatically the right answer.",
    summary: "Dr. Satyarth Prakash discusses receding-hairline concerns and why the cause, rate of change, donor capacity and long-term design should be assessed together.",
    keyQuestions: ["What can cause a receding hairline?", "Why does long-term design matter?", "When may hairline planning be discussed?"],
    relatedTreatment: { href: "/hair-transplant-bhubaneswar", label: "Hair transplant consultation in Bhubaneswar" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/why-hairline-receding-one-side", label: "Why a hairline may recede unevenly" },
  },
  {
    slug: "right-time-for-hair-transplant",
    videoId: "Hm6cVQEQGFI",
    pageTitle: "When Is the Right Time for a Hair Transplant? Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on the suitability, stability and donor questions that help determine when hair transplant planning may be appropriate.",
    summary: "This video discusses the timing questions that matter before a hair transplant, including the stability of hair loss, donor availability and future planning.",
    keyQuestions: ["Why does the timing of surgery matter?", "How does hair-loss stability affect planning?", "What should be reviewed before a transplant is considered?"],
    relatedTreatment: { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE hair transplant planning" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/can-hair-transplant-work-weak-donor", label: "Hair transplant planning with a weak donor area" },
  },
  {
    slug: "hair-transplant-for-women",
    videoId: "9Oa4RYMsgNA",
    pageTitle: "Hair Transplant for Women: Video Guide",
    pageDescription: "Watch an official Radiance Clinics video on the questions involved in hair transplant planning for women, including donor stability and diffuse thinning.",
    summary: "This video discusses why hair transplant planning for women requires careful assessment of the loss pattern, donor area and whether surgery is appropriate.",
    keyQuestions: ["Can selected women be candidates for hair transplant?", "Why does diffuse thinning need careful assessment?", "What factors affect donor suitability?"],
    relatedTreatment: { href: "/concerns/hair-transplant/female-hair-transplant", label: "Female hair transplant guidance" },
    relatedGuide: { href: "/knowledge/how-to-plan-hair-restoration", label: "Hair restoration planning guide" },
    relatedAnswer: { href: "/doctor-answers/when-widening-part-needs-assessment", label: "When a widening part needs assessment" },
  },
  {
    slug: "dandruff-and-scalp-care",
    videoId: "05pM0SrNg8o",
    pageTitle: "Dandruff and Scalp Care: Doctor Video",
    pageDescription: "Watch an official Radiance Clinics video on dandruff and flaky-scalp concerns, including when ongoing symptoms should be examined.",
    summary: "This video discusses dandruff and scalp-care questions. Persistent scale, redness, pain or hair loss should be assessed because not every flaky scalp has the same cause.",
    keyQuestions: ["What can cause a flaky scalp?", "When should dandruff symptoms be assessed?", "How can scalp symptoms relate to hair breakage or shedding?"],
    relatedTreatment: { href: "/concerns/hair-loss-scalp/dandruff", label: "Dandruff and flaky scalp guidance" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/can-dandruff-cause-hair-loss", label: "Can dandruff cause permanent hair loss?" },
  },
  {
    slug: "female-hair-loss-causes",
    videoId: "_3Hy-y73XC4",
    pageTitle: "Female Hair Loss Causes: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash discuss female hair-loss concerns, widening-part changes and why the cause should be assessed before treatment selection.",
    summary: "Dr. Satyarth Prakash discusses female hair-loss concerns and why pattern, shedding history, medical context and scalp assessment guide the next step.",
    keyQuestions: ["What changes can point to female hair thinning?", "Why can a widening part need assessment?", "Why should treatment follow an individual diagnosis?"],
    relatedTreatment: { href: "/concerns/hair-loss-scalp/female-pattern-hair-loss", label: "Female pattern hair loss guidance" },
    relatedGuide: { href: "/knowledge/hair-loss-causes-and-assessment", label: "Hair loss causes and assessment guide" },
    relatedAnswer: { href: "/doctor-answers/when-widening-part-needs-assessment", label: "When a widening part needs assessment" },
  },
  {
    slug: "hair-transplant-procedure-explained",
    videoId: "LGBwtKwa3-o",
    pageTitle: "Hair Transplant Procedure Explained: Doctor Video",
    pageDescription: "Watch Dr. Satyarth Prakash explain hair transplant procedure planning, donor assessment and the clinical questions that should be clarified before surgery.",
    summary: "Dr. Satyarth Prakash explains the planning questions behind a hair transplant procedure. The final technique and treatment plan depend on in-person assessment.",
    keyQuestions: ["What is assessed before a hair transplant procedure?", "Why does donor strategy matter?", "What should be clarified about recovery and follow-up?"],
    relatedTreatment: { href: "/treatments/hair-restoration/fue-hair-transplant", label: "FUE hair transplant planning" },
    relatedGuide: { href: "/knowledge/hair-transplant-aftercare", label: "Hair transplant aftercare guide" },
    relatedAnswer: { href: "/doctor-answers/how-many-grafts-receding-hairline", label: "How graft planning is assessed" },
  },
];

const videoById = new Map(youtubeVideos.map((video) => [video.videoId, video]));

export const hairVideoWatchPages: VideoWatchPage[] = hairVideoWatchPageDefinitions.map(
  ({ videoId, ...page }) => {
    const video = videoById.get(videoId);
    if (!video) {
      throw new Error(`Missing verified YouTube video ${videoId} for ${page.slug}`);
    }
    return { ...page, video };
  },
);

export const videoWatchPageBySlug = new Map(
  hairVideoWatchPages.map((page) => [page.slug, page]),
);

export const videoWatchHrefByVideoId = new Map(
  hairVideoWatchPages.map((page) => [page.video.videoId, `/videos/${page.slug}`]),
);
