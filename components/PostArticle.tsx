import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { urlFor } from '@/sanity/lib/image'
import { buildSchemaOrgJsonLd } from '@/lib/structured-data'
import { articleUrl, canonicalUrl, firstText, safeJsonLd, validRelatedPosts } from '@/lib/editorial/public-post'
import type { PublicPost } from '@/lib/editorial/public-post'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

const portableComponents: PortableTextComponents = {
  types: {
    checklistBlock: ({ value }) => (
      <section className="my-6 rounded-sm border border-brand-border bg-brand-cream p-5">
        <h3 className="mb-3 font-semibold text-brand-burgundy">Action Checklist</h3>
        <ul className="space-y-2">{(value.items ?? []).map((item: string, index: number) => <li key={index}>✓ {item}</li>)}</ul>
      </section>
    ),
    tableBlock: ({ value }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr>{['Phase', 'Focus', 'Goal'].map((label) => <th key={label} className="border border-brand-border bg-brand-burgundy p-3 text-left text-brand-cream">{label}</th>)}</tr></thead>
          <tbody>{(value.rows ?? []).map((row: { _key?: string; phase?: string; focus?: string; goal?: string }, index: number) => <tr key={row._key ?? index}><td className="border border-brand-border p-3">{row.phase}</td><td className="border border-brand-border p-3">{row.focus}</td><td className="border border-brand-border p-3">{row.goal}</td></tr>)}</tbody>
        </table>
      </div>
    ),
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-8">
          {/* Native image preserves the uploaded image's proportions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(value).width(1200).auto('format').url()}
            alt={firstText(value.alt) ?? ''}
            loading="lazy"
            className="h-auto w-full rounded-sm"
          />
        </figure>
      )
    },
  },
}

export function PostArticle({ post }: { post: PublicPost }) {
  const slug = post.slug?.current
  if (!slug) return null
  const imageUrl = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage as never).width(1600).url()
    : undefined
  const faqs = (post.faqSection ?? []).filter((item) => firstText(item.question) && firstText(item.answer))
  const related = validRelatedPosts(post)
  const ctaLabel = firstText(post.cta?.label)
  let ctaUrl: string | undefined
  try {
    const parsed = new URL(post.cta?.url ?? '')
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') ctaUrl = parsed.toString()
  } catch { /* Invalid links are not displayed. */ }
  const canonical = canonicalUrl(post) ?? articleUrl(slug)
  const jsonLd = buildSchemaOrgJsonLd({
    title: post.title ?? '',
    publishedAt: post.publishedAt,
    excerpt: firstText(post.metaDescription, post.excerpt),
    slug,
    author: post.author,
    imageUrl,
    schemaOrgType: post.schemaOrgType,
    faqSection: faqs.map((item) => ({ question: item.question!, answer: item.answer! })),
    url: canonical,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <Nav />
      <main className="pt-16">
        {imageUrl && (
          <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={firstText(post.mainImage?.alt) ?? ''} className="h-auto w-full rounded-sm" />
          </div>
        )}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center gap-3 text-xs text-brand-rose uppercase tracking-wider mb-4">
            {post.publishedAt && !Number.isNaN(Date.parse(post.publishedAt)) && (
              <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}</time>
            )}
            {firstText(post.author) && <span>{post.author}</span>}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="prose prose-sm max-w-none text-brand-dark/80 leading-relaxed
            prose-headings:font-display prose-headings:text-brand-dark
            prose-a:text-brand-burgundy prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-brand-burgundy prose-blockquote:text-brand-dark/60">
            <PortableText value={post.body as never} components={portableComponents} />
          </div>
          {faqs.length > 0 && (
            <section className="mt-14 border-t border-brand-border pt-10" aria-label="Frequently asked questions">
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Frequently Asked Questions</h2>
              <dl className="space-y-6">
                {faqs.map((item, index) => (
                  <div key={item._key ?? index} className="border border-brand-border rounded-sm p-5">
                    <dt className="font-semibold text-brand-dark mb-2 text-sm leading-snug">{item.question}</dt>
                    <dd className="text-sm text-brand-dark/70 leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {related.length > 0 && (
            <section className="mt-14 border-t border-brand-border pt-10" aria-label="Related articles">
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-5">Related Articles</h2>
              <ul className="space-y-3">
                {related.map((item) => (
                  <li key={item._id}>
                    <Link href={articleUrl(item.slug!.current!)} className="text-brand-burgundy hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
        {ctaLabel && ctaUrl ? <aside className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <a href={ctaUrl} className="inline-block bg-brand-burgundy text-brand-cream px-6 py-3 rounded-sm hover:bg-brand-dark">{ctaLabel}</a>
        </aside> : <CTASection />}
      </main>
      <Footer />
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-brand-burgundy text-brand-cream text-sm px-5 py-3 rounded-full shadow-lg hover:bg-brand-dark transition-colors"
      >
        📱 무료 상담
      </a>
    </>
  )
}
