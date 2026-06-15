const testimonials = [
  {
    quote:
      "IVY BLOOM completely changed how we approached the application process. My daughter was admitted to her dream school — we couldn't have done it without their guidance.",
    author: 'Parent of Class of 2025',
  },
  {
    quote:
      'The essay coaching was a game-changer. My consultant helped me find a story I never would have thought to tell. Admitted to UCLA and USC.',
    author: 'Student, Class of 2024',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          Testimonials
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          What Our Families Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="border-l-2 border-brand-burgundy pl-6 py-2"
            >
              <p className="text-brand-dark/80 italic leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="not-italic text-xs text-brand-rose tracking-wider uppercase">
                — {t.author}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
