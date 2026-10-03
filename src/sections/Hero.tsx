import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { ais } from '../assets'
import { Arrow, Button, Check, LogoRow } from '../components/Bits'
import { Phone } from '../components/Phone'
import { Headline, ease } from '../components/Reveal'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Less parallax on narrow screens, where the card is small and close to the next section.
  const k = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.35 : 1
  const backY = useTransform(scrollYProgress, [0, 1], [0, -60 * k])
  const frontY = useTransform(scrollYProgress, [0, 1], [0, -160 * k])
  const toastY = useTransform(scrollYProgress, [0, 1], [0, -240 * k])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <section id="top" ref={ref} className="relative pt-24 pb-4 md:pt-36 md:pb-28">
      <div className="container-page grid items-center gap-12 md:gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
        <div>
          <Headline
            as="h1"
            lines={['Your AI is', { text: 'your trainer.', className: 'text-red' }]}
            className="text-[clamp(3.2rem,8.4vw,6.4rem)]"
          />
          <motion.p
            className="lead mt-7 max-w-[30rem]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
          >
            Daily is the gym and meals app on your phone. The AI you already use writes every workout and every meal. You
            show up, eat, and log the set.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
          >
            <Button href="#connect">
              Connect your AI <Arrow />
            </Button>
            <Button href="#week" variant="ghost">
              See a week
            </Button>
          </motion.div>
          <motion.div
            className="mt-10 flex flex-col items-start gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <LogoRow />
            <p className="max-w-[17rem] text-[13.5px] leading-snug text-muted">
              Works with Claude, ChatGPT, Gemini and any assistant that supports MCP.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative aspect-[5/5.4] overflow-hidden rounded-[36px] bg-red"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
        >
          <motion.svg
            viewBox="0 0 400 400"
            className="pointer-events-none absolute -top-[30%] -right-[30%] w-[110%] text-white/12"
            style={{ rotate: ringRotate }}
            aria-hidden
          >
            <circle cx="200" cy="200" r="198" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
          </motion.svg>

          <motion.div className="absolute top-[13%] left-[9%] w-[43%]" style={{ y: backY }}>
            <motion.div
              initial={{ y: 260, rotate: -2 }}
              animate={{ y: 0, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.25 }}
            >
              <Phone screen="week" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-[7%] right-[8%] w-[47%]" style={{ y: frontY }}>
            <motion.div
              initial={{ y: 320 }}
              animate={{ y: 0, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 55, damping: 15, delay: 0.4 }}
            >
              <Phone screen="today" />
            </motion.div>
          </motion.div>

          <motion.div className="absolute bottom-[9%] left-[6%] z-10" style={{ y: toastY }}>
            <motion.div
              className="flex items-center gap-3 rounded-2xl bg-white/95 py-3 pr-5 pl-3 shadow-card backdrop-blur"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 1.3 }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-surface">
                <img src={ais[0].logo} alt="" className="size-5" />
              </span>
              <span className="text-[13px] leading-tight">
                <span className="block font-semibold">Claude</span>
                <span className="text-muted">Added Chest &amp; Triceps for Monday</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute right-[6%] bottom-[22%] z-10 hidden items-center gap-2 rounded-full bg-ink py-2 pr-4 pl-2 text-[13px] text-white shadow-card sm:flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 1.8 }}
          >
            <span className="grid size-6 place-items-center rounded-full bg-red">
              <Check />
            </span>
            Lunch eaten
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
