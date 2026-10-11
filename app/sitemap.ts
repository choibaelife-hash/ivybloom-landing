import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { sitemapPostsQuery } from '@/sanity/queries'
import { SITE_URL, articleUrl } from '@/lib/editorial/public-post'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: { slug: string }[] = []
  try {
    slugs = await client.fetch(sitemapPostsQuery, {}, { cache: 'no-store' })
  } catch {
    // Sanity not configured yet
  }

  const articleEntries = slugs.filter((s) => s.slug).map((s) => ({ url: articleUrl(s.slug) }))

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/services` },
    { url: `${SITE_URL}/contact` },
    { url: `${SITE_URL}/articles` },
    ...articleEntries,
  ]
}
