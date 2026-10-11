'use client'

import { useEffect, useState } from 'react'
import { PatchEvent, set, useFormValue, type ArrayOfObjectsInputProps } from 'sanity'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { fingerprint, reviewDraft, selectedEdit, type ReviewSuggestion, type WritingGuide } from '../../lib/editorial/workflow'
import { GUIDE_EVENT, guideStorageKey, useBrief } from './EditorialAssistant'

type BodyBlock = {
  _key?: string
  _type?: string
  style?: string
  alt?: string
  children?: { _key?: string; text?: string }[]
}

const writingTips = [
  '독자의 핵심 질문에 먼저 직접 답하고, 이유·방법과 적용 조건을 이어서 설명하세요.',
  '자격·연도·마감일·성과처럼 확인이 필요한 내용은 실제 근거와 사례를 대조하세요. 미확인 내용은 확인 필요로 남깁니다.',
  '이 사이트는 글 제목을 H1으로 출력합니다. 본문은 의미 있는 H2 절과 그 아래 H3 세부 절로 구성하세요. 모든 소제목을 질문형으로 만들 필요는 없습니다.',
  '관련 글이나 공식 자료가 독자에게 도움이 될 때 링크하고, “여기” 대신 연결 대상이 드러나는 구체적인 앵커 문구를 쓰세요. 링크 개수는 정해져 있지 않습니다.',
  '이미지에는 실제 내용을 설명하는 alt를 적고, 장식 이미지는 문맥에 맞게 처리하세요.',
  'FAQ는 독자가 실제로 묻는 질문만 AEO / GEO 탭에 추가하세요. 본문과 같은 답을 불필요하게 반복하지 않습니다.',
  '중심 주제와 검색 표현은 문맥에 맞게 자연스럽게 사용하세요. 글 길이·소제목 수·키워드 반복 횟수나 점수 목표는 없습니다.',
]

export function BodyAnalyzerInput(props: ArrayOfObjectsInputProps) {
  const blocks = (props.value ?? []) as BodyBlock[]
  const title = String(useFormValue(['title']) ?? '')
  const id = String(useFormValue(['_id']) ?? 'new-post')
  const brief = useBrief()
  const currentFingerprint = fingerprint({ title, brief, blocks })
  const [review, setReview] = useState<{ fingerprint: string; suggestions: ReviewSuggestion[] } | null>(null)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [rejected, setRejected] = useState<string[]>([])
  const [applied, setApplied] = useState<string[]>([])
  const [guide, setGuide] = useState<WritingGuide | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const readGuide = () => {
      try {
        const saved = sessionStorage.getItem(guideStorageKey(id))
        setGuide(saved ? JSON.parse(saved) as WritingGuide : null)
      } catch { setGuide(null) }
    }
    readGuide()
    window.addEventListener(GUIDE_EVENT, readGuide)
    return () => window.removeEventListener(GUIDE_EVENT, readGuide)
  }, [id])

  function runReview() {
    const suggestions = reviewDraft(title, brief, blocks)
    setReview({ fingerprint: currentFingerprint, suggestions })
    setEdits(Object.fromEntries(suggestions.filter((item) => item.originalText !== undefined).map((item) => [item.id, item.originalText ?? ''])))
    setRejected([])
    setApplied([])
    setMessage(suggestions.length ? `${suggestions.length}개 확인 항목을 찾았습니다. 사실 여부는 사람이 확인해야 합니다.` : '로컬 규칙에서 확인 항목을 찾지 못했습니다. 사실 검증과 전문가 검토는 미실행입니다.')
  }

  function applySuggestion(item: ReviewSuggestion) {
    const result = selectedEdit(item, blocks, review?.fingerprint ?? '', currentFingerprint, edits[item.id])
    if (!result.ok) { setMessage(result.reason); return }
    props.onChange(PatchEvent.from(set(result.text, [{ _key: result.blockKey }, 'children', { _key: result.childKey }, 'text'])))
    setApplied((previous) => [...previous, item.id])
    setMessage('선택한 문장 하나만 바꿨습니다. 다른 제안은 오래된 상태가 되므로 다시 점검하세요.')
  }
  let seenH2 = false
  let h3BeforeH2 = false
  for (const block of blocks) {
    if (block._type !== 'block') continue
    if (block.style === 'h2') seenH2 = true
    if (block.style === 'h3' && !seenH2) h3BeforeH2 = true
  }

  const notes = [
    blocks.some((block) => block._type === 'block' && block.style === 'h1')
      ? '본문에 H1이 있습니다. 제목이 이미 H1으로 출력되므로 본문 절에는 H2/H3을 사용하세요.'
      : null,
    h3BeforeH2 ? 'H2보다 앞에 H3이 있습니다. 제목 계층을 확인하세요.' : null,
    blocks.some((block) => block._type === 'image' && !block.alt?.trim())
      ? '본문 이미지 중 alt가 비어 있습니다. 이미지의 역할과 실제 내용을 확인하세요.'
      : null,
  ].filter((note): note is string => Boolean(note))

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} tone="caution" border>
        <details open>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>✍️ Body 작성 팁 · 펼치기/접기</summary>
          <Stack space={3} paddingTop={3}>
            {writingTips.map((tip) => <Text key={tip} size={1}>{tip}</Text>)}
            <Text size={1} muted>편집 안내입니다. 검색엔진의 필수 규칙이나 자동 SEO 점수가 아니며 문서 필드로 저장되지 않습니다.</Text>
          </Stack>
        </details>
      </Card>
      {props.renderDefault(props)}
      {guide && <Card padding={3} radius={2} border><details><summary style={{ cursor: 'pointer', fontWeight: 600 }}>선택한 작성 가이드</summary>
        <Stack space={2} paddingTop={3}>
          <Text size={1}>독자: {guide.audience} · 질문: {guide.centralQuestion}</Text>
          {guide.selectedTitle && <Text size={1}>선택 제목: {guide.selectedTitle}</Text>}
          {guide.sections.map((section, index) => <Text size={1} key={index}>{index + 1}. {section.heading} — {section.instruction} / 근거: {section.facts} / 조건: {section.conditions} / 피할 표현: {section.avoid}</Text>)}
          {guide.briefFingerprint !== fingerprint(brief) && <Text size={1}>기획이 바뀌었습니다. 가이드를 다시 만드세요.</Text>}
        </Stack>
      </details></Card>}
      <Card padding={3} radius={2} border><Stack space={3}>
        <Text weight="semibold">원고 점검 · 로컬 규칙 기반</Text>
        <Text size={1}>제목·기획·현재 본문을 비교합니다. 사실의 진위나 전문가 검토 완료를 판정하지 않습니다.</Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button text={review ? '원고 다시 점검' : '원고 점검'} onClick={runReview} />
          {review && <Button text="점검 결과 닫기" mode="ghost" onClick={() => { setReview(null); setMessage('점검 결과만 닫았습니다. 원고는 유지됩니다.') }} />}
        </div>
        {message && <Text size={1}>{message}</Text>}
        {review && review.fingerprint !== currentFingerprint && <Text size={1}>⚠ 원고나 기획이 점검 후 바뀌었습니다. 아래 제안은 오래되었습니다.</Text>}
        {review?.suggestions.map((item) => <Card key={item.id} padding={3} border tone={rejected.includes(item.id) ? 'transparent' : 'caution'}><Stack space={2}>
          <Text size={1} weight="semibold">{item.problem} · 규칙 {item.rule}</Text>
          {item.originalText && <Text size={1}>위치: “{item.originalText.slice(0, 100)}”</Text>}
          <Text size={1}>이유: {item.reason}</Text><Text size={1}>확인할 사실: {item.factToCheck}</Text>
          <Text size={1}>최소 수정 방향: {item.minimalEdit}</Text>
          {item.originalText !== undefined && !rejected.includes(item.id) && !applied.includes(item.id) && <>
            <textarea aria-label={`${item.problem} 수정 문장`} style={{ width: '100%', minHeight: 64 }} value={edits[item.id] ?? item.originalText} onChange={(event) => setEdits({ ...edits, [item.id]: event.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button text="이 문장만 적용" disabled={review.fingerprint !== currentFingerprint} onClick={() => applySuggestion(item)} />
              <Button text="거절" mode="ghost" onClick={() => setRejected((previous) => [...previous, item.id])} />
            </div>
          </>}
          {rejected.includes(item.id) && <Text size={1}>거절됨 · 원고 유지</Text>}
          {applied.includes(item.id) && <Text size={1}>적용됨</Text>}
        </Stack></Card>)}
      </Stack></Card>
      {notes.length > 0 && (
        <Card padding={3} radius={2} tone="caution" border>
          <Stack space={2}>
            <Text size={1} weight="semibold">현재 본문에서 확인할 점</Text>
            {notes.map((note) => <Text key={note} size={1}>{note}</Text>)}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
