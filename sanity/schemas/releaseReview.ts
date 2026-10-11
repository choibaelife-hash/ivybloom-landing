import { defineField, defineType } from 'sanity'

// A review record describes a human inspection. It never runs a web check.
export const releaseReviewType = defineType({
  name: 'releaseReview',
  title: '점검 기록',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: '상태',
      type: 'string',
      description: '검사 전에는 미확인으로 두세요. 자동 생성된 값만으로 통과 처리하지 않습니다.',
      options: { list: [
        { title: '미확인', value: 'unverified' },
        { title: '통과', value: 'passed' },
        { title: '수정 필요', value: 'needsFix' },
        { title: '해당 없음', value: 'notApplicable' },
      ] },
      initialValue: 'unverified',
    }),
    defineField({
      name: 'checkedAt',
      title: '검사 시각',
      type: 'datetime',
      description: '이후 원고·설정·배포 내용이 바뀌면 다시 확인하고 시각을 갱신하세요.',
    }),
    defineField({
      name: 'targetUrl',
      title: '검사 대상 URL',
      type: 'url',
      description: '공개 페이지를 실제 검사한 경우에만 입력합니다. 인증 URL이나 비밀 토큰은 넣지 마세요.',
    }),
    defineField({
      name: 'method',
      title: '검사 방법',
      type: 'string',
      description: '예: 편집기 눈으로 확인, 공개 URL 브라우저 확인, 구조화 데이터 검사 도구.',
    }),
    defineField({
      name: 'evidence',
      title: '근거 메모',
      type: 'text',
      rows: 2,
      description: '공개 가능한 간단한 근거만 기록합니다. 개인정보·고객 비밀·인증 주소는 공개 dataset에 저장하지 마세요.',
    }),
  ],
  preview: {
    select: { title: 'status', subtitle: 'checkedAt' },
    prepare: ({ title, subtitle }) => ({
      title: ({ unverified: '미확인', passed: '통과', needsFix: '수정 필요', notApplicable: '해당 없음' } as Record<string, string>)[title] ?? '미확인',
      subtitle: subtitle ? `마지막 확인 ${subtitle}` : '검사 기록 없음',
    }),
  },
})
