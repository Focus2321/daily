import { useEffect, type ReactNode } from 'react'

import { Mark } from '../components/Bits'
import { Footer } from '../sections/Footer'
import { facts } from './facts'

export type LegalSection = { id: string; title: string; body: ReactNode }

type Props = {
  current: 'privacy' | 'terms'
  title: string
  updated: string | null
  intro: ReactNode
  sections: LegalSection[]
}

/** "contact us", linked to the contact inbox once there is one. */
export function ContactUs({ children = 'contact us' }: { children?: ReactNode }) {
  return facts.contactEmail ? <a href={`mailto:${facts.contactEmail}`}>{children}</a> : <>{children}</>
}

/** The contact inbox as a mailto link. Only call this where facts.contactEmail is set. */
export function ContactEmail() {
  return <a href={`mailto:${facts.contactEmail}`}>{facts.contactEmail}</a>
}

export function LegalLayout({ current, title, updated, intro, sections }: Props) {
  useEffect(() => {
    document.title = `${title} · TrainPrompt`
  }, [title])

  // The page renders after load, so the browser's own jump to #section has nothing to land on yet.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em]">
            <Mark />
            TrainPrompt
          </a>
          <nav className="flex items-center gap-6 text-[14px] text-muted">
            <DocLink href="/privacy" active={current === 'privacy'}>
              Privacy
            </DocLink>
            <DocLink href="/terms" active={current === 'terms'}>
              Terms
            </DocLink>
          </nav>
        </div>
      </header>

      <main className="container-page py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-10">
              <ol className="flex flex-col gap-2.5 text-[13.5px]/[18px] text-muted">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="transition-colors hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="max-w-[700px]">
            <h1 className="display text-[clamp(2.6rem,6vw,4rem)]">{title}</h1>
            {updated && <p className="mt-5 text-[14px] text-muted">Last updated {updated}</p>}
            <div className="legal mt-10">{intro}</div>

            {sections.map((s) => (
              <section key={s.id} id={s.id} className="legal mt-14 scroll-mt-8 border-t border-line pt-10">
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}

function DocLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <a href={href} aria-current={active ? 'page' : undefined} className={active ? 'font-medium text-ink' : 'transition-colors hover:text-ink'}>
      {children}
    </a>
  )
}
