import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in development mode and environment variables are not properly configured
const isDevelopmentMode = process.env.NODE_ENV === 'development'
const hasValidEnvVars = supabaseUrl && 
                       supabaseAnonKey && 
                       supabaseUrl !== 'your_supabase_url' && 
                       supabaseAnonKey !== 'your_supabase_anon_key'

// Singleton instance
let supabaseInstance: any = null

export const createClient = () => {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  // If we're in development and don't have valid env vars, use mock mode
  if (isDevelopmentMode && !hasValidEnvVars) {
    console.warn('⚠️ Supabase environment variables not configured. Using development mock mode.')
    
    // Create and store mock client
    supabaseInstance = {
      auth: {
        signInWithPassword: async (credentials: any) => {
          console.log('🔐 Mock: Sign in with password', credentials)
          return { 
            error: null, 
            data: { 
              user: { 
                id: 'mock-user-id',
                email: credentials.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_at: Date.now() + 3600000
              }
            } 
          }
        },
        signUp: async (credentials: any) => {
          console.log('📝 Mock: Sign up', credentials)
          return { 
            error: null, 
            data: { 
              user: { 
                id: 'mock-user-id',
                email: credentials.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_at: Date.now() + 3600000
              }
            } 
          }
        },
        signInWithOAuth: async (provider: any) => {
          console.log('🔗 Mock: Sign in with OAuth', provider)
          return { error: null, data: { url: '/auth/callback?mock=true' } }
        },
        signOut: async () => {
          console.log('🚪 Mock: Sign out')
          return { error: null }
        },
        getUser: async () => {
          console.log('👤 Mock: Get user')
          return { 
            data: { 
              user: { 
                id: 'mock-user-id',
                email: 'mock@example.com',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            }, 
            error: null 
          }
        },
        verifyOtp: async (params: any) => {
          console.log('✅ Mock: Verify OTP', params)
          return { 
            error: null,
            data: {
              user: { 
                id: 'mock-user-id',
                email: 'mock@example.com'
              },
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_at: Date.now() + 3600000
              }
            }
          }
        },
        resend: async (params: any) => {
          console.log('📧 Mock: Resend verification', params)
          return { error: null }
        },
        getSession: async () => {
          console.log('🔍 Mock: Get session')
          return { 
            data: { 
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_at: Date.now() + 3600000
              }
            }, 
            error: null 
          }
        },
        onAuthStateChange: (callback: any) => {
          console.log('🔄 Mock: Auth state change listener registered')
          return { data: { subscription: { unsubscribe: () => {} } } }
        }
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null })
          }),
          insert: (data: any) => ({ data, error: null }),
          update: (data: any) => ({ data, error: null }),
          delete: () => ({ data: null, error: null })
        }),
        insert: (data: any) => ({ data, error: null }),
        update: (data: any) => ({ data, error: null }),
        delete: () => ({ data: null, error: null })
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: any) => ({ data: { path }, error: null }),
          download: async (path: string) => ({ data: null, error: null }),
          remove: async (paths: string[]) => ({ data: null, error: null })
        })
      }
    } as any
    
    return supabaseInstance
  }

  // If we have valid environment variables, create the real client
  if (hasValidEnvVars) {
    try {
      supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
      return supabaseInstance
    } catch (error) {
      console.error('❌ Error creating Supabase client:', error)
      throw new Error('Failed to create Supabase client')
    }
  }

  // If we're in production and don't have env vars, throw an error
  throw new Error('Supabase environment variables are required in production')
} 