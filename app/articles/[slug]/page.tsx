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

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

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
    const post = await client.fetch(postBySlugQuery, { slug: params.slug })
    if (!post) return {}
    return {
      title: post.title,
      description: post.excerpt ?? '',
      openGraph: {
        title: post.title,
        description: post.excerpt ?? '',
        type: 'article',
        publishedTime: post.publishedAt,
        images: post.mainImage
          ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }]
          : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: Props) {
  let post = null
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
              slug: params.slug,
              schemaOrgType: post.schemaOrgType,
              faqSection: post.faqSection,
              basePath: 'articles',
            })
          ),
        }}
      />
      <Nav />
      <main className="pt-16">
        {post.mainImage && (
          <div className="relative h-64 sm:h-96 bg-brand-dark">
            <Image
              src={urlFor(post.mainImage).width(1600).height(600).url()}
              alt={post.mainImage.alt ?? post.title}
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs text-brand-rose uppercase tracking-wider mb-4">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-sm max-w-none text-brand-dark/80 leading-relaxed
            prose-headings:font-display prose-headings:text-brand-dark
            prose-a:text-brand-burgundy prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-brand-burgundy prose-blockquote:text-brand-dark/60">
            <PortableText value={post.body} />
          </div>
        </article>

        <CTASection />
      </main>
      <Footer />

      {/* Sticky 카카오 CTA */}
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
