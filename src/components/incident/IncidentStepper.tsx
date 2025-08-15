'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { config } from '@/lib/config'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  FileText, 
  Brain, 
  Users, 
  MapPin, 
  Calendar,
  Clock,
  Paperclip,
  Copy,
  Download,
  Loader2,
  AlertTriangle,
  ListTodo,
  Mail,
  MessageSquare,
  User,
  BookOpen,
  Shield,
  Search,
  Bell,
  Key
} from 'lucide-react'
import { IncidentBasics, QA, IncidentReport, NextQuestionsResponse } from '@/lib/types/incident'
import { FollowUpQA } from './FollowUpQA'
import { APIKeyInput } from './APIKeyInput'

const steps = [
  { id: 0, title: 'API Configuration', icon: Key, optional: true },
  { id: 1, title: 'Incident Basics', icon: FileText },
  { id: 2, title: 'Additional Details', icon: Users },
  { id: 3, title: 'AI Follow-ups', icon: Brain },
  { id: 4, title: 'Final Report', icon: CheckCircle }
]

interface IncidentStepperProps {
  onComplete?: (report: IncidentReport) => void
}

export function IncidentStepper({ onComplete }: IncidentStepperProps) {
  const [currentStep, setCurrentStep] = useState(() => {
    // Start at step 0 if we need API key, otherwise start at step 1
    const needsAPIKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu_api_key_aqui'
    return needsAPIKey ? 0 : 1
  })
  const [basics, setBasics] = useState<IncidentBasics>({
    whatHappened: '',
    involvedParties: [],
    location: '',
    datetime: '',
    attachments: []
  })
  const [qaHistory, setQaHistory] = useState<QA[]>([])
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [finalReport, setFinalReport] = useState<IncidentReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [involvedPartiesInput, setInvolvedPartiesInput] = useState('')
  const [apiKey, setApiKey] = useState<string>('')
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false)

  const updateBasics = useCallback((field: keyof IncidentBasics, value: any) => {
    setBasics(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAPIKeySet = useCallback((key: string) => {
    setApiKey(key)
    setIsDemoMode(key === 'demo')
    // Move to the next step after setting the key
    setTimeout(() => {
      setCurrentStep(1)
    }, 100)
  }, [])

  const handleInvolvedPartiesChange = useCallback((value: string) => {
    // This function now handles the comma-separated input for backward compatibility
    if (value.includes(',')) {
      const parties = value.split(',').map(p => p.trim()).filter(p => p.length > 0)
      updateBasics('involvedParties', parties)
    }
  }, [updateBasics])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step)
    }
  }, [])

  const getNextQuestions = useCallback(async () => {
    // Validate that we have the required data before making the API call
    if (!basics.whatHappened.trim() || basics.involvedParties.length === 0 || !basics.location.trim() || !basics.datetime) {
      setError('Please complete all required fields before proceeding')
      return
    }

    setIsLoadingQuestions(true)
    setError(null)
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (apiKey && apiKey !== 'demo') {
        headers['x-openai-api-key'] = apiKey
      }

      const response = await fetch('/api/incident-coach/next-questions', {
        method: 'POST',
        headers,
        body: JSON.stringify({ basics, history: qaHistory })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get next questions')
      }

      const data: NextQuestionsResponse = await response.json()
      setCurrentQuestions(data.questions)
      setCurrentQuestionIndex(0) // Reset question index for new questions
      
      if (data.questions.length === 0) {
        // No more questions, ready for final report
        nextStep()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get questions')
    } finally {
      setIsLoadingQuestions(false)
      setIsLoadingMoreQuestions(false)
    }
  }, [basics, qaHistory, nextStep, apiKey])

  const generateFinalReport = useCallback(async () => {
    // Validate that we have the required data before making the API call
    if (!basics.whatHappened.trim() || basics.involvedParties.length === 0 || !basics.location.trim() || !basics.datetime) {
      setError('Please complete all required fields before proceeding')
      return
    }

    setIsGeneratingReport(true)
    setError(null)
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (apiKey && apiKey !== 'demo') {
        headers['x-openai-api-key'] = apiKey
      }

      const response = await fetch('/api/incident-coach/final-report', {
        method: 'POST',
        headers,
        body: JSON.stringify({ basics, qa: qaHistory })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate report')
      }

      const report: IncidentReport = await response.json()
      setFinalReport(report)
      onComplete?.(report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGeneratingReport(false)
    }
  }, [basics, qaHistory, onComplete, apiKey])

  const addQA = useCallback((question: string, answer: string) => {
    const newQA: QA = { question, answer }
    setQaHistory(prev => [...prev, newQA])
    
    // Check if all questions have been answered
    if (qaHistory.length + 1 >= currentQuestions.length) {
      // All questions answered, proceed to report
      setCurrentQuestions([])
      setCurrentQuestionIndex(0)
    }
  }, [qaHistory.length, currentQuestions.length])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [])

  const exportMarkdown = useCallback((report: IncidentReport) => {
    const markdown = `# Incident Report

## Executive Summary
${report.incident_summary}

## Detailed Account
${report.detailed_account}

## Involved Parties
${report.involved_parties.map(party => `- ${party}`).join('\n')}

## Risk Assessment
- **Risk Level**: ${report.risk_level}
- **Risk Types**: ${report.risk_type.join(', ')}

## Recommended Next Steps
${report.recommended_next_steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Company Communication
**Subject**: ${report.company_message.subject}

${report.company_message.body}

## Personalized Messages
${Object.entries(report.personalized_messages).map(([party, message]) => `
### ${party}
**Subject**: ${message.subject}

${message.body}
`).join('\n')}

${report.policy_refs && report.policy_refs.length > 0 ? `
## Policy References
${report.policy_refs.map(policy => `- ${policy}`).join('\n')}
` : ''}

${report.policy_violations && report.policy_violations.length > 0 ? `
## Policy Violations
${report.policy_violations.map((violation, index) => `
### ${violation.policy_id_or_title}
- **Severity**: ${violation.severity}
- **Confidence**: ${Math.round(violation.confidence * 100)}%
- **Policy Text**:
\`\`\`
${violation.policy_text}
\`\`\`
- **Violation Reason**: ${violation.violation_reason}
- **Supporting Facts**:
${violation.supporting_facts.map(fact => `  - ${fact}`).join('\n')}
- **Recommended Remediation**:
${violation.recommended_remediation.map(action => `  - ${action}`).join('\n')}
`).join('\n')}
` : ''}

${report.defense_notes ? `
## Defense Notes
${report.defense_notes}
` : ''}

${report.evidence_summary && report.evidence_summary.length > 0 ? `
## Evidence Summary
${report.evidence_summary.map(evidence => `- ${evidence}`).join('\n')}
` : ''}

${report.notification_requirements && report.notification_requirements.length > 0 ? `
## Notification Requirements
${report.notification_requirements.map(requirement => `- ${requirement}`).join('\n')}
` : ''}

---
*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
*COMPLai Incident Coach - AI-Powered Compliance Platform*
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incident-report-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  useEffect(() => {
    // Detect demo mode on component mount
    const detectDemoMode = async () => {
      try {
        const response = await fetch('/api/incident-coach/config')
        const data = await response.json()
        setIsDemoMode(data.isDemoMode)
      } catch (error) {
        console.warn('Could not detect demo mode:', error)
        setIsDemoMode(true) // Default to demo mode if detection fails
      }
    }
    
    detectDemoMode()
  }, [])

  useEffect(() => {
    if (currentStep === 3 && currentQuestions.length === 0) {
      getNextQuestions()
    }
  }, [currentStep, currentQuestions.length, getNextQuestions])

  // Handle proceeding to report when all questions are answered
  useEffect(() => {
    if (currentStep === 3 && currentQuestions.length === 0 && qaHistory.length > 0) {
      // All questions answered, proceed to report generation
      const timeoutId = setTimeout(() => {
        nextStep() // Go to step 4 (Final Report)
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [currentStep, currentQuestions.length, qaHistory.length, nextStep])

  // Auto-generate report when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && !finalReport && qaHistory.length > 0) {
      generateFinalReport()
    }
  }, [currentStep, finalReport, qaHistory.length, generateFinalReport])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex justify-center">
            <APIKeyInput onKeySet={handleAPIKeySet} minimalDescription />
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">What happened?</h3>
              <p className="text-sm text-gray-600 mt-1">Provide a clear description of the incident</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="whatHappened">Description</Label>
                <Textarea
                  id="whatHappened"
                  placeholder="Describe what happened in detail..."
                  value={basics.whatHappened}
                  onChange={(e) => updateBasics('whatHappened', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="involvedParties">People Involved</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="involvedParties"
                      placeholder="Enter a person's name"
                      value={involvedPartiesInput}
                      onChange={(e) => setInvolvedPartiesInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const value = involvedPartiesInput.trim()
                          if (value && !basics.involvedParties.includes(value)) {
                            updateBasics('involvedParties', [...basics.involvedParties, value])
                            setInvolvedPartiesInput('')
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const value = involvedPartiesInput.trim()
                        if (value && !basics.involvedParties.includes(value)) {
                          updateBasics('involvedParties', [...basics.involvedParties, value])
                          setInvolvedPartiesInput('')
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {basics.involvedParties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {basics.involvedParties.map((party, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {party}
                          <button
                            type="button"
                            onClick={() => {
                              const newParties = basics.involvedParties.filter((_, i) => i !== index)
                              updateBasics('involvedParties', newParties)
                            }}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Type a name and press Enter or click Add. You can also separate multiple names with commas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
              <p className="text-sm text-gray-600 mt-1">Provide location, time, and other relevant information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Where did this happen?"
                  value={basics.location}
                  onChange={(e) => updateBasics('location', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={basics.datetime.split('T')[0] || ''}
                    onChange={(e) => {
                      const time = basics.datetime.split('T')[1] || '00:00'
                      updateBasics('datetime', `${e.target.value}T${time}`)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={basics.datetime.split('T')[1] || ''}
                    onChange={(e) => {
                      const date = basics.datetime.split('T')[0] || new Date().toISOString().split('T')[0]
                      updateBasics('datetime', `${date}T${e.target.value}`)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">AI Follow-up Questions</h3>
              <p className="text-sm text-gray-600 mt-1">
                Answer these questions to help assess the incident and ensure compliance
              </p>
            </div>
            
            {isLoadingQuestions ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                <p className="text-sm text-gray-600 mt-2">Analyzing incident details...</p>
              </div>
            ) : currentQuestions.length > 0 ? (
              <FollowUpQA
                questions={currentQuestions}
                onAnswer={addQA}
                qaHistory={qaHistory}
                currentQuestionIndex={currentQuestionIndex}
                onQuestionIndexChange={setCurrentQuestionIndex}
              />
            ) : (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg font-medium text-gray-900 mt-2">Generating Report...</p>
                <p className="text-sm text-gray-600 mt-1">
                  Please wait while we analyze your responses and create the final report
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Incident Report</h3>
              <p className="text-sm text-gray-600 mt-1">Review and export the generated report</p>
            </div>
            
            {finalReport ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{finalReport.incident_summary}</p>
                  </CardContent>
                </Card>

                {/* Detailed Account Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Detailed Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{finalReport.detailed_account}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Involved Parties Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Involved Parties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {finalReport.involved_parties.map((party, index) => (
                        <Badge key={index} variant="secondary">
                          {party}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                      <Badge 
                        variant={finalReport.risk_level === 'Critical' ? 'destructive' : 
                               finalReport.risk_level === 'High' ? 'destructive' : 
                               finalReport.risk_level === 'Medium' ? 'secondary' : 'default'}
                        className="text-sm font-medium"
                      >
                        {finalReport.risk_level}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Risk Types:</span>
                      <div className="flex flex-wrap gap-2">
                        {finalReport.risk_type.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      Recommended Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {finalReport.recommended_next_steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Company Message Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Company Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="border-b border-gray-300 pb-2">
                          <h4 className="font-medium text-gray-900">Subject: {finalReport.company_message.subject}</h4>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{finalReport.company_message.body}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personalized Messages Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Personalized Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(finalReport.personalized_messages).map(([party, message]) => (
                        <div key={party} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-gray-500" />
                            <h4 className="font-medium text-gray-900">{party}</h4>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="space-y-2">
                              <div className="border-b border-blue-300 pb-2">
                                <h5 className="font-medium text-gray-900">Subject: {message.subject}</h5>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{message.body}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Violations Card */}
                {finalReport.policy_violations && finalReport.policy_violations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Policy Violations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {finalReport.policy_violations.map((violation, index) => (
                          <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{violation.policy_id_or_title}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={violation.severity === 'Critical' || violation.severity === 'High' ? 'destructive' : 
                                           violation.severity === 'Medium' ? 'secondary' : 'default'}
                                  >
                                    {violation.severity}
                                  </Badge>
                                  <Badge variant="outline">
                                    {Math.round(violation.confidence * 100)}% confidence
                                  </Badge>
                                </div>
                              </div>
                              
                                                             <div className="space-y-2">
                                 <div>
                                   <h5 className="text-sm font-medium text-gray-700">Policy Text:</h5>
                                   <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                                     <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{violation.policy_text}</p>
                                   </div>
                                 </div>
                                 
                                 <div>
                                   <h5 className="text-sm font-medium text-gray-700">Violation Reason:</h5>
                                   <p className="text-sm text-gray-600">{violation.violation_reason}</p>
                                 </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Supporting Facts:</h5>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {violation.supporting_facts.map((fact, factIndex) => (
                                      <li key={factIndex}>{fact}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700">Recommended Remediation:</h5>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {violation.recommended_remediation.map((action, actionIndex) => (
                                      <li key={actionIndex}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Defense Notes Card */}
                {finalReport.defense_notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Defense Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{finalReport.defense_notes}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Evidence Summary Card */}
                {finalReport.evidence_summary && finalReport.evidence_summary.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Evidence Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {finalReport.evidence_summary.map((evidence, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-700">{evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Notification Requirements Card */}
                {finalReport.notification_requirements && finalReport.notification_requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {finalReport.notification_requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-orange-500">•</span>
                            <span className="text-gray-700">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Policy References */}
                {finalReport.policy_refs && finalReport.policy_refs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Policy References
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {finalReport.policy_refs.map((ref, index) => (
                          <Badge key={index} variant="outline">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => copyToClipboard(JSON.stringify(finalReport, null, 2))}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JSON
                  </Button>
                  <Button
                    onClick={() => exportMarkdown(finalReport)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Markdown
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                <p className="text-sm text-gray-600 mt-2">Generating report...</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return apiKey && apiKey !== 'demo' // Can proceed if API key is set
      case 1:
        return basics.whatHappened.trim() && basics.involvedParties.length > 0
      case 2:
        return basics.location.trim() && basics.datetime
      case 3:
        return currentQuestions.length === 0
      case 4:
        return true
      default:
        return false
    }
  }

  const canGoBack = () => currentStep > 0

  // Check if we need to show API key step
  const needsAPIKey = (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu_api_key_aqui') && !apiKey
  
  // Elimina el return condicional para currentStep === 0 y needsAPIKey
  // Siempre renderiza el layout del stepper, barra de progreso, navegación y renderStepContent
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 w-full">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center w-full">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto",
                    currentStep > step.id
                      ? "bg-[#6366f1] text-white"
                      : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="mt-1 text-[11px] md:text-xs font-medium text-gray-900 text-center break-words w-full max-w-[80px] leading-tight" title={step.title}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="h-0.5 bg-gray-200 mx-2 flex-1" style={{ minWidth: 12 }} />
              )}
            </div>
          ))}
        </div>
        <Progress value={((currentStep) / (steps.length - 1)) * 100} className="h-2" />
      </div>

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Using simulated AI responses. Add your OpenAI API key to use real AI.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step Content */}
      {needsAPIKey && currentStep === 0 ? (
        <APIKeyInput onKeySet={handleAPIKeySet} minimalDescription />
      ) : (
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={prevStep}
          disabled={!canGoBack()}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {currentStep < steps.length && (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
