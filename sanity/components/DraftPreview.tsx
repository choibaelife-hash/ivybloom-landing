'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Card, Stack, Text } from '@sanity/ui'
import { useClient, useFormValue } from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import { firstText } from '../../lib/editorial/public-post'

export function DraftPreviewInput() {
  const client = useClient({ apiVersion: '2025-02-19' })
  const imageBuilder = imageUrlBuilder(client)
  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => value?.asset?._ref ? <img
        src={imageBuilder.image(value).width(700).auto('format').url()}
        alt={firstText(value.alt) ?? ''}
        style={{ width: '100%', height: 'auto' }}
      /> : <Text size={1}>이미지 참조가 없어 미리보기에 표시하지 않았습니다.</Text>,
    },
  }
  const title = useFormValue(['title']) as string | undefined
  const excerpt = useFormValue(['excerpt']) as string | undefined
  const body = useFormValue(['body']) as unknown[] | undefined
  const faq = useFormValue(['faqSection']) as Array<{ _key?: string; question?: string; answer?: string }> | undefined
  return <Card padding={4} radius={2} border><Stack space={3}>
    <Text weight="semibold">편집 중 미리보기</Text>
    <Text size={1}>현재 입력값으로 그린 미리보기입니다. 실제 공개 URL의 메타정보·색인 상태는 발행 후 따로 확인하세요.</Text>
    <div style={{ background: 'white', padding: 24, lineHeight: 1.75, color: '#252525' }}>
      <h1 style={{ fontSize: 28, lineHeight: 1.3 }}>{firstText(title) ?? '제목 미입력'}</h1>
      {firstText(excerpt) && <p style={{ color: '#555' }}>{excerpt}</p>}
      {body?.length ? <PortableText value={body as never} components={components} /> : <p>본문 미입력</p>}
      {!!faq?.length && <section><h2>자주 묻는 질문</h2>{faq.filter((item) => firstText(item.question) && firstText(item.answer)).map((item, index) => <div key={item._key ?? index}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>}
    </div>
  </Stack></Card>
}
