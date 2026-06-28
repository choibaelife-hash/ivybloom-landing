'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const KAKAO_URL = 'https://pf.kakao.com/_ybbloom'
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID' // Formspree 대시보드에서 발급받은 ID로 교체

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      setStatus('sent')
      form.reset()
    } else {
      setStatus('error')
    }
  }

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="bg-brand-burgundy py-16 text-center">
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Get In Touch</p>
          <h1 className="font-display text-4xl font-bold text-brand-cream">Free Consultation</h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-14">
          {/* 폼 */}
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Send a Message</h2>

            {status === 'sent' ? (
              <div className="bg-green-50 border border-green-200 rounded-sm p-6 text-center">
                <p className="text-green-700 font-medium">메시지가 전송됐습니다.</p>
                <p className="text-green-600 text-sm mt-1">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-dark/60 uppercase tracking-wider mb-1">
                      이름 / Name *
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-dark/60 uppercase tracking-wider mb-1">
                      이메일 / Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-dark/60 uppercase tracking-wider mb-1">
                      학년 / Grade
                    </label>
                    <select
                      name="grade"
                      className="w-full border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy bg-white"
                    >
                      <option value="">선택</option>
                      {['8th', '9th', '10th', '11th', '12th', 'Gap Year'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-dark/60 uppercase tracking-wider mb-1">
                      관심 서비스
                    </label>
                    <select
                      name="service"
                      className="w-full border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy bg-white"
                    >
                      <option value="">선택</option>
                      <option value="college">College Admissions</option>
                      <option value="boarding">Boarding School</option>
                      <option value="essay">Essay Coaching</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-brand-dark/60 uppercase tracking-wider mb-1">
                    메시지 / Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">전송 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-burgundy text-brand-cream py-3 rounded-sm text-sm font-semibold tracking-wide hover:bg-brand-dark transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? '전송 중...' : '문의 보내기'}
                </button>
              </form>
            )}
          </div>

          {/* 사이드 정보 */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">빠른 상담</h2>
              <p className="text-sm text-brand-dark/70 leading-relaxed mb-6">
                카카오톡으로 연락하시면 더 빠르게 답변드립니다.
              </p>
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FEE500] text-[#3A1D1D] font-semibold text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
              >
                💬 카카오톡 채널 열기
              </a>
            </div>

            <div className="border-t border-brand-border pt-8 space-y-4">
              <div>
                <p className="text-xs text-brand-dark/50 uppercase tracking-wider mb-1">상담 가능 시간</p>
                <p className="text-sm text-brand-dark">평일 10:00 – 18:00 KST</p>
              </div>
              <div>
                <p className="text-xs text-brand-dark/50 uppercase tracking-wider mb-1">전화</p>
                <p className="text-sm text-brand-dark">+1 (570) 677-8811</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
