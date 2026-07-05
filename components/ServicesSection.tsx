import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'


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
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            Services
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            How We Help You Get In
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger>
          <div className="grid md:grid-cols-3 gap-8">
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
