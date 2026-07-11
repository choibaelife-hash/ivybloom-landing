'use client'

import { useState } from 'react'
import type { StringInputProps } from 'sanity'
import { Stack, Text } from '@sanity/ui'

// focusKeyphrase처럼 "중요하지만 탭 배지는 없이" 처리할 string 필드용
// - 한 번도 터치하지 않으면 경고 없음
// - blur 후 빈 칸이면 빨간 테두리 + 안내 텍스트
export function SoftRequiredInput(props: StringInputProps) {
  const [touched, setTouched] = useState(false)
  const isEmpty = !props.value || String(props.value).trim() === ''
  const showError = touched && isEmpty

  return (
    <Stack space={2}>
      <div
        style={{
          outline: showError ? '1.5px solid var(--card-critical-border-color, #e05c5c)' : undefined,
          borderRadius: 3,
        }}
      >
        {props.renderDefault({
          ...props,
          elementProps: {
            ...props.elementProps,
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
              setTouched(true)
              props.elementProps.onBlur?.(e)
            },
          },
        })}
      </div>
      {showError && (
        <Text size={1} style={{ color: 'var(--card-critical-fg-color, #c53030)' }}>
          ! 글 작성 전 반드시 입력하세요
        </Text>
      )}
    </Stack>
  )
}
