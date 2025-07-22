'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Settings, User, Building, Save, LogOut } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/lib/context/theme-context'
import { useAuthContext } from '@/lib/context/auth-context'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [isSaving, setIsSaving] = useState(false)
  const { theme, changeTheme } = useTheme()
  const { user } = useAuthContext()
  const supabase = createClient()

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: 'America/New_York'
  })

  // Company form state
  const [companyData, setCompanyData] = useState({
    companyName: '',
    legalName: '',
    ein: '',
    industry: 'technology',
    address: '',
    city: '',
    state: 'NY',
    zipCode: ''
  })

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingCompany, setIsLoadingCompany] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')


  // Load user profile data
  const loadProfileData = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoadingProfile(true)
      
      // Use user data directly from auth.users instead of separate profile table
      setProfileData({
        firstName: user.user_metadata?.first_name || user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.last_name || user.user_metadata?.lastName || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        timezone: user.user_metadata?.timezone || 'America/New_York'
      })
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [user?.id, user?.email, user?.user_metadata])

  // Load company data
  const loadCompanyData = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoadingCompany(true)
      
      // Get company data from database
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading company:', error)
        return
      }

      if (company) {
        setCompanyData({
          companyName: company.name || '',
          legalName: company.legal_name || '',
          ein: company.ein || '',
          industry: company.industry || 'technology',
          address: company.address || '',
          city: company.city || '',
          state: company.state || 'NY',
          zipCode: company.zip_code || ''
        })
      }
    } catch (error) {
      console.error('Error loading company data:', error)
    } finally {
      setIsLoadingCompany(false)
    }
  }, [user?.id, supabase])

  // Load data on component mount
  useEffect(() => {
    if (user?.id) {
      loadProfileData()
      loadCompanyData()
    }
  }, [user?.id, loadProfileData, loadCompanyData])

  // Handle profile form changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle company form changes
  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Save profile data
  const saveProfile = async () => {
    if (!user?.id) {
      setSaveMessage('Error: User not authenticated')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Update user metadata in auth.users directly
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          timezone: profileData.timezone
        }
      })

      if (authError) {
        console.error('Error updating auth metadata:', authError)
        setSaveMessage('Error saving profile: ' + authError.message)
        return
      }

      setSaveMessage('Profile saved successfully!')
      console.log('Profile saved:', profileData)
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveMessage('Error saving profile. Please try again.')
    } finally {
      setIsSaving(false)
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // Save company data
  const saveCompany = async () => {
    if (!user?.id) {
      setSaveMessage('Error: User not authenticated')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Save company data to database
      const { error } = await supabase
        .from('companies')
        .upsert({
          user_id: user.id,
          name: companyData.companyName,
          legal_name: companyData.legalName,
          ein: companyData.ein,
          industry: companyData.industry,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          zip_code: companyData.zipCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving company:', error)
        setSaveMessage('Error saving company: ' + error.message)
        return
      }

      setSaveMessage('Company information saved successfully!')
      console.log('Company saved:', companyData)
    } catch (error) {
      console.error('Error saving company:', error)
      setSaveMessage('Error saving company. Please try again.')
    } finally {
      setIsSaving(false)
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // Handle save based on active tab
  const handleSave = async () => {
    if (activeTab === 'account') {
      await saveProfile()
    } else if (activeTab === 'company') {
      await saveCompany()
    }
  }



  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        // Redirect to login page
        window.location.href = '/auth/login'
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const tabs = [
    { id: 'account', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 h-full flex flex-col">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Account Profile</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account, company, and appearance settings
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-destructive-200 text-destructive-600 hover:bg-destructive-50 dark:border-destructive-700 dark:text-destructive-400 dark:hover:bg-destructive-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
              {saveMessage && (
                <div className={`mt-4 p-3 rounded-md ${
                  saveMessage.includes('Error') 
                    ? 'bg-destructive-50 dark:bg-destructive-900 text-destructive-800 dark:text-destructive-200' 
                    : 'bg-success-50 dark:bg-success-900 text-success-800 dark:text-success-200'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>

            {/* Horizontal Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 h-full flex flex-col">
                              {activeTab === 'account' && (
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Profile
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and preferences
                      </CardDescription>
                    </CardHeader>
                                        {isLoadingProfile && (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading profile data...</p>
                      </div>
                    )}

                    {!isLoadingProfile && (
                      <CardContent className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileData.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileData.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select 
                        id="timezone" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        value={profileData.timezone}
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      </select>
                    </div>
                  </CardContent>
                    )}
                  </Card>
                )}

              {activeTab === 'company' && (
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        Company Information
                      </CardTitle>
                      <CardDescription>
                        Manage your company details and legal information
                      </CardDescription>
                    </CardHeader>
                    {isLoadingCompany && (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading company data...</p>
                      </div>
                    )}
                    {!isLoadingCompany && (
                      <CardContent className="space-y-6 flex-1">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={companyData.companyName}
                        onChange={(e) => handleCompanyChange('companyName', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legalName">Legal Entity Name</Label>
                      <Input 
                        id="legalName" 
                        value={companyData.legalName}
                        onChange={(e) => handleCompanyChange('legalName', e.target.value)}
                        placeholder="Enter legal entity name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ein">Employer Identification Number (EIN)</Label>
                        <Input 
                          id="ein" 
                          value={companyData.ein}
                          onChange={(e) => handleCompanyChange('ein', e.target.value)}
                          placeholder="12-3456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <select 
                          id="industry" 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                          value={companyData.industry}
                          onChange={(e) => handleCompanyChange('industry', e.target.value)}
                        >
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="retail">Retail</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Business Address</Label>
                      <Input 
                        id="address" 
                        value={companyData.address}
                        onChange={(e) => handleCompanyChange('address', e.target.value)}
                        placeholder="Enter business address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          value={companyData.city}
                          onChange={(e) => handleCompanyChange('city', e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <select 
                          id="state" 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                          value={companyData.state}
                          onChange={(e) => handleCompanyChange('state', e.target.value)}
                        >
                          <option value="NY">New York</option>
                          <option value="CA">California</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="IL">Illinois</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          value={companyData.zipCode}
                          onChange={(e) => handleCompanyChange('zipCode', e.target.value)}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </CardContent>
                    )}
                  </Card>
                )}


            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 