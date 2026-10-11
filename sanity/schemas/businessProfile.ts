import { defineField, defineType } from 'sanity'

export const businessProfileType = defineType({
  name: 'businessProfile',
  title: '공개용 사업 정보',
  type: 'document',
  description: '이 정보는 공개 가능한 내용만 입력합니다. 비공개 전략, 학생·상담 정보, 개인정보는 저장하지 마세요.',
  fields: [
    defineField({ name: 'offerings', title: '실제 제공 서비스', type: 'text', rows: 4,
      description: '현재 제공 중인 서비스와 포함 범위만 적습니다.' }),
    defineField({ name: 'customers', title: '주요 대상 고객', type: 'text', rows: 3,
      description: '개인 식별 정보 없이 대상 고객의 상황을 적습니다.' }),
    defineField({ name: 'process', title: '공개 가능한 운영 방식', type: 'text', rows: 4,
      description: '실제 상담·진행 과정을 공개해도 되는 범위에서 적습니다.' }),
    defineField({ name: 'publicEvidence', title: '공개 가능한 근거', type: 'text', rows: 4,
      description: '확인 가능한 자료와 공개 허락을 받은 사실만 적습니다.' }),
    defineField({ name: 'voice', title: '글의 말투', type: 'text', rows: 3,
      description: '독자에게 보여도 되는 표현 지침만 적습니다.' }),
    defineField({ name: 'avoidClaims', title: '피할 표현', type: 'text', rows: 3,
      description: '공개돼도 되는 일반적인 금지 표현만 적습니다. 비공개 전략은 입력하지 마세요.' }),
  ],
  preview: { prepare: () => ({ title: '공개용 사업 정보' }) },
})
