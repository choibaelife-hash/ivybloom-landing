import { groq } from 'next-sanity'

export const postsPreviewQuery = groq`
  *[_type in ["post", "journalPost"] && !(_id in path("drafts.**")) && defined(title) && defined(slug.current) && count(body) > 0] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    mainImage { asset, alt }
  }
`

export const allPostsQuery = groq`
  *[_type in ["post", "journalPost"] && !(_id in path("drafts.**")) && defined(title) && defined(slug.current) && count(body) > 0] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    mainImage { asset, alt }
  }
`

export const postBySlugQuery = groq`
  *[_type in ["post", "journalPost"] && !(_id in path("drafts.**")) && defined(title) && count(body) > 0 && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    category,
    author,
    excerpt,
    mainImage { asset, alt },
    body,
    "readingTime": round(length(pt::text(body)) / 1000),
    metaTitle,
    metaDescription,
    ogImage { asset },
    focusKeyphrase,
    keywords,
    canonical,
    noindex,
    schemaOrgType,
    twitterTitle,
    twitterDescription,
    cta { label, url },
    "faqSection": faqSection[] { _key, question, answer },
    "relatedPosts": relatedPosts[]->{ _id, title, slug, noindex }
  }
`

export const allSlugsQuery = groq`
  *[_type in ["post", "journalPost"] && !(_id in path("drafts.**")) && defined(title) && defined(slug.current) && count(body) > 0] { "slug": slug.current }
`

export const sitemapPostsQuery = groq`
  *[_type in ["post", "journalPost"] && !(_id in path("drafts.**")) && defined(title) && defined(slug.current) && count(body) > 0 && noindex != true] {
    "slug": slug.current
  }
`
