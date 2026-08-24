import { evaluateProgrammaticPageEligibility } from "@/lib/indexability";

export type LocationSeoPage = {
  slug: string;
  city: string;
  service: "Hair Transplant";
  actualClinicCity: "Bhubaneswar";
  status: "draft" | "published";
  title: string;
  metaTitle: string;
  metaDescription: string;
  uniqueIntroduction: string[];
  verifiedTravelGuidance: string[];
  verifiedPatientContext: string;
  faqs: { question: string; answer: string }[];
};

export const locationPages: LocationSeoPage[] = [
  {
    slug: "hair-transplant-cuttack",
    city: "Cuttack",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Cuttack",
    metaTitle: "Hair Transplant for Cuttack Patients | Radiance Clinics",
    metaDescription:
      "Hair transplant consultation for patients from Cuttack at Radiance Clinics Nayapalli, Bhubaneswar, with donor assessment and practical visit planning.",
    uniqueIntroduction: [
      "Patients travelling from Cuttack can arrange a hair transplant assessment at Radiance Clinics in Nayapalli, Bhubaneswar. The clinic does not operate a Cuttack branch. The first appointment is used to examine the scalp and donor area, understand the pattern and stability of hair loss, and decide whether surgery or a non-surgical pathway is appropriate.",
      "Because Cuttack is comparatively close to Bhubaneswar, consultation and review visits can be planned as separate appointments without assuming that a procedure will happen on the first visit. Procedure duration, medication, transport and the need for someone to accompany the patient are discussed only after the doctor confirms an individual plan.",
      "A useful first step is to share previous treatment details while booking and reserve enough time for an in-person examination. Photographs can help the clinic prepare for a conversation, but they do not replace donor-density assessment, scalp examination or medical history review.",
    ],
    verifiedTravelGuidance: [
      "Confirm the Nayapalli appointment time before leaving Cuttack.",
      "Keep the consultation day separate from the procedure day unless the clinic explicitly confirms otherwise.",
      "Discuss return transport and whether an accompanying adult is advisable before a procedure.",
      "Use the verified Bhubaneswar address and clinic phone numbers on this website.",
    ],
    verifiedPatientContext:
      "This page is for Cuttack residents considering treatment at the verified Radiance Clinics location in Bhubaneswar.",
    faqs: [
      {
        question: "Is there a Radiance Clinics hair transplant branch in Cuttack?",
        answer: "No. Consultation, treatment and clinical follow-up take place at Radiance Clinics in Nayapalli, Bhubaneswar.",
      },
      {
        question: "Can suitability be confirmed before travelling from Cuttack?",
        answer: "The team can collect basic history for scheduling, but hair transplant suitability and donor capacity require an in-person doctor-led assessment.",
      },
      {
        question: "Will a hair transplant be done during the first appointment?",
        answer: "Do not assume this. The first appointment is normally for assessment and planning; any procedure date is confirmed separately after suitability is established.",
      },
    ],
  },
  {
    slug: "hair-transplant-puri",
    city: "Puri",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Puri",
    metaTitle: "Hair Transplant for Puri Patients | Radiance Clinics",
    metaDescription:
      "Plan a doctor-led hair transplant consultation from Puri at Radiance Clinics Nayapalli, Bhubaneswar, including assessment, procedure and return-travel guidance.",
    uniqueIntroduction: [
      "Radiance Clinics receives hair-restoration enquiries from Puri, but all consultation and treatment take place at the clinic in Nayapalli, Bhubaneswar. A doctor-led assessment reviews the cause of hair loss, scalp health, donor supply, hairline goals and the likely need for ongoing protection of existing hair.",
      "Patients from Puri should plan the consultation as a clinical appointment rather than assuming same-day surgery. If a transplant is suitable, the procedure date, likely duration, preparation and follow-up schedule are confirmed after examination. This also gives the patient time to arrange transport and a sensible return plan.",
      "After a procedure, sun exposure, physical activity, headwear and scalp care may need temporary changes. Patients should ask for individual instructions before combining treatment travel with outdoor or leisure plans. The clinic will explain what applies to the chosen procedure and the patient's health history.",
    ],
    verifiedTravelGuidance: [
      "Confirm the Bhubaneswar appointment before arranging travel from Puri.",
      "Avoid planning tourism or prolonged outdoor activity around a procedure appointment.",
      "Discuss whether to return the same day or stay in Bhubaneswar after the procedure.",
      "Keep the clinic's two published phone numbers available for schedule changes.",
    ],
    verifiedPatientContext:
      "This page supports patients travelling from Puri to the verified Radiance Clinics location in Bhubaneswar.",
    faqs: [
      {
        question: "Does Radiance Clinics have a branch in Puri?",
        answer: "No. Radiance Clinics operates from Nayapalli, Bhubaneswar; this page explains how patients from Puri can plan a visit.",
      },
      {
        question: "Can I travel back to Puri after a hair transplant?",
        answer: "Return travel depends on the procedure plan, timing and individual recovery. Discuss transport and accompaniment with the clinic before booking the procedure day.",
      },
      {
        question: "Can photographs confirm how many grafts I need?",
        answer: "Photographs can support initial scheduling, but graft planning requires examination of donor density, scalp condition, hair characteristics and long-term hair loss risk.",
      },
    ],
  },
  {
    slug: "hair-transplant-berhampur",
    city: "Berhampur",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Berhampur",
    metaTitle: "Hair Transplant for Berhampur Patients | Radiance Clinics",
    metaDescription:
      "Hair transplant planning for patients from Berhampur at Radiance Clinics Bhubaneswar, with donor assessment and coordinated outstation appointments.",
    uniqueIntroduction: [
      "Patients from Berhampur considering a hair transplant can book an assessment at Radiance Clinics in Nayapalli, Bhubaneswar. There is no Radiance Clinics branch in Berhampur. The consultation determines whether the pattern of hair loss is suitable for surgery and whether the donor area can support the coverage being considered.",
      "For a longer outstation visit, it is useful to complete non-clinical coordination before travelling. The booking team can record previous treatment, medical history and the main concern, while the final decision still depends on an in-person scalp and donor examination by the doctor.",
      "If surgery is advised, the clinic explains the procedure date, expected time at the clinic, aftercare and review plan. Patients should arrange return travel only after those details are clear, because immediate recovery advice and follow-up needs differ between individuals.",
    ],
    verifiedTravelGuidance: [
      "Ask the team what records or previous prescriptions to bring from Berhampur.",
      "Allow enough time for a full donor and scalp assessment at the first visit.",
      "Confirm procedure-day transport and accommodation needs before making bookings.",
      "Agree on the initial review plan before leaving Bhubaneswar.",
    ],
    verifiedPatientContext:
      "The current search visibility belongs to a legacy Berhampur page; the replacement accurately states that care is delivered in Bhubaneswar.",
    faqs: [
      {
        question: "Where does treatment take place for patients from Berhampur?",
        answer: "All clinical assessment, hair transplant treatment and in-person follow-up take place at Radiance Clinics in Nayapalli, Bhubaneswar.",
      },
      {
        question: "Can consultation and surgery be completed in one trip?",
        answer: "That cannot be promised before examination. The clinic first confirms suitability and then coordinates a procedure plan based on medical and scheduling requirements.",
      },
      {
        question: "What should I bring to the consultation?",
        answer: "Bring details of previous hair treatment, relevant prescriptions, medical conditions and current medicines. The clinic can clarify any additional records while booking.",
      },
    ],
  },
  {
    slug: "hair-transplant-sambalpur",
    city: "Sambalpur",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Sambalpur",
    metaTitle: "Hair Transplant for Sambalpur Patients | Radiance Clinics",
    metaDescription:
      "Doctor-led hair transplant assessment for Sambalpur patients at Radiance Clinics Bhubaneswar, with coordinated consultation and recovery planning.",
    uniqueIntroduction: [
      "Radiance Clinics serves patients who travel from Sambalpur for hair-restoration assessment, with all care delivered at the verified Nayapalli, Bhubaneswar clinic. There is no Sambalpur branch. The doctor evaluates diagnosis, progression, donor reserves, scalp health and realistic coverage before recommending surgery.",
      "The distance makes advance coordination important. Patients can provide treatment history and their main questions when booking so the clinic can allocate an appropriate consultation. A remote conversation or photograph does not replace the examination needed to judge donor quality, hair calibre or transplant suitability.",
      "When a procedure is planned, ask specifically about arrival time, likely discharge, return travel, early scalp care and the first review. The advice depends on the individual plan, and patients should not make inflexible travel arrangements until the clinic confirms these details.",
    ],
    verifiedTravelGuidance: [
      "Coordinate the consultation date with the clinic before booking long-distance travel.",
      "Carry current medication and previous hair-treatment information.",
      "Keep procedure-day return plans flexible until recovery guidance is confirmed.",
      "Ask how early follow-up will be handled before returning to Sambalpur.",
    ],
    verifiedPatientContext:
      "This is an outstation planning page for Sambalpur residents visiting the single Radiance Clinics location in Bhubaneswar.",
    faqs: [
      {
        question: "Is Radiance Clinics located in Sambalpur?",
        answer: "No. The verified clinic is in Nayapalli, Bhubaneswar. Patients from Sambalpur should confirm appointments before travel.",
      },
      {
        question: "Can the donor area be assessed online?",
        answer: "Images can help with preliminary discussion, but donor density, scalp condition and surgical suitability require in-person assessment.",
      },
      {
        question: "How should I plan follow-up from Sambalpur?",
        answer: "The clinic will explain which reviews need to be in person and what can be discussed remotely after the individual procedure plan is confirmed.",
      },
    ],
  },
  {
    slug: "hair-transplant-rourkela",
    city: "Rourkela",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Rourkela",
    metaTitle: "Hair Transplant for Rourkela Patients | Radiance Clinics",
    metaDescription:
      "Plan hair transplant assessment from Rourkela at Radiance Clinics Bhubaneswar with donor review, treatment scheduling and outstation follow-up guidance.",
    uniqueIntroduction: [
      "Patients from Rourkela can consult Dr. Satyarth Prakash for hair transplant planning at Radiance Clinics in Nayapalli, Bhubaneswar. Radiance does not claim a clinic branch in Rourkela. Suitability is based on the diagnosis, stability of loss, donor-area examination and the patient's long-term restoration goals.",
      "Because the trip may involve a substantial road, rail or air journey, the consultation and procedure should be scheduled deliberately. The clinic can collect basic information before travel, but graft estimates and hairline planning are not finalized from photographs alone.",
      "Before confirming return tickets, patients should understand procedure timing, transport restrictions, early aftercare and review needs. Individual advice may differ based on the size of the procedure, medical history and how the patient responds on the day.",
    ],
    verifiedTravelGuidance: [
      "Tell the booking team that you are travelling from Rourkela.",
      "Confirm whether the appointment is for consultation, procedure or review.",
      "Avoid fixed same-day return plans until procedure timing is confirmed.",
      "Discuss which follow-up checks require another Bhubaneswar visit.",
    ],
    verifiedPatientContext:
      "This page is designed for Rourkela patients travelling to Bhubaneswar and makes no local branch claim.",
    faqs: [
      {
        question: "Does Radiance Clinics have a Rourkela branch?",
        answer: "No. The clinic location is in Nayapalli, Bhubaneswar, and appointments for Rourkela patients take place there.",
      },
      {
        question: "Can I receive a final graft estimate before travelling?",
        answer: "A preliminary discussion may be possible, but a responsible estimate requires in-person donor and scalp examination.",
      },
      {
        question: "Should I book return travel for the procedure day?",
        answer: "Confirm this with the clinic after the procedure plan is set. Timing, accompaniment and recovery guidance vary by patient.",
      },
    ],
  },
  {
    slug: "hair-transplant-baripada",
    city: "Baripada",
    service: "Hair Transplant",
    actualClinicCity: "Bhubaneswar",
    status: "published",
    title: "Hair Transplant Planning for Patients from Baripada",
    metaTitle: "Hair Transplant for Baripada Patients | Radiance Clinics",
    metaDescription:
      "Hair transplant consultation for Baripada patients at Radiance Clinics Bhubaneswar, with diagnosis, donor assessment and practical travel planning.",
    uniqueIntroduction: [
      "Radiance Clinics offers hair transplant assessment at its verified clinic in Nayapalli, Bhubaneswar for patients travelling from Baripada. The clinic does not operate a Baripada branch. The first priority is to understand the type and progression of hair loss and whether the donor area can support a responsible long-term plan.",
      "Patients making the journey from Baripada should confirm whether they are booking a consultation or a procedure. The initial visit may lead to medical treatment, regenerative options, surgery planning or further assessment; it should not be treated as an automatic procedure booking.",
      "If a transplant is recommended, the doctor explains hairline design, donor use, expected coverage, aftercare and review requirements. Travel and accommodation decisions should follow that discussion so the patient has enough time for the appointment and a sensible return plan.",
    ],
    verifiedTravelGuidance: [
      "Confirm the appointment purpose and arrival time before travelling from Baripada.",
      "Bring previous treatment details and a current medicine list.",
      "Discuss accompaniment and return travel before a procedure date.",
      "Use only the published Nayapalli address for directions.",
    ],
    verifiedPatientContext:
      "This is an outstation patient page for treatment at Radiance Clinics Bhubaneswar, not a Baripada location page for a separate branch.",
    faqs: [
      {
        question: "Where is the clinic for patients travelling from Baripada?",
        answer: "Radiance Clinics is located in Nayapalli, Bhubaneswar. There is no Radiance Clinics branch in Baripada.",
      },
      {
        question: "Does everyone with thinning need a hair transplant?",
        answer: "No. The appropriate pathway depends on diagnosis, progression, donor quality, scalp health and treatment history. Some patients are advised non-surgical care.",
      },
      {
        question: "How do I plan reviews after returning to Baripada?",
        answer: "The clinic will set an individual review schedule and clarify which assessments must be in person after the procedure plan is confirmed.",
      },
    ],
  },
];

export type LocationEligibility = {
  eligible: boolean;
  missing: string[];
};

export function evaluateLocationEligibility(page: LocationSeoPage): LocationEligibility {
  const missing: string[] = [];

  if (page.status !== "published") missing.push("published status");
  if (!page.title || page.title.length < 25) missing.push("unique H1");
  if (!page.metaTitle || !page.metaDescription) missing.push("unique metadata");
  if (page.uniqueIntroduction.join(" ").length < 450) {
    missing.push("substantial city-specific introduction");
  }
  if (!page.verifiedTravelGuidance.length) missing.push("verified travel guidance");
  if (page.faqs.length < 2) missing.push("city-specific patient FAQs");

  const shared = evaluateProgrammaticPageEligibility({
    slug: page.slug,
    title: page.title,
    description: page.metaDescription,
    bodyText: [...page.uniqueIntroduction, ...page.verifiedTravelGuidance].join(" "),
    parentPath: "/locations",
    contextualLinks: ["/hair-transplant-bhubaneswar", "/contact"],
    canonicalPath: `/${page.slug}`,
    status: page.status,
    hasVerifiedUserValue: Boolean(page.verifiedTravelGuidance.length),
    missingVerifiedFields: missing,
  });
  return { eligible: shared.eligible, missing: shared.reasons };
}

export const indexableLocationPages = locationPages.filter(
  (page) => evaluateLocationEligibility(page).eligible,
);

export const indexableLocationPageBySlug = new Map(
  indexableLocationPages.map((page) => [page.slug, page]),
);
