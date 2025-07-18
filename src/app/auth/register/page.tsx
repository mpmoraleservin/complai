'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SocialAuthButton } from '@/components/auth/social-auth-button'
import { useAuthContext } from '@/lib/context/auth-context'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signUp, isMockMode } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signUp(data.email, data.password)

      if (error) {
        setError(error.message)
        return
      }

      // In mock mode, redirect directly to dashboard
      if (isMockMode) {
        router.push('/dashboard')
      } else {
        router.push('/auth/verify')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    // For now, we'll show a message that OAuth is not available in mock mode
    if (isMockMode) {
      setError('OAuth is not available in development mode. Please use email/password registration.')
      return
    }
    
    // TODO: Implement OAuth when we have real Supabase credentials
    setError('OAuth integration coming soon!')
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Please enter your email to get started."
    >
      {isMockMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> You can use any email/password combination to register.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.name && 'border-red-500'
            )}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.email && 'border-red-500'
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.password && 'border-red-500'
            )}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Get started'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <SocialAuthButton
          provider="google"
          onClick={handleGoogleSignUp}
          className="w-full"
          disabled={isMockMode}
        >
          Sign in with Google
        </SocialAuthButton>

        <div className="text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <a
            href="/auth/login"
            className="text-sm text-purple-500 hover:text-purple-600"
          >
            Log in
          </a>
        </div>
      </form>
    </AuthLayout>
  )
} 