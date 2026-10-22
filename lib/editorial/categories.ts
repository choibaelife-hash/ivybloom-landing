export const ARTICLE_CATEGORIES = [
  { value: 'story', label: 'Ivy Bloom’s Stories' },
  { value: 'college', label: 'College Admissions' },
  { value: 'boarding', label: 'Boarding School Admissions' },
  { value: 'consultation', label: 'Parent & Student Consultation' },
  { value: 'other', label: 'Other' },
]

export function isLegacyArticleCategory(value: unknown): value is 'sat' | 'essay' {
  return value === 'sat' || value === 'essay'
}

// Keep old article links and saved categories readable without rewriting CMS data.
export function articleCategory(value?: string): string {
  if (isLegacyArticleCategory(value)) return 'college'
  return ARTICLE_CATEGORIES.some((category) => category.value === value) ? value! : 'other'
}

export function articleCategoryLabel(value?: string): string {
  return ARTICLE_CATEGORIES.find((category) => category.value === articleCategory(value))!.label
}
