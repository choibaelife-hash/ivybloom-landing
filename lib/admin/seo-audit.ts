import type { AuditGroup, PTBlock } from "./body-analysis";
import manifest from "./schema.json";
export type PostAudit = {
  _id: string;
  _type?: "journalPost";
  category?: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: unknown;
  mainImage?: unknown;
  excerpt?: string;
  focusKeyphrase?: string;
  body?: PTBlock[];
  faqSection?: { question?: string; answer?: string }[];
  pendingUploads?: number;
  noindex?: boolean;
};
export type CheckResult = "pass" | "warn" | "fail" | "info";
export type CheckDef = { key: string; label: string; group: AuditGroup; field: keyof PostAudit };
export const CHECKS: CheckDef[] = [
  { key: "title", label: "글 제목", group: "required", field: "title" },
  { key: "slug", label: "글 주소", group: "required", field: "slug" },
  { key: "category", label: "글 분류", group: "required", field: "category" },
  { key: "publishedAt", label: "게시 날짜", group: "required", field: "publishedAt" },
  { key: "blocks", label: "표·체크리스트 내용", group: "required", field: "body" },
  { key: "body", label: "본문 내용", group: "required", field: "body" },
  { key: "uploads", label: "이미지 업로드", group: "required", field: "body" },
  { key: "faq", label: "입력한 질문·답변 완성", group: "required", field: "faqSection" },
  { key: "metaTitle", label: "검색 제목", group: "recommended", field: "metaTitle" },
  { key: "metaDescription", label: "검색 설명", group: "recommended", field: "metaDescription" },
  { key: "ogImage", label: "공유 이미지", group: "recommended", field: "ogImage" },
  { key: "indexing", label: "검색 노출 설정", group: "info", field: "noindex" },
  { key: "keyword", label: "핵심 검색 키워드", group: "info", field: "focusKeyphrase" },
];
const trim = (value?: string) => value?.trim() ?? "";
function hasImage(value: unknown): boolean {
  if (typeof value === "string") return /^https?:\/\//i.test(value);
  if (!value || typeof value !== "object") return false;
  return !!(value as { asset?: { _ref?: string } }).asset?._ref;
}
export function checkField(post: PostAudit, check: CheckDef): CheckResult {
  switch (check.key) {
    case "title": return trim(post.title) ? "pass" : "fail";
    case "slug": return /^[\p{L}\p{N}_-]+$/u.test(post.slug?.current ?? "") ? "pass" : "fail";
    case "category": {
      const definition = manifest.journalPost.fields.find(f => f.name === "category");
      const options = definition && "options" in definition && definition.options && "list" in definition.options ? definition.options.list : [];
      return (options as { value: string }[]).some(option => option.value === post.category) ? "pass" : "fail";
    }
    case "publishedAt": return trim(post.publishedAt) && Number.isFinite(Date.parse(post.publishedAt!)) ? "pass" : "fail";
    case "blocks": return post.body?.some(b => b._type === "checklistBlock" && (!Array.isArray(b.items) || !b.items.length) || b._type === "tableBlock" && (!Array.isArray(b.rows) || !b.rows.length)) ? "fail" : "pass";
    case "body": return post.body?.some(b => b._type === "block" && b.children?.some(c => trim(c.text))) ? "pass" : "fail";
    case "uploads": return post.pendingUploads || post.body?.some(b => b._type === "image" && !hasImage(b)) ? "fail" : "pass";
    case "faq": return post.faqSection?.some(f => !trim(f.question) || !trim(f.answer)) ? "fail" : "pass";
    case "metaTitle": return trim(post.metaTitle) || trim(post.title) ? "pass" : "warn";
    case "metaDescription": return trim(post.metaDescription) || trim(post.excerpt) ? "pass" : "warn";
    case "ogImage": return hasImage(post.ogImage) || hasImage(post.mainImage) ? "pass" : "warn";
    default: return "info";
  }
}
export function checkMessage(post: PostAudit, check: CheckDef): string {
  const result = checkField(post, check);
  if (check.key === "category") return result === "pass" ? "글 분류 선택됨" : "정해진 글 분류 중 하나를 선택하세요.";
  if (check.key === "publishedAt") return result === "pass" ? "게시 날짜 형식 확인" : "유효한 게시 날짜를 입력하세요.";
  if (check.key === "blocks") return result === "pass" ? "비어 있는 표·체크리스트 없음" : "추가한 표의 행 또는 체크리스트 항목을 작성하거나 빈 블록을 삭제하세요.";
  if (check.key === "metaTitle") return trim(post.metaTitle) ? "입력한 검색 제목 사용" : trim(post.title) ? "글 제목을 기본값으로 사용" : "글 제목 또는 검색 제목을 작성하세요.";
  if (check.key === "metaDescription") return trim(post.metaDescription) ? "입력한 검색 설명 사용" : trim(post.excerpt) ? "글 요약을 기본값으로 사용" : "검색 설명 또는 글 요약을 작성해 주세요.";
  if (check.key === "ogImage") return hasImage(post.ogImage) ? "선택한 공유 이미지 사용" : hasImage(post.mainImage) ? "대표 이미지를 기본값으로 사용" : "공유할 때 표시할 이미지를 선택해 주세요.";
  if (check.key === "indexing") return post.noindex ? "검색 제외 설정됨 · 사이트맵에서도 제외됩니다. 주소로 직접 접속할 수 있습니다." : "검색 수집 허용 · 실제 색인과 노출은 검색엔진이 결정합니다.";
  if (check.key === "keyword") return trim(post.focusKeyphrase) ? "주제를 확인하는 참고 표현입니다. 제목·주소의 정확한 일치는 필수가 아닙니다." : "주제를 정리할 때 참고할 표현을 입력할 수 있습니다.";
  if (check.key === "uploads") return result === "pass" ? "업로드 대기 없음" : "저장 후 이미지 업로드 완료를 확인하세요.";
  if (check.key === "faq") return result === "pass" ? post.faqSection?.length ? "입력한 질문과 답변이 모두 있습니다." : "입력한 질문과 답변 없음 · 선택 항목" : "추가한 항목의 질문과 답변을 모두 작성하거나 해당 항목을 삭제하세요.";
  if (check.key === "slug") return result === "pass" ? "글 주소 형식 확인" : "글 주소를 작성하세요. 문자·숫자·밑줄·하이픈을 사용할 수 있습니다.";
  return result === "pass" ? "입력됨" : `${check.label}을 작성하세요.`;
}
