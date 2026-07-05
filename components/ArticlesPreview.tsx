import { client } from '@/sanity/client'
import { allPostsQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'
import ArticlesSliderClient, { type SliderPost } from './ArticlesSliderClient'

type SanityPost = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  mainImage?: { asset: unknown; alt?: string }
}

const PLACEHOLDER_POSTS: SliderPost[] = [
  { _id: 'p1', title: 'When Should You Start Preparing for US College Admissions?', slug: '#', publishedAt: '2026-06-01', category: 'college' },
  { _id: 'p2', title: 'How US Boarding School Applications Work — A Complete Guide', slug: '#', publishedAt: '2026-05-15', category: 'boarding' },
  { _id: 'p3', title: 'What Makes a Strong College Application Essay?', slug: '#', publishedAt: '2026-05-01', category: 'essay' },
  { _id: 'p4', title: 'SAT vs ACT: Which Test Is Right for Your Child?', slug: '#', publishedAt: '2026-04-20', category: 'sat' },
  { _id: 'p5', title: 'Top Boarding Schools in the US: Exeter, Andover, and Beyond', slug: '#', publishedAt: '2026-04-10', category: 'boarding' },
  { _id: 'p6', title: 'How to Build an Extracurricular Profile That Stands Out', slug: '#', publishedAt: '2026-03-25', category: 'college' },
]

export default async function ArticlesPreview() {
  let posts: SliderPost[] = []

  try {
    const raw: SanityPost[] = await client.fetch(
      allPostsQuery,
      {},
      { next: { revalidate: 3600 } }
    )
    posts = raw.slice(0, 6).map(p => ({
      _id:         p._id,
      title:       p.title,
      slug:        p.slug.current,
      publishedAt: p.publishedAt,
      category:    p.category,
      imageUrl:    p.mainImage
        ? urlFor(p.mainImage).width(600).height(600).url()
        : undefined,
    }))
  } catch {
    // Sanity 미설정
  }

  return <ArticlesSliderClient posts={posts.length > 0 ? posts : PLACEHOLDER_POSTS} />
}
