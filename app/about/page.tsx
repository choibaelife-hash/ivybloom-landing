import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { organizationSchema, aboutPageSchema } from '@/lib/structured-data'
import AnimateOnScroll from '@/components/AnimateOnScroll'

const OG_DESCRIPTION =
  'IVY BLOOM is a Seoul-based US college and boarding school admissions consultancy founded in 2019. Learn about our approach, philosophy, and student success stories.'

export const metadata: Metadata = {
  title: 'About | IVY BLOOM CONSULTING',
  description: OG_DESCRIPTION,
  keywords:
    'IVY BLOOM consulting, US college admissions consultant, Korean American college counseling, boarding school consulting Seoul, admissions strategy, college essay help, Ivy League consulting',
  openGraph: {
    title: 'About | IVY BLOOM CONSULTING',
    description: OG_DESCRIPTION,
    url: 'https://ivybloomconsulting.com/about',
    type: 'website',
    images: [{ url: '/og-logo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | IVY BLOOM CONSULTING',
    description: OG_DESCRIPTION,
    images: ['/og-logo.jpg'],
  },
}

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

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
    desc: 'Sohee Kim personally leads school selection and oversees every application. Essay writing is handled by our specialist writing team. One decision-maker. Consistent strategy.',
  },
  {
    title: 'Built on Trust First',
    desc: "Trust between consultant, student, and family is the foundation. If we can't build that, the process won't work — so every engagement starts with an honest assessment of where you stand.",
  },
]

const cases = [
  {
    id: '01',
    label: 'Against All Odds',
    summary:
      'A student who experienced a neurological condition affecting school performance through middle school. Starting from Grade 10, we rebuilt her academic narrative from the ground up.',
    outcome: 'Accepted at all 10 universities applied to.',
    slug: null,
  },
  {
    id: '02',
    label: 'The Builder',
    summary:
      'A high school student who had developed a popular Roblox game with a significant player base. We positioned his self-taught engineering skills as the core of his application story.',
    outcome: 'Accepted to UC Berkeley and Georgia Tech.',
    slug: null,
  },
  {
    id: '03',
    label: 'A Rocky Record',
    summary:
      'A student who had transferred schools four times — including one withdrawal and one expulsion — with a compromised academic record. We focused on what the transcript couldn\'t tell.',
    outcome: 'Admitted to a school well above initial expectations.',
    slug: null,
  },
]

const services = [
  {
    number: '01',
    title: 'College Application Consulting',
    target: 'Grade 11',
    desc: 'Full-cycle admissions strategy — school list to final submission.',
    href: '/services#college-application',
  },
  {
    number: '02',
    title: 'Essay Consulting',
    target: 'Grade 11 · Essay-Only',
    desc: 'Essays built around your voice, not a template.',
    href: '/services#essay-consulting',
  },
  {
    number: '03',
    title: 'Boarding School Consulting',
    target: 'Grades 7–9',
    desc: 'Full support for Exeter, Andover, Choate and more.',
    href: '/services#boarding-school',
  },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema()) }}
      />
      <Nav />
      <main className="pt-16">

        {/* ── 히어로 ── */}
        <section className="bg-brand-dark py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">About IVY BLOOM</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-cream leading-tight mb-6">
              The Well-Prepared<br />Will Be Needed by the World.
            </h1>
            <p className="text-brand-cream/65 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              IVY BLOOM is a Seoul-based admissions consultancy founded in 2019.
              Every student we work with gets a strategy built entirely around who they are —
              not a score, not a template, not a ranking.
            </p>
          </div>
        </section>

        {/* ── 차별점 ── */}
        <section className="py-20 bg-brand-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Why IVY BLOOM</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-stretch">
              {/* 사진 */}
              <div className="relative min-h-[420px] md:min-h-0 md:h-full bg-white border border-brand-border rounded-sm overflow-hidden">
                <Image
                  src="/og-logo.jpg"
                  alt="IVY BLOOM CONSULTING logo"
                  fill
                  className="object-contain p-10"
                />
              </div>
              {/* 차별점 그리드 */}
              <div className="grid sm:grid-cols-2 gap-5 content-start">
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

        {/* ── Our Mission ── */}
        <section className="bg-brand-cream pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-brand-border pt-16 mb-14 text-center">
              <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-5">Our Mission</p>
              <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark leading-snug mb-6 max-w-3xl mx-auto">
                &ldquo;The right admissions strategy makes all the difference.&rdquo;
              </blockquote>
              <p className="text-sm text-brand-dark/60 leading-relaxed max-w-2xl mx-auto">
                Most students apply with the same GPA, the same activities, and the same essay structure.
                What separates accepted students from rejected ones isn&apos;t credentials — it&apos;s strategy.
              </p>
            </div>

            <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-8 text-center">What Sets Us Apart</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Personalized, Not Templated',
                  body: "We analyze each student's strengths, weaknesses, and personality before building any school list or strategy. Nothing is templated.",
                },
                {
                  title: 'Written for Admissions Officers',
                  body: 'Every document we produce is crafted so reviewers can immediately see the applicant at their best. We know what reads well in an admissions office.',
                },
                {
                  title: 'Founder-Led, Expert-Supported',
                  body: 'Sohee Kim personally leads school selection and oversees every application. Essays are handled by our specialist writing team.',
                },
              ].map((item, i) => (
                <AnimateOnScroll key={item.title} delay={i * 150}>
                  <div className="bg-white rounded-sm shadow-md p-6 h-full">
                    <p className="font-display font-bold text-sm text-brand-dark mb-3 leading-snug">{item.title}</p>
                    <p className="text-xs text-brand-dark/60 leading-relaxed">{item.body}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── 케이스 스터디 ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Student Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4">
              Every Application Has a Story
            </h2>
            <p className="text-center text-sm text-brand-dark/50 mb-14">
              All cases anonymized at the student's request.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {cases.map((c) => (
                <div key={c.id} className="border-t-2 border-brand-burgundy pt-6 flex flex-col">
                  <span className="font-display text-4xl font-bold text-brand-burgundy/15 mb-3">{c.id}</span>
                  <p className="text-xs text-brand-rose uppercase tracking-widest mb-2">{c.label}</p>
                  <p className="text-sm text-brand-dark/70 leading-relaxed mb-4 flex-1">{c.summary}</p>
                  <div className="border-l-2 border-brand-burgundy pl-4 mb-5">
                    <p className="text-xs text-brand-dark/50 uppercase tracking-wider mb-1">Outcome</p>
                    <p className="text-sm font-semibold text-brand-dark">{c.outcome}</p>
                  </div>
                  {/* 추후 article 슬러그 연결 시 활성화 */}
                  {c.slug ? (
                    <Link
                      href={`/articles/${c.slug}`}
                      className="text-xs text-brand-burgundy hover:text-brand-dark transition-colors underline underline-offset-2"
                    >
                      Read full story →
                    </Link>
                  ) : (
                    <span className="text-xs text-brand-dark/25">Full story coming soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 서비스 소개 ── */}
        <section className="py-20 bg-brand-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
              Our Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {services.map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group bg-white border border-brand-border rounded-sm p-7 hover:border-brand-burgundy transition-colors flex flex-col gap-3"
                >
                  <span className="font-display text-3xl font-bold text-brand-burgundy/15">{s.number}</span>
                  <p className="text-xs text-brand-rose uppercase tracking-wider">{s.target}</p>
                  <h3 className="font-display font-bold text-lg text-brand-dark leading-snug">{s.title}</h3>
                  <p className="text-sm text-brand-dark/60 leading-relaxed flex-1">{s.desc}</p>
                  <span className="text-xs text-brand-burgundy group-hover:text-brand-dark transition-colors mt-2">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/services"
                className="inline-block bg-brand-burgundy text-brand-cream text-sm font-semibold px-8 py-4 rounded-sm hover:bg-brand-dark transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
