import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Create a test user
    const testEmail = 'test@complai.com'
    const testPassword = 'test123456'
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      return NextResponse.json({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Test user created successfully',
      user: {
        email: data.user?.email,
        id: data.user?.id,
        emailConfirmed: data.user?.email_confirmed_at
      },
      credentials: {
        email: testEmail,
        password: testPassword
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 