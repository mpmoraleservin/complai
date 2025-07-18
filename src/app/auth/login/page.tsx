'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SocialAuthButton } from '@/components/auth/social-auth-button'
import { useAuthContext } from '@/lib/context/auth-context'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn, isMockMode, user, session } = useAuthContext()

  // Check for error in URL params (from callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Auto-redirect when user is authenticated
  useEffect(() => {
    if (user && session) {
      console.log('User authenticated, redirecting to dashboard...')
      router.push('/dashboard')
    }
  }, [user, session, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Load remember me preference from localStorage
  useEffect(() => {
    const remembered = localStorage.getItem('complai_remember_me') === 'true'
    setValue('rememberMe', remembered)
  }, [setValue])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(data.email, data.password, data.rememberMe)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // The useEffect will handle the redirect automatically
      console.log('Sign in successful, waiting for auth state update...')
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // For now, we'll show a message that OAuth is not available in mock mode
    if (isMockMode) {
      setError('OAuth is not available in development mode. Please use email/password login.')
      return
    }
    
    // TODO: Implement OAuth when we have real Supabase credentials
    setError('OAuth integration coming soon!')
  }

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Welcome back! Please enter your details."
    >
      {isMockMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> You can use any email/password combination to sign in.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              {...register('rememberMe')}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <Label 
              htmlFor="remember" 
              className="text-sm text-gray-600 cursor-pointer select-none"
            >
              Remember for 30 days
            </Label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-purple-500 hover:text-purple-600 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <SocialAuthButton
          provider="google"
          onClick={handleGoogleSignIn}
          className="w-full"
          disabled={isMockMode}
        >
          Sign in with Google
        </SocialAuthButton>

        <div className="text-center">
          <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
          <a
            href="/auth/register"
            className="text-sm text-purple-500 hover:text-purple-600"
          >
            Sign up
          </a>
        </div>
      </form>
    </AuthLayout>
  )
} 