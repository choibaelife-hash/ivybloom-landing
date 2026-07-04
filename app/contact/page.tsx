'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputCls =
  'w-full border border-brand-border bg-white rounded-sm px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:border-brand-burgundy transition-colors'
const labelCls = 'block text-[11px] text-brand-dark/50 uppercase tracking-wider mb-1'

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
      <main className="pt-16 min-h-screen flex flex-col md:flex-row">

        {/* 왼쪽: 이미지 패널 */}
        <div className="relative md:w-[45%] lg:w-1/2 h-64 md:h-auto flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1600&q=80"
            alt="IVY BLOOM CONSULTING — US college admissions"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-brand-dark/55" />

          {/* 이미지 위 텍스트 */}
          <div className="relative z-10 h-full flex flex-col justify-end px-10 pb-12 hidden md:flex">
            <p className="text-brand-rose text-[10px] tracking-[3px] uppercase mb-4">Get In Touch</p>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-brand-cream leading-snug mb-5">
              Book a<br />Consultation
            </h1>
            <p className="text-brand-cream/60 text-sm leading-relaxed mb-10 max-w-xs">
              Tell us about your student and we&apos;ll get back to you within one business day.
            </p>

            <div className="space-y-4 mb-10">
              <div>
                <p className="text-brand-rose text-[10px] uppercase tracking-widest mb-0.5">Phone</p>
                <p className="text-brand-cream/80 text-sm">+82-10-7188-8111</p>
              </div>
              <div>
                <p className="text-brand-rose text-[10px] uppercase tracking-widest mb-0.5">Email</p>
                <a
                  href="mailto:ivybloom.consulting@gmail.com"
                  className="text-brand-cream/80 text-sm hover:text-brand-rose transition-colors"
                >
                  ivybloom.consulting@gmail.com
                </a>
              </div>
            </div>

          </div>

          {/* 모바일: 이미지 위 짧은 헤더 */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 md:hidden">
            <p className="text-brand-rose text-[10px] tracking-[3px] uppercase mb-3">Get In Touch</p>
            <h1 className="font-display text-3xl font-bold text-brand-cream">Book a Consultation</h1>
          </div>
        </div>

        {/* 오른쪽: 폼 */}
        <div className="flex-1 bg-brand-cream flex items-center justify-center px-8 sm:px-12 py-14">
          <div className="w-full max-w-lg">
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-8">Send a Message</h2>

            {status === 'sent' ? (
              <div className="bg-white border border-brand-border rounded-sm p-8 text-center">
                <p className="font-display text-lg font-bold text-brand-dark mb-2">Message Sent</p>
                <p className="text-brand-dark/60 text-sm">We will get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input name="email" type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Current School *</label>
                    <input name="school" required className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Current Grade *</label>
                    <select name="grade" required className={inputCls}>
                      <option value="">Select</option>
                      <option value="7th">7th Grade</option>
                      <option value="8th">8th Grade</option>
                      <option value="9th">9th Grade</option>
                      <option value="10th">10th Grade</option>
                      <option value="11th">11th Grade</option>
                      <option value="12th">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Student&apos;s Cell Phone *</label>
                    <input name="student_phone" type="tel" required className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Parent&apos;s Name *</label>
                    <input name="parent_name" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Parent&apos;s Cell Phone *</label>
                    <input name="parent_phone" type="tel" required className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Service Interest</label>
                  <select name="service" className={inputCls}>
                    <option value="">Select</option>
                    <option value="boarding">U.S. Boarding School Admission Consulting</option>
                    <option value="junior">Junior Consulting</option>
                    <option value="college">College Admission Consulting</option>
                    <option value="essay">College Essay Consulting</option>
                    <option value="graduate">Graduate School Consulting</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Additional Questions</label>
                  <textarea name="message" rows={4} className={inputCls + ' resize-none'} />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-burgundy text-brand-cream py-3 rounded-sm text-sm font-semibold tracking-wide hover:bg-brand-dark transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
