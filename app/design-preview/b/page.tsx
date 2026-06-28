'use client'

import { useState } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: '🎓',
    title: 'College Application Consulting',
    target: '고등학교 11학년',
    description: '대학 리스트 선정부터 에세이까지, 합격을 위한 전 과정을 함께합니다.',
    items: ['지원 대학 리스트 선정', 'Common App 지원서 검토', 'Personal Statement + Supplement Essay 작성 및 피드백'],
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
    items: ['지원 학교 리스트 작성', '지원서 전반 검토', '학생 에세이 + Parent Essay 작성 및 피드백'],
  },
]

export default function DesignB() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/design-preview" className="bg-brand-dark text-brand-cream text-xs px-3 py-2 rounded">← 목록</Link>
        <span className="bg-brand-burgundy text-brand-cream text-xs px-3 py-2 rounded font-bold">B — 아코디언</span>
      </div>
      <section className="py-24 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">Services</p>
          <h2 className="font-display text-4xl font-bold text-brand-dark text-center mb-16">How We Help You Get In</h2>
          <div className="divide-y divide-brand-border border border-brand-border rounded-sm overflow-hidden">
            {services.map((s, i) => (
              <div key={s.title}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-brand-cream transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <p className="font-display font-bold text-lg text-brand-dark">{s.title}</p>
                      <p className="text-xs text-brand-rose mt-0.5">{s.target}</p>
                    </div>
                  </div>
                  <span className="text-brand-burgundy text-2xl">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div className="px-8 pb-8 bg-brand-cream border-t border-brand-border">
                    <p className="text-sm text-brand-dark/70 leading-relaxed mt-5 mb-5">{s.description}</p>
                    <ul className="space-y-3">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-brand-dark/80">
                          <span className="text-brand-burgundy font-bold mt-0.5">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
