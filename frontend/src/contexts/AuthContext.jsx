import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { login as loginApi } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken')
    const storedRefresh = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedAccess) setAccessToken(storedAccess)
    if (storedRefresh) setRefreshToken(storedRefresh)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const value = useMemo(() => {
    async function login({ email, password }) {
      const data = await loginApi({ email, password })
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))

      setAccessToken(data.access)
      setRefreshToken(data.refresh)
      setUser(data.user)
      return data.user
    }

    function logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setAccessToken(null)
      setRefreshToken(null)
      setUser(null)
    }

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      role: user?.role ?? null,
      login,
      logout,
    }
  }, [accessToken, refreshToken, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
