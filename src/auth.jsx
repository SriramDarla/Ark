import { createContext, useContext, useEffect, useState } from 'react'

const API = 'http://localhost:3001'
const AuthCtx = createContext({ user: null, loading: true, logout: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { setUser(d.user); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const logout = () => {
    fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' })
      .then(() => { setUser(null); location.hash = 'login' })
  }

  return <AuthCtx.Provider value={{ user, loading, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
export const API_URL = API
