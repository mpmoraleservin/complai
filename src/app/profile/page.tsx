'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { User, Building, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Shield, Users, Settings } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@complai.io',
    phone: '+1 (555) 123-4567',
    role: 'HR Manager',
    department: 'Human Resources',
    location: 'San Francisco, CA',
    timezone: 'Pacific Time (PT)',
    bio: 'Experienced HR professional with 8+ years in employee relations, compliance, and organizational development. Passionate about creating inclusive workplaces and ensuring legal compliance.',
    avatar: '/api/placeholder/150/150'
  })

  const [companyData, setCompanyData] = useState({
    name: 'COMPLai Inc.',
    industry: 'Technology',
    size: '50-100 employees',
    founded: '2020',
    website: 'https://complai.io',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    phone: '+1 (555) 987-6543',
    email: 'contact@complai.io',
    description: 'COMPLai is a comprehensive labor compliance platform designed to streamline contract management, legal compliance monitoring, and workforce administration.',
    mission: 'To make employment compliance simple, accessible, and automated for businesses of all sizes.',
    complianceOfficer: 'Sarah Wilson',
    legalAdvisor: 'Michael Johnson'
  })

  const handleUserInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompanyInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveUser = () => {
    console.log('Saving user data:', userData)
    setIsEditing(false)
    // Here you would typically make an API call to save the data
    alert('User profile updated successfully!')
  }

  const handleSaveCompany = () => {
    console.log('Saving company data:', companyData)
    setIsEditingCompany(false)
    // Here you would typically make an API call to save the data
    alert('Company profile updated successfully!')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsEditingCompany(false)
    // Reset to original data if needed
  }

  return (
    <SimpleLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-2">
                  Manage your personal information and company details
                </p>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Company Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-primary-600 mr-2" />
                      <CardTitle>Personal Information</CardTitle>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveUser}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-primary-600" />
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-1 -right-1 w-6 h-6 p-0 rounded-full"
                        >
                          <Camera className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {userData.firstName} {userData.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{userData.role}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userData.firstName}
                        onChange={(e) => handleUserInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userData.lastName}
                        onChange={(e) => handleUserInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleUserInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => handleUserInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={userData.role}
                        onChange={(e) => handleUserInputChange('role', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={userData.department}
                        onChange={(e) => handleUserInputChange('department', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={userData.location}
                        onChange={(e) => handleUserInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={userData.timezone}
                        onValueChange={(value) => handleUserInputChange('timezone', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pacific Time (PT)">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Mountain Time (MT)">Mountain Time (MT)</SelectItem>
                          <SelectItem value="Central Time (CT)">Central Time (CT)</SelectItem>
                          <SelectItem value="Eastern Time (ET)">Eastern Time (ET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) => handleUserInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-primary-600 mr-2" />
                      <CardTitle>Company Information</CardTitle>
                    </div>
                    {!isEditingCompany ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingCompany(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveCompany}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    Your company details and compliance information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Logo */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{companyData.name}</h3>
                      <p className="text-sm text-gray-500">{companyData.industry} • {companyData.size}</p>
                    </div>
                  </div>

                  {/* Company Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyData.name}
                        onChange={(e) => handleCompanyInputChange('name', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={companyData.industry}
                        onValueChange={(value) => handleCompanyInputChange('industry', value)}
                        disabled={!isEditingCompany}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select
                        value={companyData.size}
                        onValueChange={(value) => handleCompanyInputChange('size', value)}
                        disabled={!isEditingCompany}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                          <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                          <SelectItem value="50-100 employees">50-100 employees</SelectItem>
                          <SelectItem value="100-500 employees">100-500 employees</SelectItem>
                          <SelectItem value="500+ employees">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="founded">Founded</Label>
                      <Input
                        id="founded"
                        value={companyData.founded}
                        onChange={(e) => handleCompanyInputChange('founded', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={companyData.website}
                        onChange={(e) => handleCompanyInputChange('website', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input
                        id="companyPhone"
                        value={companyData.phone}
                        onChange={(e) => handleCompanyInputChange('phone', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Company Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => handleCompanyInputChange('email', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={companyData.address}
                        onChange={(e) => handleCompanyInputChange('address', e.target.value)}
                        disabled={!isEditingCompany}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      value={companyData.description}
                      onChange={(e) => handleCompanyInputChange('description', e.target.value)}
                      disabled={!isEditingCompany}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea
                      id="mission"
                      value={companyData.mission}
                      onChange={(e) => handleCompanyInputChange('mission', e.target.value)}
                      disabled={!isEditingCompany}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  {/* Compliance Contacts */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 text-primary-600 mr-2" />
                      Compliance Contacts
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="complianceOfficer">Compliance Officer</Label>
                        <Input
                          id="complianceOfficer"
                          value={companyData.complianceOfficer}
                          onChange={(e) => handleCompanyInputChange('complianceOfficer', e.target.value)}
                          disabled={!isEditingCompany}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="legalAdvisor">Legal Advisor</Label>
                        <Input
                          id="legalAdvisor"
                          value={companyData.legalAdvisor}
                          onChange={(e) => handleCompanyInputChange('legalAdvisor', e.target.value)}
                          disabled={!isEditingCompany}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SimpleLayout>
  )
} 