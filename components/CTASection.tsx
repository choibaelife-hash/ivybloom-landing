import ScrollReveal from '@/components/ScrollReveal'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

export default function CTASection() {
  return (
    <section className="bg-brand-burgundy py-20 text-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-4">
            Get Started
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-cream mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-brand-cream/70 mb-10 max-w-md mx-auto">
            Start with a consultation and take the first step toward your target school.
          </p>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-10 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wide"
          >
            Free Consulting
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
