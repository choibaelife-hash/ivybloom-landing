import {
  guard,
  readSource,
  failure,
  saveDraft,
  deletePosts,
} from "@/lib/admin/sanity-server";
import type { Document } from "@/lib/local-studio";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    await guard(request);
    return Response.json(await readSource(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    await guard(request, true);
    const { document, expectedRevision } = (await request.json()) as {
      document: Document;
      expectedRevision?: string;
    };
    const saved = await saveDraft(document, expectedRevision);
    return Response.json({ document: saved, source: await readSource() });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await guard(request, true);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 32000) return Response.json({ error: "삭제 요청이 너무 큽니다." }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return Response.json({ error: "삭제 요청 형식을 확인하세요." }, { status: 400 }); }
    const deleted = await deletePosts(body?.targets);
    // A successful deletion must stay successful even if refreshing the list fails.
    try { return Response.json({ deleted, source: await readSource() }, { headers: { "Cache-Control": "no-store" } }); }
    catch { return Response.json({ deleted, refreshRequired: true }, { headers: { "Cache-Control": "no-store" } }); }
  } catch (error) { return failure(error); }
}
