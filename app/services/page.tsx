import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import type { FaqItem } from '@/lib/structured-data'

const serviceFaqs: FaqItem[] = [
  { question: 'Is there consulting available for younger students?', answer: '' },
  { question: 'How long does the consulting process take?', answer: '' },
  { question: 'How many schools does Essay Consulting cover?', answer: '' },
  { question: 'How many sessions does consulting involve? Is there a limit?', answer: '' },
  { question: 'When do US boarding school applications open — and how early should we start preparing?', answer: '' },
  { question: 'Can my child apply to boarding school without an SSAT score?', answer: '' },
  { question: 'How do boarding school interviews work, and how should we prepare?', answer: '' },
]
import AnimateOnScroll from '@/components/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Services | IVY BLOOM CONSULTING',
  description:
    'Expert US college admissions consulting, essay coaching, and boarding school guidance for Korean-American students. Personalized strategy from Grade 7 through 12.',
  keywords: 'US college admissions consulting, Korean American college counseling, Common App help, boarding school consulting, college essay writing',
}

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

const services = [
  {
    id: 'college-application',
    badge: 'Comprehensive Package',
    number: '01',
    title: 'College Application Consulting',
    target: 'Grade 11 High School Students',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80',
    imageAlt: 'Graduation ceremony — IVY BLOOM college admissions consulting results',
    headline: 'From School List to Acceptance Letter — We Guide Every Step',
    description: `Getting into a top US university takes more than a strong GPA. At IVY BLOOM, our College Application Consulting service walks Grade 11 students through the entire admissions journey — from building a strategic school list to crafting essays that genuinely reflect who you are.\n\nOur consultants understand both the Korean-American student experience and what US admissions officers are looking for. That means we don't just edit documents — we help you build a compelling, authentic narrative that sets you apart in one of the most competitive applicant pools in the world.`,
    items: [
      'Personalized college list based on academic profile, goals, and school fit',
      'Common Application review and strategic positioning',
      'Personal Statement development — brainstorming through final draft',
      'Supplement Essay writing and feedback for every target school',
      'Application timeline management and deadline tracking',
    ],
  },
  {
    id: 'essay-consulting',
    badge: 'Essay Only',
    number: '02',
    title: 'Essay Consulting',
    target: 'Grade 11 Students with a School List Ready',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80',
    imageAlt: 'Student writing college essays — expert essay coaching for US university applications',
    headline: 'Your School List Is Set. Now Let\'s Write Essays That Get You In.',
    description: `Already know where you want to apply? Our Essay Consulting service focuses exclusively on what often makes or breaks an application: your essays.\n\nUnlike generic editing services that use templates, every essay we work on is crafted from scratch to reflect your authentic voice — while meeting the specific expectations of each school's admissions team. Whether you need one essay or twenty, we work flexibly around your list and timeline.`,
    items: [
      'Essay strategy sessions to identify your strongest narrative angles',
      'Supplement Essay writing and revision for each target school',
      'Flexible scope — choose only the schools and essays you need',
      'Multiple revision rounds until every essay is ready to submit',
    ],
  },
  {
    id: 'boarding-school',
    badge: 'Boarding School',
    number: '03',
    title: 'Boarding School Consulting',
    target: 'Grades 7–8 Middle School · Grade 9 High School',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
    imageAlt: 'US boarding school campus — admissions consulting for Korean students applying to prep schools',
    headline: 'The Right Boarding School Changes Everything. We Help You Find It.',
    description: `Applying to a US boarding school is one of the most significant decisions a family can make — and the process is more competitive than ever. Our Boarding School Consulting service supports students in Grades 7–9 through every stage of the application, helping them stand out at schools like Exeter, Andover, Choate, and beyond.\n\nBecause at the boarding school level, the family's voice matters too. We guide both students and parents through essays, applications, and strategy — making sure your entire application tells a cohesive, compelling story.`,
    items: [
      'Boarding school list building based on student profile and family goals',
      'Application review and strategic positioning for each school',
      'Student essay writing and multi-round feedback',
      'Parent Essay writing and review',
      'Interview preparation guidance',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* 히어로 — 이미지 위에 텍스트 오버레이 */}
        <div className="relative w-full h-[560px] sm:h-[680px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80"
            alt="IVY BLOOM Consulting — US college and boarding school admissions experts"
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* 상단 그라데이션 — 하늘 영역 텍스트 가독성 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-transparent" />
          {/* 텍스트 — 하늘 영역 */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center text-center px-4 pt-12 sm:pt-14">
            <p className="animate-fade-up text-brand-rose text-xs tracking-[4px] uppercase mb-4">What We Offer</p>
            <h1 className="animate-fade-up-d1 font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brand-cream mb-5 leading-tight">
              Our Services
            </h1>
            <p className="animate-fade-up-d2 text-brand-cream/80 text-sm sm:text-base max-w-lg leading-relaxed">
              Personalized consulting for every stage of the US admissions journey — from middle school boarding schools to top university applications.
            </p>
          </div>
        </div>

        {/* How We Work */}
        <section className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-4">Our Process</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">
                How We Work
              </h2>
            </div>

            {/* 데스크톱: 가로 스텝 / 모바일: 2×2 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 relative">
              {/* 연결선 — 데스크톱만 */}
              <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] border-t border-dashed border-brand-border z-0" />

              {[
                {
                  num: '01',
                  title: 'Consultation',
                  desc: 'A 30-minute call to understand your goals, timeline, and academic profile.',
                },
                {
                  num: '02',
                  title: 'Strategy & School List',
                  desc: 'Personalized school list and application roadmap — no templates, no guesswork.',
                },
                {
                  num: '03',
                  title: 'Application & Essays',
                  desc: 'Every document guided: Common App, supplements, and boarding school essays.',
                },
                {
                  num: '04',
                  title: 'Submission & Results',
                  desc: 'Final review, deadline tracking, and decision support until you have your answer.',
                },
              ].map((step, i) => (
                <AnimateOnScroll key={step.num} delay={i * 180}>
                  <div className="relative z-10 flex flex-col items-center text-center px-4">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-brand-border flex items-center justify-center mb-5">
                      <span className="font-display font-bold text-sm text-brand-burgundy">{step.num}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-brand-dark mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-brand-dark/55 leading-relaxed">{step.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/contact"
                className="inline-block bg-brand-burgundy text-brand-cream text-sm px-7 py-3 rounded-sm hover:bg-brand-dark transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* Stats 바 */}
        <div className="bg-brand-dark py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 divide-x divide-brand-cream/20 text-center">
              {[
                { number: '7', unit: 'Years', label: 'of US Admissions Expertise' },
                { number: '100+', unit: 'Students', label: 'Guided to Top Schools' },
                { number: 'Top-20', unit: 'Results', label: 'Ivy League & Beyond' },
              ].map((stat) => (
                <div key={stat.unit} className="px-4 sm:px-10 py-2">
                  <p className="font-display text-3xl sm:text-4xl font-bold text-brand-cream leading-none mb-1">
                    {stat.number}
                  </p>
                  <p className="text-brand-rose text-xs uppercase tracking-widest mb-2">{stat.unit}</p>
                  <p className="text-brand-cream/50 text-xs leading-snug hidden sm:block">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 서비스 섹션 */}
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={i % 2 === 0 ? 'bg-white' : 'bg-brand-cream'}
          >
            {/* 콘텐츠 */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
              <div className="grid md:grid-cols-2 gap-14 items-start">
                {/* 왼쪽: 설명 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded-full">
                      {s.badge}
                    </span>
                    <span className="text-xs text-brand-rose uppercase tracking-wider">
                      {s.target}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark mb-3 leading-snug">
                    {s.title}
                  </h2>
                  <p className="text-brand-burgundy font-medium text-sm mb-5 leading-snug">
                    {s.headline}
                  </p>
                  {s.description.split('\n\n').map((para, j) => (
                    <p key={j} className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>

                {/* 오른쪽: 포함 항목 */}
                <div className="border border-brand-border rounded-sm p-8 bg-white">
                  <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-5">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-4">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-brand-dark">
                        <span className="text-brand-burgundy font-bold mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-brand-border">
                    <p className="text-xs text-brand-dark/40 mb-3">
                      Pricing is provided after an initial consultation.
                    </p>
                    <a
                      href={KAKAO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-brand-burgundy text-brand-cream text-xs px-5 py-2.5 rounded-sm hover:bg-brand-dark transition-colors"
                    >
                      Free Consulting
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 이미지 */}
            <div className="relative w-full h-72 sm:h-96 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/40" />
              <div className="absolute bottom-6 left-8">
                <span className="font-display text-7xl font-bold text-brand-cream/20 leading-none select-none">
                  {s.number}
                </span>
              </div>
            </div>
          </section>
        ))}

        <FAQ items={serviceFaqs} />

        {/* 서비스 비교 점프 링크 */}
        <div className="bg-brand-burgundy py-10 text-center">
          <p className="text-brand-cream/60 text-xs uppercase tracking-widest mb-4">Jump to a service</p>
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className="text-brand-cream/70 hover:text-brand-cream text-sm border border-brand-cream/20 hover:border-brand-cream/60 px-5 py-2 rounded-sm transition-colors"
              >
                {s.number} {s.title}
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
