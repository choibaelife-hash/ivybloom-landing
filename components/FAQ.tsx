'use client'

import { useState } from 'react'
import { faqPageSchema, type FaqItem } from '@/lib/structured-data'
import ScrollReveal from '@/components/ScrollReveal'

const faqs: FaqItem[] = [
  {
    "question": "Can I receive consulting entirely online?",
    "answer": "Yes. We work with students and families worldwide, with all consultations conducted in English via Zoom or a similar video platform. From school selection and essay development to application review and post-submission follow-up, our services are delivered entirely online—wherever you are based."
  },
  {
    "question": "What does the consulting process look like from start to finish?",
    "answer": "Start by contacting us through our inquiry form or KakaoTalk. Before your first meeting, we ask you to complete a brief student profile questionnaire so we can better understand the student’s background and your family’s goals.\n\nDuring the two-hour initial consultation, we discuss the student’s academic preparation, test scores, extracurricular involvement, and school preferences. Together, we identify priorities and recommend the service that best fits your needs."
  },
  {
    "question": "My child's grades aren't strong — can you still help?",
    "answer": "Yes. At IVY BLOOM, a transcript is never the whole story. One of our students had a neurological condition that affected his academic performance through middle school — he was accepted to all 10 universities he applied to. Another had transferred schools two times, including one withdrawal and one expulsion, and was admitted well above initial expectations. We find the competitive edge in what a transcript cannot show: character, story, and school fit."
  },
  {
    "question": "When should we start preparing for U.S. college admissions?",
    "answer": "We recommend beginning personalized admissions planning in Grade 10, ideally before the start of Grade 11. This gives students time to make thoughtful academic choices, plan for testing, deepen meaningful activities, and explore colleges that fit their interests and goals.\n\nAs students move through Grade 11, the focus can gradually shift toward refining their college list, reflecting on their experiences, and preparing for essay development and the application process.\n\nStarting early is not about adding more to a student’s schedule. It is about setting clear priorities and allowing room for genuine growth. If you are starting later, we can help you focus on the most important next steps based on your timeline and current preparation."
  },
  {
    "question": "How much do your consulting services cost?",
    "answer": "Pricing varies depending on the service selected and the level of support needed. Initial inquiries are free—we can explain our services and help you identify the option that best fits your family’s needs.\n\nDetailed consultations involving a review of your student’s profile and personalized strategic advice are paid services. The consultation fee and scope are explained before booking.\n\nFor comprehensive application consulting, we provide a personalized quote after the paid consultation, based on your student’s profile and the proposed scope of support—from school selection and essay guidance to application review, submission, and post-submission follow-up.\n\nPlease contact us by phone to learn more about our services and pricing."
  },
  {
    "question": "When should we start preparing for U.S. boarding school applications?",
    "answer": "We recommend beginning the planning process at least a year before your intended enrollment date. For Grade 9 entry, starting in Grade 7 or during the summer before Grade 8 allows time for thoughtful school exploration and preparation.\n\nEarly planning is not simply about building a stronger application. It gives your family time to consider the academic environment, residential community, and level of support that would best suit your student—and to reflect on their readiness for boarding school life.\n\nWe help you establish a personalized timeline covering school selection, any required testing, student essays, parent statements, and interview preparation. The schedule is tailored to your student’s intended entry grade and each school’s requirements.\n\nIf you are starting later, we can help you assess the available options and prioritize your next steps."
  }
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
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs text-brand-rose tracking-[3px] uppercase mb-3">
            FAQ
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <div className="divide-y divide-brand-border">
          {list.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
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
                <p className="pb-5 text-sm text-brand-dark/70 leading-relaxed whitespace-pre-line">
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
