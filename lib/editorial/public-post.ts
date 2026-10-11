import type { Metadata } from 'next'

export const SITE_URL = 'https://ivybloomconsulting.com'
export const ARTICLE_PATH = '/articles'

export type PublicPost = {
  _id: string
  title?: string
  slug?: { current?: string }
  publishedAt?: string
  category?: string
  author?: string
  excerpt?: string
  mainImage?: { asset?: { _ref?: string }; alt?: string }
  body?: unknown[]
  readingTime?: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset?: { _ref?: string } }
  canonical?: string
  noindex?: boolean
  schemaOrgType?: string
  twitterTitle?: string
  twitterDescription?: string
  cta?: { label?: string; url?: string }
  faqSection?: Array<{ _key?: string; question?: string; answer?: string }>
  relatedPosts?: Array<{ _id?: string; title?: string; slug?: { current?: string }; noindex?: boolean } | null>
}

export function firstText(...values: Array<string | null | undefined>): string | undefined {
  return values.map((value) => value?.trim()).find((value) => Boolean(value))
}

export function articleUrl(slug: string): string {
  return `${SITE_URL}${ARTICLE_PATH}/${encodeURIComponent(slug)}`
}

export function canonicalUrl(post: PublicPost): string | undefined {
  const custom = firstText(post.canonical)
  if (custom) {
    try {
      const parsed = new URL(custom)
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return parsed.toString()
    } catch {
      // Invalid overrides must not break public pages.
    }
  }
  return post.slug?.current ? articleUrl(post.slug.current) : undefined
}

export function publicPostMetadata(post: PublicPost, imageUrl?: string): Metadata {
  const title = firstText(post.metaTitle, post.title)
  const description = firstText(post.metaDescription, post.excerpt)
  const canonical = canonicalUrl(post)
  const twitterTitle = firstText(post.twitterTitle, title)
  const twitterDescription = firstText(post.twitterDescription, description)
  return {
    ...(title && { title }),
    ...(description && { description }),
    ...(canonical && { alternates: { canonical } }),
    robots: post.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      ...(canonical && { url: canonical }),
      type: 'article',
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      ...(twitterTitle && { title: twitterTitle }),
      ...(twitterDescription && { description: twitterDescription }),
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function validRelatedPosts(post: PublicPost) {
  const seen = new Set<string>()
  return (post.relatedPosts ?? []).filter((related): related is NonNullable<typeof related> => {
    const slug = related?.slug?.current
    if (!related?._id || !firstText(related.title) || !slug || related.noindex || related._id === post._id || seen.has(related._id)) return false
    seen.add(related._id)
    return true
  })
}
