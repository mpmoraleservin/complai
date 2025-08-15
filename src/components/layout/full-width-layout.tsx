'use client'

import { Sidebar } from './sidebar'

interface FullWidthLayoutProps {
  children: React.ReactNode
}

export function FullWidthLayout({ children }: FullWidthLayoutProps) {
  return (
    <div className="layout-container bg-gray-50">
      <div className="flex h-full">
        <Sidebar />
        <main className="main-content w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
