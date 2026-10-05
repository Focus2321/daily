/**
 * Business facts the legal pages depend on. Anything still `null` renders on the
 * page as a highlighted placeholder, so an unfinished draft can't pass for a
 * final one. Fill these in only with confirmed answers.
 */
export const facts = {
  /** Who operates TrainPrompt: a company's registered name, or the individual's name. */
  operator: null as string | null,
  /** Postal address for legal notices and privacy requests. */
  address: null as string | null,
  /** Inbox for privacy requests and legal notices, e.g. privacy@trainprompt.app. */
  contactEmail: null as string | null,
  /** Minimum age to hold an account, e.g. "18" or "16". */
  minimumAge: null as string | null,
  /** Law that governs the Terms, e.g. "the State of Texas, United States". */
  governingLaw: null as string | null,
  /** Courts that hear disputes, e.g. "the state and federal courts in Harris County, Texas". */
  venue: null as string | null,
  /** Floor on the liability cap in the Terms, e.g. "US$100". */
  liabilityCap: null as string | null,
  /** How long deleted data can linger in backups and logs before it's purged, e.g. "30 days". */
  backupRetention: null as string | null,
  /** Date each document takes effect, e.g. "October 20, 2026". */
  privacyEffective: null as string | null,
  termsEffective: null as string | null,
}

export type FactName = keyof typeof facts

/**
 * Leave on until the documents have been reviewed and every fact is filled in.
 * Shows a "draft" notice on both pages and asks search engines not to index them.
 */
export const LEGAL_DRAFT = true
