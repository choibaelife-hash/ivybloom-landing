import Link from 'next/link'

const services = [
  {
    icon: '🎓',
    number: '01',
    title: 'College Application Consulting',
    target: '고등학교 11학년',
    badge: '종합 패키지',
    description: '대학 리스트 선정부터 에세이까지, 합격을 위한 전 과정을 함께합니다. 컨설턴트가 전략을 주도하며 지원자의 강점을 최대한 살린 서사를 만듭니다.',
    items: ['지원 대학 리스트 선정', 'Common App 지원서 검토', 'Personal Statement 작성 및 피드백', 'Supplement Essay 전 학교 작성 지원'],
    bg: 'bg-white',
  },
  {
    icon: '✍️',
    number: '02',
    title: 'Essay Consulting',
    target: '고등학교 11학년 (에세이만 필요한 학생)',
    badge: '에세이 단품',
    description: '학교 리스트는 이미 정해두셨나요? 원하는 학교의 에세이만 골라서 의뢰할 수 있습니다. 종합 컨설팅 없이 에세이 작성 하나만도 가능합니다.',
    items: ['학생·학부모 지정 대학 리스트 기준', 'Supplement Essay 작성 및 피드백', '학교 수에 따라 유연하게 조정 가능'],
    bg: 'bg-brand-cream',
  },
  {
    icon: '🏫',
    number: '03',
    title: 'Boarding School Consulting',
    target: '중학교 7–8학년 / 고등학교 9학년',
    badge: '보딩스쿨',
    description: '미국 보딩스쿨 입학을 위한 지원서·에세이 전 과정을 지원합니다. 학교 선정부터 Parent Essay까지, 가족 모두를 위한 컨설팅입니다.',
    items: ['지원 학교 리스트 작성', '지원서 전반 검토', '학생 에세이 작성 및 피드백', 'Parent Essay 작성 및 검토'],
    bg: 'bg-white',
  },
]

export default function DesignD() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/design-preview" className="bg-brand-dark text-brand-cream text-xs px-3 py-2 rounded">← 목록</Link>
        <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-2 rounded font-bold">D — 세로 풀 섹션</span>
      </div>
      <div className="pt-16">
        <div className="py-16 bg-brand-burgundy text-center">
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Services</p>
          <h2 className="font-display text-4xl font-bold text-brand-cream">How We Help You Get In</h2>
        </div>
        {services.map((s) => (
          <section key={s.number} className={`${s.bg} py-20`}>
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-display text-5xl font-bold text-brand-burgundy/20">{s.number}</span>
                  <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded-full">{s.badge}</span>
                </div>
                <p className="text-brand-rose text-xs uppercase tracking-wider mb-2">{s.target}</p>
                <h3 className="font-display text-2xl font-bold text-brand-dark mb-5">{s.title}</h3>
                <p className="text-brand-dark/70 leading-relaxed text-sm">{s.description}</p>
              </div>
              <div className="border border-brand-border rounded-sm p-8 bg-white">
                <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-5">포함 항목</p>
                <ul className="space-y-4">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-dark">
                      <span className="text-brand-burgundy font-bold mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
