'use client'

import { useState } from 'react'
import { faqPageSchema, type FaqItem } from '@/lib/structured-data'

const faqs: FaqItem[] = [
  {
    question: 'What is IVY BLOOM CONSULTING?',
    answer:
      'IVY BLOOM CONSULTING is a US college and boarding school admissions consulting firm specializing in Korean-American students. We provide personalized strategy, essay coaching, and end-to-end application support.',
  },
  {
    question: 'How does the consulting process work?',
    answer:
      'We start with a free consultation to understand your goals and background. From there, we build a customized school list, develop your application narrative, coach you through essays, and support you through submission and decision.',
  },
  {
    question: 'How much does IVY BLOOM CONSULTING cost?',
    answer:
      'Pricing varies by service package and level of support. Please reach out via KakaoTalk for a personalized quote.',
  },
  {
    question: 'What makes IVY BLOOM different from other consultants?',
    answer:
      'We focus exclusively on Korean-American students and understand the unique challenges and strengths of this background. Every student receives personalized attention — we do not use generic templates.',
  },
  {
    question: 'Do you offer boarding school consulting?',
    answer:
      'Yes. We support applications to top US boarding schools including school selection, essay guidance, and interview preparation.',
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
