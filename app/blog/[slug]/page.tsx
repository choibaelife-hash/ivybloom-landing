import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { client } from '@/sanity/client'
import { postBySlugQuery, allSlugsQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'
import { buildSchemaOrgJsonLd } from '@/lib/structured-data'

const SITE_URL = 'https://ivybloomconsulting.com'
const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

type FaqItem = { question: string; answer: string }

type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  author?: string
  excerpt?: string
  mainImage?: { asset: unknown; alt?: string }
  body: unknown[]
  readingTime?: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset: unknown }
  focusKeyphrase?: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
  schemaOrgType?: string
  twitterTitle?: string
  twitterDescription?: string
  faqSection?: FaqItem[]
}

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)
    return slugs.map((s) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post: Post | null = await client.fetch(postBySlugQuery, { slug: params.slug })
    if (!post) return {}

    const title       = post.metaTitle ?? post.title
    const description = post.metaDescription ?? post.excerpt ?? ''
    const canonical   = post.canonical ?? `${SITE_URL}/blog/${post.slug.current}`

    const imageUrl = post.ogImage
      ? urlFor(post.ogImage).width(1200).height(630).url()
      : post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined

    return {
      title,
      description,
      ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
      robots: post.noindex ? 'noindex,nofollow' : 'index,follow',
      alternates: { canonical },
      openGraph: {
        title: post.metaTitle ?? post.title,
        description: post.metaDescription ?? post.excerpt ?? '',
        type: 'article',
        publishedTime: post.publishedAt,
        url: canonical,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.twitterTitle ?? post.metaTitle ?? post.title,
        description: post.twitterDescription ?? post.metaDescription ?? post.excerpt ?? '',
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: Props) {
  let post: Post | null = null
  try {
    post = await client.fetch(
      postBySlugQuery,
      { slug: params.slug },
      { next: { revalidate: 3600 } }
    )
  } catch {
    notFound()
  }

  if (!post) notFound()

  const slug      = post.slug.current
  const canonical = post.canonical ?? `${SITE_URL}/blog/${slug}`
  const imageUrl  = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(600).url()
    : null
  const readingTime = Math.max(1, post.readingTime ?? 1)
  const hasFaq    = (post.faqSection?.length ?? 0) > 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildSchemaOrgJsonLd({
              title: post.title,
              publishedAt: post.publishedAt,
              excerpt: post.excerpt,
              slug,
              author: post.author,
              imageUrl: imageUrl ?? undefined,
              keywords: post.keywords,
              schemaOrgType: post.schemaOrgType,
              faqSection: post.faqSection,
              basePath: 'blog',
            })
          ),
        }}
      />
      <Nav />
      <main className="pt-16">
        {imageUrl && (
          <div className="relative h-64 sm:h-96 bg-brand-dark">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt ?? post.title}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          {/* 메타 */}
          <div className="flex items-center gap-3 text-xs text-brand-rose uppercase tracking-wider mb-4">
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
            <span className="text-brand-border">·</span>
            <span>{readingTime} min read</span>
            {post.author && (
              <>
                <span className="text-brand-border">·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8 leading-tight">
            {post.title}
          </h1>

          {/* 본문 */}
          <div className="prose prose-sm max-w-none text-brand-dark/80 leading-relaxed
            prose-headings:font-display prose-headings:text-brand-dark
            prose-a:text-brand-burgundy prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-brand-burgundy prose-blockquote:text-brand-dark/60
            prose-img:rounded-sm">
            <PortableText value={post.body as never} />
          </div>

          {/* FAQ 섹션 */}
          {hasFaq && (
            <div className="mt-14 border-t border-brand-border pt-10">
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">
                Frequently Asked Questions
              </h2>
              <dl className="space-y-6">
                {post.faqSection!.map((item, i) => (
                  <div key={i} className="border border-brand-border rounded-sm p-5">
                    <dt className="font-semibold text-brand-dark mb-2 text-sm leading-snug">
                      {item.question}
                    </dt>
                    <dd className="text-sm text-brand-dark/70 leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Canonical 힌트 (숨김) */}
          <link rel="canonical" href={canonical} />
        </article>

        <CTASection />
      </main>
      <Footer />

      {/* 플로팅 카카오 CTA */}
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-brand-burgundy text-brand-cream text-sm px-5 py-3 rounded-full shadow-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
      >
        📱 <span className="hidden sm:inline">무료 상담</span>
      </a>
    </>
  )
}
