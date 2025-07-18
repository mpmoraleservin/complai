import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { password, token } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // If token is 'session', the user is already authenticated
    if (token === 'session') {
      // Update password for the current user
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { message: 'Password updated successfully' },
        { status: 200 }
      )
    }

    // For token-based updates (legacy or direct access)
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required for this operation' },
        { status: 400 }
      )
    }

    // Update password using the recovery token
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      console.error('Password update error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in update-password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 