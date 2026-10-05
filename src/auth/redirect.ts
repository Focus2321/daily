/**
 * Where to send the user once they are signed in. Clerk passes `redirect_url`
 * when it bounces a signed-out user here, for example from its OAuth
 * /oauth/authorize endpoint while an AI client is connecting. Only Clerk's own
 * hosts for this instance and trainprompt.app are followed; anything else falls back
 * to the landing page so the page can't be used as an open redirect.
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

/** The Frontend API host is base64-encoded in the publishable key, e.g. awake-deer-4194.clerk.accounts.dev. */
export function frontendApiHost(key = PUBLISHABLE_KEY): string | null {
  const encoded = key?.match(/^pk_(?:test|live)_(.+)$/)?.[1]
  if (!encoded) return null
  try {
    return atob(encoded).replace(/\$$/, '').toLowerCase() || null
  } catch {
    return null
  }
}

/**
 * Clerk's own hosts for this instance: the Frontend API (OAuth authorize) and
 * the Account Portal (the hosted consent screen). On a dev instance these are
 * <slug>.clerk.accounts.dev and <slug>.accounts.dev; in production they live
 * under trainprompt.app (clerk. and accounts.).
 */
export function clerkHosts(): string[] {
  const fapi = frontendApiHost()
  if (!fapi) return []
  const portal = fapi.endsWith('.clerk.accounts.dev') ? fapi.replace(/\.clerk\.accounts\.dev$/, '.accounts.dev') : fapi.replace(/^clerk\./, 'accounts.')
  return [fapi, portal]
}

export function isSafeRedirect(raw: string, here: Location = window.location): boolean {
  let url: URL
  try {
    url = new URL(raw, here.origin)
  } catch {
    return false
  }
  if (url.origin === here.origin) return true
  if (url.protocol !== 'https:') return false
  const host = url.hostname.toLowerCase()
  return clerkHosts().includes(host) || host === 'trainprompt.app' || host.endsWith('.trainprompt.app')
}

const FALLBACK = '/'

/** Where we keep the return address once it has been moved out of `redirect_url`. */
export const RETURN_PARAM = 'return_to'

/**
 * Moves `redirect_url` to `return_to` before Clerk loads. On development
 * instances clerk-js reads `redirect_url` on load and, when it points at its
 * own /oauth/authorize-with-immediate-redirect, navigates there straight away,
 * even for a signed-out visitor, which bounces them off this page. Production
 * instances skip that check; renaming it everywhere keeps both the same.
 */
export function hideRedirectFromClerk(loc: Location = window.location): void {
  const params = new URLSearchParams(loc.search)
  const raw = params.get('redirect_url')
  if (raw === null) return
  params.delete('redirect_url')
  if (!params.has(RETURN_PARAM)) params.set(RETURN_PARAM, raw)
  const qs = params.toString()
  window.history.replaceState(window.history.state, '', `${loc.pathname}${qs ? `?${qs}` : ''}${loc.hash}`)
}

/** The validated return address from the current address, or the landing page. */
export function redirectTarget(search = window.location.search): { url: string; fromClient: boolean } {
  const params = new URLSearchParams(search)
  const raw =
    params.get(RETURN_PARAM) ??
    params.get('redirect_url') ??
    params.get('sign_in_force_redirect_url') ??
    params.get('sign_up_force_redirect_url')
  if (raw && isSafeRedirect(raw)) return { url: new URL(raw, window.location.origin).href, fromClient: true }
  return { url: FALLBACK, fromClient: false }
}

/** True when the redirect continues an OAuth authorization (authorize or consent), i.e. an AI client is connecting. */
export function isOAuthHandoff(url: string): boolean {
  try {
    return /^\/oauth[/-]/.test(new URL(url, window.location.origin).pathname)
  } catch {
    return false
  }
}

/**
 * A best guess at which AI is connecting, from the `redirect_uri` inside the
 * authorize URL. The client's registered name is only readable once signed in,
 * so unknown or local clients (Claude Code, Cursor's loopback) get no name.
 */
export function connectingClient(url: string): string | null {
  try {
    const redirectUri = new URL(url, window.location.origin).searchParams.get('redirect_uri')
    if (!redirectUri) return null
    const host = new URL(redirectUri).hostname.toLowerCase()
    const is = (domain: string) => host === domain || host.endsWith(`.${domain}`)
    if (is('claude.ai') || is('claude.com') || is('anthropic.com')) return 'Claude'
    if (is('chatgpt.com') || is('openai.com')) return 'ChatGPT'
    if (is('cursor.com') || is('cursor.sh')) return 'Cursor'
    if (is('perplexity.ai')) return 'Perplexity'
    if (is('mistral.ai')) return 'Le Chat'
    return null
  } catch {
    return null
  }
}
