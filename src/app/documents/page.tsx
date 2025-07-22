'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Search, Filter, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Edit, Eye, Trash2, Download, Share, X } from 'lucide-react'
import { useState } from 'react'

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: 'Job Offer',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['Sarah', 'Mike', 'Emma', 'Alex', 'David', 'Lisa', 'Chris', 'Anna', 'Rachel', 'Kevin'],
    status: 'signed',
    lastUpdate: '2 days ago'
  },
  {
    id: 2,
    name: 'Non-Disclosure Agreement',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['John', 'Jane', 'Mike', 'Sarah', 'Emma', 'Alex', 'David', 'Lisa', 'Chris', 'Anna', 'Rachel', 'Kevin'],
    status: 'reviewed',
    lastUpdate: '2 days ago'
  },
  {
    id: 3,
    name: 'Employee Handbook',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['Sarah', 'Mike'],
    status: 'signed',
    lastUpdate: '2 days ago'
  },
  {
    id: 4,
    name: 'Policy Compliance',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['John', 'Jane', 'Mike', 'Sarah'],
    status: 'needs_update',
    lastUpdate: '2 days ago'
  },
  {
    id: 5,
    name: 'Benefits and Perks',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['Sarah', 'Mike', 'Emma'],
    status: 'signed',
    lastUpdate: '2 days ago'
  },
  {
    id: 6,
    name: 'Employment Contract',
    employee: 'Gelo Cagulada',
    type: 'Policy',
    assigned: ['John', 'Jane', 'Mike', 'Sarah', 'Emma', 'Alex', 'David', 'Lisa', 'Chris', 'Anna', 'Rachel', 'Kevin'],
    status: 'reviewed',
    lastUpdate: '2 days ago'
  }
]

const statusConfig = {
  signed: { label: 'Signed', color: 'text-success-600', bg: 'bg-success-100' },
  reviewed: { label: 'Reviewed', color: 'text-warning-600', bg: 'bg-warning-100' },
  needs_update: { label: 'Needs Update', color: 'text-destructive-600', bg: 'bg-destructive-100' }
}

export default function DocumentsPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<any>(null)
  const [documentToUpdate, setDocumentToUpdate] = useState<any>(null)
  const [newStatus, setNewStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    employee: 'all',
    dateRange: 'all'
  })

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id))
    }
  }

  const handleSelectDocument = (documentId: number) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const handleActionClick = (documentId: number, action: string) => {
    const document = mockDocuments.find(doc => doc.id === documentId)
    
    switch (action) {
      case 'edit':
        // Navigate to document edit page
        console.log('Editing document:', document?.name)
        break
      case 'view':
        // Navigate to document details page
        console.log('Viewing document:', document?.name)
        break
      case 'download':
        // Download document
        console.log('Downloading document:', document?.name)
        break
      case 'share':
        // Share document
        console.log('Sharing document:', document?.name)
        break
      case 'mark_signed':
        setDocumentToUpdate(document)
        setNewStatus('signed')
        setShowStatusModal(true)
        break
      case 'mark_reviewed':
        setDocumentToUpdate(document)
        setNewStatus('reviewed')
        setShowStatusModal(true)
        break
      case 'mark_needs_update':
        setDocumentToUpdate(document)
        setNewStatus('needs_update')
        setShowStatusModal(true)
        break
      case 'delete':
        setDocumentToDelete(document)
        setShowDeleteModal(true)
        break
    }
    setSelectedDocument(null)
  }

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to delete the document
    console.log('Deleting document:', documentToDelete?.name)
    setShowDeleteModal(false)
    setDocumentToDelete(null)
  }

  const handleStatusConfirm = () => {
    // Here you would typically make an API call to update the document status
    console.log('Updating document status:', documentToUpdate?.name, 'to', newStatus)
    setShowStatusModal(false)
    setDocumentToUpdate(null)
    setNewStatus('')
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      employee: 'all',
      dateRange: 'all'
    })
  }

  const filteredDocuments = mockDocuments.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         document.employee.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || document.status === filters.status
    const matchesType = filters.type === 'all' || document.type.toLowerCase() === filters.type
    const matchesEmployee = filters.employee === 'all' || document.employee === filters.employee
    const matchesDate = filters.dateRange === 'all' || 
                       (filters.dateRange === 'today' && document.lastUpdate === 'Minute ago') ||
                       (filters.dateRange === 'week' && (document.lastUpdate.includes('day') || document.lastUpdate === 'Minute ago')) ||
                       (filters.dateRange === 'month' && document.lastUpdate.includes('days ago'))
    
    return matchesSearch && matchesStatus && matchesType && matchesEmployee && matchesDate
  })

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '')

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                  <p className="text-gray-600 mt-2">
                    Manage and track all your employment documents
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => window.location.href = '/documents/create'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Document
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sent Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,420</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    <span className="text-sm text-success-600">+40%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-success-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,210</div>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-destructive-500 mr-1" />
                    <span className="text-sm text-destructive-600">-10%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-destructive-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Signed Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">316</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    <span className="text-sm text-success-600">+20%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-success-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Status</option>
                          <option value="signed">Signed</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="needs_update">Needs Update</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={filters.type}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Types</option>
                          <option value="policy">Policy</option>
                          <option value="contract">Contract</option>
                          <option value="agreement">Agreement</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                        <select
                          value={filters.employee}
                          onChange={(e) => handleFilterChange('employee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Employees</option>
                          <option value="Gelo Cagulada">Gelo Cagulada</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                          value={filters.dateRange}
                          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                        </select>
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

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Documents</CardTitle>
                <CardDescription>
                  View and manage all your employment documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          <div className="flex items-center">
                            Document Name
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Update</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((document) => {
                        const status = statusConfig[document.status as keyof typeof statusConfig]
                        
                        return (
                          <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(document.id)}
                                onChange={() => handleSelectDocument(document.id)}
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
                              <p className="text-gray-900">{document.employee}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{document.type}</p>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="flex -space-x-2">
                                  {document.assigned.slice(0, 3).map((person, index) => (
                                    <div
                                      key={index}
                                      className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white"
                                    >
                                      {person[0]}
                                    </div>
                                  ))}
                                </div>
                                {document.assigned.length > 3 && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    +{document.assigned.length - 3}
                                  </span>
                                )}
                              </div>
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
                              <div className="relative">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedDocument(selectedDocument === document.id ? null : document.id)}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                                
                                {selectedDocument === document.id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleActionClick(document.id, 'edit')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Document
                                      </button>
                                      <button
                                        onClick={() => handleActionClick(document.id, 'view')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </button>
                                      <button
                                        onClick={() => handleActionClick(document.id, 'download')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </button>
                                      <button
                                        onClick={() => handleActionClick(document.id, 'share')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Share className="w-4 h-4 mr-2" />
                                        Share
                                      </button>
                                      {document.status !== 'signed' && (
                                        <button
                                          onClick={() => handleActionClick(document.id, 'mark_signed')}
                                          className="flex items-center w-full px-4 py-2 text-sm text-success-600 hover:bg-success-50"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Mark as Signed
                                        </button>
                                      )}
                                      {document.status !== 'reviewed' && (
                                        <button
                                          onClick={() => handleActionClick(document.id, 'mark_reviewed')}
                                          className="flex items-center w-full px-4 py-2 text-sm text-warning-600 hover:bg-warning-50"
                                        >
                                          <Clock className="w-4 h-4 mr-2" />
                                          Mark as Reviewed
                                        </button>
                                      )}
                                      {document.status !== 'needs_update' && (
                                        <button
                                          onClick={() => handleActionClick(document.id, 'mark_needs_update')}
                                          className="flex items-center w-full px-4 py-2 text-sm text-destructive-600 hover:bg-destructive-50"
                                        >
                                          <AlertCircle className="w-4 h-4 mr-2" />
                                          Mark as Needs Update
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleActionClick(document.id, 'delete')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-destructive-600 hover:bg-destructive-50"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Document
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found matching your filters</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {filteredDocuments.length} of {mockDocuments.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" className="bg-primary-600 text-white">1</Button>
                      <Button variant="outline" size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <span className="px-2 text-gray-500">...</span>
                      <Button variant="outline" size="sm">8</Button>
                      <Button variant="outline" size="sm">9</Button>
                      <Button variant="outline" size="sm">10</Button>
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
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Document</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{documentToDelete?.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-destructive-600 hover:bg-destructive-700"
                  onClick={handleDeleteConfirm}
                >
                  Delete Document
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Document Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change <strong>{documentToUpdate?.name}</strong>&apos;s status to <strong>{newStatus === 'signed' ? 'Signed' : newStatus === 'reviewed' ? 'Reviewed' : 'Needs Update'}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={handleStatusConfirm}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
} 