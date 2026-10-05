import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LogoMark } from './icons.tsx'

/*
 * The sign-in illustration (Paper: "Login illustration · Chat → Phone", option A).
 * Someone asks an assistant for a week of training or meals, it sends the plan to TrainPrompt, and
 * the week fills in on the phone. Three scenes (Claude, Muse, Grok) take turns. It is drawn on a
 * fixed 720×900 stage and scaled to fit its box.
 * Everything is derived from one looping clock, so reduced motion simply freezes it on the result.
 */

const STAGE_W = 720
const STAGE_H = 900

type Day = { dow: string; date: number; title: string; sub: string; rest?: boolean; kcal?: number; protein?: number }
type StatValue = { label: string; value?: number; of?: number }

/** One assistant writing one kind of week. The loop plays the scenes in turn so it never repeats back to back. */
type Scene = {
  assistant: string
  logo: string
  request: string
  onIt: string
  done: string
  saved: string
  week: Day[]
  stats: (sent: Day[]) => StatValue[]
}

const workoutCount = (sent: Day[]) => sent.filter((d) => !d.rest).length
const average = (sent: Day[], key: 'kcal' | 'protein') =>
  sent.length ? Math.round(sent.reduce((sum, d) => sum + (d[key] ?? 0), 0) / sent.length) : 0

const SCENES: Scene[] = [
  {
    assistant: 'Claude',
    logo: '/logos/claude-color.svg',
    request: 'Build my workout and meal plan for this week. I can train four days.',
    onIt: 'On it. Four training days with meals to match, sending it to TrainPrompt.',
    done: 'Done. Your week is in TrainPrompt: four training days, three rest days and every meal planned.',
    saved: '4 workouts · 21 meals',
    week: [
      { dow: 'Mon', date: 5, title: 'Chest & Triceps', sub: 'Push · 6 exercises · 3 meals' },
      { dow: 'Tue', date: 6, title: 'Legs', sub: 'Squat focus · 3 meals' },
      { dow: 'Wed', date: 7, title: 'Rest', sub: '30 min walk · 3 meals', rest: true },
      { dow: 'Thu', date: 8, title: 'Back & Biceps', sub: 'Pull · 6 exercises · 3 meals' },
      { dow: 'Fri', date: 9, title: 'Legs & Shoulders', sub: 'Hinge focus · 3 meals' },
      { dow: 'Sat', date: 10, title: 'Rest', sub: 'Long walk · 3 meals', rest: true },
      { dow: 'Sun', date: 11, title: 'Rest', sub: 'Meal prep · 3 meals', rest: true },
    ],
    stats: (sent) => [
      { label: 'Workouts', of: workoutCount(sent) },
      { label: 'Meals eaten', of: sent.length * 3 },
      { label: 'Rest days', value: sent.length - workoutCount(sent) },
    ],
  },
  {
    assistant: 'Muse',
    logo: '/logos/muse.svg',
    request: 'Plan my meals for this week. High protein, about 2,200 calories a day.',
    onIt: 'On it. Seven days of high protein meals, sending them to TrainPrompt.',
    done: 'Done. Your meals are in TrainPrompt: 21 meals at about 2,200 calories a day.',
    saved: '21 meals · 7 days',
    week: [
      { dow: 'Mon', date: 5, title: 'Salmon & rice', sub: '3 meals · 2,180 kcal', kcal: 2180, protein: 168 },
      { dow: 'Tue', date: 6, title: 'Chicken burrito bowls', sub: '3 meals · 2,240 kcal', kcal: 2240, protein: 174 },
      { dow: 'Wed', date: 7, title: 'Turkey chili', sub: '3 meals · 2,150 kcal', kcal: 2150, protein: 162 },
      { dow: 'Thu', date: 8, title: 'Steak & potatoes', sub: '3 meals · 2,260 kcal', kcal: 2260, protein: 171 },
      { dow: 'Fri', date: 9, title: 'Shrimp stir fry', sub: '3 meals · 2,190 kcal', kcal: 2190, protein: 165 },
      { dow: 'Sat', date: 10, title: 'Chicken pesto pasta', sub: '3 meals · 2,280 kcal', kcal: 2280, protein: 170 },
      { dow: 'Sun', date: 11, title: 'Roast chicken', sub: '3 meals · 2,120 kcal', kcal: 2120, protein: 166 },
    ],
    stats: (sent) => [
      { label: 'Meals eaten', of: sent.length * 3 },
      { label: 'Avg kcal', value: average(sent, 'kcal') },
      { label: 'Protein g', value: average(sent, 'protein') },
    ],
  },
  {
    assistant: 'Grok',
    logo: '/logos/grok-bot.svg',
    request: 'Make me a five day strength split this week. 45 minutes a session.',
    onIt: 'On it. Five 45 minute sessions and two rest days, sending to TrainPrompt.',
    done: 'Done. Your split is in TrainPrompt: five strength days and two rest days.',
    saved: '5 workouts · 225 min',
    week: [
      { dow: 'Mon', date: 5, title: 'Upper push', sub: 'Bench · 5 exercises · 45 min' },
      { dow: 'Tue', date: 6, title: 'Lower', sub: 'Squat · 5 exercises · 45 min' },
      { dow: 'Wed', date: 7, title: 'Upper pull', sub: 'Rows · 5 exercises · 45 min' },
      { dow: 'Thu', date: 8, title: 'Rest', sub: 'Mobility · 20 min', rest: true },
      { dow: 'Fri', date: 9, title: 'Shoulders & arms', sub: 'Press · 5 exercises · 45 min' },
      { dow: 'Sat', date: 10, title: 'Lower', sub: 'Deadlift · 5 exercises · 45 min' },
      { dow: 'Sun', date: 11, title: 'Rest', sub: 'Long walk', rest: true },
    ],
    stats: (sent) => [
      { label: 'Workouts', of: workoutCount(sent) },
      { label: 'Minutes', value: workoutCount(sent) * 45 },
      { label: 'Rest days', value: sent.length - workoutCount(sent) },
    ],
  },
]

// The loop, in ms: 01 request, 02 confirm and connect, 03 the week fills, then hold and crossfade back.
// Timings were tuned at 1× and are played SLOW times longer so each step has room to read.
const SLOW = 1.4
const at = (ms: number) => Math.round(ms * SLOW)
const SHOW_AT = at(40)
const TYPE_AT = at(350)
const TYPE_END = at(1880)
const PULSE_AT = at(1950)
const CONFIRM_AT = at(2200)
const REPLY_AT = at(2300)
const CHIP_AT = at(2500)
const LINE_AT = at(2750)
const RIDES = [at(3250), at(3700)]
const RIDE_MS = at(450)
const COMPLETE_AT = at(4200)
const FILL_AT = [3250, 3700, 4500, 4680, 4860, 5040, 5220].map(at)
const DONE_AT = at(5450)
const LEAVE_AT = at(8300)
const LOOP_MS = at(8800)

type Frame = {
  scene: number
  phase: 0 | 1 | 2
  instant: boolean
  visible: boolean
  typed: number
  typing: boolean
  pulse: boolean
  reply: boolean
  chip: boolean
  line: boolean
  ride: number
  filled: number
  done: boolean
}

/** `clock` runs across loops; each loop plays the next scene. */
function frameAt(clock: number): Frame {
  const scene = Math.floor(clock / LOOP_MS) % SCENES.length
  const t = clock % LOOP_MS
  const { request } = SCENES[scene]
  // Typing always takes the same time, whatever the length of the request.
  const typed = Math.max(0, Math.min(request.length, Math.floor(((t - TYPE_AT) / (TYPE_END - TYPE_AT)) * request.length)))
  const phase = t < CONFIRM_AT ? 0 : t < COMPLETE_AT ? 1 : 2
  const filled = FILL_AT.filter((at) => t >= at).length
  return {
    scene,
    phase,
    instant: t < SHOW_AT,
    visible: t >= SHOW_AT && t < LEAVE_AT,
    typed,
    typing: t >= TYPE_AT && t < PULSE_AT,
    pulse: t >= PULSE_AT && t < CONFIRM_AT + 200,
    reply: t >= REPLY_AT,
    chip: t >= CHIP_AT,
    line: phase === 1 && t >= LINE_AT,
    ride: RIDES.findIndex((at) => t >= at && t < at + RIDE_MS),
    filled,
    done: t >= DONE_AT,
  }
}

const sameFrame = (a: Frame, b: Frame) => (Object.keys(a) as (keyof Frame)[]).every((k) => a[k] === b[k])

const FINAL = frameAt(LEAVE_AT - 1)

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Runs the loop on animation frames and only re-renders when something on stage changes. */
function useFrame(): Frame {
  const reduced = useReducedMotion()
  const [frame, setFrame] = useState<Frame>(() => (reduced ? FINAL : frameAt(0)))
  useEffect(() => {
    if (reduced) {
      setFrame(FINAL)
      return
    }
    // In development, ?t=4800&scene=1 holds that scene at that moment, for checking a step by eye.
    const params = import.meta.env.DEV ? new URLSearchParams(location.search) : null
    const hold = params?.get('t')
    if (hold) {
      setFrame(frameAt(Number(params?.get('scene') ?? 0) * LOOP_MS + Number(hold)))
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const next = frameAt((now - start) % (LOOP_MS * SCENES.length))
      setFrame((prev) => (sameFrame(prev, next) ? prev : next))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])
  return frame
}

/** Scales the stage so the cropped window (stage rows `top` to `top + height`) fits the box, centred. */
function useFit(crop: { top: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scale = Math.min(box.w / STAGE_W, box.h / crop.height, 1.25)
  const style: CSSProperties = {
    width: STAGE_W,
    height: STAGE_H,
    transformOrigin: '0 0',
    transform: `translate(${(box.w - STAGE_W * scale) / 2}px, ${(box.h - crop.height * scale) / 2 - crop.top * scale}px) scale(${scale})`,
    visibility: box.w ? 'visible' : 'hidden',
  }
  return { ref, style }
}

// The Paper file's own neutrals, which are a touch cooler than the landing page's.
const palette = {
  '--s-surface': '#ffffff',
  '--s-ground': '#f5f5f5',
  '--s-line': '#e6e6e6',
  '--s-muted': '#6b6b6b',
  '--s-faint': '#a3a3a3',
  '--s-soft': '#fdece8',
} as CSSProperties

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
const spring = 'cubic-bezier(0.34, 1.36, 0.64, 1)'

// Where the chat and the phone sit in each step, and the connector from step 02.
const CHAT_AT = [
  [40, 236],
  [24, 84],
  [16, 250],
] as const
const PHONE_AT = [
  [372, 150],
  [318, 232],
  [372, 110],
] as const
const LINE_PATH = 'M2 7C64 7 14 246 76 246'

export function SignInIllustration({
  className,
  crop = { top: 0, height: STAGE_H },
}: {
  className?: string
  crop?: { top: number; height: number }
}) {
  const f = useFrame()
  const { ref, style } = useFit(crop)
  const move = (ms: number, curve: string) => (f.instant ? 'none' : `transform ${ms}ms ${curve}, box-shadow 500ms ${ease}, opacity 400ms ease-out`)

  const [cx, cy] = CHAT_AT[f.phase]
  const [px, py] = PHONE_AT[f.phase]

  return (
    <div ref={ref} className={`relative overflow-hidden bg-red ${className ?? ''}`} aria-hidden>
      <div
        className="absolute top-0 left-0 font-sans text-ink antialiased transition-opacity duration-400"
        style={{ ...style, ...palette, opacity: f.visible ? 1 : 0 }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${px}px, ${py}px)`,
            transition: move(f.phase === 2 ? 800 : 680, f.phase === 2 ? spring : ease),
            zIndex: f.phase === 0 ? 1 : 2,
          }}
        >
          <PhoneWeek f={f} />
        </div>

        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${cx}px, ${cy + (f.visible ? 0 : 24)}px)`,
            opacity: f.visible ? 1 : 0,
            transition: move(680, ease),
            zIndex: f.phase === 0 ? 2 : 1,
          }}
        >
          <Chat f={f} />
        </div>

        <Connector f={f} />
      </div>
    </div>
  )
}

function Chat({ f }: { f: Frame }) {
  const { assistant, logo, request, onIt, done, saved } = SCENES[f.scene]
  return (
    <div className="flex w-[384px] flex-col overflow-hidden rounded-[26px] bg-(--s-surface) shadow-[0_24px_48px_#3c0a0040]">
      <div className="flex items-center gap-2.5 border-b border-(--s-line) px-5 py-4">
        <img src={logo} alt="" className="size-[22px] shrink-0" />
        <span className="flex-1 text-[15px]/[20px] font-semibold">{assistant}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-(--s-ground) py-1 pr-2.5 pl-2">
          <span className="size-1.5 rounded-full bg-red" />
          <span className="text-[12px]/[16px] font-medium text-(--s-muted)">TrainPrompt</span>
        </span>
      </div>

      <div className="flex flex-col px-5 pt-[22px] pb-2">
        <div className="flex justify-end pl-10">
          <p className="rounded-[20px_20px_6px_20px] bg-(--s-ground) px-4 py-3 text-[16px]/[23px]">
            {request.slice(0, f.typed)}
            {f.typing && <span className="caret" />}
            <span className="text-transparent">{request.slice(f.typed)}</span>
          </p>
        </div>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out-soft"
          style={{ gridTemplateRows: f.reply ? '1fr' : '0fr' }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="flex w-[252px] flex-col gap-3 pt-4 transition-[opacity,translate] duration-300 ease-out-soft"
              style={{ opacity: f.reply ? 1 : 0, translate: f.reply ? '0 0' : '0 8px' }}
            >
              <div className="grid text-[16px]/[23px]">
                <p className="col-start-1 row-start-1 transition-opacity duration-300" style={{ opacity: f.done ? 0 : 1 }}>
                  {onIt}
                </p>
                <p className="col-start-1 row-start-1 transition-opacity duration-300" style={{ opacity: f.done ? 1 : 0 }}>
                  {done}
                </p>
              </div>
              <div
                className="flex items-center gap-2.5 self-start rounded-[14px] border border-(--s-line) bg-(--s-surface) py-2 pr-3 pl-2 transition-[opacity,translate] duration-300 ease-out-soft"
                style={{ opacity: f.chip ? 1 : 0, translate: f.chip ? '0 0' : '0 6px' }}
              >
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] bg-red">
                  <LogoMark className="h-3.5 w-4" />
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[13px]/[16px] font-medium">{f.done ? 'Saved to TrainPrompt' : 'Saving your week'}</span>
                  <span className="font-mono text-[11px]/[14px] text-(--s-muted)">
                    {f.done ? saved : `TrainPrompt · ${f.filled} of 7 days`}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="flex h-[46px] items-center gap-2.5 rounded-full border border-(--s-line) pr-1.5 pl-4">
          <span className="flex-1 text-[15px]/[20px] text-(--s-faint)">Reply to {assistant}…</span>
          <span
            className={`flex size-[34px] shrink-0 items-center justify-center rounded-full bg-ink ${f.pulse ? 'animate-[tp-pulse_420ms_ease-out]' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

/** The dotted line from the assistant's chip into the plan, drawn on in step 02 with a dot riding it per day sent. */
function Connector({ f }: { f: Frame }) {
  return (
    <div
      className="absolute top-[348px] left-[266px] z-3 h-[262px] w-[90px] transition-opacity duration-300"
      style={{ opacity: f.line ? 1 : 0 }}
    >
      <svg width="90" height="262" viewBox="0 0 90 262" fill="none" className="absolute inset-0 overflow-visible">
        <defs>
          <mask id="tp-line-draw" maskUnits="userSpaceOnUse" x="-10" y="-10" width="110" height="282">
            <path
              key={String(f.line)}
              d={LINE_PATH}
              stroke="#fff"
              strokeWidth="12"
              pathLength={1}
              strokeDasharray="1"
              className={f.line ? 'animate-[tp-draw_700ms_cubic-bezier(0.22,1,0.36,1)_both]' : ''}
              style={{ strokeDashoffset: f.line ? undefined : 1 }}
            />
          </mask>
        </defs>
        <g mask="url(#tp-line-draw)">
          <path d={LINE_PATH} stroke="#ffffffe6" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 7" />
          <path d={LINE_PATH} stroke="#d7361f" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.1 7" />
        </g>
        <circle cx="78" cy="246" r="9" fill="#d7361f33" />
        <circle cx="78" cy="246" r="4" fill="#d7361f" />
      </svg>
      {f.ride >= 0 && (
        <span
          key={f.ride}
          className="absolute top-0 left-0 size-3 rounded-full border-2 border-red bg-white animate-[tp-ride_cubic-bezier(0.45,0,0.55,1)_both]"
          style={{ offsetPath: `path('${LINE_PATH}')`, offsetRotate: '0deg', animationDuration: `${RIDE_MS}ms` }}
        />
      )}
    </div>
  )
}

function PhoneWeek({ f }: { f: Frame }) {
  const { week, stats } = SCENES[f.scene]
  const sent = week.slice(0, f.filled)
  const shadow = f.phase === 0 ? '0 24px 56px #3c0a0040' : '0 40px 80px #3c0a0066'

  return (
    <div className="h-[702px] w-[330px] rounded-[52px] bg-ink p-2.5" style={{ boxShadow: shadow, transition: 'box-shadow 500ms' }}>
      <div className="relative flex h-[682px] w-[310px] flex-col overflow-hidden rounded-[42px] bg-(--s-ground)">
        <div className="flex h-11 shrink-0 items-center justify-between pt-2 pr-[26px] pl-[30px]">
          <span className="text-[14px]/[18px] font-semibold">9:41</span>
          <svg width="54" height="12" viewBox="0 0 54 12" fill="none">
            <rect x="0" y="8" width="3" height="4" rx="1" fill="#111" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#111" />
            <rect x="10" y="3" width="3" height="9" rx="1" fill="#111" />
            <rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="#111" />
            <path d="M28 3.2a8 8 0 0 1 9.6 0M29.8 6a4.6 4.6 0 0 1 6 0M31.8 8.8a1.4 1.4 0 0 1 2 0" stroke="#111" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="41.5" y="1" width="11" height="10" rx="3" stroke="#11111166" />
            <rect x="43" y="2.5" width="8" height="7" rx="1.6" fill="#111" />
          </svg>
        </div>

        <div className="flex shrink-0 items-end justify-between px-[18px] py-3.5">
          <div className="flex flex-col gap-1">
            <span className="text-[11px]/[14px] font-medium tracking-[0.08em] text-(--s-muted) uppercase">Oct 5 – 11 · Week 6</span>
            <span className="text-[28px]/[32px] font-semibold tracking-[-0.03em]">This week</span>
          </div>
          <div className="flex gap-1.5 pb-0.5">
            {['M15 6l-6 6 6 6', 'M9 6l6 6-6 6'].map((d) => (
              <span key={d} className="flex size-[30px] items-center justify-center rounded-full border border-(--s-line) bg-(--s-surface)">
                <Chevron d={d} color="#111" />
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-1.5 px-3">
          {stats(sent).map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>

        <div className="flex shrink-0 flex-col gap-2 px-3 pt-4">
          <span className="pl-1 text-[11px]/[14px] font-medium tracking-[0.08em] text-(--s-muted) uppercase">Plan</span>
          <div className="flex flex-col overflow-hidden rounded-[18px] border border-(--s-line) bg-(--s-surface)">
            {week.map((day, i) => (
              <DayRow
                key={day.dow}
                day={day}
                index={i}
                last={i === week.length - 1}
                state={i < f.filled ? 'filled' : i === f.filled && f.phase > 0 && f.filled > 0 ? 'loading' : 'open'}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 flex h-[62px] w-[310px] items-start justify-between border-t border-(--s-line) bg-[#ffffffeb] px-[30px] pt-[9px]">
          <Tab label="Today" color="#8a8a8a">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </Tab>
          <Tab label="Week" color="#d7361f">
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </Tab>
          <Tab label="History" color="#8a8a8a">
            <path d="M5 20V12M12 20V5M19 20v-9" />
          </Tab>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value = 0, of }: StatValue) {
  return (
    <div className="flex flex-1 basis-0 flex-col gap-1 rounded-[14px] border border-(--s-line) bg-(--s-surface) p-2.5">
      <span className="text-[11px]/[14px] font-medium text-(--s-muted)">{label}</span>
      <span className="flex items-baseline gap-[3px] font-mono">
        <Count className="text-[18px]/[22px] font-medium" n={value} />
        {of !== undefined && (
          <span className="flex gap-[0.4ch] text-[12px]/[16px] text-(--s-muted)">
            / <Count n={of} />
          </span>
        )}
      </span>
    </div>
  )
}

/** A number that ticks up with a small lift each time it changes. */
function Count({ n, className }: { n: number; className?: string }) {
  return (
    <span key={n} className={`inline-block ${n ? 'animate-[tp-rise_260ms_cubic-bezier(0.22,1,0.36,1)_both]' : ''} ${className ?? ''}`}>
      {n.toLocaleString('en-US')}
    </span>
  )
}

function DayRow({ day, index, last, state }: { day: Day; index: number; last: boolean; state: 'open' | 'loading' | 'filled' }) {
  const today = index === 0
  const bg = today ? 'bg-(--s-soft)' : state === 'loading' ? 'bg-[#fff8f6]' : ''
  const dateColor = today ? 'text-red' : state === 'filled' && !day.rest ? 'text-ink' : 'text-(--s-faint)'

  return (
    <div className={`flex items-center gap-2.5 py-[9px] pr-2.5 pl-3 transition-colors duration-300 ${last ? '' : 'border-b border-(--s-line)'} ${bg}`}>
      <div className="flex w-[30px] shrink-0 flex-col items-center gap-px">
        <span className={`text-[10px]/[12px] font-medium tracking-[0.06em] uppercase ${today ? 'text-red' : 'text-(--s-muted)'}`}>{day.dow}</span>
        <span className={`font-mono text-[16px]/[20px] font-medium transition-colors duration-300 ${dateColor}`}>{day.date}</span>
      </div>
      <div className={`h-[30px] w-px shrink-0 ${today ? 'bg-[#f5c9bf]' : 'bg-(--s-line)'}`} />

      {state === 'loading' ? (
        <div className="flex min-w-0 flex-1 flex-col gap-[7px] py-[3px]">
          <span className="h-2.5 w-[74px] rounded-full bg-[#ebebeb]" />
          <span className="h-2 w-[128px] rounded-full bg-[#f0f0f0]" />
        </div>
      ) : (
        <div
          key={state}
          className={`flex min-w-0 flex-1 flex-col gap-px ${state === 'filled' ? 'animate-[tp-rise_300ms_cubic-bezier(0.22,1,0.36,1)_both]' : ''}`}
        >
          <span className={`text-[14px]/[18px] font-medium ${state === 'filled' ? 'text-ink' : 'text-(--s-muted)'}`}>
            {state === 'filled' ? day.title : 'Open day'}
          </span>
          <span className="text-[11px]/[14px] text-(--s-muted)">
            {state === 'filled' ? day.sub : today ? 'Ask your AI to plan this day.' : 'Nothing planned'}
          </span>
        </div>
      )}

      <div className="flex w-[46px] shrink-0 justify-end">
        {today ? (
          <span className="rounded-full bg-red px-2 py-[3px] text-[10px]/[12px] font-medium text-white">Today</span>
        ) : (
          <Chevron d="M9 6l6 6-6 6" color="#a3a3a3" />
        )}
      </div>
    </div>
  )
}

function Chevron({ d, color }: { d: string; color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Tab({ label, color, children }: { label: string; color: string; children: ReactNode }) {
  return (
    <div className="flex w-[60px] shrink-0 flex-col items-center gap-[3px]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        {children}
      </svg>
      <span className="text-[10px]/[12px] font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
