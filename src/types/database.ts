export interface User {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  user_id: string
  title: string
  state: string
  job_type: string
  schedule_type: string
  content: string
  status: 'draft' | 'pending' | 'signed' | 'expired'
  pandadoc_id?: string
  created_at: string
  updated_at: string
}

export interface ContractAudit {
  id: string
  contract_id: string
  audit_type: 'compliance' | 'legal_update'
  findings: AuditFinding[]
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface AuditFinding {
  id: string
  audit_id: string
  clause: string
  issue_type: 'compliance' | 'recommendation' | 'warning'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  legal_citation?: string
  suggested_fix?: string
  created_at: string
}

export interface LegalUpdate {
  id: string
  state: string
  law_type: string
  title: string
  description: string
  effective_date: string
  impact_level: 'low' | 'medium' | 'high'
  created_at: string
}

export interface UserNotification {
  id: string
  user_id: string
  type: 'legal_update' | 'contract_expiry' | 'audit_complete'
  title: string
  message: string
  read: boolean
  created_at: string
} 