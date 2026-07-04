export type FaqItem = { question: string; answer: string }

const ORG = {
  '@type': 'Organization',
  name: 'IVY BLOOM CONSULTING',
  url: 'https://ivybloomconsulting.com',
} as const

type SchemaPost = {
  title: string
  publishedAt: string
  excerpt?: string
  slug: string
  author?: string
  imageUrl?: string
  keywords?: string[]
  schemaOrgType?: string
  faqSection?: FaqItem[]
  basePath?: 'blog' | 'articles'
}

export function buildSchemaOrgJsonLd(post: SchemaPost) {
  const url = `https://ivybloomconsulting.com/${post.basePath ?? 'articles'}/${post.slug}`
  const type = post.schemaOrgType ?? 'BlogPosting'

  const base = {
    '@context': 'https://schema.org',
    name: post.title,
    headline: post.title,
    description: post.excerpt ?? '',
    url,
    datePublished: post.publishedAt,
    ...(post.imageUrl && { image: [post.imageUrl] }),
    ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  if (type === 'FAQPage' && post.faqSection?.length) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqSection.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }
  }

  if (type === 'Course') {
    return {
      ...base,
      '@type': 'Course',
      provider: ORG,
    }
  }

  if (type === 'Service') {
    return {
      ...base,
      '@type': 'Service',
      provider: ORG,
    }
  }

  if (type === 'Article') {
    return {
      ...base,
      '@type': 'Article',
      author: post.author ? { '@type': 'Person', name: post.author } : ORG,
    }
  }

  // default: BlogPosting
  return {
    ...base,
    '@type': 'BlogPosting',
    author: post.author ? { '@type': 'Person', name: post.author } : ORG,
  }
}

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
      'https://pf.kakao.com/_pxeZhs',
    ],
  }
}

export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About IVY BLOOM CONSULTING',
    description:
      'IVY BLOOM is a Seoul-based US college and boarding school admissions consultancy founded in 2019, specializing in personalized strategy for students applying to top US universities and boarding schools.',
    url: 'https://ivybloomconsulting.com/about',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'IVY BLOOM CONSULTING',
      foundingDate: '2019',
      description:
        'Expert US college and boarding school admissions consulting for Korean-American and international students worldwide. Personalized strategy — no templates.',
      url: 'https://ivybloomconsulting.com',
      areaServed: ['United States', 'South Korea', 'International'],
      knowsAbout: [
        'US college admissions',
        'boarding school admissions',
        'Common Application strategy',
        'college essay writing',
        'Ivy League admissions',
        'Exeter Andover Choate consulting',
      ],
      founder: {
        '@type': 'Person',
        name: '김소희',
        alternateName: 'Sohee Kim',
        jobTitle: 'US College Admissions Consultant',
        description:
          '7년째 미국 대학 전문 입시컨설턴트로 활동 중. Sohee Kim has been a specialist US college admissions consultant for 7 years, guiding students through the full application process from school list strategy to essay development.',
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'IVY BLOOM CONSULTING',
        },
      },
    },
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
