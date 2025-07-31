'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Eye, Edit, Trash2, Download, Share, Archive, UserCheck, UserX } from 'lucide-react'

export interface TableAction {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'destructive' | 'warning' | 'info' | 'success'
  disabled?: boolean
}

interface TableActionsProps {
  actions: TableAction[]
  className?: string
}

export function TableActions({ actions, className = '' }: TableActionsProps) {
  const getActionClassName = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50'
      case 'warning':
        return 'text-warning-600 hover:text-warning-700 hover:bg-warning-50'
      case 'info':
        return 'text-info-600 hover:text-info-700 hover:bg-info-50'
      case 'success':
        return 'text-success-600 hover:text-success-700 hover:bg-success-50'
      default:
        return 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }
  }

  if (actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => (
          <div key={action.label}>
            <DropdownMenuItem
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center ${getActionClassName(action.variant)}`}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Predefined action sets for common use cases
export const createViewAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'View Details',
  icon: Eye,
  onClick,
  variant: 'info',
  disabled
})

export const createEditAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Edit',
  icon: Edit,
  onClick,
  variant: 'warning',
  disabled
})

export const createDeleteAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Delete',
  icon: Trash2,
  onClick,
  variant: 'destructive',
  disabled
})

export const createDownloadAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Download',
  icon: Download,
  onClick,
  disabled
})

export const createShareAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Share',
  icon: Share,
  onClick,
  disabled
})

export const createArchiveAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Archive',
  icon: Archive,
  onClick,
  variant: 'warning',
  disabled
})

export const createAcknowledgeAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Mark as Acknowledged',
  icon: UserCheck,
  onClick,
  variant: 'default',
  disabled
})

export const createUnacknowledgeAction = (onClick: () => void, disabled = false): TableAction => ({
  label: 'Mark as Pending',
  icon: UserX,
  onClick,
  variant: 'warning',
  disabled
}) 