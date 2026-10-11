// Shared by the customer editor and Sanity Studio. Editorial guidance is not a ranking score.
export type PTBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
  listItem?: string;
  level?: number;
  asset?: unknown;
  alt?: string;
  items?: unknown[];
  rows?: unknown[];
};
export type AuditGroup = "required" | "recommended" | "info";
export const AUDIT_GROUPS = [
  { key: "required", label: "필수 수정" },
  { key: "recommended", label: "작성 권장" },
  { key: "info", label: "참고 정보" },
] as const;
export type BodyCheck = {
  key: string;
  group: AuditGroup;
  status: "pass" | "warn" | "fail" | "info";
  message: string;
  hint?: string;
};
const blockText = (block: PTBlock) => (block.children ?? []).map(c => c.text ?? "").join("");

export function analyzeBody(blocks: PTBlock[], focusKeyphrase: string): BodyCheck[] {
  const textBlocks = blocks.filter(b => b._type === "block");
  const normal = textBlocks.filter(b => !b.style || b.style === "normal");
  const fullText = textBlocks.map(blockText).join(" ");
  const images = blocks.filter(b => b._type === "image");
  const h1 = textBlocks.filter(b => b.style === "h1").length;
  const h2 = textBlocks.filter(b => b.style === "h2").length;
  const h3 = textBlocks.filter(b => b.style === "h3").length;
  const results: BodyCheck[] = [];
  results.push({ key: "본문", group: "required", status: fullText.trim() ? "pass" : "fail", message: fullText.trim() ? "본문 내용이 있습니다." : "본문 내용을 작성하세요." });
  const missingAsset = images.filter(b => !(b.asset as { _ref?: string } | undefined)?._ref).length;
  if (images.length) results.push({ key: "이미지 업로드", group: "required", status: missingAsset ? "fail" : "pass", message: missingAsset ? `이미지 ${missingAsset}개가 업로드되지 않았습니다. 저장 후 업로드 결과를 확인하세요.` : "본문 이미지가 모두 연결되어 있습니다." });
  const missingAlt = images.filter(b => !b.alt?.trim()).length;
  if (images.length) results.push({ key: "이미지 설명", group: "recommended", status: missingAlt ? "warn" : "pass", message: missingAlt ? `이미지 ${missingAlt}개의 설명을 확인하세요.` : "본문 이미지에 설명이 있습니다.", hint: "내용을 전달하는 사진에는 사진의 의미를 설명해 주세요." });
  if (textBlocks.length) results.push({ key: "제목 구조", group: "recommended", status: h1 ? "warn" : "pass", message: h1 ? "페이지 제목이 큰 제목으로 표시됩니다. 본문 큰 제목은 소제목으로 바꿀지 확인하세요." : "페이지 제목과 본문 제목이 구분되어 있습니다." });
  let seenH2 = false;
  const orphanH3 = textBlocks.some(b => { if (b.style === "h2") seenH2 = true; return b.style === "h3" && !seenH2; });
  if (h2 || h3) results.push({ key: "소제목 순서", group: "recommended", status: orphanH3 ? "warn" : "pass", message: orphanH3 ? "큰 소제목보다 작은 소제목이 먼저 나옵니다. 내용의 계층에 맞는지 확인하세요." : "큰 소제목과 작은 소제목의 순서를 확인했습니다." });
  // Editorial prompts only: these thresholds never affect publication or SEO scoring.
  const nonSpaceLength = fullText.replace(/\s/g, "").length;
  const longParagraphs = normal.filter(b => blockText(b).replace(/\s/g, "").length > 800).length;
  if (normal.length) results.push({ key: "문단 읽기", group: "recommended", status: longParagraphs ? "warn" : "pass", message: longParagraphs ? `긴 문단 ${longParagraphs}개가 있습니다. 읽기 쉽도록 나눌지 확인하세요.` : "지나치게 긴 문단이 없습니다.", hint: "공백 제외 800자 초과 시 표시하는 편집 참고 안내이며, 검색 기준이나 발행 제한이 아닙니다." });
  if (nonSpaceLength > 2000) results.push({ key: "소제목으로 나누기", group: "recommended", status: h2 ? "pass" : "warn", message: h2 ? "긴 본문을 큰 소제목으로 나누었습니다." : "긴 본문에 큰 소제목이 없습니다. 주제별로 나누면 내용을 찾기 쉽습니다.", hint: "공백 제외 2,000자 초과 시 표시하는 편집 참고 안내입니다. 소제목 개수는 정해져 있지 않습니다." });
  results.push({ key: "소제목", group: "info", status: h2 || h3 ? "pass" : "warn", message: `큰 소제목 ${h2}개 · 작은 소제목 ${h3}개`, hint: "선택 서식입니다. 필요한 내용에 맞게 나누세요. 개수나 질문형 비율은 검색 합격 기준이 아닙니다." });
  results.push({ key: "글 길이", group: "info", status: "info", message: `공백 제외 ${fullText.replace(/\s/g, "").length.toLocaleString()}자 · 공백 기준 ${fullText.trim().split(/\s+/).filter(Boolean).length.toLocaleString()}단어`, hint: "독자의 질문에 충분히 답하는 분량으로 작성하세요. 최소 글자 수로 검색 품질을 판정하지 않습니다." });
  const longest = Math.max(0, ...normal.map(b => blockText(b).length));
  results.push({ key: "문단", group: "info", status: "info", message: `본문 문단 ${normal.length}개 · 가장 긴 문단 ${longest}자`, hint: "한 문단에는 한 가지 내용을 담고, 읽기 어렵다면 나누세요." });
  const strong = textBlocks.reduce((count, b) => count + (b.children ?? []).filter(c => c.marks?.includes("strong")).length, 0);
  results.push({ key: "강조", group: "info", status: strong ? "pass" : "warn", message: `굵게 표시한 텍스트 구간 ${strong}개`, hint: "선택 서식입니다. 강조할 핵심 내용이 있을 때만 사용하세요. 횟수로 검색 품질을 판정하지 않습니다." });
  const keyword = focusKeyphrase.trim().toLowerCase();
  if (keyword) {
    const count = fullText.toLowerCase().split(keyword).length - 1;
    results.push({ key: "핵심 검색 키워드", group: "info", status: "info", message: `입력한 표현과 정확히 일치하는 부분 ${count}회 · 첫 문단 ${blockText(normal[0] ?? { _type: "block", _key: "" }).toLowerCase().includes(keyword) ? "포함" : "미포함"}`, hint: "표현이 달라도 주제가 자연스럽게 전달되면 됩니다. 반복 횟수·첫 문단·마지막 문단 포함은 필수 조건이 아닙니다." });
  }
  if (/Q\s*[:：]|자주\s*묻|FAQ|질문과\s*답|흔히\s*묻/i.test(fullText)) results.push({ key: "본문 질문과 답변", group: "info", status: "info", message: "질문·답변 형태의 표현이 있습니다.", hint: "별도 질문과 답변 영역과 같은 내용이 중복 출력되는지만 확인하세요." });
  return results;
}
