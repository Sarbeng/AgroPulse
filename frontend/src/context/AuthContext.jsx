import { useCallback, useMemo, useState } from 'react'
import {
  USER_ROLES,
  clearStoredUser,
  loadStoredUser,
  saveStoredUser,
} from '../data/auth'
import { api, tryApi } from '../services/api'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser())
  const loading = false

  const login = useCallback(async ({ email, password }) => {
    const result = await tryApi(
      () => api.login({ email, password }),
      () => {
        const stored = loadStoredUser()
        if (stored?.email === email) return stored
        return null
      },
    )
    if (!result) throw new Error('No account found. Please sign up first.')
    setUser(result)
    saveStoredUser(result)
    return result
  }, [])

  const signup = useCallback(async ({ name, email, password, role, phone }) => {
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '',
      createdAt: new Date().toISOString(),
    }

    const result = await tryApi(
      () => api.signup({ ...newUser, password }),
      () => newUser,
    )

    setUser(result)
    saveStoredUser(result)
    return result
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearStoredUser()
  }, [])

  const roleConfig = useMemo(
    () => (user ? USER_ROLES[user.role] : null),
    [user],
  )

  const value = {
    user,
    loading,
    roleConfig,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
