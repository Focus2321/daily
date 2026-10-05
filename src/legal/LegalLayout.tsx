import { useEffect, type ReactNode } from 'react'

import { Mark } from '../components/Bits'
import { Footer } from '../sections/Footer'
import { facts, LEGAL_DRAFT, type FactName } from './facts'

export type LegalSection = { id: string; title: string; body: ReactNode }

type Props = {
  current: 'privacy' | 'terms'
  title: string
  effective: ReactNode
  intro: ReactNode
  sections: LegalSection[]
}

/** A business fact from facts.ts, or a highlighted placeholder until it's confirmed. */
export function Fact({ name, hint }: { name: FactName; hint: string }) {
  const value = facts[name]
  if (value) return <>{value}</>
  return <mark className="rounded-[4px] bg-red-soft px-1 py-px font-medium text-red-deep">[{hint}]</mark>
}

/** The contact address as a mailto link, once it's confirmed. */
export function ContactEmail() {
  const email = facts.contactEmail
  return email ? <a href={`mailto:${email}`}>{email}</a> : <Fact name="contactEmail" hint="contact email" />
}

/** A whole clause still waiting on a decision. Rendered as a callout so it can't be missed. */
export function Decision({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-red/25 bg-red-soft/60 px-5 py-4 text-[14.5px]/[22px] text-red-deep">
      <span className="font-semibold">To decide before publishing: </span>
      {children}
    </div>
  )
}

export function LegalLayout({ current, title, effective, intro, sections }: Props) {
  useEffect(() => {
    document.title = `${title} · TrainPrompt`
    if (!LEGAL_DRAFT) return
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => robots.remove()
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
        {LEGAL_DRAFT && (
          <div role="note" className="mb-12 rounded-2xl bg-surface px-5 py-4 text-[14.5px]/[22px] text-muted md:mb-16">
            <span className="font-semibold text-ink">Draft for review.</span> This document is not yet in effect. Highlighted items are
            facts or decisions still to be confirmed.
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-10">
              <p className="mb-4 font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">On this page</p>
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
            <p className="font-mono text-[12px] tracking-[0.08em] text-red uppercase">Legal</p>
            <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4rem)]">{title}</h1>
            <p className="mt-5 text-[14px] text-muted">Effective {effective}</p>
            <div className="legal mt-10">{intro}</div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="legal mt-14 scroll-mt-8 border-t border-line pt-10">
                <h2>
                  <span className="mr-3 font-mono text-[14px] font-normal text-faint">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
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
