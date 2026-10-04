import { AnimatePresence, motion } from 'motion/react'

import { pt } from './Phone'
import { ease } from './Reveal'

export const plan = [
  { day: 'MON', date: 5, title: 'Chest & Triceps', sub: 'Push A · 6 exercises', today: true },
  { day: 'TUE', date: 6, title: 'Back & Biceps', sub: 'Pull A · 6 exercises' },
  { day: 'WED', date: 7, title: 'Rest', sub: '30 min walk · stretch', rest: true },
  { day: 'THU', date: 8, title: 'Legs', sub: 'Squat focus · 5 exercises' },
  { day: 'FRI', date: 9, title: 'Shoulders & Arms', sub: 'Push B · 6 exercises' },
  { day: 'SAT', date: 10, title: 'Legs', sub: 'Hinge focus · 5 exercises' },
  { day: 'SUN', date: 11, title: 'Rest', sub: 'Full rest · meal prep', rest: true },
]

type WeekScreenProps = {
  /** Which days of `plan` have been written. */
  ready: boolean[]
  /** Days the AI is writing right now. They pulse until they turn ready. */
  writing?: boolean[]
  meals?: boolean
}

/** The Week screen rebuilt in HTML so each day can arrive on its own. */
export function WeekScreen({ ready, writing = [], meals = true }: WeekScreenProps) {
  const workouts = plan.filter((d, i) => ready[i] && !d.rest).length
  const rests = plan.filter((d, i) => ready[i] && d.rest).length
  const stats = [
    ['Workouts', `0/${workouts}`],
    ['Meals eaten', meals ? '0/28' : '–'],
    ['Rest days', String(rests)],
  ]
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink" style={{ padding: `${pt(54)} ${pt(20)} 0` }}>
      <div className="font-medium text-muted" style={{ fontSize: pt(11), letterSpacing: '0.06em' }}>
        OCT 5 – 11 · WEEK 6
      </div>
      <div className="font-semibold" style={{ fontSize: pt(30), letterSpacing: '-0.035em', marginTop: pt(4) }}>
        This week
      </div>
      <div className="flex" style={{ gap: pt(8), marginTop: pt(18) }}>
        {stats.map(([label, value]) => (
          <div key={label} className="flex-1 bg-surface" style={{ borderRadius: pt(14), padding: pt(12) }}>
            <div className="text-muted" style={{ fontSize: pt(10.5) }}>
              {label}
            </div>
            <div className="relative overflow-hidden" style={{ height: pt(26), marginTop: pt(4) }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={value}
                  className="absolute inset-0 font-semibold"
                  style={{ fontSize: pt(20), letterSpacing: '-0.02em' }}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {value}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <div className="font-medium text-muted" style={{ fontSize: pt(11), letterSpacing: '0.06em', marginTop: pt(24) }}>
        PLAN
      </div>
      <div className="flex flex-col" style={{ gap: pt(8), marginTop: pt(10) }}>
        {plan.map((d, i) => {
          const isReady = ready[i]
          const isWriting = writing[i] && !isReady
          return (
            <div
              key={d.day}
              className={`relative isolate flex items-center border transition-colors duration-300 ${
                (d.today && isReady) || isWriting ? 'border-red' : 'border-line'
              }`}
              style={{ borderRadius: pt(16), padding: `${pt(11)} ${pt(14)}`, gap: pt(14), height: pt(62) }}
            >
              <div className="text-center" style={{ width: pt(30) }}>
                <div className="text-muted" style={{ fontSize: pt(10) }}>
                  {d.day}
                </div>
                <div className="font-semibold" style={{ fontSize: pt(17) }}>
                  {d.date}
                </div>
              </div>
              {isReady ? (
                <>
                  <motion.span
                    className="pointer-events-none absolute inset-0 -z-10 bg-red-soft"
                    style={{ borderRadius: 'inherit' }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="min-w-0 flex-1"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <div className={`font-semibold ${d.rest ? 'text-muted' : ''}`} style={{ fontSize: pt(14.5) }}>
                      {d.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: pt(11.5), marginTop: pt(2) }}>
                      {d.sub}
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="flex-1"
                  animate={isWriting ? { opacity: [0.45, 1, 0.45] } : { opacity: 1 }}
                  transition={isWriting ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                >
                  <div
                    className={isWriting ? 'bg-red-soft' : 'bg-surface'}
                    style={{ height: pt(10), width: '58%', borderRadius: pt(5) }}
                  />
                  <div
                    className={isWriting ? 'bg-red-soft' : 'bg-surface'}
                    style={{ height: pt(8), width: '38%', borderRadius: pt(4), marginTop: pt(7) }}
                  />
                </motion.div>
              )}
              {d.today && isReady && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-red font-medium text-white"
                  style={{ fontSize: pt(10.5), padding: `${pt(4)} ${pt(9)}` }}
                >
                  Today
                </motion.span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
