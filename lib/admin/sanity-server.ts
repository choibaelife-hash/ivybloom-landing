import "server-only";
import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import manifest from "./schema.json";
import type { Document, Source, Asset } from "../local-studio";
import { AuthError, guardOrigin, requireSession } from "./auth";

export class AdminError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function guard(request: Request, write = false) {
  if (write) guardOrigin(request);
  return await requireSession(request);
}
export function adminClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token)
    throw new AdminError(
      "글 저장 연결이 설정되지 않았습니다. 사이트 관리자에게 문의해 주세요.",
      503,
    );
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-02-19",
    token,
    useCdn: false,
    perspective: "raw",
  });
}
export function failure(error: unknown) {
  if (error instanceof AdminError || error instanceof AuthError)
    return Response.json({ error: error.message }, { status: error.status });
  const status = (error as { statusCode?: number })?.statusCode;
  const message =
    status === 409
      ? "다른 곳에서 먼저 수정했습니다. 현재 글을 내려받고 최신 글을 다시 불러오세요."
      : status === 401 || status === 403
        ? "글 저장 권한을 확인할 수 없습니다. 사이트 관리자에게 문의해 주세요."
        : "저장 서비스 요청이 완료되지 않았습니다. 입력 내용은 화면에 남아 있습니다. 새로 불러오기에서 저장 여부를 확인하세요.";
  return Response.json(
    { error: message },
    { status: status === 409 ? 409 : 502 },
  );
}
export async function readSource(): Promise<Source> {
  const client = adminClient();
  const [raw, assets] = await Promise.all([
    client.fetch<Document[]>(
      '*[_type == "journalPost" && !(_id in path("versions.**"))] | order(publishedAt desc)',
      {},
      { cache: "no-store" },
    ),
    client.fetch<Asset[]>(
      '*[_type == "sanity.imageAsset"] | order(_createdAt desc) {_id, url, originalFilename}',
      {},
      { cache: "no-store" },
    ),
  ]);
  const states: Source["states"] = {};
  const documents = new Map<string, Document>();
  for (const doc of raw) {
    const id = doc._id.replace(/^drafts\./, "");
    states[id] ||= {};
    if (doc._id.startsWith("drafts.")) {
      states[id].draftRev = doc._rev;
      documents.set(id, { ...doc, _id: id });
    } else {
      states[id].publishedRev = doc._rev;
      if (!documents.has(id)) documents.set(id, doc);
    }
  }
  const { projectId, dataset } = client.config();
  return {
    documents: [...documents.values()],
    assets,
    states,
    projectId: projectId!,
    dataset: dataset!,
    fetchedAt: new Date().toISOString(),
    writable: true,
  };
}
const fields = manifest.journalPost.fields
  .filter((f) => !f.readOnly && f.name !== "writingGuide")
  .map((f) => f.name);
export function journalFields(doc: Document) {
  if (doc._type !== "journalPost")
    throw new AdminError("저널만 저장할 수 있습니다.");
  // Schema fields only; never send Sanity-owned metadata or local bookkeeping.
  return Object.fromEntries(
    fields.filter((f) => doc[f] !== undefined).map((f) => [f, doc[f]]),
  );
}
function identifier(id: unknown) {
  if (typeof id !== "string") throw new AdminError("글 ID가 없습니다.");
  const result = id.replace(/^local\./, "");
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(result))
    throw new AdminError("잘못된 글 ID입니다.");
  return result;
}
export async function saveDraft(doc: Document, expectedRevision?: string) {
  const client = adminClient();
  const id = identifier(doc._id);
  const draftId = `drafts.${id}`;
  const [published, draft] = await client.getDocuments<Document>([id, draftId]);
  const current = draft || published;
  if (current && current._type !== "journalPost")
    throw new AdminError("저널이 아닌 문서입니다.");
  if (current?._rev !== expectedRevision)
    throw new AdminError(
      "다른 곳에서 글이 변경되었습니다. 최신 글을 다시 불러온 뒤 확인하세요.",
      409,
    );
  const values = journalFields(doc);
  const unset = fields.filter(
    (f) => doc[f] === undefined && current?.[f] !== undefined,
  );
  if (!current) {
    await client.action({
      actionType: "sanity.action.document.create",
      publishedId: id,
      attributes: {
        _id: draftId,
        _type: "journalPost",
        author: manifest.journalPost.fields.find((f) => f.name === "author")
          ?.initialValue,
        ...values,
      },
      ifExists: "fail",
    });
  } else if (draft) {
    // Actions edit does not accept ifRevisionID. The mutation patch provides atomic revision locking.
    let patch = client.patch(draftId).ifRevisionId(draft._rev!).set(values);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit({ visibility: "sync" });
  } else {
    // Copy the published document and edit it in one transaction, guarded by its revision.
    await client.action([
      {
        actionType: "sanity.action.document.version.create",
        publishedId: id,
        baseId: id,
        versionId: draftId,
        ifBaseRevisionId: published!._rev,
      },
      {
        actionType: "sanity.action.document.edit",
        publishedId: id,
        draftId,
        patch: { set: values, ...(unset.length ? { unset } : {}) },
      },
    ]);
  }
  const saved = await client.getDocument<Document>(draftId);
  if (!saved) throw new AdminError("저장 결과를 확인하지 못했습니다.", 502);
  return { ...saved, _id: id };
}
export function validatePublish(doc: Document) {
  const errors: string[] = [];
  for (const field of manifest.journalPost.fields) {
    const value = field.type === "slug" ? doc.slug?.current : doc[field.name];
    if (
      field.required &&
      (value === undefined ||
        value === null ||
        (typeof value === "string" && !value.trim()))
    )
      errors.push(field.title || field.name);
    if (
      field.options &&
      "list" in field.options &&
      value &&
      !(field.options.list as { value: string }[]).some(
        (o) => o.value === value,
      )
    )
      errors.push(`${field.title} 값`);
  }
  if (
    !Array.isArray(doc.body) ||
    !doc.body.length ||
    !doc.body.some(
      (b) =>
        b._type === "block" &&
        (b.children as { text?: string }[] | undefined)?.some((c) =>
          c.text?.trim(),
        ),
    )
  )
    errors.push("본문");
  if (doc.publishedAt && !Number.isFinite(Date.parse(String(doc.publishedAt))))
    errors.push("게시 날짜");
  if (doc.slug?.current && !/^[\p{L}\p{N}_-]+$/u.test(doc.slug.current))
    errors.push("글 주소 형식");
  for (const faq of doc.faqSection || [])
    if (!faq.question?.trim() || !faq.answer?.trim())
      errors.push("FAQ 질문·답변");
  for (const rawBlock of doc.body || []) {
    const block = rawBlock as unknown as Record<string, unknown>;
    if (
      block._type === "checklistBlock" &&
      (!Array.isArray(block.items) || !block.items.length)
    )
      errors.push("체크리스트 항목");
    if (
      block._type === "tableBlock" &&
      (!Array.isArray(block.rows) || !block.rows.length)
    )
      errors.push("표의 행");
    if (block._type === "image" && !(block.asset as { _ref?: string })?._ref)
      errors.push("본문 이미지");
  }
  if (errors.length)
    throw new AdminError(
      `발행 전에 확인하세요: ${[...new Set(errors)].join(", ")}`,
    );
}
export async function publishDraft(
  idInput: string,
  revision: string,
  expectedPublished?: string,
) {
  const client = adminClient();
  const id = identifier(idInput),
    draftId = `drafts.${id}`;
  const [published, draft] = await client.getDocuments<Document>([id, draftId]);
  if (!draft || draft._type !== "journalPost")
    throw new AdminError("먼저 임시 저장하세요.");
  if (draft._rev !== revision || published?._rev !== expectedPublished)
    throw new AdminError(
      "다른 곳에서 글이 변경되었습니다. 최신 글을 다시 불러오세요.",
      409,
    );
  validatePublish(draft);
  const duplicates = await client.fetch<number>(
    'count(*[_type in ["post", "journalPost"] && slug.current == $slug && !(_id in [$id, $draftId]) && !(_id in path("versions.**"))])',
    { slug: draft.slug!.current, id, draftId },
    { cache: "no-store" },
  );
  if (duplicates)
    throw new AdminError("같은 글 주소가 이미 있습니다. 글 주소를 바꾸세요.");
  await client.action({
    actionType: "sanity.action.document.publish",
    publishedId: id,
    draftId,
    ifDraftRevisionId: revision,
    ...(published ? { ifPublishedRevisionId: published._rev } : {}),
  });
  revalidatePath("/", "layout");
  const result = await client.getDocument<Document>(id);
  if (!result) throw new AdminError("발행 결과를 확인하지 못했습니다.", 502);
  return result;
}

export type DeleteTarget = { id: string; draftRev?: string; publishedRev?: string };
export async function deletePosts(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 50) throw new AdminError("삭제할 글을 1~50개 선택하세요.");
  const targets = value.map((entry): DeleteTarget => {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || entry.id.startsWith("local.")) throw new AdminError("삭제할 글 ID를 확인하세요.");
    const id = identifier(entry.id);
    for (const rev of [entry.draftRev, entry.publishedRev]) if (rev !== undefined && (typeof rev !== "string" || !rev)) throw new AdminError("글 저장 상태를 확인하세요.");
    return { id, draftRev: entry.draftRev, publishedRev: entry.publishedRev };
  });
  if (new Set(targets.map(t => t.id)).size !== targets.length) throw new AdminError("같은 글을 중복 선택할 수 없습니다.");
  const client = adminClient();
  const docs = await client.getDocuments<Document>(targets.flatMap(t => [t.id, `drafts.${t.id}`]));
  // Validate the entire selection before making one atomic deletion transaction.
  for (const [i, target] of targets.entries()) {
    const [published, draft] = docs.slice(i * 2, i * 2 + 2);
    if (!published && !draft) throw new AdminError("이미 삭제된 글이 있습니다. 목록을 새로 불러오세요.", 409);
    if ([published, draft].some(doc => doc && doc._type !== "journalPost")) throw new AdminError("저널만 삭제할 수 있습니다.");
    if (published?._rev !== target.publishedRev || draft?._rev !== target.draftRev) throw new AdminError("선택한 글이 변경되었습니다. 목록을 새로 불러온 뒤 다시 선택하세요.", 409);
  }
  const transaction = client.transaction();
  for (const doc of docs) if (doc) {
    transaction.patch(doc._id, p => p.ifRevisionId(doc._rev!).set({ _type: "journalPost" }));
    transaction.delete(doc._id);
  }
  await transaction.commit({ visibility: "sync" });
  revalidatePath("/", "layout");
  return targets.map(target => target.id);
}
