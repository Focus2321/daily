import { useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'

import { Mark } from '../components/Bits'

const links = [
  { href: '#connect', label: 'Connect your AI' },
  { href: '#week', label: 'Your week' },
  { href: '#meals', label: 'Meals' },
  { href: '#training', label: 'Training' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'border-line bg-white/80 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em]">
          <Mark />
          Daily
        </a>
        <nav className="hidden items-center gap-8 text-[14px] text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#connect"
          className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[14px] font-medium text-white transition-colors hover:bg-black"
        >
          How it works
        </a>
      </div>
    </header>
  )
}
