import ScrollReveal from '@/components/ScrollReveal'

const problems = [
  {
    "heading": "Strong credentials. Thoughtful strategy.",
    "body": "Parents often ask us, “Is my child’s profile good enough to get in?” We look beyond GPA to understand each student’s strengths, experiences, and goals—and help them develop an application that reflects who they are."
  },
  {
    "heading": "Authentic stories. Individual voices.",
    "body": "A polished essay can still feel impersonal. We help students reflect on their experiences, discover what they want to say, and express it with clarity—without losing the voice that makes the story their own."
  },
  {
    "heading": "A complex process. A clear plan.",
    "body": "From school selection and testing timelines to application forms, supplemental essays, and boarding school parent statements, there is a lot to coordinate. We help families organize each step, track deadlines, and keep the process moving forward."
  }
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            The Challenge
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark max-w-3xl mx-auto leading-tight">
            Why Strong Students Don’t Always Submit Strong Applications
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
