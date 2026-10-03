import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

import { ais } from '../assets'
import { Headline, Reveal, ease } from '../components/Reveal'
import { CountUp, useTypewriter } from '../components/hooks'

const logged = [
  { name: 'Bench press', weight: '82.5 kg', reps: '7, 7, 8', effort: 'Easy' },
  { name: 'Cable fly', weight: '20 kg', reps: '15, 13, 12', effort: 'Hard', hard: true },
  { name: 'Weighted dips', weight: '+10 kg', reps: '10, 10, 10', effort: 'Solid' },
]

const reply =
  "Bench felt easy, so it's 85 kg next week. Cable fly stays at 20 kg until you get 15 reps on all three sets. Dips go up to +12.5 kg."

function Cards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-160px' })
  const { typed, done } = useTypewriter(reply, inView, 55)

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="rounded-[26px] bg-white p-5 text-ink shadow-card sm:p-6">
        <div className="text-[14px] font-semibold">What you logged on Monday</div>
        <div className="mt-3 divide-y divide-line">
          {logged.map((row, i) => (
            <motion.div
              key={row.name}
              className="flex items-center gap-3 py-3.5"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.12 }}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">{row.name}</span>
                <span className="text-[13px] text-muted tabular-nums">
                  {row.weight} × {row.reps}
                </span>
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[12.5px] font-medium ${
                  row.hard ? 'bg-red-soft text-red' : 'bg-surface text-muted'
                }`}
              >
                {row.effort}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[26px] bg-ink p-5 text-white shadow-card sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white">
            <img src={ais[0].logo} alt="" className="size-[18px]" />
          </span>
          <span className="text-[14px] font-semibold">Next Monday&apos;s plan</span>
        </div>
        <p className="mt-4 min-h-[4.8em] text-[15.5px] leading-relaxed text-white/80">
          {typed}
          {inView && !done && <span className="caret" />}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { name: 'Bench', from: 82.5, to: 85, unit: 'kg' },
            { name: 'Cable fly', from: 20, to: 20, unit: 'kg' },
            { name: 'Dips', from: 10, to: 12.5, unit: 'kg', prefix: '+' },
          ].map((s, i) => (
            <motion.div
              key={s.name}
              className="rounded-2xl bg-white/[0.07] p-3"
              initial={{ opacity: 0, y: 12 }}
              animate={done ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <div className="text-[11.5px] text-white/50">{s.name}</div>
              <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] tabular-nums">
                <CountUp from={s.from} to={s.to} active={done} prefix={s.prefix} delay={0.2 + i * 0.1} />
                <span className="ml-1 text-[12px] font-normal text-white/50">{s.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Adjusts() {
  return (
    <section className="bg-red py-24 text-white md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Headline lines={['Next week,', 'it adjusts.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[28rem] text-[1.125rem] leading-relaxed text-white/80">
              Your AI reads every set you logged. If a set felt easy, the weight goes up. If your shoulder hurt, it swaps
              the move.
            </p>
            <p className="mt-4 max-w-[28rem] text-[1.125rem] leading-relaxed text-white/80">
              No more planning. You show up and lift.
            </p>
          </Reveal>
        </div>
        <Reveal y={40}>
          <Cards />
        </Reveal>
      </div>
    </section>
  )
}
