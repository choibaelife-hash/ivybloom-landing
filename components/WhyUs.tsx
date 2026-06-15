import Image from 'next/image'

const differentiators = [
  { icon: '🎯', title: 'Personalized Strategy', desc: 'No cookie-cutter plans. Every student gets a custom roadmap.' },
  { icon: '🇺🇸', title: 'Korean-American Focus', desc: 'We understand your background and how to frame it as a strength.' },
  { icon: '📋', title: 'End-to-End Support', desc: "From school list to acceptance — we're with you every step." },
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
