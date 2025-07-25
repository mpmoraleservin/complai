'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export function DevModeBanner() {
  const [isVisible, setIsVisible] = useState(true)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Check if we're in mock mode
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url'

  if (!isMockMode) {
    return null
  }

  if (!isVisible) {
    return null
  }

  return (
    <Alert className="border-warning-200 bg-warning-50 text-warning-800">
      <AlertTriangle className="h-4 w-4 text-warning-600" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Development Mode:</strong> Running with mock data. 
          Set up your <code className="bg-warning-100 px-1 rounded">.env.local</code> file 
          with real Supabase credentials for full functionality.
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-warning-600 hover:text-warning-800"
        >
          <X className="h-4 w-4" />
        </button>
      </AlertDescription>
    </Alert>
  )
} 