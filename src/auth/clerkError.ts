/** Pulls a code and a readable message out of whatever Clerk throws or returns. Same shape as the app's helper. */
export function clerkError(e: unknown): { code?: string; message: string } {
  const err = e as {
    code?: string
    message?: string
    longMessage?: string
    errors?: { code?: string; message?: string; longMessage?: string }[]
  } | null
  const first = err?.errors?.[0]
  const code = first?.code ?? err?.code
  return { code, message: friendly(code) ?? first?.longMessage ?? first?.message ?? err?.longMessage ?? err?.message ?? 'Something went wrong. Try again.' }
}

function friendly(code?: string): string | undefined {
  switch (code) {
    case 'form_code_incorrect':
      return "That code isn't right. Check the email and try again."
    case 'verification_expired':
      return 'That code has expired. Send a new one.'
    case 'verification_failed':
    case 'too_many_requests':
      return 'Too many attempts. Wait a moment and send a new code.'
    case 'form_param_format_invalid':
    case 'form_identifier_invalid':
      return 'Enter a valid email address.'
    default:
      return undefined
  }
}
