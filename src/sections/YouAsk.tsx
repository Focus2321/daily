import { AnimatePresence, motion, useInView } from 'motion/react'
import { useRef } from 'react'

import { ais } from '../assets'
import { Headline, Reveal } from '../components/Reveal'
import { useSequence } from '../components/hooks'

const messages = [
  { from: 'you', text: 'My left shoulder is sore. What should I train today?' },
  {
    from: 'ai',
    text: 'Go with a pull day. Rows, pulldowns and curls, 3 sets each. Skip anything overhead until the shoulder settles.',
  },
  { from: 'you', text: 'Perfect. Can you put that in my gym app?' },
  { from: 'ai', text: "I can't reach your gym app. You'll have to copy it in yourself.", sad: true },
] as const

// Messages visible and whether the AI is typing, per step.
const shown = [0, 1, 1, 2, 3, 3, 4]
const typingAt = [2, 5]

function Dots() {
  return (
    <span className="flex gap-1 px-1 py-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-faint"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

function Chat() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-160px' })
  const step = useSequence(inView, [300, 700, 1500, 1500, 800, 1700])
  const typing = typingAt.includes(step)

  return (
    <div ref={ref} className="overflow-hidden rounded-[28px] border border-line bg-white shadow-card">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
        <img src={ais[0].logo} alt="" className="size-5" />
        <span className="text-[14px] font-semibold">Chat</span>
        <span className="ml-auto flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </span>
      </div>
      <div className="flex min-h-[380px] flex-col gap-3 p-5 sm:p-6">
        <AnimatePresence initial={false}>
          {messages.slice(0, shown[step]).map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className={
                m.from === 'you'
                  ? 'ml-auto max-w-[78%] rounded-[20px] rounded-br-md bg-ink px-4 py-2.5 text-[15px] leading-snug text-white'
                  : `mr-auto flex max-w-[86%] gap-3 text-[15px] leading-relaxed ${'sad' in m ? 'text-red' : ''}`
              }
              style={{ originX: m.from === 'you' ? 1 : 0 }}
            >
              {m.from === 'ai' && <img src={ais[0].logo} alt="" className="mt-1 size-5 shrink-0" />}
              <span className={'sad' in m ? 'font-medium' : ''}>{m.text}</span>
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="mr-auto flex items-center gap-3"
            >
              <img src={ais[0].logo} alt="" className="size-5" />
              <Dots />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function YouAsk() {
  return (
    <section className="bg-surface py-20 md:py-36">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Headline lines={['You already', 'ask your AI.']} className="text-[clamp(2.6rem,6vw,4.6rem)]" />
          <Reveal delay={0.15}>
            <p className="lead mt-7 max-w-[28rem]">
              You ask it what to train, how to fix your squat, what to eat after the gym. The answers are good.
            </p>
            <p className="lead mt-4 max-w-[28rem]">Then they sit in a chat you never open again.</p>
          </Reveal>
        </div>
        <Reveal y={40}>
          <Chat />
        </Reveal>
      </div>
    </section>
  )
}
