import { Card, Stack, Text } from '@sanity/ui'
import { useFormValue } from 'sanity'
import { releaseItems } from '../schemas/releaseItems'
import { bodyText, type BodyBlock } from '../../lib/editorial/workflow'

export function ReleaseGuideInput() {
  const title = useFormValue(['title']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const body = (useFormValue(['body']) ?? []) as BodyBlock[]
  const mainImage = useFormValue(['mainImage']) as { asset?: { _ref?: string }; alt?: string } | undefined
  const faq = useFormValue(['faqSection']) as Array<{ question?: string; answer?: string }> | undefined
  const noindex = useFormValue(['noindex']) as boolean | undefined
  const automatic = [
    { label: '제목', ok: Boolean(title?.trim()) },
    { label: '주소 이름', ok: Boolean(slug?.trim()) },
    { label: '본문', ok: Boolean(bodyText(body).trim()) },
    { label: '대표 이미지 설명', ok: !mainImage?.asset?._ref || Boolean(mainImage.alt?.trim()) },
    { label: 'FAQ 질문·답변', ok: !faq?.length || faq.every((item) => Boolean(item.question?.trim() && item.answer?.trim())) },
  ]
  return (
    <Card padding={4} radius={2} tone="caution" border>
      <Stack space={3}>
        <Text weight="semibold">⑦ 글 발행 때 확인할 것</Text>
        <Text size={1}>발행 전에는 편집기 입력만 확인합니다. 공개 URL 검사는 최초 발행을 막지 않으며, URL이 없으면 미확인으로 둡니다. 아래 상태는 수동 점검 기록이며 자동 검사 결과가 아닙니다.</Text>
        <Text size={1}>원고·설정·사이트가 바뀌면 기존 통과 기록은 최신 상태를 증명하지 않습니다. 대상 URL과 검사 시각을 보고 다시 확인하세요. 비밀 근거나 인증 URL은 public dataset에 저장하지 마세요.</Text>
        <Text size={1} weight="semibold">자동 확인 · 현재 편집값 기준</Text>
        {automatic.map((item) => <Text key={item.label} size={1}>{item.ok ? '통과' : '실패'} · {item.label}</Text>)}
        <Text size={1}>자동 확인 · robots 선택값: {noindex ? '색인 제외' : '색인 허용'}. 이 값은 사람이 선택한 사이트 설정이며 AI 점검 결과가 아닙니다.</Text>
        <Text size={1} weight="semibold">사람이 확인할 항목</Text>
        <Text size={1}>미확인 · 사실과 공개 근거, 고객 승인, 전문가 검토, 제목의 실제 약속, 이미지 권리와 대체 설명의 적절성</Text>
        <Text size={1} weight="semibold">아직 검사하지 못한 항목</Text>
        <Text size={1}>미실행 · 공개 URL의 실제 HTML/JSON-LD, 검색 결과 반영, Lighthouse, 외부 링크 응답과 SNS 공유 미리보기</Text>
        {releaseItems.map((item) => (
          <details key={item.key}>
            <summary style={{ cursor: 'pointer' }}>{item.title}</summary>
            <div style={{ padding: '8px 0 4px 14px', lineHeight: 1.6 }}>
              <Text size={1}>필요성: {item.necessity} · 처리: {item.handling} · 검사: {item.verification}</Text>
              <Text size={1}>{item.guide}</Text>
              <Text size={1}>저장 위치: 아래 점검 기록. 빈 값은 미확인이며 공개 페이지로 자동 출력하지 않습니다. 자동 웹 검사는 추후 확장입니다.</Text>
            </div>
          </details>
        ))}
      </Stack>
    </Card>
  )
}
