'use client'

import { useState } from 'react'
import { faqPageSchema, type FaqItem } from '@/lib/structured-data'

const faqs: FaqItem[] = [
  {
    question: 'Can I receive consulting entirely online?',
    answer:
      'Yes. All sessions at IVY BLOOM are conducted online via video call (Zoom or similar). School list review, essay development, and application support are all handled remotely — so students in the US, Canada, Korea, or anywhere in Asia can work with us without any barriers.',
  },
  {
    question: 'What does the consulting process look like from start to finish?',
    answer:
      'It begins with a consultation request via KakaoTalk or our inquiry form. Before the first meeting, you will complete a brief student profile questionnaire. The initial consultation is 2 hours and covers your academic background, extracurricular activities, and target schools. From there, we build a personalized strategy and guide you through every stage — school list, essays, and final submission.',
  },
  {
    question: 'My child\'s grades aren\'t strong — can you still help?',
    answer:
      'Yes. At IVY BLOOM, a transcript is never the whole story. One of our students had a neurological condition that affected her academic performance through middle school — she was accepted to all 10 universities she applied to. Another had transferred schools four times, including one withdrawal and one expulsion, and was admitted well above initial expectations. We find the competitive edge in what a transcript cannot show: character, story, and school fit.',
  },
  {
    question: 'When should we start preparing for US college admissions?',
    answer:
      'We recommend starting strategy work in Grade 10, or by early Grade 11 at the latest. By the time Grade 11 arrives, students need to handle school list building, Common App setup, and essay writing all at once — which leaves very little room. Starting in Grade 10 allows time for activity positioning and narrative development before the application season begins.',
  },
  {
    question: 'How much does consulting cost?',
    answer:
      'The initial consultation (2 hours) is ₩200,000. Application consulting sessions are ₩300,000. Full package pricing — which covers the complete school list, essay, and application process — is provided after the initial consultation once we understand your student\'s profile and the scope of work involved.',
  },
  {
    question: 'When should we start preparing for US boarding school applications?',
    answer:
      'Most boarding school applications target Grade 9 or Grade 10 entry. For Grade 9 entry, we recommend starting in Grades 7–8. Top schools like Exeter, Andover, and Choate are highly competitive, and earlier preparation gives your student more time to build a compelling, well-rounded application. We cover the full process — school list, student essays, parent essays, and interview preparation.',
  },
]

export default function FAQ({ items }: { items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const list = items ?? faqs

  return (
    <section className="py-20 bg-brand-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(list)) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3 text-center">
          FAQ
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-brand-border">
          {list.map((faq, i) => (
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
