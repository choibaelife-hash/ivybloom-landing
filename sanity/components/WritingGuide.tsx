import { Card, Stack, Flex, Text, Badge } from '@sanity/ui'

const GUIDELINES = [
  { key: '구조',            text: '도입부(키워드 포함, 2~3문장) → H2 질문형(3~5개) → 마무리(요약+행동유도)' },
  { key: 'Featured Snippet', text: 'H2 아래 첫 문장에서 짧게 직접 답하기 — "~는 ~입니다" 형태로 단정적으로' },
  { key: '링크',            text: '내부 링크 2~4개 · 외부 링크(논문/기관) 1~2개' },
  { key: '마무리',          text: '글 끝에 핵심 요약 한 문장 + 키워드 포함 + 행동 유도 문장' },
  { key: 'AEO',             text: '모호한 표현 금지 · 정의+효과를 한 문장에 단정적으로' },
  { key: '중복',            text: '비슷한 주제 글이 이미 있으면 새 글 말고 기존 글 업데이트' },
]

export function WritingGuideInput() {
  return (
    <Card padding={4} radius={2} tone="caution" border>
      <Stack space={3}>
        {GUIDELINES.map((g) => (
          <Flex key={g.key} gap={3} align="flex-start">
            <Badge
              tone="caution"
              style={{ flexShrink: 0, marginTop: 2, minWidth: 90, textAlign: 'center' }}
            >
              {g.key}
            </Badge>
            <Text size={1} style={{ lineHeight: 1.6 }}>
              {g.text}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Card>
  )
}
