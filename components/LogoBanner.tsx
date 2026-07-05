const colleges = [
  'Harvard University',
  'Yale University',
  'Princeton University',
  'Columbia University',
  'Cornell University',
  'Dartmouth College',
  'Brown University',
  'Univ. of Pennsylvania',
  'MIT',
  'Stanford University',
  'Duke University',
  'Georgetown University',
  'Northwestern University',
  'Vanderbilt University',
]

const boardingSchools = [
  'Phillips Exeter Academy',
  'Phillips Andover Academy',
  'Choate Rosemary Hall',
  'Groton School',
  'Deerfield Academy',
  'Hotchkiss School',
  'Lawrenceville School',
  'St. Paul\'s School',
]

const allSchools = [...colleges, ...boardingSchools]

export default function LogoBanner() {
  const doubled = [...allSchools, ...allSchools]

  return (
    <section className="bg-white border-y border-brand-border py-10 overflow-hidden">
      <p className="text-center text-[10px] tracking-[4px] uppercase text-brand-rose mb-7">
        Students Admitted To
      </p>

      <div className="relative">
        {/* 좌우 페이드 마스크 */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee flex items-center whitespace-nowrap gap-0">
          {doubled.map((school, i) => (
            <span key={i} className="inline-flex items-center gap-8 px-6">
              <span className="font-display text-sm font-semibold text-brand-dark/70 tracking-wide">
                {school}
              </span>
              <span className="text-brand-burgundy/30 text-xs select-none">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
