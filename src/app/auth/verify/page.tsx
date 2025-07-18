'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useAuthContext } from '@/lib/context/auth-context'
import { cn } from '@/lib/utils'

export default function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('test@complai.com') // Default email for testing
  const [showMagicLinkInfo, setShowMagicLinkInfo] = useState(false)
  const router = useRouter()
  const { verifyOtp, resendVerification, isMockMode } = useAuthContext()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      setError('Please enter a complete 6-digit code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await verifyOtp(email, verificationCode)

      if (error) {
        setError(error.message)
        return
      }

      // In mock mode, redirect directly to dashboard
      if (isMockMode) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const { error } = await resendVerification(email)

    if (error) {
      setError(error.message)
    }
  }

  return (
    <AuthLayout
      title="Please check your email."
      subtitle={`We've sent a verification link to ${email}`}
    >
      {isMockMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> You can use any 6-digit code to verify.
          </p>
        </div>
      )}

      {/* Magic Link Information */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          📧 Magic Link Verification
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          Supabase sent you a magic link instead of a code. Click the link in your email to verify your account.
        </p>
        <div className="text-sm text-blue-700">
          <p><strong>What to do:</strong></p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Check your email inbox</li>
            <li>Look for an email from Supabase</li>
            <li>Click the verification link in the email</li>
            <li>You'll be automatically redirected to the dashboard</li>
          </ol>
        </div>
      </div>

      {/* Alternative: Manual Code Entry */}
      <div className="mb-4">
        <button
          onClick={() => setShowMagicLinkInfo(!showMagicLinkInfo)}
          className="text-sm text-purple-500 hover:text-purple-600 underline"
        >
          {showMagicLinkInfo ? 'Hide' : 'Show'} manual code entry
        </button>
      </div>

      {showMagicLinkInfo && (
        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-12 h-12 text-center text-xl font-semibold border-2 rounded-md',
                  'focus:border-purple-500 focus:ring-purple-500',
                  digit && 'border-purple-500 text-purple-500'
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={isLoading || code.some(digit => !digit)}
          >
            {isLoading ? 'Verifying...' : 'Verify with Code'}
          </Button>
        </div>
      )}

      <div className="text-center">
        <span className="text-sm text-gray-600">Didn&apos;t get the email? </span>
        <button
          onClick={handleResend}
          className="text-sm text-purple-500 hover:text-purple-600 underline"
        >
          Click to resend.
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500 text-center">{error}</div>
      )}

      <div className="text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <a
          href="/auth/login"
          className="text-sm text-purple-500 hover:text-purple-600"
        >
          Log in
        </a>
      </div>
    </AuthLayout>
  )
} 