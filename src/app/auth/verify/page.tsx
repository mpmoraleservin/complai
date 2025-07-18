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
  const [email, setEmail] = useState('olivia@untitledui.com') // This should come from the previous step
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
      subtitle={`We've sent a code to ${email}`}
    >
      {isMockMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> You can use any 6-digit code to verify.
          </p>
        </div>
      )}

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

        <div className="text-center">
          <span className="text-sm text-gray-600">Didn&apos;t get a code? </span>
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

        <Button
          onClick={handleVerify}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          disabled={isLoading || code.some(digit => !digit)}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <a
            href="/auth/login"
            className="text-sm text-purple-500 hover:text-purple-600"
          >
            Log in
          </a>
        </div>
      </div>
    </AuthLayout>
  )
} 