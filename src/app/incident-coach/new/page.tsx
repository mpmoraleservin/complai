'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { AlertCircle, Users, Calendar, MapPin, FileText, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Mock employee data
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@complai.io', role: 'Product Designer' },
  { id: 2, name: 'Jane Smith', email: 'jane@complai.io', role: 'Product Manager' },
  { id: 3, name: 'Mike Johnson', email: 'mike@complai.io', role: 'Senior Developer' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@complai.io', role: 'UX Designer' },
  { id: 5, name: 'David Brown', email: 'david@complai.io', role: 'Marketing Manager' },
  { id: 6, name: 'Emma Davis', email: 'emma@complai.io', role: 'HR Specialist' },
]

export default function NewIncidentPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [formData, setFormData] = useState({
    employees: [] as number[],
    description: '',
    date: '',
    time: '',
    location: '',
    how: ''
  })
  const [result, setResult] = useState({
    riskLevel: 'medium',
    riskFactor: 'Moderate Risk - HR Intervention Needed',
    riskDetails: 'This incident requires HR intervention and formal documentation',
    nextSteps: [
      'Draft an email to involved parties',
      'Create a detailed log report',
      'Schedule follow-up meeting with HR',
      'Monitor the situation closely',
      'Update incident tracking system'
    ]
  })

  const handleEmployeeToggle = (employeeId: number) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.includes(employeeId)
        ? prev.employees.filter(id => id !== employeeId)
        : [...prev.employees, employeeId]
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Simulate AI analysis
    const riskLevel = formData.description.toLowerCase().includes('harassment') || 
                     formData.description.toLowerCase().includes('discrimination') ||
                     formData.description.toLowerCase().includes('violence') ||
                     formData.description.toLowerCase().includes('threat') ||
                     formData.description.toLowerCase().includes('assault') ||
                     formData.description.toLowerCase().includes('bullying')
      ? 'high'
      : formData.description.toLowerCase().includes('conflict') ||
        formData.description.toLowerCase().includes('dispute') ||
        formData.description.toLowerCase().includes('argument') ||
        formData.description.toLowerCase().includes('yelling') ||
        formData.description.toLowerCase().includes('inappropriate') ||
        formData.description.toLowerCase().includes('unprofessional')
      ? 'medium'
      : 'low'

    const riskFactor = riskLevel === 'high' 
      ? 'High Risk - Immediate Action Required'
      : riskLevel === 'medium'
      ? 'Moderate Risk - HR Intervention Needed'
      : 'Low Risk - Monitor and Document'

    const riskDetails = riskLevel === 'high'
      ? 'This incident requires immediate attention and may involve legal implications. Contact HR immediately.'
      : riskLevel === 'medium'
      ? 'This incident requires HR intervention and formal documentation'
      : 'This incident should be monitored and documented for future reference'

    const nextSteps = riskLevel === 'high' 
      ? [
          'Contact HR immediately',
          'Document all details thoroughly',
          'Separate involved parties if necessary',
          'Consider legal consultation',
          'Prepare for potential investigation'
        ]
      : riskLevel === 'medium'
      ? [
          'Draft an email to involved parties',
          'Create a detailed log report',
          'Schedule follow-up meeting with HR',
          'Monitor the situation closely',
          'Update incident tracking system'
        ]
      : [
          'Document the incident',
          'Schedule informal discussion',
          'Monitor for escalation',
          'Update incident log'
        ]

    setResult({
      riskLevel,
      riskFactor,
      riskDetails,
      nextSteps
    })
    setStep('result')
  }

  const handleNewIncident = () => {
    setStep('form')
    setFormData({
      employees: [],
      description: '',
      date: '',
      time: '',
      location: '',
      how: ''
    })
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-destructive-600 bg-destructive-100'
      case 'medium':
        return 'text-warning-600 bg-warning-100'
      case 'low':
        return 'text-success-600 bg-success-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-destructive-600" />
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-warning-600" />
      case 'low':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <SimpleLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/incident-coach')}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">New Incident</h1>
                  <p className="text-gray-600 mt-2">
                    Log a new workplace incident to receive AI-powered guidance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {step === 'form' ? (
            /* Incident Form */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Log New Incident
                </CardTitle>
                <CardDescription>
                  Provide details about the incident to receive guidance and next steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employees Involved */}
                <div>
                  <Label className="text-base font-medium">Which employees were involved?</Label>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.employees.includes(employee.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleEmployeeToggle(employee.id)}
                      >
                        <div className={`w-4 h-4 rounded border-2 mr-3 ${
                          formData.employees.includes(employee.id)
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.employees.includes(employee.id) && (
                            <div className="w-full h-full bg-white rounded-sm"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incident Description */}
                <div>
                  <Label htmlFor="description" className="text-base font-medium">What happened?</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the incident in detail..."
                    className="mt-2 resize-none"
                    rows={4}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-base font-medium">When did it happen?</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-base font-medium">What time?</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Where did it happen?</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Conference Room A, Break room, Office, Remote meeting"
                    className="mt-2"
                  />
                </div>

                {/* How it happened */}
                <div>
                  <Label htmlFor="how" className="text-base font-medium">How did it happen?</Label>
                  <Textarea
                    id="how"
                    value={formData.how}
                    onChange={(e) => handleInputChange('how', e.target.value)}
                    placeholder="Describe the circumstances and context..."
                    className="mt-2 resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.description.trim() || formData.employees.length === 0}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Analyze Incident
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Results */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getRiskLevelIcon(result.riskLevel)}
                  <span className="ml-2">Incident Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your incident with recommended next steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Risk Assessment */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.riskLevel)}`}>
                        {result.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Factor:</span>
                      <p className="font-medium text-gray-900 mt-1">{result.riskFactor}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Details:</span>
                      <p className="text-gray-700 mt-1">{result.riskDetails}</p>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h3>
                  <div className="space-y-3">
                    {result.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleNewIncident}
                  >
                    Log Another Incident
                  </Button>
                  <Button
                    onClick={() => router.push('/incident-coach')}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Back to Incidents
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
} 