/**
 * Business details the legal pages can mention. Each one is optional: while a
 * value is `null`, the sentence or section that depends on it is left out of the
 * page entirely. Fill these in only with confirmed answers.
 */
export const facts = {
  /** Who operates TrainPrompt: a company's registered name, or the individual's name. Adds "TrainPrompt is run by …". */
  operator: null as string | null,
  /** Postal address for legal notices and privacy requests. Shown in both Contact sections. */
  address: null as string | null,
  /** Inbox for privacy requests and legal notices, e.g. privacy@trainprompt.app. Links every "contact us" and adds the Contact sections. */
  contactEmail: null as string | null,
  /** Minimum age to hold an account, e.g. "18" or "16". Used in the Terms eligibility and Privacy children sections. */
  minimumAge: null as string | null,
  /** Law that governs the Terms, e.g. "the State of Texas, United States". */
  governingLaw: null as string | null,
  /** Courts that hear disputes, e.g. "the state and federal courts in Harris County, Texas". Needs governingLaw too. */
  venue: null as string | null,
  /** Floor on the liability cap in the Terms, e.g. "US$100". Adds the total-liability limit. */
  liabilityCap: null as string | null,
  /** How long deleted data can stay in provider backups and logs, e.g. "30 days". */
  backupRetention: null as string | null,
  /** "Last updated" date shown under each title, e.g. "October 20, 2026". */
  privacyUpdated: null as string | null,
  termsUpdated: null as string | null,
}
