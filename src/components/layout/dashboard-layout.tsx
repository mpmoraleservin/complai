'use client'

import { Sidebar } from './sidebar'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Full height from top to bottom */}
      <div className={`
        fixed top-0 left-0 z-40 w-64 h-full transform transition-transform duration-300 ease-in-out overflow-hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)}
          isMobile={sidebarOpen}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content - With sidebar offset, no header */}
      <div className="md:pl-64 h-screen overflow-hidden">
        {/* Page content */}
        <main className={`h-full overflow-auto ${className || ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
} 