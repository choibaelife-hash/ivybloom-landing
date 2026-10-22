import { ARTICLE_CATEGORIES } from '../../lib/editorial/categories'
import { createElement } from "react";
import { defineField, defineType, defineArrayMember } from "sanity";
import { Icon } from "@sanity/icons";
import { WritingGuideInput } from "../journal-components/WritingGuide";
import { BodyAnalyzerInput } from "../journal-components/BodyAnalyzer";
import { SoftRequiredInput } from "../journal-components/SoftRequiredInput";

const JournalPostIcon = () => createElement(Icon, { symbol: "stack-compact" });

export const journalPostType = defineType({
  name: "journalPost",
  title: "Ivy Bloom 글",
  type: "document",
  icon: JournalPostIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social" },
    { name: "aeo", title: "AEO / GEO" },
  ],
  fields: [
    defineField({
      name: "focusKeyphrase",
      title: "Focus Keyphrase",
      description:
        "독자가 검색할 핵심 주제 한 개 (예: online SAT tutoring) · 제목과 본문에서 주제를 자연스럽게 설명하세요. 같은 표현의 반복은 필수가 아닙니다.",
      type: "string",
      group: "content",
      components: { input: SoftRequiredInput },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
      components: { input: SoftRequiredInput },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "제목 입력 후 Generate 버튼 클릭 — URL 주소로 사용됩니다",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "글 카테고리 선택 · JSON-LD(articleSection)에 반영되어 구글·AI 검색에 카테고리 정보 전달",
      type: "string",
      group: "content",
      validation: (r) => r.required().error("카테고리를 선택하세요"),
      options: {
        list: ARTICLE_CATEGORIES.map(({ value, label }) => ({ value, title: label })),
        layout: "radio",
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "datetime",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      initialValue: "IVY BLOOM CONSULTING",
      hidden: true,
    }),
    defineField({
      name: "excerpt",
      title: "Lead",
      description: "글의 주제와 핵심 내용을 사실에 맞게 요약하세요. 검색 설명을 비우면 이 요약을 사용합니다. 간결한 작성을 권장하며 AI 인용을 보장하지 않습니다.",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
      group: "content",
    }),
    defineField({
      name: "writingGuide",
      title: "✍️ Body 작성 가이드라인",
      type: "string",
      group: "content",
      readOnly: true,
      components: { input: WritingGuideInput },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      components: { input: BodyAnalyzerInput },
      validation: (r) => r.min(1).error("본문은 최소 1개 블록이 필요합니다"),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
        }),
        defineArrayMember({
          type: "object",
          name: "checklistBlock",
          title: "Checklist",
          fields: [
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { items: "items" },
            prepare({ items }) {
              return { title: "Checklist", subtitle: Array.isArray(items) ? `${items.length}개 항목` : "" };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "tableBlock",
          title: "Table",
          fields: [
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "tableRow",
                  fields: [
                    defineField({ name: "phase", title: "기간", type: "string" }),
                    defineField({ name: "focus", title: "집중 영역", type: "string" }),
                    defineField({ name: "goal", title: "주간 목표", type: "string" }),
                  ],
                }),
              ],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { rows: "rows" },
            prepare({ rows }) {
              return { title: "Table", subtitle: Array.isArray(rows) ? `${rows.length}행` : "" };
            },
          },
        }),
      ],
    }),

    // SEO
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      description: "미입력 시 글 제목 사용 · 내용을 정확히 설명하는 간결한 제목을 작성하세요. 60자 이내는 작성 권장이며 실제 검색 표시 제목은 달라질 수 있습니다.",
      type: "string",
      group: "seo",
      validation: (r) =>
        r.max(60).warning("간결한 제목을 권장합니다. 60자는 작성 참고 기준이며 검색 표시 길이를 보장하지 않습니다."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      description: "미입력 시 글 요약 사용 · 독자가 알게 될 내용을 간결하게 설명하세요. 160자 이내는 작성 권장이며 실제 검색 설명은 달라질 수 있습니다.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) =>
        r.max(160).warning("간결한 설명을 권장합니다. 160자는 작성 참고 기준이며 검색 표시 길이를 보장하지 않습니다."),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      description: "1200×630px 권장 · 미입력 시 Main Image 사용 — 카카오·SNS 공유 시 표시되는 썸네일",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      description: "관련 주제를 정리하는 선택 항목입니다. 핵심 검색어·분류와 용도가 다르며 Google 검색 순위를 높이는 필수 입력값이 아닙니다.",
      type: "array",
      group: "seo",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      description: "미입력 시 /articles/[slug] 자동 생성 · 동일 내용이 여러 URL에 있을 때만 대표 URL 직접 입력",
      type: "url",
      group: "seo",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      description: "검색 결과에서 제외하도록 요청합니다. 비공개 기능이 아니므로 글 주소를 알면 볼 수 있습니다. 이미 검색된 글의 제외에는 시간이 걸릴 수 있습니다.",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),
    defineField({
      name: "schemaOrgType",
      title: "Schema.org Type",
      description: "보이는 내용에 맞는 유형을 선택하세요. BlogPosting: 블로그 글 · Article: 기사 · FAQPage: 질문·답변 중심 · Course: 강좌 · Service: 서비스. 선택만으로 검색 노출이나 AI 인용을 보장하지 않습니다.",
      type: "string",
      group: "seo",
      initialValue: "BlogPosting",
      options: {
        list: [
          { title: "BlogPosting (기본)", value: "BlogPosting" },
          { title: "Article", value: "Article" },
          { title: "FAQPage", value: "FAQPage" },
          { title: "Course", value: "Course" },
          { title: "Service", value: "Service" },
        ],
        layout: "radio",
      },
    }),

    // Social
    defineField({
      name: "twitterTitle",
      title: "Twitter Title",
      description: "미입력 시 Meta Title → Title 순으로 자동 사용 · 70자 이내 · X(Twitter) 카드에 표시",
      type: "string",
      group: "social",
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      description: "미입력 시 Meta Description → Lead 순으로 자동 사용 · 200자 이내 · 클릭을 유도하는 문장으로",
      type: "text",
      rows: 3,
      group: "social",
    }),

    // AEO
    defineField({
      name: "faqSection",
      title: "FAQ Section",
      description: "독자에게 필요한 질문이 있을 때만 추가하세요. 본문과 근거 자료로 답할 수 있는 내용으로 작성하고 같은 FAQ 전체를 본문에 반복하지 마세요. 개수 기준이나 AI 인용 보장은 없습니다.",
      type: "array",
      group: "aeo",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              description: '독자가 실제로 궁금해할 질문을 작성하세요. 예: "수업에서는 어떤 내용을 배우나요?"',
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              description: "질문에 직접 답하고 필요한 조건과 근거를 함께 적으세요. 본문·원문에서 확인되지 않은 효과를 단정하지 마세요. 정해진 답변 길이는 없습니다.",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
    prepare({ title, subtitle, media }) { return { title, subtitle, media }; },
  },
});
