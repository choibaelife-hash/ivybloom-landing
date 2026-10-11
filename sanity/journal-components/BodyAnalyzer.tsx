'use client'

import { useFormValue } from 'sanity'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { Card, Stack, Flex, Text, Badge, Box } from '@sanity/ui'

import { AUDIT_GROUPS, analyzeBody, type PTBlock } from '../../lib/admin/body-analysis'

// ── 상태별 스타일 ────────────────────────────────────────────────
function statusIcon(status: 'pass' | 'warn' | 'fail' | 'info') {
  return { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' }[status]
}

function statusTone(status: 'pass' | 'warn' | 'fail' | 'info'): 'positive' | 'caution' | 'critical' | 'default' {
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
                본문 읽기 점검
              </Text>
              <Flex gap={2}>
                <Badge tone="default">검색 점수 아님</Badge>
                {warnCount > 0 && <Badge tone="caution">권장 {warnCount}개</Badge>}
                {failCount > 0 && <Badge tone="critical">필수 수정 {failCount}개</Badge>}
              </Flex>
            </Flex>

            <Box style={{ borderTop: '1px solid var(--card-border-color)' }} />

            {/* 체크 목록 */}
            {AUDIT_GROUPS.map(category => <Stack key={category.key} space={3}>
              <Text size={1} weight="semibold">{category.label}</Text>
              {!checks.some(c => c.group === category.key) && <Text size={1} muted>해당 항목 없음</Text>}
              {checks.filter(c => c.group === category.key).map((c) => (
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
            </Stack>)}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
