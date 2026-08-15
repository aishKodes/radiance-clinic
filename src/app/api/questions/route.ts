import { randomUUID } from "node:crypto";
import { z } from "zod";
import { concernCategories } from "@/data/concern-library";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = new Set(concernCategories.map((category) => category.slug));
const questionSchema = z.object({
  displayName: z.string().trim().max(80).optional().default(""),
  category: z.string().refine((value) => categories.has(value), "Unknown category"),
  question: z.string().trim().min(12).max(1200),
  contact: z.string().trim().max(160).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const parsed = questionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ message: "Please check the question, category and consent fields." }, { status: 400 });
  }

  const endpoint = process.env.QUESTION_SUBMISSION_WEBHOOK_URL;
  if (!endpoint) {
    return Response.json(
      { message: "Secure question storage is not connected yet. Please use the consultation form, WhatsApp or phone so your message is not lost." },
      { status: 503 },
    );
  }

  const reference = randomUUID();
  const payload = {
    reference,
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
    displayName: parsed.data.displayName || undefined,
    category: parsed.data.category,
    question: parsed.data.question,
    privateContact: parsed.data.contact || undefined,
    consent: true,
    publishAutomatically: false,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Question endpoint rejected the request");
    return Response.json({ reference, status: "SUBMITTED", message: "Your private question was submitted for triage. It will not be published automatically." }, { status: 202 });
  } catch {
    return Response.json({ message: "The secure question service is temporarily unavailable. Please use the consultation form, WhatsApp or phone." }, { status: 502 });
  }
}
