# IVY BLOOM CONSULTING Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** IVY BLOOM CONSULTING의 SEO/AEO 최적화 랜딩페이지 + Sanity 블로그(Articles) 시스템 구축

**Architecture:** Next.js App Router 싱글페이지 홈(`/`) + Articles 섹션(`/articles`, `/articles/[slug]`) + Sanity Studio(`/studio`). 홈은 11개 섹션을 독립 컴포넌트로 구성하며 BlogPreview는 Sanity에서 ISR로 fetch. SEO는 Schema.org JSON-LD + sitemap.xml + llms.txt로 커버.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, Sanity v3, next-sanity, @portabletext/react, Vercel, next/font (Playfair Display + Inter)

---

## File Map

```
app/
  layout.tsx                   # Root layout: fonts, GA4, metadata
  globals.css                  # Tailwind base
  page.tsx                     # Home: 모든 섹션 조합
  articles/
    page.tsx                   # /articles 목록
    [slug]/
      page.tsx                 # /articles/[slug] 상세
  studio/
    [[...tool]]/
      page.tsx                 # Sanity Studio (next-sanity)
  sitemap.ts                   # 자동 sitemap.xml
  robots.ts                    # robots.txt

components/
  Nav.tsx
  Hero.tsx
  Stats.tsx
  ProblemSection.tsx
  ServicesSection.tsx
  WhyUs.tsx
  Testimonials.tsx
  BlogPreview.tsx              # 3열 그리드, Sanity fetch
  FAQ.tsx                      # FAQPage Schema 포함
  CTASection.tsx
  Footer.tsx

sanity/
  client.ts                    # createClient 설정
  queries.ts                   # GROQ 쿼리 모음
  schemas/
    post.ts                    # Sanity post 스키마
  lib/
    image.ts                   # urlFor helper

lib/
  structured-data.ts           # JSON-LD 헬퍼 (Org, FAQ, Article)
  metadata.ts                  # 페이지별 Metadata 헬퍼

public/
  llms.txt

sanity.config.ts               # Sanity Studio 설정
tailwind.config.ts             # 브랜드 토큰
next.config.ts                 # next-sanity 트랜스파일
.env.local                     # Sanity 환경변수 (gitignore)
```

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `next.config.ts`

- [ ] **Step 1: Next.js 앱 생성**

```bash
cd /Users/km/Desktop/landing-system
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

프롬프트: 모두 기본값(Enter). 이미 파일 있으면 덮어쓰기 선택.

- [ ] **Step 2: 추가 의존성 설치**

```bash
npm install next-sanity @sanity/image-url @portabletext/react
npm install --save-dev @types/node
```

- [ ] **Step 3: tailwind.config.ts — 브랜드 토큰 등록**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#7B2D3E',
          rose:     '#C9919A',
          cream:    '#FAF6F0',
          dark:     '#3D1A24',
          border:   '#E8DDD4',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: app/globals.css — Tailwind 기본 + 배경색**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #FAF6F0;
  color: #3D1A24;
}
```

- [ ] **Step 5: app/layout.tsx — 폰트, 기본 메타데이터**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'IVY BLOOM CONSULTING | US College Admissions for Korean Americans',
    template: '%s | IVY BLOOM CONSULTING',
  },
  description:
    'Expert US college and boarding school admissions consulting for Korean-American students. Personalized essay coaching and end-to-end support.',
  openGraph: {
    siteName: 'IVY BLOOM CONSULTING',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: next.config.ts**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.sanity.io' },
    ],
  },
}
export default nextConfig
```

- [ ] **Step 7: 타입 체크 + 개발 서버 확인**

```bash
npx tsc --noEmit
npm run dev
```

브라우저에서 `http://localhost:3000` 열어 빈 크림 배경 확인.

- [ ] **Step 8: 커밋**

```bash
git init
git add tailwind.config.ts app/globals.css app/layout.tsx next.config.ts
git commit -m "feat: project scaffold with brand tokens and fonts"
```

---

## Task 2: Sanity CMS 설정

**Files:**
- Create: `sanity.config.ts`, `sanity/schemas/post.ts`, `sanity/client.ts`, `sanity/queries.ts`, `sanity/lib/image.ts`, `app/studio/[[...tool]]/page.tsx`, `.env.local`

- [ ] **Step 1: Sanity 프로젝트 초기화**

```bash
npm create sanity@latest -- --project-name "ivybloom" --dataset production --output-path . --template clean
```

프롬프트:
- Login: 기존 계정 또는 신규 가입
- Project name: `ivybloom`
- Dataset: `production`
- Add files to current directory: Yes

완료 후 생성된 `projectId`를 메모.

- [ ] **Step 2: .env.local 생성**

```bash
# .env.local  (이미 .gitignore에 포함됨)
NEXT_PUBLIC_SANITY_PROJECT_ID=여기에_프로젝트ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=   # 나중에 읽기 토큰 추가 (선택)
```

- [ ] **Step 3: sanity/schemas/post.ts — 블로그 포스트 스키마**

```ts
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'College Admissions', value: 'college' },
          { title: 'Boarding School',    value: 'boarding' },
          { title: 'Essay',              value: 'essay' },
          { title: 'SAT / ACT',          value: 'sat' },
          { title: 'Other',              value: 'other' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'mainImage' },
  },
})
```

- [ ] **Step 4: sanity.config.ts**

```ts
import { defineConfig } from 'sanity'
import { structuredClone as sc } from 'next/dist/compiled/@edge-runtime/primitives/structured-clone' // unused, just check
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { postType } from './sanity/schemas/post'

export default defineConfig({
  name: 'ivybloom',
  title: 'IVY BLOOM CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: { types: [postType] },
})
```

- [ ] **Step 5: sanity/client.ts**

```ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

- [ ] **Step 6: sanity/lib/image.ts — urlFor 헬퍼**

```ts
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '../client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Step 7: sanity/queries.ts — GROQ 쿼리**

```ts
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
    excerpt,
    mainImage { asset, alt },
    body
  }
`

export const allSlugsQuery = groq`
  *[_type == "post"] { "slug": slug.current }
`
```

- [ ] **Step 8: app/studio/[[...tool]]/page.tsx — Studio 라우트**

```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 9: 개발 서버에서 Studio 확인**

```bash
npm run dev
```

`http://localhost:3000/studio` 열어 Sanity Studio 로드 확인.
샘플 포스트 1개 작성 후 저장.

- [ ] **Step 10: 커밋**

```bash
git add sanity/ sanity.config.ts app/studio/ .env.local
git commit -m "feat: Sanity CMS setup with post schema and studio route"
```

---

## Task 3: Nav 컴포넌트

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: components/Nav.tsx 작성**

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

const KAKAO_URL = 'https://pf.kakao.com/_ybbloom' // 실제 URL로 교체

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg text-brand-dark tracking-wide">
          IVY BLOOM
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#services" className="text-sm text-brand-dark/70 hover:text-brand-burgundy transition-colors">
            Services
          </Link>
          <Link href="/articles" className="text-sm text-brand-dark/70 hover:text-brand-burgundy transition-colors">
            Articles
          </Link>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-burgundy text-brand-cream text-sm px-5 py-2 rounded hover:bg-brand-dark transition-colors"
          >
            Free Consultation
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brand-dark"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-cream border-t border-brand-border px-4 py-4 flex flex-col gap-4">
          <Link href="#services" className="text-sm text-brand-dark/70" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/articles" className="text-sm text-brand-dark/70" onClick={() => setOpen(false)}>
            Articles
          </Link>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-burgundy text-brand-cream text-sm px-5 py-2 rounded text-center"
          >
            Free Consultation
          </a>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: app/page.tsx에 임시 마운트 후 확인**

```tsx
// app/page.tsx (임시)
import Nav from '@/components/Nav'
export default function Home() {
  return <><Nav /><main className="pt-16 p-8">Home</main></>
}
```

```bash
npm run dev
```

`http://localhost:3000` 에서 Nav 확인. 모바일 너비(375px)로 줄여 햄버거 메뉴 동작 확인.

- [ ] **Step 3: 커밋**

```bash
git add components/Nav.tsx app/page.tsx
git commit -m "feat: Nav component with responsive mobile menu"
```

---

## Task 4: Hero 컴포넌트

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: components/Hero.tsx 작성**

```tsx
const KAKAO_URL = 'https://pf.kakao.com/_ybbloom' // 실제 URL로 교체

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end pb-20 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-dark/60" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">
          Cultivate Your Abilities
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-cream leading-tight mb-6 max-w-2xl">
          Your Path to<br />Top US Universities
        </h1>
        <p className="text-brand-cream/80 text-lg mb-10 max-w-xl">
          Korean-American students guided by expert consultants — from strategy to acceptance.
        </p>
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wide"
        >
          📱 Book a Free Consultation
        </a>
        <p className="text-brand-cream/40 text-xs mt-3">via KakaoTalk — 무료 상담</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: app/page.tsx에 Hero 추가 후 확인**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
export default function Home() {
  return <><Nav /><main className="pt-16"><Hero /></main></>
}
```

```bash
npm run dev
```

Hero 이미지, 오버레이, 텍스트, CTA 버튼 확인. 모바일·데스크탑 양쪽 확인.

- [ ] **Step 3: 커밋**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: Hero section with background image and Kakao CTA"
```

---

## Task 5: Stats + ProblemSection

**Files:**
- Create: `components/Stats.tsx`, `components/ProblemSection.tsx`

- [ ] **Step 1: components/Stats.tsx**

```tsx
const stats = [
  { value: '—', label: 'Students Placed' },
  { value: '—', label: 'Top 20 Admits' },
  { value: '—', label: 'Years of Experience' },
]

export default function Stats() {
  return (
    <section className="bg-white border-y border-brand-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-brand-border text-center">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-4">
              <p className="font-display text-4xl font-bold text-brand-burgundy mb-1">
                {s.value}
              </p>
              <p className="text-xs text-brand-dark/60 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: components/ProblemSection.tsx**

```tsx
const problems = [
  {
    heading: 'GPA alone won\'t get you in',
    body: 'Top universities look far beyond grades. Without a strategic narrative, even strong students get passed over.',
  },
  {
    heading: 'Essay strategy is where most students fail',
    body: 'The Common App and supplement essays are your chance to stand out — but most students don\'t know what admissions officers actually want to read.',
  },
  {
    heading: 'The process feels overwhelming without guidance',
    body: 'Deadlines, school lists, interviews, financial aid — navigating US admissions alone is a full-time job.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          The Challenge
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Why Most Applications Fall Short
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.heading}
              className="border-l-2 border-brand-burgundy pl-5 py-2"
            >
              <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
                {p.heading}
              </h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: app/page.tsx에 추가 후 확인**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import ProblemSection from '@/components/ProblemSection'
export default function Home() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <Stats />
        <ProblemSection />
      </main>
    </>
  )
}
```

```bash
npm run dev
```

Stats 3열, ProblemSection 3열 카드 확인. 모바일 스택 확인.

- [ ] **Step 4: 커밋**

```bash
git add components/Stats.tsx components/ProblemSection.tsx app/page.tsx
git commit -m "feat: Stats and ProblemSection components"
```

---

## Task 6: ServicesSection

**Files:**
- Create: `components/ServicesSection.tsx`

- [ ] **Step 1: components/ServicesSection.tsx**

```tsx
const services = [
  {
    icon: '🎓',
    title: 'College Admissions Consulting',
    description:
      'End-to-end strategy from school list building to final submission. We craft a narrative that highlights your unique strengths.',
  },
  {
    icon: '🏫',
    title: 'Boarding School Consulting',
    description:
      'Expert guidance for secondary school applications in the US. School matching, essays, and interview preparation.',
  },
  {
    icon: '✍️',
    title: 'Essay Coaching',
    description:
      'Common App personal statement and supplemental essays refined to resonate with admissions officers at your target schools.',
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Services
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          How We Help You Get In
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-brand-cream border border-brand-border rounded-sm p-8 hover:border-brand-rose transition-colors"
            >
              <span className="text-4xl mb-5 block">{s.icon}</span>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: app/page.tsx에 추가 후 확인**

ServicesSection import 추가, `<ServicesSection />` 마운트.

```bash
npm run dev
```

3개 카드 호버 효과, 모바일 1열 확인.

- [ ] **Step 3: 커밋**

```bash
git add components/ServicesSection.tsx app/page.tsx
git commit -m "feat: ServicesSection with 3 service cards"
```

---

## Task 7: WhyUs + Testimonials

**Files:**
- Create: `components/WhyUs.tsx`, `components/Testimonials.tsx`

- [ ] **Step 1: components/WhyUs.tsx**

```tsx
import Image from 'next/image'

const differentiators = [
  { icon: '🎯', title: 'Personalized Strategy', desc: 'No cookie-cutter plans. Every student gets a custom roadmap.' },
  { icon: '🇺🇸', title: 'Korean-American Focus', desc: 'We understand your background and how to frame it as a strength.' },
  { icon: '📋', title: 'End-to-End Support', desc: 'From school list to acceptance — we\'re with you every step.' },
  { icon: '✅', title: 'Proven Results',       desc: 'Track record of placements at top 20 US universities and boarding schools.' },
]

export default function WhyUs() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Why Ivy Bloom
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Guidance You Can Trust
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Consultant photo placeholder */}
          <div className="relative aspect-[4/5] bg-brand-border rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="IVY BLOOM consultant"
              fill
              className="object-cover"
            />
            {/* 클라이언트 사진으로 교체 예정 */}
          </div>
          {/* Differentiators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="bg-white border border-brand-border rounded-sm p-5">
                <span className="text-2xl mb-3 block">{d.icon}</span>
                <h3 className="font-display font-bold text-base text-brand-dark mb-1">{d.title}</h3>
                <p className="text-xs text-brand-dark/65 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: components/Testimonials.tsx**

```tsx
const testimonials = [
  {
    quote:
      'IVY BLOOM completely changed how we approached the application process. My daughter was admitted to her dream school — we couldn\'t have done it without their guidance.',
    author: 'Parent of Class of 2025',
  },
  {
    quote:
      'The essay coaching was a game-changer. My consultant helped me find a story I never would have thought to tell. Admitted to UCLA and USC.',
    author: 'Student, Class of 2024',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Testimonials
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          What Our Families Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="border-l-2 border-brand-burgundy pl-6 py-2"
            >
              <p className="text-brand-dark/80 italic leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="not-italic text-xs text-brand-rose tracking-wider uppercase">
                — {t.author}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: app/page.tsx에 추가 후 확인**

WhyUs, Testimonials import 추가 후 마운트.

```bash
npm run dev
```

컨설턴트 사진 표시, 4개 차별점 그리드, 후기 2개 확인.

- [ ] **Step 4: 커밋**

```bash
git add components/WhyUs.tsx components/Testimonials.tsx app/page.tsx
git commit -m "feat: WhyUs and Testimonials sections"
```

---

## Task 8: BlogPreview 컴포넌트

**Files:**
- Create: `components/BlogPreview.tsx`

- [ ] **Step 1: components/BlogPreview.tsx — Sanity에서 3개 fetch, 3열 그리드**

```tsx
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
}

const CATEGORY_LABELS: Record<string, string> = {
  college: 'College Admissions',
  boarding: 'Boarding School',
  essay:   'Essay',
  sat:     'SAT / ACT',
  other:   'Other',
}

export default async function BlogPreview() {
  const posts: Post[] = await client.fetch(
    postsPreviewQuery,
    {},
    { next: { revalidate: 3600 } }
  )

  if (!posts.length) return null

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
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/articles/${post.slug.current}`}
              className="group bg-white border border-brand-border rounded-sm overflow-hidden hover:border-brand-rose transition-colors"
            >
              {/* Image */}
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

              {/* Content */}
              <div className="p-5">
                <p className="text-xs text-brand-rose uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </p>
                <h3 className="font-display font-bold text-base text-brand-dark leading-snug mb-2 group-hover:text-brand-burgundy transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-brand-dark/50">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
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
```

- [ ] **Step 2: app/page.tsx에 추가**

BlogPreview import 추가. `async` 함수이므로 page.tsx도 `async`로 변경 불필요 (Server Component는 자동 async 가능).

```bash
npm run dev
```

Sanity에 포스트가 있으면 카드 표시, 없으면 섹션 숨김 확인.

- [ ] **Step 3: 커밋**

```bash
git add components/BlogPreview.tsx app/page.tsx
git commit -m "feat: BlogPreview section with Sanity ISR fetch, 3-col grid"
```

---

## Task 9: FAQ + FAQPage Schema

**Files:**
- Create: `components/FAQ.tsx`, `lib/structured-data.ts`

- [ ] **Step 1: lib/structured-data.ts — JSON-LD 헬퍼**

```ts
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
    url: 'https://ivybloomconsulting.com', // 실제 도메인으로 교체
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
```

- [ ] **Step 2: components/FAQ.tsx**

```tsx
'use client'

import { useState } from 'react'
import { faqPageSchema, type FaqItem } from '@/lib/structured-data'

const faqs: FaqItem[] = [
  {
    question: 'What is IVY BLOOM CONSULTING?',
    answer:
      'IVY BLOOM CONSULTING is a US college and boarding school admissions consulting firm specializing in Korean-American students. We provide personalized strategy, essay coaching, and end-to-end application support.',
  },
  {
    question: 'How does the consulting process work?',
    answer:
      'We start with a free consultation to understand your goals and background. From there, we build a customized school list, develop your application narrative, coach you through essays, and support you through submission and decision.',
  },
  {
    question: 'How much does IVY BLOOM CONSULTING cost?',
    answer:
      'Pricing varies by service package and level of support. Please reach out via KakaoTalk for a personalized quote.',
  },
  {
    question: 'What makes IVY BLOOM different from other consultants?',
    answer:
      'We focus exclusively on Korean-American students and understand the unique challenges and strengths of this background. Every student receives personalized attention — we do not use generic templates.',
  },
  {
    question: 'Do you offer boarding school consulting?',
    answer:
      'Yes. We support applications to top US boarding schools including school selection, essay guidance, and interview preparation.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-brand-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          FAQ
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-brand-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left gap-4"
              >
                <span className="font-medium text-brand-dark text-sm sm:text-base">
                  {faq.question}
                </span>
                <span className="text-brand-burgundy text-xl flex-shrink-0">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <p className="pb-5 text-sm text-brand-dark/70 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: app/page.tsx에 추가 후 확인**

FAQ import 추가 후 마운트.

```bash
npm run dev
```

아코디언 열기/닫기 동작 확인. 페이지 소스에서 `application/ld+json` FAQPage 스키마 확인.

- [ ] **Step 4: 커밋**

```bash
git add lib/structured-data.ts components/FAQ.tsx app/page.tsx
git commit -m "feat: FAQ component with accordion and FAQPage Schema.org"
```

---

## Task 10: CTASection + Footer

**Files:**
- Create: `components/CTASection.tsx`, `components/Footer.tsx`

- [ ] **Step 1: components/CTASection.tsx**

```tsx
const KAKAO_URL = 'https://pf.kakao.com/_ybbloom'

export default function CTASection() {
  return (
    <section className="bg-brand-burgundy py-20 text-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-4">
          Get Started
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-cream mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-brand-cream/70 mb-10 max-w-md mx-auto">
          Book a free consultation today and take the first step toward your dream university.
        </p>
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-10 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wide"
        >
          📱 카카오톡 상담 신청
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: components/Footer.tsx**

```tsx
import Link from 'next/link'

const KAKAO_URL = 'https://pf.kakao.com/_ybbloom'

export default function Footer() {
  return (
    <footer className="bg-brand-dark py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
          <p className="font-display font-bold text-brand-cream">IVY BLOOM CONSULTING</p>
          <p className="text-brand-cream/40 text-xs mt-1">Cultivate Your Abilities</p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/articles" className="text-brand-cream/50 text-xs hover:text-brand-rose transition-colors">
            Articles
          </Link>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cream/50 text-xs hover:text-brand-rose transition-colors"
          >
            KakaoTalk
          </a>
        </div>

        <p className="text-brand-cream/30 text-xs">
          © {new Date().getFullYear()} IVY BLOOM CONSULTING
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/CTASection.tsx components/Footer.tsx
git commit -m "feat: CTASection and Footer"
```

---

## Task 11: 홈 페이지 최종 조합 + EducationalOrganization Schema

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: app/page.tsx — 전체 섹션 조합 + Schema**

```tsx
import { organizationSchema } from '@/lib/structured-data'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import ProblemSection from '@/components/ProblemSection'
import ServicesSection from '@/components/ServicesSection'
import WhyUs from '@/components/WhyUs'
import Testimonials from '@/components/Testimonials'
import BlogPreview from '@/components/BlogPreview'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <Nav />
      <main className="pt-16">
        <Hero />
        <Stats />
        <ProblemSection />
        <ServicesSection />
        <WhyUs />
        <Testimonials />
        <BlogPreview />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: 전체 확인**

```bash
npm run dev
```

모든 섹션 순서, 빈틈 없이 연결되는지 확인. 스크롤 내려가며 11개 섹션 전체 점검. 페이지 소스에서 `EducationalOrganization` JSON-LD 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/page.tsx
git commit -m "feat: compose home page with all sections and Org Schema"
```

---

## Task 12: /articles 목록 페이지

**Files:**
- Create: `app/articles/page.tsx`

- [ ] **Step 1: app/articles/page.tsx**

```tsx
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

const CATEGORY_LABELS: Record<string, string> = {
  college: 'College Admissions',
  boarding: 'Boarding School',
  essay: 'Essay',
  sat: 'SAT / ACT',
  other: 'Other',
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

export default async function ArticlesPage() {
  const posts: Post[] = await client.fetch(
    allPostsQuery,
    {},
    { next: { revalidate: 3600 } }
  )

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <div className="bg-brand-burgundy py-16 text-center">
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Articles</p>
          <h1 className="font-display text-4xl font-bold text-brand-cream">
            Insights & Guides
          </h1>
        </div>

        {/* Posts grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          {posts.length === 0 ? (
            <p className="text-center text-brand-dark/50">No articles yet. Check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
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
```

- [ ] **Step 2: 확인**

```bash
npm run dev
```

`http://localhost:3000/articles` 에서 포스트 목록 확인. Sanity에 포스트 없으면 "No articles yet" 메시지 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/articles/page.tsx
git commit -m "feat: /articles list page with full post grid"
```

---

## Task 13: /articles/[slug] 상세 + Article Schema

**Files:**
- Create: `app/articles/[slug]/page.tsx`

- [ ] **Step 1: app/articles/[slug]/page.tsx**

```tsx
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
import { articleSchema } from '@/lib/structured-data'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
}

export default async function ArticlePage({ params }: Props) {
  const post = await client.fetch(
    postBySlugQuery,
    { slug: params.slug },
    { next: { revalidate: 3600 } }
  )

  if (!post) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: post.title,
              publishedAt: post.publishedAt,
              excerpt: post.excerpt,
              slug: params.slug,
            })
          ),
        }}
      />
      <Nav />
      <main className="pt-16">
        {/* Hero */}
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

        {/* Article content */}
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
    </>
  )
}
```

- [ ] **Step 2: @tailwindcss/typography 설치 (prose 클래스 사용)**

```bash
npm install @tailwindcss/typography
```

`tailwind.config.ts` plugins 배열에 추가:

```ts
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 3: 확인**

Sanity Studio에서 포스트 1개 작성 후:

```bash
npm run dev
```

`http://localhost:3000/articles/[slug]` 에서 본문 렌더링, 이미지, Article Schema JSON-LD 확인.

- [ ] **Step 4: 커밋**

```bash
git add app/articles/[slug]/page.tsx tailwind.config.ts
git commit -m "feat: article detail page with PortableText and Article Schema"
```

---

## Task 14: SEO 파일 (sitemap, robots, llms.txt, OG)

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`

- [ ] **Step 1: app/sitemap.ts**

```ts
import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { allSlugsQuery } from '@/sanity/queries'

const BASE_URL = 'https://ivybloomconsulting.com' // 실제 도메인으로 교체

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)

  const articleEntries = slugs.map((s) => ({
    url: `${BASE_URL}/articles/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE_URL,                changeFrequency: 'weekly',  priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/articles`,  changeFrequency: 'weekly',  priority: 0.8, lastModified: new Date() },
    ...articleEntries,
  ]
}
```

- [ ] **Step 2: app/robots.ts**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/studio/' },
    ],
    sitemap: 'https://ivybloomconsulting.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: public/llms.txt**

```
# IVY BLOOM CONSULTING

IVY BLOOM CONSULTING is a US college and boarding school admissions consulting firm specializing in Korean-American students, offering personalized strategy, Common App and supplemental essay coaching, and end-to-end application support.

## Services
- US College Admissions Consulting: end-to-end strategy and essay coaching for Korean-American students applying to top US universities
- Boarding School Consulting: school selection, essays, and interview preparation for US boarding schools
- Essay Coaching: Common App personal statement and supplemental essay guidance

## Contact
- KakaoTalk: https://pf.kakao.com/_ybbloom
- Blog: https://blog.naver.com/ivybloom_consulting

## Languages
Korean, English
```

- [ ] **Step 4: 확인**

```bash
npm run build && npm run start
```

- `http://localhost:3000/sitemap.xml` — 홈, /articles, 각 포스트 URL 확인
- `http://localhost:3000/robots.txt` — /studio/ 차단 확인
- `http://localhost:3000/llms.txt` — 내용 확인

- [ ] **Step 5: 커밋**

```bash
git add app/sitemap.ts app/robots.ts public/llms.txt
git commit -m "feat: sitemap.xml, robots.txt, llms.txt for SEO/AEO"
```

---

## Task 15: Vercel 배포 + GA4

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Vercel 배포**

```bash
npx vercel --prod
```

프롬프트:
- Set up and deploy: Y
- Which scope: 본인 계정 선택
- Link to existing project: N (신규)
- Project name: `ivybloom-consulting`
- Root directory: `.`
- Build command: `next build` (기본값)

- [ ] **Step 2: Vercel 환경변수 설정**

Vercel 대시보드 → Settings → Environment Variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID = [값]
NEXT_PUBLIC_SANITY_DATASET    = production
```

설정 후 Redeploy.

- [ ] **Step 3: Sanity CORS 허용**

Sanity 관리 콘솔 → API → CORS origins:
- `https://[your-vercel-domain].vercel.app` 추가
- 실제 커스텀 도메인 추가 (있는 경우)

- [ ] **Step 4: GA4 연동 (GA4 측정 ID 확보 후 진행)**

`app/layout.tsx` `<body>` 바로 뒤에 추가:

```tsx
{/* GA4 — NEXT_PUBLIC_GA_ID 환경변수 설정 후 활성화 */}
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `,
      }}
    />
  </>
)}
```

Vercel 환경변수에 `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX` 추가 후 Redeploy.

- [ ] **Step 5: Google Search Console 등록**

1. `https://search.google.com/search-console` 접속
2. 도메인 속성 추가 → 배포 URL 입력
3. HTML 태그 인증 → `app/layout.tsx` metadata에 추가:

```tsx
export const metadata: Metadata = {
  // ... 기존 내용 유지
  verification: {
    google: 'XXXXXX', // Search Console에서 받은 코드
  },
}
```

- [ ] **Step 6: 최종 배포 및 확인**

```bash
npx vercel --prod
```

- 배포 URL에서 전체 페이지 확인
- Google Rich Results Test (`search.google.com/test/rich-results`) 에 배포 URL 입력 → FAQ, Org Schema 유효성 확인

- [ ] **Step 7: 최종 커밋**

```bash
git add app/layout.tsx
git commit -m "feat: GA4 integration and Search Console verification"
```

---

## 미결 항목 체크리스트

구현 완료 후 채워야 할 것들:

- [ ] `KAKAO_URL` — 실제 카카오 채널 URL (`components/Nav.tsx`, `components/Hero.tsx`, `components/CTASection.tsx`, `components/Footer.tsx`)
- [ ] `BASE_URL` — 실제 도메인 (`app/sitemap.ts`, `lib/structured-data.ts`)
- [ ] Stats 수치 확정 (`components/Stats.tsx`)
- [ ] Testimonials 실제 후기 텍스트 (`components/Testimonials.tsx`)
- [ ] 컨설턴트 사진 교체 (`components/Hero.tsx`, `components/WhyUs.tsx`)
- [ ] GA4 측정 ID (`NEXT_PUBLIC_GA_ID`)
- [ ] Google Search Console 인증 코드
- [ ] llms.txt 한 줄 설명 최종 확인 (`public/llms.txt`)
- [ ] 네이버 블로그 포스트 Sanity로 이전
