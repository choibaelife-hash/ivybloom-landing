import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { postsPreviewQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  excerpt: string
  mainImage?: { asset: unknown; alt?: string }
  isFallback?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  college:  'College Admissions',
  boarding: 'Boarding School',
  essay:    'Essay',
  sat:      'SAT / ACT',
  other:    'Other',
}

const FALLBACK_POSTS: Post[] = [
  {
    _id: 'fallback-1',
    title: 'How to Build a Winning College List: A Step-by-Step Guide for Korean-American Students',
    slug: { current: '' },
    publishedAt: '2025-09-01',
    category: 'college',
    excerpt: 'Building the right school list is one of the most important — and most misunderstood — parts of the admissions process.',
    isFallback: true,
  },
  {
    _id: 'fallback-2',
    title: 'Common App Essay Mistakes Korean Students Make (And How to Fix Them)',
    slug: { current: '' },
    publishedAt: '2025-08-15',
    category: 'essay',
    excerpt: 'The personal statement is your chance to stand out. Here are the pitfalls we see most often — and what to do instead.',
    isFallback: true,
  },
  {
    _id: 'fallback-3',
    title: 'Boarding School vs. Public High School: What Top US Universities Actually Prefer',
    slug: { current: '' },
    publishedAt: '2025-07-20',
    category: 'boarding',
    excerpt: 'Does attending a boarding school really improve your chances? We break down the data and what admissions officers look for.',
    isFallback: true,
  },
]

export default async function BlogPreview() {
  let posts: Post[] = []
  try {
    posts = await client.fetch(postsPreviewQuery, {}, { next: { revalidate: 3600 } })
  } catch {
    // Sanity 미연결 시 더미 포스트 사용
  }

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS

  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-14">
          <div>
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-2">
              Articles
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
              Insights & Guides
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-sm text-brand-burgundy hover:underline hidden sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => {
            const CardWrapper = post.isFallback
              ? ({ children }: { children: React.ReactNode }) => (
                  <div className="group bg-white border border-brand-border rounded-sm overflow-hidden">
                    {children}
                  </div>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <Link
                    href={`/articles/${post.slug.current}`}
                    className="group bg-white border border-brand-border rounded-sm overflow-hidden hover:border-brand-rose transition-colors"
                  >
                    {children}
                  </Link>
                )

            return (
              <CardWrapper key={post._id}>
                <div className="relative aspect-video bg-brand-border">
                  {!post.isFallback && post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(400).height(225).url()}
                      alt={post.mainImage.alt ?? post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy/20 to-brand-rose/20" />
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs text-brand-rose uppercase tracking-wider mb-2">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </p>
                  <h3 className="font-display font-bold text-base text-brand-dark leading-snug mb-2 group-hover:text-brand-burgundy transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-brand-dark/40">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </CardWrapper>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/articles" className="text-sm text-brand-burgundy hover:underline">
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  )
}
