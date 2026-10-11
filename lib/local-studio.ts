import { localImageUrl } from "./local-images";
import manifest from "./admin/schema.json";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/editor";

export type DocumentType = "journalPost";
export type ImageValue = {
  _type?: string;
  asset?: { _type?: string; _ref?: string };
  alt?: string;
  crop?: Record<string, number>;
  hotspot?: Record<string, number>;
  [key: string]: unknown;
};
export type Document = {
  _id: string;
  _type: DocumentType;
  _rev?: string;
  title?: string;
  slug?: { _type?: string; current?: string; [key: string]: unknown };
  body?: PortableTextBlock[];
  faqSection?: {
    _key: string;
    _type: string;
    question?: string;
    answer?: string;
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};
export type Asset = { _id: string; url: string; originalFilename?: string };
export type Source = {
  documents: Document[];
  assets: Asset[];
  projectId: string;
  dataset: string;
  fetchedAt: string;
  states: Record<string, { draftRev?: string; publishedRev?: string }>;
  writable: boolean;
};
export type LocalCopy = {
  archived?: boolean;
  id: string;
  document: Document;
  sourceRev?: string;
  savedAt: string;
  revision: string;
  pendingMedia: Record<string, { name: string; dataUrl: string }>;
};
export type Field = {
  name: string;
  title?: string;
  description?: string;
  type: string;
  group?: string;
  required?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  initialValue?: unknown;
  rows?: number;
  options?: {
    list?: ({ title: string; value: string } | string)[];
    maxLength?: number;
  };
  fields?: Field[];
  of?: Field[];
  styles?: { title: string; value: string }[];
};
export const schemas = manifest as unknown as Record<
  DocumentType,
  { fields: Field[] }
>;
export const typeLabels: Record<DocumentType, string> = {
  journalPost: "저널",
};
export const labels: Record<string, string> = {
  title: "제목",
  slug: "글 주소",
  category: "저널 분류",
  publishedAt: "게시 날짜",
  author: "작성자",
  excerpt: "요약",
  mainImage: "대표 이미지",
  focusKeyphrase: "핵심 검색 키워드",
  writingGuide: "본문 작성 가이드",
  body: "본문",
  metaTitle: "검색 제목",
  metaDescription: "검색 설명",
  ogImage: "공유 이미지",
  keywords: "검색 키워드 목록",
  canonical: "원본 글 주소 · 선택 사항",
  noindex: "검색 결과에서 제외",
  schemaOrgType: "구조화 데이터 유형",
  twitterTitle: "X(트위터) 공유 제목",
  twitterDescription: "X(트위터) 공유 설명",
  faqSection: "자주 묻는 질문",
  alt: "이미지 설명",
  question: "질문",
  answer: "답변",
  phase: "기간",
  focus: "집중 영역",
  goal: "주간 목표",
  items: "체크리스트 항목",
  rows: "표의 행",
};
export function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}
export function imageUrl(
  value: unknown,
  source: Pick<Source, "projectId" | "dataset">,
): string {
  if (typeof value === "string")
    return /^(https?:\/\/|data:image\/)/i.test(value) ? localImageUrl(value) : "";
  if (!(value as ImageValue)?.asset?._ref) return "";
  try {
    return imageUrlBuilder(source)
      .image(value as ImageValue)
      .width(1000)
      .url();
  } catch {
    return "";
  }
}
export function newDocument(type: DocumentType): Document {
  const doc: Document = { _id: `local.${crypto.randomUUID()}`, _type: type };
  for (const f of schemas[type].fields)
    if (f.initialValue !== undefined)
      doc[f.name] = structuredClone(f.initialValue);
  doc.publishedAt = new Date().toISOString();
  return doc;
}
const DB = "ivybloom-sanity-local-v1";
async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("drafts", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("브라우저 저장소를 열 수 없습니다."));
  });
}
export async function loadCopies(): Promise<LocalCopy[]> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction("drafts").objectStore("drafts").getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}
export async function saveCopy(
  copy: LocalCopy,
  expectedRevision?: string,
): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    const read = store.get(copy.id);
    let conflict = false;
    read.onsuccess = () => {
      if (
        (read.result as LocalCopy | undefined)?.revision !== expectedRevision
      ) {
        conflict = true;
        tx.abort();
        return;
      }
      store.put(copy);
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onabort = tx.onerror = () => {
      db.close();
      reject(
        new Error(
          conflict
            ? "다른 탭에서 저장된 변경이 있습니다. 현재 수정본을 내려받고 새로고침하세요."
            : "로컬 저장에 실패했습니다. 수정본을 내려받아 보관하세요.",
        ),
      );
    };
  });
}

export async function removeCopy(id: string, expectedRevision?: string): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    const read = store.get(id);
    let conflict = false;
    read.onsuccess = () => {
      if ((read.result as LocalCopy | undefined)?.revision !== expectedRevision) {
        conflict = true;
        tx.abort();
        return;
      }
      store.delete(id);
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(new Error(conflict ? "다른 탭의 변경이 있어 복구본을 보관했습니다." : "로컬 백업 정리에 실패했습니다."));
    };
  });
}

// Translate interface guidance only; document values and analysis rules stay unchanged.
export function adminGuidance(value: string): string {
  const terms: [string, string][] = [
    ["FAQPage", "질문과 답변 페이지"], ["BlogPosting", "블로그 글"], ["Article", "기사"], ["Course/Service", "강좌·서비스"], ["Twitter(X)", "X"], ["Featured Snippet", "추천 검색 요약"], ["Alt text", "이미지 설명"], ["이미지 Alt", "이미지 설명"],
    ["Bold", "굵은 글씨"], ["words", "단어"], ["keyword stuffing", "키워드 과다 반복"],
    ["Focus Keyphrase", "핵심 검색 키워드"], ["Content 탭", "글 작성 탭"], ["AEO 탭", "질문과 답변 탭"],
    ["Body", "본문"], ["FAQ", "자주 묻는 질문"], ["Generate", "제목으로 생성"],
    ["Meta Title", "검색 제목"], ["Meta Description", "검색 설명"], ["Main Image", "대표 이미지"],
    ["student-results", "성적 변화·후기"], ["study-guide", "학습 가이드"], ["awards", "수상 내역"], ["notice", "공지"], ["Student Results", "성적 변화·후기"], ["Study Guide", "학습 가이드"], ["Awards", "수상 내역"],
    ["Notice", "공지"], ["Title", "제목"], ["Lead", "요약"], ["OFF", "꺼짐"], ["Twitter", "X"],
  ];
  return terms.reduce((result, [term, label]) => result.replaceAll(term, label), value);
}
