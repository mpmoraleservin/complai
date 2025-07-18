import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white' | 'minimal'
}

export function Logo({ className, size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const getLogoColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white'
      case 'minimal':
        return 'text-gray-900'
      default:
        return 'text-purple-600'
    }
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Modern Shield with AI/Compliance Symbol */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Shield Background */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('w-full h-full', getLogoColor())}
        >
          {/* Shield shape */}
          <path
            d="M12 2L3 6V12C3 16.4183 6.58172 20 11 20C15.4183 20 19 16.4183 19 12V6L12 2Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* AI/Compliance symbol inside shield */}
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Small dots representing AI/technology */}
          <circle cx="8" cy="8" r="0.5" fill="currentColor" />
          <circle cx="16" cy="8" r="0.5" fill="currentColor" />
          <circle cx="12" cy="6" r="0.5" fill="currentColor" />
        </svg>
      </div>
      
      {/* Text Logo */}
      <div className={cn('font-bold tracking-tight', textSizes[size], getLogoColor())}>
        <span className="text-purple-600">COMPL</span>
        <span className="text-gray-700">ai</span>
      </div>
    </div>
  )
}

// Alternative minimal logo for small spaces
export function LogoMinimal({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xs' }) {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn('w-full h-full text-purple-600')}
      >
        {/* Simplified shield with checkmark */}
        <path
          d="M12 2L3 6V12C3 16.4183 6.58172 20 11 20C15.4183 20 19 16.4183 19 12V6L12 2Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
} 