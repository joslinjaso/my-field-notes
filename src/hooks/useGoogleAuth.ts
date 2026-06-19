import { useState, useEffect, useRef } from 'react'
import { GOOGLE_CLIENT_ID, SCOPES } from '../lib/google'

const ALLOWED_EMAIL = 'jason.joslin1@gmail.com'
const STORAGE_KEY = 'field-notes-token'

export interface GoogleToken {
  access_token: string
  expires_in: number
  obtainedAt: number
}

function loadStoredToken(): GoogleToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const t: GoogleToken = JSON.parse(raw)
    if (Date.now() - t.obtainedAt >= (t.expires_in - 60) * 1000) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return t
  } catch {
    return null
  }
}

export function useGoogleAuth() {
  const [token, setToken] = useState<GoogleToken | null>(loadStoredToken)
  const [unauthorized, setUnauthorized] = useState(false)
  const clientRef = useRef<google.accounts.oauth2.TokenClient | null>(null)

  useEffect(() => {
    const init = () => {
      clientRef.current = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          if (resp.error) return
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${resp.access_token}` },
          })
          const { email } = await res.json()
          if (email !== ALLOWED_EMAIL) {
            setUnauthorized(true)
            localStorage.removeItem(STORAGE_KEY)
            return
          }
          const t: GoogleToken = {
            access_token: resp.access_token,
            expires_in: Number(resp.expires_in),
            obtainedAt: Date.now(),
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(t))
          setUnauthorized(false)
          setToken(t)
        },
      })
    }

    if (typeof google !== 'undefined') {
      init()
    } else {
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      script?.addEventListener('load', init)
    }
  }, [])

  const signIn = () => {
    const t = token
    if (t && Date.now() - t.obtainedAt < (t.expires_in - 60) * 1000) return
    clientRef.current?.requestAccessToken()
  }

  const isSignedIn = !!(
    token &&
    Date.now() - token.obtainedAt < (token.expires_in - 60) * 1000
  )

  return { token, signIn, isSignedIn, unauthorized }
}
