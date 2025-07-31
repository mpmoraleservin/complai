'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { BookOpen, Plus, Eye, Download, Share, X, ArrowUp, Edit, Shield, CheckCircle, Users, Bell, Clock, FileText, ChevronLeft, ChevronRight, Filter, Search, Calendar, AlertTriangle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TableActions, createViewAction, createEditAction, createDeleteAction } from '@/components/ui/table-actions'

export default function HandbookPage() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [isRunningCompliance, setIsRunningCompliance] = useState(false)
  const [complianceResults, setComplianceResults] = useState<any>(null)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [selectedBaseHandbook, setSelectedBaseHandbook] = useState<string>('current')
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<typeof handbookSections[0] | null>(null)
  const [acknowledgmentTab, setAcknowledgmentTab] = useState<'acknowledged' | 'pending'>('acknowledged')
  const [acknowledgmentPage, setAcknowledgmentPage] = useState(1)
  const employeesPerPage = 3
  const [complianceHistoryPage, setComplianceHistoryPage] = useState(1)
  const complianceHistoryPerPage = 3
  const [showOldHandbooksFilters, setShowOldHandbooksFilters] = useState(false)
  const [oldHandbooksFilters, setOldHandbooksFilters] = useState({
    search: '',
    status: 'all',
    complianceScore: 'all'
  })

  // Mock data for handbook sections
  const handbookSections = [
    {
      id: 1,
      title: 'Company Overview',
      description: 'Mission, values, and company culture',
      content: 'Our company is committed to creating a positive and productive work environment where every employee can thrive and contribute to our shared success. We believe in fostering a culture of innovation, collaboration, and continuous improvement.'
    },
    {
      id: 2,
      title: 'Employment Policies',
      description: 'Hiring, termination, and employment terms',
      content: 'This section outlines the fundamental policies that govern employment at our company. We are committed to providing equal employment opportunities to all individuals regardless of race, color, religion, sex, national origin, age, disability, or genetic information.'
    },
    {
      id: 3,
      title: 'Workplace Conduct',
      description: 'Code of conduct and behavioral expectations',
      content: 'We expect all employees to maintain professional behavior and treat each other with respect and dignity. This includes treating all colleagues, customers, and vendors with respect, maintaining confidentiality, and using company resources responsibly.'
    },
    {
      id: 4,
      title: 'Compensation & Benefits',
      description: 'Salary, benefits, and compensation policies',
      content: 'We offer competitive compensation and comprehensive benefits to support our employees\' well-being and financial security. This includes medical, dental, and vision insurance, 401(k) retirement plan, and professional development opportunities.'
    },
    {
      id: 5,
      title: 'Time Off & Leave',
      description: 'Vacation, sick leave, and other time off policies',
      content: 'Employees are entitled to various types of leave including vacation, sick leave, personal days, and family leave. All leave requests must be submitted in advance and approved by your supervisor according to company policies.'
    },
    {
      id: 6,
      title: 'Health & Safety',
      description: 'Workplace safety and health guidelines',
      content: 'We are committed to maintaining a safe and healthy work environment for all employees. This includes following all safety protocols, reporting hazards immediately, and participating in safety training programs as required.'
    }
  ]

  // Mock data for acknowledgment
  const acknowledgmentData = {
    totalEmployees: 12,
    acknowledgedEmployees: 8,
    pendingEmployees: 4,
    percentage: 67,
    lastUpdated: '2 days ago',
    employees: [
      { id: 1, name: 'John Doe', role: 'Product Designer', status: 'Acknowledged', date: '2024-01-15' },
      { id: 2, name: 'Jane Smith', role: 'Product Manager', status: 'Acknowledged', date: '2024-01-14' },
      { id: 3, name: 'Mike Johnson', role: 'Senior Developer', status: 'Acknowledged', date: '2024-01-13' },
      { id: 4, name: 'Sarah Wilson', role: 'UX Designer', status: 'Acknowledged', date: '2024-01-12' },
      { id: 5, name: 'David Brown', role: 'Marketing Manager', status: 'Acknowledged', date: '2024-01-11' },
      { id: 6, name: 'Emma Davis', role: 'HR Specialist', status: 'Acknowledged', date: '2024-01-10' },
      { id: 7, name: 'Alex Rodriguez', role: 'Frontend Developer', status: 'Acknowledged', date: '2024-01-09' },
      { id: 8, name: 'Lisa Chen', role: 'Data Analyst', status: 'Acknowledged', date: '2024-01-08' },
      { id: 9, name: 'Tom Wilson', role: 'DevOps Engineer', status: 'Pending', date: null },
      { id: 10, name: 'Maria Garcia', role: 'Sales Representative', status: 'Pending', date: null },
      { id: 11, name: 'James Lee', role: 'Customer Success Manager', status: 'Pending', date: null },
      { id: 12, name: 'Anna Thompson', role: 'Content Writer', status: 'Pending', date: null }
    ]
  }

  // Mock data for old handbooks
  const oldHandbooks = [
    {
      id: 1,
      version: 'Employee Handbook v2.0',
      lastUpdated: '1 month ago',
      status: 'Archived',
      complianceScore: 95,
      description: 'Previous version with comprehensive policies'
    },
    {
      id: 2,
      version: 'Employee Handbook v1.5',
      lastUpdated: '3 months ago',
      status: 'Archived',
      complianceScore: 88,
      description: 'Intermediate version with updated benefits'
    },
    {
      id: 3,
      version: 'Employee Handbook v1.0',
      lastUpdated: '6 months ago',
      status: 'Archived',
      complianceScore: 82,
      description: 'Initial version with basic policies'
    }
  ]

  // Mock data for compliance status history
  const complianceHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:30 AM',
      type: 'Manual',
      score: 100,
      status: 'Compliant',
      issues: [],
      runBy: 'John Doe',
      duration: '2m 15s'
    },
    {
      id: 2,
      date: '2024-01-10',
      time: '2:15 AM',
      type: 'Automatic',
      score: 95,
      status: 'Compliant',
      issues: ['Minor formatting issue in section 3.2'],
      runBy: 'System',
      duration: '1m 45s'
    },
    {
      id: 3,
      date: '2024-01-05',
      time: '3:45 PM',
      type: 'Manual',
      score: 88,
      status: 'Needs Review',
      issues: [
        'Overtime calculation method needs update',
        'Remote work policy missing recent regulations'
      ],
      runBy: 'Sarah Wilson',
      duration: '3m 20s'
    },
    {
      id: 4,
      date: '2024-01-01',
      time: '12:00 AM',
      type: 'Automatic',
      score: 92,
      status: 'Compliant',
      issues: ['Minor policy update recommended'],
      runBy: 'System',
      duration: '1m 30s'
    },
    {
      id: 5,
      date: '2023-12-28',
      time: '9:15 AM',
      type: 'Manual',
      score: 85,
      status: 'Needs Review',
      issues: [
        'Family leave policy needs updating',
        'Benefits section missing recent changes'
      ],
      runBy: 'Mike Johnson',
      duration: '4m 10s'
    },
    {
      id: 6,
      date: '2023-12-25',
      time: '11:30 PM',
      type: 'Automatic',
      score: 90,
      status: 'Compliant',
      issues: ['Minor updates recommended'],
      runBy: 'System',
      duration: '1m 55s'
    },
    {
      id: 7,
      date: '2023-12-20',
      time: '4:20 PM',
      type: 'Manual',
      score: 78,
      status: 'Needs Review',
      issues: [
        'Multiple compliance issues detected',
        'Overtime policies outdated',
        'Safety guidelines need revision'
      ],
      runBy: 'Lisa Chen',
      duration: '5m 30s'
    },
    {
      id: 8,
      date: '2023-12-15',
      time: '1:45 AM',
      type: 'Automatic',
      score: 87,
      status: 'Compliant',
      issues: ['Policy updates recommended'],
      runBy: 'System',
      duration: '2m 5s'
    }
  ]

  const handlePreviewHandbook = () => {
    // Navigate to handbook preview within the app
    router.push('/handbook/preview')
  }

  const handleDownloadHandbook = async () => {
    setIsDownloading(true)
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock PDF download
      const blob = new Blob(['Mock handbook content'], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Employee_Handbook_v2.1.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Show success message
      alert('Handbook downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareHandbook = () => {
    setShowShareModal(true)
  }

  const handleShareConfirm = () => {
    if (!shareEmail) {
      alert('Please enter an email address')
      return
    }
    
    // Simulate sharing process
    console.log('Sharing handbook with:', shareEmail)
    alert(`Handbook shared successfully with ${shareEmail}`)
    setShareEmail('')
    setShowShareModal(false)
  }

  const handleCreateHandbook = () => {
    setShowCreateModal(true)
  }

  const handleCreateConfirm = () => {
    // Start the handbook creation flow with selected base
    console.log('Starting handbook creation flow with base:', selectedBaseHandbook)
    setShowCreateModal(false)
    // Navigate to handbook creation flow with base parameter
    window.location.href = `/handbook/create?base=${selectedBaseHandbook}`
  }

  const handleViewSection = (section: any) => {
    setSelectedSection(section)
    setShowSectionModal(true)
  }

  const handleCloseSectionModal = () => {
    setShowSectionModal(false)
    setSelectedSection(null)
  }

  const handleRunComplianceCheck = async () => {
    setIsRunningCompliance(true)
    setShowComplianceModal(true)
    
    // Simulate compliance check process
    setTimeout(() => {
      const mockResults = {
        overallScore: 87,
        status: 'Needs Review',
        lastChecked: new Date().toLocaleDateString(),
        sections: [
          {
            name: 'Company Overview',
            score: 95,
            status: 'Compliant',
            issues: []
          },
          {
            name: 'Employment Policies',
            score: 92,
            status: 'Compliant',
            issues: []
          },
          {
            name: 'Workplace Conduct',
            score: 88,
            status: 'Compliant',
            issues: []
          },
          {
            name: 'Compensation & Benefits',
            score: 85,
            status: 'Needs Review',
            issues: [
              'Overtime calculation method may need updating',
              'Benefits eligibility criteria should be reviewed'
            ]
          },
          {
            name: 'Time Off & Leave',
            score: 78,
            status: 'Needs Review',
            issues: [
              'Family leave policy may not meet current state requirements',
              'Sick leave accrual calculation needs verification'
            ]
          },
          {
            name: 'Health & Safety',
            score: 90,
            status: 'Compliant',
            issues: []
          }
        ],
        recommendations: [
          'Update overtime calculation methods to align with recent regulations',
          'Review and update family leave policies for state compliance',
          'Verify sick leave accrual calculations',
          'Consider adding remote work policies'
        ]
      }
      
      setComplianceResults(mockResults)
      setIsRunningCompliance(false)
    }, 3000) // 3 second simulation
  }

  const handleCloseComplianceModal = () => {
    setShowComplianceModal(false)
    setComplianceResults(null)
  }

  const handleNotifyChanges = () => {
    setShowNotificationModal(true)
    setNotificationMessage('')
  }

  const handleSendNotification = () => {
    if (notificationMessage.trim()) {
      // Get pending employees
      const pendingEmployees = acknowledgmentData.employees.filter(emp => emp.status === 'Pending')
      
      // Here you would typically send the notification to pending employees only
      console.log('Sending notification to pending employees:', pendingEmployees.map(emp => emp.name))
      console.log('Message:', notificationMessage)
      
      alert(`Notification sent to ${pendingEmployees.length} pending employees!`)
      setShowNotificationModal(false)
      setNotificationMessage('')
    }
  }

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false)
    setNotificationMessage('')
  }

  // Filter employees by status
  const filteredEmployees = acknowledgmentData.employees.filter(employee => 
    acknowledgmentTab === 'acknowledged' 
      ? employee.status === 'Acknowledged'
      : employee.status === 'Pending'
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage)
  const startIndex = (acknowledgmentPage - 1) * employeesPerPage
  const endIndex = startIndex + employeesPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setAcknowledgmentPage(page)
  }

  const handleTabChange = (tab: 'acknowledged' | 'pending') => {
    setAcknowledgmentTab(tab)
    setAcknowledgmentPage(1) // Reset to first page when changing tabs
  }

  const handleComplianceHistoryPageChange = (page: number) => {
    setComplianceHistoryPage(page)
  }

  // Filter old handbooks based on search and filters
  const filteredOldHandbooks = oldHandbooks.filter(handbook => {
    const matchesSearch = handbook.version.toLowerCase().includes(oldHandbooksFilters.search.toLowerCase()) ||
                         handbook.description.toLowerCase().includes(oldHandbooksFilters.search.toLowerCase())
    const matchesStatus = oldHandbooksFilters.status === 'all' || handbook.status.toLowerCase() === oldHandbooksFilters.status
    const matchesComplianceScore = oldHandbooksFilters.complianceScore === 'all' || 
      (oldHandbooksFilters.complianceScore === 'high' && handbook.complianceScore >= 90) ||
      (oldHandbooksFilters.complianceScore === 'medium' && handbook.complianceScore >= 70 && handbook.complianceScore < 90) ||
      (oldHandbooksFilters.complianceScore === 'low' && handbook.complianceScore < 70)
    
    return matchesSearch && matchesStatus && matchesComplianceScore
  })

  const hasActiveOldHandbooksFilters = Object.values(oldHandbooksFilters).some(value => value !== 'all' && value !== '')

  const handleOldHandbooksFilterChange = (filterType: string, value: string) => {
    setOldHandbooksFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearOldHandbooksFilters = () => {
    setOldHandbooksFilters({
      search: '',
      status: 'all',
      complianceScore: 'all'
    })
  }

  const handleViewOldHandbook = (handbook: any) => {
    alert(`Viewing ${handbook.version}`)
  }

  const handleRestoreOldHandbook = (handbook: any) => {
    alert(`Restoring ${handbook.version} as current version`)
  }

  const handleRemoveOldHandbook = (handbook: any) => {
    alert(`Removing ${handbook.version} permanently`)
  }

  return (
    <SimpleLayout>
      <TooltipProvider>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Handbook</h1>
                  <p className="text-gray-600 mt-2">
                    Manage your employee handbook and compliance documents
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="bg-primary-600 hover:bg-primary-700"
                        onClick={handleCreateHandbook}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Handbook
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start the handbook creation process with guided questions</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Current Handbook Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Handbook</h2>
              <Card>
                <CardContent className="p-6">
                  {/* Header with actions */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Employee Handbook v2.1</h3>
                        <p className="text-sm text-gray-500">Last updated: 3 days ago</p>
                        <p className="text-sm text-gray-500">Status: Active</p>
                        <p className="text-sm text-gray-500">5 sections • 45 pages</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                            <span className="text-sm text-success-600 font-medium">100% Compliant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            className="bg-success-600 hover:bg-success-700 text-white"
                            onClick={handleRunComplianceCheck}
                            disabled={isRunningCompliance}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {isRunningCompliance ? 'Running Check...' : 'Run Compliance Check'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Analyze handbook for legal compliance and identify issues</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0"
                            onClick={handlePreviewHandbook}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Preview Handbook</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0"
                            onClick={handleDownloadHandbook}
                            disabled={isDownloading}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isDownloading ? 'Downloading...' : 'Download'}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0"
                            onClick={handleShareHandbook}
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Handbook Sections */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Handbook Sections</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {handbookSections.map((section) => (
                        <div 
                          key={section.id} 
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewSection(section)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{section.title}</h5>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewSection(section)
                                  }}
                                >
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View {section.title} section</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-gray-500">{section.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>



                  {/* Acknowledgment Status */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Acknowledgment Status</h4>
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleNotifyChanges}
                              disabled={acknowledgmentData.pendingEmployees === 0}
                            >
                              <Bell className="w-4 h-4 mr-2" />
                              Notify Pending ({acknowledgmentData.pendingEmployees})
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Notify pending employees to acknowledge handbook</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Employee Acknowledgments</h5>
                        <p className="text-sm text-gray-500">
                          {acknowledgmentData.acknowledgedEmployees} of {acknowledgmentData.totalEmployees} employees have acknowledged
                        </p>
                        <p className="text-sm text-gray-500">Last updated: {acknowledgmentData.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-info-600">{acknowledgmentData.percentage}%</div>
                        <div className="text-sm text-info-600">Acknowledged</div>
                      </div>
                    </div>
                    <div className="mb-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-info-600 h-2 rounded-full" style={{ width: `${acknowledgmentData.percentage}%` }}></div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => handleTabChange('acknowledged')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            acknowledgmentTab === 'acknowledged'
                              ? 'border-info-500 text-info-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Acknowledged ({acknowledgmentData.acknowledgedEmployees})
                        </button>
                        <button
                          onClick={() => handleTabChange('pending')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            acknowledgmentTab === 'pending'
                              ? 'border-info-500 text-info-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Pending ({acknowledgmentData.pendingEmployees})
                        </button>
                      </nav>
                    </div>
                    
                    {/* Employee List with Pagination */}
                    <div>
                      <div className="space-y-2 mb-4">
                        {currentEmployees.map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.role}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                employee.status === 'Acknowledged' 
                                  ? 'bg-success-100 text-success-800' 
                                  : 'bg-warning-100 text-warning-800'
                              }`}>
                                {employee.status}
                              </span>
                              {employee.date && (
                                <span className="text-xs text-gray-500">{employee.date}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(acknowledgmentPage - 1)}
                              disabled={acknowledgmentPage === 1}
                              className="w-8 h-8 p-0"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`w-8 h-8 text-sm font-medium rounded ${
                                    page === acknowledgmentPage
                                      ? 'bg-info-600 text-white'
                                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(acknowledgmentPage + 1)}
                              disabled={acknowledgmentPage === totalPages}
                              className="w-8 h-8 p-0"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compliance Status History */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status History</h4>
                    
                    {/* Pagination Info */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500">
                        Showing {((complianceHistoryPage - 1) * complianceHistoryPerPage) + 1} to {Math.min(complianceHistoryPage * complianceHistoryPerPage, complianceHistory.length)} of {complianceHistory.length} checks
                      </p>
                    </div>

                    <div className="space-y-3">
                      {complianceHistory
                        .slice((complianceHistoryPage - 1) * complianceHistoryPerPage, complianceHistoryPage * complianceHistoryPerPage)
                        .map((check) => (
                        <div key={check.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">Compliance Check #{check.id}</h5>
                              <p className="text-sm text-gray-500">
                                {check.date} at {check.time} • {check.type} check • {check.duration}
                              </p>
                              <p className="text-sm text-gray-500">
                                Run by: {check.runBy}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                check.status === 'Compliant' 
                                  ? 'bg-success-100 text-success-800' 
                                  : 'bg-warning-100 text-warning-800'
                              }`}>
                                {check.status}
                              </span>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{check.score}%</div>
                                <div className="text-xs text-gray-500">Score</div>
                              </div>
                            </div>
                          </div>
                          {check.issues.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Issues Found:</h6>
                              <div className="space-y-1">
                                {check.issues.map((issue, index) => (
                                  <div key={index} className="flex items-start text-sm text-gray-600">
                                    <span className="text-warning-500 mr-2">•</span>
                                    {issue}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {complianceHistory.length > complianceHistoryPerPage && (
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplianceHistoryPageChange(complianceHistoryPage - 1)}
                            disabled={complianceHistoryPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <span className="text-sm text-gray-500">
                            Page {complianceHistoryPage} of {Math.ceil(complianceHistory.length / complianceHistoryPerPage)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplianceHistoryPageChange(complianceHistoryPage + 1)}
                            disabled={complianceHistoryPage >= Math.ceil(complianceHistory.length / complianceHistoryPerPage)}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.ceil(complianceHistory.length / complianceHistoryPerPage) }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={page === complianceHistoryPage ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleComplianceHistoryPageChange(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Old Handbooks Section */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Old Handbooks</CardTitle>
                  <CardDescription>
                    Archived handbook versions and their compliance status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Old Handbooks Filters */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowOldHandbooksFilters(!showOldHandbooksFilters)}
                        className="flex items-center"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Old Handbooks Filters
                        {hasActiveOldHandbooksFilters && (
                          <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                            {Object.values(oldHandbooksFilters).filter(v => v !== 'all' && v !== '').length}
                          </span>
                        )}
                      </Button>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Search handbooks..."
                          value={oldHandbooksFilters.search}
                          onChange={(e) => handleOldHandbooksFilterChange('search', e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>

                    {/* Advanced Old Handbooks Filters */}
                    {showOldHandbooksFilters && (
                      <Card className="mb-4">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                              <Select value={oldHandbooksFilters.status} onValueChange={(value) => handleOldHandbooksFilterChange('status', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Status</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                  <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-1">Compliance Score</Label>
                              <Select value={oldHandbooksFilters.complianceScore} onValueChange={(value) => handleOldHandbooksFilterChange('complianceScore', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="All Scores" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Scores</SelectItem>
                                  <SelectItem value="high">High (90%+)</SelectItem>
                                  <SelectItem value="medium">Medium (70-89%)</SelectItem>
                                  <SelectItem value="low">Low (&lt;70%)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {hasActiveOldHandbooksFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Button 
                                variant="outline" 
                                onClick={clearOldHandbooksFilters}
                                className="w-full"
                              >
                                Clear Filters
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Version</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Last Updated</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance Score</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOldHandbooks.map((handbook) => (
                          <tr key={handbook.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium text-gray-900">{handbook.version}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{handbook.description}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{handbook.lastUpdated}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {handbook.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{handbook.complianceScore}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div className={`h-1.5 rounded-full ${
                                    handbook.complianceScore >= 90 ? 'bg-success-500' :
                                    handbook.complianceScore >= 70 ? 'bg-warning-500' : 'bg-destructive-500'
                                  }`} style={{ width: `${handbook.complianceScore}%` }}></div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  handbook.complianceScore >= 90 ? 'bg-success-100 text-success-800' :
                                  handbook.complianceScore >= 70 ? 'bg-warning-100 text-warning-800' : 'bg-destructive-100 text-destructive-800'
                                }`}>
                                  {handbook.complianceScore >= 90 ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                   handbook.complianceScore >= 70 ? <AlertCircle className="w-3 h-3 mr-1" /> :
                                   <AlertTriangle className="w-3 h-3 mr-1" />}
                                  {handbook.complianceScore >= 90 ? 'High' :
                                   handbook.complianceScore >= 70 ? 'Medium' : 'Low'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <TableActions
                                actions={[
                                  createViewAction(() => handleViewOldHandbook(handbook)),
                                  {
                                    label: 'Restore',
                                    icon: ArrowUp,
                                    onClick: () => handleRestoreOldHandbook(handbook),
                                    variant: 'success'
                                  },
                                  createDeleteAction(() => handleRemoveOldHandbook(handbook))
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Empty State */}
                  {filteredOldHandbooks.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No old handbooks found matching your filters</p>
                      <Button variant="outline" onClick={clearOldHandbooksFilters} className="mt-4">
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create New Handbook Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Create New Handbook</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Base Handbook Selection */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Select Base Handbook</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose a handbook to use as a starting point for your new version. This will pre-fill the creation process with existing content.
                  </p>
                  
                  <div className="space-y-3">
                    {/* Current Handbook Option */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedBaseHandbook === 'current' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBaseHandbook('current')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedBaseHandbook === 'current' 
                              ? 'border-primary-500 bg-primary-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedBaseHandbook === 'current' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">Current Handbook</h5>
                            <p className="text-sm text-gray-600">Use the current active handbook as base</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Status: Active</span>
                              <span className="text-xs text-gray-500">Compliance: 87%</span>
                              <span className="text-xs text-gray-500">Last updated: Today</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-primary-600">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Old Handbooks Options */}
                    {oldHandbooks.map((handbook) => (
                      <div 
                        key={handbook.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedBaseHandbook === `old-${handbook.id}` 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBaseHandbook(`old-${handbook.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedBaseHandbook === `old-${handbook.id}` 
                                ? 'border-primary-500 bg-primary-500' 
                                : 'border-gray-300'
                            }`}>
                              {selectedBaseHandbook === `old-${handbook.id}` && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{handbook.version}</h5>
                              <p className="text-sm text-gray-600">{handbook.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">Status: {handbook.status}</span>
                                <span className="text-xs text-gray-500">Compliance: {handbook.complianceScore}%</span>
                                <span className="text-xs text-gray-500">Last updated: {handbook.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Start from Scratch Option */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedBaseHandbook === 'scratch' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBaseHandbook('scratch')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedBaseHandbook === 'scratch' 
                              ? 'border-primary-500 bg-primary-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedBaseHandbook === 'scratch' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">Start from Scratch</h5>
                            <p className="text-sm text-gray-600">Create a completely new handbook without any base content</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Recommended for new companies</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <Plus className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to Expect Section */}
                <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                  <h4 className="font-medium text-info-900 mb-2">What to expect:</h4>
                  <ul className="text-sm text-info-800 space-y-1">
                    <li>• 9 questions about your company policies</li>
                    <li>• AI-powered handbook generation based on your selection</li>
                    <li>• Legal compliance checking</li>
                    <li>• Customizable sections</li>
                    {selectedBaseHandbook !== 'scratch' && (
                      <li>• Pre-filled content from selected handbook</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel handbook creation</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-primary-600 hover:bg-primary-700"
                      onClick={handleCreateConfirm}
                    >
                      Start Creation
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Begin the handbook creation process with selected base</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Share Handbook Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Share className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Share Handbook</h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Share your employee handbook with team members or stakeholders.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="share-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="share-email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                  <h4 className="font-medium text-info-900 mb-2">What will be shared:</h4>
                  <ul className="text-sm text-info-800 space-y-1">
                    <li>• Complete employee handbook (PDF)</li>
                    <li>• View-only access</li>
                    <li>• Secure sharing link</li>
                    <li>• Access tracking</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowShareModal(false)}
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel sharing handbook</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-primary-600 hover:bg-primary-700"
                      onClick={handleShareConfirm}
                    >
                      Share Handbook
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send handbook to the specified email</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}



        {/* Compliance Check Modal */}
        {showComplianceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {isRunningCompliance ? 'Running Compliance Check...' : 'Compliance Check Results'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseComplianceModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {isRunningCompliance ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600 mx-auto mb-4"></div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Analyzing Handbook</h4>
                  <p className="text-gray-600">Checking compliance with current employment laws...</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-success-600 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Reviewing employment policies</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-success-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-sm text-gray-600">Checking compensation guidelines</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-success-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span className="text-sm text-gray-600">Verifying leave policies</span>
                    </div>
                  </div>
                </div>
              ) : complianceResults ? (
                <div className="space-y-6">
                  {/* Overall Results */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Overall Compliance Score</h4>
                        <p className="text-sm text-gray-600">Last checked: {complianceResults.lastChecked}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{complianceResults.overallScore}%</div>
                        <div className={`text-sm font-medium ${
                          complianceResults.status === 'Compliant' ? 'text-success-600' : 'text-warning-600'
                        }`}>
                          {complianceResults.status}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          complianceResults.overallScore >= 90 ? 'bg-success-600' : 
                          complianceResults.overallScore >= 80 ? 'bg-warning-500' : 'bg-destructive-500'
                        }`} 
                        style={{ width: `${complianceResults.overallScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Section Results */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Section Analysis</h4>
                    <div className="space-y-3">
                      {complianceResults.sections.map((section: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{section.name}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{section.score}%</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                section.status === 'Compliant' 
                                  ? 'bg-success-100 text-success-800' 
                                  : 'bg-warning-100 text-warning-800'
                              }`}>
                                {section.status}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                section.score >= 90 ? 'bg-success-600' : 
                                section.score >= 80 ? 'bg-warning-500' : 'bg-destructive-500'
                              }`} 
                              style={{ width: `${section.score}%` }}
                            ></div>
                          </div>
                          {section.issues.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Issues Found:</h6>
                              <ul className="space-y-1">
                                {section.issues.map((issue: string, issueIndex: number) => (
                                  <li key={issueIndex} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-destructive-500 mr-2">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {complianceResults.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
                      <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                        <ul className="space-y-2">
                          {complianceResults.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-info-800 flex items-start">
                                                              <CheckCircle className="w-4 h-4 text-info-600 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
              
              <div className="flex justify-end mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-success-600 hover:bg-success-700"
                      onClick={handleCloseComplianceModal}
                    >
                      Close
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close compliance check results</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-info-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Notify Employees</h3>
                </div>
                <button
                  onClick={handleCloseNotificationModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notification-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Message
                  </Label>
                  <Textarea
                    id="notification-message"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter a message to notify pending employees about handbook acknowledgment..."
                    className="resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                  <h4 className="font-medium text-info-900 mb-2">What will happen:</h4>
                  <ul className="text-sm text-info-800 space-y-1">
                    <li>• Only pending employees will receive an email notification</li>
                    <li>• They will be prompted to review and acknowledge the handbook</li>
                    <li>• Acknowledgment status will be tracked automatically</li>
                    <li>• Follow-up reminders will be sent if needed</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleCloseNotificationModal}
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel notification</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-info-600 hover:bg-info-700"
                      onClick={handleSendNotification}
                      disabled={!notificationMessage.trim()}
                    >
                      Send Notification
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send notification to pending employees only</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Section Content Modal */}
        {showSectionModal && selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{selectedSection.title}</h3>
                </div>
                <button
                  onClick={handleCloseSectionModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Section Header */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedSection.title}</h2>
                  <p className="text-gray-600">{selectedSection.description}</p>
                </div>

                {/* Section Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Section Content</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedSection.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Section Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Section ID:</span>
                        <span className="font-medium">#{selectedSection.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">3 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Compliance Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compliance Score:</span>
                        <span className="font-medium text-success-600">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Compliant
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Checked:</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleCloseSectionModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        </TooltipProvider>
      </SimpleLayout>
  )
} 