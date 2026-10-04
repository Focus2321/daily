import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { ais } from '../assets'
import { Arrow, Button } from '../components/Bits'
import { Phone } from '../components/Phone'
import { Headline, Reveal } from '../components/Reveal'

export function Close() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const backY = useTransform(scrollYProgress, [0, 1], [180, 0])
  const frontY = useTransform(scrollYProgress, [0, 1], [280, 0])

  return (
    <section ref={ref} className="py-20 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Headline
            lines={['Stop building', 'workouts.', { text: 'Bring your AI.', className: 'text-red' }]}
            className="text-[clamp(2.8rem,6.6vw,5.2rem)]"
          />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">TrainPrompt is the app on your phone. The AI you already use is the trainer.</p>
          </Reveal>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {ais.map((ai, i) => (
              <motion.span
                key={ai.name}
                className="flex items-center gap-2 rounded-full border border-line bg-white py-2 pr-4 pl-2.5 text-[14px] font-medium"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 + i * 0.06 }}
              >
                <img src={ai.logo} alt="" className="size-5" />
                {ai.name}
              </motion.span>
            ))}
          </div>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-5">
            <Button href="#connect">
              How connecting works <Arrow />
            </Button>
            <span className="text-[14px] text-muted">TrainPrompt is in early access. The app is coming soon.</span>
          </Reveal>
        </div>

        <Reveal y={40}>
          <div className="relative aspect-[1/1.05] overflow-hidden rounded-[36px] bg-red">
            <motion.div className="absolute top-[12%] left-[9%] w-[42%] -rotate-4" style={{ y: backY }}>
              <Phone screen="week" />
            </motion.div>
            <motion.div className="absolute top-[6%] right-[8%] w-[46%] rotate-3" style={{ y: frontY }}>
              <Phone screen="exercise" />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
