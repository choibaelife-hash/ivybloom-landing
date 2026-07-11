'use client'

import { useFormValue } from 'sanity'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { Card, Stack, Flex, Text, Badge, Box } from '@sanity/ui'

// ── Portable Text 타입 ───────────────────────────────────────────
type PTChild = {
  _type: string
  text?: string
  marks?: string[]
}

type PTBlock = {
  _type: string
  _key: string
  style?: string
  children?: PTChild[]
  listItem?: string
  level?: number
  asset?: unknown
  alt?: string
}

// ── 텍스트 추출 헬퍼 ─────────────────────────────────────────────
function blockText(block: PTBlock): string {
  return (block.children ?? []).map((c) => c.text ?? '').join('')
}

function totalText(blocks: PTBlock[]): string {
  return blocks
    .filter((b) => b._type === 'block')
    .map(blockText)
    .join(' ')
}

// ── 분석 결과 타입 ───────────────────────────────────────────────
type Status = 'pass' | 'warn' | 'fail' | 'info'

type CheckResult = {
  key: string
  status: Status
  message: string
  hint?: string
}

// ── 분석 함수 ────────────────────────────────────────────────────
function analyzeBody(blocks: PTBlock[], focusKeyphrase: string): CheckResult[] {
  const textBlocks = blocks.filter((b) => b._type === 'block')
  const imageBlocks = blocks.filter((b) => b._type === 'image')

  // H태그
  const h1Blocks = textBlocks.filter((b) => b.style === 'h1')
  const h2Blocks = textBlocks.filter((b) => b.style === 'h2')
  const listBlocks = textBlocks.filter((b) => !!b.listItem)
  const normalBlocks = textBlocks.filter((b) => !b.style || b.style === 'normal')

  // 전체 글자 수
  const totalLen = totalText(blocks).replace(/\s+/g, '').length

  // 결과 배열
  const results: CheckResult[] = []

  // 1. H1 없음
  if (h1Blocks.length === 0) {
    results.push({ key: 'H1', status: 'pass', message: 'H1 블록 없음 ✓' })
  } else {
    results.push({ key: 'H1', status: 'fail', message: `H1 블록 ${h1Blocks.length}개 감지 — 제거 필요` })
  }

  // 2. H2 개수
  const h2Hint = '일반글(800~1500자) → 3개 권장 · 심층가이드(1500~3000자) → 4~5개 권장'
  if (h2Blocks.length >= 3 && h2Blocks.length <= 5) {
    results.push({ key: 'H2', status: 'pass', message: `H2 ${h2Blocks.length}개 (권장: 3~5개)`, hint: h2Hint })
  } else if (h2Blocks.length >= 1) {
    results.push({ key: 'H2', status: 'warn', message: `H2 ${h2Blocks.length}개 (권장: 3~5개)`, hint: h2Hint })
  } else {
    results.push({ key: 'H2', status: 'fail', message: 'H2 없음 — 챕터 제목을 추가하세요', hint: h2Hint })
  }

  // 3. Featured Snippet — H2가 질문형인지
  if (h2Blocks.length > 0) {
    const questionH2 = h2Blocks.filter((b) => blockText(b).trim().includes('?'))
    const ratio = questionH2.length / h2Blocks.length
    if (ratio >= 0.5) {
      results.push({ key: 'Featured Snippet', status: 'pass', message: `H2 중 질문형 ${questionH2.length}/${h2Blocks.length}개` })
    } else if (questionH2.length > 0) {
      results.push({ key: 'Featured Snippet', status: 'warn', message: `H2 중 질문형 ${questionH2.length}/${h2Blocks.length}개 (절반 이상 권장)` })
    } else {
      results.push({ key: 'Featured Snippet', status: 'warn', message: 'H2를 질문형(?)으로 작성하면 검색 노출 유리' })
    }
  }

  // 4. 문단 길이 — 300자 초과 문단 감지
  const longBlocks = normalBlocks.filter((b) => blockText(b).length > 300)
  const warnBlocks = normalBlocks.filter((b) => {
    const len = blockText(b).length
    return len > 200 && len <= 300
  })
  if (longBlocks.length > 0) {
    results.push({ key: '문단 길이', status: 'fail', message: `300자 초과 문단 ${longBlocks.length}개 — 쪼개세요` })
  } else if (warnBlocks.length > 0) {
    results.push({ key: '문단 길이', status: 'warn', message: `200~300자 문단 ${warnBlocks.length}개 (한 문단 200자 이내 권장)` })
  } else {
    results.push({ key: '문단 길이', status: 'pass', message: '모든 문단 200자 이내 ✓' })
  }

  // 5. Bold 남용 — 문단당 strong 마크 개수
  const boldAbuse = normalBlocks.filter((b) => {
    const boldCount = (b.children ?? []).filter((c) => c.marks?.includes('strong')).length
    return boldCount >= 4
  })
  const boldWarn = normalBlocks.filter((b) => {
    const boldCount = (b.children ?? []).filter((c) => c.marks?.includes('strong')).length
    return boldCount === 3
  })
  const boldHint = '문단당 0~2개 ✅ · 3개 ⚠️ · 4개 이상 ❌ — 강조가 많아질수록 효과 희석'
  if (boldAbuse.length > 0) {
    results.push({ key: 'Bold', status: 'fail', message: `Bold 4개+ 문단 ${boldAbuse.length}개 — 남용 금지`, hint: boldHint })
  } else if (boldWarn.length > 0) {
    results.push({ key: 'Bold', status: 'warn', message: `Bold 3개 문단 ${boldWarn.length}개 (문단당 1~2개 권장)`, hint: boldHint })
  } else {
    results.push({ key: 'Bold', status: 'pass', message: 'Bold 사용 적정 ✓', hint: boldHint })
  }

  // 6. 키워드 — 첫 문단에 포함
  if (focusKeyphrase) {
    const firstNormal = normalBlocks[0]
    const firstText = firstNormal ? blockText(firstNormal).toLowerCase() : ''
    if (firstText.includes(focusKeyphrase.toLowerCase())) {
      results.push({ key: '키워드 (첫 문단)', status: 'pass', message: `첫 문단에 "${focusKeyphrase}" 포함 ✓` })
    } else {
      results.push({ key: '키워드 (첫 문단)', status: 'fail', message: `첫 문단에 "${focusKeyphrase}" 없음` })
    }
  } else {
    results.push({ key: '키워드 (첫 문단)', status: 'info', message: 'Content 탭 상단 Focus Keyphrase를 먼저 입력하세요' })
  }

  // 6-1. 키워드 밀도
  if (focusKeyphrase && totalLen >= 600) {
    const fullText = totalText(blocks).toLowerCase()
    const kp = focusKeyphrase.toLowerCase()
    let count = 0
    let pos = 0
    while ((pos = fullText.indexOf(kp, pos)) !== -1) { count++; pos += kp.length }
    const per1000 = (count / totalLen) * 1000
    if (count === 0) {
      results.push({ key: '키워드 밀도', status: 'fail', message: `"${focusKeyphrase}" 본문 전체 미포함`, hint: '1000자당 1~2회 사용 권장' })
    } else if (per1000 > 2) {
      results.push({ key: '키워드 밀도', status: 'warn', message: `${count}회 사용 (1000자당 ${per1000.toFixed(1)}회) — 과다`, hint: '1000자당 1~2회 권장 · 초과 시 keyword stuffing으로 감지될 수 있음' })
    } else {
      results.push({ key: '키워드 밀도', status: 'pass', message: `${count}회 사용 (1000자당 ${per1000.toFixed(1)}회) ✓`, hint: '1000자당 1~2회 권장' })
    }
  }

  // 6-2. 마무리 키워드 — 마지막 문단에 포함
  if (focusKeyphrase && normalBlocks.length > 1) {
    const lastNormal = normalBlocks[normalBlocks.length - 1]
    const lastText = blockText(lastNormal).toLowerCase()
    if (lastText.includes(focusKeyphrase.toLowerCase())) {
      results.push({ key: '마무리 키워드', status: 'pass', message: `마지막 문단에 "${focusKeyphrase}" 포함 ✓` })
    } else {
      results.push({ key: '마무리 키워드', status: 'warn', message: `마지막 문단에 "${focusKeyphrase}" 없음`, hint: '구글은 마지막 문단도 중요하게 봄 — 마무리 문장에 자연스럽게 포함' })
    }
  }

  // 7. 리스트 — 600자 이상 글에서만 체크
  if (totalLen >= 600) {
    if (listBlocks.length >= 1) {
      results.push({ key: '리스트', status: 'pass', message: `리스트 ${listBlocks.length}개 항목 ✓` })
    } else {
      results.push({ key: '리스트', status: 'warn', message: '번호/불릿 리스트 없음 — 순서 있는 내용은 리스트로' })
    }
  }

  // 8. 이미지 Alt text
  if (imageBlocks.length > 0) {
    const noAlt = imageBlocks.filter((b) => !b.alt || String(b.alt).trim() === '')
    if (noAlt.length === 0) {
      results.push({ key: '이미지 Alt', status: 'pass', message: `이미지 ${imageBlocks.length}개 모두 Alt text 있음 ✓` })
    } else {
      results.push({ key: '이미지 Alt', status: 'fail', message: `이미지 ${imageBlocks.length}개 중 ${noAlt.length}개 Alt text 없음` })
    }
  }

  // 9. 글 길이
  if (totalLen >= 800 && totalLen <= 3000) {
    results.push({ key: '글 길이', status: 'pass', message: `${totalLen.toLocaleString()}자 (권장 800~3000자) ✓` })
  } else if (totalLen >= 600 && totalLen < 800) {
    results.push({ key: '글 길이', status: 'warn', message: `${totalLen.toLocaleString()}자 — 800자 이상 권장` })
  } else if (totalLen > 3000) {
    results.push({ key: '글 길이', status: 'warn', message: `${totalLen.toLocaleString()}자 — 심층 가이드가 아니면 3000자 이내 권장` })
  } else {
    results.push({ key: '글 길이', status: 'fail', message: `${totalLen.toLocaleString()}자 — 600자 이상 작성하세요` })
  }

  // 9-1. H3 구조 — H2 없이 H3 단독 사용 감지
  const h3Blocks = textBlocks.filter((b) => b.style === 'h3')
  if (h3Blocks.length > 0) {
    let seenH2 = false
    let h3BeforeH2 = false
    for (const block of textBlocks) {
      if (block.style === 'h2') seenH2 = true
      if (block.style === 'h3' && !seenH2) { h3BeforeH2 = true; break }
    }
    if (!seenH2) {
      results.push({ key: 'H3 구조', status: 'fail', message: `H3 ${h3Blocks.length}개 있지만 H2 없음 — H3는 H2 아래에만 사용`, hint: 'H3는 H2 챕터 안의 세부항목에만 사용' })
    } else if (h3BeforeH2) {
      results.push({ key: 'H3 구조', status: 'fail', message: 'H2 이전에 H3 사용됨 — 순서 확인 필요', hint: 'H3는 H2 챕터 안의 세부항목에만 사용' })
    } else {
      results.push({ key: 'H3 구조', status: 'pass', message: `H3 ${h3Blocks.length}개 — H2 아래 정상 사용 ✓` })
    }
  }

  // 10. FAQ 패턴 감지
  const faqPattern = /Q\s*[:：]|자주\s*묻|FAQ|질문과\s*답|흔히\s*묻/i
  const faqInBody = textBlocks.some((b) => faqPattern.test(blockText(b)))
  if (faqInBody) {
    results.push({ key: 'FAQ', status: 'fail', message: 'Body에 FAQ 패턴 감지 — AEO 탭으로 옮기세요' })
  } else {
    results.push({ key: 'FAQ', status: 'pass', message: 'FAQ 패턴 없음 ✓' })
  }

  return results
}

// ── 상태별 스타일 ────────────────────────────────────────────────
function statusIcon(status: Status) {
  return { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' }[status]
}

function statusTone(status: Status): 'positive' | 'caution' | 'critical' | 'default' {
  return { pass: 'positive', warn: 'caution', fail: 'critical', info: 'default' }[status] as
    | 'positive'
    | 'caution'
    | 'critical'
    | 'default'
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export function BodyAnalyzerInput(props: ArrayOfObjectsInputProps) {
  const blocks = (props.value ?? []) as PTBlock[]
  const focusKeyphrase = (useFormValue(['focusKeyphrase']) as string | undefined) ?? ''

  const checks = analyzeBody(blocks, focusKeyphrase)

  const passCount = checks.filter((c) => c.status === 'pass').length
  const failCount = checks.filter((c) => c.status === 'fail').length
  const warnCount = checks.filter((c) => c.status === 'warn').length

  const overallTone =
    failCount > 0 ? 'critical' : warnCount > 0 ? 'caution' : 'positive'

  return (
    <Stack space={4}>
      {props.renderDefault(props)}

      {blocks.length > 0 && (
        <Card padding={4} radius={2} tone={overallTone} border>
          <Stack space={3}>
            {/* 헤더 */}
            <Flex align="center" justify="space-between">
              <Text size={1} weight="semibold">
                Body 분석
              </Text>
              <Flex gap={2}>
                <Badge tone="positive">{passCount}개 통과</Badge>
                {warnCount > 0 && <Badge tone="caution">{warnCount}개 주의</Badge>}
                {failCount > 0 && <Badge tone="critical">{failCount}개 실패</Badge>}
              </Flex>
            </Flex>

            <Box style={{ borderTop: '1px solid var(--card-border-color)' }} />

            {/* 체크 목록 */}
            {checks.map((c) => (
              <Flex key={c.key} gap={3} align="flex-start">
                <Box style={{ flexShrink: 0, width: 80 }}>
                  <Badge
                    tone={statusTone(c.status)}
                    style={{ textAlign: 'center', width: '100%' }}
                  >
                    {c.key}
                  </Badge>
                </Box>
                <Stack space={1}>
                  <Text size={1} style={{ lineHeight: 1.6 }}>
                    {statusIcon(c.status)} {c.message}
                  </Text>
                  {c.hint && (
                    <Text size={0} muted style={{ lineHeight: 1.5 }}>
                      {c.hint}
                    </Text>
                  )}
                </Stack>
              </Flex>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
