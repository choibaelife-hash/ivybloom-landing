import { Card, Stack, Text } from '@sanity/ui'

export function WritingGuideInput() {
  return (
    <Card padding={4} radius={2} tone="caution" border>
      <Stack space={3}>
        <Text size={1}>핵심 답변 → 이유·방법 → 적용 조건 → 사례·근거 순서로 설명해 보세요. 필요한 절만 쓰고 고정된 글자 수나 목차 수를 맞출 필요는 없습니다.</Text>
        <Text size={1}>확인되지 않은 자격·마감일·성과는 사실처럼 쓰지 마세요. 예상 목차는 참고용이며 이 본문을 자동으로 덮어쓰지 않습니다.</Text>
        <Text size={1}>페이지 제목이 H1으로 표시된다면 본문에는 H2/H3을 사용하고, 링크와 이미지 설명은 독자에게 의미 있게 작성하세요.</Text>
      </Stack>
    </Card>
  )
}
