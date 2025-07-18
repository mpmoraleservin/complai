'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    size: '',
    states: [] as string[],
  })
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      // Here you would save the company data to the database
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter your company name"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare, Manufacturing"
                value={companyData.industry}
                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <select
                id="size"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={companyData.size}
                onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Which states do you operate in? This helps us provide state-specific compliance guidance.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'].map((state) => (
                <label key={state} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={companyData.states.includes(state)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCompanyData({
                          ...companyData,
                          states: [...companyData.states, state],
                        })
                      } else {
                        setCompanyData({
                          ...companyData,
                          states: companyData.states.filter((s) => s !== state),
                        })
                      }
                    }}
                    className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm">{state}</span>
                </label>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Almost Done!</h3>
              <p className="text-gray-600">
                We&apos;re setting up your COMPLai workspace with compliance monitoring for your states.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">What&apos;s next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Generate your first employment contract</li>
                <li>• Set up team member invitations</li>
                <li>• Configure your compliance preferences</li>
                <li>• Connect your e-signature provider</li>
              </ul>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AuthLayout
      title={`Step ${step} of 3`}
      subtitle={
        step === 1
          ? "Let's get to know your company"
          : step === 2
          ? "Where do you operate?"
          : "Final setup"
      }
    >
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {renderStep()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="px-6"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6"
          >
            {isLoading ? 'Setting up...' : step === 3 ? 'Complete Setup' : 'Next'}
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
} 