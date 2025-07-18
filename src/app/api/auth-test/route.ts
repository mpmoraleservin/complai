import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test basic connection
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // Test environment variables
    const envVars = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      isMockMode: !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                  process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url'
    }

    // Test user registration (this will help us see if there are any users)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .limit(5)

    return NextResponse.json({
      status: 'auth-test',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          emailConfirmed: session.user.email_confirmed_at
        }
      } : null,
      sessionError: sessionError?.message,
      envVars,
      isAuthenticated: !!session,
      users: users || [],
      usersError: usersError?.message
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 