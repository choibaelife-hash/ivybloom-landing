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
