import assert from 'node:assert/strict'
import test from 'node:test'
import { planningQuestions, makeWritingGuide, reviewDraft, selectedEdit, suggestMetadata, fingerprint, type Brief, type BodyBlock } from '../lib/editorial/workflow'
import { canonicalUrl, publicPostMetadata, validRelatedPosts, safeJsonLd } from '../lib/editorial/public-post'
import { buildSchemaOrgJsonLd } from '../lib/structured-data'

const brief: Brief = {
  articleKind: 'information', audienceSituation: '영어 글쓰기 대회를 처음 준비하는 중학생과 학부모',
  keyQuestion: '영어 글쓰기 대회를 어떻게 준비하나요?', desiredOutcome: '준비 일정을 세운다',
  focusKeyphrase: '영어 글쓰기 대회', scopeNote: '공식 요강을 확인하는 일반 준비 절차',
  coreAnswer: '공식 요강을 확인하고 제출일부터 거꾸로 일정을 세웁니다.',
  plannedOutline: [{ heading: '요강 확인', evidenceNote: '공식 요강 링크 확인 필요' }, { heading: '초안과 수정', promise: '초안 작성과 검토 일정을 정합니다.' }],
}
const blocks: BodyBlock[] = [
  { _key: 'b1', _type: 'block', style: 'normal', children: [{ _key: 'c1', text: '영어 글쓰기 대회는 공식 요강을 확인하고 제출일부터 거꾸로 일정을 세웁니다.' }] },
  { _key: 'b2', _type: 'block', style: 'h2', children: [{ _key: 'c2', text: '요강 확인' }] },
  { _key: 'b3', _type: 'block', style: 'normal', children: [{ _key: 'c3', text: '공식 요강을 확인하는 일반 준비 절차입니다. 참가 자격과 마감일은 공식 자료에서 확인하세요.' }] },
]

test('기존 기획 필드로 질문 → 가이드 → 원고 점검 → 메타 후보를 만든다', () => {
  assert.equal(planningQuestions({ keyQuestion: brief.keyQuestion }).length, 3)
  assert.deepEqual(planningQuestions(brief), [])
  const guide = makeWritingGuide(brief, { avoidClaims: '합격 보장', publicEvidence: '공식 요강' })
  assert.equal(guide.sections.length, 2)
  assert.match(guide.sections[0].avoid, /합격 보장/)
  assert.equal(guide.centralQuestion, brief.keyQuestion)
  assert.equal(reviewDraft('영어 글쓰기 대회 준비 방법', brief, blocks).length, 0)
  const meta = suggestMetadata('영어 글쓰기 대회 준비 방법', blocks)
  assert.match(meta.excerpt, /공식 요강/)
  assert.equal(meta.metaTitle, '영어 글쓰기 대회 준비 방법')
  assert.equal(meta.metaDescription, meta.excerpt)
})

test('빈 값과 확인되지 않은 사실은 만들어 내지 않는다', () => {
  assert.equal(planningQuestions({}).length, 4)
  const guide = makeWritingGuide({})
  assert.match(guide.directAnswer, /확인 필요/)
  assert.ok(guide.unresolved.length >= 2)
  assert.equal(suggestMetadata('', []).metaDescription, '')
  assert.ok(reviewDraft('제목', { keyQuestion: '질문?' }, []).some((item) => item.id === 'empty-body'))
})

test('문장 위치를 지정하고 원고 변경은 지문으로 감지한다', () => {
  const claim = [{ _key: 'b', _type: 'block', children: [{ _key: 'c', text: '합격 100% 보장' }] }]
  const issues = reviewDraft('합격 안내', {}, claim)
  assert.ok(issues.some((item) => item.blockKey === 'b' && item.childKey === 'c' && item.originalText === '합격 100% 보장'))
  const issue = issues.find((item) => item.childKey === 'c')!
  const before = fingerprint(claim)
  const changed = [{ ...claim[0], children: [{ _key: 'c', text: '합격 가능성은 확인이 필요합니다' }] }]
  assert.notEqual(before, fingerprint(changed))
  assert.deepEqual(selectedEdit(issue, claim, before, before, '합격 가능성은 확인이 필요합니다'), {
    ok: true, blockKey: 'b', childKey: 'c', text: '합격 가능성은 확인이 필요합니다',
  })
  assert.equal(selectedEdit(issue, changed, before, fingerprint(changed), '새 문장').ok, false)
  assert.equal(selectedEdit(issue, claim, before, before, '합격 100% 보장').ok, false)
})

test('누락 이미지·참조와 메타 빈값 대체를 안전하게 처리한다', () => {
  const issues = reviewDraft('', {}, [{ _key: 'img', _type: 'image' }])
  assert.ok(issues.some((item) => item.id === 'image-alt-img'))
  const post = {
    _id: 'post1', title: '예시 제목', slug: { current: 'sample' }, excerpt: '예시 설명',
    metaTitle: '  ', metaDescription: '', relatedPosts: [null, { _id: 'missing', title: '없음' }, { _id: 'post2', title: '관련 글', slug: { current: 'related' } }],
  }
  assert.equal(validRelatedPosts(post).length, 1)
  assert.equal(canonicalUrl(post), 'https://ivybloomconsulting.com/articles/sample')
  const meta = publicPostMetadata(post)
  assert.equal(meta.title, '예시 제목')
  assert.equal(meta.description, '예시 설명')
  assert.equal(meta.openGraph?.title, '예시 제목')
  assert.equal(meta.twitter?.description, '예시 설명')
})

test('JSON-LD는 HTML 주입을 피하고 글의 공개 주소와 제목을 쓴다', () => {
  const schema = buildSchemaOrgJsonLd({ title: '<예시>', slug: 'sample', excerpt: '설명', url: 'https://ivybloomconsulting.com/articles/sample' }) as { '@type': string; url: string }
  assert.equal(schema['@type'], 'BlogPosting')
  assert.equal(schema.url, 'https://ivybloomconsulting.com/articles/sample')
  assert.ok(!safeJsonLd(schema).includes('<'))
})
