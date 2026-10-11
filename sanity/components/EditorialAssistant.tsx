'use client'

import { useEffect, useState } from 'react'
import { PatchEvent, set, useClient, useFormValue, type StringInputProps, type TextInputProps } from 'sanity'
import { Button, Card, Stack, Text } from '@sanity/ui'
import {
  makeWritingGuide, planningQuestions, suggestMetadata,
  type Brief, type BusinessProfile, type BodyBlock, type WritingGuide,
} from '../../lib/editorial/workflow'

export const GUIDE_EVENT = 'ivybloom-guide-change'
export function guideStorageKey(id: string) { return `ivybloom-writing-guide:${id}` }

export function useBrief(): Brief {
  const articleKind = useFormValue(['articleKind']) as string | undefined
  const audienceSituation = useFormValue(['audienceSituation']) as string | undefined
  const keyQuestion = useFormValue(['keyQuestion']) as string | undefined
  const desiredOutcome = useFormValue(['desiredOutcome']) as string | undefined
  const focusKeyphrase = useFormValue(['focusKeyphrase']) as string | undefined
  const scopeNote = useFormValue(['scopeNote']) as string | undefined
  const coreAnswer = useFormValue(['coreAnswer']) as string | undefined
  const plannedOutline = useFormValue(['plannedOutline']) as Brief['plannedOutline']
  return { articleKind, audienceSituation, keyQuestion, desiredOutcome, focusKeyphrase, scopeNote, coreAnswer, plannedOutline }
}

export function PlanningAssistantInput(props: StringInputProps) {
  const brief = useBrief()
  const id = String(useFormValue(['_id']) ?? 'new-post')
  const client = useClient({ apiVersion: '2025-02-19' })
  const [questions, setQuestions] = useState<ReturnType<typeof planningQuestions> | null>(null)
  const [profile, setProfile] = useState<BusinessProfile>({})
  const [guide, setGuide] = useState<WritingGuide | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(guideStorageKey(id))
      if (saved) setGuide(JSON.parse(saved) as WritingGuide)
    } catch { /* private browsing may block storage */ }
  }, [id])

  useEffect(() => {
    let active = true
    client.fetch<BusinessProfile | null>('*[_id == "business-profile"][0]{offerings,customers,process,publicEvidence,voice,avoidClaims}')
      .then((value) => { if (active && value) setProfile(value) })
      .catch(() => { if (active) setMessage('사업 정보를 읽지 못했습니다. 기획값만으로 계속할 수 있습니다.') })
    return () => { active = false }
  }, [client])

  function saveGuide(next: WritingGuide) {
    setGuide(next)
    try {
      sessionStorage.setItem(guideStorageKey(id), JSON.stringify(next))
      window.dispatchEvent(new CustomEvent(GUIDE_EVENT, { detail: id }))
      setMessage('선택한 가이드를 이 브라우저 탭에 보관했습니다. 본문 탭에서도 볼 수 있습니다.')
    } catch { setMessage('브라우저 임시 저장을 사용할 수 없어 이 화면에서만 가이드를 볼 수 있습니다.') }
  }

  return <Stack space={4}>
    <Card padding={4} radius={2} tone="primary" border><Stack space={3}>
      <Text weight="semibold">기획 도우미 · 로컬 규칙 기반</Text>
      <Text size={1}>위의 기존 기획 필드를 사용합니다. 사실을 만들어 넣거나 외부 AI로 전송하지 않습니다.</Text>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button text="기획 점검" onClick={() => { setQuestions(planningQuestions(brief)); setMessage('') }} />
        <Button text="작성 가이드 만들기" tone="primary" onClick={() => { saveGuide(makeWritingGuide(brief, profile)); setQuestions(null) }} />
      </div>
      {questions && (questions.length ? <Stack space={2}>
        <Text size={1} weight="semibold">방향을 정할 질문 {questions.length}개</Text>
        {questions.map((item) => <Text key={item.field} size={1}>• {item.question} — {item.reason} 위의 해당 기획 칸에 답을 적으세요.</Text>)}
      </Stack> : <Text size={1}>추가 질문 없이 작성 가이드를 만들 수 있습니다.</Text>)}
      {message && <Text size={1}>{message}</Text>}
    </Stack></Card>
    {guide && <Card padding={4} radius={2} border><Stack space={3}>
      <Text weight="semibold">작성 가이드 {guide.briefFingerprint === JSON.stringify(brief) ? '' : '· 기획 변경 후 다시 생성 권장'}</Text>
      {([['audience', '대상 독자'], ['centralQuestion', '핵심 질문'], ['scope', '적용 범위'], ['directAnswer', '직접 답변 후보']] as const).map(([key, label]) => <label key={key} style={{ display: 'block' }}>{label}
        <textarea value={guide[key]} aria-label={label} style={{ display: 'block', width: '100%', minHeight: 50 }} onChange={(event) => saveGuide({ ...guide, [key]: event.target.value })} />
      </label>)}
      <Text size={1} weight="semibold">제목 후보</Text>
      {guide.titleCandidates.map((title, index) => <label key={index} style={{ display: 'block' }}>
        <input type="radio" checked={guide.selectedTitle === title} onChange={() => saveGuide({ ...guide, selectedTitle: title })} />
        <input aria-label={`제목 후보 ${index + 1}`} value={title} onChange={(event) => saveGuide({ ...guide, titleCandidates: guide.titleCandidates.map((item, i) => i === index ? event.target.value : item), selectedTitle: guide.selectedTitle === title ? event.target.value : guide.selectedTitle })} />
      </label>)}
      {guide.selectedTitle && <Text size={1}>선택 제목: {guide.selectedTitle} · 제목 필드에서 최종 수정하세요.</Text>}
      {guide.sections.map((section, index) => <div key={index} style={{ borderTop: '1px solid #ddd', paddingTop: 10 }}>
        <label style={{ display: 'block', fontWeight: 600 }}>절 {index + 1} · <input aria-label={`절 ${index + 1} 제목`} value={section.heading} onChange={(event) => saveGuide({ ...guide, sections: guide.sections.map((item, i) => i === index ? { ...item, heading: event.target.value } : item) })} /></label>
        {([['instruction', '작성 지침'], ['facts', '넣을 사실·근거'], ['conditions', '적용 조건'], ['avoid', '피할 표현']] as const).map(([key, label]) => <label key={key} style={{ display: 'block' }}>{label}
          <textarea value={section[key]} aria-label={`절 ${index + 1} ${label}`} style={{ display: 'block', width: '100%', minHeight: 45 }} onChange={(event) => saveGuide({ ...guide, sections: guide.sections.map((item, i) => i === index ? { ...item, [key]: event.target.value } : item) })} />
        </label>)}
      </div>)}
      {guide.unresolved.map((item) => <Text key={item} size={1}>확인 필요: {item}</Text>)}
      <Text size={1} muted>이 가이드는 브라우저 임시 저장입니다. 기획 원문과 본문을 자동 수정하지 않습니다.</Text>
    </Stack></Card>}
  </Stack>
}

export function MetaSuggestionInput(props: StringInputProps | TextInputProps) {
  const title = useFormValue(['title']) as string | undefined
  const body = (useFormValue(['body']) ?? []) as BodyBlock[]
  const name = String(props.path[props.path.length - 1]) as 'excerpt' | 'metaTitle' | 'metaDescription'
  const suggestion = suggestMetadata(title ?? '', body)[name]
  return <Stack space={2}>
    {props.renderDefault(props as never)}
    {suggestion && <Card padding={2} tone="transparent" border><Stack space={2}>
      <Text size={1}>확정할 본문 기준 후보: {suggestion}</Text>
      <Button text="이 칸에 후보 적용" mode="ghost" onClick={() => props.onChange(PatchEvent.from(set(suggestion)))} />
    </Stack></Card>}
  </Stack>
}
