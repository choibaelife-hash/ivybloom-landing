import Link from 'next/link'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'
const FORM_URL  = 'https://docs.google.com/forms/d/11IWatJJoihHx_1gk61v4KBTFX67gzUTjPRSMl1-emTc/viewform'

// 버건디 피오니
const FLOWER_IMG = 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=1200&q=85'
// 아이비리그 캠퍼스 클래식 건물
const CAMPUS_IMG = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=85'
// 아이비 덮인 석조 건물 (대안)
const CAMPUS_B   = 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=85'

export default function HeroBloomPreview() {
  return (
    <div className="bg-brand-dark min-h-screen">
      {/* 상단 네비 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center gap-3 px-4 py-3">
        <Link href="/design-preview" className="text-brand-cream/60 hover:text-brand-cream text-xs transition-colors">
          ← 목록
        </Link>
        <span className="text-brand-cream/20">|</span>
        <span className="text-brand-cream text-xs font-medium">Hero Bloom — 스플릿 컴포지션</span>
        <div className="flex gap-2 ml-auto">
          {['2-A','2-B','2-C'].map((d) => (
            <a key={d} href={`#v${d}`}
              className="bg-brand-cream/10 hover:bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded transition-colors">
              {d}
            </a>
          ))}
        </div>
      </div>

      <div className="pt-12">

        {/* ── 2-A : 좌측 꽃 + 우측 캠퍼스, 텍스트 꽃 위 ── */}
        <div id="v2-A">
          <div className="bg-black px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">2-A</span>
            <span className="text-brand-cream/60 text-xs">좌측 꽃 클로즈업 + 우측 캠퍼스 — 50:50 수직 분할</span>
          </div>
          <section className="flex min-h-screen">
            {/* 좌측 : 꽃 + 텍스트 */}
            <div className="relative w-1/2 flex flex-col justify-center px-12 py-16 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${FLOWER_IMG}')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
              <div className="relative z-10">
                <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-5">
                  US College & Boarding School Admissions
                </p>
                <h1 className="font-display text-5xl xl:text-6xl font-bold text-brand-cream leading-tight mb-6">
                  The Right<br />Strategy<br />
                  <span className="text-brand-rose">Blooms.</span>
                </h1>
                <p className="text-brand-cream/70 text-sm leading-relaxed mb-8 max-w-xs">
                  Personalized admissions consulting for Grade 7–11 students — US boarding schools to top universities.
                </p>
                <div className="flex flex-col gap-3 max-w-xs">
                  <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                    className="bg-brand-cream text-brand-burgundy font-semibold px-6 py-3 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors text-center">
                    📱 카카오톡 무료 상담
                  </a>
                  <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
                    className="border border-brand-cream/50 text-brand-cream px-6 py-3 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors text-center">
                    상담 신청서 →
                  </a>
                </div>
                <p className="text-brand-cream/30 text-xs mt-5">Weekdays 9 AM – 5 PM KST</p>
              </div>
            </div>
            {/* 우측 : 캠퍼스 */}
            <div className="relative w-1/2 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${CAMPUS_IMG}')` }} />
              <div className="absolute inset-0 bg-black/20" />
              {/* 로고 오버레이 */}
              <div className="absolute bottom-8 right-8">
                <p className="font-display text-brand-cream/80 text-xs tracking-[3px] uppercase">IVY BLOOM</p>
                <p className="text-brand-cream/40 text-xs">Est. 2019</p>
              </div>
            </div>
          </section>
        </div>

        <div className="py-2 bg-brand-dark" />

        {/* ── 2-B : 대각선 분할 ── */}
        <div id="v2-B">
          <div className="bg-black px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">2-B</span>
            <span className="text-brand-cream/60 text-xs">대각선 분할 — 꽃(좌하) / 캠퍼스(우상), 텍스트 중앙</span>
          </div>
          <section className="relative min-h-screen overflow-hidden flex items-center">
            {/* 꽃 배경 (좌측 대각 클립) */}
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${FLOWER_IMG}')` }} />
            {/* 캠퍼스 오른쪽 대각선으로 덮기 */}
            <div className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${CAMPUS_IMG}')`,
                clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 30% 100%)',
              }} />
            {/* 전체 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/55" />
            {/* 분할선 (버건디) */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom-right, transparent 37%, #6B1A2C 37.5%, transparent 38%)',
              }} />
            {/* 텍스트 — 중앙 */}
            <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
              <div className="max-w-lg">
                <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-5">
                  US College & Boarding School Admissions
                </p>
                <h1 className="font-display text-5xl xl:text-6xl font-bold text-brand-cream leading-tight mb-6">
                  Where Potential<br />
                  <span className="text-brand-rose italic">Blooms</span>{' '}
                  Into<br />Achievement.
                </h1>
                <p className="text-brand-cream/70 text-sm leading-relaxed mb-8 max-w-sm">
                  Personalized admissions consulting for Grade 7–11 students — US boarding schools to top universities.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                    className="bg-brand-cream text-brand-burgundy font-semibold px-7 py-3.5 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors">
                    📱 카카오톡 무료 상담
                  </a>
                  <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
                    className="border border-brand-cream/50 text-brand-cream px-7 py-3.5 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors">
                    상담 신청서 →
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="py-2 bg-brand-dark" />

        {/* ── 2-C : 꽃이 전면, 캠퍼스 우측 패널 (3:2) ── */}
        <div id="v2-C">
          <div className="bg-black px-6 py-3 flex items-center gap-3">
            <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">2-C</span>
            <span className="text-brand-cream/60 text-xs">꽃 전면 배경 + 우측 캠퍼스 사진 패널 — 텍스트 좌측</span>
          </div>
          <section className="flex min-h-screen">
            {/* 좌측 3/5 : 꽃 전면 + 텍스트 */}
            <div className="relative w-3/5 flex flex-col justify-end px-14 py-16 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url('${FLOWER_IMG}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="relative z-10">
                {/* 브랜드명 상단 */}
                <div className="absolute top-10 left-14">
                  <p className="font-display text-brand-cream text-lg font-bold tracking-widest uppercase">IVY BLOOM</p>
                  <div className="h-px w-full bg-brand-rose mt-1" />
                </div>
                <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-4">
                  US College & Boarding School Admissions
                </p>
                <h1 className="font-display text-5xl xl:text-6xl font-bold text-brand-cream leading-tight mb-5">
                  The Right Strategy<br />Makes All the<br />Difference.
                </h1>
                <p className="text-brand-cream/65 text-sm leading-relaxed mb-8 max-w-sm">
                  Personalized admissions consulting for Grade 7–11 students — from US boarding schools to top university admissions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                    className="bg-brand-cream text-brand-burgundy font-semibold px-7 py-3.5 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors">
                    📱 카카오톡 무료 상담
                  </a>
                  <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
                    className="border border-brand-cream/40 text-brand-cream px-7 py-3.5 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors">
                    상담 신청서 →
                  </a>
                </div>
                <p className="text-brand-cream/30 text-xs mt-5">Weekdays 9 AM – 5 PM KST · Est. 2019</p>
              </div>
            </div>
            {/* 우측 2/5 : 캠퍼스 사진 스택 */}
            <div className="relative w-2/5 flex flex-col overflow-hidden">
              {/* 위: 캠퍼스 A */}
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${CAMPUS_IMG}')` }} />
                <div className="absolute inset-0 bg-brand-dark/20" />
              </div>
              {/* 얇은 구분선 */}
              <div className="h-0.5 bg-brand-dark" />
              {/* 아래: 캠퍼스 B */}
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-top"
                  style={{ backgroundImage: `url('${CAMPUS_B}')` }} />
                <div className="absolute inset-0 bg-brand-burgundy/20" />
              </div>
            </div>
          </section>
        </div>

        <div className="py-8 bg-brand-dark" />

      </div>
    </div>
  )
}
