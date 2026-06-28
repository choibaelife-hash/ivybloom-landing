import Link from 'next/link'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'
const IMG = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80'

const eyebrow = 'US College & Boarding School Admissions'
const h1 = (
  <>
    The Right Strategy<br />Makes All the Difference.
  </>
)
const sub =
  'Personalized admissions consulting for Grade 7–11 students — from US boarding school applications to top university admissions.'

export default function HeroPreview() {
  return (
    <div>
      {/* 상단 네비 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center gap-3 px-4 py-3">
        <Link
          href="/design-preview"
          className="text-brand-cream/60 hover:text-brand-cream text-xs transition-colors"
        >
          ← 목록
        </Link>
        <span className="text-brand-cream/20">|</span>
        <span className="text-brand-cream text-xs font-medium">Hero 디자인 비교</span>
        <div className="flex gap-2 ml-auto">
          {['A', 'B', 'C'].map((d) => (
            <a
              key={d}
              href={`#design-${d}`}
              className="bg-brand-cream/10 hover:bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded transition-colors"
            >
              {d}
            </a>
          ))}
        </div>
      </div>

      {/* ────────── DESIGN A : 좌측 그라데이션 ────────── */}
      <div id="design-A" className="pt-10">
        <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
          <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">
            Design A
          </span>
          <span className="text-brand-cream/60 text-xs">좌측 그라데이션 — 사진이 오른쪽으로 자연스럽게 노출</span>
        </div>
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${IMG}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-5">{eyebrow}</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brand-cream leading-tight mb-7 max-w-xl">
              {h1}
            </h1>
            <p className="text-brand-cream/75 text-base sm:text-lg mb-10 max-w-md leading-relaxed">{sub}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors"
              >
                📱 카카오톡 무료 상담
              </a>
              <a
                href="#"
                className="inline-block border border-brand-cream/50 text-brand-cream px-8 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors"
              >
                상담 신청서 →
              </a>
            </div>
            <p className="text-brand-cream/35 text-xs mt-4">Weekdays 9 AM – 5 PM KST</p>
          </div>
        </section>
      </div>

      {/* ────────── DESIGN B : 하단 그라데이션 (시네마틱) ────────── */}
      <div id="design-B">
        <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
          <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">
            Design B
          </span>
          <span className="text-brand-cream/60 text-xs">하단 그라데이션 — 사진 전체 노출, 텍스트는 하단 중앙</span>
        </div>
        <section className="relative min-h-[90vh] flex items-end pb-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${IMG}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full text-center">
            <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-5">{eyebrow}</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brand-cream leading-tight mb-7 max-w-3xl mx-auto">
              {h1}
            </h1>
            <p className="text-brand-cream/75 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">{sub}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors"
              >
                📱 카카오톡 무료 상담
              </a>
              <a
                href="#"
                className="inline-block border border-brand-cream/50 text-brand-cream px-8 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors"
              >
                상담 신청서 →
              </a>
            </div>
            <p className="text-brand-cream/35 text-xs mt-4">Weekdays 9 AM – 5 PM KST</p>
          </div>
        </section>
      </div>

      {/* ────────── DESIGN C : 스플릿 패널 ────────── */}
      <div id="design-C">
        <div className="bg-brand-dark px-6 py-3 flex items-center gap-3">
          <span className="bg-brand-burgundy text-brand-cream text-xs font-bold px-3 py-1 rounded">
            Design C
          </span>
          <span className="text-brand-cream/60 text-xs">스플릿 패널 — 오버레이 없음, 왼쪽 다크 패널 + 오른쪽 사진 전체</span>
        </div>
        <section className="min-h-[90vh] flex flex-col md:flex-row">
          {/* 왼쪽 텍스트 패널 */}
          <div className="w-full md:w-[48%] bg-brand-dark flex flex-col justify-center px-10 sm:px-14 py-20">
            <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-5">{eyebrow}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-cream leading-tight mb-7">
              {h1}
            </h1>
            <p className="text-brand-cream/70 text-sm sm:text-base mb-10 leading-relaxed">{sub}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-cream text-brand-dark font-semibold px-7 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-rose hover:text-brand-cream transition-colors text-center"
              >
                📱 카카오톡 무료 상담
              </a>
              <a
                href="#"
                className="inline-block border border-brand-cream/30 text-brand-cream px-7 py-4 rounded-sm text-sm tracking-wide hover:bg-brand-cream/10 transition-colors text-center"
              >
                상담 신청서 →
              </a>
            </div>
            <p className="text-brand-cream/30 text-xs mt-5">Weekdays 9 AM – 5 PM KST</p>
          </div>
          {/* 오른쪽 이미지 (오버레이 없음) */}
          <div
            className="w-full md:w-[52%] min-h-[50vh] bg-cover bg-center"
            style={{ backgroundImage: `url('${IMG}')` }}
          />
        </section>
      </div>
    </div>
  )
}
