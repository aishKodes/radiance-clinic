import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai";
import {z} from "zod";
import {
  getAssistantKnowledge,
  getClinicSettings,
  getConditions,
  getDoctorProfile,
  getHomepageContent,
  getTreatments,
} from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1600),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(12),
  lead: z
    .object({
      name: z.string().max(80).optional(),
      phone: z.string().max(40).optional(),
      concern: z.string().max(240).optional(),
    })
    .optional(),
});

const medicalDisclaimer =
  "This assistant can help with services, appointments, and general guidance. It does not provide medical advice or diagnosis.";

type AssistantContext = {
  clinic: {
    name: string;
    city: string;
    region: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: string;
    tagline: string;
  };
  doctor: {
    name: string;
    role: string;
    shortBio: string;
    authorityPoints: string[];
  };
  proof: {value: string; label: string}[];
  treatments: {
    title: string;
    cluster: string;
    summary: string;
    idealFor: string[];
  }[];
  conditions: {title: string; summary: string; signs: string[]}[];
  faqs: {question: string; answer: string}[];
  assistant: {title: string; disclaimer: string};
  serviceNotes: string[];
  lead?: {name?: string; phone?: string; concern?: string};
};

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json(
      {
        reply:
          "Please send a short question about Radiance Clinics services, booking, or contact details.",
        source: "validation",
      },
      {status: 400},
    );
  }

  const [settings, doctor, homepage, treatments, conditions, knowledge] =
    await Promise.all([
      getClinicSettings(),
      getDoctorProfile(),
      getHomepageContent(),
      getTreatments(),
      getConditions(),
      getAssistantKnowledge(),
    ]);
  const assistant = knowledge.settings;

  const latestUserMessage =
    [...parsed.data.messages].reverse().find((message) => message.role === "user")
      ?.content || "";

  const context: AssistantContext = {
    clinic: {
      name: settings.name,
      city: settings.city,
      region: settings.region,
      address: settings.address,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      hours: settings.hours,
      tagline: settings.tagline,
    },
    doctor,
    proof: homepage.proofStats.map((stat) => ({
      value: stat.value,
      label: stat.label,
    })),
    treatments: treatments.map((treatment) => ({
      title: treatment.title,
      cluster: treatment.clusterLabel,
      summary: treatment.summary,
      idealFor: treatment.idealFor,
    })),
    conditions: conditions.map((condition) => ({
      title: condition.title,
      summary: condition.summary,
      signs: condition.signs,
    })),
    faqs: knowledge.faqs.length ? knowledge.faqs : homepage.faqs,
    assistant: {
      title: assistant.title,
      disclaimer: assistant.disclaimer || medicalDisclaimer,
    },
    serviceNotes: knowledge.serviceNotes || [],
    lead: parsed.data.lead,
  };

  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({
      reply: rulesBasedReply(latestUserMessage, context),
      source: "fallback",
    });
  }

  try {
    const google = createGoogleGenerativeAI({apiKey});
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system: [
        "You are Radiance AI Assistant for Radiance Clinics, Bhubaneswar.",
        "Use only the supplied clinic context. Be concise, warm, premium and medically responsible.",
        "You may explain services at a high level, booking steps, contact details, clinic basics and general preparation questions.",
        "Do not diagnose, prescribe, recommend medicines, guarantee results, or tell the user which procedure they personally need.",
        "For medical decisions, advise a doctor-led consultation with Dr. Satyarth Prakash or the clinic team.",
        "If the user shares lead details, acknowledge them and invite callback confirmation. Do not claim a booking is confirmed.",
      ].join("\n"),
      prompt: [
        `Clinic context:\n${JSON.stringify(context, null, 2)}`,
        "Conversation:",
        ...parsed.data.messages.map(
          (message) => `${message.role.toUpperCase()}: ${message.content}`,
        ),
        "ASSISTANT:",
      ].join("\n\n"),
      maxOutputTokens: 360,
    });

    return Response.json({
      reply: addSafetyFooter(result.text),
      source: "gemini",
    });
  } catch {
    return Response.json({
      reply: rulesBasedReply(latestUserMessage, context),
      source: "fallback",
    });
  }
}

function rulesBasedReply(
  message: string,
  context: AssistantContext,
) {
  const text = message.toLowerCase();
  const clinic = context.clinic;
  const lead = context.lead;
  const matchingTreatment = context.treatments.find((treatment) =>
    [treatment.title, treatment.cluster, ...treatment.idealFor]
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.length > 4 && text.includes(word)),
  );
  const matchingCondition = context.conditions.find((condition) =>
    [condition.title, ...condition.signs]
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.length > 4 && text.includes(word)),
  );

  if (text.includes("book") || text.includes("appointment") || text.includes("consult")) {
    return addSafetyFooter(
      `You can request a consultation with Radiance Clinics by calling ${clinic.phone} or using WhatsApp at +${clinic.whatsapp}. Share your name, phone number and concern, and the clinic team can guide the next step.`,
    );
  }

  if (text.includes("whatsapp") || text.includes("call") || text.includes("phone")) {
    return addSafetyFooter(
      `Radiance Clinics can be reached by phone at ${clinic.phone}. WhatsApp is available at +${clinic.whatsapp}. Clinic hours are ${clinic.hours}.`,
    );
  }

  if (matchingTreatment) {
    return addSafetyFooter(
      `${matchingTreatment.title} is part of Radiance Clinics' ${matchingTreatment.cluster} services. ${matchingTreatment.summary} A doctor-led consultation is the right way to check suitability, downtime and realistic expectations.`,
    );
  }

  if (matchingCondition) {
    return addSafetyFooter(
      `For ${matchingCondition.title}, Radiance Clinics starts with assessment rather than a fixed package. ${matchingCondition.summary} A consultation can help map the concern to suitable treatment options.`,
    );
  }

  if (lead?.name || lead?.phone || lead?.concern) {
    return addSafetyFooter(
      `Thanks${lead.name ? `, ${lead.name}` : ""}. I have your${lead.concern ? ` concern as "${lead.concern}"` : " consultation interest"}${lead.phone ? ` and phone number ending ${lead.phone.slice(-4)}` : ""}. Please submit the callback request or contact Radiance Clinics on WhatsApp at +${clinic.whatsapp}.`,
    );
  }

  return addSafetyFooter(
    `${clinic.name} in ${clinic.city} offers doctor-led hair restoration, skin, laser and aesthetic care by ${context.doctor.name}. I can help with services, clinic information, WhatsApp/call details or consultation requests.`,
  );
}

function addSafetyFooter(reply: string) {
  return reply.includes("does not provide medical advice")
    ? reply
    : `${reply}\n\n${medicalDisclaimer}`;
}
