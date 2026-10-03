import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { Check } from '../components/Bits'
import { Phone, maxScroll } from '../components/Phone'
import { Headline, Reveal, ease } from '../components/Reveal'
import { useSequence } from '../components/hooks'

const meals = [
  { time: '7:30', name: 'Oats, Greek yogurt and berries' },
  { time: '12:30', name: 'Chicken rice bowl' },
  { time: '16:00', name: 'Protein shake and a banana' },
  { time: '19:30', name: 'Salmon, potatoes and greens' },
]

function Checklist() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const ticked = useSequence(inView, [900, 900])

  return (
    <div ref={ref} className="w-[min(320px,78vw)] rounded-[22px] bg-white p-4 shadow-card">
      <div className="flex items-baseline justify-between px-1 pb-2">
        <span className="text-[14px] font-semibold">Today&apos;s meals</span>
        <span className="text-[12px] text-muted">{ticked} of 4 eaten</span>
      </div>
      {meals.map((m, i) => {
        const on = i < ticked
        return (
          <div key={m.name} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
            <motion.span
              className="grid size-6 shrink-0 place-items-center rounded-full border text-white"
              animate={{
                backgroundColor: on ? '#D7361F' : '#ffffff',
                borderColor: on ? '#D7361F' : '#E2E0DC',
                scale: on ? [1, 1.25, 1] : 1,
              }}
              transition={{ duration: 0.45 }}
            >
              <motion.span initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.5 }}>
                <Check />
              </motion.span>
            </motion.span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-[13.5px] font-medium transition-colors ${on ? 'text-muted line-through decoration-faint' : ''}`}>
                {m.name}
              </span>
            </span>
            <span className="text-[12px] text-faint tabular-nums">{m.time}</span>
          </div>
        )
      })}
    </div>
  )
}

export function Meals() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const mealY = useTransform(scrollYProgress, [0.25, 0.8], ['0%', `-${maxScroll('meal')}%`], { clamp: true })
  const backY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="meals" ref={ref} className="bg-surface py-24 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal y={40} className="order-2 lg:order-1">
          <div className="relative aspect-[1/1.02] overflow-hidden rounded-[36px] bg-red-soft">
            <motion.div className="absolute top-[10%] left-[8%] w-[40%] -rotate-3" style={{ y: backY }}>
              <Phone screen="today" offset={maxScroll('today')} />
            </motion.div>
            <div className="absolute top-[6%] right-[8%] w-[44%]">
              <Phone screen="meal" y={mealY} />
            </div>
            <motion.div
              className="absolute bottom-[6%] left-[5%] z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
            >
              <Checklist />
            </motion.div>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Headline lines={['Meals you', 'check off.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">
              Your AI picks what you eat each day, how much, and how to make it. Lunch today is a chicken rice bowl, 15
              minutes.
            </p>
            <p className="lead mt-4 max-w-[28rem]">You tap it when you&apos;ve eaten. Nothing to weigh, nothing to count.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
