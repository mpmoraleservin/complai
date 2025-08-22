'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { DemoAI } from '@/lib/ai/demo'
import { FollowUpQA } from './FollowUpQA'
import { APIKeyInput } from './APIKeyInput'

const steps = [
  { id: 0, title: 'API Configuration', icon: Key, optional: true },
  { id: 1, title: 'Incident Information', icon: FileText },
  { id: 2, title: 'AI Follow-up Questions', icon: Brain },
  { id: 3, title: 'Incident Report', icon: CheckCircle }
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
  
  // Generate demo data for better user experience
  const generateDemoData = (): IncidentBasics => {
    const demoIncidents = [
      {
        whatHappened: "Verbal altercation between two employees in the break room. One employee was shouting and using inappropriate language towards another employee. The incident was witnessed by several other employees who reported feeling uncomfortable.",
        involvedParties: ["John Smith", "Maria Garcia"],
        location: "Break Room - 2nd Floor",
        datetime: new Date().toISOString().split('T')[0] + 'T14:30',
        attachments: [],
        isConfidential: false
      },
      {
        whatHappened: "Employee reported feeling uncomfortable due to repeated comments about their appearance from a colleague during team meetings. The behavior has been ongoing for several weeks despite previous informal requests to stop.",
        involvedParties: ["Sarah Johnson", "Mike Thompson"],
        location: "Conference Room A",
        datetime: new Date().toISOString().split('T')[0] + 'T10:15',
        attachments: [],
        isConfidential: true
      },
      {
        whatHappened: "Dispute over project ownership and credit for work completed. Both employees claim they did the majority of the work and are threatening to escalate the matter to senior management. The conflict is affecting team productivity.",
        involvedParties: ["Alex Chen", "Emily Rodriguez"],
        location: "Open Office Area",
        datetime: new Date().toISOString().split('T')[0] + 'T16:45',
        attachments: [],
        isConfidential: false
      },
      {
        whatHappened: "Employee reported receiving inappropriate text messages from a supervisor outside of work hours. The messages contain personal comments and requests that make the employee uncomfortable.",
        involvedParties: ["Lisa Wang", "David Miller"],
        location: "Digital Communication",
        datetime: new Date().toISOString().split('T')[0] + 'T20:00',
        attachments: [],
        isConfidential: true
      },
      {
        whatHappened: "Physical altercation in the parking lot after work hours. Two employees got into a heated argument that escalated to pushing and shoving. Security was called to intervene.",
        involvedParties: ["Robert Davis", "Carlos Mendez"],
        location: "Employee Parking Lot",
        datetime: new Date().toISOString().split('T')[0] + 'T17:30',
        attachments: [],
        isConfidential: false
      }
    ]
    
    // Randomly select one of the demo incidents
    const randomIndex = Math.floor(Math.random() * demoIncidents.length)
    return demoIncidents[randomIndex]
  }
  
  const [basics, setBasics] = useState<IncidentBasics>({
    whatHappened: '',
    involvedParties: [],
    location: '',
    datetime: new Date().toISOString(), // Default to current date and time
    attachments: [],
    isConfidential: false
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
  const [totalTokenUsage, setTotalTokenUsage] = useState({
    totalTokens: 0,
    totalCost: 0,
    questionsTokens: 0,
    questionsCost: 0,
    reportTokens: 0,
    reportCost: 0
  })

  // Calculate OpenAI costs (same pricing as backend - GPT-4o mini)
  const calculateCost = useCallback((promptTokens: number, completionTokens: number, cachedTokens: number = 0) => {
    const regularInputTokens = promptTokens - cachedTokens;
    const inputCost = regularInputTokens * (0.60 / 1000000);
    const cachedCost = cachedTokens * (0.30 / 1000000);
    const outputCost = completionTokens * (2.40 / 1000000);
    return inputCost + cachedCost + outputCost;
  }, []);

  // Pricing reference for display
  const PRICING_REFERENCE = "Pricing: Input $0.60/1M tokens, Cached $0.30/1M tokens, Output $2.40/1M tokens";

  const updateBasics = useCallback((field: keyof IncidentBasics, value: any) => {
    setBasics(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAPIKeySet = useCallback((key: string) => {
    setApiKey(key)
    
    // Only set demo mode if user explicitly chooses it
    if (key === 'demo') {
      setIsDemoMode(true)
      const demoData = generateDemoData()
      setBasics(demoData)
      // Clear the input field since we now have demo data
      setInvolvedPartiesInput('')
    } else {
      // User provided a real API key, ensure demo mode is off
      setIsDemoMode(false)
    }
    
    // Move to the next step after setting the key
    setTimeout(() => {
      setCurrentStep(1)
    }, 100)
  }, [])

  const refreshDemoData = useCallback(() => {
    const demoData = generateDemoData()
    // Always use current date/time when refreshing demo data
    demoData.datetime = new Date().toISOString()
    setBasics(demoData)
    setInvolvedPartiesInput('')
    // Clear QA history when refreshing demo data
    setQaHistory([])
  }, [])

  // Generate markdown report for download
  const generateMarkdownReport = useCallback((report: IncidentReport): string => {
    return `# Incident Report

## Executive Summary
${report.incident_summary}

## Detailed Account
${report.detailed_account}

## Involved Parties
${report.involved_parties.join(', ')}

## Risk Assessment
- **Risk Level:** ${report.risk_level}
- **Risk Types:** ${report.risk_type.join(', ')}

## Recommended Next Steps
${report.recommended_next_steps.map(step => `- ${step}`).join('\n')}

## Company Message
**Subject:** ${report.company_message.subject}

${report.company_message.body}

## Personalized Messages
${Object.entries(report.personalized_messages).map(([name, message]) => `
### ${name}
**Subject:** ${message.subject}

${message.body}
`).join('\n')}

---
*Generated on ${new Date().toLocaleDateString()}*
`
  }, [])

  // Generate automatic answers for demo mode
  const generateDemoAnswers = useCallback((questions: string[]): QA[] => {
    const answers = [
      "Yes, the incident was immediately reported to HR as per company policy. A formal incident report was filed within 24 hours of the occurrence.",
      "The incident occurred in a semi-public area where other employees could potentially witness the behavior. There were approximately 3-4 witnesses present.",
      "This type of behavior has not been reported before involving these specific employees. However, there have been previous concerns about workplace communication standards.",
      "The immediate response included separating the parties involved, documenting initial statements, and ensuring the safety of all employees present.",
      "Supporting documentation includes witness statements, security camera footage (if available), and the initial incident report filed by the reporting employee.",
      "The behavior appears to violate our Anti-Harassment Policy, Code of Conduct, and Professional Behavior Standards as outlined in the employee handbook.",
      "The incident has affected team productivity and created an uncomfortable work environment for other employees in the vicinity.",
      "All relevant evidence has been preserved, including electronic communications, witness statements, and any physical evidence related to the incident."
    ]
    
    return questions.map((question, index) => ({
      question,
      answer: answers[index % answers.length] || "This information has been documented and will be included in the investigation."
    }))
  }, [])

  const handleInvolvedPartiesChange = useCallback((value: string) => {
    // This function now handles the comma-separated input for backward compatibility
    if (value.includes(',')) {
      const parties = value.split(',').map(p => p.trim()).filter(p => p.length > 0)
      updateBasics('involvedParties', parties)
    }
  }, [updateBasics])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }, [])

  const generateFinalReport = useCallback(async () => {
    // Validate that we have the required data before making the API call
    if (!basics.whatHappened.trim() || basics.involvedParties.length === 0 || !basics.location.trim() || !basics.datetime) {
      setError('Please complete all required fields before proceeding')
      return
    }

    setIsGeneratingReport(true)
    setError(null)
    
    try {
      // Use demo mode if enabled
      if (isDemoMode) {
        const demoAI = new DemoAI();
        const report = await demoAI.generateFinalReport(basics, qaHistory);
        setFinalReport(report)
        onComplete?.(report)
      } else {
        // Use real API
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

        const data: IncidentReport & { _usage?: any } = await response.json()
        const { _usage, ...report } = data
      setFinalReport(report)
        
        // Track token usage for final report
        if (_usage) {
        const cost = calculateCost(_usage.prompt_tokens, _usage.completion_tokens);
        setTotalTokenUsage(prev => ({
          ...prev,
          reportTokens: prev.reportTokens + _usage.total_tokens,
          reportCost: prev.reportCost + cost,
          totalTokens: prev.totalTokens + _usage.total_tokens,
          totalCost: prev.totalCost + cost
        }));
        
        // Log comprehensive summary
        const newTotals = {
          totalTokens: totalTokenUsage.totalTokens + _usage.total_tokens,
          totalCost: totalTokenUsage.totalCost + cost,
          questionsTokens: totalTokenUsage.questionsTokens,
          questionsCost: totalTokenUsage.questionsCost,
          reportTokens: totalTokenUsage.reportTokens + _usage.total_tokens,
          reportCost: totalTokenUsage.reportCost + cost
        };
        
        console.log('💰 INCIDENT COACH - COMPLETE COST BREAKDOWN:');
        console.log('=====================================');
        console.log(`📋 Questions Generation:`);
        console.log(`   Tokens: ${newTotals.questionsTokens}`);
        console.log(`   Cost: $${newTotals.questionsCost.toFixed(6)}`);
        console.log(`📊 Report Generation:`);
        console.log(`   Tokens: ${newTotals.reportTokens}`);
        console.log(`   Cost: $${newTotals.reportCost.toFixed(6)}`);
        console.log(`🎯 TOTAL PROCESS:`);
        console.log(`   Total Tokens: ${newTotals.totalTokens}`);
        console.log(`   Total Cost: $${newTotals.totalCost.toFixed(6)}`);
        console.log(`   Cost per Token: $${(newTotals.totalCost / newTotals.totalTokens).toFixed(8)}`);
        console.log(`💵 ${PRICING_REFERENCE}`);
        console.log('=====================================');
        }
      onComplete?.(report)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGeneratingReport(false)
    }
  }, [basics, qaHistory, onComplete, apiKey, calculateCost, totalTokenUsage, PRICING_REFERENCE, isDemoMode])

  const getNextQuestions = useCallback(async () => {
    // Validate that we have the required data before making the API call
    if (!basics.whatHappened.trim() || basics.involvedParties.length === 0 || !basics.location.trim() || !basics.datetime) {
      setError('Please complete all required fields before proceeding')
      return
    }

    setIsLoadingQuestions(true)
    setError(null)
    
    try {
        // Use demo mode if enabled
        if (isDemoMode) {
          const demoAI = new DemoAI();
          const data = await demoAI.getNextQuestions(basics, qaHistory);
          
          setCurrentQuestions(data.questions)
          setCurrentQuestionIndex(0) // Reset question index for new questions
          
          // In demo mode, pre-fill answers and auto-advance immediately
          if (data.questions.length > 0) {
            const demoAnswers = generateDemoAnswers(data.questions)
            setQaHistory(prev => [...prev, ...demoAnswers])
            // Auto-advance to report generation immediately after showing questions
            setTimeout(() => {
              setCurrentQuestions([])
              setCurrentQuestionIndex(0)
              generateFinalReport()
            }, 1500) // Show questions briefly (1.5 seconds) then generate report
          } else if (data.questions.length === 0) {
            // No more questions, ready for Incident Report
            generateFinalReport()
          }
        } else {
          // Use real API
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
        throw new Error(errorData.error || 'Failed to get questions')
      }

          const data: NextQuestionsResponse & { usage?: any } = await response.json()
      setCurrentQuestions(data.questions)
      setCurrentQuestionIndex(0) // Reset question index for new questions
      
          // Track token usage for questions
          if (data.usage) {
            const cost = calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens);
            setTotalTokenUsage(prev => ({
              ...prev,
              questionsTokens: prev.questionsTokens + data.usage.total_tokens,
              questionsCost: prev.questionsCost + cost,
              totalTokens: prev.totalTokens + data.usage.total_tokens,
              totalCost: prev.totalCost + cost
            }));
          }

          if (data.questions.length === 0) {
        // No more questions, ready for Incident Report
        generateFinalReport()
          }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get questions')
    } finally {
      setIsLoadingQuestions(false)
      setIsLoadingMoreQuestions(false)
    }
  }, [basics, qaHistory, apiKey, isDemoMode, generateDemoAnswers, generateFinalReport, calculateCost])

  const addQA = useCallback((question: string, answer: string) => {
    // If empty question/answer, it means we're ready to proceed (demo mode)
    if (!question && !answer) {
      setCurrentQuestions([])
      setCurrentQuestionIndex(0)
      // Generate final report after clearing questions
      generateFinalReport()
      return
    }
    
    const newQA: QA = { question, answer }
    setQaHistory(prev => [...prev, newQA])
    
    // Check if all questions have been answered
    if (qaHistory.length + 1 >= currentQuestions.length) {
      // All questions answered, proceed to report
      setCurrentQuestions([])
      setCurrentQuestionIndex(0)
      // Generate final report immediately - no delay needed
      generateFinalReport()
    }
  }, [qaHistory.length, currentQuestions.length, generateFinalReport])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [])

  const downloadIncidentReportForm = useCallback((report: IncidentReport) => {
    const formHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Incident Report Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4a5568;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 25px;
            border-collapse: collapse;
            width: 100%;
        }
        .section-header {
            background-color: #6366f1;
            color: white;
            font-weight: bold;
            padding: 12px;
            font-size: 16px;
        }
        .form-row {
            border: 1px solid #ccc;
        }
        .form-row td {
            border: 1px solid #ccc;
            padding: 10px;
            vertical-align: top;
        }
        .label {
            background-color: #f1f5f9;
            font-weight: bold;
            width: 200px;
        }
        .input-field {
            background-color: white;
            min-height: 20px;
        }
        .large-input {
            min-height: 60px;
        }
        .signature-section {
            margin-top: 30px;
        }
        .signature-row {
            border: 1px solid #ccc;
        }
        .signature-row td {
            border: 1px solid #ccc;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            width: 50%;
        }
        .received-section {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Incident Report Form</h1>
        <p>Employees should use this form to report work-related incidents to HR.</p>
    </div>

    <table class="section">
        <tr>
            <td class="section-header" colspan="4">Employee Information</td>
        </tr>
        <tr class="form-row">
            <td class="label">Name</td>
            <td class="input-field">${report.general_information?.reporterName || 'John Doe'}</td>
            <td class="label">Employee ID</td>
            <td class="input-field">EMP-001</td>
        </tr>
        <tr class="form-row">
            <td class="label">Job title</td>
            <td class="input-field">${report.general_information?.reporterRole || 'HR Manager'}</td>
            <td class="label">Department</td>
            <td class="input-field">Human Resources</td>
        </tr>
        <tr class="form-row">
            <td class="label">Supervisor</td>
            <td class="input-field">Jane Smith</td>
            <td class="label">Date</td>
            <td class="input-field">${new Date().toLocaleDateString()}</td>
        </tr>
    </table>

    <table class="section">
        <tr>
            <td class="section-header" colspan="3">Incident Details</td>
        </tr>
        <tr class="form-row">
            <td class="label">Date</td>
            <td class="input-field">${report.incident_details?.incidentDateTime ? new Date(report.incident_details.incidentDateTime).toLocaleDateString() : new Date().toLocaleDateString()}</td>
            <td class="label">Time</td>
            <td class="input-field">${report.incident_details?.incidentDateTime ? new Date(report.incident_details.incidentDateTime).toLocaleTimeString() : '2:30 PM'}</td>
            <td class="label">Location</td>
            <td class="input-field">${report.incident_details?.location || 'Office Building'}</td>
        </tr>
        <tr class="form-row">
            <td class="label">Witnesses (if applicable)</td>
            <td class="input-field large-input" colspan="5">
                ${report.parties_involved?.witnesses?.map(w => w.name).join(', ') || 'None reported'}
            </td>
        </tr>
        <tr class="form-row">
            <td class="label">Description of the incident</td>
            <td class="input-field large-input" colspan="5">
                ${report.incident_details?.description || report.incident_summary || ''}
            </td>
        </tr>
        <tr class="form-row">
            <td class="label">Immediate actions taken</td>
            <td class="input-field large-input" colspan="5">
                ${report.recommended_next_steps?.slice(0, 2).join('; ') || 'Incident reported to HR immediately'}
            </td>
        </tr>
        <tr class="form-row">
            <td class="label">Root cause of the incident</td>
            <td class="input-field large-input" colspan="5">
                ${report.incident_details?.contextBackground || 'To be determined through investigation'}
            </td>
        </tr>
    </table>

    <table class="section">
        <tr>
            <td class="section-header">Follow-up actions</td>
        </tr>
        <tr class="form-row">
            <td class="input-field large-input">
                ${report.recommended_next_steps?.slice(2).join('; ') || 'Investigation to be conducted; Corrective actions to be determined based on findings'}
            </td>
        </tr>
    </table>

    <table class="signature-section">
        <tr class="signature-row">
            <td>Employee signature</td>
            <td>Supervisor signature</td>
        </tr>
        <tr class="signature-row">
            <td style="height: 60px;"></td>
            <td style="height: 60px;"></td>
        </tr>
    </table>

    <table class="section received-section">
        <tr>
            <td class="section-header" colspan="3">Received by</td>
        </tr>
        <tr class="form-row">
            <td class="label">Name</td>
            <td class="input-field" colspan="2"></td>
        </tr>
        <tr class="form-row">
            <td class="label">Date</td>
            <td class="input-field"></td>
            <td class="label">Signature</td>
            <td class="input-field"></td>
        </tr>
    </table>

    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>COMPLai Incident Coach - AI-Powered Compliance Platform</p>
    </div>
</body>
</html>`

    const blob = new Blob([formHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incident-report-form-${report.general_information?.incidentId || new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const exportMarkdown = useCallback((report: IncidentReport) => {
    const markdown = `# Comprehensive Incident Report

## 1. Incident Score
${report.incident_score ? `
**Total Score**: ${report.incident_score.totalScore}/100  
**Risk Level**: ${report.incident_score.riskLevel}

### Scoring Factors
${report.incident_score.factors?.map(factor => 
`- **${factor.factor}** (${Math.round(factor.weight * 100)}% weight): ${factor.score}/5 = ${Math.round(factor.weightedScore)} points
  - ${factor.criteria}`
).join('\n') || ''}

**Explanation**: ${report.incident_score.explanation}
` : 'Score calculation not available'}

## 2. General Information
${report.general_information ? `
- **Incident ID**: ${report.general_information.incidentId}
- **Report Date & Time**: ${new Date(report.general_information.reportDateTime).toLocaleString()}
- **Reporter**: ${report.general_information.reporterName} (${report.general_information.reporterRole})
- **Contact**: ${report.general_information.reporterContact}
- **Relationship to Incident**: ${report.general_information.relationshipToIncident}
- **Confidentiality**: ${basics.isConfidential ? 'CONFIDENTIAL - Restricted Access' : 'Standard Processing'}

### Parties Involved
${report.parties_involved ? `
${report.parties_involved.complainants?.length > 0 ? `**Complainant(s):**
${report.parties_involved.complainants.map(party => `- ${party.name} (${party.relationship || 'Employee'})`).join('\n')}
` : ''}
${report.parties_involved.accused_subjects?.length > 0 ? `**Accused/Subject(s):**
${report.parties_involved.accused_subjects.map(party => `- ${party.name} (${party.relationship || 'Employee'})`).join('\n')}
` : ''}
${report.parties_involved.witnesses?.length > 0 ? `**Witnesses:**
${report.parties_involved.witnesses.map(party => `- ${party.name} (${party.relationship || 'Employee'})`).join('\n')}
` : ''}
` : 'Party information not available'}
` : 'General information not available'}

## 3. Incident Details
${report.incident_details ? `
- **Date & Time of Incident**: ${new Date(report.incident_details.incidentDateTime).toLocaleString()}
- **Location**: ${report.incident_details.location}
- **Description**: ${report.incident_details.description}
- **How Reporter Became Aware**: ${report.incident_details.howReporterBecameAware}
${report.incident_details.contextBackground ? `- **Context/Background**: ${report.incident_details.contextBackground}` : ''}
` : 'Incident details not available'}

## 4. Impact & Consequences
${report.impact_consequences ? `
### Immediate Impact
${report.impact_consequences.immediateImpact.map(impact => `- ${impact}`).join('\n')}

- **Medical Treatment Required**: ${report.impact_consequences.medicalTreatmentRequired ? 'Yes' : 'No'}
${report.impact_consequences.medicalTreatmentDetails ? `  - Details: ${report.impact_consequences.medicalTreatmentDetails}` : ''}
- **Law Enforcement Contacted**: ${report.impact_consequences.lawEnforcementContacted ? 'Yes' : 'No'}
${report.impact_consequences.lawEnforcementDetails ? `  - Details: ${report.impact_consequences.lawEnforcementDetails}` : ''}
` : 'Impact assessment not available'}

## 5. Policy & Documentation Cross-Check
${report.policy_cross_check ? `
- **Relevant Handbook Sections**: ${report.policy_cross_check.relevantPolicySections.join(', ')}
- **Policies Violated**: ${report.policy_cross_check.policiesViolated ? 'Yes' : 'No'}
${report.policy_cross_check.violatedPolicies?.length ? `  - Violated Policies: ${report.policy_cross_check.violatedPolicies.join(', ')}` : ''}
- **Prior Related Incidents**: ${report.policy_cross_check.priorRelatedIncidents ? 'Yes' : 'No'}
${report.policy_cross_check.priorIncidentDates?.length ? `  - Prior Incident Dates: ${report.policy_cross_check.priorIncidentDates.join(', ')}` : ''}

### Last Policy Acknowledgment Dates
${Object.entries(report.policy_cross_check.lastAcknowledgmentDates).map(([party, date]) => `- ${party}: ${date}`).join('\n')}
` : 'Policy cross-check not available'}

---

## Executive Summary
${report.incident_summary}

## Detailed Account
${report.detailed_account}

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
*COMPLai Incident Coach - AI-Powered Legal Compliance Platform*
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
  }, [basics.isConfidential])

  useEffect(() => {
    // Only detect demo mode if we're not in the API configuration step
    // and if the user hasn't explicitly set a mode yet
    if (currentStep > 0 && !apiKey) {
      const detectDemoMode = async () => {
        try {
          const response = await fetch('/api/incident-coach/config')
          const data = await response.json()
          setIsDemoMode(data.isDemoMode)
        } catch (error) {
          console.warn('Could not detect demo mode:', error)
          // Don't set demo mode automatically - let user choose
        }
      }
      
      detectDemoMode()
    }
  }, [currentStep, apiKey])

  useEffect(() => {
    // Only get questions if we're on step 2, have no current questions, AND no QA history
    // This prevents re-generating questions after they've been answered
    if (currentStep === 2 && currentQuestions.length === 0 && qaHistory.length === 0) {
      getNextQuestions()
    }
  }, [currentStep, currentQuestions.length, qaHistory.length, getNextQuestions])

  // Auto-advance to final report step after report is generated
  useEffect(() => {
    if (finalReport && currentStep === 2) {
      // Report generated, advance to final report step
      nextStep()
    }
  }, [finalReport, currentStep, nextStep])

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
              <h3 className="text-lg font-semibold text-gray-900">Incident Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                {isDemoMode && currentStep > 0
                  ? "All fields are pre-filled with sample data. You can modify them or generate new demo data."
                  : "Provide complete information about the incident"
                }
              </p>
              {isDemoMode && currentStep > 0 && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={refreshDemoData}
                    className="text-xs"
                  >
                    🔄 Generate New Demo Data
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Incident Basics Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">What Happened</h4>
                <div>
                  <Label htmlFor="whatHappened">Description</Label>
                  <Textarea
                    id="whatHappened"
                    placeholder="Describe what happened in detail..."
                    value={basics.whatHappened}
                    onChange={(e) => updateBasics('whatHappened', e.target.value)}
                    rows={4}
                    className={isDemoMode && currentStep > 0 ? "border-blue-200 bg-blue-50" : ""}
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

              {/* Location and Time Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Location & Time</h4>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where did this happen?"
                    value={basics.location}
                    onChange={(e) => updateBasics('location', e.target.value)}
                    className={isDemoMode && currentStep > 0 ? "border-blue-200 bg-blue-50" : ""}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                                     <div>
                     <Label htmlFor="date">Date</Label>
                     <Input
                       id="date"
                       type="date"
                       value={basics.datetime && basics.datetime.includes('T') ? basics.datetime.split('T')[0] : ''}
                       onChange={(e) => {
                         const time = basics.datetime && basics.datetime.includes('T') ? basics.datetime.split('T')[1] : '00:00'
                         updateBasics('datetime', `${e.target.value}T${time}`)
                       }}
                       className={isDemoMode && currentStep > 0 ? "border-blue-200 bg-blue-50" : ""}
                     />
                   </div>
                                       <div>
                       <Label htmlFor="time">Time</Label>
                       <Input
                         id="time"
                         type="time"
                         value={basics.datetime && basics.datetime.includes('T') ? basics.datetime.split('T')[1].substring(0, 5) : ''}
                         onChange={(e) => {
                           const date = basics.datetime && basics.datetime.includes('T') ? basics.datetime.split('T')[0] : new Date().toISOString().split('T')[0]
                           updateBasics('datetime', `${date}T${e.target.value}`)
                         }}
                         className={isDemoMode && currentStep > 0 ? "border-blue-200 bg-blue-50" : ""}
                       />
                     </div>
                </div>
              </div>

              {/* Confidentiality Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Confidentiality</h4>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isConfidential"
                    checked={basics.isConfidential}
                    onChange={(e) => updateBasics('isConfidential', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isConfidential" className="text-sm text-gray-700">
                    The reporter request this to be confidential
                  </Label>
                </div>
                
                {basics.isConfidential && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Confidential reports will be handled with additional privacy measures. 
                      Access will be restricted to authorized personnel only.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

            case 2:
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
                isDemoMode={isDemoMode}
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Incident Report</h3>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive incident analysis and compliance assessment
              </p>
            </div>
            
            {isGeneratingReport ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg font-medium text-gray-900 mt-2">Generating Final Report...</p>
                <p className="text-sm text-gray-600 mt-1">
                  Please wait while we create your comprehensive incident report
                </p>
              </div>
            ) : finalReport ? (
              <Tabs defaultValue="report" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="report">Incident Report</TabsTrigger>
                  <TabsTrigger value="additional">AI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="report" className="space-y-6 mt-6">
                                {/* 1. Incident Score */}
                {finalReport.incident_score && (
                  <Card className={cn(
                    "border-l-4",
                    finalReport.incident_score.riskLevel === 'High Risk' 
                      ? "border-l-red-500 bg-red-50" 
                      : finalReport.incident_score.riskLevel === 'Moderate Risk' 
                      ? "border-l-yellow-500 bg-yellow-50" 
                      : "border-l-green-500 bg-green-50"
                  )}>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className={cn(
                          "h-5 w-5",
                          finalReport.incident_score.riskLevel === 'High Risk' 
                            ? "text-red-600" 
                            : finalReport.incident_score.riskLevel === 'Moderate Risk' 
                            ? "text-yellow-600" 
                            : "text-green-600"
                        )} />
                        Incident Score
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={cn(
                              "text-2xl font-bold",
                              finalReport.incident_score.riskLevel === 'High Risk' 
                                ? "text-red-700" 
                                : finalReport.incident_score.riskLevel === 'Moderate Risk' 
                                ? "text-yellow-700" 
                                : "text-green-700"
                            )}>
                              {finalReport.incident_score.totalScore}/100
                            </div>
                            <Badge 
                              variant={finalReport.incident_score.riskLevel === 'High Risk' ? 'destructive' : 
                                      finalReport.incident_score.riskLevel === 'Moderate Risk' ? 'default' : 'secondary'}
                              className="mt-1"
                            >
                              {finalReport.incident_score.riskLevel}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Legal Risk Assessment</p>
                            <p className="text-xs text-gray-500">Based on 7-factor rubric</p>
                          </div>
                        </div>
                        
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                            <span className="transform group-open:rotate-90 transition-transform">▶</span>
                            View Factor Breakdown
                          </summary>
                          <div className="mt-3 space-y-2 pl-6">
                            {finalReport.incident_score.factors?.map((factor, index) => (
                              <div key={index} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                                <div className="flex-1">
                                  <span className="font-medium">{factor.factor}</span>
                                  <p className="text-xs text-gray-500 mt-1">{factor.criteria}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className="text-gray-600 font-medium">{factor.score}/5</span>
                                  <span className="text-xs text-gray-500">({Math.round(factor.weight * 100)}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                        
                        <p className="text-sm text-gray-700 mt-3 italic">
                          {finalReport.incident_score.explanation}
                        </p>
                      </div>
                  </CardContent>
                </Card>
                )}

                {/* 2. General Information */}
                {finalReport.general_information && (
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        General Information
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Incident ID:</span>
                          <p className="text-gray-700">{finalReport.general_information.incidentId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Report Date & Time:</span>
                          <p className="text-gray-700">{new Date(finalReport.general_information.reportDateTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Reporter:</span>
                          <p className="text-gray-700">{finalReport.general_information.reporterName} ({finalReport.general_information.reporterRole})</p>
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span>
                          <p className="text-gray-700">{finalReport.general_information.reporterContact}</p>
                        </div>
                        <div>
                          <span className="font-medium">Relationship to Incident:</span>
                          <p className="text-gray-700">{finalReport.general_information.relationshipToIncident}</p>
                        </div>
                        <div>
                          <span className="font-medium">Confidentiality:</span>
                          <div className="flex items-center gap-2 mt-1">
                            {basics.isConfidential ? (
                              <Badge variant="destructive" className="text-xs">
                                CONFIDENTIAL - Restricted Access
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Standard Processing
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Parties Involved within General Information */}
                        {finalReport.parties_involved && (
                          <div className="col-span-2 mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Parties Involved
                            </h4>
                    <div className="space-y-3">
                              {finalReport.parties_involved.complainants?.length > 0 && (
                                <div>
                                  <span className="font-medium text-xs text-gray-600">Complainant(s):</span>
                                  <div className="mt-1 space-y-1">
                                    {finalReport.parties_involved.complainants.map((party, index) => (
                                      <div key={index} className="text-sm text-gray-700">
                                        {party.name} ({party.relationship || 'Employee'})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {finalReport.parties_involved.accused_subjects?.length > 0 && (
                                <div>
                                  <span className="font-medium text-xs text-gray-600">Accused/Subject(s):</span>
                                  <div className="mt-1 space-y-1">
                                    {finalReport.parties_involved.accused_subjects.map((party, index) => (
                                      <div key={index} className="text-sm text-gray-700">
                                        {party.name} ({party.relationship || 'Employee'})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {finalReport.parties_involved.witnesses?.length > 0 && (
                                <div>
                                  <span className="font-medium text-xs text-gray-600">Witnesses:</span>
                                  <div className="mt-1 space-y-1">
                                    {finalReport.parties_involved.witnesses.map((party, index) => (
                                      <div key={index} className="text-sm text-gray-700">
                                        {party.name} ({party.relationship || 'Employee'})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}



                {/* 3. Incident Details */}
                {finalReport.incident_details && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Incident Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Date & Time of Incident:</span>
                          <p className="text-gray-700">{new Date(finalReport.incident_details.incidentDateTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <p className="text-gray-700">{finalReport.incident_details.location}</p>
                        </div>
                        <div>
                          <span className="font-medium">Description:</span>
                          <p className="text-gray-700 mt-1">{finalReport.incident_details.description}</p>
                        </div>
                        <div>
                          <span className="font-medium">How Reporter Became Aware:</span>
                          <p className="text-gray-700">{finalReport.incident_details.howReporterBecameAware}</p>
                        </div>
                        {finalReport.incident_details.contextBackground && (
                          <div>
                            <span className="font-medium">Context/Background:</span>
                            <p className="text-gray-700">{finalReport.incident_details.contextBackground}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 4. Impact/Consequences */}
                {finalReport.impact_consequences && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Impact & Consequences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Immediate Impact:</span>
                          <ul className="list-disc list-inside mt-1 text-gray-700">
                            {finalReport.impact_consequences.immediateImpact.map((impact, index) => (
                              <li key={index}>{impact}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="font-medium">Medical Treatment Required:</span>
                            <Badge variant={finalReport.impact_consequences.medicalTreatmentRequired ? 'destructive' : 'secondary'} className="ml-2">
                              {finalReport.impact_consequences.medicalTreatmentRequired ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                          <div>
                            <span className="font-medium">Law Enforcement Contacted:</span>
                            <Badge variant={finalReport.impact_consequences.lawEnforcementContacted ? 'destructive' : 'secondary'} className="ml-2">
                              {finalReport.impact_consequences.lawEnforcementContacted ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 5. Policy & Documentation Cross-Check */}
                {finalReport.policy_cross_check && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Policy & Documentation Cross-Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Relevant Handbook Sections:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {finalReport.policy_cross_check.relevantPolicySections.map((section, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{section}</Badge>
                          ))}
                        </div>
                      </div>
                        <div>
                          <span className="font-medium">Policies Violated:</span>
                          <Badge variant={finalReport.policy_cross_check.policiesViolated ? 'destructive' : 'secondary'} className="ml-2">
                            {finalReport.policy_cross_check.policiesViolated ? 'Yes' : 'No'}
                          </Badge>
                          {finalReport.policy_cross_check.violatedPolicies && finalReport.policy_cross_check.violatedPolicies.length > 0 && (
                            <div className="mt-2">
                              <ul className="list-disc list-inside text-gray-700">
                                {finalReport.policy_cross_check.violatedPolicies.map((policy, index) => (
                                  <li key={index}>{policy}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Prior Related Incidents:</span>
                          <Badge variant={finalReport.policy_cross_check.priorRelatedIncidents ? 'destructive' : 'secondary'} className="ml-2">
                            {finalReport.policy_cross_check.priorRelatedIncidents ? 'Yes' : 'No'}
                          </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )}



                {/* Recommended Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      Recommended Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {finalReport.recommended_next_steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>


                </TabsContent>
                
                <TabsContent value="additional" className="space-y-6 mt-6">
                  {/* AI Generated Additional Information */}
                  
                  {/* Company Message */}
                  {finalReport.company_message && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          Internal Communication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-sm text-gray-600">Subject:</span>
                            <p className="text-gray-700 mt-1">{finalReport.company_message.subject}</p>
                </div>
                          <div>
                            <span className="font-medium text-sm text-gray-600">Message:</span>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-700 whitespace-pre-wrap">{finalReport.company_message.body}</p>
              </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Personalized Messages */}
                  {finalReport.personalized_messages && Object.keys(finalReport.personalized_messages).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          Individual Communications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(finalReport.personalized_messages).map(([person, message]) => (
                            <div key={person} className="border-l-4 border-l-blue-200 pl-4">
                              <h4 className="font-medium text-gray-900 mb-2">Message for: {person}</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-sm text-gray-600">Subject:</span>
                                  <p className="text-gray-700">{message.subject}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-sm text-gray-600">Message:</span>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Policy Violations Analysis */}
                  {finalReport.policy_violations && finalReport.policy_violations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          Policy Violations Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {finalReport.policy_violations.map((violation, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{violation.policy_id_or_title}</h4>
                                <Badge variant={
                                  violation.severity === 'Critical' ? 'destructive' :
                                  violation.severity === 'High' ? 'destructive' :
                                  violation.severity === 'Medium' ? 'default' : 'secondary'
                                }>
                                  {violation.severity} Severity
                                </Badge>
                              </div>
                              
                              <div>
                                <span className="font-medium text-sm text-gray-600">Policy Text:</span>
                                <div className="mt-1 p-3 bg-yellow-50 border-l-4 border-l-yellow-400 rounded">
                                  <p className="text-gray-700 italic">&quot;{violation.policy_text}&quot;</p>
                                </div>
                              </div>
                              
                              <div>
                                <span className="font-medium text-sm text-gray-600">Violation Reason:</span>
                                <p className="text-gray-700 mt-1">{violation.violation_reason}</p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-sm text-gray-600">Supporting Facts:</span>
                                <ul className="mt-1 list-disc list-inside text-gray-700 space-y-1">
                                  {violation.supporting_facts.map((fact, factIndex) => (
                                    <li key={factIndex}>{fact}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <span className="font-medium text-sm text-gray-600">Recommended Actions:</span>
                                <ul className="mt-1 list-disc list-inside text-gray-700 space-y-1">
                                  {violation.recommended_remediation.map((action, actionIndex) => (
                                    <li key={actionIndex}>{action}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Confidence Level:</span>
                                <span className="font-medium">{Math.round(violation.confidence * 100)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Evidence Summary */}
                  {finalReport.evidence_summary && finalReport.evidence_summary.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Search className="h-5 w-5 text-purple-600" />
                          Evidence to Collect/Preserve
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {finalReport.evidence_summary.map((evidence, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Defense Notes */}
                  {finalReport.defense_notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Legal Defense Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-green-50 border-l-4 border-l-green-400 rounded">
                          <p className="text-gray-700">{finalReport.defense_notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Notification Requirements */}
                  {finalReport.notification_requirements && finalReport.notification_requirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-orange-600" />
                          Stakeholders to Notify
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {finalReport.notification_requirements.map((stakeholder, index) => (
                            <Badge key={index} variant="outline" className="justify-start p-2">
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Additional Summary Information */}
                  {(finalReport.incident_summary || finalReport.detailed_account) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Additional Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {finalReport.incident_summary && (
                          <div>
                            <span className="font-medium text-sm text-gray-600">Incident Summary:</span>
                            <p className="text-gray-700 mt-1">{finalReport.incident_summary}</p>
                          </div>
                        )}
                        {finalReport.detailed_account && (
                          <div>
                            <span className="font-medium text-sm text-gray-600">Detailed Account:</span>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-700">{finalReport.detailed_account}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No report available</p>
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
        // Check all incident information fields
        const hasBasics = basics.whatHappened.trim() && basics.involvedParties.length > 0
        const hasLocation = basics.location.trim()
        const hasDateTime = basics.datetime
        // No validation needed for confidentiality - it's a boolean field
        const hasReporterInfo = true
        
        return hasBasics && hasLocation && hasDateTime && hasReporterInfo
      case 2:
        return currentQuestions.length === 0
      case 3:
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
      {isDemoMode && currentStep > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> All fields are pre-filled with sample data. You can modify them or generate new demo data.
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
          {currentStep === 3 && finalReport ? (
            <Button
              onClick={() => downloadIncidentReportForm(finalReport)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report Form
            </Button>
          ) : currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
