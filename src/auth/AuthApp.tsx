import { ClerkProvider } from '@clerk/react'
import { MotionConfig } from 'motion/react'
import { AuthLayout } from './AuthLayout.tsx'
import { hideRedirectFromClerk } from './redirect.ts'
import { SignInPage } from './SignInPage.tsx'
import { SSOCallback } from './SSOCallback.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

// Runs once, before ClerkProvider mounts and clerk-js reads the address.
hideRedirectFromClerk()

/**
 * The sign-in pages. Clerk's /oauth/authorize sends signed-out users here with
 * `redirect_url` pointing back at itself (renamed to `return_to` before Clerk
 * loads, see hideRedirectFromClerk); once they're signed in we send them
 * back and Clerk carries on with consent and the redirect to the AI client.
 */
export default function AuthApp() {
  const path = window.location.pathname.replace(/\/+$/, '')

  if (!PUBLISHABLE_KEY) {
    return (
      <AuthLayout>
        <p className="text-[15px]/[22px] text-muted">
          Sign-in isn't configured. Set <code className="font-mono text-ink">VITE_CLERK_PUBLISHABLE_KEY</code> and reload.
        </p>
      </AuthLayout>
    )
  }

  // Absolute on purpose: clerk-js compares window.location.href against these with startsWith.
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl={`${window.location.origin}/sign-in`} signUpUrl={`${window.location.origin}/sign-up`} afterSignOutUrl="/">
      <MotionConfig reducedMotion="user">
        {path.endsWith('/sso-callback') ? <SSOCallback /> : <SignInPage />}
      </MotionConfig>
    </ClerkProvider>
  )
}
