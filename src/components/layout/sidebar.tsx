'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  Shield, 
  Settings, 
  Users, 
  BarChart3, 
  Home,
  FileCheck,
  X,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/lib/context/auth-context'
import { useState } from 'react'

interface SidebarProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Contracts', href: '/contracts', icon: FileText },
  { name: 'Audit', href: '/audit', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ className, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuthContext()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to sign out?')
    if (!confirmed) return

    setIsSigningOut(true)
    
    try {
      const { error } = await signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        alert('Failed to sign out. Please try again.')
        return
      }

      // Redirect to login page
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      alert('An unexpected error occurred while signing out.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className={cn('flex flex-col bg-white border-r border-gray-200 w-64 h-full', className)}>
      {/* Close Button for Mobile */}
      {isMobile && onClose && (
        <div className="flex items-center justify-end h-12 border-b border-gray-200 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
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
                  ? 'bg-purple-100 text-purple-700 shadow-sm border-l-4 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-l-4 hover:border-gray-300'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn('w-5 h-5 mr-3', isActive ? 'text-purple-700' : 'text-gray-400')} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          COMPLai v1.0.0
        </div>
      </div>
    </div>
  )
} 