const services = [
  {
    icon: '🎓',
    title: 'College Admissions Consulting',
    description:
      'End-to-end strategy from school list building to final submission. We craft a narrative that highlights your unique strengths.',
  },
  {
    icon: '🏫',
    title: 'Boarding School Consulting',
    description:
      'Expert guidance for secondary school applications in the US. School matching, essays, and interview preparation.',
  },
  {
    icon: '✍️',
    title: 'Essay Coaching',
    description:
      'Common App personal statement and supplemental essays refined to resonate with admissions officers at your target schools.',
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
              className="bg-brand-cream border border-brand-border rounded-sm p-8 hover:border-brand-rose transition-colors"
            >
              <span className="text-4xl mb-5 block">{s.icon}</span>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
