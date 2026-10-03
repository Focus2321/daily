import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

import { Headline, Reveal, ease } from '../components/Reveal'
import { useSequence, useTypewriter } from '../components/hooks'

const results = ['Cable fly', 'Cable fly, single arm', 'Cable fly, low to high', 'Cable crossover', 'Cable fly, seated']

function EmptyBox({ label }: { label: string }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-[10.5px] text-faint">{label}</span>
      <span className="h-8 w-14 rounded-lg border border-dashed border-line bg-surface/60" />
    </span>
  )
}

function Builder() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const { typed, done } = useTypewriter('Push day v4 final', inView, 16)
  const step = useSequence(done, [400, 700, 500])
  const search = useTypewriter('cable f', step >= 2, 10)

  return (
    <div ref={ref} className="relative rounded-[28px] border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold">New workout</span>
        <span className="text-[12.5px] text-muted">Step 3 of 12</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
        <motion.div
          className="h-full rounded-full bg-ink/70"
          initial={{ width: '0%' }}
          animate={inView ? { width: '25%' } : {}}
          transition={{ duration: 1.2, ease }}
        />
      </div>

      <label className="mt-6 block text-[11.5px] text-muted">Workout name</label>
      <div className="mt-1.5 flex h-11 items-center rounded-xl border border-ink/80 px-3.5 text-[15px]">
        {typed}
        {!done && <span className="caret" />}
      </div>

      <div className="mt-6 text-[11.5px] text-muted">Exercises</div>
      <div className="mt-2 divide-y divide-line rounded-2xl border border-line">
        {['Bench press', 'Incline dumbbell press'].map((name, i) => (
          <motion.div
            key={name}
            className="flex items-end justify-between gap-3 px-4 py-3"
            initial={{ opacity: 0, x: -12 }}
            animate={step >= 1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: i * 0.15 }}
          >
            <span className="pb-1.5 text-[14px] font-medium">{name}</span>
            <span className="flex gap-2">
              <EmptyBox label="Sets" />
              <EmptyBox label="Reps" />
              <span className="hidden sm:block">
                <EmptyBox label="Rest" />
              </span>
            </span>
          </motion.div>
        ))}
        <div className="relative px-4 py-3">
          <div className="flex h-10 items-center gap-2 rounded-xl bg-surface px-3 text-[14px]">
            <svg viewBox="0 0 16 16" className="size-4 text-faint" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {search.typed ? (
              <span>
                {search.typed}
                <span className="caret" />
              </span>
            ) : (
              <span className="text-faint">Search 1,240 exercises</span>
            )}
          </div>
          <div className="mt-2 space-y-0.5">
            {results.map((r, i) => (
              <motion.div
                key={r}
                className="rounded-lg px-3 py-1.5 text-[13.5px] text-muted"
                initial={{ opacity: 0, y: 6 }}
                animate={search.done ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {r}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-[13px]">
        <span className="text-muted">
          Meals this week <span className="font-medium text-ink">0 of 28 planned</span>
        </span>
        <span className="rounded-full bg-surface px-4 py-2 text-faint">Save and continue</span>
      </div>
    </div>
  )
}

export function Homework() {
  return (
    <section className="py-24 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Headline lines={['Gym apps give', 'you homework.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">
              Most fitness apps open to a blank builder. You pick the exercises, set the reps, plan the rest days and
              choose the meals.
            </p>
            <p className="lead mt-4 max-w-[28rem]">Then you do it again next week.</p>
          </Reveal>
        </div>
        <Reveal y={40}>
          <Builder />
        </Reveal>
      </div>
    </section>
  )
}
