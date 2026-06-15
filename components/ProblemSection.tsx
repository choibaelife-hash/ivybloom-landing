const problems = [
  {
    heading: "GPA alone won't get you in",
    body: 'Top universities look far beyond grades. Without a strategic narrative, even strong students get passed over.',
  },
  {
    heading: 'Essay strategy is where most students fail',
    body: "The Common App and supplement essays are your chance to stand out — but most students don't know what admissions officers actually want to read.",
  },
  {
    heading: 'The process feels overwhelming without guidance',
    body: 'Deadlines, school lists, interviews, financial aid — navigating US admissions alone is a full-time job.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          The Challenge
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Why Most Applications Fall Short
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.heading}
              className="border-l-2 border-brand-burgundy pl-5 py-2"
            >
              <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
                {p.heading}
              </h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
