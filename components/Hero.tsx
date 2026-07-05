const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes ivyRise {
          0%   { opacity: 0; transform: translateY(56px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        .ivy-brand {
          opacity: 0;
          animation: ivyRise 2.0s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          background: linear-gradient(160deg, #FAF6F0 30%, #C9919A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ivy-tagline {
          opacity: 0;
          animation: fadeUp 1s ease-out 1.4s forwards;
        }
        .ivy-cta {
          opacity: 0;
          animation: fadeUp 1s ease-out 1.7s forwards;
        }
      `}</style>

      <section className="relative min-h-[48vh] flex flex-col overflow-hidden">
        {/* 배경 이미지 — 하늘이 보이는 캠퍼스 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80')",
          }}
        />
        {/* 오버레이 — 균일한 반투명 */}
        <div className="absolute inset-0 bg-brand-dark/55" />

        {/* 중앙 텍스트 — 하늘 영역 */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-6">
          <h1
            className="ivy-brand font-display font-bold text-brand-cream tracking-[0.25em] mb-5"
            style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
          >
            IVY BLOOM
          </h1>
          <p className="ivy-tagline font-display text-lg sm:text-2xl md:text-3xl text-brand-cream/75 font-medium leading-snug">
            The Right Strategy<br />Makes All the Difference.
          </p>
        </div>

        {/* 하단 버튼 — 발 아래 */}
        <div className="ivy-cta relative flex flex-wrap justify-center gap-4 pb-12 px-6">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-10 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wider"
          >
            Free Consultation
          </a>
          <a
            href="/contact"
            className="inline-block border border-brand-cream/50 text-brand-cream px-10 py-4 rounded-sm hover:bg-brand-cream/10 transition-colors text-sm tracking-wider"
          >
            Inquiry Form →
          </a>
        </div>
      </section>
    </>
  )
}
