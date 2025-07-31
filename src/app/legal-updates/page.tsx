'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { Scale, Clock, AlertCircle, CheckCircle, Filter, Calendar, X, Eye, FileText, ChevronLeft, ChevronRight, Users, MapPin, Search, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { usePagination } from '@/hooks/use-pagination'
import { TableActions, createViewAction } from '@/components/ui/table-actions'
import { Pagination } from '@/components/ui/pagination'

// Mock data for legal updates
const legalUpdates: Array<{
  id: number;
  title: string;
  description: string;
  date: string;
  priority: Priority;
  impact: string;
  actionRequired: string;
  status: Status;
  category: string;
  effectiveDate?: string;
  source: string;
  relatedLinks: string[];
  complianceDeadline?: string;
  affectedEmployees?: string;
  estimatedCost?: string;
}> = [
  {
    id: 1,
    title: 'New Overtime Regulations Effective January 1, 2024',
    description: 'The Department of Labor has updated overtime regulations, increasing the salary threshold for exempt employees from $35,568 to $43,888 annually.',
    date: '2023-12-15',
    priority: 'high',
    impact: 'High',
    actionRequired: 'Review exempt employee classifications',
    status: 'pending',
    category: 'Compensation',
    effectiveDate: '2024-01-01',
    source: 'Department of Labor (DOL)',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/overtime',
      'https://www.dol.gov/newsroom/releases/whd/whd20231215',
      'https://www.dol.gov/agencies/whd/overtime/2023-rule'
    ],
    complianceDeadline: '2024-01-01',
    affectedEmployees: 'All exempt employees earning less than $43,888 annually',
    estimatedCost: '$15,000 - $25,000 for salary adjustments'
  },
  {
    id: 2,
    title: 'Updated Family Leave Requirements',
    description: 'New regulations expand family leave eligibility and increase the maximum leave period from 12 to 16 weeks for certain qualifying events.',
    date: '2023-12-10',
    priority: 'medium',
    impact: 'Medium',
    actionRequired: 'Update leave policies',
    status: 'pending',
    category: 'Leave & Benefits',
    effectiveDate: '2024-03-01',
    source: 'Family and Medical Leave Act (FMLA)',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/fmla',
      'https://www.dol.gov/newsroom/releases/whd/whd20231210',
      'https://www.dol.gov/agencies/whd/fmla/2024-updates'
    ],
    complianceDeadline: '2024-02-15',
    affectedEmployees: 'All employees eligible for FMLA leave',
    estimatedCost: '$5,000 - $10,000 for policy updates and training'
  },
  {
    id: 3,
    title: 'Workplace Safety Guidelines Update',
    description: 'OSHA has released updated guidelines for remote work safety, including ergonomic requirements for home office setups.',
    date: '2023-12-05',
    priority: 'low',
    impact: 'Low',
    actionRequired: 'Review remote work policies',
    status: 'completed',
    category: 'Health & Safety',
    effectiveDate: '2023-12-05',
    source: 'Occupational Safety and Health Administration (OSHA)',
    relatedLinks: [
      'https://www.osha.gov/remote-work',
      'https://www.osha.gov/news/newsreleases/2023-12-05',
      'https://www.osha.gov/ergonomics/remote-work-guidelines'
    ],
    complianceDeadline: '2024-01-31',
    affectedEmployees: 'All remote employees',
    estimatedCost: '$2,000 - $5,000 for ergonomic assessments and equipment'
  },
  {
    id: 4,
    title: 'Anti-Discrimination Policy Requirements',
    description: 'New federal guidelines require updated anti-discrimination policies to include protections for gender identity and expression.',
    date: '2023-11-28',
    priority: 'high',
    impact: 'High',
    actionRequired: 'Update anti-discrimination policies',
    status: 'pending',
    category: 'Employment Policies',
    effectiveDate: '2024-02-01',
    source: 'Equal Employment Opportunity Commission (EEOC)',
    relatedLinks: [
      'https://www.eeoc.gov/laws/guidance/gender-identity-discrimination',
      'https://www.eeoc.gov/newsroom/eeoc-issues-guidance-gender-identity-discrimination',
      'https://www.eeoc.gov/laws/types/sex.cfm'
    ],
    complianceDeadline: '2024-01-31',
    affectedEmployees: 'All employees',
    estimatedCost: '$3,000 - $8,000 for policy updates and training'
  },
  {
    id: 5,
    title: 'Minimum Wage Increase Effective July 1, 2024',
    description: 'State minimum wage will increase from $15.50 to $16.00 per hour, affecting all non-exempt employees.',
    date: '2023-11-20',
    priority: 'medium',
    impact: 'Medium',
    actionRequired: 'Update payroll systems and notify employees',
    status: 'pending',
    category: 'Compensation',
    effectiveDate: '2024-07-01',
    source: 'State Department of Labor',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/minimum-wage',
      'https://www.dol.gov/newsroom/releases/whd/whd20231120',
      'https://www.dol.gov/agencies/whd/minimum-wage/state'
    ],
    complianceDeadline: '2024-06-15',
    affectedEmployees: 'All non-exempt employees earning minimum wage',
    estimatedCost: '$8,000 - $15,000 for payroll system updates and employee notifications'
  },
  {
    id: 6,
    title: 'Updated Background Check Requirements',
    description: 'New regulations limit the use of criminal background checks in hiring decisions and require additional documentation.',
    date: '2023-11-15',
    priority: 'medium',
    impact: 'Medium',
    actionRequired: 'Review hiring procedures and background check policies',
    status: 'completed',
    category: 'Hiring & Recruitment',
    effectiveDate: '2023-12-01',
    source: 'Fair Credit Reporting Act (FCRA)',
    relatedLinks: [
      'https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/fair-credit-reporting-act',
      'https://www.ftc.gov/news-events/news/press-releases/2023/11/ftc-announces-updates-background-check-requirements',
      'https://www.ftc.gov/business-guidance/privacy-security/consumer-reports'
    ],
    complianceDeadline: '2023-11-30',
    affectedEmployees: 'HR and hiring managers',
    estimatedCost: '$4,000 - $7,000 for policy updates and training'
  },
  {
    id: 7,
    title: 'Updated Data Privacy Regulations',
    description: 'New state privacy laws require enhanced data protection measures and employee consent procedures.',
    date: '2023-11-10',
    priority: 'high',
    impact: 'High',
    actionRequired: 'Implement enhanced data protection measures',
    status: 'pending',
    category: 'Privacy & Security',
    effectiveDate: '2024-01-15',
    source: 'State Privacy Protection Act',
    relatedLinks: [
      'https://www.privacy.gov/regulations',
      'https://www.privacy.gov/newsroom/2023-11-10',
      'https://www.privacy.gov/guidance/data-protection'
    ],
    complianceDeadline: '2024-01-15',
    affectedEmployees: 'All employees handling customer data',
    estimatedCost: '$12,000 - $20,000 for system updates and training'
  },
  {
    id: 8,
    title: 'Workplace Accommodation Requirements',
    description: 'Updated ADA guidelines require enhanced workplace accommodation procedures and documentation.',
    date: '2023-11-05',
    priority: 'medium',
    impact: 'Medium',
    actionRequired: 'Update accommodation request procedures',
    status: 'pending',
    category: 'Employment Policies',
    effectiveDate: '2024-02-01',
    source: 'Americans with Disabilities Act (ADA)',
    relatedLinks: [
      'https://www.ada.gov/regulations',
      'https://www.ada.gov/newsroom/2023-11-05',
      'https://www.ada.gov/guidance/accommodations'
    ],
    complianceDeadline: '2024-01-31',
    affectedEmployees: 'HR and management teams',
    estimatedCost: '$6,000 - $10,000 for policy updates and training'
  },
  {
    id: 9,
    title: 'Updated Meal Break Regulations',
    description: 'State labor laws now require specific meal break timing and duration for non-exempt employees.',
    date: '2023-10-30',
    priority: 'medium',
    impact: 'Medium',
    actionRequired: 'Update break time policies and scheduling',
    status: 'pending',
    category: 'Workplace Policies',
    effectiveDate: '2024-01-01',
    source: 'State Department of Labor',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/breaks',
      'https://www.dol.gov/newsroom/2023-10-30',
      'https://www.dol.gov/agencies/whd/breaks/state-requirements'
    ],
    complianceDeadline: '2023-12-31',
    affectedEmployees: 'All non-exempt employees',
    estimatedCost: '$3,000 - $6,000 for policy updates and system changes'
  },
  {
    id: 10,
    title: 'Cybersecurity Training Requirements',
    description: 'New federal regulations mandate annual cybersecurity training for all employees.',
    date: '2023-10-25',
    priority: 'high',
    impact: 'High',
    actionRequired: 'Implement mandatory cybersecurity training program',
    status: 'pending',
    category: 'Training & Development',
    effectiveDate: '2024-01-01',
    source: 'Cybersecurity and Infrastructure Security Agency (CISA)',
    relatedLinks: [
      'https://www.cisa.gov/cybersecurity-training',
      'https://www.cisa.gov/newsroom/2023-10-25',
      'https://www.cisa.gov/guidance/employee-training'
    ],
    complianceDeadline: '2024-01-01',
    affectedEmployees: 'All employees',
    estimatedCost: '$8,000 - $15,000 for training platform and content'
  },
  {
    id: 11,
    title: 'Updated Drug Testing Policies',
    description: 'State legalization laws require updates to workplace drug testing policies and procedures.',
    date: '2023-10-20',
    priority: 'low',
    impact: 'Low',
    actionRequired: 'Review and update drug testing policies',
    status: 'pending',
    category: 'Employment Policies',
    effectiveDate: '2024-01-01',
    source: 'State Employment Law Updates',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/drug-testing',
      'https://www.dol.gov/newsroom/2023-10-20',
      'https://www.dol.gov/agencies/whd/drug-testing/state-laws'
    ],
    complianceDeadline: '2023-12-31',
    affectedEmployees: 'HR and management teams',
    estimatedCost: '$2,000 - $4,000 for policy review and updates'
  },
  {
    id: 12,
    title: 'Emergency Contact Information Requirements',
    description: 'New regulations require enhanced emergency contact procedures and verification processes.',
    date: '2023-10-15',
    priority: 'low',
    impact: 'Low',
    actionRequired: 'Update emergency contact procedures',
    status: 'pending',
    category: 'Employee Records',
    effectiveDate: '2023-12-01',
    source: 'State Employment Regulations',
    relatedLinks: [
      'https://www.dol.gov/agencies/whd/emergency-contacts',
      'https://www.dol.gov/newsroom/2023-10-15',
      'https://www.dol.gov/agencies/whd/emergency-contacts/requirements'
    ],
    complianceDeadline: '2023-11-30',
    affectedEmployees: 'HR and management teams',
    estimatedCost: '$1,000 - $3,000 for system updates and training'
  }
]

// Mock data for legal updates history
const legalUpdatesHistory = [
  {
    id: 101,
    title: 'Minimum Wage Increase - State Level',
    date: '2023-10-15',
    status: 'implemented',
    category: 'Compensation',
    impact: 'Medium',
    complianceDate: '2023-11-01',
    notes: 'Successfully updated all employee contracts and payroll systems'
  },
  {
    id: 102,
    title: 'Remote Work Tax Implications',
    date: '2023-09-20',
    status: 'implemented',
    category: 'Tax & Benefits',
    impact: 'Low',
    complianceDate: '2023-10-15',
    notes: 'Updated tax withholding procedures for remote employees'
  },
  {
    id: 103,
    title: 'Updated Harassment Prevention Training',
    date: '2023-08-10',
    status: 'implemented',
    category: 'Training & Development',
    impact: 'High',
    complianceDate: '2023-09-01',
    notes: 'Completed mandatory training for all employees and managers'
  },
  {
    id: 104,
    title: 'New Break Time Requirements',
    date: '2023-07-25',
    status: 'implemented',
    category: 'Workplace Policies',
    impact: 'Medium',
    complianceDate: '2023-08-15',
    notes: 'Updated break time policies and scheduling systems'
  },
  {
    id: 105,
    title: 'Background Check Regulations Update',
    date: '2023-06-15',
    status: 'implemented',
    category: 'Hiring & Onboarding',
    impact: 'Medium',
    complianceDate: '2023-07-01',
    notes: 'Updated background check procedures and vendor contracts'
  },
  {
    id: 106,
    title: 'Emergency Contact Information Requirements',
    date: '2023-05-20',
    status: 'implemented',
    category: 'Employee Records',
    impact: 'Low',
    complianceDate: '2023-06-01',
    notes: 'Updated employee records system and collected missing information'
  },
  {
    id: 107,
    title: 'Updated Safety Equipment Standards',
    date: '2023-04-15',
    status: 'implemented',
    category: 'Health & Safety',
    impact: 'High',
    complianceDate: '2023-05-01',
    notes: 'Implemented new safety equipment requirements and training protocols'
  },
  {
    id: 108,
    title: 'Family Leave Policy Expansion',
    date: '2023-03-20',
    status: 'implemented',
    category: 'Leave & Benefits',
    impact: 'Medium',
    complianceDate: '2023-04-15',
    notes: 'Expanded family leave policies to include additional qualifying events'
  },
  {
    id: 109,
    title: 'Data Privacy Regulations Update',
    date: '2023-02-10',
    status: 'implemented',
    category: 'Privacy & Security',
    impact: 'High',
    complianceDate: '2023-03-01',
    notes: 'Updated data handling procedures and employee privacy training'
  },
  {
    id: 110,
    title: 'Overtime Calculation Method Changes',
    date: '2023-01-25',
    status: 'implemented',
    category: 'Compensation',
    impact: 'Medium',
    complianceDate: '2023-02-15',
    notes: 'Updated overtime calculation methods to comply with new regulations'
  },
  {
    id: 111,
    title: 'Workplace Accommodation Requirements',
    date: '2022-12-15',
    status: 'implemented',
    category: 'Employment Policies',
    impact: 'Medium',
    complianceDate: '2023-01-01',
    notes: 'Enhanced workplace accommodation procedures for employees with disabilities'
  },
  {
    id: 112,
    title: 'Updated Drug Testing Policies',
    date: '2022-11-20',
    status: 'implemented',
    category: 'Employment Policies',
    impact: 'Low',
    complianceDate: '2022-12-15',
    notes: 'Revised drug testing policies to align with state legalization laws'
  },
  {
    id: 113,
    title: 'Cybersecurity Training Requirements',
    date: '2022-10-10',
    status: 'implemented',
    category: 'Training & Development',
    impact: 'High',
    complianceDate: '2022-11-01',
    notes: 'Implemented mandatory cybersecurity training for all employees'
  },
  {
    id: 114,
    title: 'Updated Meal Break Regulations',
    date: '2022-09-15',
    status: 'implemented',
    category: 'Workplace Policies',
    impact: 'Medium',
    complianceDate: '2022-10-01',
    notes: 'Updated meal break policies to comply with new state requirements'
  },
  {
    id: 115,
    title: 'Employee Classification Review',
    date: '2022-08-20',
    status: 'implemented',
    category: 'Employment Policies',
    impact: 'High',
    complianceDate: '2022-09-15',
    notes: 'Conducted comprehensive review and reclassification of employee status'
  }
]

type Priority = 'high' | 'medium' | 'low'
type Status = 'pending' | 'completed'

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: { label: 'High Priority', color: 'bg-destructive-100 text-destructive-800' },
  medium: { label: 'Medium Priority', color: 'bg-warning-100 text-warning-800' },
  low: { label: 'Low Priority', color: 'bg-success-100 text-success-800' }
}

const statusConfig: Record<Status, { label: string; color: string; icon: any }> = {
  pending: { label: 'Action Required', color: 'bg-warning-100 text-warning-800', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-success-100 text-success-800', icon: CheckCircle }
}

export default function LegalUpdatesPage() {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    priority: 'all',
    status: 'all',
    search: ''
  })
  const [historyFilters, setHistoryFilters] = useState({
    dateFrom: '',
    dateTo: '',
    impact: 'all',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showHistoryFilters, setShowHistoryFilters] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<typeof legalUpdates[0] | null>(null)

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleHistoryFilterChange = (filterType: string, value: string) => {
    setHistoryFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      priority: 'all',
      status: 'all',
      search: ''
    })
  }

  const clearHistoryFilters = () => {
    setHistoryFilters({
      dateFrom: '',
      dateTo: '',
      impact: 'all',
      search: ''
    })
  }

  const handleMarkAsDone = (updateId: number) => {
    console.log('Marking update as done:', updateId)
    alert('Update marked as completed!')
  }

  const handleViewDetails = (updateId: number) => {
    const update = legalUpdates.find(u => u.id === updateId)
    if (update) {
      setSelectedUpdate(update)
      setShowDetailsModal(true)
    }
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedUpdate(null)
  }

  const handleViewHistoryDetails = (update: any) => {
    // For now, just show an alert. In a real app, you might want to show a modal
    alert(`Viewing details for: ${update.title}`)
  }

  const filteredUpdates = legalUpdates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         update.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesPriority = filters.priority === 'all' || update.priority === filters.priority
    const matchesStatus = filters.status === 'all' || update.status === filters.status
    
    const matchesDateFrom = !filters.dateFrom || update.date >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || update.date <= filters.dateTo
    
    return matchesSearch && matchesPriority && matchesStatus && matchesDateFrom && matchesDateTo
  })

  const filteredHistory = legalUpdatesHistory.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(historyFilters.search.toLowerCase())
    
    const matchesImpact = historyFilters.impact === 'all' || update.impact === historyFilters.impact
    
    const matchesDateFrom = !historyFilters.dateFrom || update.date >= historyFilters.dateFrom
    const matchesDateTo = !historyFilters.dateTo || update.date <= historyFilters.dateTo
    
    return matchesSearch && matchesImpact && matchesDateFrom && matchesDateTo
  })

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all' && v !== '')
  const hasActiveHistoryFilters = Object.values(historyFilters).some(v => v !== 'all' && v !== '')

  const pendingUpdates = filteredUpdates.filter(update => update.status === 'pending')
  const completedUpdates = filteredUpdates.filter(update => update.status === 'completed')

  // Pagination for actions required
  const {
    currentPage: actionsCurrentPage,
    totalPages: actionsTotalPages,
    currentItems: paginatedActions,
    startIndex: actionsStartIndex,
    endIndex: actionsEndIndex,
    hasNextPage: actionsHasNextPage,
    hasPrevPage: actionsHasPrevPage,
    goToPage: actionsGoToPage,
    goToNextPage: actionsGoToNextPage,
    goToPrevPage: actionsGoToPrevPage
  } = usePagination({
    data: pendingUpdates,
    itemsPerPage: 5
  })

  // Pagination for history
  const {
    currentPage: historyCurrentPage,
    totalPages: historyTotalPages,
    currentItems: paginatedHistory,
    startIndex: historyStartIndex,
    endIndex: historyEndIndex,
    hasNextPage: historyHasNextPage,
    hasPrevPage: historyHasPrevPage,
    goToPage: historyGoToPage,
    goToNextPage: historyGoToNextPage,
    goToPrevPage: historyGoToPrevPage
  } = usePagination({
    data: filteredHistory,
    itemsPerPage: 5
  })

  return (
    <SimpleLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Legal Updates</h1>
                <p className="text-gray-600 mt-2">
                  Stay informed about employment law changes and compliance requirements
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {pendingUpdates.length} actions required
                </span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Actions & Updates</CardTitle>
                <CardDescription>
                  Manage legal updates and compliance actions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                          {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                        </span>
                      )}
                    </Button>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search legal updates..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Date From</Label>
                            <Input
                              type="date"
                              value={filters.dateFrom}
                              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Date To</Label>
                            <Input
                              type="date"
                              value={filters.dateTo}
                              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Priority</Label>
                            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="high">High Priority</SelectItem>
                                <SelectItem value="medium">Medium Priority</SelectItem>
                                <SelectItem value="low">Low Priority</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              onClick={clearFilters}
                              className="w-full"
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="required" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="required" className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Actions Required ({pendingUpdates.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Actions Completed ({completedUpdates.length})
                    </TabsTrigger>
                  </TabsList>

              <TabsContent value="required" className="mt-6">
                {pendingUpdates.length > 0 ? (
                  <div>
                    {/* Actions List */}
                    <div className="space-y-4">
                      {paginatedActions.map((update) => (
                        <Card key={update.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[update.priority as Priority].color}`}>
                                    {priorityConfig[update.priority as Priority].label}
                                  </span>
                                  <span className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[update.status as Status].color}`}>
                                    {statusConfig[update.status as Status].label}
                                  </span>
                                </div>
                                <h3 className="font-medium text-gray-900 mb-2">{update.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{update.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                  <span>Impact: {update.impact}</span>
                                  <span>Category: {update.category}</span>
                                </div>
                                <div className="bg-warning-100 border border-warning-200 rounded-lg p-3">
                                  <p className="text-sm font-medium text-warning-800">
                                    Action Required: {update.actionRequired}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(update.id)}
                                  className="text-info-600 hover:text-info-700"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAsDone(update.id)}
                                  className="bg-success-600 hover:bg-success-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Mark Done
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Actions Pagination */}
                    {actionsTotalPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={actionsCurrentPage}
                          totalPages={actionsTotalPages}
                          totalItems={pendingUpdates.length}
                          itemsPerPage={5}
                          onPageChange={actionsGoToPage}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Actions Required</h3>
                      <p className="text-gray-500">All legal updates have been completed!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {completedUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {completedUpdates.map((update) => (
                      <Card key={update.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[update.priority].color}`}>
                                  {priorityConfig[update.priority].label}
                                </span>
                                <span className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[update.status].color}`}>
                                  {statusConfig[update.status].label}
                                </span>
                              </div>
                              <h3 className="font-medium text-gray-900 mb-2">{update.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{update.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Impact: {update.impact}</span>
                                <span>Category: {update.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(update.id)}
                                className="text-info-600 hover:text-info-700"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Actions</h3>
                      <p className="text-gray-500">Complete some legal updates to see them here.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Legal Updates History Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Legal Updates History</CardTitle>
                <CardDescription>
                  All implemented legal updates and compliance actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* History Filters */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                      className="flex items-center"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      History Filters
                      {hasActiveHistoryFilters && (
                        <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                          {Object.values(historyFilters).filter(v => v !== 'all' && v !== '').length}
                        </span>
                      )}
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search history..."
                        value={historyFilters.search}
                        onChange={(e) => handleHistoryFilterChange('search', e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  {/* Advanced History Filters */}
                  {showHistoryFilters && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Date From</Label>
                            <Input
                              type="date"
                              value={historyFilters.dateFrom}
                              onChange={(e) => handleHistoryFilterChange('dateFrom', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Date To</Label>
                            <Input
                              type="date"
                              value={historyFilters.dateTo}
                              onChange={(e) => handleHistoryFilterChange('dateTo', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {hasActiveHistoryFilters && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button 
                              variant="outline" 
                              onClick={clearHistoryFilters}
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
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Impact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map((update) => (
                        <tr key={update.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{new Date(update.date).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">Implemented</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{update.title}</div>
                            <div className="text-xs text-gray-500 mt-1">Legal compliance update</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              update.impact === 'High' ? 'bg-destructive-100 text-destructive-800' :
                              update.impact === 'Medium' ? 'bg-warning-100 text-warning-800' :
                              'bg-success-100 text-success-800'
                            }`}>
                              {update.impact === 'High' ? <AlertTriangle className="w-4 h-4 mr-1" /> :
                               update.impact === 'Medium' ? <AlertCircle className="w-4 h-4 mr-1" /> :
                               <CheckCircle className="w-4 h-4 mr-1" />}
                              <span>{update.impact}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Implemented
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <TableActions
                              actions={[
                                createViewAction(() => handleViewHistoryDetails(update))
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No history found matching your filters</p>
                    <Button variant="outline" onClick={clearHistoryFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* History Pagination */}
                {historyTotalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={historyCurrentPage}
                      totalPages={historyTotalPages}
                      totalItems={filteredHistory.length}
                      itemsPerPage={5}
                      onPageChange={historyGoToPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* No Results */}
          {filteredUpdates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No legal updates found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Legal Update Details Modal */}
          {showDetailsModal && selectedUpdate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Legal Update Details</h3>
                  </div>
                  <button
                    onClick={handleCloseDetailsModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Header Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[selectedUpdate.priority].color}`}>
                        {priorityConfig[selectedUpdate.priority].label}
                      </span>
                      <span className="text-sm text-gray-500">{new Date(selectedUpdate.date).toLocaleDateString()}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedUpdate.status].color}`}>
                        {statusConfig[selectedUpdate.status].label}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedUpdate.title}</h2>
                    <p className="text-gray-600">{selectedUpdate.description}</p>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Dates</h4>
                        <div className="space-y-2 text-sm">
                          {selectedUpdate.effectiveDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Effective Date:</span>
                              <span className="font-medium">{new Date(selectedUpdate.effectiveDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {selectedUpdate.complianceDeadline && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Compliance Deadline:</span>
                              <span className="font-medium">{new Date(selectedUpdate.complianceDeadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Impact Assessment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impact Level:</span>
                            <span className="font-medium">{selectedUpdate.impact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{selectedUpdate.category}</span>
                          </div>
                          {selectedUpdate.affectedEmployees && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Affected Employees:</span>
                              <span className="font-medium">{selectedUpdate.affectedEmployees}</span>
                            </div>
                          )}
                          {selectedUpdate.estimatedCost && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estimated Cost:</span>
                              <span className="font-medium">{selectedUpdate.estimatedCost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Source Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Source:</span>
                            <span className="font-medium">{selectedUpdate.source}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Action</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-800">
                            {selectedUpdate.actionRequired}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Links */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Related Resources & Links</h4>
                    <div className="space-y-2">
                      {selectedUpdate.relatedLinks.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 underline"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleCloseDetailsModal}
                    >
                      Close
                    </Button>
                    {selectedUpdate.status === 'pending' && (
                      <Button
                        onClick={() => {
                          handleMarkAsDone(selectedUpdate.id)
                          handleCloseDetailsModal()
                        }}
                        className="bg-success-600 hover:bg-success-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
} 