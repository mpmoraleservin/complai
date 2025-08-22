export type IncidentBasics = {
  whatHappened: string;
  involvedParties: string[]; // split by comma in UI
  location: string;
  datetime: string; // ISO
  attachments?: { name: string; url?: string }[];
  // Confidentiality
  isConfidential: boolean; // Whether the reporter requested this to be confidential
};

export type QA = { question: string; answer: string };

export type PolicyViolation = {
  policy_id_or_title: string;
  policy_text: string;
  violation_reason: string;
  supporting_facts: string[];
  severity: "Low" | "Medium" | "High" | "Critical";
  recommended_remediation: string[];
  confidence: number;
};

// New scoring rubric types
export type IncidentScoringFactor = {
  factor: string;
  weight: number;
  score: number; // 1-5
  weightedScore: number;
  criteria: string;
};

export type IncidentScore = {
  totalScore: number;
  riskLevel: "Low Risk" | "Moderate Risk" | "High Risk";
  factors: IncidentScoringFactor[];
  explanation: string;
};

// Enhanced party information
export type PartyInfo = {
  name: string;
  role: "Complainant" | "Accused/Subject" | "Witness" | "Other";
  relationship?: string;
};

// General information section
export type GeneralInformation = {
  incidentId: string;
  reportDateTime: string;
  reporterName: string;
  reporterRole: string;
  reporterContact: string;
  relationshipToIncident: string;
};

// Incident details section
export type IncidentDetails = {
  incidentDateTime: string;
  location: string;
  description: string;
  howReporterBecameAware: string;
  contextBackground?: string;
};

// Impact and consequences
export type ImpactConsequences = {
  immediateImpact: string[];
  medicalTreatmentRequired: boolean;
  medicalTreatmentDetails?: string;
  lawEnforcementContacted: boolean;
  lawEnforcementDetails?: string;
};

// Policy cross-check
export type PolicyCrossCheck = {
  relevantPolicySections: string[];
  policiesViolated: boolean;
  violatedPolicies?: string[];
  lastAcknowledgmentDates: Record<string, string>;
  priorRelatedIncidents: boolean;
  priorIncidentDates?: string[];
};

export type IncidentReport = {
  // 1. Incident Score (AI-generated)
  incident_score: IncidentScore;
  
  // 2. General Information (not AI)
  general_information: GeneralInformation;
  
  // 3. Parties Involved (from user data, enhanced by AI)
  parties_involved: {
    complainants: PartyInfo[];
    accused_subjects: PartyInfo[];
    witnesses: PartyInfo[];
  };
  
  // 4. Incident Details (AI-generated from user input)
  incident_details: IncidentDetails;
  
  // 5. Impact/Consequences (AI-generated)
  impact_consequences: ImpactConsequences;
  
  // 6. Policy & Documentation Cross-Check (AI-generated)
  policy_cross_check: PolicyCrossCheck;
  
  // Legacy fields for backward compatibility
  incident_summary: string;
  detailed_account: string;
  involved_parties: string[];
  risk_level: "Low" | "Medium" | "High" | "Critical";
  risk_type: ("Operational" | "Legal" | "Reputational" | "Safety" | "Security")[];
  recommended_next_steps: string[];
  company_message: {
    subject: string;
    body: string;
  };
  personalized_messages: Record<string, {
    subject: string;
    body: string;
  }>;
  policy_refs?: string[];
  policy_violations?: PolicyViolation[];
  defense_notes?: string;
  evidence_summary?: string[];
  notification_requirements?: string[];
};

export type NextQuestionsResponse = {
  questions: string[];
  rationale?: string;
};
