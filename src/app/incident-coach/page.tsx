'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TableActions, createViewAction, createDeleteAction } from '@/components/ui/table-actions'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { AlertCircle, AlertTriangle, CheckCircle, Plus, FileText, Users, Calendar, MapPin, X, Filter, Search, ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePagination } from '@/hooks/use-pagination'
import { Pagination } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function IncidentCoachPage() {
  const router = useRouter()
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    status: 'all'
  })

  // Mock incident data - sorted by most recent first
  const incidents = [
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      description: 'Workplace conflict between team members during project meeting',
      employees: ['John Doe', 'Jane Smith'],
      location: 'Conference Room A',
      riskLevel: 'medium',
      status: 'In Progress',
      aiRecommendations: [
        'Schedule mediation session within 48 hours',
        'Document all details thoroughly',
        'Follow up with both parties individually',
        'Monitor team dynamics closely'
      ],
      nextSteps: [
        'Schedule mediation session',
        'Document incident details',
        'Follow up with both parties'
      ],
      completedSteps: ['Document incident details'],
      how: 'Disagreement escalated during project planning meeting'
    },
    {
      id: 2,
      date: '2024-01-12',
      time: '09:15',
      description: 'Inappropriate language used in team chat',
      employees: ['Mike Johnson'],
      location: 'Slack workspace',
      riskLevel: 'low',
      status: 'Resolved',
      aiRecommendations: [
        'Issue verbal warning immediately',
        'Review team communication guidelines',
        'Provide additional training if needed',
        'Monitor future communications'
      ],
      nextSteps: [
        'Verbal warning issued',
        'Team communication guidelines reviewed'
      ],
      completedSteps: ['Verbal warning issued', 'Team communication guidelines reviewed'],
      how: 'Inappropriate comment made in public team channel'
    },
    {
      id: 3,
      date: '2024-01-08',
      time: '16:45',
      description: 'Allegation of unfair treatment in performance review',
      employees: ['Sarah Wilson', 'David Brown'],
      location: 'Office',
      riskLevel: 'high',
      status: 'Under Investigation',
      aiRecommendations: [
        'Initiate HR investigation immediately',
        'Consult legal counsel',
        'Review all documentation thoroughly',
        'Separate parties if necessary',
        'Prepare for potential legal action'
      ],
      nextSteps: [
        'HR investigation initiated',
        'Legal counsel consulted',
        'Documentation reviewed'
      ],
      completedSteps: ['HR investigation initiated'],
      how: 'Employee reported feeling discriminated against during review process'
    },
    {
      id: 4,
      date: '2024-01-05',
      time: '11:20',
      description: 'Minor disagreement over project priorities',
      employees: ['Emma Davis', 'John Doe'],
      location: 'Break room',
      riskLevel: 'low',
      status: 'Resolved',
      aiRecommendations: [
        'Facilitate informal discussion',
        'Document the disagreement',
        'Monitor for escalation',
        'Provide conflict resolution training'
      ],
      nextSteps: [
        'Informal discussion scheduled',
        'Documentation completed'
      ],
      completedSteps: ['Informal discussion scheduled', 'Documentation completed'],
      how: 'Disagreement over project timeline and resource allocation'
    },
    {
      id: 5,
      date: '2024-01-02',
      time: '13:45',
      description: 'Safety concern reported about office equipment',
      employees: ['David Brown'],
      location: 'Office kitchen',
      riskLevel: 'medium',
      status: 'In Progress',
      aiRecommendations: [
        'Address safety concern immediately',
        'Inspect equipment thoroughly',
        'Implement safety measures',
        'Train employees on proper usage'
      ],
      nextSteps: [
        'Equipment inspection scheduled',
        'Safety measures implemented'
      ],
      completedSteps: ['Equipment inspection scheduled'],
      how: 'Employee reported malfunctioning equipment that could pose safety risk'
    },
    {
      id: 6,
      date: '2023-12-28',
      time: '10:30',
      description: 'Unauthorized access to confidential files',
      employees: ['Alex Rodriguez'],
      location: 'Server room',
      riskLevel: 'high',
      status: 'Under Investigation',
      aiRecommendations: [
        'Immediate security audit required',
        'Change all access credentials',
        'Review security protocols',
        'Consider legal action if necessary'
      ],
      nextSteps: [
        'Security audit initiated',
        'Access credentials updated',
        'Legal review in progress'
      ],
      completedSteps: ['Security audit initiated'],
      how: 'Employee accessed restricted areas without proper authorization'
    },
    {
      id: 7,
      date: '2023-12-20',
      time: '15:15',
      description: 'Inappropriate social media post by employee',
      employees: ['Lisa Chen'],
      location: 'Social media',
      riskLevel: 'medium',
      status: 'Resolved',
      aiRecommendations: [
        'Issue written warning',
        'Review social media policy',
        'Provide training on appropriate online behavior',
        'Monitor future posts'
      ],
      nextSteps: [
        'Written warning issued',
        'Social media policy reviewed',
        'Training completed'
      ],
      completedSteps: ['Written warning issued', 'Social media policy reviewed', 'Training completed'],
      how: 'Employee posted inappropriate content on company social media account'
    },
    {
      id: 8,
      date: '2023-12-15',
      time: '09:45',
      description: 'Workplace bullying allegations',
      employees: ['Tom Wilson', 'Maria Garcia'],
      location: 'Open office area',
      riskLevel: 'high',
      status: 'In Progress',
      aiRecommendations: [
        'Separate parties immediately',
        'Conduct thorough investigation',
        'Implement anti-bullying training',
        'Monitor workplace environment'
      ],
      nextSteps: [
        'Parties separated',
        'Investigation ongoing',
        'Training scheduled'
      ],
      completedSteps: ['Parties separated'],
      how: 'Multiple reports of verbal harassment and exclusionary behavior'
    },
    {
      id: 9,
      date: '2023-12-10',
      time: '14:20',
      description: 'Minor slip and fall accident',
      employees: ['James Lee'],
      location: 'Office lobby',
      riskLevel: 'low',
      status: 'Resolved',
      aiRecommendations: [
        'Document incident thoroughly',
        'Review safety protocols',
        'Implement preventive measures',
        'Follow up with employee'
      ],
      nextSteps: [
        'Incident documented',
        'Safety review completed',
        'Preventive measures implemented'
      ],
      completedSteps: ['Incident documented', 'Safety review completed', 'Preventive measures implemented'],
      how: 'Employee slipped on wet floor after cleaning'
    },
    {
      id: 10,
      date: '2023-12-05',
      time: '11:00',
      description: 'Data breach attempt detected',
      employees: ['Anna Thompson'],
      location: 'IT department',
      riskLevel: 'high',
      status: 'Under Investigation',
      aiRecommendations: [
        'Immediate security response required',
        'Notify relevant authorities',
        'Review all system access',
        'Implement additional security measures'
      ],
      nextSteps: [
        'Security response activated',
        'Authorities notified',
        'System access review in progress'
      ],
      completedSteps: ['Security response activated'],
      how: 'Suspicious login attempts detected from unauthorized locations'
    },
    {
      id: 11,
      date: '2023-11-30',
      time: '16:30',
      description: 'Disagreement over project ownership',
      employees: ['John Doe', 'Emma Davis'],
      location: 'Project meeting room',
      riskLevel: 'medium',
      status: 'Resolved',
      aiRecommendations: [
        'Facilitate discussion between parties',
        'Clarify project roles and responsibilities',
        'Document agreement in writing',
        'Follow up to ensure resolution'
      ],
      nextSteps: [
        'Discussion facilitated',
        'Roles clarified',
        'Agreement documented'
      ],
      completedSteps: ['Discussion facilitated', 'Roles clarified', 'Agreement documented'],
      how: 'Dispute over credit and ownership of project deliverables'
    },
    {
      id: 12,
      date: '2023-11-25',
      time: '13:15',
      description: 'Inappropriate comments during team lunch',
      employees: ['Mike Johnson', 'Sarah Wilson'],
      location: 'Company cafeteria',
      riskLevel: 'low',
      status: 'Resolved',
      aiRecommendations: [
        'Address behavior immediately',
        'Review workplace conduct policies',
        'Provide sensitivity training',
        'Monitor future interactions'
      ],
      nextSteps: [
        'Behavior addressed',
        'Policies reviewed',
        'Training completed'
      ],
      completedSteps: ['Behavior addressed', 'Policies reviewed', 'Training completed'],
      how: 'Inappropriate comments made during casual team lunch conversation'
    }
  ]

  const handleViewIncident = (incident: any) => {
    setSelectedIncident(incident)
    setShowIncidentModal(true)
  }

  const handleCloseIncidentModal = () => {
    setShowIncidentModal(false)
    setSelectedIncident(null)
  }

  const handleRemoveIncident = (incidentId: number) => {
    console.log('Removing incident:', incidentId)
    alert('Incident removed successfully!')
  }

  const handleStatusChange = (incidentId: number, newStatus: string) => {
    console.log('Changing status for incident:', incidentId, 'to:', newStatus)
    // In a real app, you would make an API call here to update the incident status
    alert(`Incident status changed to: ${newStatus}`)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'risk-high'
      case 'medium':
        return 'risk-medium'
      case 'low':
        return 'risk-low'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-destructive-600" />
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-warning-600" />
      case 'low':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         incident.employees.some(emp => emp.toLowerCase().includes(filters.search.toLowerCase())) ||
                         incident.location.toLowerCase().includes(filters.search.toLowerCase())
    const matchesRiskLevel = filters.riskLevel === 'all' || incident.riskLevel === filters.riskLevel
    const matchesStatus = filters.status === 'all' || incident.status.toLowerCase() === filters.status
    
    return matchesSearch && matchesRiskLevel && matchesStatus
  })

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '')

  // Unified pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedIncidents,
    startIndex,
    endIndex,
    goToPage
  } = usePagination({
    data: filteredIncidents,
    itemsPerPage: 5
  })

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      riskLevel: 'all',
      status: 'all'
    })
  }

  return (
    <TooltipProvider>
      <SimpleLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Incident Coach</h1>
                  <p className="text-gray-600 mt-2">
                    Track and manage workplace incidents with AI-powered guidance
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/incident-coach/new')}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Incident
                </Button>
              </div>
            </div>

            {/* Incidents Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>
                  All workplace incidents logged and analyzed with AI recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search incidents..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</Label>
                            <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange('riskLevel', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Risk Levels" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Risk Levels</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="low">Low Risk</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="in progress">In Progress</SelectItem>
                                <SelectItem value="under investigation">Under Investigation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {hasActiveFilters && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button 
                              variant="outline" 
                              onClick={clearFilters}
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
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Employees</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedIncidents.map((incident) => (
                        <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{incident.date}</div>
                              <div className="text-xs text-gray-500">{incident.time}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{incident.employees.length}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {incident.employees.slice(0, 2).join(', ')}
                              {incident.employees.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{incident.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(incident.riskLevel)}`}>
                              {getRiskLevelIcon(incident.riskLevel)}
                              <span className="ml-1">{incident.riskLevel.toUpperCase()}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            incident.status === 'Resolved' 
                              ? 'badge-status-success' 
                              : incident.status === 'In Progress'
                              ? 'badge-status-warning'
                              : 'badge-status-info'
                          }`}>
                              {incident.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <TableActions
                              actions={[
                                createViewAction(() => handleViewIncident(incident)),
                                {
                                  label: 'Mark as Resolved',
                                  icon: CheckCircle,
                                  onClick: () => handleStatusChange(incident.id, 'Resolved'),
                                  variant: 'success',
                                  disabled: incident.status === 'Resolved'
                                },
                                {
                                  label: 'Mark as In Progress',
                                  icon: AlertCircle,
                                  onClick: () => handleStatusChange(incident.id, 'In Progress'),
                                  variant: 'warning',
                                  disabled: incident.status === 'In Progress'
                                },
                                {
                                  label: 'Mark as Under Investigation',
                                  icon: AlertTriangle,
                                  onClick: () => handleStatusChange(incident.id, 'Under Investigation'),
                                  variant: 'destructive',
                                  disabled: incident.status === 'Under Investigation'
                                },
                                createDeleteAction(() => handleRemoveIncident(incident.id))
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {paginatedIncidents.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No incidents found matching your filters</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredIncidents.length}
                      itemsPerPage={5}
                      onPageChange={goToPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incident Details Modal */}
            {showIncidentModal && selectedIncident && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Incident Details</h3>
                    </div>
                    <button
                      onClick={handleCloseIncidentModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Incident Header */}
                    <div className="border-b border-gray-200 pb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedIncident.description}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{selectedIncident.date} at {selectedIncident.time}</span>
                        <span>{selectedIncident.location}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedIncident.riskLevel)}`}>
                          {selectedIncident.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Incident Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Employees Involved</h4>
                        <div className="space-y-2">
                          {selectedIncident.employees.map((employee: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{employee}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Status & Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              selectedIncident.status === 'Resolved' 
                                ? 'bg-success-100 text-success-800' 
                                : selectedIncident.status === 'In Progress'
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-info-100 text-info-800'
                            }`}>
                              {selectedIncident.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Completed Steps:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedIncident.completedSteps.length}/{selectedIncident.nextSteps.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* How it happened */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">How it happened</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{selectedIncident.how}</p>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                      <div className="space-y-2">
                        {selectedIncident.aiRecommendations.map((recommendation: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
                      <div className="space-y-2">
                        {selectedIncident.nextSteps.map((step: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              selectedIncident.completedSteps.includes(step) 
                                ? 'bg-success-600' 
                                : 'bg-warning-600'
                            }`}></div>
                            <span className={`text-sm ${
                              selectedIncident.completedSteps.includes(step) 
                                ? 'text-success-700 line-through' 
                                : 'text-gray-700'
                            }`}>
                              {step}
                            </span>
                            {selectedIncident.completedSteps.includes(step) && (
                              <span className="text-xs text-success-600 font-medium">✓ Completed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={handleCloseIncidentModal}
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => handleRemoveIncident(selectedIncident.id)}
                        className="bg-destructive-600 hover:bg-destructive-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Incident
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SimpleLayout>
    </TooltipProvider>
  )
} 