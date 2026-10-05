import { facts } from './facts'
import { LegalLayout } from './LegalLayout'
import { privacyIntro, privacySections } from './Privacy'
import { termsIntro, termsSections } from './Terms'

/** /privacy and /terms. Loaded as their own chunk, like the auth pages. */
export default function LegalPage({ doc }: { doc: 'privacy' | 'terms' }) {
  return doc === 'privacy' ? (
    <LegalLayout
      current="privacy"
      title="Privacy Policy"
      updated={facts.privacyUpdated}
      intro={privacyIntro}
      sections={privacySections}
    />
  ) : (
    <LegalLayout
      current="terms"
      title="Terms of Service"
      updated={facts.termsUpdated}
      intro={termsIntro}
      sections={termsSections}
    />
  )
}
