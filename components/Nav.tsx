'use client'

import Link from 'next/link'
import { useState } from 'react'

const KAKAO_URL = 'https://pf.kakao.com/_pxeZhs'

const links = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/services', label: 'Services' },
  { href: '/articles', label: 'Articles' },
  { href: '/contact',  label: 'Contact'  },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg text-brand-dark tracking-wide">
          IVY BLOOM
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-brand-dark/70 hover:text-brand-burgundy transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-burgundy text-brand-cream text-sm px-5 py-2 rounded hover:bg-brand-dark transition-colors"
          >
            Free Consultation
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brand-dark"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-cream border-t border-brand-border px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-brand-dark/70"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-burgundy text-brand-cream text-sm px-5 py-2 rounded text-center"
          >
            Free Consultation
          </a>
        </div>
      )}
    </header>
  )
}
