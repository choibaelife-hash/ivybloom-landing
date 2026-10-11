"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Save,
  Search,
  X,
  Trash2,
} from "lucide-react";
import {
  schemas,
  adminGuidance,
  text,
  imageUrl,
  typeLabels,
  loadCopies,
  saveCopy,
  removeCopy,
  newDocument,
  type Document,
  type Source,
  type LocalCopy,
  type ImageValue,
} from "@/lib/local-studio";
import { AUDIT_GROUPS, analyzeBody, type PTBlock } from "@/lib/admin/body-analysis";
import { CHECKS, checkField, checkMessage, type PostAudit } from "@/lib/admin/seo-audit";
import { paginationState, adminListUrl, returnListUrl } from "@/lib/admin/pagination";
import { SchemaField, type MediaContext } from "./SchemaFields";
import HelpTip from "./HelpTip";
import PortableBodyEditor from "./PortableBodyEditor";
import AdminShell from "./AdminShell";
import WritingPreparation from "./WritingPreparation";
import ImageGenerator from "./ImageGenerator";
import JournalFAQ from "@/components/blog/JournalFAQ";
import s from "./local-studio.module.css";
const groups = [
  ["prepare", "1. 작성 준비"],
  ["content", "2. 글 작성"],
  ["seo", "3. 검색 · 공유 설정"],
  ["aeo", "4. 질문과 답변"],
  ["images", "5. 대표 이미지"],
] as const;
const preparationFields = new Set(["focusKeyphrase", "title", "slug", "category", "excerpt"]);
const automaticFields = new Set(["writingGuide", "canonical", "publishedAt", "author", "ogImage", "schemaOrgType", "noindex", "twitterTitle", "twitterDescription"]);
export default function LocalStudio({ email, initialDocument, documentId }: { email: string; initialDocument?: Document; documentId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [source, setSource] = useState<Source>();
  const [copies, setCopies] = useState<LocalCopy[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editor, setEditor] = useState<Document | undefined>(initialDocument);
  const [pending, setPending] = useState<LocalCopy["pendingMedia"]>({});
  const [saved, setSaved] = useState(initialDocument ? JSON.stringify({ document: initialDocument, pendingMedia: {} }) : "");
  const [sourceRev, setSourceRev] = useState<string>();
  const [group, setGroup] = useState("prepare");
  const [aiBusy, setAiBusy] = useState(false);
  const [rewriteTarget, setRewriteTarget] = useState<HTMLDivElement | null>(null);
  const [imageChoice, setImageChoice] = useState<"upload" | "ai" | { method: "upload" | "ai"; uploadValue: Document["mainImage"]; uploadPending?: LocalCopy["pendingMedia"][string] }>("upload");
  const isPublished = !!(editor && source?.states[editor._id]?.publishedRev);
  const imageMethod = typeof imageChoice === "string" ? imageChoice : imageChoice.method;
  const [bodyVersion, setBodyVersion] = useState(0);
  const urlQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState({ urlQuery, value: urlQuery });
  const query = searchInput.urlQuery === urlQuery ? searchInput.value : urlQuery;
  const [preview, setPreview] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const backupRevision = useRef<string | undefined>(undefined);
  const backupQueue = useRef<Promise<void>>(Promise.resolve());
  const dirty =
    !!editor &&
    JSON.stringify({ document: editor, pendingMedia: pending }) !== saved;
  useEffect(() => {
    let active = true;
    async function load() {
      let local: LocalCopy[] = [];
      try {
        local = await loadCopies();
        if (active)
          setCopies(
            local.filter((copy) => copy.document._type === "journalPost"),
          );
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "이 브라우저에 보관된 미저장 내용을 읽지 못했습니다.",
          );
      }
      try {
        const response = await fetch("/admin/content", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (active) {
          setSource(data);
          if (documentId) {
            const remoteDoc = data.documents.find((d: Document) => d._id === documentId);
            const copy = local.find(c => c.id === documentId);
            const recover = copy && (!remoteDoc || copy.sourceRev === remoteDoc._rev);
            const doc = recover ? copy.document : remoteDoc;
            if (!doc) throw new Error("글을 찾을 수 없습니다. 글 목록에서 다시 선택해 주세요.");
            backupRevision.current = copy?.revision;
            setEditor(doc);
            const media = recover ? copy.pendingMedia : {};
            setPending(media);
            setSaved(JSON.stringify({ document: remoteDoc || {}, pendingMedia: {} }));
            setSourceRev(recover ? copy.sourceRev : doc._rev);
            if (recover) setMessage("이 브라우저에 보관된 미저장 수정본을 복구했습니다. 확인 후 임시 저장하세요.");
            else if (copy) setMessage("이 브라우저에 보관된 내용과 저장된 글이 다릅니다. 저장된 글을 표시합니다.");
          }
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "저장된 글을 불러오지 못했습니다.",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [documentId]);
  useEffect(() => {
    if (!editor || !dirty || loading || saving) return;
    const document = structuredClone(editor), media = structuredClone(pending), revision = crypto.randomUUID();
    backupQueue.current = backupQueue.current.then(async () => {
      const copy: LocalCopy = { id: document._id, document, sourceRev, pendingMedia: media, savedAt: new Date().toISOString(), revision };
      await saveCopy(copy, backupRevision.current);
      backupRevision.current = revision;
      setCopies(previous => [...previous.filter(c => c.id !== copy.id), copy]);
    }).catch(e => setError(e instanceof Error ? e.message : "브라우저 복구본을 보관하지 못했습니다. 수정본을 내려받아 주세요."));
  }, [editor, dirty, loading, saving, pending, sourceRev]);
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  useEffect(() => {
    const guardNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("header[data-site-navigation] a") : null;
      if (!link || (!(dirty || saving || aiBusy)) || (link as HTMLAnchorElement).target === "_blank") return;
      if (saving || aiBusy || !window.confirm("저장하지 않은 변경이 있습니다. 홈페이지로 이동할까요?")) {
        event.preventDefault(); event.stopPropagation();
      }
    };
    document.addEventListener("click", guardNavigation, true);
    return () => document.removeEventListener("click", guardNavigation, true);
  }, [dirty, saving, aiBusy]);
  useEffect(() => {
    if (!preview) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [preview]);
  const documents = useMemo(() => {
    const remote = (source?.documents || []).filter(
      (doc) => doc._type === "journalPost",
    );
    return [
      ...copies
        .filter(
          (c) =>
            c.document._type === "journalPost" &&
            !c.archived &&
            !remote.some((d) => d._id === c.id),
        )
        .map((c) => c.document),
      ...remote,
    ];
  }, [source, copies]);
  const visible = documents.filter((d) =>
    (text(d.title) + " " + text(d.focusKeyphrase))
      .toLowerCase()
      .includes((searchParams.get("q") || "").toLowerCase()),
  );
  const { page, pages: pageCount, start, end } = paginationState(visible.length, searchParams.get("page"));
  const pageDocuments = visible.slice(start, end);
  function listUrl(nextPage: number, nextQuery = searchParams.get("q") || "") {
    return adminListUrl(nextPage, nextQuery);
  }
  const selectedDocuments = documents.filter(doc => selectedIds.includes(doc._id));
  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds(previous => checked ? [...new Set([...previous, id])] : previous.filter(value => value !== id));
  }
  async function deleteSelected() {
    if (deleting || !selectedDocuments.length) return;
    setDeleting(true); setError("");
    const ids = selectedDocuments.map(doc => doc._id);
    const remoteTargets = ids.filter(id => source?.documents.some(doc => doc._id === id)).map(id => ({ id, ...source!.states[id] }));
    let remoteDeleted = false;
    try {
      if (remoteTargets.length) {
        const response = await fetch("/admin/content", { method: "DELETE", headers: { "Content-Type": "application/json", "x-ivy-admin-request": "1" }, body: JSON.stringify({ targets: remoteTargets }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "글을 삭제하지 못했습니다.");
        remoteDeleted = true;
        if (result.source) setSource(result.source);
        else setSource(previous => previous ? { ...previous, documents: previous.documents.filter(doc => !result.deleted.includes(doc._id)), states: Object.fromEntries(Object.entries(previous.states).filter(([id]) => !result.deleted.includes(id))) } : previous);
      }
      for (const copy of copies.filter(copy => ids.includes(copy.id))) {
        await saveCopy({ ...copy, archived: true, revision: crypto.randomUUID() }, copy.revision);
      }
      setCopies(previous => previous.filter(copy => !ids.includes(copy.id)));
      setSelectedIds([]); setDeleteConfirmation(false);
      setMessage(`${ids.length}개 글을 삭제했습니다.`);
    } catch (e) {
      setError((remoteDeleted ? "저장된 글은 삭제했지만 브라우저 복구본 정리가 완료되지 않았습니다. " : "") + (e instanceof Error ? e.message : "글을 삭제하지 못했습니다."));
    } finally { setDeleting(false); }
  }
  function open(doc: Document) {
    if (aiBusy || saving) return;
    if (
      dirty &&
      !window.confirm(
        "아직 저장하지 않은 변경이 있습니다. 변경을 버리고 이동할까요?",
      )
    )
      return;
    const destination = doc._id.startsWith("local.") && !copies.some(c => c.id === doc._id) ? "/admin/write" : `/admin/edit/${encodeURIComponent(doc._id)}`;
    router.push(`${destination}?returnTo=${encodeURIComponent(listUrl(page))}`);
  }
  function back() {
    if (saving || aiBusy) return;
    if (
      dirty &&
      !window.confirm(
        "아직 저장하지 않은 변경이 있습니다. 변경을 버리고 이동할까요?",
      )
    )
      return;
    router.push(returnListUrl(searchParams.get("returnTo")));
  }
  async function post(url: string, body: unknown) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ivy-admin-request": "1",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "요청에 실패했습니다.");
    return data as { document: Document; source: Source };
  }
  async function save(publish = false) {
    if (!editor || saving || aiBusy) return;
    setSaving(true);
    setError("");
    setMessage("");
    let document = structuredClone(editor);
    let expectedRevision = sourceRev;
    const publishedRevision = source?.states[editor._id]?.publishedRev;
    const uploaded = { ...pending };
    try {
      // Update the working copy after each upload, so a retry never loses successful uploads.
      for (const [path, file] of Object.entries(pending)) {
        const bodyKey = path.startsWith("body.") ? path.slice(5) : undefined;
        if (
          bodyKey &&
          !document.body?.some((b) => b._key === bodyKey && b._type === "image")
        ) {
          delete uploaded[path];
          continue;
        }
        if (path !== "mainImage" && path !== "ogImage" && !bodyKey)
          throw new Error("알 수 없는 이미지 위치입니다.");
        const blob = await (await fetch(file.dataUrl)).blob();
        const form = new FormData();
        form.append("file", blob, file.name);
        const response = await fetch("/admin/assets", {
          method: "POST",
          headers: { "x-ivy-admin-request": "1" },
          body: form,
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "이미지 업로드에 실패했습니다.");
        const asset = { _type: "reference", _ref: data.asset._id };
        if (path === "mainImage") {
          const existing = typeof document.mainImage === "object" && document.mainImage ? document.mainImage : {};
          document.mainImage = { ...existing, _type: "image", asset };
        }
        else if (path === "ogImage") {
          const {
            crop: _crop,
            hotspot: _hotspot,
            ...existing
          } = (document.ogImage || {}) as ImageValue;
          void _crop;
          void _hotspot;
          document.ogImage = { ...existing, _type: "image", asset };
        } else
          document.body = document.body?.map((b) => {
            if (b._key !== bodyKey) return b;
            const {
              crop: _crop,
              hotspot: _hotspot,
              ...existing
            } = b as typeof b & ImageValue;
            void _crop;
            void _hotspot;
            return { ...existing, asset };
          });
        delete uploaded[path];
        setEditor(structuredClone(document));
        setPending({ ...uploaded });
        setSource((previous) =>
          previous
            ? {
                ...previous,
                assets: [
                  data.asset,
                  ...previous.assets.filter((a) => a._id !== data.asset._id),
                ],
              }
            : previous,
        );
      }
      const result = await post("/admin/content", {
        document,
        expectedRevision,
      });
      document = result.document;
      expectedRevision = document._rev;
      setEditor(document);
      setSource(result.source);
      setSourceRev(expectedRevision);
      setPending({});
      setSaved(JSON.stringify({ document, pendingMedia: {} }));
      const oldId = editor._id;
      if (oldId !== document._id) {
        try {
          const preparation = localStorage.getItem(`jj-writing-preparation:${oldId}`);
          if (preparation) localStorage.setItem(`jj-writing-preparation:${document._id}`, preparation);
        } catch { /* The saved article remains available if browser storage is unavailable. */ }
      }
      // Remote save is already successful; failure to tidy a browser backup must not hide it.
      try {
        await backupQueue.current;
        await removeCopy(oldId, backupRevision.current);
        backupRevision.current = undefined;
        setCopies((cs) => cs.filter((c) => c.id !== oldId));
      } catch {
        /* Kept for recovery, remote version takes precedence. */
      }
      setMessage(
        publishedRevision
          ? "수정본을 저장했습니다. 발행이 완료되어야 홈페이지에 반영됩니다."
          : "임시저장했습니다. 아직 홈페이지에는 공개되지 않습니다.",
      );
      if (publish) {
        const published = await post("/admin/publish", {
          id: document._id,
          revision: expectedRevision,
          publishedRevision,
        });
        setEditor(published.document);
        setSource(published.source);
        setSourceRev(published.document._rev);
        setSaved(
          JSON.stringify({ document: published.document, pendingMedia: {} }),
        );
        setMessage(
          publishedRevision
            ? "수정 내용을 발행했습니다. 홈페이지에 반영되었습니다."
            : "발행완료되었습니다. 홈페이지에서 글을 확인할 수 있습니다.",
        );
      }
      if (oldId !== document._id) router.replace(`/admin/edit/${encodeURIComponent(document._id)}?returnTo=${encodeURIComponent(returnListUrl(searchParams.get("returnTo")))}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }
  const media: MediaContext | undefined = source
    ? {
        source,
        title: editor?.title,
        pending,
        busy: saving || aiBusy,
        onBusy: setAiBusy,
        setPending: (path, value) =>
          setPending((previous) => {
            const next = { ...previous };
            if (value) next[path] = value;
            else delete next[path];
            return next;
          }),
      }
    : undefined;
  function selectImageMethod(method: "upload" | "ai") {
    if (!editor || !media || imageMethod === method) return;
    if (method === "ai") {
      setImageChoice({ method, uploadValue: editor.mainImage, uploadPending: pending.mainImage });
    } else {
      if (typeof imageChoice !== "string") {
        setEditor({ ...editor, mainImage: imageChoice.uploadValue });
        media.setPending("mainImage", imageChoice.uploadPending);
      }
      setImageChoice("upload");
    }
  }
  const uploadMedia = media ? { ...media, pending: { ...pending } } : undefined;
  if (uploadMedia && imageMethod === "ai" && typeof imageChoice !== "string") {
    if (imageChoice.uploadPending) uploadMedia.pending.mainImage = imageChoice.uploadPending;
    else delete uploadMedia.pending.mainImage;
  }
  const aiMedia = media ? { ...media, setPending: (path: string, value?: LocalCopy["pendingMedia"][string]) => {
    if (path === "mainImage" && typeof imageChoice === "string" && editor) {
      setImageChoice({ method: "ai", uploadValue: editor.mainImage, uploadPending: pending.mainImage });
    }
    media.setPending(path, value);
  } } : undefined;
  const auditPost = editor
    ? ({
        ...editor,
        ogImage: undefined,
        title: text(editor.title),
        publishedAt: text(editor.publishedAt),
        slug: { current: text(editor.slug?.current) },
        pendingUploads: Object.keys(pending).length,
      } as PostAudit)
    : undefined;
  const seoChecks = auditPost
    ? CHECKS.map((c) => ({ ...c, result: checkField(auditPost, c) }))
    : [];
  const bodyChecks = editor
    ? analyzeBody((editor.body || []) as PTBlock[], text(editor.focusKeyphrase))
    : [];
  const remote = source?.documents.find((d) => d._id === editor?._id);
  const conflict = !!remote && !!sourceRev && remote._rev !== sourceRev;
  return (
    <AdminShell email={email} title={editor ? "글 편집" : "글 관리"} documentCount={documents.length} unsavedChanges={dirty} disabled={saving || aiBusy}
      onNavigate={event => {
        if (saving || aiBusy || (dirty && !window.confirm("미저장 수정본은 이 브라우저에 보관됩니다. 다른 화면으로 이동할까요?"))) event.preventDefault();
      }}
      >
        <div className={s.content}>
          {error && (
            <div role="alert" className={s.error}>
              {error}
              <button onClick={() => setError("")} aria-label="오류 닫기">
                <X size={15} />
              </button>
            </div>
          )}
          {message && (
            <div role="status" className={s.success}>
              <Check size={16} />
              {message}
            </div>
          )}
          {loading && (initialDocument || documentId) ? <p role="status" className={s.hint}>작성 화면과 저장된 글을 불러오고 있습니다…</p> : !editor || !media ? (
            <>
              <div className={s.pageHeading}>
                <div>
                  <p className={s.eyebrow}>클래스룸 소식 관리</p>
                  <h1>글 관리</h1>
                  <p className={s.listCounts}>발행완료 {documents.filter(doc => source?.states[doc._id]?.publishedRev).length}개 · 임시저장 {documents.filter(doc => source?.states[doc._id]?.draftRev).length}개{documents.some(doc => !source?.documents.some(saved => saved._id === doc._id)) ? ` · 저장 전 ${documents.filter(doc => !source?.documents.some(saved => saved._id === doc._id)).length}개` : ""}</p>
                </div>
                <div className={s.actions}>
                  <button
                    disabled={!source}
                    className={s.primary}
                    onClick={() => open(newDocument("journalPost"))}
                  >
                    + 저널 쓰기
                  </button>
                </div>
              </div>
              <div className={s.listTools}>
                <div className={s.selectionTools}>
                <label className={s.selectAll}><input type="checkbox" aria-label="현재 페이지 글 전체 선택" disabled={deleting || !pageDocuments.length} checked={!!pageDocuments.length && pageDocuments.every(doc => selectedIds.includes(doc._id))} onChange={e => setSelectedIds(previous => e.target.checked ? [...new Set([...previous, ...pageDocuments.map(doc => doc._id)])] : previous.filter(id => !pageDocuments.some(doc => doc._id === id)))} />전체 선택</label>
                <button className={s.deleteButton} disabled={deleting || !selectedDocuments.length} onClick={() => setDeleteConfirmation(true)}><Trash2 size={15} />선택 삭제{selectedDocuments.length ? ` (${selectedDocuments.length})` : ""}</button>
                </div>
                <div className={s.searchTools}>
                <label className={s.search}>
                  <Search size={16} />
                  <input
                    aria-label="글 검색"
                    placeholder="제목 또는 핵심 키워드 검색"
                    value={query}
                    onChange={(e) => setSearchInput({ urlQuery, value: e.target.value })}
                    onKeyDown={e => { if (e.key === "Enter") router.push(listUrl(1, query)); }}
                  />
                </label>
                <button className={s.secondary} onClick={() => router.push(listUrl(1, query))}>검색</button>
                </div>
              </div>
              <div className={s.panel}>
                {loading && !source ? (
                  <p className={s.empty}>저장된 글을 불러오고 있습니다…</p>
                ) : visible.length === 0 ? (
                  <p className={s.empty}>
                    {source
                      ? "해당하는 글이 없습니다."
                      : "저장된 글을 불러오지 못했습니다. 페이지를 새로고침해 주세요."}
                  </p>
                ) : (
                  <div className={s.articleList}>
                    {pageDocuments.map((doc) => {
                      const original = source?.documents.some(
                        (d) => d._id === doc._id,
                      );
                      const src = source ? imageUrl(doc.mainImage, source) : "";
                      return (
                        <div className={s.articleListItem} key={doc._id}>
                        <input className={s.articleSelect} type="checkbox" aria-label={`${doc.title || "제목 없는 새 글"} 선택`} checked={selectedIds.includes(doc._id)} disabled={deleting} onChange={e => toggleSelection(doc._id, e.target.checked)} />
                        <button
                          className={s.articleRow}
                          disabled={!source || deleting}
                          onClick={() => open(doc)}
                        >
                          {src ? (
                            <img src={src} alt="" />
                          ) : (
                            <div className={s.thumb}>
                              <FileText size={24} />
                            </div>
                          )}
                          <div className={s.rowTitle}>
                            <span>
                              {typeLabels[doc._type]} ·{" "}
                              {adminGuidance(text(doc.category)) || "분류 미입력"}
                            </span>
                            <h2>{doc.title || "제목 없는 새 글"}</h2>
                            <p>{text(doc.excerpt)}</p>
                          </div>
                          <div className={s.rowMeta}>
                            <span
                              className={source?.states[doc._id]?.draftRev || !original ? s.draftBadge : s.publishedBadge}
                            >
                              {source?.states[doc._id]?.draftRev ? "임시저장" : original ? "발행완료" : "저장 전"}
                            </span>
                            <small>
                              {text(doc.publishedAt).slice(0, 10) ||
                                "날짜 없음"}
                            </small>
                            <small>
                              {original
                                ? source?.states[doc._id]?.draftRev && source?.states[doc._id]?.publishedRev ? "발행된 글의 수정본" : ""
                                : "아직 저장하지 않은 글"}
                            </small>
                          </div>
                          <ArrowUpRight size={19} />
                        </button>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <nav className={s.pagination} aria-label="글 목록 페이지">
                <span>{visible.length}개 · {page} / {pageCount} 페이지</span>
                {page > 1 && <Link href={listUrl(page - 1)}>이전</Link>}
                {Array.from({ length: pageCount }, (_, i) => i + 1).filter(n => n === 1 || n === pageCount || Math.abs(n - page) <= 2).map(n => <Link key={n} href={listUrl(n)} aria-current={page === n ? "page" : undefined}>{n}</Link>)}
                {page < pageCount && <Link href={listUrl(page + 1)}>다음</Link>}
              </nav>
              {deleteConfirmation && <div className={s.overlay}><section className={s.deleteDialog} role="dialog" aria-modal="true" aria-label="선택한 글 삭제 확인">
                <h2>선택한 글 {selectedDocuments.length}개를 삭제할까요?</h2>
                <ul>{selectedDocuments.map(doc => <li key={doc._id}>{doc.title || "제목 없는 글"}</li>)}</ul>
                <p>저장된 글은 복구할 수 없습니다. 발행완료된 글은 홈페이지에서도 삭제됩니다.</p>
                <div className={s.actions}><button className={s.secondary} disabled={deleting} onClick={() => setDeleteConfirmation(false)}>취소</button><button className={s.deleteButton} disabled={deleting} onClick={() => void deleteSelected()}>{deleting ? "삭제 중…" : "삭제 확인"}</button></div>
              </section></div>}
            </>
          ) : (
            <>
              <div className={s.editorTop}>
                <button className={s.textButton} onClick={back}>
                  <ArrowLeft size={15} />글 목록
                </button>
                <div className={s.actions}>
                  <span className={s.hint}>
                    {dirty
                      ? "저장하지 않은 변경"
                      : sourceRev
                        ? "저장됨"
                        : "저장 전"}
                  </span>
                  <button
                    className={s.secondary}
                    onClick={() => setPreview(true)}
                  >
                    미리보기
                  </button>
                  <HelpTip text={isPublished ? "수정 내용과 선택한 이미지를 저장하고 홈페이지에 바로 반영합니다." : "현재 내용을 임시저장합니다. 홈페이지에는 공개되지 않습니다."}><button
                    className={s.primary}
                    disabled={saving || aiBusy}
                    onClick={() => void save(isPublished)}
                  >
                    <Save size={15} />
                    {saving ? isPublished ? "발행 중…" : "저장 중…" : isPublished ? "수정하고 발행" : "임시 저장"}
                  </button></HelpTip>
                  {!isPublished && <HelpTip text="현재 내용을 저장하고 홈페이지에 공개합니다."><button
                    className={s.primary}
                    disabled={saving || aiBusy}
                    onClick={() => void save(true)}
                  >
                    {saving ? "발행 중…" : "발행"}
                  </button></HelpTip>}
                </div>
              </div>
              <div className={s.editorHeading}>
                <span className={s.eyebrow}>{typeLabels[editor._type]}</span>
                <h1>{editor.title || "새 글 작성"}</h1>

              </div>
              {conflict && (
                <p className={s.error}>
                  작성을 시작한 뒤 저장된 글이 변경되었습니다. 최신 글과
                  비교하기 전에는 운영 글에 반영하면 안 됩니다.
                </p>
              )}
              <div className={s.editorGrid} inert={saving}>
                <div>
                  <div
                    className={s.tabs}
                    role="tablist"
                    aria-label="글 입력 항목"
                  >
                    {groups.map(([id, title]) => (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={group === id}
                        className={group === id ? s.tabActive : ""}
                        onClick={() => setGroup(id)}
                      >
                        {title}
                        {id !== "prepare" && <small>
                          {
                            schemas[editor._type].fields.filter(
                              (f) =>
                                (f.name === "mainImage" ? "images" : f.group === "social" ? "seo" : f.group) ===
                                  id && !automaticFields.has(f.name) && !preparationFields.has(f.name),
                            ).length
                          }
                        </small>}
                      </button>
                    ))}
                  </div>
                  <div className={s.formPanel}>
                    <section role="tabpanel" hidden={group !== "prepare"}>
                      {media && <WritingPreparation key={editor._id} document={editor} context={media} rewriteTarget={rewriteTarget} contentActive={group === "content"} disabled={saving} onChange={(next) => {
                        if (JSON.stringify(next.body) !== JSON.stringify(editor.body)) setBodyVersion((version) => version + 1);
                        setEditor(next);
                      }} onContinue={() => setGroup("content")} onBusy={setAiBusy} />}
                    </section>
                    {groups.map(([id]) => (
                      id !== "prepare" && <section key={id} role="tabpanel" hidden={group !== id} className={id === "images" ? s.imageOptions : undefined}>
                        {schemas[editor._type].fields
                          .filter(
                            (f) =>
                              (f.name === "mainImage" ? "images" : f.group === "social" ? "seo" : f.group) === id &&
                              !automaticFields.has(f.name) && !preparationFields.has(f.name),
                          )
                          .map((field, index, fields) => (
                            <div
                              className={id === "images" ? s.imageUploadCard : s.formBlock}
                              key={`${editor._id}.${field.name}`}
                            >
                              {(index === 0 ||
                                field.name === "mainImage" ||
                                field.name === "body" ||
                                field.group !== fields[index - 1]?.group) && (
                                <h2 className={s.formSectionTitle}>
                                  {id === "images" ? <label className={s.imageMethod}><input type="radio" name="representative-image-method" checked={imageMethod === "upload"} disabled={saving || aiBusy} onChange={() => selectImageMethod("upload")} />이미지 업로드</label> : field.name === "body"
                                    ? "본문 작성"
                                    : field.name === "mainImage"
                                      ? "이미지 업로드"
                                      : field.group === "content"
                                        ? "글 기본 정보"
                                        : field.group === "social"
                                          ? "공유 설정"
                                          : field.group === "aeo"
                                            ? "질문과 답변"
                                            : "검색 설정"}
                                </h2>
                              )}
                              <fieldset className={id === "images" ? s.imageControls : s.fieldWrapper} disabled={id === "images" && imageMethod !== "upload"}>
                              <SchemaField
                                key={`${editor._id}.${field.name}`}
                                field={field}
                                path={field.name}
                                value={field.name === "mainImage" && imageMethod === "ai" && typeof imageChoice !== "string" ? imageChoice.uploadValue : editor[field.name]}
                                context={field.name === "mainImage" ? uploadMedia! : media!}
                                onChange={(v) =>
                                  setEditor((d) =>
                                    d ? { ...d, [field.name]: v } : d,
                                  )
                                }
                                body={
                                  field.name === "body" ? (
                                    <PortableBodyEditor
                                      key={`${editor._id}:${bodyVersion}`}
                                      value={editor.body}
                                      type={editor._type}
                                      context={media!}
                                      onChange={(body) =>
                                        setEditor((d) =>
                                          d ? { ...d, body } : d,
                                        )
                                      }
                                    />
                                  ) : undefined
                                }
                              />
                              </fieldset>
                            </div>
                          ))}
                        {id === "content" && <div ref={setRewriteTarget} />}
                        {id === "images" && <ImageGenerator key={editor._id} title={text(editor.title)} summary={text(editor.excerpt)} body={(editor.body || []) as PTBlock[]} context={aiMedia!} onBusy={setAiBusy} disabled={saving || aiBusy} active={imageMethod === "ai"} onSelect={() => selectImageMethod("ai")} />}
                      </section>
                    ))}
                  </div>
                </div>
                <aside className={s.inspector} aria-label="검색 및 본문 점검">
                  {group !== "content" && <div className={s.auditCard}>
                    <p className={s.eyebrow}>검색 점검</p>
                    <p className={s.hint}>필수 수정 {seoChecks.filter(c => c.group === "required" && c.result === "fail").length}개</p>
                    {AUDIT_GROUPS.map(category => (
                      <div key={category.key} className={s.auditGroup}>
                        <strong>{category.label}</strong>
                        <ul>
                          {seoChecks.filter(c => c.group === category.key).map(c => (
                            <li key={c.key}>
                              <HelpTip text={checkMessage(auditPost!, c)}>
                                <button className={c.result === "pass" ? s.checkPass : c.result === "info" ? undefined : s.checkMissing} aria-label={`${c.label}${c.result === "pass" ? " · 확인됨" : c.result === "info" ? " · 참고" : " · 확인 필요"}`} onClick={() => {
                                  const field = schemas[editor._type].fields.find(f => f.name === c.field);
                                  setGroup(c.field === "mainImage" || c.field === "ogImage" ? "images" : preparationFields.has(c.field) ? "prepare" : field?.group === "social" ? "seo" : field?.group || "seo");
                                  setTimeout(() => {
                                    const target = document.getElementById(`field-${c.field === "ogImage" ? "mainImage" : c.field}`);
                                    const details = target?.closest("details");
                                    if (details) details.open = true;
                                    target?.focus();
                                  }, 0);
                                }}>{c.label}</button>
                              </HelpTip>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>}
                  {group === "content" && <details className={s.auditCard} open>
                    <summary>글 작성 가이드 · 본문 점검</summary>
                    <p className={s.hint}>분량·키워드 반복·소제목 개수는 검색 합격 조건이 아닙니다.</p>
                    {AUDIT_GROUPS.map(category => {
                      const checks = bodyChecks.filter(c => c.group === category.key);
                      return checks.length ? <div key={category.key} className={s.auditGroup}>
                        <strong>{category.label}</strong>
                        {checks.map(c => <div key={c.key} className={s.bodyCheck}>
                          <strong className={c.status === "pass" ? s.checkPass : c.status === "info" ? undefined : s.checkMissing} aria-label={`${c.key}${c.status === "pass" ? " · 확인됨" : c.status === "info" ? " · 참고" : " · 확인 필요"}`}>{c.key}</strong>
                          <p>{c.message}</p>
                          {c.hint && <small>{c.hint}</small>}
                        </div>)}
                      </div> : null;
                    })}
                  </details>}
                </aside>
              </div>

            </>
          )}
        </div>
      {preview && editor && source && (
        <div className={s.overlay} onClick={() => setPreview(false)}>
          <section
            className={s.preview}
            role="dialog"
            aria-modal="true"
            aria-label="글 미리보기"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <strong>미리보기</strong>
              <button
                autoFocus
                onClick={() => setPreview(false)}
                aria-label="미리보기 닫기"
              >
                <X size={19} />
              </button>
            </header>
            <article>
              <p className={s.eyebrow}>
                {text(editor.category)}
              </p>
              <h1>{editor.title}</h1>
              <p>{text(editor.excerpt)}</p>
              {(pending.mainImage?.dataUrl ||
                imageUrl(editor.mainImage, source)) && (
                <img
                  className={s.previewHero}
                  src={
                    pending.mainImage?.dataUrl ||
                    imageUrl(editor.mainImage, source)
                  }
                  alt={text((editor.mainImage as ImageValue)?.alt)}
                />
              )}
              <PortableText
                value={editor.body || []}
                components={{
                  types: {
                    image: ({ value }) => (
                      <img
                        src={
                          pending[`body.${value._key}`]?.dataUrl ||
                          imageUrl(value, source)
                        }
                        alt={text(value.alt)}
                      />
                    ),
                    checklistBlock: ({ value }) => (
                      <ul>
                        {((value.items as string[]) || []).map((item, i) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                      </ul>
                    ),
                    tableBlock: ({ value }) => (
                      <table>
                        <thead>
                          <tr>
                            <th>기간</th>
                            <th>집중 영역</th>
                            <th>주간 목표</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            (value.rows || []) as Record<string, unknown>[]
                          ).map((row) => (
                            <tr key={text(row._key)}>
                              <td>{text(row.phase)}</td>
                              <td>{text(row.focus)}</td>
                              <td>{text(row.goal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ),
                  },
                  marks: {
                    link: ({ value, children }) =>
                      /^(https?:\/\/|mailto:|tel:|\/[^/]|#)/i.test(
                        text(value?.href),
                      ) ? (
                        <a href={value.href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      ) : (
                        <span>{children}</span>
                      ),
                  },
                }}
              />
              <JournalFAQ items={editor.faqSection || []} />
            </article>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
