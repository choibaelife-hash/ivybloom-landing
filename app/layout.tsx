import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IVY BLOOM CONSULTING | US College Admissions for Korean Students',
  description:
    'IVY BLOOM CONSULTING helps Korean-American students cultivate their unique abilities and gain admission to top US universities. Expert college counseling, essay coaching, and application strategy.',
  keywords: [
    'US college admissions Korean students',
    'college counseling Korean American',
    'ivy league admissions consulting',
    'college essay coaching Korean',
    'UC admissions Korean students',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    siteName: 'IVY BLOOM CONSULTING',
    title: 'IVY BLOOM CONSULTING | US College Admissions for Korean Students',
    description:
      'Expert US college admissions consulting for Korean-American students. Cultivate Your Abilities.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IVY BLOOM CONSULTING | US College Admissions',
    description:
      'Expert US college admissions consulting for Korean-American students.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={playfair.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
