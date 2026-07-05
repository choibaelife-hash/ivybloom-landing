import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'

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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            Why IVY BLOOM
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            Guidance You Can Trust
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* 컨설턴트 사진 — 좌측에서 등장 */}
          <ScrollReveal direction="left" className="h-full">
            <div className="relative h-full min-h-[420px] bg-white border border-brand-border rounded-sm overflow-hidden">
              <Image
                src="/ivybloom logo.jpg"
                alt="IVY BLOOM consulting — 15 years of US admissions experience"
                fill
                className="object-contain p-10"
              />
            </div>
          </ScrollReveal>

          {/* 차별점 카드 — 우측에서 stagger */}
          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {differentiators.map((d) => (
                <div key={d.title} className="stagger-item bg-white border border-brand-border rounded-sm p-5">
                  <span className="block w-6 h-0.5 bg-brand-burgundy mb-4" />
                  <h3 className="font-display font-bold text-sm text-brand-dark mb-2 leading-snug">{d.title}</h3>
                  <p className="text-xs text-brand-dark/65 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
