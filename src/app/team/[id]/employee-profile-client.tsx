'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SimpleLayout } from '@/components/layout/simple-layout'
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
  CheckCircle,
  MoreVertical,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react'

interface EmployeeProfileClientProps {
  employeeId: string
}

export default function EmployeeProfileClient({ employeeId }: EmployeeProfileClientProps) {
  const [activeTab, setActiveTab] = useState('employee-details')
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
    bio: "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
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
    { id: 'documents', label: 'Documents' },
    { id: 'notes-timeline', label: 'Notes & Timeline' }
  ]

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

  const mockDocuments = [
    {
      id: 1,
      name: 'Job Offer',
      type: 'Policy',
      status: 'signed',
      lastUpdate: '2 days ago'
    },
    {
      id: 2,
      name: 'Non-Disclosure Agreement',
      type: 'Policy',
      status: 'reviewed',
      lastUpdate: '2 days ago'
    },
    {
      id: 3,
      name: 'Employee Handbook',
      type: 'Policy',
      status: 'signed',
      lastUpdate: '2 days ago'
    },
    {
      id: 4,
      name: 'Policy Compliance',
      type: 'Policy',
      status: 'needs_update',
      lastUpdate: '2 days ago'
    },
    {
      id: 5,
      name: 'Benefits and Perks',
      type: 'Policy',
      status: 'signed',
      lastUpdate: '2 days ago'
    },
    {
      id: 6,
      name: 'Employment Contract',
      type: 'Policy',
      status: 'reviewed',
      lastUpdate: '2 days ago'
    }
  ]

  const statusConfig = {
    signed: { label: 'Signed', color: 'text-success-600', bg: 'bg-success-100' },
    reviewed: { label: 'Reviewed', color: 'text-warning-600', bg: 'bg-warning-100' },
    needs_update: { label: 'Needs Update', color: 'text-destructive-600', bg: 'bg-destructive-100' }
  }

  const renderEmployeeDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Personal info</h3>
        <p className="text-sm text-gray-600 mb-6">Update your photo and personal details here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">Name</Label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
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
              <option value="">Month</option>
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
              <option value="">Date</option>
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
              <option value="">Year</option>
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
          <Label htmlFor="currentRole">Current Role</Label>
          <select
            value={formData.currentRole}
            onChange={(e) => handleInputChange('currentRole', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Product Designer">Product Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Developer">Developer</option>
          </select>
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
        </div>

        <div className="mt-6">
          <Label>Bio</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">Write a short introduction.</p>
          <Textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="mt-6">
          <Label>Career Highlights</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">Share a few snippets of their work.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium">CV.pdf</span>
                <span className="text-sm text-gray-500 ml-2">(200 KB)</span>
              </div>
              <CheckCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium">Dashboard prototype recording.mp4</span>
                <span className="text-sm text-gray-500 ml-2">(16 MB)</span>
              </div>
              <CheckCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium">Dashboard prototype FINAL.fig</span>
                <span className="text-sm text-gray-500 ml-2">(4.2 MB)</span>
              </div>
              <CheckCircle className="w-4 h-4 text-primary-600" />
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

        <div className="border-t border-gray-200 my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <div className="flex items-center">
                      Document Name
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Update</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.map((document) => {
                  const status = statusConfig[document.status as keyof typeof statusConfig]
                  
                  return (
                    <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary-600 mr-3" />
                          <span className="font-medium text-gray-900">{document.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{document.type}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{document.lastUpdate}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 1 to 6 of 6 results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <Button size="sm" className="bg-primary-600 text-white">1</Button>
              </div>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotesTimeline = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notes Column */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-6">Add private remarks or important updates related to the employee&apos;s record.</p>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                  Reviewed
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-2">Policy update notice sent on Jan 15, 2025.</p>
              <p className="text-xs text-gray-500">Added by Mark • 2 days ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Column */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
        <p className="text-sm text-gray-600 mb-6">Track key milestones, updates, and changes in the employee&apos;s journey.</p>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Offer Letter Audited</p>
            <p className="text-xs text-gray-500">Added by Mark • 2 days ago</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Compliance reminder sent</p>
            <p className="text-xs text-gray-500">Added by Mark • 2 days ago</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Employee handbook sent</p>
            <p className="text-xs text-gray-500">Added by Mark • 2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <SimpleLayout>
      <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = '/team'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </div>

            {/* Employee Overview */}
            <div className="mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-success-600">89% Compliant</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Olivia Rhye</h2>
                  <p className="text-gray-600">Product Designer | Engineering Dept</p>
                  <p className="text-gray-500">olivia@untitledui.com</p>
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
                {activeTab === 'notes-timeline' && renderNotesTimeline()}
              </CardContent>
            </Card>
          </div>
        </div>
      </SimpleLayout>
  )
} 