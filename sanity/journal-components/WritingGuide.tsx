import { Card, Stack, Flex, Text, Badge } from '@sanity/ui'

import { GUIDELINES } from '../../lib/admin/writing-guide'


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
