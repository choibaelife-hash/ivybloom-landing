import ScrollReveal from '@/components/ScrollReveal'

const problems = [
  {
    heading: 'Strong credentials are not enough without strategy',
    body: "Parents ask us one question more than any other: \"Is my child's profile good enough to get in?\" The answer almost never depends on GPA alone — it depends on how the application is built around the student's specific strengths.",
  },
  {
    heading: 'Essays are where most applications win or lose',
    body: 'Admissions officers read thousands of applications. A formulaic essay — even a well-written one — disappears into the pile. What gets noticed is a genuine narrative that shows exactly who the student is.',
  },
  {
    heading: 'The admissions process is a full-time job',
    body: 'School list, test scores, application forms, supplement essays, Parent Essays for boarding schools, deadlines — managing it all without guidance means something important will be missed.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            The Challenge
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            Why Most Applications Fall Short
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.heading}
                className="stagger-item border-l-2 border-brand-burgundy pl-5 py-2"
              >
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
                  {p.heading}
                </h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
