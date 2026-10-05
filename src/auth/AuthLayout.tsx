import type { ReactNode } from 'react'
import { LogoMark } from './icons.tsx'

/** Split screen on desktop (form left, red brand panel right); a red band over the form on mobile. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ground text-ink lg:flex-row">
      <header className="flex items-center gap-3.5 bg-red px-6 pt-9 pb-8 lg:hidden">
        <LogoMark className="h-11 w-[52px] shrink-0" />
        <span className="text-[30px]/[34px] font-semibold tracking-[-0.035em] text-white">TrainPrompt</span>
      </header>

      <main className="flex flex-1 flex-col px-5 pt-8 pb-6 lg:w-1/2 lg:flex-none lg:px-14 lg:py-10">
        <a href="/" className="hidden self-start text-[20px]/[24px] font-semibold tracking-[-0.03em] lg:block">
          TrainPrompt
        </a>
        <div className="flex flex-1 flex-col lg:items-center lg:justify-center">
          <div className="mx-auto w-full max-w-[480px] lg:mx-0 lg:max-w-[400px]">{children}</div>
        </div>
        <p className="hidden text-[13px]/[18px] text-muted lg:block">© 2026 TrainPrompt</p>
      </main>

      <aside className="hidden flex-col items-center justify-center gap-9 bg-red lg:flex lg:w-1/2" aria-hidden>
        <LogoMark className="h-[254px] w-[300px]" />
        <span className="text-[64px]/[64px] font-semibold tracking-[-0.045em] text-white">TrainPrompt</span>
      </aside>
    </div>
  )
}
