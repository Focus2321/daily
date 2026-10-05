import type { useClerk } from '@clerk/react'
import { clerkHosts } from './redirect.ts'

type Clerk = ReturnType<typeof useClerk>

/**
 * Leaves the page for `url` once a session is active. Going back to Clerk's own
 * hosts (the /oauth/authorize hand-off, the consent screen) needs `buildUrlWithAuth`: on a dev
 * instance it carries the session across origins in `__clerk_db_jwt`, and in
 * production it returns the URL unchanged. Everything else goes through
 * `decorateUrl`, which handles Safari's tracking prevention when it applies.
 */
export function leaveTo(clerk: Clerk, url: string, decorateUrl?: (url: string) => string) {
  const target = new URL(url, window.location.origin)
  if (clerkHosts().includes(target.hostname)) {
    window.location.assign(clerk.buildUrlWithAuth(target.href))
  } else {
    window.location.assign(decorateUrl ? decorateUrl(target.href) : target.href)
  }
}
