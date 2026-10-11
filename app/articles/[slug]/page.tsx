import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/PostArticle'
import { getPublicPost, getPublicSlugs, metadataForPost } from '@/lib/editorial/post-loader'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return await getPublicSlugs()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPublicPost(slug)
    return post ? metadataForPost(post) : {}
  } catch {
    return {}
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = await getPublicPost(slug)
  } catch {
    notFound()
  }
  if (!post) notFound()
  return <PostArticle post={post} />
}
