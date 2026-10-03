import { motion, type MotionValue } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import { screens, type ScreenName } from '../assets'

type PhoneProps = {
  screen?: ScreenName
  /** Static scroll of the screenshot, as a percent of its own height. */
  offset?: number
  /** Scroll-linked translate for the screenshot, e.g. "-20%". */
  y?: MotionValue<string>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** How far a screenshot can scroll before its bottom edge shows, in percent. */
export const maxScroll = (screen: ScreenName) => (1 - 1688 / screens[screen].height) * 100

export function Phone({ screen, offset = 0, y, className = '', style, children }: PhoneProps) {
  return (
    <div
      className={`relative rounded-[15%/7%] bg-ink p-[2.6%] shadow-phone ring-1 ring-black/40 ${className}`}
      style={style}
    >
      <div className="@container relative aspect-[390/844] overflow-hidden rounded-[12.6%/5.9%] bg-white">
        {screen && (
          <motion.img
            src={screens[screen].src}
            alt=""
            draggable={false}
            className="absolute inset-x-0 top-0 w-full select-none"
            style={{ y: y ?? `${-offset}%` }}
          />
        )}
        {children}
        <div className="absolute top-[1.5%] left-1/2 h-[3.5%] w-[30%] -translate-x-1/2 rounded-full bg-ink" />
      </div>
    </div>
  )
}

/** Converts a size on the 390pt phone artboard to container units of the phone screen. */
export const pt = (n: number) => `${(n / 390) * 100}cqw`
