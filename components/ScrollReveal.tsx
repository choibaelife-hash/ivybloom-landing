'use client'

import { useEffect, useRef, useState } from 'react'

type Direction = 'up' | 'left' | 'right'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  stagger?: boolean
  className?: string
}

function initialTransform(dir: Direction) {
  if (dir === 'left')  return 'translateX(-36px)'
  if (dir === 'right') return 'translateX(36px)'
  return 'translateY(28px)'
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  stagger = false,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (stagger) {
    return (
      <div ref={ref} className={`${visible ? 'is-revealed' : ''} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : initialTransform(direction),
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
