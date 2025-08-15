import { NextQuestionsResponse, IncidentReport } from '../types/incident'

export class DemoAI {
  private questionIndex = 0
  
  // Dynamic questions based on incident context
  private generateContextualQuestions(basics: any, history: any[]): string[] {
    const whatHappened = basics.whatHappened?.toLowerCase() || ''
    const involvedParties = basics.involvedParties || []
    const location = basics.location?.toLowerCase() || ''
    
    let questions: string[] = []
    
    // Base questions that apply to most incidents
    questions.push("Was the incident reported to HR or management as per company policy?")
    
    // Context-specific questions
    if (whatHappened.includes('grito') || whatHappened.includes('yell') || whatHappened.includes('shout')) {
      questions.push("What was the tone and volume of the shouting?")
      questions.push("Were there any threatening or aggressive gestures?")
    }
    
    if (whatHappened.includes('harassment') || whatHappened.includes('acoso')) {
      questions.push("Has this type of behavior been reported before?")
      questions.push("What specific actions constituted the harassment?")
    }
    
    if (involvedParties.length > 1) {
      questions.push("What was the relationship between the parties involved?")
      questions.push("Were there any witnesses to the incident?")
    }
    
    if (location.includes('sala') || location.includes('room') || location.includes('office')) {
      questions.push("Was this a public or private area?")
      questions.push("Were there security cameras in the vicinity?")
    }
    
    // Add more contextual questions based on history
    if (history.length > 0) {
      questions.push("Is there any supporting documentation or evidence related to the incident?")
      questions.push("What was the immediate response when the incident occurred?")
    }
    
    // Ensure we have at least 3 questions
    while (questions.length < 3) {
      questions.push("Are there any other relevant details you'd like to share?")
    }
    
    return questions.slice(0, 4) // Return max 4 questions
  }

  async getNextQuestions(basics: any, history: any[]): Promise<NextQuestionsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // If we have enough Q&A history, return empty questions to proceed to report
    if (history.length >= 3) {
      return {
        questions: [],
        rationale: "Sufficient information gathered for risk assessment"
      }
    }

    // Generate contextual questions based on incident details
    const contextualQuestions = this.generateContextualQuestions(basics, history)
    
    // Return questions based on current history
    if (history.length === 0) {
      // First batch of questions
      return {
        questions: contextualQuestions.slice(0, 2),
        rationale: "Initial assessment questions based on incident context"
      }
    } else if (history.length === 1) {
      // Second batch of questions
      return {
        questions: contextualQuestions.slice(2, 4),
        rationale: "Follow-up questions for comprehensive assessment"
      }
    } else {
      // Final questions
      return {
        questions: contextualQuestions.slice(3, 4),
        rationale: "Final details for complete assessment"
      }
    }
  }

  async generateFinalReport(basics: any, qa: any[]): Promise<IncidentReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const involvedParties = basics.involvedParties || []
    const whatHappened = basics.whatHappened || "Incident occurred"

    // Generate demo report based on input
    const report: IncidentReport = {
      incident_summary: `Incident involving ${involvedParties.join(', ')} at ${basics.location || 'unknown location'}`,
      detailed_account: `${whatHappened}. ${qa.map(q => `${q.question} ${q.answer}`).join('. ')}`,
      involved_parties: involvedParties,
      risk_level: this.determineRiskLevel(whatHappened, qa),
      risk_type: this.determineRiskTypes(whatHappened, qa),
      recommended_next_steps: [
        "Conduct immediate investigation",
        "Document all evidence and statements",
        "Notify relevant stakeholders",
        "Implement corrective actions",
        "Schedule follow-up review"
      ],
      company_message: {
        subject: "Incident Report - Immediate Action Required",
        body: "We take all incidents seriously and are committed to maintaining a safe and respectful workplace. An incident has been reported involving verbal altercation and aggressive behavior. This matter will be thoroughly investigated and appropriate actions will be taken. All relevant policies including Anti-Harassment Policy may have been violated and will be reviewed."
      },
      personalized_messages: involvedParties.reduce((acc: Record<string, { subject: string; body: string }>, party: string) => {
        acc[party] = {
          subject: "Incident Report - Next Steps",
          body: `We have received your report regarding the incident and will be in touch shortly to discuss next steps. Please ensure all relevant documentation is preserved. The incident involves potential violations of company policies including Anti-Harassment Policy and will be thoroughly investigated.`
        }
        return acc
      }, {}),
      policy_refs: ["Anti-Harassment Policy", "Incident Reporting Procedure"],
      policy_violations: [
        {
          policy_id_or_title: "Anti-Harassment Policy",
          policy_text: "All employees are expected to maintain professional behavior in the workplace. Harassment, including verbal abuse, intimidation, or any form of hostile behavior, is strictly prohibited. Employees must treat each other with respect and dignity at all times.",
          violation_reason: "The reported behavior appears to violate professional conduct standards and anti-harassment policies",
          supporting_facts: ["Verbal altercation reported", "Multiple witnesses present", "Aggressive language used"],
          severity: "Medium",
          recommended_remediation: ["Conduct investigation", "Provide training", "Document findings"],
          confidence: 0.8
        }
      ],
      defense_notes: "Company has clear policies in place and takes immediate action on reported incidents",
      evidence_summary: ["Witness statements", "Incident report", "Location details"],
      notification_requirements: ["HR Department", "Management Team"]
    }

    return report
  }

  private determineRiskLevel(whatHappened: string, qa: any[]): "Low" | "Medium" | "High" | "Critical" {
    const text = (whatHappened + ' ' + qa.map(q => q.answer).join(' ')).toLowerCase()
    
    if (text.includes('violence') || text.includes('assault') || text.includes('threat')) {
      return "Critical"
    }
    if (text.includes('harassment') || text.includes('discrimination') || text.includes('injury')) {
      return "High"
    }
    if (text.includes('conflict') || text.includes('dispute') || text.includes('argument')) {
      return "Medium"
    }
    return "Low"
  }

  private determineRiskTypes(whatHappened: string, qa: any[]): ("Operational" | "Legal" | "Reputational" | "Safety" | "Security")[] {
    const text = (whatHappened + ' ' + qa.map(q => q.answer).join(' ')).toLowerCase()
    const types: ("Operational" | "Legal" | "Reputational" | "Safety" | "Security")[] = []

    if (text.includes('harassment') || text.includes('discrimination') || text.includes('legal')) {
      types.push("Legal")
    }
    if (text.includes('injury') || text.includes('accident') || text.includes('safety')) {
      types.push("Safety")
    }
    if (text.includes('data') || text.includes('security') || text.includes('breach')) {
      types.push("Security")
    }
    if (text.includes('reputation') || text.includes('public') || text.includes('media')) {
      types.push("Reputational")
    }
    if (text.includes('operational') || text.includes('delay') || text.includes('process')) {
      types.push("Operational")
    }

    return types.length > 0 ? types : ["Operational"]
  }
}
