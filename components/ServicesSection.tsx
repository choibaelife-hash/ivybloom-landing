import Link from 'next/link'

const services = [
  {
    number: '01',
    anchor: 'college-application',
    title: 'College Application Consulting',
    target: 'Grade 11 High School Students',
    description:
      'Full-cycle admissions strategy — from building your target school list to submitting every application. We craft a narrative that sets you apart in the most competitive applicant pools in the world.',
    items: ['College list strategy', 'Common App review', 'Personal Statement + Supplement Essays'],
  },
  {
    number: '02',
    anchor: 'essay-consulting',
    title: 'Essay Consulting',
    target: 'Grade 11 · Essay-Only Option',
    description:
      'Already have your school list? We focus exclusively on writing the essays that matter most. Every draft is built around your voice — not a template.',
    items: ['Supplement Essays for every target school', 'Multiple revision rounds', 'Flexible scope by school'],
  },
  {
    number: '03',
    anchor: 'boarding-school',
    title: 'Boarding School Consulting',
    target: 'Grades 7–9',
    description:
      'Applying to Exeter, Andover, or Choate? We support the full application — from school list to student essays to Parent Essay — for students and families together.',
    items: ['School list & positioning', 'Student + Parent Essays', 'Interview preparation'],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Services
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          How We Help You Get In
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-brand-cream border border-brand-border rounded-sm p-8 hover:border-brand-rose transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-3xl font-bold text-brand-burgundy/20">{s.number}</span>
              </div>
              <p className="text-xs text-brand-rose uppercase tracking-wider mb-2">{s.target}</p>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-3">{s.title}</h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed mb-5">{s.description}</p>
              <ul className="space-y-2 mb-6">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-brand-dark/60">
                    <span className="text-brand-burgundy mt-0.5 flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href={`/services#${s.anchor}`}
                  className="text-xs text-brand-burgundy hover:text-brand-dark transition-colors underline underline-offset-2"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-block border border-brand-burgundy text-brand-burgundy text-xs px-6 py-3 rounded-sm hover:bg-brand-burgundy hover:text-brand-cream transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
