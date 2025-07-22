'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, Filter, Search, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Edit, Eye, Trash2, UserCheck, UserX, X } from 'lucide-react'
import { useState } from 'react'

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Product Designer',
    company: 'C',
    type: 'W-2',
    tenure: '4.5 years',
    status: 'active',
    complianceScore: 70,
    lastCheck: '2 days ago'
  },
  {
    id: 2,
    name: 'Jane Doe',
    role: 'Product Manager',
    company: 'Hourglass',
    type: '1099',
    tenure: '2 years',
    status: 'pending',
    complianceScore: 60,
    lastCheck: '2 days ago'
  },
  {
    id: 3,
    name: 'John Doe',
    role: 'Product Designer',
    company: 'C',
    type: '1099',
    tenure: '1.5 years',
    status: 'active',
    complianceScore: 30,
    lastCheck: '2 days ago'
  },
  {
    id: 4,
    name: 'Hourglass',
    role: 'Product Manager',
    company: 'Hourglass',
    type: 'W-2',
    tenure: '1.7 years',
    status: 'inactive',
    complianceScore: 80,
    lastCheck: '2 days ago'
  },
  {
    id: 5,
    name: 'John Doe',
    role: 'Product Designer',
    company: 'C',
    type: 'W-2',
    tenure: '5 years',
    status: 'active',
    complianceScore: 20,
    lastCheck: '2 days ago'
  },
  {
    id: 6,
    name: 'Hourglass',
    role: 'Product Manager',
    company: 'Hourglass',
    type: '1099',
    tenure: '4.8 years',
    status: 'pending',
    complianceScore: 10,
    lastCheck: '2 days ago'
  },
  {
    id: 7,
    name: 'John Doe',
    role: 'Product Designer',
    company: 'C',
    type: 'W-2',
    tenure: '6.5 years',
    status: 'inactive',
    complianceScore: 40,
    lastCheck: '2 days ago'
  }
]

const statusConfig = {
  active: { label: 'Active', color: 'text-success-600', bg: 'bg-success-100' },
  pending: { label: 'Pending', color: 'text-warning-600', bg: 'bg-warning-100' },
  inactive: { label: 'Inactive', color: 'text-destructive-600', bg: 'bg-destructive-100' }
}

export default function TeamPage() {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null)
  const [employeeToUpdate, setEmployeeToUpdate] = useState<any>(null)
  const [newStatus, setNewStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    company: 'all',
    type: 'all',
    role: 'all',
    complianceScore: 'all'
  })

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredData.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(filteredData.map(member => member.id))
    }
  }

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleActionClick = (employeeId: number, action: string) => {
    const employee = mockTeamMembers.find(emp => emp.id === employeeId)
    
    switch (action) {
      case 'edit':
        window.location.href = `/dashboard/add-employee?edit=${employeeId}&referrer=team`
        break
      case 'view':
        window.location.href = `/team/${employeeId}`
        break
      case 'activate':
        setEmployeeToUpdate(employee)
        setNewStatus('active')
        setShowStatusModal(true)
        break
      case 'deactivate':
        setEmployeeToUpdate(employee)
        setNewStatus('inactive')
        setShowStatusModal(true)
        break
      case 'delete':
        setEmployeeToDelete(employee)
        setShowDeleteModal(true)
        break
    }
    setSelectedEmployee(null)
  }

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to delete the employee
    console.log('Deleting employee:', employeeToDelete?.name)
    setShowDeleteModal(false)
    setEmployeeToDelete(null)
  }

  const handleStatusConfirm = () => {
    // Here you would typically make an API call to update the employee status
    console.log('Updating employee status:', employeeToUpdate?.name, 'to', newStatus)
    setShowStatusModal(false)
    setEmployeeToUpdate(null)
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
      company: 'all',
      type: 'all',
      role: 'all',
      complianceScore: 'all'
    })
  }

  const filteredData = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         member.role.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || member.status === filters.status
    const matchesCompany = filters.company === 'all' || member.company === filters.company
    const matchesType = filters.type === 'all' || member.type === filters.type
    const matchesRole = filters.role === 'all' || member.role.toLowerCase() === filters.role
    const matchesCompliance = filters.complianceScore === 'all' || 
                             (filters.complianceScore === 'high' && member.complianceScore >= 70) ||
                             (filters.complianceScore === 'medium' && member.complianceScore >= 40 && member.complianceScore < 70) ||
                             (filters.complianceScore === 'low' && member.complianceScore < 40)
    
    return matchesSearch && matchesStatus && matchesCompany && matchesType && matchesRole && matchesCompliance
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
                  <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
                  <p className="text-gray-600 mt-2">
                    Manage your team members and track their compliance status
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => window.location.href = '/dashboard/add-employee?referrer=team'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
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
                    placeholder="Search"
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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                          value={filters.company}
                          onChange={(e) => handleFilterChange('company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Companies</option>
                          <option value="C">C</option>
                          <option value="Hourglass">Hourglass</option>
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
                          <option value="W-2">W-2</option>
                          <option value="1099">1099</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={filters.role}
                          onChange={(e) => handleFilterChange('role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Roles</option>
                          <option value="product designer">Product Designer</option>
                          <option value="product manager">Product Manager</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Score</label>
                        <select
                          value={filters.complianceScore}
                          onChange={(e) => handleFilterChange('complianceScore', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Scores</option>
                          <option value="high">High (70%+)</option>
                          <option value="medium">Medium (40-69%)</option>
                          <option value="low">Low (&lt;40%)</option>
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

            {/* Team Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          <input
                            type="checkbox"
                            checked={selectedMembers.length === filteredData.length && filteredData.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          <div className="flex items-center">
                            Company
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tenure</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Check</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((member) => {
                        const status = statusConfig[member.status as keyof typeof statusConfig]
                        
                        return (
                          <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={() => handleSelectMember(member.id)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-primary-600">
                                    {member.company === 'C' ? 'C' : '⏳'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{member.name}</div>
                                  <div className="text-sm text-gray-500">{member.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{member.type}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{member.tenure}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-primary-600 h-2 rounded-full" 
                                    style={{ width: `${member.complianceScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{member.complianceScore}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{member.lastCheck}</p>
                            </td>
                            <td className="py-4 px-4">
                              <div className="relative">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedEmployee(selectedEmployee === member.id ? null : member.id)}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                                
                                {selectedEmployee === member.id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleActionClick(member.id, 'edit')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Employee
                                      </button>
                                      <button
                                        onClick={() => handleActionClick(member.id, 'view')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Profile
                                      </button>
                                      {member.status === 'inactive' && (
                                        <button
                                          onClick={() => handleActionClick(member.id, 'activate')}
                                          className="flex items-center w-full px-4 py-2 text-sm text-success-600 hover:bg-success-50"
                                        >
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          Activate Employee
                                        </button>
                                      )}
                                      {member.status === 'active' && (
                                        <button
                                          onClick={() => handleActionClick(member.id, 'deactivate')}
                                          className="flex items-center w-full px-4 py-2 text-sm text-warning-600 hover:bg-warning-50"
                                        >
                                          <UserX className="w-4 h-4 mr-2" />
                                          Deactivate Employee
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleActionClick(member.id, 'delete')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-destructive-600 hover:bg-destructive-50"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Employee
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

                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-gray-500">No team members found matching your filters</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {filteredData.length} of {mockTeamMembers.length} results
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
                <h3 className="text-lg font-medium text-gray-900">Delete Employee</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone.
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
                  Delete Employee
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
                <h3 className="text-lg font-medium text-gray-900">Update Employee Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change <strong>{employeeToUpdate?.name}</strong>&apos;s status to <strong>{newStatus === 'active' ? 'Active' : 'Inactive'}</strong>?
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