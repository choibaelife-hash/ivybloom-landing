import type { Document } from "../local-studio";
import type { BodyWritingResult, WritingResult } from "./ai-writing";
export const generatedAreas = {
  content: ["body"],
  seo: ["metaTitle", "metaDescription", "keywords"],
  aeo: ["faqSection"],
} as const;
export type DraftArea = keyof typeof generatedAreas;
export function hasProtectedBody(document: Partial<Document>): boolean {
  return !!document.body?.some(block => block._type !== "block");
}
export function previewBody(document: Partial<Document>): string {
  return (document.body || []).map(block => {
    if (block._type === "image") return `[본문 사진${"alt" in block && typeof block.alt === "string" && block.alt ? `: ${block.alt}` : ""}]`;
    if (block._type === "tableBlock") return "[표 — 기존 자료 유지]";
    if (block._type === "checklistBlock") return "[체크리스트 — 기존 자료 유지]";
    if (block._type !== "block") return "[본문 자료 — 기존 자료 유지]";
    return (Array.isArray(block.children) ? block.children : []).map(child => typeof child.text === "string" ? child.text : "").join("");
  }).join("\n\n") || "입력된 본문 없음";
}
export function writingPatch(result: WritingResult | BodyWritingResult): Partial<Document> {
  return {
    body: result.blocks.flatMap(b => (b.list === "none" ? [b.text] : b.text.split(/\r?\n/).map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim()).filter(Boolean)).map(text => ({ _key: crypto.randomUUID(), _type: "block", style: b.style, markDefs: [],
      children: emphasizedSpans(text, b.emphasis || []),
      ...(b.list === "none" ? {} : { listItem: b.list, level: 1 }) }))),
    ...("metaTitle" in result ? { metaTitle: result.metaTitle, metaDescription: result.metaDescription, keywords: result.keywords,
    faqSection: result.faqSection.map(f => ({ _key: crypto.randomUUID(), _type: "faqItem", ...f })), } : {}),
  };
}
function emphasizedSpans(text: string, emphasis: string[]) {
  const spans: { _key: string; _type: "span"; text: string; marks: string[] }[] = [];
  let position = 0;
  while (position < text.length) {
    const match = emphasis.map(part => ({ part, start: text.indexOf(part, position) })).filter(item => item.part && item.start >= 0).sort((a, b) => a.start - b.start || b.part.length - a.part.length)[0];
    if (!match) { spans.push({ _key: crypto.randomUUID(), _type: "span", text: text.slice(position), marks: [] }); break; }
    if (match.start > position) spans.push({ _key: crypto.randomUUID(), _type: "span", text: text.slice(position, match.start), marks: [] });
    spans.push({ _key: crypto.randomUUID(), _type: "span", text: match.part, marks: ["strong"] });
    position = match.start + match.part.length;
  }
  return spans;
}
export function hasDraftContent(document: Document) {
  return Object.values(generatedAreas).flat().some(field => {
    const value = document[field];
    return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
  });
}
export function applyDraft(current: Document, baseline: Document, patch: Partial<Document>, areas: DraftArea[]): Document {
  if (areas.includes("content") && hasProtectedBody(current))
    throw new Error("본문에 사진·표 등의 자료가 있어 AI 본문으로 교체할 수 없습니다. 기존 본문을 직접 수정하거나 검색·공유 설정과 질문과 답변만 적용하세요.");
  const fields = areas.flatMap(area => [...generatedAreas[area]]);
  if (current._id !== baseline._id || fields.some(field => JSON.stringify(current[field]) !== JSON.stringify(baseline[field])))
    throw new Error("초안 생성 후 해당 내용이 수정되었습니다. 직접 수정한 내용을 보호했습니다. 다시 생성해 비교해 주세요.");
  return { ...current, ...Object.fromEntries(fields.map(field => [field, patch[field]])) };
}

export function applyTitleChoice(document: Document, focusKeyphrase: string, candidate: { title: string; slug: string; summary: string }, selectedSlug?: string): Document {
  const existingSlug = document.slug?.current;
  return { ...document, title: candidate.title, focusKeyphrase, excerpt: candidate.summary,
    slug: existingSlug && (!document._id.startsWith("local.") || existingSlug !== selectedSlug)
      ? document.slug : { _type: "slug", current: candidate.slug } };
}
