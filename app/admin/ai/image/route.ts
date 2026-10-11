import { guard, failure } from "@/lib/admin/sanity-server";
import { generateImage, validateImageInput } from "@/lib/admin/ai-image";
import { ServiceError } from "@/lib/admin/service-error";
export const runtime = "nodejs";
export const maxDuration = 120;
const requests = new Map<string, { count: number; since: number; busy: boolean }>();
export async function POST(request: Request) {
  let slot: { count: number; since: number; busy: boolean } | undefined;
  try {
    const session = await guard(request, true);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 2900000) throw new ServiceError("이미지 요청이 너무 큽니다. 참고 사진 크기를 줄여 주세요.", 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { throw new ServiceError("이미지 요청 형식이 올바르지 않습니다.", 400); }
    const input = validateImageInput(body);
    const previous = requests.get(session.email);
    const next = previous && Date.now() - previous.since < 15 * 60 * 1000 ? previous : { count: 0, since: Date.now(), busy: false };
    if (next.busy || next.count >= 10) throw new ServiceError("이미지 요청이 진행 중이거나 요청이 많습니다. 잠시 뒤 다시 시도해 주세요.", 429);
    slot = next; slot.busy = true; slot.count++; requests.set(session.email, slot);
    return Response.json({ image: await generateImage(input) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ServiceError) return Response.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "private, no-store" } });
    return failure(error);
  } finally { if (slot) slot.busy = false; }
}
