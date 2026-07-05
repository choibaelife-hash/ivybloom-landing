import ScrollReveal from '@/components/ScrollReveal'

const stats = [
  { value: '15', label: 'Years of Experience' },
  { value: '7',  label: 'Years in Business' },
  { value: '2019', label: 'Est.' },
]

export default function Stats() {
  return (
    <section className="bg-brand-cream border-y border-brand-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal stagger>
          <div className="grid grid-cols-3 divide-x divide-brand-border text-center">
            {stats.map((s) => (
              <div key={s.label} className="stagger-item px-6 py-4">
                <p className="font-display text-4xl font-bold text-brand-burgundy mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-brand-dark/60 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
