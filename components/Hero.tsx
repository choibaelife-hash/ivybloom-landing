const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'
const FORM_URL  = 'https://docs.google.com/forms/d/11IWatJJoihHx_1gk61v4KBTFX67gzUTjPRSMl1-emTc/viewform'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')",
        }}
      />
      {/* Overlay — 좌측 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <p className="text-brand-rose text-xs tracking-[4px] uppercase mb-4">
          US College & Boarding School Admissions
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-cream leading-tight mb-6 max-w-xl">
          The Right Strategy<br />Makes All the Difference.
        </h1>
        <p className="text-brand-cream/80 text-lg mb-10 max-w-xl">
          Personalized admissions consulting for Grade 7–11 students — from US boarding school applications to top university admissions.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-cream text-brand-burgundy font-semibold px-8 py-4 rounded-sm hover:bg-brand-rose hover:text-brand-cream transition-colors text-sm tracking-wide"
          >
            📱 카카오톡 무료 상담
          </a>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-brand-cream/60 text-brand-cream px-8 py-4 rounded-sm hover:bg-brand-cream/10 transition-colors text-sm tracking-wide"
          >
            상담 신청서 →
          </a>
        </div>
        <p className="text-brand-cream/40 text-xs mt-4">Weekdays 9 AM – 5 PM KST</p>
      </div>
    </section>
  )
}
