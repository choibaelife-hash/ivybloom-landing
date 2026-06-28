import Link from 'next/link'

export default function StatsPreview() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* 상단 네비 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center gap-3 px-4 py-3">
        <Link href="/design-preview" className="text-brand-cream/60 hover:text-brand-cream text-xs transition-colors">
          ← 목록
        </Link>
        <span className="text-brand-cream/20">|</span>
        <span className="text-brand-cream text-xs font-medium">Stats 디자인 비교</span>
        <div className="flex gap-2 ml-auto">
          {['E','F','G','H','기존A','기존B','기존C','기존D'].map((d) => (
            <a key={d} href={`#stat-${d}`}
              className="bg-brand-cream/10 hover:bg-brand-burgundy text-brand-cream text-xs px-2 py-1 rounded transition-colors">
              {d}
            </a>
          ))}
        </div>
      </div>

      <div className="pt-12">

        {/* ── E : 숫자를 문장 안에 ── */}
        <div id="stat-E">
          <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">E</span>
            <span className="text-brand-cream/60 text-xs">인트로 문장 — 숫자가 텍스트 흐름 안에 자연스럽게</span>
          </div>
          <section className="bg-white border-y border-brand-border py-14">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="font-display text-2xl sm:text-3xl text-brand-dark leading-relaxed">
                Since{' '}
                <span className="text-brand-burgundy font-bold">2019</span>,
                IVY BLOOM has guided families through the US admissions process —
                built on{' '}
                <span className="text-brand-burgundy font-bold">15 years</span>{' '}
                of hands-on consulting experience.
              </p>
              <div className="mt-8 w-12 h-px bg-brand-burgundy mx-auto" />
              <p className="mt-6 text-sm text-brand-dark/50 uppercase tracking-widest">
                Seoul-based · Serving students worldwide
              </p>
            </div>
          </section>
        </div>

        <div className="py-8 bg-brand-cream" />

        {/* ── F : 타임라인 ── */}
        <div id="stat-F">
          <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">F</span>
            <span className="text-brand-cream/60 text-xs">타임라인 — 숫자보다 여정이 읽힘</span>
          </div>
          <section className="bg-brand-cream border-y border-brand-border py-14">
            <div className="max-w-4xl mx-auto px-6">
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                {/* 연결선 (데스크탑) */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-px bg-brand-border -translate-y-1/2 z-0" />
                {[
                  { year: '2010', label: 'Started consulting', sub: 'US admissions expertise begins' },
                  { year: '2019', label: 'IVY BLOOM founded', sub: 'Official launch in Seoul' },
                  { year: 'Now',  label: '7th year in business', sub: 'Serving students worldwide' },
                ].map((t) => (
                  <div key={t.year} className="relative z-10 flex flex-col items-center text-center flex-1">
                    <div className="w-3 h-3 rounded-full bg-brand-burgundy mb-4" />
                    <p className="font-display text-2xl font-bold text-brand-dark mb-1">{t.year}</p>
                    <p className="text-xs font-semibold text-brand-burgundy uppercase tracking-wide mb-1">{t.label}</p>
                    <p className="text-xs text-brand-dark/45">{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="py-8 bg-brand-cream" />

        {/* ── G : 히어로 안으로 흡수 (히어로 시뮬레이션) ── */}
        <div id="stat-G">
          <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">G</span>
            <span className="text-brand-cream/60 text-xs">Stats 없애기 — 히어로 하단에 한 줄 통합</span>
          </div>
          <section className="relative min-h-[60vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
              <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">US College & Boarding School Admissions</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-cream leading-tight mb-6 max-w-xl">
                The Right Strategy<br />Makes All the Difference.
              </h2>
              <p className="text-brand-cream/80 text-base mb-8 max-w-xl">
                Personalized admissions consulting for Grade 7–11 students.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <span className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm text-sm tracking-wide">
                  📱 카카오톡 무료 상담
                </span>
              </div>
              {/* 히어로 하단 한 줄 통합 */}
              <div className="border-t border-brand-cream/20 pt-6 flex flex-wrap gap-x-8 gap-y-2">
                {['15 Years of Experience', 'Est. 2019', 'Seoul · Online Worldwide'].map((t) => (
                  <span key={t} className="text-xs text-brand-cream/50 uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </section>
          <div className="bg-brand-dark px-6 py-3">
            <p className="text-brand-cream/40 text-xs">↑ Stats 섹션 없이 히어로 하단에 흡수 — 페이지 흐름이 더 빠름</p>
          </div>
        </div>

        <div className="py-8 bg-brand-cream" />

        {/* ── H : 인용문 + 신뢰 지표 ── */}
        <div id="stat-H">
          <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">H</span>
            <span className="text-brand-cream/60 text-xs">신뢰 인용 — 숫자 대신 경험으로 신뢰를 구축</span>
          </div>
          <section className="bg-brand-dark py-16">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <span className="font-display text-5xl text-brand-burgundy leading-none">"</span>
              <p className="font-display text-xl sm:text-2xl text-brand-cream leading-relaxed -mt-2">
                We don't use templates. Every student gets a strategy built around who they actually are.
              </p>
              <div className="mt-8 flex items-center justify-center gap-6">
                <div className="h-px w-12 bg-brand-cream/20" />
                <p className="text-xs text-brand-cream/40 uppercase tracking-widest">IVY BLOOM · Est. 2019 · 15 Years Experience</p>
                <div className="h-px w-12 bg-brand-cream/20" />
              </div>
            </div>
          </section>
        </div>

        <div className="py-8 bg-brand-cream" />

        {/* ── 기존 A–D 유지 (참고용) ── */}
        <div className="bg-brand-dark/5 px-6 py-4 text-center">
          <p className="text-xs text-brand-dark/40 uppercase tracking-widest">— 기존 시안 (참고) —</p>
        </div>

        {/* 기존A */}
        <div id="stat-기존A">
          <div className="bg-brand-dark px-6 py-2 flex items-center gap-3">
            <span className="text-brand-cream/40 text-xs">기존 A — 다크 풀밴드</span>
          </div>
          <section className="bg-brand-dark py-16">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-0 divide-x divide-white/10 text-center">
              {[
                { value: '15', unit: 'yrs', label: 'Years of Experience' },
                { value: '7',  unit: 'yrs', label: 'Years in Business'   },
                { value: '2019', unit: '',  label: 'Est.'                },
              ].map((s) => (
                <div key={s.label} className="px-8 py-6">
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="font-display text-6xl font-bold text-brand-cream leading-none">{s.value}</span>
                    {s.unit && <span className="font-display text-2xl font-bold text-brand-rose mb-2">{s.unit}</span>}
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 기존B */}
        <div id="stat-기존B">
          <div className="bg-brand-dark px-6 py-2 flex items-center gap-3">
            <span className="text-brand-cream/40 text-xs">기존 B — 좌측 라인 카드</span>
          </div>
          <section className="bg-white py-16 border-y border-brand-border">
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {[
                { value: '15', label: 'Years of Experience', desc: 'Guiding students and families through US admissions.' },
                { value: '7',  label: 'Years in Business',   desc: 'IVY BLOOM has been operating since 2019.' },
                { value: '2019', label: 'Est.',              desc: 'Founded in Seoul. Serving students worldwide.' },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-brand-burgundy pl-6 py-2">
                  <p className="font-display text-5xl font-bold text-brand-dark mb-1">{s.value}</p>
                  <p className="text-xs text-brand-rose uppercase tracking-widest mb-3">{s.label}</p>
                  <p className="text-xs text-brand-dark/55 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 기존C */}
        <div id="stat-기존C">
          <div className="bg-brand-dark px-6 py-2 flex items-center gap-3">
            <span className="text-brand-cream/40 text-xs">기존 C — 인라인 한 줄</span>
          </div>
          <section className="bg-brand-cream py-10 border-y border-brand-border">
            <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {[
                { value: '15', label: 'Years of Experience' },
                { value: '7',  label: 'Years in Business'   },
                { value: 'Est. 2019', label: 'Seoul, Korea' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  {i > 0 && <span className="hidden sm:block w-px h-8 bg-brand-border" />}
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-brand-burgundy">{s.value}</span>
                    <span className="text-xs text-brand-dark/50 uppercase tracking-wider">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 기존D */}
        <div id="stat-기존D">
          <div className="bg-brand-dark px-6 py-2 flex items-center gap-3">
            <span className="text-brand-cream/40 text-xs">기존 D — 버건디 배경</span>
          </div>
          <section className="bg-brand-burgundy py-14">
            <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 divide-x divide-brand-cream/15 text-center">
              {[
                { value: '15', suffix: '+', label: 'Years of Experience' },
                { value: '7',  suffix: '',  label: 'Years in Business'   },
                { value: '2019', suffix: '', label: 'Est.'               },
              ].map((s) => (
                <div key={s.label} className="px-6 py-4">
                  <div className="flex items-end justify-center gap-0.5">
                    <p className="font-display text-5xl sm:text-6xl font-bold text-brand-cream leading-none">{s.value}</p>
                    {s.suffix && <p className="font-display text-2xl font-bold text-brand-rose mb-1">{s.suffix}</p>}
                  </div>
                  <p className="text-xs text-brand-cream/50 uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="py-12 bg-brand-cream" />

      </div>
    </div>
  )
}
