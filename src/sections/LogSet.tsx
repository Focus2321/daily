import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { Phone, maxScroll } from '../components/Phone'
import { Headline, Reveal, ease } from '../components/Reveal'
import { CountUp, useCycle } from '../components/hooks'

const efforts = ['Easy', 'Solid', 'Hard', 'All out']

function SetCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-100px' })
  const effort = useCycle(efforts.length, 1400, inView)

  return (
    <div ref={ref} className="w-[min(300px,74vw)] rounded-[22px] bg-white p-4 text-ink shadow-card">
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Cable fly · Set 2</span>
        <span className="text-[12px] text-muted">20 kg</span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-[44px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
          <CountUp from={0} to={13} active={inView} />
        </span>
        <span className="pb-1.5 text-[14px] text-muted">reps</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {efforts.map((e, i) => (
          <span key={e} className="relative rounded-full py-2 text-center text-[12px] font-medium">
            {i === effort && (
              <motion.span
                layoutId="effort"
                className="absolute inset-0 rounded-full bg-red"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative transition-colors ${i === effort ? 'text-white' : 'text-muted'}`}>{e}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function LogSet() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const exerciseY = useTransform(scrollYProgress, [0.25, 0.8], ['0%', `-${maxScroll('exercise')}%`], { clamp: true })
  const backY = useTransform(scrollYProgress, [0, 1], [70, -50])

  return (
    <section id="training" ref={ref} className="py-20 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Headline lines={['All you type', 'is the set.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">
              Your AI already picked the exercises, sets, reps and rest before you walked in. The weight is filled in from
              your plan.
            </p>
            <p className="lead mt-4 max-w-[28rem]">
              You enter your reps and tap how hard it felt. Easy, solid, hard or all out.
            </p>
          </Reveal>
        </div>
        <Reveal y={40}>
          <div className="relative aspect-[1/1.02] overflow-hidden rounded-[36px] bg-night">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(60% 50% at 70% 30%, rgb(215 54 31 / 0.22), transparent)' }}
            />
            <motion.div className="absolute top-[10%] left-[8%] w-[40%] -rotate-3" style={{ y: backY }}>
              <Phone screen="workout" />
            </motion.div>
            <div className="absolute top-[6%] right-[8%] w-[44%]">
              <Phone screen="exercise" y={exerciseY} />
            </div>
            <motion.div
              className="absolute bottom-[6%] left-[5%] z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
            >
              <SetCard />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
