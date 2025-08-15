export type IncidentBasics = {
  whatHappened: string;
  involvedParties: string[]; // split by comma in UI
  location: string;
  datetime: string; // ISO
  attachments?: { name: string; url?: string }[];
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

export type IncidentReport = {
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
