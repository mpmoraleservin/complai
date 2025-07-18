'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useAuthContext } from '@/lib/context/auth-context'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Password strength checker
const checkPasswordStrength = (password: string) => {
  const rules = [
    { name: '8+ characters', test: password.length >= 8 },
    { name: 'Uppercase letter', test: /[A-Z]/.test(password) },
    { name: 'Lowercase letter', test: /[a-z]/.test(password) },
    { name: 'Number', test: /[0-9]/.test(password) },
    { name: 'Special character', test: /[^A-Za-z0-9]/.test(password) },
  ]

  const passed = rules.filter(rule => rule.test).length
  const isStrong = passed === rules.length

  return { rules, passed, total: rules.length, isStrong }
}

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMockMode } = useAuthContext()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const watchedPassword = watch('password', '')
  const passwordStrength = checkPasswordStrength(watchedPassword)

  // Get token from URL
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  useEffect(() => {
    if (!token || type !== 'recovery') {
      setError('Invalid or missing reset token. Please request a new password reset.')
    }
  }, [token, type])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset token')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In mock mode, simulate success
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setSuccess(true)
        setIsLoading(false)
        return
      }

      // TODO: Implement real password reset when Supabase is configured
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: data.password,
          token 
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to reset password')
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been successfully reset."
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Password updated successfully
          </h3>
          <p className="text-gray-600">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <div className="pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Sign in with new password
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below."
    >
      {isMockMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> Password reset is simulated.
          </p>
        </div>
      )}

      {error && !token && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
          <div className="mt-3">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Request new reset link
            </Link>
          </div>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(
                  'w-full px-3 py-2 pr-10 border rounded-md',
                  errors.password && 'border-red-500'
                )}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            {/* Password strength indicator */}
            {watchedPassword && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-gray-600">Password requirements:</p>
                <div className="space-y-1">
                  {passwordStrength.rules.map((rule, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {rule.test ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                      )}
                      <span className={rule.test ? 'text-green-600' : 'text-red-600'}>
                        {rule.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(
                  'w-full px-3 py-2 pr-10 border rounded-md',
                  errors.confirmPassword && 'border-red-500'
                )}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={isLoading || !passwordStrength.isStrong}
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-purple-500 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
} 