import { animate, AnimatePresence, motion, useAnimate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { ais } from '../assets'
import { Phone } from '../components/Phone'
import { Headline, Reveal } from '../components/Reveal'
import { useCycle } from '../components/hooks'

const notes = [
  'Added Chest & Triceps for Monday',
  'Planned 28 meals for this week',
  'Swapped dips for close grip bench',
  'Moved legs to Thursday',
  'Bench goes up to 85 kg next week',
  'Added a 30 min walk on Wednesday',
]

type Point = [number, number]
type Layout = {
  w: number
  h: number
  phone: { x: number; y: number; width: number }
  tile: number
  tiles: Point[]
  ends: Point[]
  toastTop: number
}

// Coordinates are in viewBox units. The stage keeps the same aspect ratio, so they map 1:1.
const wide: Layout = {
  w: 160,
  h: 110,
  phone: { x: 80, y: 55, width: 40 },
  tile: 17,
  tiles: [
    [22, 20],
    [11, 55],
    [22, 90],
    [138, 20],
    [149, 55],
    [138, 90],
  ],
  ends: [
    [60, 38],
    [60, 55],
    [60, 72],
    [100, 38],
    [100, 55],
    [100, 72],
  ],
  toastTop: 20,
}

const tall: Layout = {
  w: 90,
  h: 124,
  phone: { x: 45, y: 62, width: 36 },
  tile: 13,
  tiles: [
    [12, 12],
    [45, 9],
    [78, 12],
    [12, 112],
    [45, 115],
    [78, 112],
  ],
  ends: [
    [33, 25],
    [45, 24],
    [57, 25],
    [33, 99],
    [45, 100],
    [57, 99],
  ],
  toastTop: 30,
}

const curve = ([x1, y1]: Point, [x2, y2]: Point, vertical: boolean) => {
  if (vertical) {
    const my = (y1 + y2) / 2
    return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
  }
  const mx = (x1 + x2) / 2
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
}

function useWide() {
  const [isWide, setWide] = useState(() => matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return isWide
}

/** A bright dot that runs along the path once, from the AI to the phone. */
function Comet({ d }: { d: string }) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  useEffect(() => {
    const path = pathRef.current
    const dot = dotRef.current
    if (!path || !dot) return
    const len = path.getTotalLength()
    const controls = animate(0, 1, {
      duration: 0.9,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (t) => {
        const p = path.getPointAtLength(t * len)
        dot.setAttribute('cx', String(p.x))
        dot.setAttribute('cy', String(p.y))
      },
    })
    return () => controls.stop()
  }, [d])

  return (
    <g>
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="#D7361F"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: [1, 1, 0.35] }}
        transition={{ pathLength: { duration: 0.9, ease: [0.45, 0, 0.2, 1] }, opacity: { duration: 2.4, times: [0, 0.5, 1] } }}
      />
      <circle ref={dotRef} r={1.4} fill="#D7361F" stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </g>
  )
}

function Stage() {
  const isWide = useWide()
  const L = isWide ? wide : tall
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const active = useCycle(ais.length, 2800, inView)
  const [delivered, setDelivered] = useState(-1)
  const [phoneRef, animatePhone] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    if (delivered < 0 || !phoneRef.current) return
    animatePhone(phoneRef.current, { scale: [1, 1.025, 1] }, { duration: 0.5 })
  }, [delivered, animatePhone, phoneRef])

  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => setDelivered(active), 850)
    return () => clearTimeout(id)
  }, [active, inView])

  const paths = L.tiles.map((t, i) => curve(t, L.ends[i], !isWide))
  const pct = (v: number, of: number) => `${(v / of) * 100}%`

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[900px]" style={{ aspectRatio: `${L.w} / ${L.h}` }}>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[58%] rounded-full border border-dashed border-ink/12"
        style={{ translate: '-50% -50%', animation: 'spin-slow 80s linear infinite' }}
      />

      <svg viewBox={`0 0 ${L.w} ${L.h}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {paths.map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#111" strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle r={0.7} fill="#111" opacity={0.3}>
              <animateMotion dur="3.2s" repeatCount="indefinite" begin={`${i * 0.53}s`} path={d} />
            </circle>
          </g>
        ))}
        {inView && <Comet key={`${active}-${isWide}`} d={paths[active]} />}
      </svg>

      <div
        className="absolute"
        style={{
          left: pct(L.phone.x, L.w),
          top: pct(L.phone.y, L.h),
          width: pct(L.phone.width, L.w),
          translate: '-50% -50%',
        }}
      >
        <div ref={phoneRef}>
          <Phone screen="week" />
        </div>
      </div>

      <div
        className="absolute left-1/2 z-10 w-[min(300px,86%)] -translate-x-1/2"
        style={{ top: pct(L.toastTop, L.h) }}
      >
        <AnimatePresence mode="wait">
          {delivered >= 0 && (
            <motion.div
              key={delivered}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 shadow-card"
              initial={{ opacity: 0, y: -18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface">
                <img src={ais[delivered].logo} alt="" className="size-5 brightness-0" />
              </span>
              <span className="min-w-0 text-[13px] leading-tight">
                <span className="flex items-center justify-between font-semibold text-ink">
                  {ais[delivered].name}
                  <span className="text-[11px] font-normal text-faint">now</span>
                </span>
                <span className="text-muted">{notes[delivered]}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {ais.map((ai, i) => {
        const [x, y] = L.tiles[i]
        const on = i === active && inView
        return (
          <div
            key={ai.name}
            className="absolute"
            style={{ left: pct(x, L.w), top: pct(y, L.h), width: pct(L.tile, L.w), translate: '-50% -50%' }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.6 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {on && (
                <motion.span
                  key={active}
                  className="absolute inset-0 rounded-[26%] border-2 border-red"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: 1, ease: 'easeOut' }}
                />
              )}
              <motion.div
                className="relative grid aspect-square place-items-center rounded-[26%] bg-white"
                animate={{
                  scale: on ? 1.08 : 1,
                  boxShadow: on
                    ? '0 0 0 2px rgba(215,54,31,1), 0 18px 36px -16px rgba(17,17,17,0.35)'
                    : '0 0 0 1px rgba(17,17,17,0.08), 0 14px 30px -16px rgba(17,17,17,0.28)',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <img src={ai.logo} alt={ai.name} className="w-[52%] brightness-0" />
              </motion.div>
              <span
                className={`absolute top-full left-1/2 mt-2 -translate-x-1/2 text-[11px] whitespace-nowrap transition-colors md:text-[12.5px] ${
                  on ? 'text-ink' : 'text-faint'
                }`}
              >
                {ai.name}
              </span>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

const steps = [
  { title: 'Add the Daily connector', body: "Open your AI's connector settings and add the Daily MCP server." },
  { title: 'Sign in once', body: 'Your AI can see your plan and your logs. Nothing else on your phone.' },
  { title: 'Ask in plain words', body: 'Your AI writes the week. It lands in Daily a moment later.' },
]

export function Connect() {
  return (
    <section id="connect" className="relative overflow-hidden py-20 md:py-36">
      <div className="container-page">
        <div className="mx-auto max-w-[46rem] text-center">
          <Headline
            lines={['Bring your AI.', { text: 'Connect it to Daily.', className: 'text-red' }]}
            className="text-[clamp(2.6rem,6.4vw,5rem)]"
          />
          <Reveal delay={0.15}>
            <p className="lead mx-auto mt-7 max-w-[36rem]">
              Daily runs an MCP server, the open standard assistants use to connect to apps. Add it to Claude, ChatGPT,
              Gemini or any assistant that supports MCP. Your AI can then write your plan and read every set you log.
            </p>
          </Reveal>
        </div>

        <Reveal y={40} className="mt-16 md:mt-20">
          <Stage />
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line md:mt-24 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="bg-white p-7 md:p-8">
              <span className="font-mono text-[13px] text-red">0{i + 1}</span>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
