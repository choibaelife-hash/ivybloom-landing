const KAKAO_URL = 'https://pf.kakao.com/_ybbloom'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end pb-20 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-burgundy/70" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">
          Cultivate Your Abilities
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-cream leading-tight mb-6 max-w-2xl">
          Your Path to<br />Top US Universities
        </h1>
        <p className="text-brand-cream/80 text-lg mb-10 max-w-xl">
          Korean-American students guided by expert consultants — from strategy to acceptance.
        </p>
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wide"
        >
          📱 카카오톡 무료 상담
        </a>
        <p className="text-brand-cream/40 text-xs mt-3">via KakaoTalk — 무료 상담</p>
      </div>
    </section>
  )
}
