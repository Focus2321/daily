import { HandleSSOCallback, useClerk } from '@clerk/react'
import { AuthLayout } from './AuthLayout.tsx'
import { Spinner } from './icons.tsx'
import { leaveTo } from './navigate.ts'
import { RETURN_PARAM, redirectTarget } from './redirect.ts'

/** Google and Apple come back here. Clerk finishes the sign-in (or sign-up) and we continue to the return address. */
export function SSOCallback() {
  const clerk = useClerk()
  const target = redirectTarget()
  const back = (path: string) => {
    const qs = target.fromClient ? `?${RETURN_PARAM}=${encodeURIComponent(target.url)}` : ''
    window.location.assign(`${path}${qs}`)
  }

  return (
    <AuthLayout>
      <div className="flex items-center gap-3 text-[15px]/[22px] text-muted" role="status">
        <Spinner />
        Finishing sign-in…
      </div>
      <HandleSSOCallback
        navigateToApp={({ decorateUrl }) => leaveTo(clerk, target.url, decorateUrl)}
        navigateToSignIn={() => back('/sign-in')}
        navigateToSignUp={() => back('/sign-in')}
      />
    </AuthLayout>
  )
}
