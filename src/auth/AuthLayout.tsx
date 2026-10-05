import { useEffect, useState, type ReactNode } from 'react'
import { Mark } from '../components/Bits'
import { LogoMark } from './icons.tsx'
import { SignInIllustration } from './SignInIllustration.tsx'

const DESKTOP = '(min-width: 64rem)'

function useDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches)
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return desktop
}

/**
 * Split screen on desktop (form left, the illustration on red right). On mobile the same
 * illustration sits in a red band over the form, cropped to its top so the phone runs off the edge.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  const desktop = useDesktop()

  return (
    <div className="flex min-h-dvh flex-col bg-ground text-ink lg:flex-row">
      {!desktop && (
        <header className="flex flex-col bg-red">
          <div className="flex items-center gap-3 px-6 pt-7">
            <LogoMark className="h-11 w-[52px] shrink-0" />
            <span className="text-[32px]/[36px] font-semibold tracking-[-0.035em] text-white">TrainPrompt</span>
          </div>
          <SignInIllustration crop={{ top: 64, height: 560 }} className="aspect-[720/560] max-h-[340px] w-full" />
        </header>
      )}

      <main className="flex flex-1 flex-col px-5 pt-8 pb-6 lg:w-1/2 lg:flex-none lg:px-14 lg:py-10">
        <a href="/" className="hidden items-center gap-3 self-start text-[32px]/[36px] font-semibold tracking-[-0.035em] lg:flex">
          <Mark className="h-11 w-[52px] shrink-0" />
          TrainPrompt
        </a>
        <div className="flex flex-1 flex-col lg:items-center lg:justify-center">
          <div className="mx-auto w-full max-w-[480px] lg:mx-0 lg:max-w-[400px]">{children}</div>
        </div>
        <p className="mx-auto flex w-full max-w-[480px] gap-5 pt-8 text-[13px]/[18px] text-muted lg:mx-0 lg:max-w-none lg:pt-0">
          <span className="hidden lg:inline">© 2026 TrainPrompt</span>
          <a href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-ink">
            Terms
          </a>
        </p>
      </main>

      {desktop && (
        <aside className="sticky top-0 flex h-dvh w-1/2 bg-red">
          <SignInIllustration className="flex-1" />
        </aside>
      )}
    </div>
  )
}
