'use client'

import { Header } from './header'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full width above sidebar */}
      <Header 
        className="sticky top-0 z-40" 
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Below header */}
      <div className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)}
          isMobile={sidebarOpen}
        />
      </div>

      {/* Main content - Below header, with sidebar offset */}
      <div className="pt-16 md:pl-64">
        {/* Page content */}
        <main className={className}>
          {children}
        </main>
      </div>
    </div>
  )
} 