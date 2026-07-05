import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import LogoBanner from '@/components/LogoBanner'
import ProblemSection from '@/components/ProblemSection'
import ServicesSection from '@/components/ServicesSection'
import WhyUs from '@/components/WhyUs'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import ArticlesPreview from '@/components/ArticlesPreview'
import Footer from '@/components/Footer'
import { organizationSchema } from '@/lib/structured-data'

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
        <LogoBanner />
        <WhyUs />
        <ProblemSection />
        <ServicesSection />
        <ArticlesPreview />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
