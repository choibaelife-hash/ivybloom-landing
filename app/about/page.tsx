import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { organizationSchema, aboutPageSchema } from '@/lib/structured-data'

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
    desc: 'Sarah Kim personally leads school selection and oversees every application. Essay writing is handled by our specialist writing team. One decision-maker. Consistent strategy.',
  },
  {
    title: 'Built on Trust First',
    desc: "Trust between consultant, student, and family is the foundation. If we can't build that, the process won't work — so every engagement starts with an honest assessment of where you stand.",
  },
]

const cases = [
  {
    "id": "01",
    "label": "A Journey of Resilience",
    "summary": "A neurological condition affected his academic performance throughout middle school. Beginning in Grade 10, we worked with him to rebuild his academic foundation and develop an application that reflected his strengths, growth, and resilience.",
    "outcome": "Accepted to all 10 universities he applied to.",
    "slug": ""
  },
  {
    "id": "02",
    "label": "The Builder",
    "summary": "A high school student who had developed a popular game with a significant player base. We positioned his self-taught engineering skills as the core of his application story.",
    "outcome": "Accepted to UC Berkeley and Georgia Tech.",
    "slug": ""
  },
  {
    "id": "03",
    "label": "Beyond the Transcript",
    "summary": "The student’s educational journey included two school transfers, a withdrawal, and an expulsion. We focused on the story his transcript alone could not tell.",
    "outcome": "Admitted to a school that exceeded initial expectations.",
    "slug": ""
  },
  {
    "id": "04",
    "label": "From the Waitlist to an Acceptance",
    "summary": "After working with a large consulting firm without achieving the desired results, the family came to Ivy Bloom facing disappointment and uncertainty. The student had been placed on the waitlist at their top-choice boarding school. We completely re-strategized and refined the application portfolio from the ground up, turning the waitlist status into a final admission.",
    "outcome": "Admitted to their top-choice boarding school off the waitlist.",
    "slug": ""
  }
]

const services = [
  {
    "number": "01",
    "title": "Personalized Admissions Roadmap",
    "target": "Grades 7–11",
    "desc": "Student Assessment · Admissions Strategy · School Exploration · Action Plan",
    "href": "/services#admissions-roadmap"
  },
  {
    "number": "02",
    "title": "College Application Consulting",
    "target": "Grade 11",
    "desc": "From strategy and school selection to final submission.",
    "href": "/services#college-application"
  },
  {
    "number": "03",
    "title": "College Essay Consulting",
    "target": "Grades 11–12 · Essay-Only",
    "desc": "Personalized guidance. Your story, in your voice.",
    "href": "/services#essay-consulting"
  },
  {
    "number": "04",
    "title": "Boarding School Consulting",
    "target": "Grades 7–9",
    "desc": "From finding the right school environment to application preparation and final submission.",
    "href": "/services#boarding-school"
  }
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

        {/* ── 대표 소개 ── */}
        <section className="py-10 bg-white border-t border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="font-display text-6xl text-brand-burgundy/25 leading-none block mb-2">&ldquo;</span>
            <p className="font-display text-xl sm:text-2xl font-bold text-brand-burgundy leading-snug mb-7 max-w-xl mx-auto">
              Founded on the belief that every application should be built around who a student actually is, not a template.
            </p>
            <p className="font-display font-bold text-sm text-brand-dark">Sarah Kim</p>
            <p className="text-xs text-brand-rose uppercase tracking-widest mt-1 mb-6">Founder, IVY BLOOM CONSULTING</p>
            <p className="text-sm text-brand-dark/60 leading-relaxed">
              Founded IVY BLOOM CONSULTING in 2019, originally as EduMatch Consulting, rebranded in 2024. She built her admissions expertise at a leading Seoul consulting firm before launching her own practice.
            </p>
          </div>
        </section>

        {/* ── 케이스 스터디 ── */}
        <section className="py-20 bg-brand-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Ivy Bloom’s Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4">
              Every Application Has a Story
            </h2>
            <p className="text-center text-sm text-brand-dark/50 mb-14">
              All cases anonymized at the student's request.
            </p>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {cases.map((c) => (
                <div key={c.id} className="border-t-2 border-brand-burgundy pt-6 flex flex-col">
                  <span className="font-display text-4xl font-bold text-brand-burgundy/15 mb-3">{c.id}</span>
                  <p className="text-xs text-brand-rose uppercase tracking-widest mb-2">{c.label}</p>
                  <p className="text-sm text-brand-dark/70 leading-relaxed mb-4 flex-1">{c.summary}</p>
                  <div className="border-l-2 border-brand-burgundy pl-4 mb-5">
                    <p className="text-xs text-brand-dark/50 uppercase tracking-wider mb-1">Outcome</p>
                    <p className="text-sm font-semibold text-brand-dark">{c.outcome}</p>
                  </div>
                  {c.slug ? (
                    <Link
                      href={`/articles/${c.slug}`}
                      className="text-xs text-brand-burgundy hover:text-brand-dark transition-colors underline underline-offset-2"
                    >
                      Full Story →
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
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
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
