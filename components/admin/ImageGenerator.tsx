"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { optimizeCover } from "@/lib/admin/image-client";
import type { PTBlock } from "@/lib/admin/body-analysis";
import type { MediaContext } from "./SchemaFields";
import HelpTip from "./HelpTip";
import s from "./local-studio.module.css";

export default function ImageGenerator({ title, summary, body, context, onBusy, disabled, active, onSelect }: { title: string; summary: string; body: PTBlock[]; context: MediaContext; onBusy: (busy: boolean) => void; disabled: boolean; active: boolean; onSelect: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<{ name: string; dataUrl: string; bytes: number; width: number; height: number } | undefined>(() => {
    const selected = context.pending?.mainImage;
    return selected?.name.startsWith("generated-cover-") ? { ...selected, bytes: Math.floor(selected.dataUrl.split(",")[1].length * 3 / 4), width: 0, height: 0 } : undefined;
  });
  const [reference, setReference] = useState<{ name: string; dataUrl: string }>();
  async function attachReference(file: File) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 20 * 1024 * 1024) { setError("JPG·PNG·WebP 사진을 20MB 이하로 선택해 주세요."); return; }
    setBusy(true); onBusy(true); setError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("참고 사진을 읽지 못했습니다.")); reader.readAsDataURL(file);
      });
      const optimized = await optimizeCover(dataUrl, file.name);
      if (optimized.bytes > 2 * 1024 * 1024) throw new Error("참고 사진을 더 작은 파일로 선택해 주세요.");
      setReference({ name: file.name, dataUrl: optimized.dataUrl });
    } catch (error) { setError(error instanceof Error ? error.message : "참고 사진을 읽지 못했습니다."); }
    finally { setBusy(false); onBusy(false); }
  }
  const article = body.map(block => (block.children || []).map(span => span.text || "").join("")).filter(Boolean).join("\n\n").slice(0, 8000);
  async function generate() {
    if (busy || disabled || !active) return;
    setBusy(true); onBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/admin/ai/image", { method: "POST", headers: { "Content-Type": "application/json", "x-ivy-admin-request": "1" }, body: JSON.stringify({ prompt, title, summary, body: article, referenceImage: reference?.dataUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "이미지를 생성하지 못했습니다.");
      setPreview(await optimizeCover(data.image.dataUrl, data.image.name, true));
    } catch (error) { setError(error instanceof Error ? error.message : "이미지를 생성하지 못했습니다."); }
    finally { setBusy(false); onBusy(false); }
  }
  return <section className={s.imageGenerator} aria-label="AI 대표 이미지 생성">
    <h2><label className={s.imageMethod}><input type="radio" name="representative-image-method" checked={active} disabled={busy || disabled} onChange={onSelect} />AI 생성</label></h2>
    <div className={s.referenceImage}>
      <HelpTip dismissOnClick id="reference-image-help" text="참고할 사진을 첨부하고 아래에 원하는 요청을 적어 주세요. 생성할 때만 사진이 AI에 전달됩니다."><label tabIndex={0} aria-describedby="reference-image-help" className={s.secondary}>참고 사진 첨부 (선택)<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy || disabled || !active} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void attachReference(file); }} /></label></HelpTip>
      {reference && <><img src={reference.dataUrl} alt="첨부한 참고 사진" /><p className={s.hint}>{reference.name}</p><button className={s.secondary} disabled={busy || disabled || !active} onClick={() => setReference(undefined)}>참고 사진 제거</button></>}
    </div>
    <label htmlFor="image-prompt">추가 요청사항 (선택)</label>
    <textarea id="image-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} disabled={busy || disabled || !active} maxLength={1500} rows={3} placeholder="비워두면 글 내용에 맞춰 만듭니다. 예: 참고 사진의 분위기로 새 디자인 만들기, 또는 제목 문구만 변경" />
    {!preview && <HelpTip text="글 제목·요약·본문을 참고해 Articles 목록에 맞는 16:9 가로형 이미지를 만듭니다. 생성 시 이 내용·요청사항·첨부한 참고 사진이 OpenAI에 전달되며 API 이용 요금이 발생합니다."><button className={s.secondary} disabled={busy || disabled || !active || (!title.trim() && !article.trim())} onClick={generate}>{busy ? "이미지를 생성하고 있습니다…" : "이미지 1장 생성"}</button></HelpTip>}
    {error && <p role="alert" className={s.error}>{error}</p>}
    {message && <p role="status" className={s.success}>{message}</p>}
    {preview && <div className={s.generatedPreview}>
      <details key={preview.name} open className={s.imagePreviewDetails}>
        <summary>생성 이미지 미리보기</summary>
        <img src={preview.dataUrl} alt="생성된 대표 이미지 미리보기" onLoad={event => { const { naturalWidth, naturalHeight } = event.currentTarget; if (preview.width !== naturalWidth || preview.height !== naturalHeight) setPreview({ ...preview, width: naturalWidth, height: naturalHeight }); }} />
        <p className={s.hint}>{preview.width > 0 ? `${preview.width} × ${preview.height}px · ` : ""} {(preview.bytes / 1024).toFixed(0)}KB</p>
      </details>
      <div className={s.actions}>
        <button className={s.primary} disabled={busy || disabled || !active} onClick={() => {
          context.setPending("mainImage", preview); setMessage("대표 이미지로 선택했습니다. 임시 저장 또는 발행을 누르면 함께 저장됩니다.");
        }}>선택하기</button>
        <HelpTip text="현재 요청사항으로 새 이미지를 생성합니다. API 이용 요금이 발생합니다. 새 이미지는 선택하기를 눌러야 대표 이미지에 적용됩니다."><button className={s.secondary} disabled={busy || disabled || !active} onClick={generate}>{busy ? "다시 생성 중…" : "다시 생성"}</button></HelpTip>
      </div>
    </div>}
  </section>;
}
