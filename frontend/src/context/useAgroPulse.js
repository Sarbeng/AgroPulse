import { createContext, useContext } from 'react'

export const AgroPulseContext = createContext(null)

export function useAgroPulse() {
  const ctx = useContext(AgroPulseContext)
  if (!ctx) throw new Error('useAgroPulse must be used within AgroPulseProvider')
  return ctx
}
