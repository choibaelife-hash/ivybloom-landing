'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const CARD_W = 300
const GAP    = 24
const SLOT   = CARD_W + GAP

const CATEGORY_LABELS: Record<string, string> = {
  college:  'College Admissions',
  boarding: 'Boarding School',
  essay:    'Essay',
  sat:      'SAT / ACT',
  other:    'Other',
}

export type SliderPost = {
  _id: string
  title: string
  slug: string
  publishedAt: string
  category: string
  imageUrl?: string
}

export default function ArticlesSliderClient({ posts }: { posts: SliderPost[] }) {
  const N      = posts.length
  const cards  = [...posts, ...posts, ...posts]

  const [idx,      setIdx]      = useState(N)
  const [animated, setAnimated] = useState(true)
  const [paused,   setPaused]   = useState(false)
  const [shown,    setShown]    = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const tooHigh = idx >= N * 2
    const tooLow  = idx < N
    if (!tooHigh && !tooLow) return
    const t = setTimeout(() => {
      setAnimated(false)
      setIdx(i => (tooHigh ? i - N : i + N))
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)))
    }, 420)
    return () => clearTimeout(t)
  }, [idx, N])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setAnimated(true)
      setIdx(i => i + 1)
    }, 4000)
    return () => clearInterval(t)
  }, [paused])

  const move     = (dir: 1 | -1) => { setAnimated(true); setIdx(i => i + dir) }
  const dotActive = ((idx % N) + N) % N

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* 헤더 */}
        <div
          className="text-center mb-14"
          style={{
            opacity:   shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <p className="text-brand-rose text-xs tracking-[3px] uppercase mb-3">Insights & Guides</p>
          <h2 className="font-display text-3xl font-bold text-brand-dark">
            From the IVY BLOOM Blog
          </h2>
        </div>

        {/* 슬라이더 행 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* 이전 */}
          <button
            onClick={() => move(-1)}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-burgundy hover:bg-brand-dark transition-colors flex items-center justify-center"
            style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.6s ease-out 0.3s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* 트랙 */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '28px 0' }}>
            <div
              style={{
                display: 'flex',
                gap: `${GAP}px`,
                transform: `translateX(calc(50% - ${idx * SLOT + CARD_W / 2}px))`,
                transition: animated ? 'transform 0.4s ease' : 'none',
              }}
            >
              {cards.map((post, i) => {
                const offset    = i - idx
                const absOffset = Math.abs(offset)
                const scale     = absOffset === 0 ? 1 : 0.92
                const opacity   = absOffset === 0 ? 1 : absOffset === 1 ? 0.6 : 0

                return (
                  <Link
                    key={`${post._id}-${Math.floor(i / N)}`}
                    href={`/articles/${post.slug}`}
                    style={{
                      width:         `${CARD_W}px`,
                      flexShrink:    0,
                      borderRadius:  '8px',
                      overflow:      'hidden',
                      textDecoration:'none',
                      display:       'block',
                      backgroundColor: '#ffffff',
                      boxShadow: absOffset === 0
                        ? '0 12px 40px rgba(61,26,36,0.14)'
                        : '0 4px 16px rgba(61,26,36,0.07)',
                      transform:    `scale(${scale})`,
                      opacity,
                      transition:   'transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease',
                      transformOrigin: 'center top',
                      pointerEvents: absOffset === 0 ? 'auto' : 'none',
                    }}
                  >
                    {/* 썸네일 — 1:1 비율 */}
                    <div className="relative w-full h-[300px] bg-brand-cream overflow-hidden">
                      {post.imageUrl ? (
                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy/15 to-brand-rose/20 flex items-center justify-center">
                          <p className="font-display italic text-4xl font-bold text-brand-burgundy/20">
                            IVY
                          </p>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-brand-burgundy rounded-full px-3 py-1">
                        <p className="text-brand-cream text-[10px] font-bold tracking-wider">
                          {CATEGORY_LABELS[post.category] ?? 'Article'}
                        </p>
                      </div>
                    </div>

                    {/* 카드 본문 */}
                    <div className="px-4 pt-4 pb-5">
                      <p className="font-display text-[15px] font-bold text-brand-dark leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-brand-dark/40">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </p>
                        <p className="font-display italic text-[11px] font-bold text-brand-rose">
                          IVY BLOOM
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 다음 */}
          <button
            onClick={() => move(1)}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-burgundy hover:bg-brand-dark transition-colors flex items-center justify-center"
            style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.6s ease-out 0.3s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 점 인디케이터 */}
        <div className="flex justify-center gap-2 mt-5">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimated(true); setIdx(N + i) }}
              style={{
                width:           i === dotActive ? '20px' : '8px',
                height:          '8px',
                borderRadius:    '999px',
                backgroundColor: i === dotActive ? '#7B2D3E' : 'rgba(123,45,62,0.25)',
                border:          'none',
                cursor:          'pointer',
                padding:         0,
                transition:      'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* 전체 보기 */}
        <div className="text-center mt-8">
          <Link
            href="/articles"
            className="text-xs text-brand-burgundy font-semibold tracking-wide hover:text-brand-dark transition-colors"
          >
            View All Articles →
          </Link>
        </div>

      </div>
    </section>
  )
}
