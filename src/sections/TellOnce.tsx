import { AnimatePresence, motion, useInView } from 'motion/react'
import { useRef } from 'react'

import { ais } from '../assets'
import { Phone } from '../components/Phone'
import { Headline, Reveal } from '../components/Reveal'
import { WeekScreen, plan } from '../components/WeekScreen'
import { useSequence, useTypewriter } from '../components/hooks'

const prompt =
  'Build me a 4 day split for size. 45 minutes max, my left shoulder is sore. High protein meals that take under 20 minutes to cook.'

function Demo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-180px' })
  const { typed, done } = useTypewriter(prompt, inView, 45)
  // 1 is "thinking", 2..8 fill the seven days, 9 shows the reply.
  const step = useSequence(done, [500, 900, 260, 260, 260, 260, 260, 260, 500])
  const filled = Math.max(0, Math.min(7, step - 1))

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[36px] bg-red px-5 pt-8 pb-0 sm:px-10 sm:pt-10">
      <div className="relative z-10 max-w-[25rem] rounded-[22px] bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-[12.5px] text-muted">
          <span className="size-6 rounded-full bg-surface" />
          You
        </div>
        <p className="mt-3 min-h-[6.2em] text-[15px] leading-relaxed">
          {typed}
          {!done && <span className="caret" />}
        </p>
      </div>

      <div className="relative -mt-6 ml-auto w-[62%] max-w-[300px] translate-y-[8%] sm:-mt-10 sm:mr-[6%]">
        <Phone>
          <WeekScreen ready={plan.map((_, i) => i < filled)} meals={filled === plan.length} />
        </Phone>
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              className="absolute top-[30%] -left-[38%] flex items-center gap-2.5 rounded-full bg-ink py-2 pr-4 pl-2.5 text-[13px] text-white shadow-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={ais[0].logo}
                alt=""
                className="size-5"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              Writing your week
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step >= 9 && (
          <motion.div
            className="absolute bottom-[12%] left-5 z-20 flex items-center gap-3 rounded-2xl bg-ink py-3 pr-5 pl-3 text-white shadow-card sm:left-10"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-white">
              <img src={ais[0].logo} alt="" className="size-5" />
            </span>
            <span className="text-[14px] font-medium">Done. Your week is in Daily.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TellOnce() {
  return (
    <section id="week" className="py-20 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Headline lines={['Tell it once.', 'It writes', 'your week.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">
              Say what you want in plain words. Your goal, how many days you can train, what hurts, what you like to eat.
            </p>
            <p className="lead mt-4 max-w-[28rem]">A minute later, every workout and meal for the week is on your phone.</p>
          </Reveal>
        </div>
        <Reveal y={40}>
          <Demo />
        </Reveal>
      </div>
    </section>
  )
}
