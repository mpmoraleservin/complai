import { useState, useCallback } from 'react'
import { 
  HandbookFormData, 
  HandbookTemplate,
  STATE_OPTIONS,
  INDUSTRY_OPTIONS,
  PAY_PERIOD_OPTIONS,
  PERFORMANCE_REVIEW_OPTIONS,
  VACATION_BENEFIT_TYPE_OPTIONS
} from '@/lib/types'

const DEFAULT_HOLIDAYS = "New Year's Day,\nMartin Luther King Day,\nMemorial Day,\nJuneteenth,\nIndependence Day (4th of July),\nLabor Day,\nThanksgiving Day,\nChristmas Day"

const DEFAULT_MULTI_STATE_HOLIDAYS = "New Year's Day,\nMartin Luther King Day,\nMemorial Day,\nEaster,\nJuneteenth,\nIndependence Day (4th of July),\nLabor Day,\nThanksgiving Day,\nChristmas Day"

export function useHandbookForm() {
  const [formData, setFormData] = useState<HandbookFormData>({
    template: 'small-single-state',
    companyName: '',
    myState: 'CA',
    numberOfEmployees: '',
    industry: 'other',
    hrManager: 'the Human Resources Manager',
    payrollManager: 'the Payroll Manager',
    fullTimeHours: 30,
    payPeriodFrequency: 'weekly',
    performanceReviewPeriod: 'Every year',
    trialPeriod: true,
    trialPeriodDays: 90,
    paidHolidays: true,
    paidHolidayNames: DEFAULT_HOLIDAYS,
    vacationBenefits: true,
    vacationBenefitEligibleMonths: 1,
    vacationBenefitType: 'accrued-pto',
    vacationHoursEarned: 40,
    vacationBenefitCarryover: true,
    sickLeave: true,
    sickHoursEarned: 24,
    maximumSickLeave: 80,
    workersComp: true,
    healthInsurance: true,
    healthInsurancePlans: [],
    directDeposit: true,
    industryPolicies: [],
    multiState: false,
    multiStateSelectedStates: [],
    companyVehiclesPolicy: false,
    socialMediaPolicy: true,
    progressiveDisciplinePolicy: true,
    recordingDevicePolicy: false,
    employeeDressPolicy: false,
    travelAndExpensePolicy: false,
    workFromHomePolicy: false,
    virtualMeetingsPolicy: false,
    missionStatement: true,
    missionStatementTitle: 'Our Mission',
    missionStatementText: "Our company exists to create value for our customers by delivering a world-class product.",
    handbookName: 'Employee Handbook 2024',
    companyUrl: '',
    companyLogoId: '',
    trialPeriodTitle: true,
    paidHolidaysTitle: true,
    vacationBenefitsTitle: true,
    sickLeaveTitle: true,
    healthInsuranceTitle: true,
    directDepositTitle: true,
    companyVehiclesPolicyTitle: false,
    socialMediaPolicyTitle: true,
    progressiveDisciplinePolicyTitle: true,
    recordingDevicePolicyTitle: false,
    employeeDressPolicyTitle: false,
    travelAndExpensePolicyTitle: false,
    workFromHomePolicyTitle: false,
    virtualMeetingsPolicyTitle: false,
    appendixConditions: {},
    existingHandbook: false,
    confirmHandbook: true
  })

  const [errors, setErrors] = useState<Partial<Record<keyof HandbookFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((field: keyof HandbookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

                    // Handle template-specific logic
     if (field === 'template') {
       const newTemplate = value as HandbookTemplate
       if (newTemplate === 'comprehensive-multi-state') {
         setFormData(prev => ({
           ...prev,
           multiState: true,
           multiStateSelectedStates: STATE_OPTIONS.map(s => s.value),
           paidHolidayNames: DEFAULT_MULTI_STATE_HOLIDAYS
         }))
       } else {
         setFormData(prev => ({
           ...prev,
           multiState: false,
           multiStateSelectedStates: [],
           paidHolidayNames: DEFAULT_HOLIDAYS
         }))
       }
     }

     // Handle multi-state logic
     if (field === 'multiState') {
       if (value === true) {
         setFormData(prev => ({
           ...prev,
           multiStateSelectedStates: STATE_OPTIONS.map(s => s.value)
         }))
       } else {
         setFormData(prev => ({
           ...prev,
           multiStateSelectedStates: []
         }))
       }
     }
  }, [errors])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof HandbookFormData, string>> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.myState) {
      newErrors.myState = 'State is required'
    }

    if (!formData.numberOfEmployees.trim()) {
      newErrors.numberOfEmployees = 'Number of employees is required'
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required'
    }

    if (formData.trialPeriod && (!formData.trialPeriodDays || formData.trialPeriodDays <= 0)) {
      newErrors.trialPeriodDays = 'Trial period days must be greater than 0'
    }

    if (formData.paidHolidays && !formData.paidHolidayNames.trim()) {
      newErrors.paidHolidayNames = 'Holiday names are required when paid holidays are enabled'
    }

    if (formData.vacationBenefits && (!formData.vacationBenefitEligibleMonths || formData.vacationBenefitEligibleMonths <= 0)) {
      newErrors.vacationBenefitEligibleMonths = 'Vacation benefit eligible months must be greater than 0'
    }

    if (formData.vacationBenefits && (!formData.vacationHoursEarned || formData.vacationHoursEarned <= 0)) {
      newErrors.vacationHoursEarned = 'Vacation hours earned must be greater than 0'
    }

    if (formData.sickLeave && (!formData.sickHoursEarned || formData.sickHoursEarned <= 0)) {
      newErrors.sickHoursEarned = 'Sick hours earned must be greater than 0'
    }

    if (formData.missionStatement && !formData.missionStatementText.trim()) {
      newErrors.missionStatementText = 'Mission statement text is required when mission statement is enabled'
    }

    if (formData.multiState && (!formData.multiStateSelectedStates || formData.multiStateSelectedStates.length === 0)) {
      newErrors.multiStateSelectedStates = 'At least one state must be selected for multi-state operations'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      template: 'small-single-state',
      companyName: '',
      myState: 'CA',
      numberOfEmployees: '',
      industry: 'other',
      hrManager: 'the Human Resources Manager',
      payrollManager: 'the Payroll Manager',
      fullTimeHours: 30,
      payPeriodFrequency: 'weekly',
      performanceReviewPeriod: 'Every year',
      trialPeriod: true,
      trialPeriodDays: 90,
      paidHolidays: true,
      paidHolidayNames: DEFAULT_HOLIDAYS,
      vacationBenefits: true,
      vacationBenefitEligibleMonths: 1,
      vacationBenefitType: 'accrued-pto',
      vacationHoursEarned: 40,
      vacationBenefitCarryover: true,
      sickLeave: true,
      sickHoursEarned: 24,
      maximumSickLeave: 80,
      workersComp: true,
      healthInsurance: true,
      healthInsurancePlans: [],
      directDeposit: true,
      industryPolicies: [],
      multiState: false,
      multiStateSelectedStates: [],
      companyVehiclesPolicy: false,
      socialMediaPolicy: true,
      progressiveDisciplinePolicy: true,
      recordingDevicePolicy: false,
      employeeDressPolicy: false,
      travelAndExpensePolicy: false,
      workFromHomePolicy: false,
      virtualMeetingsPolicy: false,
      missionStatement: true,
      missionStatementTitle: 'Our Mission',
      missionStatementText: "Our company exists to create value for our customers by delivering a world-class product.",
      handbookName: 'Employee Handbook 2024',
      companyUrl: '',
      companyLogoId: '',
      trialPeriodTitle: true,
      paidHolidaysTitle: true,
      vacationBenefitsTitle: true,
      sickLeaveTitle: true,
      healthInsuranceTitle: true,
      directDepositTitle: true,
      companyVehiclesPolicyTitle: false,
      socialMediaPolicyTitle: true,
      progressiveDisciplinePolicyTitle: true,
      recordingDevicePolicyTitle: false,
      employeeDressPolicyTitle: false,
      travelAndExpensePolicyTitle: false,
      workFromHomePolicyTitle: false,
      virtualMeetingsPolicyTitle: false,
      appendixConditions: {},
      existingHandbook: false,
      confirmHandbook: true
    })
    setErrors({})
  }, [])

  const getFormDataForApi = useCallback(() => {
    return {
      companyName: formData.companyName,
      myState: formData.myState,
      numberOfEmployees: formData.numberOfEmployees,
      industry: formData.industry,
      hrManager: formData.hrManager,
      payrollManager: formData.payrollManager,
      fullTimeHours: formData.fullTimeHours,
      payPeriodFrequency: formData.payPeriodFrequency,
      performanceReviewPeriod: formData.performanceReviewPeriod,
      trialPeriod: formData.trialPeriod,
      trialPeriodDays: formData.trialPeriodDays,
      paidHolidays: formData.paidHolidays,
      paidHolidayNames: formData.paidHolidayNames,
      vacationBenefits: formData.vacationBenefits,
      vacationBenefitEligibleMonths: formData.vacationBenefitEligibleMonths,
      vacationBenefitType: formData.vacationBenefitType,
      vacationHoursEarned: formData.vacationHoursEarned,
      vacationBenefitCarryover: formData.vacationBenefitCarryover,
      sickLeave: formData.sickLeave,
      sickHoursEarned: formData.sickHoursEarned,
      maximumSickLeave: formData.maximumSickLeave,
      workersComp: formData.workersComp,
      healthInsurance: formData.healthInsurance,
      healthInsurancePlans: formData.healthInsurancePlans,
      directDeposit: formData.directDeposit,
      industryPolicies: formData.industryPolicies,
      multiState: formData.multiState,
      multiStateSelectedStates: formData.multiStateSelectedStates,
      companyVehiclesPolicy: formData.companyVehiclesPolicy,
      socialMediaPolicy: formData.socialMediaPolicy,
      progressiveDisciplinePolicy: formData.progressiveDisciplinePolicy,
      recordingDevicePolicy: formData.recordingDevicePolicy,
      employeeDressPolicy: formData.employeeDressPolicy,
      travelAndExpensePolicy: formData.travelAndExpensePolicy,
      workFromHomePolicy: formData.workFromHomePolicy,
      virtualMeetingsPolicy: formData.virtualMeetingsPolicy,
      missionStatement: formData.missionStatement,
      missionStatementTitle: formData.missionStatementTitle,
      missionStatementText: formData.missionStatementText,
      handbookName: formData.handbookName,
      companyUrl: formData.companyUrl,
      companyLogoId: formData.companyLogoId,
      trialPeriodTitle: formData.trialPeriodTitle,
      paidHolidaysTitle: formData.paidHolidaysTitle,
      vacationBenefitsTitle: formData.vacationBenefitsTitle,
      sickLeaveTitle: formData.sickLeaveTitle,
      healthInsuranceTitle: formData.healthInsuranceTitle,
      directDepositTitle: formData.directDepositTitle,
      companyVehiclesPolicyTitle: formData.companyVehiclesPolicyTitle,
      socialMediaPolicyTitle: formData.socialMediaPolicyTitle,
      progressiveDisciplinePolicyTitle: formData.progressiveDisciplinePolicyTitle,
      recordingDevicePolicyTitle: formData.recordingDevicePolicyTitle,
      employeeDressPolicyTitle: formData.employeeDressPolicyTitle,
      travelAndExpensePolicyTitle: formData.travelAndExpensePolicyTitle,
      workFromHomePolicyTitle: formData.workFromHomePolicyTitle,
      virtualMeetingsPolicyTitle: formData.virtualMeetingsPolicyTitle,
      appendixConditions: formData.appendixConditions,
      existingHandbook: formData.existingHandbook,
      confirmHandbook: formData.confirmHandbook
    }
  }, [formData])

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    resetForm,
    getFormDataForApi,
    setIsSubmitting
  }
}
