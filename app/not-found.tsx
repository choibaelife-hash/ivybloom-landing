import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="bg-brand-dark py-28 sm:py-36 px-4 sm:px-6 text-center">
          <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">Error</p>
          <p className="font-display font-bold text-brand-cream/90 text-7xl sm:text-8xl md:text-9xl leading-none mb-4">
            404
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-cream mb-4">
            The page you&apos;re looking for doesn&apos;t exist.
          </h1>
          <p className="text-brand-cream/65 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            The link may have changed or the page may have been removed.
            Head back home, or explore our services.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="inline-block bg-brand-burgundy text-brand-cream text-sm font-semibold px-7 py-3 rounded-sm hover:bg-brand-dark hover:text-brand-cream border border-brand-burgundy transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="inline-block border border-brand-cream/30 text-brand-cream/85 text-sm px-7 py-3 rounded-sm hover:border-brand-cream/60 transition-colors"
            >
              View Services
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
