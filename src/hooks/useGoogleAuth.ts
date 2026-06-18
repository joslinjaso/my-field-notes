import { useState, useEffect, useRef } from 'react'
import { GOOGLE_CLIENT_ID, SCOPES } from '../lib/google'

export interface GoogleToken {
  access_token: string
  expires_in: number
  obtainedAt: number
}

export function useGoogleAuth() {
  const [token, setToken] = useState<GoogleToken | null>(null)
  const clientRef = useRef<google.accounts.oauth2.TokenClient | null>(null)

  useEffect(() => {
    const init = () => {
      clientRef.current = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
          if (resp.error) return
          setToken({
            access_token: resp.access_token,
            expires_in: Number(resp.expires_in),
            obtainedAt: Date.now(),
          })
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

  return { token, signIn, isSignedIn }
}
