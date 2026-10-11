import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PostArticle } from '../components/PostArticle'
import type { PublicPost } from '../lib/editorial/public-post'

test('샘플 글 본문·FAQ·CTA·JSON-LD가 같은 데이터를 사용한다', () => {
  const post: PublicPost = {
    _id: 'fixture', title: '영어 글쓰기 대회 준비 방법', slug: { current: 'sample' },
    excerpt: '공식 요강부터 확인하고 준비 일정을 세웁니다.',
    metaDescription: '공식 요강부터 확인하고 준비 일정을 세웁니다.',
    body: [{ _key: 'b1', _type: 'block', style: 'normal', children: [{ _key: 'c1', _type: 'span', text: '공식 요강을 확인하고 제출일부터 거꾸로 일정을 세웁니다.', marks: [] }] }],
    faqSection: [{ _key: 'f1', question: '무엇부터 확인하나요?', answer: '공식 요강을 먼저 확인하세요.' }],
    relatedPosts: [null, { _id: 'related', title: '관련 글', slug: { current: 'related' } }],
    cta: { label: '상담 안내 보기', url: 'https://ivybloomconsulting.com/contact' },
  }
  const html = renderToStaticMarkup(createElement(PostArticle, { post }))
  assert.match(html, /<h1[^>]*>영어 글쓰기 대회 준비 방법<\/h1>/)
  assert.match(html, /공식 요강을 확인하고 제출일부터 거꾸로 일정을 세웁니다/)
  assert.match(html, /무엇부터 확인하나요\?/)
  assert.match(html, /관련 글/)
  assert.match(html, /상담 안내 보기/)
  assert.match(html, /https:\/\/ivybloomconsulting.com\/articles\/sample/)
  assert.match(html, /"@type":"BlogPosting"/)
})
