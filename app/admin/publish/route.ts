import {
  guard,
  publishDraft,
  readSource,
  failure,
} from "@/lib/admin/sanity-server";
export async function POST(request: Request) {
  try {
    await guard(request, true);
    const { id, revision, publishedRevision } = await request.json();
    const document = await publishDraft(id, revision, publishedRevision);
    return Response.json({ document, source: await readSource() });
  } catch (error) {
    return failure(error);
  }
}
