import { useState, useCallback, useMemo } from 'react'
import { IncidentFormData, AIQuestion, AIAnalysisResult } from '@/lib/types'

const initialFormData: IncidentFormData = {
  // Step 1: People Involved
  directlyInvolved: [],
  indirectlyInvolved: [],
  relationshipDescription: '',
  
  // Step 2: Incident Details
  whatHappened: '',
  where: '',
  when: '',
  circumstances: '',
  
  // Step 3: AI Analysis Results
  riskLevel: 'low',
  riskAssessment: '',
  aiRecommendations: [],
  nextSteps: [],
  complianceIssues: [],
  employeeHistory: []
}

// Mock employees for the report generation
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@complai.io', role: 'Product Designer', handbookStatus: 'Acknowledged' },
  { id: 2, name: 'Jane Smith', email: 'jane@complai.io', role: 'Product Manager', handbookStatus: 'Acknowledged' },
  { id: 3, name: 'Mike Johnson', email: 'mike@complai.io', role: 'Senior Developer', handbookStatus: 'Pending' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@complai.io', role: 'UX Designer', handbookStatus: 'Acknowledged' },
  { id: 5, name: 'David Brown', email: 'david@complai.io', role: 'Marketing Manager', handbookStatus: 'Pending' },
  { id: 6, name: 'Emma Davis', email: 'emma@complai.io', role: 'HR Specialist', handbookStatus: 'Acknowledged' },
]

export const useIncidentForm = () => {
  const [formData, setFormData] = useState<IncidentFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [incidentReport, setIncidentReport] = useState<any>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const updateField = useCallback((field: keyof IncidentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step)
    }
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setAiQuestions([])
    setAiAnalysis(null)
    setIsAnalyzing(false)
    setIncidentReport(null)
    setIsGeneratingReport(false)
  }, [])

  const generateAIQuestions = useCallback(() => {
    // Simulate AI generating contextual questions based on incident details
    const questions: AIQuestion[] = []
    
    if (formData.whatHappened.toLowerCase().includes('harassment') || 
        formData.whatHappened.toLowerCase().includes('discrimination')) {
      questions.push({
        id: 'harassment-type',
        question: 'What type of harassment or discrimination occurred?',
        type: 'multiple-choice',
        options: ['Verbal', 'Physical', 'Visual', 'Written', 'Other'],
        required: true,
        context: 'Understanding the nature of harassment helps determine appropriate response'
      })
    }
    
    if (formData.whatHappened.toLowerCase().includes('conflict') || 
        formData.whatHappened.toLowerCase().includes('dispute')) {
      questions.push({
        id: 'conflict-resolution',
        question: 'Have there been previous attempts to resolve this conflict?',
        type: 'yes-no',
        required: true,
        context: 'Previous resolution attempts inform the escalation process'
      })
    }
    
    if (formData.directlyInvolved.length > 1) {
      questions.push({
        id: 'power-dynamic',
        question: 'Is there a power dynamic between the involved parties?',
        type: 'yes-no',
        required: true,
        context: 'Power dynamics can affect how incidents should be handled'
      })
    }
    
    if (formData.where.toLowerCase().includes('public') || 
        formData.where.toLowerCase().includes('client')) {
      questions.push({
        id: 'public-impact',
        question: 'Were clients or customers present during the incident?',
        type: 'yes-no',
        required: true,
        context: 'Public incidents may require different handling procedures'
      })
    }
    
    // Default questions for all incidents
    questions.push(
      {
        id: 'witnesses',
        question: 'Were there any witnesses to the incident?',
        type: 'yes-no',
        required: true,
        context: 'Witnesses can provide additional context and verification'
      },
      {
        id: 'immediate-response',
        question: 'What immediate action was taken when the incident occurred?',
        type: 'text',
        required: true,
        context: 'Understanding immediate response helps assess risk level'
      },
      {
        id: 'previous-incidents',
        question: 'Have there been similar incidents with these employees?',
        type: 'yes-no',
        required: true,
        context: 'Pattern recognition helps determine appropriate disciplinary action'
      }
    )
    
    setAiQuestions(questions)
  }, [formData.whatHappened, formData.directlyInvolved.length, formData.where])

  const determineRiskLevel = useCallback((): 'low' | 'medium' | 'high' => {
    const description = formData.whatHappened.toLowerCase()
    const location = formData.where.toLowerCase()
    const involvedCount = formData.directlyInvolved.length + formData.indirectlyInvolved.length
    
    // High risk indicators
    if (description.includes('harassment') || 
        description.includes('discrimination') ||
        description.includes('violence') ||
        description.includes('threat') ||
        description.includes('assault') ||
        description.includes('bullying')) {
      return 'high'
    }
    
    // Medium risk indicators
    if (description.includes('conflict') ||
        description.includes('dispute') ||
        description.includes('argument') ||
        description.includes('yelling') ||
        description.includes('inappropriate') ||
        description.includes('unprofessional') ||
        (location.includes('public') || location.includes('client'))) {
      return 'medium'
    }
    
    // Low risk for minor incidents
    return 'low'
  }, [formData.whatHappened, formData.where, formData.directlyInvolved.length, formData.indirectlyInvolved.length])

  const generateAnalysisResult = useCallback((riskLevel: 'low' | 'medium' | 'high'): AIAnalysisResult => {
    const baseRecommendations = [
      'Document all details thoroughly',
      'Follow up with involved parties',
      'Monitor for escalation'
    ]
    
    const riskSpecificRecommendations = {
      high: [
        'Immediate HR intervention required',
        'Consider legal consultation',
        'Separate involved parties if necessary',
        'Prepare for potential investigation',
        'Notify appropriate authorities if required'
      ],
      medium: [
        'HR intervention recommended',
        'Schedule mediation if appropriate',
        'Implement conflict resolution training',
        'Monitor workplace environment'
      ],
      low: [
        'Informal discussion recommended',
        'Document for future reference',
        'Provide coaching if needed'
      ]
    }
    
    const riskAssessment = {
      high: 'This incident requires immediate attention and may involve legal implications. Contact HR immediately.',
      medium: 'This incident requires HR intervention and formal documentation. Monitor closely for escalation.',
      low: 'This incident should be monitored and documented for future reference. Consider informal resolution.'
    }
    
    const nextSteps = {
      high: [
        'Contact HR immediately',
        'Document all details thoroughly',
        'Separate involved parties if necessary',
        'Consider legal consultation',
        'Prepare for potential investigation'
      ],
      medium: [
        'Schedule HR meeting within 24 hours',
        'Document incident details',
        'Interview involved parties separately',
        'Monitor for escalation',
        'Implement preventive measures'
      ],
      low: [
        'Document the incident',
        'Schedule informal discussion',
        'Monitor for escalation',
        'Update incident log'
      ]
    }
    
    return {
      riskLevel,
      riskAssessment: riskAssessment[riskLevel],
      recommendations: [...baseRecommendations, ...riskSpecificRecommendations[riskLevel]],
      nextSteps: nextSteps[riskLevel],
      complianceIssues: ['Documentation requirements', 'Reporting timelines'],
      employeeHistory: [
        'Review previous incident reports',
        'Check performance history',
        'Assess training completion status',
        'Review handbook acknowledgment status'
      ],
      handbookPolicies: riskLevel === 'high' 
        ? ['Code of Conduct', 'Anti-Harassment Policy', 'Disciplinary Procedures', 'Legal Compliance Requirements']
        : riskLevel === 'medium'
        ? ['Code of Conduct', 'Anti-Harassment Policy', 'Conflict Resolution Policy', 'Workplace Behavior Standards']
        : ['Code of Conduct', 'Anti-Harassment Policy'],
      suggestedActions: riskLevel === 'high'
        ? ['Document incident', 'Follow up with parties', 'Legal consultation', 'Regulatory reporting', 'Investigation initiation']
        : riskLevel === 'medium'
        ? ['Document incident', 'Follow up with parties', 'HR intervention', 'Mediation scheduling', 'Training implementation']
        : ['Document incident', 'Follow up with parties']
    }
  }, [])

  const analyzeIncident = useCallback(async (): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate AI analysis based on incident details
    const riskLevel = determineRiskLevel()
    const analysis = generateAnalysisResult(riskLevel)
    
    setAiAnalysis(analysis)
    setIsAnalyzing(false)
    
    return analysis
  }, [determineRiskLevel, generateAnalysisResult])

  const generateIncidentReport = useCallback(async (): Promise<any> => {
    if (!aiAnalysis) return null
    
    setIsGeneratingReport(true)
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const report = {
      id: `INC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      summary: `A workplace incident occurred involving ${formData.directlyInvolved.length + formData.indirectlyInvolved.length} employee(s). The incident has been classified as a ${aiAnalysis?.riskLevel} risk situation requiring immediate attention and proper documentation.`,
      involvedParties: {
        directlyInvolved: mockEmployees.filter(emp => formData.directlyInvolved.includes(emp.id)).map(emp => ({
          name: emp.name,
          role: emp.role,
          email: emp.email,
          handbookStatus: emp.handbookStatus,
          involvement: 'Primary participant'
        })),
        indirectlyInvolved: mockEmployees.filter(emp => formData.indirectlyInvolved.includes(emp.id)).map(emp => ({
          name: emp.name,
          role: emp.role,
          email: emp.email,
          handbookStatus: emp.handbookStatus,
          involvement: 'Witness or affected party'
        })),
        totalInvolved: formData.directlyInvolved.length + formData.indirectlyInvolved.length
      },
      incidentTimeline: {
        occurrence: formData.when,
        reporting: new Date().toISOString(),
        immediateResponse: 'Documented and reported to HR',
        nextSteps: aiAnalysis?.nextSteps || [],
        estimatedResolution: aiAnalysis?.riskLevel === 'high' ? '2-4 weeks' : aiAnalysis?.riskLevel === 'medium' ? '1-2 weeks' : '3-5 business days'
      },
      riskAssessment: {
        riskLevel: aiAnalysis?.riskLevel || 'low',
        riskScore: aiAnalysis?.riskLevel === 'high' ? 80 : aiAnalysis?.riskLevel === 'medium' ? 50 : 20,
        factors: [
          ...(formData.where.toLowerCase().includes('public') ? ['Public visibility'] : []),
          ...(formData.directlyInvolved.length > 1 ? ['Multiple parties involved'] : []),
          ...(formData.whatHappened.toLowerCase().includes('harassment') ? ['Harassment allegations'] : []),
          ...(formData.whatHappened.toLowerCase().includes('discrimination') ? ['Discrimination claims'] : [])
        ],
        immediateActions: aiAnalysis?.riskLevel === 'high' 
          ? ['Separate parties immediately', 'Contact HR leadership', 'Consider legal consultation']
          : aiAnalysis?.riskLevel === 'medium'
          ? ['Document thoroughly', 'Schedule HR meeting', 'Monitor situation']
          : ['Document incident', 'Informal resolution', 'Follow up'],
        escalationPath: aiAnalysis?.riskLevel === 'high' 
          ? 'HR Director → Legal → Executive Team'
          : aiAnalysis?.riskLevel === 'medium'
          ? 'HR Manager → HR Director'
          : 'HR Specialist → HR Manager'
      },
      handbookViolations: {
        totalViolations: 0,
        violations: [],
        complianceScore: 100
      },
      complianceIssues: {
        documentationRequired: ['Incident report', 'Witness statements', 'Employee interviews'],
        reportingDeadlines: aiAnalysis?.riskLevel === 'high' 
          ? { immediate: 'Within 24 hours', formal: 'Within 48 hours', investigation: 'Within 72 hours' }
          : { immediate: 'Within 48 hours', formal: 'Within 1 week', investigation: 'Within 2 weeks' },
        regulatoryRequirements: ['OSHA reporting (if applicable)', 'State labor board notification'],
        internalPolicies: ['Incident reporting procedure', 'Investigation protocol', 'Disciplinary action guidelines']
      },
      recommendedActions: {
        immediate: aiAnalysis?.nextSteps?.slice(0, 3) || [],
        shortTerm: ['Complete investigation', 'Implement corrective actions', 'Update policies if needed'],
        longTerm: ['Conduct training sessions', 'Review handbook policies', 'Establish monitoring systems'],
        preventive: ['Regular policy reviews', 'Employee training programs', 'Conflict resolution workshops']
      },
      followUpSchedule: {
        '24h': ['Initial documentation', 'HR notification'],
        '48h': ['Follow-up interviews', 'Evidence collection'],
        '1 week': ['Investigation completion', 'Action plan development'],
        '2 weeks': ['Corrective action implementation', 'Policy review'],
        '1 month': ['Effectiveness assessment', 'Training implementation'],
        ...(aiAnalysis?.riskLevel === 'high' ? { 'immediate': ['Separate parties', 'Legal consultation', 'Regulatory notification'] } : {})
      },
      legalConsiderations: {
        considerations: ['Documentation preservation', 'Confidentiality maintenance', 'Due process rights'],
        requiresLegalReview: aiAnalysis?.riskLevel === 'high',
        documentationRetention: '7 years minimum',
        confidentialityLevel: 'High - HR and Legal only'
      },
      preventionMeasures: {
        training: ['Anti-harassment training', 'Conflict resolution workshops', 'Policy awareness sessions'],
        policyUpdates: ['Review and update handbook', 'Clarify reporting procedures', 'Enhance investigation protocols'],
        monitoring: ['Regular workplace assessments', 'Employee feedback surveys', 'Incident trend analysis'],
        communication: ['Open door policy', 'Regular team meetings', 'Anonymous reporting channels']
      }
    }
    
    setIncidentReport(report)
    setIsGeneratingReport(false)
    
    return report
  }, [aiAnalysis, formData])

  // Memoize the return object to prevent unnecessary re-renders
  const memoizedReturn = useMemo(() => ({
    formData,
    currentStep,
    aiQuestions,
    aiAnalysis,
    isAnalyzing,
    incidentReport,
    isGeneratingReport,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    generateAIQuestions,
    analyzeIncident,
    generateIncidentReport
  }), [
    formData,
    currentStep,
    aiQuestions,
    aiAnalysis,
    isAnalyzing,
    incidentReport,
    isGeneratingReport,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    generateAIQuestions,
    analyzeIncident,
    generateIncidentReport
  ])

  return memoizedReturn
}
