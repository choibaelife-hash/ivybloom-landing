import Image from 'next/image'

const differentiators = [
  {
    title: 'Personalized Strategy, Not Templates',
    desc: "We start by analyzing each student's strengths, weaknesses, and personality. Your school list and application narrative are built around who you actually are — not a formula.",
  },
  {
    title: 'Written for Admissions Officers',
    desc: 'Every application we produce is crafted so reviewers can immediately see the student at their best. We know what reads well in an admissions office — and what gets skipped.',
  },
  {
    title: 'Founder-Led From Start to Finish',
    desc: 'Our founder personally leads school selection and oversees every application. Essay writing is handled by our specialist writing team. One decision-maker. Consistent strategy.',
  },
  {
    title: 'Built on Trust First',
    desc: "Trust between consultant, student, and family is the foundation. If we can't build that, the process won't work — so every engagement starts with an honest assessment of where you stand.",
  },
]

export default function WhyUs() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Why IVY BLOOM
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Guidance You Can Trust
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 컨설턴트 사진 플레이스홀더 */}
          <div className="relative aspect-[4/5] bg-brand-border rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
              alt="IVY BLOOM consulting — 15 years of US admissions experience"
              fill
              className="object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-brand-dark/80 px-6 py-4">
              <p className="text-brand-cream font-display font-bold text-sm">15 Years of Experience</p>
              <p className="text-brand-cream/60 text-xs mt-0.5">
                Founded 2019 · US College & Boarding School Consulting
              </p>
            </div>
          </div>
          {/* 차별점 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {differentiators.map((d) => (
              <div key={d.title} className="bg-white border border-brand-border rounded-sm p-5">
                <span className="block w-6 h-0.5 bg-brand-burgundy mb-4" />
                <h3 className="font-display font-bold text-sm text-brand-dark mb-2 leading-snug">{d.title}</h3>
                <p className="text-xs text-brand-dark/65 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
