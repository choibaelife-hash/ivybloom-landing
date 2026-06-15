export type FaqItem = { question: string; answer: string }

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'IVY BLOOM CONSULTING',
    description:
      'Expert US college and boarding school admissions consulting for Korean-American students.',
    url: 'https://ivybloomconsulting.com',
    telephone: '+15706778811',
    sameAs: [
      'https://blog.naver.com/ivybloom_consulting',
      'https://pf.kakao.com/_ybbloom',
    ],
  }
}

export function articleSchema(post: {
  title: string
  publishedAt: string
  excerpt?: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.excerpt ?? '',
    url: `https://ivybloomconsulting.com/articles/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'IVY BLOOM CONSULTING',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IVY BLOOM CONSULTING',
    },
  }
}

export function blogPostingSchema(post: {
  title: string
  publishedAt: string
  excerpt?: string
  slug: string
  author?: string
  imageUrl?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.excerpt ?? '',
    url: `https://ivybloomconsulting.com/blog/${post.slug}`,
    ...(post.imageUrl && { image: [post.imageUrl] }),
    ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
    author: {
      '@type': post.author ? 'Person' : 'Organization',
      name: post.author ?? 'IVY BLOOM CONSULTING',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IVY BLOOM CONSULTING',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ivybloomconsulting.com/blog/${post.slug}`,
    },
  }
}
