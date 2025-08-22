import { NextQuestionsResponse, IncidentReport, IncidentScore, PartyInfo } from '../types/incident'

export class DemoAI {
  private questionIndex = 0
  
  // Dynamic questions based on incident context and scoring rubric
  private generateContextualQuestions(basics: any, history: any[]): string[] {
    const whatHappened = basics.whatHappened?.toLowerCase() || ''
    const involvedParties = basics.involvedParties || []
    const location = basics.location?.toLowerCase() || ''
    
    let questions: string[] = []
    
    // Legal Exposure & Protected Class questions
    if (whatHappened.includes('harassment') || whatHappened.includes('discrimination') || whatHappened.includes('inappropriate')) {
      questions.push("What specific words or actions occurred during this incident?")
      questions.push("Did the behavior reference any personal characteristics (age, race, gender, etc.)?")
    }
    
    // Pattern/Frequency questions
    questions.push("Has similar behavior occurred before involving any of these individuals?")
    questions.push("How long has this type of behavior been happening, if at all?")
    
    // Role of Accused & Employment Context questions
    if (involvedParties.length > 1) {
      questions.push("What are the job titles and reporting relationships of the people involved?")
      questions.push("Does anyone involved have supervisory authority over others?")
    }
    
    // Documentation Strength questions
    questions.push("Were there any witnesses who saw or heard what happened?")
    questions.push("Is there any physical evidence, messages, emails, or recordings related to this incident?")
    
    // Adverse Employment Action questions
    questions.push("Has anyone involved experienced any changes to their job duties, schedule, or benefits recently?")
    
    // Impact Assessment questions
    if (whatHappened.includes('physical') || whatHappened.includes('injury') || whatHappened.includes('hurt')) {
      questions.push("Was anyone physically injured or did anyone require medical attention?")
    }
    questions.push("How has this incident affected the work environment or the people involved?")
    
    // Timing & Circumstances questions
    questions.push("Did this incident occur during work hours, at a work event, or outside of work?")
    
    // Immediate Response questions
    questions.push("What actions were taken immediately after the incident occurred?")
    questions.push("Who was notified about this incident and when?")
    
    // Context-specific questions based on incident type
    if (whatHappened.includes('verbal') || whatHappened.includes('yell') || whatHappened.includes('shout')) {
      questions.push("What exact words were used during the verbal altercation?")
      questions.push("What was the tone and volume of the interaction?")
    }
    
    if (whatHappened.includes('physical') || whatHappened.includes('touching') || whatHappened.includes('contact')) {
      questions.push("Describe the exact physical contact that occurred.")
      questions.push("Was the physical contact intentional or accidental?")
    }
    
    if (location.includes('public') || location.includes('office') || location.includes('meeting')) {
      questions.push("How many people could have witnessed this incident in that location?")
      questions.push("Are there security cameras or other recording devices in that area?")
    }
    
    // Aggravating/Mitigating Factors
    questions.push("Were there any environmental factors that contributed to this incident (stress, workload, etc.)?")
    questions.push("Is there any additional context or background information that would help understand this incident?")
    
    // Remove any questions that might ask about policies (safety check)
    questions = questions.filter(q => 
      !q.toLowerCase().includes('policy') && 
      !q.toLowerCase().includes('training') && 
      !q.toLowerCase().includes('handbook') &&
      !q.toLowerCase().includes('procedure')
    )
    
    // Ensure we have at least 4 questions but not more than 6
    const shuffled = questions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(Math.max(shuffled.length, 4), 6))
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
    
    // Calculate incident score using demo rubric
    const incidentScore = this.calculateIncidentScore(whatHappened, qa, involvedParties)
    
    // Generate current timestamp
    const now = new Date()
    const incidentId = `INC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`
    
    // Categorize parties
    const parties = this.categorizeParties(involvedParties, whatHappened)

    // Generate demo report based on input
    const report: IncidentReport = {
      // New structured sections
      incident_score: incidentScore,
      general_information: {
        incidentId,
        reportDateTime: now.toISOString(),
        reporterName: "John Doe",
        reporterRole: "HR Manager",
        reporterContact: "johndoe@gmail.com",
        relationshipToIncident: "Manager"
      },
      parties_involved: parties,
      incident_details: {
        incidentDateTime: basics.datetime || now.toISOString(),
        location: basics.location || "Unknown location",
        description: whatHappened,
        howReporterBecameAware: "Direct report from involved party",
        contextBackground: "No prior documented conflicts between these parties"
      },
      impact_consequences: {
        immediateImpact: ["Emotional distress", "Workplace tension", "Productivity disruption"],
        medicalTreatmentRequired: false,
        medicalTreatmentDetails: undefined,
        lawEnforcementContacted: false,
        lawEnforcementDetails: undefined
      },
      policy_cross_check: {
        relevantPolicySections: ["§3.2 Anti-Harassment", "§5.1 Professional Conduct"],
        policiesViolated: true,
        violatedPolicies: ["Anti-Harassment Policy", "Professional Conduct Standards"],
        lastAcknowledgmentDates: involvedParties.reduce((acc: Record<string, string>, party: string) => {
          acc[party] = "2024-01-15"
          return acc
        }, {}),
        priorRelatedIncidents: false,
        priorIncidentDates: undefined
      },
      
      // Legacy fields for backward compatibility
      incident_summary: `Incident involving ${involvedParties.join(', ')} at ${basics.location || 'unknown location'}`,
      detailed_account: `${whatHappened}. ${qa.map(q => `${q.question} ${q.answer}`).join('. ')}`,
      involved_parties: involvedParties,
      risk_level: "Low",
      risk_type: ["Operational"],
      recommended_next_steps: this.generateNextSteps(incidentScore, whatHappened, qa),
      company_message: {
        subject: "Incident Report - Immediate Action Required",
        body: "We take all incidents seriously and are committed to maintaining a safe and respectful workplace. An incident has been reported involving the involved parties. This matter will be thoroughly investigated and appropriate actions will be taken. As stated in our Anti-Harassment Policy: 'All employees are expected to maintain professional behavior in the workplace. Harassment, including verbal abuse, intimidation, or any form of hostile behavior, is strictly prohibited.' We will ensure full compliance with this policy."
      },
      personalized_messages: involvedParties.reduce((acc: Record<string, { subject: string; body: string }>, party: string) => {
        acc[party] = {
          subject: "Incident Report - Next Steps",
          body: `We have received a report regarding an incident involving you and the other party. Please ensure all relevant documentation is preserved. As outlined in our Anti-Harassment Policy: 'All employees are expected to maintain professional behavior in the workplace. Harassment, including verbal abuse, intimidation, or any form of hostile behavior, is strictly prohibited.' We will be conducting a thorough investigation and will be in touch shortly to discuss next steps.`
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


  
  private calculateIncidentScore(whatHappened: string, qa: any[], involvedParties: string[]): any {
    const text = (whatHappened + ' ' + qa.map(q => q.answer).join(' ')).toLowerCase()
    
    // Calculate each factor based on demo logic
    const factors = [
      {
        factor: "Legal Exposure Type",
        weight: 0.25,
        score: this.scoreLegalExposure(text),
        weightedScore: 0,
        criteria: "Assessment based on statutory implications and legal risk factors"
      },
      {
        factor: "Protected Class Involvement",
        weight: 0.20,
        score: this.scoreProtectedClass(text),
        weightedScore: 0,
        criteria: "Evaluation of protected category involvement (Title VII, ADA, ADEA, etc.)"
      },
      {
        factor: "Adverse Employment Action",
        weight: 0.15,
        score: this.scoreAdverseAction(text),
        weightedScore: 0,
        criteria: "Severity of employment-related consequences"
      },
      {
        factor: "Pattern/Frequency",
        weight: 0.15,
        score: this.scorePattern(text),
        weightedScore: 0,
        criteria: "Assessment of incident frequency and pattern recognition"
      },
      {
        factor: "Role of Accused",
        weight: 0.10,
        score: this.scoreAccusedRole(text),
        weightedScore: 0,
        criteria: "Evaluation based on accused party's organizational position"
      },
      {
        factor: "Documentation Strength",
        weight: 0.10,
        score: this.scoreDocumentation(text),
        weightedScore: 0,
        criteria: "Quality and completeness of available documentation (reverse scored)"
      },
      {
        factor: "Handbook Policy Alignment",
        weight: 0.05,
        score: this.scorePolicyAlignment(text),
        weightedScore: 0,
        criteria: "Policy coverage and acknowledgment status (reverse scored)"
      }
    ]
    
    // Calculate weighted scores and total
    let totalScore = 0
    factors.forEach(factor => {
      factor.weightedScore = factor.score * factor.weight * 20 // Scale to 100
      totalScore += factor.weightedScore
    })
    
    // Determine risk level
    let riskLevel: "Low Risk" | "Moderate Risk" | "High Risk"
    if (totalScore <= 45) {
      riskLevel = "Low Risk"
    } else if (totalScore <= 65) {
      riskLevel = "Moderate Risk"
    } else {
      riskLevel = "High Risk"
    }
    
    return {
      totalScore: Math.round(totalScore),
      riskLevel,
      factors,
      explanation: `Based on the incident analysis, this case scores ${Math.round(totalScore)} points, placing it in the ${riskLevel} category. Key factors include the nature of the incident, parties involved, and potential policy violations.`
    }
  }
  
  private scoreLegalExposure(text: string): number {
    if (text.includes('retaliation') || text.includes('systemic') || text.includes('fmla') || text.includes('ada')) return 5
    if (text.includes('harassment') || text.includes('discrimination') || text.includes('wage')) return 4
    if (text.includes('complaint') || text.includes('violation')) return 3
    if (text.includes('dispute') || text.includes('conflict')) return 2
    return 1
  }
  
  private scoreProtectedClass(text: string): number {
    if (text.includes('race') || text.includes('gender') || text.includes('pregnancy') || text.includes('disability')) return 5
    if (text.includes('age') || text.includes('religion') || text.includes('national origin')) return 4
    if (text.includes('protected') || text.includes('class')) return 3
    return 1
  }
  
  private scoreAdverseAction(text: string): number {
    if (text.includes('termination') || text.includes('fired') || text.includes('demotion')) return 5
    if (text.includes('suspension') || text.includes('pay cut')) return 4
    if (text.includes('shift') || text.includes('bonus') || text.includes('opportunity')) return 3
    if (text.includes('warning') || text.includes('discipline')) return 2
    return 1
  }
  
  private scorePattern(text: string): number {
    if (text.includes('widespread') || text.includes('systemic') || text.includes('multiple employees')) return 5
    if (text.includes('repeated') || text.includes('ongoing') || text.includes('pattern')) return 4
    if (text.includes('several times') || text.includes('before')) return 3
    if (text.includes('again') || text.includes('similar')) return 2
    return 1
  }
  
  private scoreAccusedRole(text: string): number {
    if (text.includes('ceo') || text.includes('executive') || text.includes('owner') || text.includes('c-suite')) return 5
    if (text.includes('director') || text.includes('vp') || text.includes('vice president')) return 4
    if (text.includes('manager') || text.includes('supervisor')) return 3
    if (text.includes('lead') || text.includes('senior')) return 2
    return 1
  }
  
  private scoreDocumentation(text: string): number {
    // Reverse scored - higher is worse
    if (text.includes('no documentation') || text.includes('no records')) return 5
    if (text.includes('partial') || text.includes('incomplete')) return 3
    if (text.includes('documented') || text.includes('records') || text.includes('evidence')) return 1
    return 2
  }
  
  private scorePolicyAlignment(text: string): number {
    // Reverse scored - higher is worse
    if (text.includes('no policy') || text.includes('policy gap')) return 5
    if (text.includes('outdated policy') || text.includes('missing acknowledgment')) return 3
    if (text.includes('policy') || text.includes('handbook')) return 1
    return 2
  }
  

  private categorizeParties(involvedParties: string[], whatHappened: string): any {
    const text = whatHappened.toLowerCase()
    
    // Simple logic to categorize parties
    const complainants = []
    const accused_subjects = []
    const witnesses = []
    
    if (involvedParties.length >= 2) {
      // First party is typically complainant, second is accused
      complainants.push({
        name: involvedParties[0],
        role: "Complainant" as const,
        relationship: "Employee"
      })
      
      accused_subjects.push({
        name: involvedParties[1],
        role: "Accused/Subject" as const,
        relationship: "Employee"
      })
      
      // Additional parties are witnesses
      for (let i = 2; i < involvedParties.length; i++) {
        witnesses.push({
          name: involvedParties[i],
          role: "Witness" as const,
          relationship: "Employee"
        })
      }
    } else if (involvedParties.length === 1) {
      complainants.push({
        name: involvedParties[0],
        role: "Complainant" as const,
        relationship: "Employee"
      })
    }
    
    return {
      complainants,
      accused_subjects,
      witnesses
    }
  }

  private generateNextSteps(incidentScore: any, whatHappened: string, qa: any[]): string[] {
    const riskLevel = incidentScore.riskLevel
    const totalScore = incidentScore.totalScore
    const text = (whatHappened + ' ' + qa.map(q => q.answer).join(' ')).toLowerCase()
    
    let nextSteps: string[] = []
    
    // Check for special escalation triggers first
    const hasViolence = text.includes('violence') || text.includes('assault') || text.includes('hit') || text.includes('attack')
    const hasThreats = text.includes('threat') || text.includes('intimidate') || text.includes('harm')
    const hasWeapons = text.includes('weapon') || text.includes('gun') || text.includes('knife')
    const hasTheft = text.includes('theft') || text.includes('stealing') || text.includes('stole')
    const hasDrugs = text.includes('drugs') || text.includes('substance') || text.includes('alcohol')
    const hasSexualMisconduct = text.includes('sexual') || text.includes('inappropriate touching')
    
    // Emergency escalations
    if (hasViolence || hasWeapons || hasSexualMisconduct) {
      nextSteps.push("IMMEDIATE: Contact law enforcement")
      nextSteps.push("URGENT: Ensure immediate safety of all parties")
      nextSteps.push("Separate involved parties immediately")
    }
    
    if (hasThreats && (riskLevel === "High Risk" || hasViolence)) {
      nextSteps.push("Consider involving law enforcement for threat assessment")
    }
    
    // Risk-based next steps
    if (riskLevel === "High Risk" || totalScore >= 65) {
      nextSteps.push("Immediate escalation to HR Director and senior leadership")
      nextSteps.push("Consult with legal counsel before proceeding")
      nextSteps.push("Consider immediate suspension pending investigation")
      nextSteps.push("Preserve all evidence including CCTV, documents, and communications")
      nextSteps.push("Engage external investigator for impartial review")
      if (!hasViolence) nextSteps.push("Notify insurance carrier of potential claim")
      
    } else if (riskLevel === "Moderate Risk" || totalScore >= 45) {
      nextSteps.push("Conduct formal HR investigation with trained investigator")
      nextSteps.push("Implement interim measures to separate parties")
      nextSteps.push("Review all relevant policies and prior documentation")
      nextSteps.push("Interview all witnesses and gather evidence")
      nextSteps.push("Consider progressive discipline based on findings")
      if (text.includes('protected') || text.includes('discrimination') || text.includes('harassment')) {
        nextSteps.push("Legal consultation recommended due to protected class implications")
      }
      
    } else { // Low Risk
      nextSteps.push("Management coaching and counseling for involved parties")
      nextSteps.push("Consider informal mediation to resolve conflict")
      nextSteps.push("Provide policy clarification and training")
      nextSteps.push("Enhanced supervision and regular check-ins")
    }
    
    // Common actions for all risk levels
    nextSteps.push("Document all actions taken and investigation findings")
    nextSteps.push("Schedule follow-up review in 30 days")
    
    // Specific additions based on incident type
    if (text.includes('customer') || text.includes('client')) {
      nextSteps.push("Assess potential business impact and customer notification needs")
    }
    
    if (text.includes('safety') || text.includes('injury')) {
      nextSteps.push("Review workplace safety protocols and implement improvements")
    }
    
    if (text.includes('social media') || text.includes('online')) {
      nextSteps.push("Monitor digital communications and implement technology restrictions if needed")
    }
    
    return nextSteps.slice(0, 8) // Limit to 8 most important steps
  }
}
