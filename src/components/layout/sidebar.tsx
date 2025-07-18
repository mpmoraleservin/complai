'use client'

import { LogoMinimal } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  Shield, 
  Settings, 
  Users, 
  BarChart3, 
  Home,
  FileCheck
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Contracts', href: '/contracts', icon: FileText },
  { name: 'Audit', href: '/audit', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col bg-white border-r border-gray-200 w-64', className)}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <LogoMinimal size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5 mr-3', isActive ? 'text-purple-700' : 'text-gray-400')} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          COMPLai v1.0.0
        </div>
      </div>
    </div>
  )
} 