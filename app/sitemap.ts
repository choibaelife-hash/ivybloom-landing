import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { allSlugsQuery } from '@/sanity/queries'

const BASE_URL = 'https://ivybloomconsulting.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: { slug: string }[] = []
  try {
    slugs = await client.fetch(allSlugsQuery)
  } catch {
    // Sanity not configured yet
  }

  const articleEntries = slugs.map((s) => ({
    url: `${BASE_URL}/articles/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE_URL,               changeFrequency: 'weekly',  priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/articles`, changeFrequency: 'weekly',  priority: 0.8, lastModified: new Date() },
    ...articleEntries,
  ]
}
