'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, MapPin, Building, Users, Calendar, Gift, DollarSign, UserCheck, Target, Car, Shield, Smartphone, Video, Plane, Home } from 'lucide-react'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface FormData {
  // Employee locations
  employeeLocations: 'single' | 'multiple'
  stateName: string
  stateNames: string
  relevantCities: string
  
  // Company info
  companyName: string
  headcount: string
  industry: string
  
  // Introductory period
  introductoryPeriod: boolean
  introductoryPeriodDays: string
  
  // Paid holidays
  paidHolidays: boolean
  paidHolidayNames: string
  
  // PTO
  ptoType: 'accrued' | 'flexible' | 'accrued-vacation-only' | 'flexible-vacation-accrued-sick'
  weeklyAccruedHours: string
  vacationHoursPer40: string
  sickHoursPer40: string
  maxSickHours: string
  sickLeavePer40: string
  maxSickLeaveHours: string
  
  // Benefits
  medicalBenefits: boolean
  dentalBenefits: boolean
  visionBenefits: boolean
  retirementPlan: boolean
  
  // Pay and hours
  payrollFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
  directDeposit: boolean
  fullTimeHours: string
  
  // Responsible parties
  hrManagerName: string
  payrollManagerName: string
  performanceReviewPeriod: string
  
  // Mission statement
  missionStatement: string
  
  // Optional policies
  companyVehicles: boolean
  progressiveDiscipline: boolean
  socialMedia: boolean
  recordingDevices: boolean
  travelExpense: boolean
  workFromHome: boolean
  virtualMeetings: boolean
}

const steps = [
  {
    id: 1,
    title: 'Employee Locations',
    icon: MapPin,
    description: 'Where are your employees located?'
  },
  {
    id: 2,
    title: 'Company Information',
    icon: Building,
    description: 'Basic company details'
  },
  {
    id: 3,
    title: 'Introductory Period',
    icon: Calendar,
    description: 'Probationary period settings'
  },
  {
    id: 4,
    title: 'Paid Holidays',
    icon: Gift,
    description: 'Holiday policy configuration'
  },
  {
    id: 5,
    title: 'PTO & Leave',
    icon: Calendar,
    description: 'Time off and vacation policies'
  },
  {
    id: 6,
    title: 'Benefits',
    icon: Gift,
    description: 'Employee benefits offered'
  },
  {
    id: 7,
    title: 'Pay & Hours',
    icon: DollarSign,
    description: 'Compensation and work hours'
  },
  {
    id: 8,
    title: 'Responsible Parties',
    icon: UserCheck,
    description: 'Key personnel and review periods'
  },
  {
    id: 9,
    title: 'Mission & Policies',
    icon: Target,
    description: 'Company mission and optional policies'
  }
]

function CreateHandbookContent() {
  const searchParams = useSearchParams()
  const baseHandbook = searchParams.get('base')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    employeeLocations: 'single',
    stateName: '',
    stateNames: '',
    relevantCities: '',
    companyName: '',
    headcount: '',
    industry: '',
    introductoryPeriod: false,
    introductoryPeriodDays: '',
    paidHolidays: false,
    paidHolidayNames: '',
    ptoType: 'accrued',
    weeklyAccruedHours: '',
    vacationHoursPer40: '',
    sickHoursPer40: '',
    maxSickHours: '',
    sickLeavePer40: '',
    maxSickLeaveHours: '',
    medicalBenefits: false,
    dentalBenefits: false,
    visionBenefits: false,
    retirementPlan: false,
    payrollFrequency: 'bi-weekly',
    directDeposit: false,
    fullTimeHours: '',
    hrManagerName: '',
    payrollManagerName: '',
    performanceReviewPeriod: '',
    missionStatement: '',
    companyVehicles: false,
    progressiveDiscipline: false,
    socialMedia: false,
    recordingDevices: false,
    travelExpense: false,
    workFromHome: false,
    virtualMeetings: false
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Load base handbook data when component mounts
  useEffect(() => {
    if (baseHandbook) {
      console.log('Loading base handbook data:', baseHandbook)
      // Here you would typically load the base handbook data
      // For now, we'll just log the selection
      if (baseHandbook === 'current') {
        console.log('Using current handbook as base')
      } else if (baseHandbook.startsWith('old-')) {
        const handbookId = baseHandbook.replace('old-', '')
        console.log('Using old handbook as base:', handbookId)
      } else if (baseHandbook === 'scratch') {
        console.log('Starting from scratch')
      }
    }
  }, [baseHandbook])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    console.log('Submitting handbook data:', formData)
    console.log('Base handbook used:', baseHandbook)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Navigate to handbook preview or success page
    window.location.href = '/handbook'
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Where are your employees located?</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="single"
                    checked={formData.employeeLocations === 'single'}
                    onChange={(e) => handleInputChange('employeeLocations', e.target.value)}
                    className="mr-3"
                  />
                  Single state
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="multiple"
                    checked={formData.employeeLocations === 'multiple'}
                    onChange={(e) => handleInputChange('employeeLocations', e.target.value)}
                    className="mr-3"
                  />
                  Multiple states
                </label>
              </div>
            </div>

            {formData.employeeLocations === 'single' ? (
              <div>
                <Label htmlFor="stateName">State name</Label>
                <Input
                  id="stateName"
                  value={formData.stateName}
                  onChange={(e) => handleInputChange('stateName', e.target.value)}
                  placeholder="e.g., California"
                  className="mt-2"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="stateNames">State names</Label>
                <Input
                  id="stateNames"
                  value={formData.stateNames}
                  onChange={(e) => handleInputChange('stateNames', e.target.value)}
                  placeholder="e.g., California, New York, Texas"
                  className="mt-2"
                />
              </div>
            )}

            <div>
              <Label htmlFor="relevantCities">Relevant cities</Label>
              <Input
                id="relevantCities"
                value={formData.relevantCities}
                onChange={(e) => handleInputChange('relevantCities', e.target.value)}
                placeholder="e.g., San Francisco, Los Angeles, San Diego"
                className="mt-2"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g., Acme Corporation"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="headcount">Headcount</Label>
              <Input
                id="headcount"
                value={formData.headcount}
                onChange={(e) => handleInputChange('headcount', e.target.value)}
                placeholder="e.g., 50-100 employees"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="mt-2"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Do you have an introductory period?</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.introductoryPeriod === true}
                    onChange={() => handleInputChange('introductoryPeriod', true)}
                    className="mr-3"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.introductoryPeriod === false}
                    onChange={() => handleInputChange('introductoryPeriod', false)}
                    className="mr-3"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.introductoryPeriod && (
              <div>
                <Label htmlFor="introductoryPeriodDays">Introductory period days</Label>
                <Input
                  id="introductoryPeriodDays"
                  value={formData.introductoryPeriodDays}
                  onChange={(e) => handleInputChange('introductoryPeriodDays', e.target.value)}
                  placeholder="e.g., 90"
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Do you offer paid holidays?</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.paidHolidays === true}
                    onChange={() => handleInputChange('paidHolidays', true)}
                    className="mr-3"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.paidHolidays === false}
                    onChange={() => handleInputChange('paidHolidays', false)}
                    className="mr-3"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.paidHolidays && (
              <div>
                <Label htmlFor="paidHolidayNames">Paid holiday names</Label>
                <Input
                  id="paidHolidayNames"
                  value={formData.paidHolidayNames}
                  onChange={(e) => handleInputChange('paidHolidayNames', e.target.value)}
                  placeholder="e.g., New Year's Day, Memorial Day, Independence Day"
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">PTO type</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="accrued"
                    checked={formData.ptoType === 'accrued'}
                    onChange={(e) => handleInputChange('ptoType', e.target.value)}
                    className="mr-3"
                  />
                  Accrued PTO
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="flexible"
                    checked={formData.ptoType === 'flexible'}
                    onChange={(e) => handleInputChange('ptoType', e.target.value)}
                    className="mr-3"
                  />
                  Flexible vacation and accrued sick leave
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="accrued-vacation-only"
                    checked={formData.ptoType === 'accrued-vacation-only'}
                    onChange={(e) => handleInputChange('ptoType', e.target.value)}
                    className="mr-3"
                  />
                  Accrued vacation only
                </label>
              </div>
            </div>

            {formData.ptoType === 'accrued' && (
              <>
                <div>
                  <Label htmlFor="weeklyAccruedHours">Weekly accrued hours per 40 hours worked</Label>
                  <Input
                    id="weeklyAccruedHours"
                    value={formData.weeklyAccruedHours}
                    onChange={(e) => handleInputChange('weeklyAccruedHours', e.target.value)}
                    placeholder="e.g., 4"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="vacationHoursPer40">Vacation hours earned per 40 hours worked</Label>
                  <Input
                    id="vacationHoursPer40"
                    value={formData.vacationHoursPer40}
                    onChange={(e) => handleInputChange('vacationHoursPer40', e.target.value)}
                    placeholder="e.g., 3"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="sickHoursPer40">Sick hours earned per 40 hours worked</Label>
                  <Input
                    id="sickHoursPer40"
                    value={formData.sickHoursPer40}
                    onChange={(e) => handleInputChange('sickHoursPer40', e.target.value)}
                    placeholder="e.g., 1"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSickHours">Maximum sick hours</Label>
                  <Input
                    id="maxSickHours"
                    value={formData.maxSickHours}
                    onChange={(e) => handleInputChange('maxSickHours', e.target.value)}
                    placeholder="e.g., 80"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {formData.ptoType === 'flexible' && (
              <>
                <div>
                  <Label htmlFor="sickLeavePer40">Sick leave earned per 40 hours worked</Label>
                  <Input
                    id="sickLeavePer40"
                    value={formData.sickLeavePer40}
                    onChange={(e) => handleInputChange('sickLeavePer40', e.target.value)}
                    placeholder="e.g., 1"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSickLeaveHours">Maximum sick leave hours</Label>
                  <Input
                    id="maxSickLeaveHours"
                    value={formData.maxSickLeaveHours}
                    onChange={(e) => handleInputChange('maxSickLeaveHours', e.target.value)}
                    placeholder="e.g., 80"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {formData.ptoType === 'accrued-vacation-only' && (
              <>
                <div>
                  <Label htmlFor="vacationHoursPer40">Accrued vacation per 40 hours worked</Label>
                  <Input
                    id="vacationHoursPer40"
                    value={formData.vacationHoursPer40}
                    onChange={(e) => handleInputChange('vacationHoursPer40', e.target.value)}
                    placeholder="e.g., 4"
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Company benefits</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.medicalBenefits}
                    onCheckedChange={(checked) => handleInputChange('medicalBenefits', checked)}
                    className="mr-3"
                  />
                  Medical benefits offered
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.dentalBenefits}
                    onCheckedChange={(checked) => handleInputChange('dentalBenefits', checked)}
                    className="mr-3"
                  />
                  Dental benefits offered
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.visionBenefits}
                    onCheckedChange={(checked) => handleInputChange('visionBenefits', checked)}
                    className="mr-3"
                  />
                  Vision benefits offered
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.retirementPlan}
                    onCheckedChange={(checked) => handleInputChange('retirementPlan', checked)}
                    className="mr-3"
                  />
                  Retirement plan offered
                </label>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Payroll frequency</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="weekly"
                    checked={formData.payrollFrequency === 'weekly'}
                    onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
                    className="mr-3"
                  />
                  Weekly
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bi-weekly"
                    checked={formData.payrollFrequency === 'bi-weekly'}
                    onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
                    className="mr-3"
                  />
                  Bi-weekly
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="semi-monthly"
                    checked={formData.payrollFrequency === 'semi-monthly'}
                    onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
                    className="mr-3"
                  />
                  Semi-monthly
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="monthly"
                    checked={formData.payrollFrequency === 'monthly'}
                    onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
                    className="mr-3"
                  />
                  Monthly
                </label>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Direct deposit offered?</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.directDeposit === true}
                    onChange={() => handleInputChange('directDeposit', true)}
                    className="mr-3"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.directDeposit === false}
                    onChange={() => handleInputChange('directDeposit', false)}
                    className="mr-3"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="fullTimeHours">Full-time hours</Label>
              <Input
                id="fullTimeHours"
                value={formData.fullTimeHours}
                onChange={(e) => handleInputChange('fullTimeHours', e.target.value)}
                placeholder="e.g., 40"
                className="mt-2"
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hrManagerName">HR Manager name</Label>
              <Input
                id="hrManagerName"
                value={formData.hrManagerName}
                onChange={(e) => handleInputChange('hrManagerName', e.target.value)}
                placeholder="e.g., Jane Smith"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="payrollManagerName">Payroll Manager name</Label>
              <Input
                id="payrollManagerName"
                value={formData.payrollManagerName}
                onChange={(e) => handleInputChange('payrollManagerName', e.target.value)}
                placeholder="e.g., John Doe"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="performanceReviewPeriod">Performance review period</Label>
              <Input
                id="performanceReviewPeriod"
                value={formData.performanceReviewPeriod}
                onChange={(e) => handleInputChange('performanceReviewPeriod', e.target.value)}
                placeholder="e.g., Annual, Semi-annual, Quarterly"
                className="mt-2"
              />
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="missionStatement">Mission statement</Label>
              <Textarea
                id="missionStatement"
                value={formData.missionStatement}
                onChange={(e) => handleInputChange('missionStatement', e.target.value)}
                placeholder="Enter your company's mission statement..."
                className="mt-2 resize-none"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Optional policies</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.companyVehicles}
                    onCheckedChange={(checked) => handleInputChange('companyVehicles', checked)}
                    className="mr-3"
                  />
                  Company vehicles
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.progressiveDiscipline}
                    onCheckedChange={(checked) => handleInputChange('progressiveDiscipline', checked)}
                    className="mr-3"
                  />
                  Progressive discipline
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.socialMedia}
                    onCheckedChange={(checked) => handleInputChange('socialMedia', checked)}
                    className="mr-3"
                  />
                  Social media
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.recordingDevices}
                    onCheckedChange={(checked) => handleInputChange('recordingDevices', checked)}
                    className="mr-3"
                  />
                  Recording devices
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.travelExpense}
                    onCheckedChange={(checked) => handleInputChange('travelExpense', checked)}
                    className="mr-3"
                  />
                  Travel and expense
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.workFromHome}
                    onCheckedChange={(checked) => handleInputChange('workFromHome', checked)}
                    className="mr-3"
                  />
                  Work from home
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.virtualMeetings}
                    onCheckedChange={(checked) => handleInputChange('virtualMeetings', checked)}
                    className="mr-3"
                  />
                  Virtual meetings
                </label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <SimpleLayout>
      <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/handbook'}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Create New Handbook</h1>
                  <p className="text-gray-600 mt-2">
                    Answer these questions to generate your customized employee handbook
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between w-full">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                      currentStep > step.id
                        ? 'bg-success-600 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        currentStep > step.id ? 'bg-success-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  {React.createElement(steps[currentStep - 1].icon, { className: 'w-5 h-5 text-primary-600' })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
                  <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardContent className="p-6">
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Handbook'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SimpleLayout>
  )
}

export default function CreateHandbookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateHandbookContent />
    </Suspense>
  )
} 