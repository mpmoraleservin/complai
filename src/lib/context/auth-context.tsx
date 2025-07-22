'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  isMockMode: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ data?: any; error?: any }>
  signUp: (email: string, password: string, userData?: { firstName?: string; lastName?: string; company?: string }) => Promise<{ data?: any; error?: any }>
  signOut: () => Promise<{ error?: any }>
  verifyOtp: (email: string, token: string) => Promise<{ data?: any; error?: any }>
  resendVerification: (email: string) => Promise<{ error?: any }>
  retryProfileCreation: () => Promise<{ data?: any; error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 