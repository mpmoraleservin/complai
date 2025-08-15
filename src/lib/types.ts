// Handbooks API Types
export interface ComprehensiveMultiStateCompany {
  companyName: string
  myState: string
  numberOfEmployees: string
  industry: string
  hrManager: string
  payrollManager: string
  fullTimeHours: number
  payPeriodFrequency: string
  performanceReviewPeriod: string
  trialPeriod: boolean
  trialPeriodDays: number
  paidHolidays: boolean
  paidHolidayNames: string
  vacationBenefits: boolean
  vacationBenefitEligibleMonths: number
  vacationBenefitCarryover: boolean
  sickLeave: boolean
  workersComp: boolean
  healthInsurance: boolean
  directDeposit: boolean
  multiState: boolean
  multiStateSelectedStates: string[]
  companyVehiclesPolicy: boolean
  socialMediaPolicy: boolean
  missionStatement: boolean
  missionStatementText: string
}

export interface SmallSingleStateCompany {
  companyName: string
  myState: string
  numberOfEmployees: string
  industry: string
  hrManager: string
  payrollManager: string
  fullTimeHours: number
  payPeriodFrequency: string
  performanceReviewPeriod: string
  trialPeriod: boolean
  trialPeriodDays: number
  paidHolidays: boolean
  paidHolidayNames: string
  vacationBenefits: boolean
  vacationBenefitType: string
  vacationBenefitEligibleMonths: number
  vacationBenefitCarryover: boolean
  sickLeave: boolean
  workersComp: boolean
  healthInsurance: boolean
  directDeposit: boolean
  multiState: boolean
  companyVehiclesPolicy: boolean
  socialMediaPolicy: boolean
  missionStatement: boolean
  missionStatementText: string
  industryPolicies: any[]
  healthInsurancePlans: any[]
  appendixConditions: Record<string, any>
}

export type HandbookTemplate = 'comprehensive-multi-state' | 'small-single-state'

export interface HandbookFormData {
  template: HandbookTemplate
  companyName: string
  myState: string
  numberOfEmployees: string
  industry: string
  hrManager: string
  payrollManager: string
  fullTimeHours: number
  payPeriodFrequency: string
  performanceReviewPeriod: string
  trialPeriod: boolean
  trialPeriodDays: number
  paidHolidays: boolean
  paidHolidayNames: string
  vacationBenefits: boolean
  vacationBenefitType?: string
  vacationBenefitEligibleMonths: number
  vacationHoursEarned: number
  vacationBenefitCarryover: boolean
  sickLeave: boolean
  sickHoursEarned: number
  maximumSickLeave: number
  workersComp: boolean
  healthInsurance: boolean
  healthInsurancePlans: any[]
  directDeposit: boolean
  industryPolicies: any[]
  multiState: boolean
  multiStateSelectedStates?: string[]
  companyVehiclesPolicy: boolean
  socialMediaPolicy: boolean
  progressiveDisciplinePolicy: boolean
  recordingDevicePolicy: boolean
  employeeDressPolicy: boolean
  travelAndExpensePolicy: boolean
  workFromHomePolicy: boolean
  virtualMeetingsPolicy: boolean
  missionStatement: boolean
  missionStatementTitle: string
  missionStatementText: string
  handbookName: string
  companyUrl: string
  companyLogoId: string
  trialPeriodTitle: boolean
  paidHolidaysTitle: boolean
  vacationBenefitsTitle: boolean
  sickLeaveTitle: boolean
  healthInsuranceTitle: boolean
  directDepositTitle: boolean
  companyVehiclesPolicyTitle: boolean
  socialMediaPolicyTitle: boolean
  progressiveDisciplinePolicyTitle: boolean
  recordingDevicePolicyTitle: boolean
  employeeDressPolicyTitle: boolean
  travelAndExpensePolicyTitle: boolean
  workFromHomePolicyTitle: boolean
  virtualMeetingsPolicyTitle: boolean
  appendixConditions: Record<string, any>
  existingHandbook: boolean
  confirmHandbook: boolean
}

export interface Handbook {
  id: string
  external_id: string
  org_id: string
  template: HandbookTemplate
  company_name: string
  state: string
  number_of_employees: string
  industry: string
  status: 'active' | 'draft' | 'archived'
  compliance_score: number
  created_at: string
  updated_at: string
  content?: string
  pdf_url?: string
}

export interface HandbookApiResponse {
  success: boolean
  data?: {
    handbook_id: string
    pdf_url?: string
    content?: string
  }
  error?: string
}

// Industry options
export const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' }
]

// State options
export const STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]

// Pay period frequency options
export const PAY_PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'semi-monthly', label: 'Semi-monthly' },
  { value: 'monthly', label: 'Monthly' }
]

// Performance review period options
export const PERFORMANCE_REVIEW_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

// Vacation benefit type options
export const VACATION_BENEFIT_TYPE_OPTIONS = [
  { value: 'accrued-pto', label: 'Accrued PTO' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'accrued-vacation-only', label: 'Accrued Vacation Only' },
  { value: 'flexible-vacation-accrued-sick', label: 'Flexible Vacation + Accrued Sick' }
]

// Incident Manager Types
export interface Employee {
  id: number
  name: string
  email: string
  role: string
  handbookStatus: 'Acknowledged' | 'Pending'
}

export interface IncidentFormData {
  // Step 1: Personas Involucradas
  directlyInvolved: number[]
  indirectlyInvolved: number[]
  relationshipDescription: string
  
  // Step 2: Detalles del Incidente
  whatHappened: string
  where: string
  when: string
  circumstances: string
  
  // Step 3: AI Analysis Results
  riskLevel: 'low' | 'medium' | 'high'
  riskAssessment: string
  aiRecommendations: string[]
  nextSteps: string[]
  complianceIssues: string[]
  employeeHistory: string[]
}

export interface AIQuestion {
  id: string
  question: string
  type: 'text' | 'multiple-choice' | 'yes-no'
  options?: string[]
  required: boolean
  context: string
}

export interface AIAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high'
  riskAssessment: string
  recommendations: string[]
  nextSteps: string[]
  complianceIssues: string[]
  employeeHistory: string[]
  handbookPolicies: string[]
  suggestedActions: string[]
}
