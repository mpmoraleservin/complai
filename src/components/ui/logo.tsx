import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={cn('font-bold', sizeClasses[size], className)}>
      <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
        COMPL
      </span>
      <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
        ai
      </span>
    </div>
  )
}

// Alternative minimal logo for small spaces
export function LogoMinimal({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xs' }) {
  const sizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={cn('font-bold', sizeClasses[size], className)}>
      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        COMPLai
      </span>
    </div>
  )
} 