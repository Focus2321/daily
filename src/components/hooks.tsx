import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Types `text` out once `active` turns true. Pauses a little after punctuation. */
export function useTypewriter(text: string, active: boolean, cps = 38) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active || reduce || n >= text.length) return
    const prev = text[n - 1] ?? ''
    const delay = 1000 / cps + (/[.,?]/.test(prev) ? 180 : 0) + Math.random() * 30
    const id = setTimeout(() => setN(n + 1), delay)
    return () => clearTimeout(id)
  }, [active, reduce, n, text, cps])

  const count = reduce && active ? text.length : n
  return { typed: text.slice(0, count), done: count >= text.length }
}

/** Steps through 0..steps once `active`, waiting `gaps[i]` ms before each step. */
export function useSequence(active: boolean, gaps: number[]) {
  const [step, setStep] = useState(0)
  const gapsRef = useRef(gaps)
  useEffect(() => {
    const all = gapsRef.current
    if (!active || step >= all.length) return
    const id = setTimeout(() => setStep(step + 1), all[step])
    return () => clearTimeout(id)
  }, [active, step])
  return step
}

/** Cycles 0..count-1 every `ms` while `active`. */
export function useCycle(count: number, ms: number, active = true) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => clearInterval(id)
  }, [count, ms, active])
  return i
}

const half = (v: number) => {
  const r = Math.round(v * 2) / 2
  return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

type CountUpProps = { from: number; to: number; active: boolean; prefix?: string; delay?: number }

/** Counts in half steps, the way plates go on a bar. */
export function CountUp({ from, to, active, prefix = '', delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!active) return
    const controls = animate(from, to, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + half(v)
      },
    })
    return () => controls.stop()
  }, [active, from, to, prefix, delay])
  return <span ref={ref}>{prefix + half(from)}</span>
}
