'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  ChevronLeft,
  Upload,
  Sparkles,
  Trash2,
  User,
  Calendar,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle
} from 'lucide-react'

export default function AddEmployeePage() {
  const [activeTab, setActiveTab] = useState('employee-details')
  const [originPage, setOriginPage] = useState('/dashboard')
  
  // Detect the origin page for navigation
  useEffect(() => {
    const getOriginPage = () => {
      // Check if there's a referrer parameter in the URL
      const urlParams = new URLSearchParams(window.location.search)
      const referrer = urlParams.get('referrer')
      
      if (referrer === 'team') {
        return '/team'
      }
      
      // Check document.referrer as fallback
      if (document.referrer && document.referrer.includes('/team')) {
        return '/team'
      }
      
      // Default to dashboard
      return '/dashboard'
    }
    
    setOriginPage(getOriginPage())
  }, [])
  const [formData, setFormData] = useState({
    firstName: 'Oliva',
    lastName: 'Rhye',
    birthMonth: '',
    birthDate: '',
    birthYear: '',
    gender: 'Male',
    email: 'olivia@untitledui.com',
    currentRole: 'Product Designer',
    country: 'United States',
    phoneNumber: '+1 123 151 1231',
    timezone: 'Pacific Standard Time (PST) UTC-08:00',
    bio: "I&apos;m a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
    department: 'Engineering',
    employmentType: 'W-2 Employee',
    paymentPeriod: 'Monthly',
    engagement: 'Fulltime',
    hiredMonth: '',
    hiredDate: '',
    hiredYear: '',
    deploymentMonth: '',
    deploymentDate: '',
    deploymentYear: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'employee-details', label: 'Employee Details' },
    { id: 'employment-details', label: 'Employment Details' },
    { id: 'documents', label: 'Documents' }
  ]

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

  const renderEmployeeDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Personal info</h3>
        <p className="text-sm text-gray-600 mb-6">Update your photo and personal details here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <Label>Month</Label>
            <select
              value={formData.birthMonth}
              onChange={(e) => handleInputChange('birthMonth', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <select
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select date</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Year</Label>
            <select
              value={formData.birthYear}
              onChange={(e) => handleInputChange('birthYear', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Gender</Label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mt-6">
          <Label htmlFor="email">Email address</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label>Your photo</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">This will be displayed on their profile.</p>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop<br />
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="currentRole">Current Role</Label>
          <Input
            id="currentRole"
            value={formData.currentRole}
            onChange={(e) => handleInputChange('currentRole', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Country</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🇺🇸</span>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label>Timezone</Label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Pacific Standard Time (PST) UTC-08:00">Pacific Standard Time (PST) UTC-08:00</option>
              <option value="Eastern Standard Time (EST) UTC-05:00">Eastern Standard Time (EST) UTC-05:00</option>
              <option value="Central European Time (CET) UTC+01:00">Central European Time (CET) UTC+01:00</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Bio</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">Write a short introduction.</p>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tell us about yourself..."
          />
          <p className="text-sm text-gray-500 mt-2">275 characters left</p>
        </div>

        <div className="mt-6">
          <Label>Career Highlights</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">Share a few snippets of their work.</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop<br />
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm font-medium">CV.pdf</span>
              <span className="text-sm text-gray-500 ml-2">(200 KB)</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 bg-primary-200 rounded-full h-2 mr-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <CheckCircle className="w-4 h-4 text-success-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Employment info</h3>
        <p className="text-sm text-gray-600 mb-6">This section manages all of the team member&apos;s employment details.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.currentRole}
              onChange={(e) => handleInputChange('currentRole', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Department</Label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Employment Type</Label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="W-2 Employee">W-2 Employee</option>
              <option value="1099 Contractor">1099 Contractor</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div>
            <Label>Payment Period</Label>
            <select
              value={formData.paymentPeriod}
              onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Monthly">Monthly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div>
            <Label>Engagement</Label>
            <select
              value={formData.engagement}
              onChange={(e) => handleInputChange('engagement', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Fulltime">Fulltime</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Hired Date</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            <select
              value={formData.hiredMonth}
              onChange={(e) => handleInputChange('hiredMonth', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={formData.hiredDate}
              onChange={(e) => handleInputChange('hiredDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Date</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={formData.hiredYear}
              onChange={(e) => handleInputChange('hiredYear', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Deployment Date</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            <select
              value={formData.deploymentMonth}
              onChange={(e) => handleInputChange('deploymentMonth', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={formData.deploymentDate}
              onChange={(e) => handleInputChange('deploymentDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Date</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={formData.deploymentYear}
              onChange={(e) => handleInputChange('deploymentYear', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Employment info</h3>
        <p className="text-sm text-gray-600 mb-6">This section manages all of the team member&apos;s employment details.</p>
        
        <div className="space-y-6">
          {/* Offer Letter */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-2">Offer Letter</h4>
            <p className="text-sm text-gray-600 mb-4">
              Displays the details of the employee&apos;s initial job offer, including position, compensation, and start date.
            </p>
            <div className="flex items-center justify-between">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <div className="flex-1 ml-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop<br />
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
          </div>

          {/* Employee Handbook */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-2">Employee Handbook</h4>
            <p className="text-sm text-gray-600 mb-4">
              Provides the employee with access to company policies, procedures, and workplace expectations.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex-1 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium">Employee Handbook.pdf</span>
                  <span className="text-sm text-gray-500 ml-2">(200 KB)</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-destructive-500" />
                </Button>
              </div>
            </div>
          </div>

          {/* Employment Contract */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-2">Employment Contract</h4>
            <p className="text-sm text-gray-600 mb-4">
              Outlines the terms and conditions of the employee&apos;s role, including responsibilities, duration, and employment type.
            </p>
            <div className="flex items-center justify-between">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <div className="flex-1 ml-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop<br />
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                              <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = originPage}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
                </div>
                <div className="flex items-center space-x-3">
                              <Button
              variant="outline"
              onClick={() => window.location.href = originPage}
            >
              Cancel
            </Button>
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    {activeTab === 'documents' ? 'Send and Save' : 'Proceed'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <Card>
              <CardContent className="p-6">
                {activeTab === 'employee-details' && renderEmployeeDetails()}
                {activeTab === 'employment-details' && renderEmploymentDetails()}
                {activeTab === 'documents' && renderDocuments()}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 