'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { ArrowLeft, UserPlus, Save, X, Mail, Phone, Globe, FileText, CheckCircle, Upload, Plus } from 'lucide-react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AddEmployeeContent() {
  const searchParams = useSearchParams()
  const referrer = searchParams.get('referrer')
  
  const [activeTab, setActiveTab] = useState('employee-details')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthMonth: '',
    birthDate: '',
    birthYear: '',
    gender: '',
    email: '',
    currentRole: '',
    country: '',
    phoneNumber: '',
    timezone: '',
    bio: '',
    department: '',
    employmentType: '',
    paymentPeriod: '',
    engagement: '',
    hiredMonth: '',
    hiredDate: '',
    hiredYear: '',
    deploymentMonth: '',
    deploymentDate: '',
    deploymentYear: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const roles = [
    'Product Designer',
    'Product Manager', 
    'Senior Developer',
    'UX Designer',
    'Marketing Manager',
    'HR Specialist',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Data Analyst',
    'Sales Representative',
    'Customer Success Manager'
  ]

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Operations',
    'Finance',
    'Legal'
  ]

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Adding employee:', formData)
    
    // Show success message
    setShowSuccess(true)
    setIsSubmitting(false)

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      birthMonth: '',
      birthDate: '',
      birthYear: '',
      gender: '',
      email: '',
      currentRole: '',
      country: '',
      phoneNumber: '',
      timezone: '',
      bio: '',
      department: '',
      employmentType: '',
      paymentPeriod: '',
      engagement: '',
      hiredMonth: '',
      hiredDate: '',
      hiredYear: '',
      deploymentMonth: '',
      deploymentDate: '',
      deploymentYear: ''
    })

    // Redirect after 2 seconds
    setTimeout(() => {
      if (referrer === 'team') {
        window.location.href = '/team'
      } else {
        window.location.href = '/dashboard'
      }
    }, 2000)
  }

  const handleCancel = () => {
    if (referrer === 'team') {
      window.location.href = '/team'
    } else {
      window.location.href = '/dashboard'
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.currentRole && formData.department

  const renderEmployeeDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Personal info</h3>
        <p className="text-sm text-gray-600 mb-6">Add the employee&apos;s personal details here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="currentRole">Current Role</Label>
            <Select value={formData.currentRole} onValueChange={(value) => handleInputChange('currentRole', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <div>
            <Label>Birth Month</Label>
            <Select value={formData.birthMonth} onValueChange={(value) => handleInputChange('birthMonth', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Birth Date</Label>
            <Select value={formData.birthDate} onValueChange={(value) => handleInputChange('birthDate', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Birth Year</Label>
            <Select value={formData.birthYear} onValueChange={(value) => handleInputChange('birthYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="timezone"
                placeholder="e.g., Pacific Standard Time (PST) UTC-08:00"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about the employee..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    </div>
  )

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Employment info</h3>
        <p className="text-sm text-gray-600 mb-6">This section manages all of the team member&apos;s employment details.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              placeholder="Enter role"
              value={formData.currentRole}
              onChange={(e) => handleInputChange('currentRole', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Employment Type</Label>
            <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="W-2 Employee">W-2 Employee</SelectItem>
                <SelectItem value="1099 Contractor">1099 Contractor</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Engagement</Label>
            <Select value={formData.engagement} onValueChange={(value) => handleInputChange('engagement', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fulltime">Fulltime</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label>Payment Period</Label>
            <Select value={formData.paymentPeriod} onValueChange={(value) => handleInputChange('paymentPeriod', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Hired Date</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-1">
            <Select value={formData.hiredMonth} onValueChange={(value) => handleInputChange('hiredMonth', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.hiredDate} onValueChange={(value) => handleInputChange('hiredDate', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.hiredYear} onValueChange={(value) => handleInputChange('hiredYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Deployment Date</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-1">
            <Select value={formData.deploymentMonth} onValueChange={(value) => handleInputChange('deploymentMonth', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.deploymentDate} onValueChange={(value) => handleInputChange('deploymentDate', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.deploymentYear} onValueChange={(value) => handleInputChange('deploymentYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
        <p className="text-sm text-gray-600 mb-6">Upload and manage employee documents.</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Upload documents</p>
          <p className="text-xs text-gray-500">Drag and drop files here, or click to browse</p>
          <Button variant="outline" className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Job Offer Letter</p>
                  <p className="text-xs text-gray-500">Required for all new employees</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Employee Handbook</p>
                  <p className="text-xs text-gray-500">Must be acknowledged</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tax Forms</p>
                  <p className="text-xs text-gray-500">W-4 or W-9 depending on employment type</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotesTimeline = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Notes & Timeline</h3>
        <p className="text-sm text-gray-600 mb-6">Add notes and track important events.</p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Add Note</Label>
            <Textarea
              id="notes"
              placeholder="Add a note about this employee..."
              className="mt-1"
              rows={3}
            />
          </div>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Employee Created</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <SimpleLayout>
      <div className="p-6">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
          <div>
                  <h1 className="text-3xl font-bold text-gray-900">Add Employee</h1>
                  <p className="text-gray-600 mt-2">
                    Add a new employee to your team
                  </p>
          </div>
          </div>
        </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <Card className="mb-6 border-success-200 bg-success-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mr-3">
                    <UserPlus className="w-4 h-4 text-success-600" />
          </div>
          <div>
                    <h3 className="font-medium text-success-900">Employee Added Successfully!</h3>
                    <p className="text-sm text-success-700">
                      Redirecting you back to {referrer === 'team' ? 'team page' : 'dashboard'}...
                    </p>
          </div>
        </div>
              </CardContent>
            </Card>
          )}

          {/* Form with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Employee Information
              </CardTitle>
              <CardDescription>
                Complete all sections to add the new employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="employee-details" className="mt-6">
                  {renderEmployeeDetails()}
                </TabsContent>

                <TabsContent value="employment-details" className="mt-6">
                  {renderEmploymentDetails()}
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  {renderDocuments()}
                </TabsContent>

                <TabsContent value="notes-timeline" className="mt-6">
                  {renderNotesTimeline()}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                    className="bg-primary-600 hover:bg-primary-700"
                >
                  {isSubmitting ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Adding Employee...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Employee
                    </>
                  )}
                  </Button>
          </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary-600">1</span>
          </div>
          <div>
                    <p className="text-gray-900">Employee will be added to your team roster</p>
          </div>
        </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary-600">2</span>
          </div>
          <div>
                    <p className="text-gray-900">Handbook acknowledgment status will be set to &quot;Pending&quot;</p>
          </div>
        </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary-600">3</span>
    </div>
      <div>
                    <p className="text-gray-900">You can manage their profile and status from the team page</p>
          </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  )
}

export default function AddEmployeePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddEmployeeContent />
    </Suspense>
  )
} 