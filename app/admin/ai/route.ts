import { guard, failure } from "@/lib/admin/sanity-server";
import { generateWriting, validateInput, WritingError } from "@/lib/admin/ai-writing";
export const runtime = "nodejs";
export const maxDuration = 120;
const requests = new Map<string, { count: number; since: number; busy: boolean }>();
export async function POST(request: Request) {
  let slot: { count: number; since: number; busy: boolean } | undefined;
  try {
    const session = await guard(request, true);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 40000) throw new WritingError("원문이 너무 깁니다. 12,000자 이내로 나눠 작성해 주세요.", 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { throw new WritingError("작성 요청 형식이 올바르지 않습니다."); }
    const input = validateInput(body);
    const previous = requests.get(session.email);
    slot = previous && Date.now() - previous.since < 15 * 60 * 1000 ? previous : { count: 0, since: Date.now(), busy: false };
    if (slot.busy || slot.count >= 20) { slot = undefined; throw new WritingError("AI 요청이 진행 중이거나 요청이 많습니다. 잠시 뒤 다시 시도해 주세요.", 429); }
    slot.count++; slot.busy = true; requests.set(session.email, slot);
    return Response.json({ result: await generateWriting(input) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof WritingError) return Response.json({ error: error.message }, { status: error.status });
    return failure(error);
  } finally { if (slot) slot.busy = false; }
}
