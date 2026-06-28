'use client'

import { useState } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: '🎓',
    title: 'College Application',
    target: '고등학교 11학년',
    description: '대학 리스트 선정부터 에세이까지, 합격을 위한 전 과정을 함께합니다.',
    items: ['지원 대학 리스트 선정', 'Common App 지원서 검토', 'Personal Statement + Supplement Essay 작성 및 피드백'],
    badge: '종합 패키지',
  },
  {
    icon: '✍️',
    title: 'Essay Consulting',
    target: '고등학교 11학년',
    description: '학교 리스트는 이미 정하셨나요? 원하는 학교의 에세이만 집중적으로 완성합니다.',
    items: ['학생·학부모 지정 대학 기준 진행', 'Supplement Essay 작성 및 피드백', '에세이 단품 의뢰 가능'],
    badge: '에세이 단품',
  },
  {
    icon: '🏫',
    title: 'Boarding School',
    target: '중학교 7–8학년 / 고등학교 9학년',
    description: '미국 보딩스쿨 입학을 위한 지원서·에세이 전 과정을 지원합니다.',
    items: ['지원 학교 리스트 작성', '지원서 전반 검토', '학생 에세이 + Parent Essay 작성 및 피드백'],
    badge: '보딩스쿨',
  },
]

export default function DesignC() {
  const [active, setActive] = useState(0)
  const s = services[active]

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/design-preview" className="bg-brand-dark text-brand-cream text-xs px-3 py-2 rounded">← 목록</Link>
        <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-2 rounded font-bold">C — 탭 방식</span>
      </div>
      <section className="py-24 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Services</p>
          <h2 className="font-display text-4xl font-bold text-brand-dark text-center mb-12">How We Help You Get In</h2>

          {/* 탭 */}
          <div className="flex border-b border-brand-border mb-12">
            {services.map((sv, i) => (
              <button
                key={sv.title}
                onClick={() => setActive(i)}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  active === i
                    ? 'border-brand-burgundy text-brand-burgundy'
                    : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
                }`}
              >
                {sv.icon} {sv.title}
              </button>
            ))}
          </div>

          {/* 콘텐츠 */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block bg-brand-burgundy text-brand-cream text-xs px-3 py-1 rounded-full mb-4">{s.badge}</span>
              <h3 className="font-display text-3xl font-bold text-brand-dark mb-2">{s.title}</h3>
              <p className="text-sm text-brand-rose mb-6">{s.target}</p>
              <p className="text-brand-dark/70 leading-relaxed">{s.description}</p>
            </div>
            <div className="bg-brand-cream rounded-sm p-8">
              <p className="text-xs text-brand-dark/50 uppercase tracking-wider mb-5">포함 항목</p>
              <ul className="space-y-4">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-dark/80">
                    <span className="text-brand-burgundy font-bold mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-brand-border">
                <p className="text-xs text-brand-dark/40">비용 안내는 무료 상담 후 제공됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
