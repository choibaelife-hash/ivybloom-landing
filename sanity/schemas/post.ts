import { defineField, defineType } from 'sanity'

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
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      validation: (r) => r.required(),
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'AI 검색 인용용 요약 (160자 이내 권장). SEO metaDescription 미입력 시 자동 사용됩니다.',
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
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
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
      description: '미입력 시 Title 사용. 60자 이내 권장.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      description: '미입력 시 Excerpt 사용. 160자 이내 권장.',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      description: '미입력 시 Main Image 사용. 1200×630px 권장.',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'focusKeyphrase',
      title: 'Focus Keyphrase',
      description: '핵심 타겟 키워드 1개 (예: korean student college admissions)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      description: '미입력 시 자동 생성 (/blog/slug)',
      type: 'url',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      description: '검색엔진 수집 제외 (초안·중복 페이지용)',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),

    // ── Social ───────────────────────────────────────────────
    defineField({
      name: 'twitterTitle',
      title: 'Twitter Title',
      description: '미입력 시 Meta Title → Title 순으로 fallback',
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter Description',
      description: '미입력 시 Meta Description → Excerpt 순으로 fallback',
      type: 'text',
      rows: 3,
      group: 'social',
    }),

    // ── AEO / GEO ────────────────────────────────────────────
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      description: 'AI 검색(ChatGPT, Perplexity 등) 인용 최적화. 질문·답변 쌍으로 입력.',
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
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
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
