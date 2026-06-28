const cases = [
  {
    label: 'Case 01',
    headline: '10 Applications. 10 Acceptance Letters.',
    story:
      'A student who had struggled with a neurological condition through middle school came to us at the start of Grade 10. We built an application strategy around the resilience and growth visible in his journey. By the time applications were submitted, he had acceptance letters from all 10 universities he applied to.',
    tag: 'US College Admissions',
  },
  {
    label: 'Case 02',
    headline: 'From Roblox Developer to UC Berkeley & Georgia Tech.',
    story:
      'This student had spent years building his own game on Roblox — a serious technical project that most consultants would have overlooked. We placed that story at the center of his application narrative. He was admitted to both UC Berkeley and Georgia Tech.',
    tag: 'US College Admissions',
  },
  {
    label: 'Case 03',
    headline: 'Four Schools. One Messy Record. A Better Outcome Than Expected.',
    story:
      'By the time this student reached us, he had transferred schools four times — including a withdrawal and an expulsion. His academic record was far from clean. We built an honest, forward-looking narrative around the growth that followed. He enrolled at a school that exceeded what his record suggested was possible.',
    tag: 'US College Admissions',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Results
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          What a Difference Strategy Makes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div
              key={c.label}
              className="bg-brand-cream border border-brand-border rounded-sm p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-3xl font-bold text-brand-burgundy/15 leading-none select-none">
                  {c.label}
                </span>
                <span className="text-xs text-brand-rose uppercase tracking-wider">{c.tag}</span>
              </div>
              <h3 className="font-display font-bold text-base text-brand-dark leading-snug mb-4">
                {c.headline}
              </h3>
              <p className="text-sm text-brand-dark/65 leading-relaxed">{c.story}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-brand-dark/40 mt-8">
          All cases anonymized. Full details available during consultation.
        </p>
      </div>
    </section>
  )
}
