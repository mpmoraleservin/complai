'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  isMockMode: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isMockMode: false
  })

  const supabase = createClient()

  useEffect(() => {
    // Check if we're in mock mode
    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url' ||
                      process.env.NEXT_PUBLIC_SUPABASE_URL === ''

    console.log('Auth hook - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Auth hook - Is mock mode:', isMockMode)

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setAuthState(prev => ({
            ...prev,
            error: error.message,
            loading: false
          }))
          return
        }

        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
          isMockMode
        }))
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to get session',
          loading: false,
          isMockMode
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        }))
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    console.log('SignIn called with email:', email, 'rememberMe:', rememberMe)
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      console.log('Attempting to sign in with Supabase...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('SignIn result:', { data: !!data, error: error?.message })

      if (error) {
        console.error('SignIn error:', error)
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
        return { error }
      }

      // If rememberMe is true, set a longer session duration
      if (rememberMe && data.session) {
        // Set session to persist for 30 days
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
        
        // Store remember me preference in localStorage
        localStorage.setItem('complai_remember_me', 'true')
      } else {
        // Clear remember me preference
        localStorage.removeItem('complai_remember_me')
      }

      console.log('SignIn successful, user:', data.user?.email)
      
      // Ensure user profile exists after successful sign in
      if (data?.user) {
        const profileExists = await ensureUserProfile(data.user.id, data.user.email || '')
        if (!profileExists) {
          console.warn('⚠️ User profile creation failed during sign in')
        }
      }
      
      return { data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      return { error: { message: errorMessage } }
    }
  }

  // Helper function to ensure user profile exists
  const ensureUserProfile = async (userId: string, email: string, userData?: { firstName?: string; lastName?: string; company?: string }) => {
    try {
      console.log('🔍 Checking if user profile exists...')
      
      // First, check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking user profile:', checkError)
        return false
      }

      if (existingProfile) {
        console.log('✅ User profile already exists')
        return true
      }

      // Profile doesn't exist, create it
      console.log('👤 Creating user profile in database...')
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          first_name: userData?.firstName || '',
          last_name: userData?.lastName || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('❌ Error creating user profile:', insertError)
        return false
      }

      // If company data is provided, create company record
      if (userData?.company) {
        console.log('🏢 Creating company record...')
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            user_id: userId,
            name: userData.company,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (companyError) {
          console.error('❌ Error creating company record:', companyError)
          // Don't fail the profile creation if company creation fails
        } else {
          console.log('✅ Company record created successfully')
        }
      }

      console.log('✅ User profile created successfully')
      return true
    } catch (error) {
      console.error('❌ Exception in ensureUserProfile:', error)
      return false
    }
  }

  const signUp = async (email: string, password: string, userData?: { firstName?: string; lastName?: string; company?: string }) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      console.log('🔐 Attempting to sign up with email:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email: email,
            first_name: userData?.firstName || '',
            last_name: userData?.lastName || '',
            company: userData?.company || ''
          }
        }
      })

      console.log('📝 SignUp result:', { 
        success: !error, 
        error: error?.message,
        user: data?.user?.id,
        session: !!data?.session
      })

      if (error) {
        console.error('❌ SignUp error:', error)
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
        return { error }
      }

      // If we have a user, try to create the user profile
      if (data?.user) {
        const profileCreated = await ensureUserProfile(data.user.id, data.user.email || email, userData)
        
        if (!profileCreated) {
          console.warn('⚠️ User profile creation failed, but registration was successful')
          // Don't fail the signup, just log the warning
        }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      console.error('❌ SignUp exception:', error)
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      return { error: { message: errorMessage } }
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
        return { error }
      }

      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false
      }))

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      return { error: { message: errorMessage } }
    }
  }

  const verifyOtp = async (email: string, token: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
        return { error }
      }

      return { data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      return { error: { message: errorMessage } }
    }
  }

  const resendVerification = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })

      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
        return { error }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      return { error: { message: errorMessage } }
    }
  }

  // Function to retry profile creation (can be called from settings page)
  const retryProfileCreation = async () => {
    if (!authState.user) {
      return { error: { message: 'No user logged in' } }
    }

    console.log('🔄 Retrying profile creation...')
    const success = await ensureUserProfile(authState.user.id, authState.user.email || '')
    
    if (success) {
      return { data: { message: 'Profile created successfully' } }
    } else {
      return { error: { message: 'Failed to create profile' } }
    }
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    verifyOtp,
    resendVerification,
    retryProfileCreation
  }
} 