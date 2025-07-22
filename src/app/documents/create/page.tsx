'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  Plus, 
  Upload, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  FileText,
  Users,
  Calendar,
  Mail,
  X
} from 'lucide-react'

// Mock data for document categories
const documentCategories = {
  policy: {
    title: 'Policy & Compliance Documents',
    description: 'Create and manage employee-related compliance documents such as policy acknowledgments, NDAs, or legal forms.',
    documents: [
      { name: 'Employee Handbook', updated: '2 days ago' },
      { name: 'PTO & Leave Policy', updated: '2 days ago' },
      { name: 'Remote Work Agreement', updated: '2 days ago' }
    ]
  },
  termination: {
    title: 'Termination & Off-boarding',
    description: 'Generate termination letters, clearance forms, and other off-boarding documents to complete the employee\'s exit process.',
    documents: [
      { name: 'Termination Letter', updated: '2 days ago' },
      { name: 'Severance Agreement', updated: '2 days ago' },
      { name: 'Exit Interview Form', updated: '2 days ago' }
    ]
  }
}

// Mock data for popular templates
const popularTemplates = [
  {
    name: 'Employee Handbook',
    description: 'Customizable handbook with auto-updates'
  },
  {
    name: 'PTO Policy',
    description: 'Leave and vacation policy template'
  },
  {
    name: 'Remote Work Agreement',
    description: 'WFH policies and guidelines'
  },
  {
    name: 'Employee Onboarding',
    description: 'Complete onboarding process template'
  }
]

export default function CreateDocumentPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [formData, setFormData] = useState({
    employee: '',
    assignedTo: '',
    email: '',
    issueDate: '',
    dueDate: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateClick = () => {
    setShowGenerateModal(true)
  }

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleTemplateClick = (templateName: string) => {
    setSelectedTemplate(templateName)
    setShowTemplateModal(true)
  }

  const handleGenerateConfirm = () => {
    console.log('Generating document with data:', formData)
    setShowGenerateModal(false)
    setFormData({
      employee: '',
      assignedTo: '',
      email: '',
      issueDate: '',
      dueDate: ''
    })
    // Navigate back to documents page
    window.location.href = '/documents'
  }

  const handleUploadConfirm = () => {
    console.log('Uploading document with data:', formData)
    setShowUploadModal(false)
    setFormData({
      employee: '',
      assignedTo: '',
      email: '',
      issueDate: '',
      dueDate: ''
    })
    // Navigate back to documents page
    window.location.href = '/documents'
  }

  const handleTemplateConfirm = () => {
    console.log('Generating template:', selectedTemplate, 'with data:', formData)
    setShowTemplateModal(false)
    setSelectedTemplate('')
    setFormData({
      employee: '',
      assignedTo: '',
      email: '',
      issueDate: '',
      dueDate: ''
    })
    // Navigate back to documents page
    window.location.href = '/documents'
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/documents'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
                </div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Document</h3>
                  <p className="text-gray-600 mb-6">
                    Select from our pre-built templates and customize with AI assistance.
                  </p>
                  <Button 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={handleGenerateClick}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Existing Document</h3>
                  <p className="text-gray-600 mb-6">
                    Upload your document and let AI check compliance and suggest improvements.
                  </p>
                  <Button 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={handleUploadClick}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Now
                  </Button>
                </div>
              </Card>
            </div>

            {/* Document Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Categories</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{documentCategories.policy.title}</CardTitle>
                    <CardDescription>{documentCategories.policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documentCategories.policy.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">Updated {doc.updated}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{documentCategories.termination.title}</CardTitle>
                    <CardDescription>{documentCategories.termination.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documentCategories.termination.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">Updated {doc.updated}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Popular Templates */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularTemplates.map((template, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => window.location.href = '/documents/editor'}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Document Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Generate Document</h3>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Select from our pre-built templates and customize with AI assistance.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Template</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select document</option>
                    <option value="employee-handbook">Employee Handbook</option>
                    <option value="pto-policy">PTO Policy</option>
                    <option value="remote-work">Remote Work Agreement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select
                    value={formData.employee}
                    onChange={(e) => handleInputChange('employee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="hr-manager">HR Manager</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowGenerateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleGenerateConfirm}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Upload className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Add a file to keep records up to date.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select
                    value={formData.employee}
                    onChange={(e) => handleInputChange('employee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="hr-manager">HR Manager</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleUploadConfirm}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{selectedTemplate}</h3>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Customizable handbook with auto-updates.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select
                    value={formData.employee}
                    onChange={(e) => handleInputChange('employee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select employee</option>
                    <option value="hr-manager">HR Manager</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleTemplateConfirm}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
} 