'use client'

import { FullWidthLayout } from '@/components/layout'
import { IncidentStepper } from '@/components/incident/IncidentStepper'
import { IncidentReport } from '@/lib/types/incident'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function NewIncidentPage() {
  const handleComplete = (report: IncidentReport) => {
    console.log('Incident report completed:', report)
    // Handle completion - could redirect to dashboard, show success message, etc.
  }

  return (
    <FullWidthLayout>
      <div className="container mx-auto py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.location.assign('/incident-coach')}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">New Incident Report</h1>
                <p className="text-gray-600 mt-2">
                  Use our AI-powered incident coach to create a comprehensive report
                </p>
              </div>
            </div>
          </div>
                  
        <IncidentStepper onComplete={handleComplete} />
      </div>
    </FullWidthLayout>
  )
} 