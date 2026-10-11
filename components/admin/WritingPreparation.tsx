"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { text, type Document, schemas } from "@/lib/local-studio";
import type { BodyWritingResult, Preparation, WritingResult } from "@/lib/admin/ai-writing";
import { applyTitleChoice, applyDraft, hasDraftContent, hasProtectedBody, previewBody, writingPatch, type DraftArea } from "@/lib/admin/ai-draft";
import { SchemaField, type MediaContext } from "./SchemaFields";
import HelpTip from "./HelpTip";
import s from "./local-studio.module.css";

export default function WritingPreparation({ document, context, onChange, onContinue, onBusy, rewriteTarget, contentActive, disabled }: {
  document: Document; context: MediaContext;
  onChange: (document: Document) => void; onContinue: () => void; onBusy: (busy: boolean) => void;
  rewriteTarget: HTMLDivElement | null; contentActive: boolean; disabled: boolean;
}) {
  const [keyword, setKeyword] = useState(text(document.focusKeyphrase));
  const [notes, setNotes] = useState(() => (document.body || []).filter(b => b._type === "block").map(b => (Array.isArray(b.children) ? b.children : []).map(c => typeof c.text === "string" ? c.text : "").join("")).join("\n\n"));
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<"prepare" | "generate" | "">("");
  const [error, setError] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [preparation, setPreparation] = useState<Preparation>();
  const [preparedSource, setPreparedSource] = useState("");
  const [generatedSource, setGeneratedSource] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [proposal, setProposal] = useState<{ baseline: Document; patch: Partial<Document>; source: string; bodyOnly: boolean; applied?: boolean }>();
  const [areas, setAreas] = useState<DraftArea[]>(["content", "seo", "aeo"]);
  const selectedSlug = useRef<string | undefined>(undefined);
  const source = JSON.stringify({ keyword, notes, title: document.title, slug: document.slug?.current, summary: document.excerpt, focusKeyphrase: document.focusKeyphrase, category: document.category });
  const original = JSON.stringify({ keyword, notes, category: document.category });
  const current = useRef({ document, source, original });
  useEffect(() => { current.current = { document, source, original }; }, [document, source, original]);
  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const stored = await Promise.resolve().then(() => localStorage.getItem(`jj-writing-preparation:${document._id}`));
        if (active && stored) {
          const data = JSON.parse(stored);
          if (typeof data.keyword === "string") setKeyword(data.keyword);
          if (typeof data.notes === "string") setNotes(data.notes);
        }
      } catch { /* Editing remains available if browser storage is unavailable. */ }
      if (active) setReady(true);
    }
    void restore();
    return () => { active = false; };
  }, [document._id]);
  useEffect(() => { if (ready) { try { localStorage.setItem(`jj-writing-preparation:${document._id}`, JSON.stringify({ keyword, notes })); } catch { /* Keep the current inputs in memory. */ } } }, [ready, keyword, notes, document._id]);
  async function request(action: "prepare" | "generate", rewrite = false) {
    if (busy || disabled || !ready) return;
    if (!keyword.trim() || !notes.trim()) { setError("핵심 검색 키워드와 원문·메모를 먼저 입력해 주세요."); return; }
    if (action === "generate" && (!text(document.title).trim() || !document.slug?.current || !text(document.excerpt).trim() || !text(document.focusKeyphrase).trim())) {
      setError("영어 제목·글 주소·영어 요약·영어 핵심 검색어를 먼저 확인해 주세요."); return;
    }
    const baseline = structuredClone(document), snapshot = source, originalSnapshot = original;
    setBusy(action); onBusy(true); setError("");
    try {
      const response = await fetch("/admin/ai", { method: "POST", headers: { "Content-Type": "application/json", "x-ivy-admin-request": "1" },
        body: JSON.stringify({ action, scope: rewrite ? "content" : "all", keyword, notes, category: document.category || "", title: document.title, slug: document.slug?.current, summary: document.excerpt, focusKeyphrase: document.focusKeyphrase }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI 요청을 완료하지 못했습니다.");
      if (current.current.source !== snapshot) throw new Error("요청 중 작성 내용이 변경되었습니다. 오래된 AI 결과는 적용하지 않았습니다. 다시 요청해 주세요.");
      if (action === "prepare") {
        const result = data.result as Preparation;
        setPreparation(result); setPreparedSource(originalSnapshot); setWarnings(result.warnings);
      } else {
        const result = data.result as WritingResult | BodyWritingResult, patch = writingPatch(result);
        setWarnings(result.warnings);
        if (rewrite && !hasProtectedBody(current.current.document)) {
          onChange(applyDraft(current.current.document, baseline, patch, ["content"]));
          setProposal({ baseline, patch, source: snapshot, bodyOnly: true, applied: true });
          setGeneratedSource(snapshot); onContinue();
        }
        else if (!rewrite && !hasDraftContent(baseline)) { onChange(applyDraft(current.current.document, baseline, patch, ["content", "seo", "aeo"])); setGeneratedSource(snapshot); onContinue(); }
        else { setProposal({ baseline, patch, source: snapshot, bodyOnly: rewrite }); setAreas(rewrite ? hasProtectedBody(current.current.document) ? [] : ["content"] : hasProtectedBody(current.current.document) ? ["seo", "aeo"] : ["content", "seo", "aeo"]); }
      }
    } catch (e) { setError(e instanceof Error ? e.message : "AI 요청에 실패했습니다."); }
    finally { setBusy(""); onBusy(false); }
  }
  function apply() {
    const selectedAreas = areas.filter(area => (!proposal?.bodyOnly || area === "content") && (area !== "content" || !hasProtectedBody(current.current.document)));
    if (!proposal || !selectedAreas.length) return;
    try {
      if (proposal.source !== current.current.source) throw new Error("작성 준비가 변경되었습니다. 새 내용으로 다시 생성해 주세요.");
      onChange(applyDraft(current.current.document, proposal.baseline, proposal.patch, selectedAreas));
      setGeneratedSource(proposal.source); setProposal(proposal.bodyOnly ? { ...proposal, applied: true } : undefined); setError(""); onContinue();
    } catch (e) { setError(e instanceof Error ? e.message : "적용하지 못했습니다."); }
  }
  function restorePrevious() {
    if (!proposal?.applied || busy || disabled) return;
    try {
      const restored = applyDraft(current.current.document, { ...proposal.baseline, body: proposal.patch.body }, { body: proposal.baseline.body }, ["content"]);
      onChange(restored); setProposal(undefined); setGeneratedSource(""); setWarnings([]); setError("");
    } catch { setError("재작성 이후 본문이 수정되었습니다. 이전 내용 보기를 참고해 필요한 내용을 직접 복원해 주세요."); }
  }
  const feedback = <>
    {error && <p className={s.error} role="alert">{error}</p>}
    {!!warnings.length && <div className={s.writingGuide}><strong>발행 전 확인 사항</strong><ul>{warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></div>}
    {proposal?.applied && <div className={s.writingGuide}>
      <p>재작성한 내용을 본문에 넣었습니다. 확인 후 저장하세요.</p>
      <details><summary>이전 내용 보기</summary><pre className={s.previousBody}>{previewBody(proposal.baseline)}</pre></details>
      <button type="button" className={s.secondary} disabled={!!busy || disabled} onClick={restorePrevious}>이전 내용으로 되돌리기</button>
    </div>}
    {proposal && !proposal.applied && <div className={s.writingGuide}>
      <h2 className={s.formSectionTitle}>기존 내용과 비교 후 적용</h2><p>새 초안에서 바꿀 영역만 선택하세요.</p>
      {hasProtectedBody(document) && <p>본문에 사진·표 등의 자료가 있어 글 작성 영역은 교체하지 않습니다. 아래 AI 초안을 참고해 본문을 직접 수정하세요.{!proposal.bodyOnly && " 검색·공유 설정과 질문과 답변은 적용할 수 있습니다."}</p>}
      {((proposal.bodyOnly ? ["content"] : ["content", "seo", "aeo"]) as DraftArea[]).map(area => <div key={area}>
        <label className={s.areaChoice}><input type="checkbox" disabled={area === "content" && hasProtectedBody(document)} checked={areas.includes(area) && !(area === "content" && hasProtectedBody(document))} onChange={e => setAreas(previous => e.target.checked ? [...previous, area] : previous.filter(a => a !== area))} />{area === "content" ? "2. 글 작성" : area === "seo" ? "3. 검색·공유 설정" : "4. 질문과 답변"}</label>
        <details><summary>현재 내용과 AI 초안 보기</summary><div className={s.compareGrid}><div><strong>현재 내용</strong><pre>{previewArea(document, area)}</pre></div><div><strong>AI 초안</strong><pre>{previewArea(proposal.patch, area)}</pre></div></div></details>
      </div>)}
      <div className={s.actions}><button type="button" className={s.primary} disabled={!areas.length || !!busy || disabled} onClick={apply}>선택한 영역에 적용</button><button type="button" className={s.secondary} onClick={() => setProposal(undefined)}>취소</button></div>
    </div>}
    {(busy || generatedSource) && <p role="status" className={s.hint}>{busy ? "AI가 작성하고 있습니다. 완료되면 결과를 표시합니다." : generatedSource ? "AI 초안이 입력되었습니다. 각 탭을 확인한 뒤 저장·발행하세요." : ""}</p>}
  </>;
  return <div className={s.preparation}>
    <HelpTip label="작성 방법 도움말" text="핵심 검색 키워드와 원문·메모를 입력하고 영어 제목·주소·요약을 확인하세요. 초안작성하기로 본문·검색 설정·질문과 답변을 영어로 만듭니다. 최종 확인 후 별도로 저장·발행하세요." />
    {generatedSource && generatedSource !== source && <p className={s.error}>작성 준비가 변경되었습니다. 기존 본문·검색 설정·질문과 답변을 다시 검토해 주세요.</p>}
    <fieldset className={s.preparationFields} disabled={!!busy || disabled || !ready}>
      {schemas[document._type].fields.filter(f => f.name === "category").map(field => <SchemaField key={field.name} field={field} path={field.name} value={document[field.name]} context={context} onChange={v => onChange({ ...document, [field.name]: v })} />)}
      <div className={s.prepLabel}><HelpTip id="writing-keyword-help" text="독자가 이 글을 찾을 때 검색할 말입니다. 한국어·영어로 입력하면 AI가 원문과 함께 뜻을 이해하고, 글의 주제에 맞는 영어 핵심 검색어로 정리합니다."><label htmlFor="writing-keyword" tabIndex={0} aria-describedby="writing-keyword-help">핵심 검색 키워드</label></HelpTip><input id="writing-keyword" value={keyword} maxLength={200} onChange={e => { setKeyword(e.target.value); onChange({ ...document, focusKeyphrase: e.target.value }); }} aria-describedby="writing-keyword-help" placeholder="예: SAT 튜터링 / online SAT tutoring" /></div>
      <div className={s.prepLabel}><HelpTip id="writing-notes-help" text="준비 메모는 이 브라우저에 보관됩니다. AI 버튼을 누르면 입력 내용이 OpenAI에 전달됩니다."><label htmlFor="writing-notes" tabIndex={0} aria-describedby="writing-notes-help">원문·메모</label></HelpTip><textarea id="writing-notes" rows={7} value={notes} maxLength={12000} onChange={e => setNotes(e.target.value)} placeholder="알리고 싶은 수업 내용이나 초안을 자유롭게 적어 주세요. 실제 날짜·대상·성과 등 확인된 사실을 함께 적으면 더 정확하게 작성할 수 있습니다." /></div>
      <HelpTip text="원문·메모와 키워드를 참고해 영어 제목을 추천합니다. 직접 입력할 수도 있습니다. AI 요청 시 입력 내용이 OpenAI에 전달됩니다."><button type="button" className={s.secondary} onClick={() => void request("prepare")}>{busy === "prepare" ? "영어 제목 추천 중…" : preparation ? "영어 제목 다시 추천" : "AI로 영어 제목 추천"}</button></HelpTip>
      {preparation && <div className={s.titleChoices}>
        <div className={s.titleChoicesHeading}><h2 className={s.formSectionTitle}>추천 영어 제목</h2><button type="button" className={s.textButton} onClick={() => { setPreparation(undefined); if (!generatedSource && !proposal) setWarnings([]); }}>추천 닫기</button></div>
        <p className={s.hint}>영어 핵심 검색어: {preparation.focusKeyphrase}</p>
        {preparedSource !== original && <p className={s.hint}>원문·키워드·분류가 변경되었습니다. 제목을 다시 추천받아 주세요.</p>}
        {preparation.titles.map(candidate => <button type="button" className={s.titleChoice} key={candidate.slug} disabled={preparedSource !== original} onClick={() => {
          onChange(applyTitleChoice(document, preparation.focusKeyphrase, candidate, selectedSlug.current));
          setKeyword(preparation.focusKeyphrase);
          setPreparation(undefined);
          setManualEntry(true);
          selectedSlug.current = candidate.slug;
        }}><strong>{candidate.title}</strong><span>{candidate.summary}</span><small>{document.title === candidate.title ? "선택됨" : "이 제목 선택"}</small></button>)}
      </div>}
      {(manualEntry || text(document.title).trim()) ? <>
      <h2 className={s.formSectionTitle}>발행용 영어 정보 확인</h2>
      {["focusKeyphrase", "title", "slug", "excerpt"].map(name => schemas[document._type].fields.find(f => f.name === name)).filter(field => !!field).map(field => <SchemaField key={field.name} field={field} labelOverride={({focusKeyphrase: "발행용 영어 핵심 검색어", title: "영어 제목", excerpt: "영어 요약"} as Record<string, string>)[field.name]} path={field.name} value={document[field.name]} context={context} onChange={v => { if (field.name === "focusKeyphrase") setKeyword(text(v)); onChange({ ...document, [field.name]: v }); }} />)}
      <HelpTip text="현재 작성 준비를 참고해 영어 본문·검색 설정·질문과 답변의 초안을 만듭니다. 기존 내용은 비교 후 선택해서 적용할 수 있습니다. 입력 내용은 OpenAI에 전달됩니다."><button type="button" className={s.primary} onClick={() => void request("generate")}>{busy === "generate" ? "영어 본문·검색 설정·질문과 답변 작성 중…" : "초안작성하기"}</button></HelpTip>
      </> : <button type="button" className={s.textButton} onClick={() => setManualEntry(true)}>영어 정보 직접 입력</button>}
    </fieldset>
    {!contentActive && feedback}
    {rewriteTarget && createPortal(<div className={s.rewriteSection}>
      <HelpTip text="원문·메모와 현재 제목으로 재작성한 내용을 본문에 바로 넣습니다. 아래에서 이전 내용을 확인하고 되돌릴 수 있습니다. 저장·발행은 별도로 진행하세요. 입력 내용은 OpenAI에 전달됩니다."><button type="button" className={s.secondary} disabled={!!busy || disabled || !ready} onClick={() => void request("generate", true)}>{busy === "generate" ? "AI 재작성 중…" : "AI로 재작성"}</button></HelpTip>
      {contentActive && feedback}
    </div>, rewriteTarget)}
  </div>;
}
function previewArea(document: Partial<Document>, area: DraftArea) {
  if (area === "content") return previewBody(document);
  if (area === "aeo") return (document.faqSection || []).map(f => `${f.question}\n${f.answer}`).join("\n\n") || "입력된 질문과 답변 없음";
  return [document.metaTitle, document.metaDescription, ...(Array.isArray(document.keywords) ? document.keywords : [])].filter(Boolean).join("\n\n") || "입력된 검색·공유 설정 없음";
}
