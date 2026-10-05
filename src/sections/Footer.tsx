import { Mark } from '../components/Bits'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-10 text-[13.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <a href="/" className="flex items-center gap-2.5 font-semibold text-ink">
          <Mark className="size-6" />
          TrainPrompt
        </a>
        <span>Your AI writes the plan. You do the reps.</span>
        <span className="flex items-center gap-5">
          <a href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-ink">
            Terms
          </a>
          <span>© 2026 TrainPrompt</span>
        </span>
      </div>
    </footer>
  )
}
