export type OutlineItem = {
  heading?: string
  promise?: string
  evidenceNote?: string
  needsVerification?: boolean
}

export type Brief = {
  articleKind?: string
  audienceSituation?: string
  keyQuestion?: string
  desiredOutcome?: string
  focusKeyphrase?: string
  scopeNote?: string
  coreAnswer?: string
  plannedOutline?: OutlineItem[]
}

export type BusinessProfile = {
  offerings?: string
  customers?: string
  process?: string
  publicEvidence?: string
  voice?: string
  avoidClaims?: string
}

export type PlanningQuestion = { field: keyof Brief; question: string; reason: string }

export type GuideSection = {
  heading: string
  instruction: string
  facts: string
  conditions: string
  avoid: string
}

export type WritingGuide = {
  source: 'local-rules'
  selectedTitle?: string
  audience: string
  centralQuestion: string
  scope: string
  titleCandidates: string[]
  directAnswer: string
  sections: GuideSection[]
  unresolved: string[]
  briefFingerprint: string
}

export type TextSpan = { _key?: string; text?: string }
export type BodyBlock = {
  _key?: string
  _type?: string
  style?: string
  children?: TextSpan[]
  alt?: string
}

export type ReviewSuggestion = {
  id: string
  blockKey?: string
  childKey?: string
  originalText?: string
  problem: string
  reason: string
  factToCheck: string
  minimalEdit: string
  rule: number
}

export function selectedEdit(item: ReviewSuggestion, blocks: BodyBlock[], checkedFingerprint: string, currentFingerprint: string, replacement: string | undefined):
  | { ok: true; blockKey: string; childKey: string; text: string }
  | { ok: false; reason: string } {
  if (checkedFingerprint !== currentFingerprint) return { ok: false, reason: '원고가 바뀌었습니다. 원고 점검을 다시 실행하세요.' }
  if (!item.blockKey || !item.childKey || item.originalText === undefined) return { ok: false, reason: '직접 적용할 수 없는 안내입니다.' }
  const child = blocks.find((block) => block._key === item.blockKey)?.children?.find((span) => span._key === item.childKey)
  if (child?.text !== item.originalText) return { ok: false, reason: '해당 문장이 바뀌어 제안을 적용하지 않았습니다.' }
  if (replacement === undefined || replacement === item.originalText) return { ok: false, reason: '수정 문장을 먼저 직접 고쳐 주세요.' }
  return { ok: true, blockKey: item.blockKey, childKey: item.childKey, text: replacement }
}

const clean = (value?: string) => value?.trim() ?? ''
export const fingerprint = (value: unknown) => JSON.stringify(value)

export function planningQuestions(brief: Brief): PlanningQuestion[] {
  const candidates: PlanningQuestion[] = [
    { field: 'audienceSituation', question: '누가 어떤 상황에서 이 글을 읽나요?', reason: '독자의 상황이 있어야 설명의 깊이를 정할 수 있습니다.' },
    { field: 'keyQuestion', question: '독자가 가장 먼저 해결하려는 질문은 무엇인가요?', reason: '글의 중심 답변을 정하는 데 필요합니다.' },
    { field: 'desiredOutcome', question: '읽은 뒤 무엇을 이해하거나 할 수 있어야 하나요?', reason: '글의 목적과 마무리를 정하는 데 필요합니다.' },
    { field: 'coreAnswer', question: '현재 알고 있는 직접 답변이나 사실은 무엇인가요?', reason: '없는 사실을 만들어 가이드에 넣지 않기 위해 필요합니다.' },
  ]
  return candidates.filter(({ field }) => !clean(brief[field] as string | undefined)).slice(0, 4)
}

export function makeWritingGuide(brief: Brief, profile: BusinessProfile = {}): WritingGuide {
  const question = clean(brief.keyQuestion)
  const topic = clean(brief.focusKeyphrase) || question.replace(/[?？]$/, '')
  const outline = (brief.plannedOutline ?? []).filter((item) => clean(item.heading))
  const unresolved: string[] = []
  if (!clean(brief.coreAnswer)) unresolved.push('핵심 답변과 그 근거 확인 필요')
  if (!clean(brief.scopeNote)) unresolved.push('적용 대상·조건·제외 범위 확인 필요')
  if (!clean(profile.publicEvidence) && !outline.some((item) => clean(item.evidenceNote))) {
    unresolved.push('고객 고유 주장에 사용할 공개 근거 확인 필요')
  }
  const sourceSections = outline.length ? outline : [
    { heading: '핵심 질문에 답하기', promise: question },
    { heading: '적용 범위와 조건', promise: clean(brief.scopeNote) },
    { heading: '확인할 자료와 다음 단계', promise: clean(brief.desiredOutcome) },
  ]
  const sections = sourceSections.map((item) => ({
    heading: clean(item.heading),
    instruction: clean(item.promise) || `독자가 ${question || '중심 질문'}에 답을 얻도록 이 절의 역할을 구체적으로 적으세요.`,
    facts: clean(item.evidenceNote) || '이 절에 필요한 사실·자료를 작성자가 확인하세요.',
    conditions: clean(brief.scopeNote) || '대상·시기·지역·예외를 확인하고 적용 범위를 밝히세요.',
    avoid: clean(profile.avoidClaims) || '확인되지 않은 성과·가격·자격·보장 표현을 쓰지 마세요.',
  }))
  return {
    source: 'local-rules',
    audience: clean(brief.audienceSituation) || '대상 독자 확인 필요',
    centralQuestion: question || '중심 질문 확인 필요',
    scope: clean(brief.scopeNote) || '적용 범위 확인 필요',
    titleCandidates: [
      question || `${topic || '주제'}: 독자 질문 확인 필요`,
      topic ? `${topic}에서 먼저 확인할 것` : '주제를 입력하면 제목 후보가 표시됩니다',
      topic ? `${topic}: 적용 조건과 준비 방법` : '적용 범위를 입력하면 제목 후보가 표시됩니다',
    ],
    directAnswer: clean(brief.coreAnswer) || '직접 답변 확인 필요. 작성자가 제공한 사실만 사용하세요.',
    sections,
    unresolved,
    briefFingerprint: fingerprint(brief),
  }
}

export function bodyText(blocks: BodyBlock[]): string {
  return blocks.filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join('\n')
}

export function reviewDraft(title: string, brief: Brief, blocks: BodyBlock[]): ReviewSuggestion[] {
  const suggestions: ReviewSuggestion[] = []
  const text = bodyText(blocks)
  if (clean(title) && !text) {
    suggestions.push({
      id: 'empty-body', problem: '제목이 있지만 본문이 없습니다.',
      reason: '제목에서 약속한 내용을 독자가 확인할 수 없습니다.',
      factToCheck: '본문에 넣을 실제 설명과 자료를 확인하세요.',
      minimalEdit: '기획의 핵심 답변과 적용 조건을 본문에 작성하세요.', rule: 7,
    })
  }
  if (clean(brief.keyQuestion) && !clean(brief.coreAnswer)) {
    suggestions.push({
      id: 'missing-answer', problem: '기획에 핵심 질문은 있으나 직접 답변이 비어 있습니다.',
      reason: '본문이 질문에 바로 답하는지 판단하기 어렵습니다.',
      factToCheck: '작성자가 확인한 답과 근거를 적으세요.',
      minimalEdit: '첫 설명 단락에 검증 가능한 직접 답변을 추가하세요.', rule: 8,
    })
  }
  if (text) {
    const titleTerms = clean(title).split(/[\s:：,?？()]+/).filter((term) => term.length >= 3)
    if (titleTerms.length && !titleTerms.some((term) => text.includes(term))) {
      suggestions.push({
        id: 'title-promise', problem: '제목의 핵심 표현을 본문에서 찾지 못했습니다.',
        reason: '제목이 약속한 내용을 실제로 다루는지 사람이 확인해야 합니다. 다른 표현으로 설명했을 수도 있습니다.',
        factToCheck: '제목이 독자에게 약속한 답과 본문의 해당 절을 비교하세요.',
        minimalEdit: '본문에 해당 답을 넣거나 제목을 본문에 맞게 고치세요.', rule: 7,
      })
    }
    if (clean(brief.coreAnswer) && !text.includes(clean(brief.coreAnswer))) {
      suggestions.push({
        id: 'answer-wording', problem: '기획의 핵심 답변 문구를 본문에서 찾지 못했습니다.',
        reason: '같은 뜻의 다른 표현일 수도 있으므로 독자가 직접 답을 찾는지 확인해야 합니다.',
        factToCheck: '기획 답변의 사실·조건과 본문 첫 설명을 대조하세요.',
        minimalEdit: '필요하면 직접 답변을 앞부분에 명확히 쓰세요.', rule: 8,
      })
    }
    if (clean(brief.scopeNote) && !text.includes(clean(brief.scopeNote))) {
      suggestions.push({
        id: 'scope-wording', problem: '기획의 적용 범위 문구를 본문에서 찾지 못했습니다.',
        reason: '조건이나 예외를 빠뜨리면 독자가 글을 넓게 적용할 수 있습니다. 다른 표현으로 썼을 수도 있습니다.',
        factToCheck: '대상·시기·지역·예외가 본문에 실제로 명시됐는지 확인하세요.',
        minimalEdit: '해당 조건을 관련 단락에 짧게 추가하세요.', rule: 14,
      })
    }
  }
  const seen = new Set<string>()
  for (const block of blocks) {
    if (block._type === 'image' && !clean(block.alt)) {
      suggestions.push({
        id: `image-alt-${block._key}`, blockKey: block._key,
        problem: '본문 이미지에 대체 설명이 없습니다.',
        reason: '이미지를 보지 못하는 독자에게 실제 내용을 전달할 수 없습니다.',
        factToCheck: '이미지가 정보인지 장식인지, 화면에 실제 무엇이 보이는지 확인하세요.',
        minimalEdit: '이미지 필드에서 실제 내용을 짧게 설명하세요.', rule: 14,
      })
    }
    if (block._type !== 'block') continue
    for (const child of block.children ?? []) {
      const value = clean(child.text)
      if (!value) continue
      const normalized = value.replace(/\s+/g, ' ')
      if (seen.has(normalized) && normalized.length > 30) {
        suggestions.push({
          id: `duplicate-${block._key}-${child._key}`, blockKey: block._key, childKey: child._key,
          originalText: child.text, problem: '같은 문장이 다른 위치에도 있습니다.',
          reason: '반복이 독자의 이해에 필요한지 확인해야 합니다.',
          factToCheck: '의도적인 요약 또는 인용인지 확인하세요.',
          minimalEdit: '불필요한 반복이면 이 문장을 삭제하거나 새 정보로 바꾸세요.', rule: 12,
        })
      }
      seen.add(normalized)
      if (/(100\s*%|반드시|무조건|합격\s*보장|최고|유일)/i.test(value)) {
        suggestions.push({
          id: `claim-${block._key}-${child._key}`, blockKey: block._key, childKey: child._key,
          originalText: child.text, problem: '절대적이거나 성과를 보장하는 표현이 있습니다.',
          reason: '적용 조건과 근거 없이 단정하면 독자를 오도할 수 있습니다.',
          factToCheck: '이 표현을 뒷받침할 공개 가능한 근거와 적용 조건이 있나요?',
          minimalEdit: '근거가 없으면 해당 단정을 제거하고 확인된 범위만 적으세요.', rule: 14,
        })
      }
    }
  }
  return suggestions
}

export function suggestMetadata(title: string, blocks: BodyBlock[]) {
  const firstParagraph = blocks.find((block) => block._type === 'block' && block.style !== 'h2' && block.style !== 'h3')
  const paragraph = clean((firstParagraph?.children ?? []).map((child) => child.text ?? '').join(''))
  const excerpt = paragraph ? paragraph.slice(0, 160).trim() : ''
  return { excerpt, metaTitle: clean(title), metaDescription: excerpt }
}
