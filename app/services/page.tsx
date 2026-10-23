import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import type { FaqItem } from '@/lib/structured-data'

const serviceFaqs: FaqItem[] = [
  {
    question: 'Is there consulting available for younger students?',
    answer: 'Our consulting services are available for students in Grade 7 and above.',
  },
  {
    question: 'How long does the consulting process take?',
    answer:
      'The timeline depends on the specific service you select:\n\n' +
      '• Comprehensive Admissions & Essay Consulting (U.S. College & Boarding School):\nServices begin immediately upon enrollment and continue until all final admissions decisions are released for the schools in your consulting package.\n\n' +
      '• Personalized Admissions Roadmap:\nThis is a standalone, targeted planning service. We conduct an in-depth review of the student’s academic profile, hold separate student and parent interviews, and perform customized school research. Based on these insights, we meet with your family to present our findings and deliver a comprehensive Roadmap Report—complete with actionable recommendations, strategic priorities, and a structured preparation timeline.\n\n' +
      '(Please note: This service concludes upon delivery and review of the final report and does not include ongoing application guidance.)',
  },
  {
    question: 'How many schools does College Essay Consulting cover?',
    answer:
      'Our College Essay Consulting service covers applications to 5–15 schools. Fees vary based on the total number of essays required by the schools on your list.',
  },
  {
    question: 'How many consulting sessions are included? Is there a limit?',
    answer:
      'For our comprehensive admissions and essay consulting services, there is no set cap on the number of sessions during the agreed service period. Rather than restricting students to a fixed number of hours, we schedule meetings on an as-needed basis to ensure thorough support at every key milestone.\n\n' +
      'Meeting frequency naturally varies depending on the student’s individual timeline and application deadlines. Throughout the process, we maintain close, regular communication with both students and parents to track progress, resolve questions, and guide strategic decisions—all aligned with the scope of your selected package.',
  },
  {
    question: 'When do US boarding school applications open — and how early should we start preparing?',
    answer:
      'While official application portals typically open between July and early fall prior to the entry year, an effective admissions strategy begins much earlier. We generally recommend the following timeline:\n\n' +
      '• Spring (March–April): School Research & List Building\nBegin researching prospective schools, reviewing requirements, and building a balanced, tailored school list.\n\n' +
      '• Summer: Test Prep & Portfolio Development\nUse this critical window to focus on SSAT (or other standardized tests) and develop arts portfolios or academic supplements to showcase your student’s unique strengths.\n\n' +
      '• Early Fall (September–November): Testing Wrap-up & Application Execution\nAim to achieve target test scores by October or November. Essay drafting and interview preparation should run concurrently with testing rather than waiting until scores are finalized.\n\n' +
      'We actively tailor this timeline to align with each student’s unique profile, starting point, and specific school deadlines.',
  },
  {
    question: 'Can my child apply to boarding school without an SSAT score?',
    answer:
      'Yes, it depends on the school. While the SSAT has traditionally been standard, many boarding schools now adopt test-optional policies or accept alternative standardized assessments (such as the ISEE, PSAT, or state testing). We review each target school’s current testing requirements before advising on whether standardized testing is necessary or advantageous for your child.\n\n' +
      'Where scores are submitted, admissions committees evaluate them as one component of holistic review to assess academic readiness—never as a standalone measure of potential. Our focus extends beyond merely securing an offer: we guide families toward schools that genuinely match the student’s strengths, academic profile, and learning environment, ensuring they step onto campus prepared and confident.',
  },
  {
    question: 'How do boarding school interviews work, and how should we prepare?',
    answer:
      'Boarding school interviews are conversational dialogues designed to understand who your child is beyond grades and test scores. Admissions officers look for curiosity, character, and school fit. In most cases, the session includes a one-on-one conversation with the student, followed by a brief discussion with parents. Interviews may be conducted on campus during a school tour or virtually via Zoom.\n\n' +
      'How to prepare effectively:\n' +
      '• Reflect over memorizing: Rather than rehearsing scripted answers, students should practice articulating their passions, meaningful experiences, and reasons for applying in a genuine, natural voice.\n' +
      '• Conduct in-depth school research: Admissions teams want to see authentic interest. Students should prepare thoughtful, specific questions that reflect real curiosity about campus culture and programs.\n' +
      '• Simulate through mock interviews: Guided practice helps alleviate anxiety, sharpen communication skills, and build conversational poise.\n' +
      '• Prepare the environment (for virtual interviews): Test technology beforehand and ensure a quiet, well-lit, and professional space.\n\n' +
      'We recommend reviewing each school’s interview policies and scheduling early in the fall, as interview slots at top schools fill up quickly.',
  },
]
import AnimateOnScroll from '@/components/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Services | IVY BLOOM CONSULTING',
  description:
    'Expert US college admissions consulting, essay coaching, and boarding school guidance for Korean-American students. Personalized strategy from Grade 7 through 12.',
  keywords: 'US college admissions consulting, Korean American college counseling, Common App help, boarding school consulting, college essay writing',
}

const INQUIRY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfVtm8dz7fkAIu_1aRSAdoWOlQoBES_5RwAHAmrHxCIzY7Kkg/viewform'

type Service = {
  id: string
  badge: string
  number: string
  title: string
  target: string
  image: string
  imageAlt: string
  headline: string
  intro?: string
  description: string
  audiences?: { title: string; description: string; items: string[] }[]
  items: { title: string; description: string }[]
  scope?: string
}

const services: Service[] = [
  {
    "id": "admissions-roadmap",
    "badge": "Standalone Package",
    "number": "01",
    "title": "Personalized Admissions Roadmap",
    "target": "Grades 7–11 · Middle & High School",
    "headline": "A Clearer Path to Your Next Step",
    "intro": "Academics. Testing. Activities. School Exploration. A plan built around your student.",
    "description": "There is no shortage of admissions advice. The challenge is knowing what matters most for your student—and what to do first.\n\nShould they focus on grades or prepare for standardized tests? Deepen an existing activity or explore a new interest? Start researching schools or first understand the environments in which they thrive?\n\nAt IVY Bloom Consulting, we help students and families turn these questions into a thoughtful, actionable plan.\n\nOur Personalized Admissions Roadmap begins with a close look at where your student is today: their academic preparation, interests, experiences, strengths, and goals. From there, we identify priorities and map out practical next steps—so each decision serves a purpose.\n\nMore information is not always the answer. A clearer direction is.",
    "audiences": [
      {
        "title": "U.S. College Planning",
        "description": "For students in Grades 8–11 and their families who want to:",
        "items": [
          "Connect academic choices, testing, and activities within one coherent plan.",
          "Prioritize preparation based on the time remaining before applications.",
          "Make thoughtful decisions about AP or IB courses, standardized testing, and extracurricular commitments.",
          "Understand how existing experiences reveal interests and strengths that can later inform an application."
        ]
      },
      {
        "title": "Boarding School Planning",
        "description": "For students and families who want to:",
        "items": [
          "Establish a realistic preparation timeline based on the intended entry grade and enrollment date.",
          "Explore schools beyond name recognition.",
          "Compare academic programs, school culture, and residential environments with the student’s needs in mind.",
          "Identify what to focus on now and what to prepare for next."
        ]
      }
    ],
    "image": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80",
    "imageAlt": "Notebook and pen for planning a personalized admissions roadmap",
    "items": [
      {
        "title": "A current preparation overview",
        "description": "An evidence-based summary of the student’s strengths, preparation, and areas for development."
      },
      {
        "title": "An academic, testing, and activity timeline",
        "description": "Priorities organized by semester and school break, based on the student’s stage and goals."
      },
      {
        "title": "Clear activity priorities",
        "description": "Guidance on which commitments to maintain, which to deepen, and which to defer."
      },
      {
        "title": "School exploration and comparison criteria",
        "description": "A framework informed by the student’s preferences, learning style, and educational needs."
      },
      {
        "title": "An initial set of schools to explore",
        "description": "Potential options based on current preparation and preferences, with explanations for why each merits consideration."
      },
      {
        "title": "Planning checkpoints",
        "description": "Suggested times and criteria for revisiting the plan as the student’s interests, preparation, and goals evolve."
      }
    ]
  },
  {
    "id": "college-application",
    "badge": "Comprehensive Package",
    "number": "02",
    "target": "Grades 11–12 · High School",
    "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80",
    "imageAlt": "Graduation ceremony illustrating the college admissions journey",
    "title": "College Application Consulting",
    "headline": "From School Selection to Final Decisions—Guidance at Every Step",
    "description": "A strong application is more than a collection of grades, scores, and activities. At IVY Bloom Consulting, we guide students through the college application process—from building a thoughtful school list to developing essays that reflect their experiences, perspectives, and aspirations.\n\nOur consultants understand how U.S. admissions officers evaluate applicants. We help students connect their academic preparation, interests, and experiences to present a clear, authentic picture of who they are—and what they could contribute to a college community.\n\nFrom application strategy and essay development to final review and post-submission follow-up, we provide personalized guidance at every stage.",
    "items": [
      {
        "title": "Personalized College List",
        "description": "A thoughtfully curated list aligned with your academic profile, interests, goals, and preferred college environment."
      },
      {
        "title": "College Application Strategy & Review",
        "description": "Strategic guidance and detailed review to present your strengths, experiences, and achievements clearly and cohesively."
      },
      {
        "title": "Personal Statement Development",
        "description": "Individualized support from brainstorming and outlining through revision and final polish—keeping your voice at the center."
      },
      {
        "title": "Supplemental Essay Guidance",
        "description": "School-specific guidance and feedback to help you craft thoughtful, authentic responses for each college on your list."
      },
      {
        "title": "Application Timeline & Deadline Management",
        "description": "A personalized application schedule and ongoing deadline tracking to keep each stage of the process organized and on track."
      }
    ]
  },
  {
    "id": "essay-consulting",
    "badge": "Essay-Only",
    "number": "03",
    "target": "Grades 11–12 · For Students with a Finalized College List",
    "image": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80",
    "imageAlt": "Notebook and pen for developing college application essays",
    "title": "College Essay Consulting",
    "headline": "Your Schools. Your Story. Your Voice.",
    "description": "You know where you want to apply. Now, bring your experiences, ideas, and aspirations into focus through essays that are distinctly yours.\n\nOur College Essay Consulting service provides personalized guidance for students who have finalized their college list and want dedicated support with their application essays. From the personal statement to school-specific supplemental essays, we help you develop meaningful ideas, organize your thoughts, and refine your writing—while keeping your voice at the center.\n\nEvery essay begins with your experiences, not a template. Together, we explore what matters to you, identify the stories worth telling, and develop responses that thoughtfully address each school’s prompts.\n\nWith a defined scope based on your college list and a structured writing plan, you will know what to work on, when to work on it, and how each essay contributes to your overall application.",
    "items": [
      {
        "title": "Personalized Essay Strategy",
        "description": "One-on-one brainstorming and planning to identify meaningful experiences, compelling themes, and distinct perspectives."
      },
      {
        "title": "Personal Statement Development",
        "description": "Guidance from initial ideas and outlining through drafting, revision, and final polish."
      },
      {
        "title": "School-Specific Supplemental Essay Guidance",
        "description": "Individualized support to develop focused, authentic responses tailored to each college’s essay prompts."
      },
      {
        "title": "A Structured Essay Timeline",
        "description": "A writing and revision schedule aligned with the essay requirements and application deadlines of the colleges on your list."
      },
      {
        "title": "Thoughtful, Iterative Feedback",
        "description": "Multiple rounds of feedback to strengthen clarity, structure, and expression while preserving your ideas and individual voice."
      }
    ],
    "scope": "This standalone service covers the essays agreed upon for your finalized college list. School selection, broader application management, and submission support are not included."
  },
  {
    "id": "boarding-school",
    "badge": "Comprehensive Package",
    "number": "04",
    "target": "Grades 7–9 · Middle & High School Students",
    "image": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
    "imageAlt": "Empty classroom illustrating school life",
    "title": "Boarding School Consulting",
    "headline": "Beyond Reputation. A School Where Your Student Can Thrive.",
    "description": "The right boarding school is not simply the most recognizable name. It is a place where your student can feel supported, challenged, and ready to grow—both in and beyond the classroom.\n\nAt IVY Bloom Consulting, we help families explore a wide range of U.S. boarding schools, from highly selective institutions to schools offering different academic pathways, close-knit communities, and individualized support. We consider each student’s academic preparation, interests, personality, and readiness for residential life, alongside the family’s goals and preferences.\n\nFrom building a thoughtful school list to preparing applications, essays, and interviews, we provide personalized guidance throughout the admissions process. Our goal is to help your family make informed choices and present an authentic, cohesive picture of the student—not simply pursue a name.\n\nWe also recognize that parents bring an important perspective. We guide students and parents through their respective application components, helping each express their experiences and insights in their own voice.",
    "items": [
      {
        "title": "Personalized Boarding School List",
        "description": "A thoughtfully researched list informed by the student’s academic profile, interests, residential needs, and family priorities."
      },
      {
        "title": "Application Strategy & Review",
        "description": "School-specific guidance and detailed application review to present the student’s strengths, experiences, and goals clearly and cohesively."
      },
      {
        "title": "Student Essay Guidance",
        "description": "Personalized support from brainstorming through revision, with multiple rounds of feedback that preserve the student’s own voice."
      },
      {
        "title": "Parent Statement Guidance",
        "description": "Support with planning, drafting, and refining thoughtful responses that reflect the family’s perspective and understanding of their child."
      },
      {
        "title": "Interview Preparation",
        "description": "Individualized practice and feedback to help students discuss their interests, experiences, and school preferences with clarity and confidence."
      }
    ]
  }
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
              Personalized guidance at every stage of the U.S. admissions journey—from boarding school admissions to college applications.
            </p>
          </div>
        </div>

        {/* How We Work */}
        <section className="bg-white py-10 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-14">
              <p className="text-xs text-brand-rose uppercase tracking-[3px] mb-4">Our Process</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">
                How We Work
              </h2>
            </div>

            {/* 데스크톱: 가로 스텝 / 모바일: 2×2 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 md:gap-0 relative">
              {/* 연결선 — 데스크톱만 */}
              <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] border-t border-dashed border-brand-border z-0" />

              {[
                {
                  num: '01',
                  title: 'Consultation',
                  desc: "Following an initial consultation, online, we conduct a comprehensive review of the student’s academic background, standardized test scores, extracurricular involvement, and achievements.",
                },
                {
                  num: '02',
                  title: 'Admissions Strategy & School List',
                  desc: "A personalized school list and application roadmap, shaped by your student’s strengths, goals, and preferences.",
                },
                {
                  num: '03',
                  title: 'Applications & Essays',
                  desc: "Thoughtful guidance on every application and essay—from college applications and supplemental essays to boarding school essays.",
                },
                {
                  num: '04',
                  title: 'Submission & Follow-Up',
                  desc: "From final review to admissions decisions—we help track deadlines, verify required materials, and follow up on each school’s additional requests.",
                },
              ].map((step, i) => (
                <AnimateOnScroll key={step.num} delay={i * 180}>
                  <div className="relative z-10 flex flex-col items-center text-center px-1 md:px-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-brand-border flex items-center justify-center mb-3 md:mb-5">
                      <span className="font-display font-bold text-sm text-brand-burgundy">{step.num}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-brand-dark md:mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="hidden md:block text-xs text-brand-dark/55 leading-relaxed">{step.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="mt-8 md:mt-12 text-center">
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
                { number: '10', unit: 'Years', label: 'of US Admissions Expertise' },
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
            className={`scroll-mt-20 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-cream'}`}
          >
            {/* 콘텐츠 */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
              <div className="grid md:grid-cols-2 gap-14 items-start">
                {/* 왼쪽: 설명 */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded-full whitespace-nowrap">
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
                  {s.intro && <p className="font-medium text-sm text-brand-dark mb-5 leading-relaxed">{s.intro}</p>}
                  {s.description.split('\n\n').map((para, j) => (
                    <p key={j} className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                  {s.audiences && (
                    <div className="mt-8 border-t border-brand-border pt-6">
                      <h3 className="font-display text-xl font-bold text-brand-dark mb-5">Who This Service Is For</h3>
                      {s.audiences.map((audience) => (
                        <div key={audience.title} className="mb-6">
                          <h4 className="font-semibold text-brand-burgundy mb-2">{audience.title}</h4>
                          <p className="text-sm text-brand-dark/70 mb-3">{audience.description}</p>
                          <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 leading-relaxed">
                            {audience.items.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 오른쪽: 포함 항목 */}
                <div className="border border-brand-border rounded-sm p-8 bg-white">
                  <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-5">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-4">
                    {s.items.map((item) => (
                      <li key={item.title} className="flex items-start gap-3 text-sm text-brand-dark">
                        <span className="text-brand-burgundy font-bold mt-0.5 flex-shrink-0">✓</span>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-brand-dark/70 leading-relaxed">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {s.scope && (
                    <div className="mt-6 bg-brand-cream p-5 rounded-sm">
                      <h3 className="font-semibold text-sm text-brand-dark mb-2">A Focused Service with a Clear Scope</h3>
                      <p className="text-sm text-brand-dark/70 leading-relaxed">{s.scope}</p>
                    </div>
                  )}
                  <div className="mt-8 pt-6 border-t border-brand-border">
                    <p className="text-xs text-brand-dark/40 mb-3">
                      Initial inquiries are free. Personalized consultations are paid, with the fee and scope explained before booking.
                    </p>
                    <a
                      href={INQUIRY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-brand-burgundy text-brand-cream text-xs px-5 py-2.5 rounded-sm hover:bg-brand-dark transition-colors"
                    >
                      Free Inquiry
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
