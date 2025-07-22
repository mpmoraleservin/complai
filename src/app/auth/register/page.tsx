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
import { Eye, EyeOff } from 'lucide-react'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
      console.log('🚀 Starting registration process...')
      const { data: signUpData, error } = await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company
      })

      if (error) {
        console.error('❌ Registration error:', error)
        
        // Provide more specific error messages
        let errorMessage = error.message
        if (error.message.includes('Database error')) {
          errorMessage = 'Registration successful! Profile creation failed, but you can still sign in. You can create your profile later in Account Settings.'
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password must be at least 8 characters long.'
        }
        
        setError(errorMessage)
        return
      }

      console.log('✅ Registration successful, redirecting...')
      
      // In mock mode, redirect directly to dashboard
      if (isMockMode) {
        router.push('/dashboard')
      } else {
        router.push('/auth/verify')
      }
    } catch (err) {
      console.error('❌ Unexpected error during registration:', err)
      setError('An unexpected error occurred. Please try again.')
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
        <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-md">
          <p className="text-sm text-warning-800">
            <strong>Development Mode:</strong> You can use any email/password combination to register.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              className={cn(
                'w-full px-3 py-2 border rounded-md',
                errors.firstName && 'border-destructive-500'
              )}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              className={cn(
                'w-full px-3 py-2 border rounded-md',
                errors.lastName && 'border-destructive-500'
              )}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">
            Company Name <span className="text-destructive-500">*</span>
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Enter your company name"
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.company && 'border-destructive-500'
            )}
            {...register('company')}
          />
          {errors.company && (
            <p className="text-sm text-destructive-500">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              errors.email && 'border-destructive-500'
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                'w-full px-3 py-2 pr-10 border rounded-md',
                errors.password && 'border-destructive-500'
              )}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                'w-full px-3 py-2 pr-10 border rounded-md',
                errors.confirmPassword && 'border-destructive-500'
              )}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive-500 text-center">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-600 text-white"
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
            className="text-sm text-primary-500 hover:text-primary-600"
          >
            Log in
          </a>
        </div>
      </form>
    </AuthLayout>
  )
} 