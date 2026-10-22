import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const GA_ID = 'G-V2K016FL3J'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ivybloomconsulting.com'),
  verification: { google: 'h-mWOfX7p8OZhw36feL2DZ28Xj88M1W_ObypYqy_Umk' },
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
      <body className="font-sans antialiased">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  )
}
