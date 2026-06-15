import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { client } from '@/sanity/client'
import { allPostsQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Expert insights on US college admissions, boarding schools, and essay writing for Korean-American students.',
}

const CATEGORIES = [
  { value: 'all',      label: 'All' },
  { value: 'college',  label: 'College Admissions' },
  { value: 'boarding', label: 'Boarding School' },
  { value: 'sat',      label: 'SAT / ACT' },
  { value: 'essay',    label: 'Essay' },
  { value: 'other',    label: 'Other' },
]

const CATEGORY_LABELS: Record<string, string> = {
  college:  'College Admissions',
  boarding: 'Boarding School',
  essay:    'Essay',
  sat:      'SAT / ACT',
  other:    'Other',
}

type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  excerpt: string
  mainImage?: { asset: unknown; alt?: string }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  let posts: Post[] = []
  try {
    posts = await client.fetch(allPostsQuery, {}, { next: { revalidate: 3600 } })
  } catch {
    // Sanity not configured yet
  }

  const activeCategory = searchParams.category ?? 'all'
  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="bg-brand-burgundy py-16 text-center">
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Articles</p>
          <h1 className="font-display text-4xl font-bold text-brand-cream">
            Insights & Guides
          </h1>
        </div>

        {/* 카테고리 필터 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/articles' : `/articles?category=${cat.value}`}
                className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-brand-burgundy text-brand-cream border-brand-burgundy'
                    : 'bg-white text-brand-dark border-brand-border hover:border-brand-rose'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {filtered.length === 0 ? (
            <p className="text-center text-brand-dark/50 py-10">
              {posts.length === 0
                ? 'No articles yet. Check back soon.'
                : 'No articles in this category yet.'}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post._id}
                  href={`/articles/${post.slug.current}`}
                  className="group bg-white border border-brand-border rounded-sm overflow-hidden hover:border-brand-rose transition-colors"
                >
                  <div className="relative aspect-video bg-brand-border">
                    {post.mainImage ? (
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
                    <h2 className="font-display font-bold text-base text-brand-dark leading-snug mb-2 group-hover:text-brand-burgundy transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-brand-dark/40">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
