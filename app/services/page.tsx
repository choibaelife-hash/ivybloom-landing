import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

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

        {/* 소개 섹션 — stat + 미션 + 차별점 */}
        <div className="border-b border-brand-border">
          {/* Stats 바 — 버건디 배경으로 히어로와 구분 */}
          <div className="bg-brand-burgundy">
            <div className="max-w-3xl mx-auto px-4 py-8 grid grid-cols-3 divide-x divide-brand-cream/20 text-center">
              <div className="px-4">
                <p className="font-display text-3xl sm:text-4xl font-bold text-brand-cream">7</p>
                <p className="text-xs text-brand-cream/60 uppercase tracking-wider mt-1">Years in Business</p>
              </div>
              <div className="px-4">
                <p className="font-display text-3xl sm:text-4xl font-bold text-brand-cream">15</p>
                <p className="text-xs text-brand-cream/60 uppercase tracking-wider mt-1">Years of Experience</p>
              </div>
              <div className="px-4">
                <p className="font-display text-3xl sm:text-4xl font-bold text-brand-cream">2019</p>
                <p className="text-xs text-brand-cream/60 uppercase tracking-wider mt-1">Est.</p>
              </div>
            </div>
          </div>

          {/* 미션 + 차별점 */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-14 items-start">
            {/* 왼쪽: 미션 */}
            <div>
              <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-4">Our Mission</p>
              <blockquote className="font-display text-2xl sm:text-3xl font-bold text-brand-dark leading-snug mb-6">
                &ldquo;The right admissions strategy makes all the difference.&rdquo;
              </blockquote>
              <p className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                Most students apply with the same GPA, the same activities, and the same essay structure. We believe what separates accepted students from rejected ones isn&apos;t credentials — it&apos;s strategy.
              </p>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                For 15 years, our founder has worked with students and families to find the school that truly fits — and to build applications that show admissions officers exactly why each student belongs there.
              </p>
            </div>

            {/* 오른쪽: 차별점 + 팀 구조 */}
            <div className="space-y-6">
              <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-4">What Sets Us Apart</p>
              {[
                {
                  title: 'Personalized, Not Templated',
                  body: "We start by analyzing each student's strengths, weaknesses, and personality — then build a school list and application strategy around who they actually are.",
                },
                {
                  title: 'Written for Admissions Officers',
                  body: 'Every document we produce is crafted so reviewers can immediately see the applicant at their best. We know what reads well in an admissions office.',
                },
                {
                  title: 'Founder-Led, Expert-Supported',
                  body: 'Our founder personally leads school selection and oversees every application. Essay writing is handled by our specialist writing team.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-brand-burgundy font-bold text-lg mt-0.5 flex-shrink-0">—</span>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark mb-1">{item.title}</p>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">{item.body}</p>
                  </div>
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
            {/* 이미지 */}
            <div className="relative w-full h-72 sm:h-96 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.imageAlt}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-brand-dark/40" />
              {/* 이미지 위 번호 */}
              <div className="absolute bottom-6 left-8">
                <span className="font-display text-7xl font-bold text-brand-cream/20 leading-none select-none">
                  {s.number}
                </span>
              </div>
            </div>

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
                      Pricing is provided after a free initial consultation.
                    </p>
                    <a
                      href={KAKAO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-brand-burgundy text-brand-cream text-xs px-5 py-2.5 rounded-sm hover:bg-brand-dark transition-colors"
                    >
                      Book a Free Consultation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* 서비스 비교 점프 링크 */}
        <div className="bg-brand-dark py-10 text-center">
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

        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
