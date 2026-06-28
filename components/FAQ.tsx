'use client'

import { useState } from 'react'
import { faqPageSchema, type FaqItem } from '@/lib/structured-data'

const faqs: FaqItem[] = [
  {
    question: 'What is IVY BLOOM CONSULTING?',
    answer:
      'IVY BLOOM CONSULTING is a US college and boarding school admissions consulting firm founded in 2019. With 15 years of experience, we help Grade 7–11 students — including international students and US residents — build applications that get noticed. We specialize in school list strategy, application positioning, and essay development.',
  },
  {
    question: 'How does online consulting work?',
    answer:
      'All consulting is conducted online via video call (Zoom or similar). After an initial consultation, we schedule regular sessions for school list review, application strategy, and essay feedback. Everything is managed remotely, making it accessible to students anywhere in the world.',
  },
  {
    question: 'What does the consulting process look like step by step?',
    answer:
      'It starts with a consultation request via KakaoTalk or the inquiry form. You will then complete a brief questionnaire so we can review your profile before our first meeting. The initial consultation is 2 hours and covers your background, goals, and school fit. From there, we develop your strategy and begin the application process together.',
  },
  {
    question: 'How much does consulting cost?',
    answer:
      'Pricing depends on the service package — College Application Consulting, Essay Consulting only, or Boarding School Consulting — and the scope of work involved. We provide a detailed quote after the initial consultation, once we understand your specific situation.',
  },
  {
    question: 'What makes IVY BLOOM different from other consultants?',
    answer:
      "We analyze each student's individual strengths, weaknesses, and personality before building a school list or application strategy. Nothing is templated. Our founder personally leads school selection and reviews every application. Essays are written by a specialist writing team — not outsourced generically. We also believe that trust between consultant and family is non-negotiable: if that foundation isn't there, we don't move forward.",
  },
  {
    question: 'Do you work with students outside of Korea?',
    answer:
      'Yes. Our clients include international students (F-1 visa applicants) and US permanent residents or citizens. Consulting is conducted entirely online, so location is not a barrier. We have experience with students across the US, Asia, and other regions.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-brand-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          FAQ
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-brand-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left gap-4"
              >
                <span className="font-medium text-brand-dark text-sm sm:text-base">
                  {faq.question}
                </span>
                <span className="text-brand-burgundy text-xl flex-shrink-0">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <p className="pb-5 text-sm text-brand-dark/70 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
