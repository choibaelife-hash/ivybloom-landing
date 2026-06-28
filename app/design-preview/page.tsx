import Link from 'next/link'

const options = [
  { href: '/design-preview/a', label: 'A', desc: '카드 3개 나열' },
  { href: '/design-preview/b', label: 'B', desc: '아코디언 (펼쳐보기)' },
  { href: '/design-preview/c', label: 'C', desc: '탭 방식' },
  { href: '/design-preview/d', label: 'D', desc: '세로 풀 섹션' },
]

export default function DesignPreviewIndex() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Services 디자인 선택</h1>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {options.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="bg-white border-2 border-brand-border hover:border-brand-burgundy rounded-sm p-6 text-center transition-colors group"
          >
            <span className="font-display text-4xl font-bold text-brand-burgundy group-hover:text-brand-dark transition-colors">
              {o.label}
            </span>
            <p className="text-sm text-brand-dark/60 mt-2">{o.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
