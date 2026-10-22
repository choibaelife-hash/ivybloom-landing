export const ARTICLE_CATEGORIES = [
  { value: 'story', label: 'Ivy Bloom’s Stories' },
  { value: 'college', label: 'College Admissions' },
  { value: 'boarding', label: 'Boarding School Admissions' },
  { value: 'consultation', label: 'Parent & Student Consultation' },
]

export function isLegacyArticleCategory(value: unknown): value is 'sat' | 'essay' | 'other' {
  return value === 'sat' || value === 'essay' || value === 'other'
}

// Keep old article links and saved categories readable without rewriting CMS data.
// 'other' has no filter of its own; such posts appear under All only.
export function articleCategory(value?: string): string | undefined {
  if (value === 'sat' || value === 'essay') return 'college'
  return ARTICLE_CATEGORIES.some((category) => category.value === value) ? value : undefined
}

export function articleCategoryLabel(value?: string): string {
  if (value === 'other') return 'Other'
  return ARTICLE_CATEGORIES.find((category) => category.value === articleCategory(value))?.label ?? ''
}
