import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const signalSchema = z.object({
  query_length: z.number().int().min(0).max(200),
  token_count: z.number().int().min(0).max(20),
});

export async function POST(request: Request) {
  const parsed = signalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });

  const endpoint = process.env.SEARCH_SIGNAL_WEBHOOK_URL;
  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, event: "no_results", occurredAt: new Date().toISOString() }),
        cache: "no-store",
      });
    } catch {
      return new Response(null, { status: 202 });
    }
  }

  return new Response(null, { status: 204 });
}
