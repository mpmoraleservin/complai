'use client'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/lib/context/auth-context'
import { LogOut, User, Menu } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const { user, signOut, isMockMode } = useAuthContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <header className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Empty for now */}
        <div className="flex items-center space-x-4">
          {/* Logo moved to sidebar */}
        </div>

        {/* Navigation and User Menu - Right side */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              {isMockMode && (
                <span className="px-2 py-1 bg-warning-100 text-warning-800 text-xs rounded-full">
                  Mock Mode
                </span>
              )}
            </div>
          )}

          {/* Sign Out Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick || (() => setIsMenuOpen(!isMenuOpen))}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          {user && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
              {isMockMode && (
                <span className="px-2 py-1 bg-warning-100 text-warning-800 text-xs rounded-full">
                  Mock Mode
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}