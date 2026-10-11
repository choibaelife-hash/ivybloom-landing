import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/lib/image'
import { allSlugsQuery, postBySlugQuery } from '@/sanity/queries'
import { publicPostMetadata } from './public-post'
import type { PublicPost } from './public-post'

export async function getPublicPost(slug: string): Promise<PublicPost | null> {
  if (!slug) return null
  return client.fetch<PublicPost | null>(
    postBySlugQuery,
    { slug },
    { cache: 'no-store' },
  )
}

export async function getPublicSlugs() {
  const slugs = await client.fetch<Array<{ slug?: string }>>(allSlugsQuery)
  return slugs.filter((item): item is { slug: string } => Boolean(item.slug))
    .map((item) => ({ slug: item.slug }))
}

export function metadataForPost(post: PublicPost) {
  const image = post.ogImage?.asset?._ref ? post.ogImage : post.mainImage?.asset?._ref ? post.mainImage : undefined
  const imageUrl = image ? urlFor(image as never).width(1200).height(630).url() : undefined
  return publicPostMetadata(post, imageUrl)
}
