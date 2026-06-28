import { groq } from 'next-sanity'

export const postsPreviewQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [0...3] {
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
  *[_type == "post"] | order(publishedAt desc) {
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
  *[_type == "post" && slug.current == $slug][0] {
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
    "faqSection": faqSection[] { question, answer }
  }
`

export const allSlugsQuery = groq`
  *[_type == "post"] { "slug": slug.current }
`
