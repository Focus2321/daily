import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = { children: ReactNode; delay?: number; y?: number; className?: string }

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

type Line = string | { text: string; className?: string }

type HeadlineProps = { lines: Line[]; className?: string; delay?: number; as?: 'h1' | 'h2' }

/** Each line rises out of its own mask. */
export function Headline({ lines, className = '', delay = 0, as = 'h2' }: HeadlineProps) {
  const Tag = as
  return (
    <Tag className={`display ${className}`}>
      {lines.map((line, i) => {
        const { text, className: lineClass = '' } = typeof line === 'string' ? { text: line } : line
        return (
          <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <motion.span
              className={`block ${lineClass}`}
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease, delay: delay + i * 0.09 }}
            >
              {text}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}
