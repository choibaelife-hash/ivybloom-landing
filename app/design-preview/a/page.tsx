import Link from 'next/link'

const services = [
  {
    icon: '🎓',
    title: 'College Application Consulting',
    target: '고등학교 11학년',
    description: '대학 리스트 선정부터 에세이까지, 합격을 위한 전 과정을 함께합니다.',
    items: ['지원 대학 리스트 선정', 'Common App 지원서 검토', 'Personal Statement + Supplement Essay'],
  },
  {
    icon: '✍️',
    title: 'Essay Consulting',
    target: '고등학교 11학년 (에세이만 필요한 학생)',
    description: '학교 리스트는 이미 정하셨나요? 원하는 학교의 에세이만 집중적으로 완성합니다.',
    items: ['학생·학부모 지정 대학 기준 진행', 'Supplement Essay 작성 및 피드백', '에세이 단품 의뢰 가능'],
  },
  {
    icon: '🏫',
    title: 'Boarding School Consulting',
    target: '중학교 7–8학년, 고등학교 9학년',
    description: '미국 보딩스쿨 입학을 위한 지원서·에세이 전 과정을 지원합니다.',
    items: ['지원 학교 리스트 작성', '지원서 전반 검토', '학생 에세이 + Parent Essay 작성'],
  },
]

export default function DesignA() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/design-preview" className="bg-brand-dark text-brand-cream text-xs px-3 py-2 rounded">← 목록</Link>
        <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-2 rounded font-bold">A — 카드 3개 나열</span>
      </div>
      <section className="py-24 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Services</p>
          <h2 className="font-display text-4xl font-bold text-brand-dark text-center mb-16">How We Help You Get In</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.title} className="bg-brand-cream border border-brand-border rounded-sm p-8 hover:border-brand-rose transition-colors">
                <span className="text-4xl mb-5 block">{s.icon}</span>
                <p className="text-xs text-brand-rose uppercase tracking-wider mb-2">{s.target}</p>
                <h3 className="font-display font-bold text-xl text-brand-dark mb-3">{s.title}</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-brand-dark/60">
                      <span className="text-brand-burgundy mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
