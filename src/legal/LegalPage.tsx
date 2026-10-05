import { Fact, LegalLayout } from './LegalLayout'
import { privacyIntro, privacySections } from './Privacy'
import { termsIntro, termsSections } from './Terms'

/** /privacy and /terms. Loaded as their own chunk, like the auth pages. */
export default function LegalPage({ doc }: { doc: 'privacy' | 'terms' }) {
  return doc === 'privacy' ? (
    <LegalLayout
      current="privacy"
      title="Privacy Policy"
      effective={<Fact name="privacyEffective" hint="effective date" />}
      intro={privacyIntro}
      sections={privacySections}
    />
  ) : (
    <LegalLayout
      current="terms"
      title="Terms of Service"
      effective={<Fact name="termsEffective" hint="effective date" />}
      intro={termsIntro}
      sections={termsSections}
    />
  )
}
