'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Cloud, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  X,
  ChevronDown,
  ChevronLeft
} from 'lucide-react'

export default function DocumentEditorPage() {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [documentContent, setDocumentContent] = useState(`Welcome to [Your Company Name]! We're excited to have you on board. This handbook outlines our key policies, expectations, and resources to help guide you throughout your employment journey.

**Company Mission & Values**
Our mission is to [insert mission]. We value [insert vision] and strive to create an inclusive, collaborative environment where every team member can thrive.

**Working Hours**
Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday. We offer flexible scheduling options and remote work opportunities based on role requirements.

**Leave Policies**
- Paid Vacation: [e.g., 15] days annually
- Paid Sick Leave: [e.g., 10] days annually
- Personal Days: [e.g., 3] days annually
- Holidays: Company observes all federal holidays

**Code of Conduct**
We expect all employees to maintain professional behavior, respect diversity, and contribute to a positive work environment. Harassment, discrimination, or any form of misconduct will not be tolerated.

**Company Devices & Technology**
Employees may be provided with company-issued devices for work purposes. These devices should be used primarily for business activities and maintained in good condition.

**Data Privacy & Security**
We are committed to protecting sensitive information and comply with relevant data protection regulations (GDPR, HIPAA, etc.). All employees must follow our data security protocols.

**Compensation & Benefits**
- Competitive salary based on experience and market rates
- Health, dental, and vision insurance
- 401(k) retirement plan with company match
- Professional development opportunities
- Expense reimbursement for approved business expenses`)

  const handleSaveDraft = () => {
    setShowSaveModal(true)
  }

  const handleSubmit = () => {
    setShowSubmitModal(true)
  }

  const handleSaveConfirm = () => {
    console.log('Saving document as draft...')
    setShowSaveModal(false)
    // Show success message
    alert('Document saved as draft successfully!')
  }

  const handleSubmitConfirm = () => {
    console.log('Submitting document...')
    setShowSubmitModal(false)
    // Navigate back to documents page
    window.location.href = '/documents'
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/documents/create'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">Employee Handbook</h1>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Cloud className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option>Normal text</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                    <option>Heading 3</option>
                  </select>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="ml-auto flex items-center space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft}>
                      <Save className="w-4 h-4 mr-2" />
                      Save as draft
                    </Button>
                    <Button className="bg-primary-600 hover:bg-primary-700" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Content */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Employee Handbook</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>Updated last 30 days ago</span>
                    <span>•</span>
                    <span>Legal Soft LLC</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Start writing your document..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save as Draft Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Save as draft?</h3>
              <p className="text-gray-600 text-center mb-6">
                Would you like to save your progress as a draft or discard your changes?
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                >
                  Discard
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleSaveConfirm}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Document Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Submit document?</h3>
              <p className="text-gray-600 text-center mb-6">
                You&apos;re about to submit this document. Once submitted, it may no longer be editable. Are you sure you want to proceed?
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleSubmitConfirm}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
} 