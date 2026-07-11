import { defineField, defineType } from 'sanity'
import { WritingGuideInput } from '../components/WritingGuide'
import { BodyAnalyzerInput } from '../components/BodyAnalyzer'
import { SoftRequiredInput } from '../components/SoftRequiredInput'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo',     title: 'SEO' },
    { name: 'social',  title: 'Social' },
    { name: 'aeo',     title: 'AEO / GEO' },
  ],
  fields: [
    // ── Content ──────────────────────────────────────────────
    defineField({
      name: 'focusKeyphrase',
      title: 'Focus Keyphrase',
      description: '글 작성 전 가장 먼저 입력 · 이 글이 구글에서 검색됐으면 하는 핵심 키워드 1개 (예: korean student college admissions) · 제목·Meta Title·본문 첫 문단·마무리 문단 모두에 포함 필수',
      type: 'string',
      group: 'content',
      components: { input: SoftRequiredInput },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      components: { input: SoftRequiredInput },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: '제목 입력 후 Generate 버튼 클릭 — URL 주소로 사용됩니다',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'College Admissions', value: 'college' },
          { title: 'Boarding School',    value: 'boarding' },
          { title: 'Essay',              value: 'essay' },
          { title: 'SAT / ACT',          value: 'sat' },
          { title: 'Other',              value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      initialValue: 'Ivybloom',
      hidden: true,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: '160자 이내 · Meta Description 미입력 시 자동 사용 · ChatGPT·Perplexity 등 AI 검색 인용용 — 단정적이고 명확하게 작성',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'writingGuide',
      title: '✍️ Body 작성 가이드라인',
      type: 'string',
      group: 'content',
      readOnly: true,
      components: { input: WritingGuideInput },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      components: { input: BodyAnalyzerInput },
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
          ],
        },
      ],
    }),

    // ── SEO ──────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      description: '60자 이내 · Focus Keyphrase 반드시 포함 · 미입력 시 Title 그대로 사용 — 구글 검색결과에 표시되는 제목',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      description: '120~160자 · Focus Keyphrase 포함 · 미입력 시 Excerpt 사용 — 검색결과 클릭률(CTR)에 직결, 행동 유도 문구로 마무리',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      description: '1200×630px 권장 · 미입력 시 Main Image 사용 — 카카오·SNS 공유 시 표시되는 썸네일',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      description: '서브 키워드 3~5개 · Focus Keyphrase의 유사 표현·관련 주제어 입력 (예: SAT prep, college essay, boarding school)',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      description: '미입력 시 /blog/[slug] 자동 생성 · 동일 내용이 여러 URL에 있을 때만 대표 URL 직접 입력',
      type: 'url',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      description: '체크하면 구글 수집 제외 · 초안·중복 페이지·내부 전용 글에만 사용 · 기본값 OFF(수집 허용)',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'schemaOrgType',
      title: 'Schema.org Type',
      description: 'BlogPosting: 일반 블로그 글 · Article: 뉴스/전문 기사 · FAQPage: FAQ 위주 페이지 · Course/Service: 서비스·강좌 소개',
      type: 'string',
      group: 'seo',
      initialValue: 'BlogPosting',
      options: {
        list: [
          { title: 'BlogPosting (기본)', value: 'BlogPosting' },
          { title: 'Article',            value: 'Article' },
          { title: 'FAQPage',            value: 'FAQPage' },
          { title: 'Course',             value: 'Course' },
          { title: 'Service',            value: 'Service' },
        ],
        layout: 'radio',
      },
    }),

    // ── Social ───────────────────────────────────────────────
    defineField({
      name: 'twitterTitle',
      title: 'Twitter Title',
      description: '미입력 시 Meta Title → Title 순으로 자동 사용 · 70자 이내 · X(Twitter) 카드에 표시',
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter Description',
      description: '미입력 시 Meta Description → Excerpt 순으로 자동 사용 · 200자 이내 · 클릭을 유도하는 문장으로',
      type: 'text',
      rows: 3,
      group: 'social',
    }),

    // ── AEO / GEO ────────────────────────────────────────────
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      description: 'AI 검색(ChatGPT, Perplexity 등) 인용 최적화 · 최소 3개 이상 입력 · Body에 중복 작성 금지 — 이 탭에만 입력',
      type: 'array',
      group: 'aeo',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              description: '실제 검색 쿼리 형태로 · 물음표(?)로 끝내기 · 예: "SAT 점수를 단기간에 올리는 방법은?"',
              type: 'string',
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              description: '50~300자 · 모호한 표현 금지 · 정의+효과를 첫 문장에 단정적으로 — AI가 그대로 인용하는 텍스트',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'mainImage' },
  },
})
