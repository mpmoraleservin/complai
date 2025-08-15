'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FullWidthLayout } from '@/components/layout/full-width-layout'
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, MapPin, Building, Users, Calendar, Gift, DollarSign, UserCheck, Target, Car, Shield, Smartphone, Video, Plane, Home, AlertCircle, Loader2, Download } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHandbookForm } from '@/hooks/use-handbook-form'
import { handbooksApiService } from '@/lib/handbooks-api'
import { 
  STATE_OPTIONS, 
  INDUSTRY_OPTIONS, 
  PAY_PERIOD_OPTIONS, 
  PERFORMANCE_REVIEW_OPTIONS,
  VACATION_BENEFIT_TYPE_OPTIONS 
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

const steps = [
  {
    id: 1,
    title: 'Template Selection',
    icon: BookOpen,
    description: 'Choose your handbook template'
  },
  {
    id: 2,
    title: 'Company Information',
    icon: Building,
    description: 'Basic company details'
  },
  {
    id: 3,
    title: 'Employment Policies',
    icon: UserCheck,
    description: 'Work policies and benefits'
  },
  {
    id: 4,
    title: 'Benefits & Leave',
    icon: Gift,
    description: 'Time off and benefits'
  },
  {
    id: 5,
    title: 'Additional Policies',
    icon: Shield,
    description: 'Additional company policies'
  },
  {
    id: 6,
    title: 'Review & Create',
    icon: CheckCircle,
    description: 'Review and create handbook'
  }
]

export default function CreateHandbookPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdHandbook, setCreatedHandbook] = useState<any>(null)
  
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    resetForm,
    getFormDataForApi,
    setIsSubmitting
  } = useHandbookForm()

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const apiData = getFormDataForApi()
      const response = await handbooksApiService.createHandbook(formData.template, apiData)
      
      if (response.success && response.data) {
        setCreatedHandbook({
          id: response.data.handbook_id,
          pdfUrl: response.data.pdf_url,
          content: response.data.content
        })
        setShowSuccess(true)
      } else {
        throw new Error(response.error || 'Failed to create handbook')
      }
    } catch (error) {
      console.error('Error creating handbook:', error)
      // Handle error - you might want to show a toast notification
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async () => {
    if (!createdHandbook?.id) return
    
    try {
      const blob = await handbooksApiService.downloadHandbookPdf(createdHandbook.id)
      if (blob) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formData.companyName}-Employee-Handbook.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading handbook:', error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return TemplateSelectionStep()
      case 2:
        return CompanyInformationStep()
      case 3:
        return EmploymentPoliciesStep()
      case 4:
        return BenefitsLeaveStep()
      case 5:
        return AdditionalPoliciesStep()
      case 6:
        return ReviewStep()
      default:
        return TemplateSelectionStep()
    }
  }


  const TemplateSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Your Handbook Template</h3>
        <p className="text-muted-foreground">Select the template that best fits your company&apos;s needs</p>
      </div>
      
      <div className="grid gap-4">
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            formData.template === 'small-single-state' && "ring-2 ring-primary"
          )}
          onClick={() => updateField('template', 'small-single-state')}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-lg">Small Single State Company</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Perfect for companies operating in a single state with up to 50 employees.
                  Includes essential policies and benefits.
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                  <li>• Single state compliance</li>
                  <li>• Basic benefits package</li>
                  <li>• Standard employment policies</li>
                  <li>• Quick setup and customization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            formData.template === 'comprehensive-multi-state' && "ring-2 ring-primary"
          )}
          onClick={() => updateField('template', 'comprehensive-multi-state')}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-lg">Comprehensive Multi-State Company</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Ideal for companies operating across multiple states with complex compliance needs.
                  Includes comprehensive policies and multi-state legal requirements.
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                  <li>• Multi-state compliance</li>
                  <li>• Comprehensive benefits package</li>
                  <li>• Advanced employment policies</li>
                  <li>• State-specific legal requirements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const CompanyInformationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Company Information</h3>
        <p className="text-muted-foreground">Tell us about your company</p>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="Enter your company name"
            className={errors.companyName ? 'border-red-500' : ''}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="myState">Primary State *</Label>
            <Select value={formData.myState} onValueChange={(value) => updateField('myState', value)}>
              <SelectTrigger className={errors.myState ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.myState && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.myState}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
            <Input
              id="numberOfEmployees"
              value={formData.numberOfEmployees}
              onChange={(e) => updateField('numberOfEmployees', e.target.value)}
              placeholder="e.g., 25"
              className={errors.numberOfEmployees ? 'border-red-500' : ''}
            />
            {errors.numberOfEmployees && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.numberOfEmployees}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select value={formData.industry} onValueChange={(value) => updateField('industry', value)}>
            <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.industry}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hrManager">HR Manager Title</Label>
            <Input
              id="hrManager"
              value={formData.hrManager}
              onChange={(e) => updateField('hrManager', e.target.value)}
              placeholder="e.g., Human Resources Manager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payrollManager">Payroll Manager Title</Label>
            <Input
              id="payrollManager"
              value={formData.payrollManager}
              onChange={(e) => updateField('payrollManager', e.target.value)}
              placeholder="e.g., Payroll Manager"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const EmploymentPoliciesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Employment Policies</h3>
        <p className="text-muted-foreground">Configure your employment policies</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullTimeHours">Full-time Hours</Label>
            <Input
              id="fullTimeHours"
              type="number"
              value={formData.fullTimeHours}
              onChange={(e) => updateField('fullTimeHours', parseInt(e.target.value))}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payPeriodFrequency">Pay Period Frequency</Label>
            <Select value={formData.payPeriodFrequency} onValueChange={(value) => updateField('payPeriodFrequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {PAY_PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="performanceReviewPeriod">Performance Review Period</Label>
          <Select value={formData.performanceReviewPeriod} onValueChange={(value) => updateField('performanceReviewPeriod', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {PERFORMANCE_REVIEW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trialPeriod"
              checked={formData.trialPeriod}
              onCheckedChange={(checked) => updateField('trialPeriod', checked)}
            />
            <Label htmlFor="trialPeriod">Include Trial Period</Label>
          </div>
          
          {formData.trialPeriod && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="trialPeriodDays">Trial Period Days</Label>
              <Input
                id="trialPeriodDays"
                type="number"
                value={formData.trialPeriodDays}
                onChange={(e) => updateField('trialPeriodDays', parseInt(e.target.value))}
                placeholder="90"
                className={errors.trialPeriodDays ? 'border-red-500' : ''}
              />
              {errors.trialPeriodDays && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.trialPeriodDays}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="directDeposit"
              checked={formData.directDeposit}
              onCheckedChange={(checked) => updateField('directDeposit', checked)}
            />
            <Label htmlFor="directDeposit">Direct Deposit Available</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="workersComp"
              checked={formData.workersComp}
              onCheckedChange={(checked) => updateField('workersComp', checked)}
            />
            <Label htmlFor="workersComp">Workers Compensation</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="healthInsurance"
              checked={formData.healthInsurance}
              onCheckedChange={(checked) => updateField('healthInsurance', checked)}
            />
            <Label htmlFor="healthInsurance">Health Insurance</Label>
          </div>
        </div>
      </div>
    </div>
  )

  const BenefitsLeaveStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Benefits & Leave</h3>
        <p className="text-muted-foreground">Configure your benefits and time off policies</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paidHolidays"
              checked={formData.paidHolidays}
              onCheckedChange={(checked) => updateField('paidHolidays', checked)}
            />
            <Label htmlFor="paidHolidays">Paid Holidays</Label>
          </div>
          
          {formData.paidHolidays && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="paidHolidayNames">Holiday Names (one per line)</Label>
              <Textarea
                id="paidHolidayNames"
                value={formData.paidHolidayNames}
                onChange={(e) => updateField('paidHolidayNames', e.target.value)}
                placeholder="New Year's Day&#10;Martin Luther King Day&#10;Memorial Day&#10;..."
                rows={8}
                className={errors.paidHolidayNames ? 'border-red-500' : ''}
              />
              {errors.paidHolidayNames && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.paidHolidayNames}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vacationBenefits"
              checked={formData.vacationBenefits}
              onCheckedChange={(checked) => updateField('vacationBenefits', checked)}
            />
            <Label htmlFor="vacationBenefits">Vacation Benefits</Label>
          </div>
          
          {formData.vacationBenefits && (
            <div className="ml-6 space-y-4">
              {formData.template === 'small-single-state' && (
                <div className="space-y-2">
                  <Label htmlFor="vacationBenefitType">Vacation Benefit Type</Label>
                  <Select value={formData.vacationBenefitType} onValueChange={(value) => updateField('vacationBenefitType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VACATION_BENEFIT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="vacationBenefitEligibleMonths">Eligible After (Months)</Label>
                   <Input
                     id="vacationBenefitEligibleMonths"
                     type="number"
                     value={formData.vacationBenefitEligibleMonths}
                     onChange={(e) => updateField('vacationBenefitEligibleMonths', parseInt(e.target.value))}
                     placeholder="1"
                     className={errors.vacationBenefitEligibleMonths ? 'border-red-500' : ''}
                   />
                   {errors.vacationBenefitEligibleMonths && (
                     <p className="text-sm text-red-500 flex items-center gap-2">
                       <AlertCircle className="h-4 w-4" />
                       {errors.vacationBenefitEligibleMonths}
                     </p>
                   )}
                 </div>

                 <div className="space-y-2">
                   <div className="flex items-center space-x-2">
                     <Checkbox
                       id="vacationBenefitCarryover"
                       checked={formData.vacationBenefitCarryover}
                       onCheckedChange={(checked) => updateField('vacationBenefitCarryover', checked)}
                     />
                     <Label htmlFor="vacationBenefitCarryover">Allow Carryover</Label>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sickLeave"
              checked={formData.sickLeave}
              onCheckedChange={(checked) => updateField('sickLeave', checked)}
            />
            <Label htmlFor="sickLeave">Sick Leave</Label>
          </div>
        </div>
      </div>
    </div>
  )

  const AdditionalPoliciesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Additional Policies</h3>
        <p className="text-muted-foreground">Configure optional company policies</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="companyVehiclesPolicy"
              checked={formData.companyVehiclesPolicy}
              onCheckedChange={(checked) => updateField('companyVehiclesPolicy', checked)}
            />
            <Label htmlFor="companyVehiclesPolicy">Company Vehicles Policy</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="socialMediaPolicy"
              checked={formData.socialMediaPolicy}
              onCheckedChange={(checked) => updateField('socialMediaPolicy', checked)}
            />
            <Label htmlFor="socialMediaPolicy">Social Media Policy</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="missionStatement"
              checked={formData.missionStatement}
              onCheckedChange={(checked) => updateField('missionStatement', checked)}
            />
            <Label htmlFor="missionStatement">Include Mission Statement</Label>
          </div>
          
          {formData.missionStatement && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="missionStatementText">Mission Statement</Label>
              <Textarea
                id="missionStatementText"
                value={formData.missionStatementText}
                onChange={(e) => updateField('missionStatementText', e.target.value)}
                placeholder="Our company exists to create value for our customers by delivering a world-class product."
                rows={4}
                className={errors.missionStatementText ? 'border-red-500' : ''}
              />
              {errors.missionStatementText && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.missionStatementText}
                </p>
              )}
            </div>
          )}
        </div>

        {formData.template === 'comprehensive-multi-state' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiState"
                checked={formData.multiState}
                onCheckedChange={(checked) => updateField('multiState', checked)}
              />
              <Label htmlFor="multiState">Multi-State Operations</Label>
            </div>
            
            {formData.multiState && (
              <div className="ml-6 space-y-2">
                <Label>Selected States ({formData.multiStateSelectedStates?.length || 0} states)</Label>
                <div className="text-sm text-muted-foreground">
                  All 50 states are automatically included for comprehensive multi-state compliance.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const ReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Your Handbook</h3>
        <p className="text-muted-foreground">Review your selections before creating the handbook</p>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template & Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div>
                 <span className="font-medium">Template:</span>
                 <span className="ml-2 capitalize">{formData.template.replace('-', ' ')}</span>
               </div>
               <div>
                 <span className="font-medium">Company:</span>
                 <span className="ml-2">{formData.companyName}</span>
               </div>
               <div>
                 <span className="font-medium">State:</span>
                 <span className="ml-2">{STATE_OPTIONS.find(s => s.value === formData.myState)?.label}</span>
               </div>
               <div>
                 <span className="font-medium">Employees:</span>
                 <span className="ml-2">{formData.numberOfEmployees}</span>
               </div>
               <div>
                 <span className="font-medium">Industry:</span>
                 <span className="ml-2">{INDUSTRY_OPTIONS.find(i => i.value === formData.industry)?.label}</span>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Policies & Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Full-time Hours:</span>
                <span className="ml-2">{formData.fullTimeHours}</span>
              </div>
              <div>
                <span className="font-medium">Pay Period:</span>
                <span className="ml-2 capitalize">{formData.payPeriodFrequency}</span>
              </div>
              <div>
                <span className="font-medium">Performance Reviews:</span>
                <span className="ml-2 capitalize">{formData.performanceReviewPeriod}</span>
              </div>
              <div>
                <span className="font-medium">Trial Period:</span>
                <span className="ml-2">{formData.trialPeriod ? `${formData.trialPeriodDays} days` : 'No'}</span>
              </div>
              <div>
                <span className="font-medium">Paid Holidays:</span>
                <span className="ml-2">{formData.paidHolidays ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium">Vacation Benefits:</span>
                <span className="ml-2">{formData.vacationBenefits ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Company Vehicles:</span>
                <span className="ml-2">{formData.companyVehiclesPolicy ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium">Social Media:</span>
                <span className="ml-2">{formData.socialMediaPolicy ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium">Mission Statement:</span>
                <span className="ml-2">{formData.missionStatement ? 'Yes' : 'No'}</span>
              </div>
              {formData.template === 'comprehensive-multi-state' && (
                <div>
                  <span className="font-medium">Multi-State:</span>
                  <span className="ml-2">{formData.multiState ? 'Yes' : 'No'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (showSuccess) {
    return (
      <FullWidthLayout>
        <div className="w-full max-w-2xl py-8">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Handbook Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your employee handbook has been generated and is ready for use.
              </p>
              
              <div className="space-y-3">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/handbook')}
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View in Dashboard
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowSuccess(false)
                    resetForm()
                    setCurrentStep(1)
                  }}
                  className="w-full"
                >
                  Create Another Handbook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </FullWidthLayout>
    )
  }

  return (
    <FullWidthLayout>
      <div className="w-full py-4 md:py-8 px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/handbook')}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Employee Handbook</h1>
                <p className="text-sm md:text-base text-gray-600 mt-2">
                  Generate a comprehensive employee handbook tailored to your company&apos;s needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          {/* Stepper visual igual a Incident Coach, ahora 100% ancho y sin scroll */}
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
          {/* Barra de progreso igual a Incident Coach */}
          <Progress value={((currentStep - 1) / (steps.length - 1)) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-4 md:p-6 lg:p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 md:mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="w-full sm:w-auto">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/handbook/preview')}
                className="w-full sm:w-auto min-w-[120px]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Handbook
              </Button>
            )}
          </div>
        </div>
      </div>
    </FullWidthLayout>
  )
} 