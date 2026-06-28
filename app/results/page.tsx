import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Results | IVY BLOOM CONSULTING',
  description:
    'Track record of placements at top US universities and boarding schools. See what IVY BLOOM families say about their admissions journey.',
}

export default function ResultsPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="bg-brand-burgundy py-16 text-center">
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Our Track Record</p>
          <h1 className="font-display text-4xl font-bold text-brand-cream">Results & Reviews</h1>
        </div>
        <Stats />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
