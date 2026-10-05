import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The auth pages carry Clerk, so they load as their own chunk and the landing page stays light.
const AuthApp = lazy(() => import('./auth/AuthApp.tsx'))
const LegalPage = lazy(() => import('./legal/LegalPage.tsx'))

const path = window.location.pathname.replace(/\/+$/, '')
const isAuthRoute = /^\/sign-(in|up)(\/|$)/.test(path)
const legalDoc = path === '/privacy' ? 'privacy' : path === '/terms' ? 'terms' : null

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAuthRoute ? (
      <Suspense fallback={null}>
        <AuthApp />
      </Suspense>
    ) : legalDoc ? (
      <Suspense fallback={null}>
        <LegalPage doc={legalDoc} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
