import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'

import { Adjusts } from './sections/Adjusts'
import { Close } from './sections/Close'
import { Connect } from './sections/Connect'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Homework } from './sections/Homework'
import { LogSet } from './sections/LogSet'
import { Meals } from './sections/Meals'
import { Nav } from './sections/Nav'
import { TellOnce } from './sections/TellOnce'
import { YouAsk } from './sections/YouAsk'

export default function App() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    return () => lenis.destroy()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Homework />
        <YouAsk />
        <Connect />
        <TellOnce />
        <Meals />
        <LogSet />
        <Adjusts />
        <Close />
      </main>
      <Footer />
    </MotionConfig>
  )
}
