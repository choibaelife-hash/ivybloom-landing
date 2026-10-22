import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'


const services = [
  {
    "number": "01",
    "anchor": "admissions-roadmap",
    "title": "Personalized Admissions Roadmap",
    "target": "Grades 7–11",
    "description": "More information rarely means more clarity. What your student needs is a tailored, actionable plan.",
    "items": [
      "Document Review",
      "Parent & Student Interview",
      "Strategy Consultation",
      "Your Personalized Roadmap"
    ]
  },
  {
    "number": "02",
    "anchor": "college-application",
    "title": "College Application Consulting",
    "target": "For Students in Grades 11–12",
    "description": "Comprehensive admissions guidance—from building a balanced college list to preparing applications and navigating post-submission requirements. We help students identify their strengths and present their experiences, interests, and goals with clarity and authenticity.",
    "items": [
      "Application Eligibility & Requirements Review",
      "College List Development & Strategy",
      "Application Planning & Review",
      "Personal Statement & Supplemental Essay Coaching",
      "Post-Submission Guidance & Follow-Up Support"
    ]
  },
  {
    "number": "03",
    "anchor": "essay-consulting",
    "title": "College Essay Consulting",
    "target": "Grades 11–12 · Essay-Only Support",
    "description": "Already have your college list? We help you develop and refine the essays for your chosen colleges, keeping your experiences, ideas, and authentic voice at the heart of every draft. Personalized guidance—not a one-size-fits-all template.",
    "items": [
      "Supplemental Essay Support for Each College",
      "Multiple Rounds of Feedback and Revision",
      "Flexible Packages Based on Your College List"
    ]
  },
  {
    "number": "04",
    "anchor": "boarding-school",
    "title": "Boarding School Consulting",
    "target": "Grades 7–9",
    "description": "Personalized guidance across a broad range of boarding schools—from highly selective institutions to schools offering a strong balance of academic challenge and individualized support. We help families find the right fit for each student’s strengths, interests, and goals, with support from school selection through application preparation and final submission.",
    "items": [
      "School Lists & Positioning",
      "Candidate’s Application Review",
      "Student & Parent Statements",
      "Portfolio Review",
      "Interview Preparation"
    ]
  }
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            Services
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            How We Help You Get In
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <Link
                key={s.title}
                href={`/services#${s.anchor}`}
                className="stagger-item bg-brand-cream border border-brand-border rounded-sm p-8 hover:border-brand-rose hover:shadow-md transition-all flex flex-col group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-display text-3xl font-bold text-brand-burgundy/20">{s.number}</span>
                </div>
                <p className="text-xs text-brand-rose uppercase tracking-wider mb-2">{s.target}</p>
                <h3 className="font-display font-bold text-xl text-brand-dark mb-3 group-hover:text-brand-burgundy transition-colors">{s.title}</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-brand-dark/60">
                      <span className="text-brand-burgundy mt-0.5 flex-shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
