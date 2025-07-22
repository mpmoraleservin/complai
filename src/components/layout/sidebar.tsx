'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/lib/context/auth-context'
import { 
  FileText, 
  Shield, 
  Users, 
  BarChart3, 
  Home,
  FileCheck,
  X,
  ChevronRight,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
]

export function Sidebar({ className, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthContext()

  // Helper function to get user initials
  const getUserInitials = (email: string) => {
    const name = email.split('@')[0]
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
    }
    return user?.email?.split('@')[0] || 'User'
  }

  return (
    <div className={cn('flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 h-full', className)}>
      {/* Close Button for Mobile - Only show on mobile */}
      {isMobile && onClose && (
        <div className="flex items-center justify-end h-12 border-b border-gray-200 dark:border-gray-700 px-4 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center justify-center">
          <Logo size="xl" />
        </div>
      </div>

      {/* Navigation - Takes remaining space */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                // Close mobile sidebar when clicking a link
                if (isMobile && onClose) {
                  onClose()
                }
              }}
              className={cn(
                'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm border-l-4 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:border-l-4 hover:border-gray-300 dark:hover:border-gray-600'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn('w-5 h-5 mr-3', isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-400 dark:text-gray-500')} />
              {item.name}
            </Link>
          )
        })}
      </nav>



      {/* Compliance Status */}
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Compliance Status</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Your company is fully compliant with current employment laws and internal HR policies.
          </p>
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">89%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full" style={{ width: '89%' }}></div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/settings" className="block">
          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </Link>
      </div>
    </div>
  )
} 