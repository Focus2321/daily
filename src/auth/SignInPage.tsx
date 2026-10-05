import { useAuth, useClerk, useSignIn, useSignUp } from '@clerk/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AuthLayout } from './AuthLayout.tsx'
import { clerkError } from './clerkError.ts'
import { AppleIcon, ChevronLeft, GoogleIcon, Spinner } from './icons.tsx'
import { leaveTo } from './navigate.ts'
import { RETURN_PARAM, isOAuthHandoff, redirectTarget } from './redirect.ts'

const CODE_LENGTH = 6
const RESEND_AFTER_S = 60
const CODE_TTL_S = 600
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Flow = 'signIn' | 'signUp'
type Sent = { email: string; flow: Flow; sentAt: number }
type Provider = 'oauth_apple' | 'oauth_google'

const ease = [0.22, 1, 0.36, 1] as const

/** Email, then a 6-digit code. A new email creates the account, same as the app. */
export function SignInPage() {
  const clerk = useClerk()
  const { isLoaded, isSignedIn } = useAuth()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()

  const target = useMemo(() => redirectTarget(), [])
  const handoff = target.fromClient && isOAuthHandoff(target.url)

  const [sent, setSent] = useState<Sent | null>(null)
  const [onCode, setOnCode] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [ssoBusy, setSsoBusy] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const leaving = useRef(false)
  function leave(decorateUrl?: (url: string) => string) {
    if (leaving.current) return
    leaving.current = true
    leaveTo(clerk, target.url, decorateUrl)
  }

  // Someone who is already signed in goes straight on, so an AI client reconnecting doesn't ask twice.
  useEffect(() => {
    if (isLoaded && isSignedIn) leave()
  }, [isLoaded, isSignedIn])

  // The resend and expiry clocks tick once a second on the code step.
  useEffect(() => {
    if (!onCode) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [onCode])

  const elapsed = sent ? Math.floor((now - sent.sentAt) / 1000) : 0
  const resendIn = Math.max(0, RESEND_AFTER_S - elapsed)
  const expiresIn = Math.max(0, CODE_TTL_S - elapsed)

  function codeSent(address: string, flow: Flow) {
    const at = Date.now()
    setNow(at)
    setSent({ email: address, flow, sentAt: at })
    setCode('')
    setOnCode(true)
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault()
    const address = email.trim()
    if (busy || ssoBusy || !isLoaded) return
    if (!EMAIL_RE.test(address)) return setError('Enter a valid email address.')
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const res = await signIn.emailCode.sendCode({ emailAddress: address })
      if (!res.error) return codeSent(address, 'signIn')
      if (clerkError(res.error).code !== 'form_identifier_not_found') return setError(clerkError(res.error).message)
      // New here: create the account with the same email and verify it with a code.
      const created = await signUp.create({ emailAddress: address })
      if (created.error) return setError(clerkError(created.error).message)
      const sentUp = await signUp.verifications.sendEmailCode()
      if (sentUp.error) return setError(clerkError(sentUp.error).message)
      codeSent(address, 'signUp')
    } catch (err) {
      setError(clerkError(err).message)
    } finally {
      setBusy(false)
    }
  }

  async function verify(value: string) {
    if (!sent || busy) return
    setBusy(true)
    setError(null)
    setNotice(null)
    const fail = (message: string) => {
      setError(message)
      setCode('')
    }
    const navigate = ({ decorateUrl }: { decorateUrl: (url: string) => string }) => leave(decorateUrl)
    try {
      if (sent.flow === 'signIn') {
        const res = await signIn.emailCode.verifyCode({ code: value })
        if (res.error) return fail(clerkError(res.error).message)
        if (signIn.status !== 'complete') return fail("That code didn't finish signing you in. Try again.")
        const done = await signIn.finalize({ navigate })
        if (done.error) return fail(clerkError(done.error).message)
      } else {
        const res = await signUp.verifications.verifyEmailCode({ code: value })
        if (res.error) return fail(clerkError(res.error).message)
        if (signUp.status !== 'complete') return fail('Your account needs a few more details. Finish signing up in the TrainPrompt app.')
        const done = await signUp.finalize({ navigate })
        if (done.error) return fail(clerkError(done.error).message)
      }
      // Leaving the page now; keep the spinner up until the browser navigates.
      return
    } catch (err) {
      fail(clerkError(err).message)
    } finally {
      if (!leaving.current) setBusy(false)
    }
  }

  function enterCode(raw: string) {
    if (busy) return
    const next = raw.replace(/\D/g, '').slice(0, CODE_LENGTH)
    setCode(next)
    setError(null)
    // The last digit signs in without another tap.
    if (next.length === CODE_LENGTH) verify(next)
  }

  async function resend() {
    if (!sent || resendIn > 0 || busy) return
    setError(null)
    setNotice(null)
    setCode('')
    const res = sent.flow === 'signIn' ? await signIn.emailCode.sendCode() : await signUp.verifications.sendEmailCode()
    if (res.error) return setError(clerkError(res.error).message)
    const at = Date.now()
    setNow(at)
    setSent({ ...sent, sentAt: at })
    setNotice('We sent a new code.')
  }

  function startOver() {
    setOnCode(false)
    setCode('')
    setError(null)
    setNotice(null)
  }

  async function sso(strategy: Provider) {
    if (busy || ssoBusy || !isLoaded) return
    setSsoBusy(strategy)
    setError(null)
    const callback = new URL('/sign-in/sso-callback', window.location.origin)
    if (target.fromClient) callback.searchParams.set(RETURN_PARAM, target.url)
    try {
      // Leaves for Google or Apple; they come back to the callback page.
      const res = await signIn.sso({ strategy, redirectUrl: target.url, redirectCallbackUrl: callback.href })
      if (res.error) {
        setError(clerkError(res.error).message)
        setSsoBusy(null)
      }
    } catch (err) {
      setError(clerkError(err).message)
      setSsoBusy(null)
    }
  }

  if (isLoaded && isSignedIn) {
    return (
      <AuthLayout>
        <div className="flex items-center gap-3 text-[15px]/[22px] text-muted" role="status">
          <Spinner />
          {handoff ? 'Signed in. Taking you back to finish connecting…' : 'Signed in. Taking you back…'}
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={onCode ? 'code' : 'email'}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.34, ease } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.16, ease: 'easeIn' } }}
        >
          {onCode && sent ? (
            <>
              <Heading
                top={
                  <button
                    type="button"
                    onClick={startOver}
                    aria-label="Use a different email"
                    className="flex size-10 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <ChevronLeft />
                  </button>
                }
                title="Enter your code"
              >
                Sent to <span className="break-all">{sent.email}</span> ·{' '}
                <button
                  type="button"
                  onClick={startOver}
                  className="font-medium text-ink underline underline-offset-3 hover:text-red-deep"
                >
                  Change
                </button>
              </Heading>

              <div className="flex flex-col gap-6">
                <CodeSlots value={code} onChange={enterCode} disabled={busy} invalid={!!error} />

                <div className="flex items-center justify-between gap-4 text-[14px]/[18px]">
                  <span className="flex items-center gap-2 text-muted" aria-live="polite">
                    <span className="size-2 shrink-0 rounded-full bg-red" />
                    {expiresIn > 0 ? `Code expires in ${clock(expiresIn)}` : 'Code expired'}
                  </span>
                  {resendIn > 0 ? (
                    <span className="font-medium text-faint">Resend · {clock(resendIn)}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={resend}
                      disabled={busy}
                      className="font-medium text-ink underline-offset-3 hover:underline disabled:text-faint"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                <Message error={error}>
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="size-3.5" />
                      Signing you in…
                    </span>
                  ) : (
                    (notice ?? "Type or paste the code. You'll be signed in after the last digit.")
                  )}
                </Message>
              </div>
            </>
          ) : (
            <>
              <Heading
                title="Sign in"
              >
                {handoff ? 'Sign in to connect your AI to TrainPrompt.' : 'Sign in to your TrainPrompt account.'}
                <br />
                We'll email you a 6-digit code.
              </Heading>

              <form onSubmit={sendCode} noValidate className="flex flex-col gap-3">
                <label
                  className={`flex h-[60px] cursor-text flex-col justify-center rounded-2xl border-[1.5px] bg-surface px-4 transition-colors ${
                    error ? 'border-red' : 'border-surface focus-within:border-faint'
                  }`}
                >
                  <span className="text-[12px]/[16px] font-medium text-muted">Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    placeholder="you@example.com"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'email-error' : undefined}
                    className="w-full bg-transparent text-[16px]/[22px] text-ink outline-none placeholder:text-faint"
                  />
                </label>

                {error && (
                  <p id="email-error" role="alert" className="text-[14px]/[20px] text-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || !!ssoBusy}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-ink text-[16px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:opacity-70"
                >
                  {busy ? <Spinner /> : 'Continue'}
                </button>

                <div className="flex items-center gap-4 py-2 text-[13px] text-muted">
                  <span className="h-px flex-1 bg-line" />
                  or
                  <span className="h-px flex-1 bg-line" />
                </div>

                <div className="flex gap-2.5">
                  <SocialButton label="Apple" icon={<AppleIcon />} busy={ssoBusy === 'oauth_apple'} disabled={busy || !!ssoBusy} onClick={() => sso('oauth_apple')} />
                  <SocialButton label="Google" icon={<GoogleIcon />} busy={ssoBusy === 'oauth_google'} disabled={busy || !!ssoBusy} onClick={() => sso('oauth_google')} />
                </div>

                <p className="pt-3 text-center text-[13px]/[18px] text-muted lg:text-left">New to TrainPrompt? This creates your account.</p>

                {/* Clerk mounts its bot check here when a new account is created. */}
                <div id="clerk-captcha" />
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  )
}

function Heading({ top, title, children }: { top?: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 pb-7 lg:gap-3.5 lg:pb-9">
      {top}
      <h1 className="pt-1.5 text-[44px]/[46px] font-semibold tracking-[-0.04em] text-ink lg:text-[56px]/[56px]">{title}</h1>
      <p className="text-[15px]/[22px] text-muted lg:text-[16px]/[24px]">{children}</p>
    </div>
  )
}

function SocialButton({ label, icon, busy, disabled, onClick }: { label: string; icon: ReactNode; busy: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-ground text-[15px]/[18px] font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:opacity-60"
    >
      {busy ? <Spinner className="size-[17px]" /> : icon}
      {label}
    </button>
  )
}

/** Six underlined slots over one real input, so typing, paste and one-time-code autofill all just work. */
function CodeSlots({ value, onChange, disabled, invalid }: { value: string; onChange: (v: string) => void; disabled: boolean; invalid: boolean }) {
  const [focused, setFocused] = useState(true)
  return (
    <div className="relative flex gap-2.5">
      {Array.from({ length: CODE_LENGTH }, (_, i) => {
        const digit = value[i]
        const active = focused && !disabled && i === value.length
        return (
          <div key={i} className="flex flex-1 flex-col" aria-hidden>
            <div className="flex h-14 items-center justify-center font-mono text-[40px]/[48px] font-medium text-ink">
              {digit ?? (active ? <span className="h-[34px] w-0.5 animate-[blink_1s_steps(1)_infinite] bg-red motion-reduce:animate-none" /> : null)}
            </div>
            <div
              className={`transition-colors ${
                active ? 'h-[3px] bg-red' : invalid ? 'mt-px h-0.5 bg-red/50' : digit ? 'mt-px h-0.5 bg-ink' : 'mt-px h-0.5 bg-line'
              }`}
            />
          </div>
        )
      })}
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        aria-label="6-digit code"
        aria-invalid={invalid}
        autoFocus
        value={value}
        readOnly={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-[16px] text-transparent caret-transparent opacity-0 outline-none selection:bg-transparent"
      />
    </div>
  )
}

function Message({ error, children }: { error: string | null; children: ReactNode }) {
  return error ? (
    <p role="alert" className="text-[14px]/[20px] text-red">
      {error}
    </p>
  ) : (
    <p className="text-[13px]/[18px] text-muted" aria-live="polite">
      {children}
    </p>
  )
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
