'use client'

import { Sidebar } from './sidebar'

interface SimpleLayoutProps {
  children: React.ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="layout-container bg-gray-50">
      <div className="flex h-full">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
} 