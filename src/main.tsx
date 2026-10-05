import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The auth pages carry Clerk, so they load as their own chunk and the landing page stays light.
const AuthApp = lazy(() => import('./auth/AuthApp.tsx'))
const isAuthRoute = /^\/sign-(in|up)(\/|$)/.test(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAuthRoute ? (
      <Suspense fallback={null}>
        <AuthApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
