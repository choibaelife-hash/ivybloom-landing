'use client'

import { useFormValue } from 'sanity'
import { Card, Stack, Text } from '@sanity/ui'

type OutlineItem = { heading?: string; promise?: string; evidenceNote?: string; needsVerification?: boolean }

export function PlanningSummaryInput() {
  const audience = useFormValue(['audienceSituation']) as string | undefined
  const question = useFormValue(['keyQuestion']) as string | undefined
  const answer = useFormValue(['coreAnswer']) as string | undefined
  const scope = useFormValue(['scopeNote']) as string | undefined
  const outline = useFormValue(['plannedOutline']) as OutlineItem[] | undefined

  const lines = [
    ['대상 독자', audience], ['핵심 질문', question], ['핵심 답변', answer], ['적용 범위', scope],
  ]

  return (
    <Card padding={4} radius={2} tone="primary" border>
      <Stack space={3}>
        <Text weight="semibold">1단계 기획 요약 · 같은 문서의 원본 값</Text>
        {lines.map(([label, value]) => (
          <Text key={label} size={1}><strong>{label}</strong>: {value?.trim() || '아직 입력하지 않음'}</Text>
        ))}
        <Text size={1}><strong>예상 목차</strong>: {outline?.length
          ? outline.map((item) => `${item.heading || '제목 미입력'}${item.needsVerification ? ' (확인 필요)' : ''}`).join(' / ')
          : '아직 입력하지 않음'}</Text>
        <Text size={1} muted>읽기 전용 화면이며 별도 저장하지 않습니다. 탭은 자유롭게 이동할 수 있습니다.</Text>
      </Stack>
    </Card>
  )
}
