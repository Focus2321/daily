import type { ReactNode } from 'react'

import { ais } from '../assets'

export function Mark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#D7361F" />
      <path
        d="M10 9h6.2c4.6 0 7.8 2.9 7.8 7s-3.2 7-7.8 7H10V9zm4 3.4v7.2h2c2.3 0 3.8-1.4 3.8-3.6s-1.5-3.6-3.8-3.6h-2z"
        fill="#fff"
      />
    </svg>
  )
}

export function Check({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden>
      <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LogoRow({ size = 'size-9', className = '' }: { size?: string; className?: string }) {
  return (
    <div className={`flex items-center -space-x-1.5 ${className}`}>
      {ais.map((ai) => (
        <span
          key={ai.name}
          className={`${size} grid place-items-center rounded-[28%] bg-white shadow-[0_2px_8px_-2px_rgb(0_0_0/0.18)] ring-1 ring-black/5`}
          title={ai.name}
        >
          <img src={ai.logo} alt={ai.name} className="size-[56%]" />
        </span>
      ))}
    </div>
  )
}

type ButtonProps = { href: string; children: ReactNode; variant?: 'dark' | 'light' | 'ghost' }

export function Button({ href, children, variant = 'dark' }: ButtonProps) {
  const styles = {
    dark: 'bg-ink text-white hover:bg-black',
    light: 'bg-white text-ink hover:bg-white/90',
    ghost: 'border border-line bg-white text-ink hover:border-ink/30',
  }[variant]
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors ${styles}`}
    >
      {children}
    </a>
  )
}

export function Arrow({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
