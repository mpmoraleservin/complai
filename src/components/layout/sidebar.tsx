'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

import { 
  FileText, 
  Shield, 
  Users, 
  BarChart3, 
  Home,
  FileCheck,
  X,
  ChevronRight,
  Crown,
  BookOpen,
  AlertCircle,
  Scale,
  User,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Team', href: '/team', icon: Users },
  { name: 'Handbook', href: '/handbook', icon: BookOpen },
  { name: 'Incident Coach', href: '/incident-coach', icon: AlertCircle },
  { name: 'Legal Updates', href: '/legal-updates', icon: Scale },
]

export function Sidebar({ className, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // For prototype: simply redirect to login
    // In production, this would clear auth tokens, cookies, etc.
    router.push('/login')
  }

  return (
    <div className={cn('sidebar-container flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 overflow-hidden', className)}>
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
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-hidden min-h-0">
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

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/profile"
          onClick={() => {
            // Close mobile sidebar when clicking a link
            if (isMobile && onClose) {
              onClose()
            }
          }}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              HR Manager
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleLogout()
            }}
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </Button>
        </Link>
      </div>

    </div>
  )
} 