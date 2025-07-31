'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination } from '@/components/ui/pagination'
import { TableActions, createViewAction, createEditAction, createDeleteAction } from '@/components/ui/table-actions'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { Plus, Filter, Search, ChevronDown, ChevronLeft, ChevronRight, X, Mail, CheckCircle, AlertCircle, Users } from 'lucide-react'
import { useState } from 'react'
import { usePagination } from '@/hooks/use-pagination'

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Product Designer',
    email: 'john@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Product Manager',
    email: 'jane@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Senior Developer',
    email: 'mike@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    role: 'UX Designer',
    email: 'sarah@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 5,
    name: 'David Brown',
    role: 'Marketing Manager',
    email: 'david@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 6,
    name: 'Emma Davis',
    role: 'HR Specialist',
    email: 'emma@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 7,
    name: 'Alex Rodriguez',
    role: 'Frontend Developer',
    email: 'alex@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 8,
    name: 'Lisa Chen',
    role: 'Data Analyst',
    email: 'lisa@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 9,
    name: 'Tom Wilson',
    role: 'DevOps Engineer',
    email: 'tom@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 10,
    name: 'Maria Garcia',
    role: 'Sales Representative',
    email: 'maria@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 11,
    name: 'James Lee',
    role: 'Customer Success Manager',
    email: 'james@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 12,
    name: 'Anna Thompson',
    role: 'Content Writer',
    email: 'anna@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 13,
    name: 'Chris Anderson',
    role: 'Backend Developer',
    email: 'chris@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 14,
    name: 'Rachel Green',
    role: 'Product Marketing Manager',
    email: 'rachel@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 15,
    name: 'Michael Scott',
    role: 'Regional Manager',
    email: 'michael@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 16,
    name: 'Pam Beesly',
    role: 'Office Administrator',
    email: 'pam@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 17,
    name: 'Dwight Schrute',
    role: 'Assistant to the Regional Manager',
    email: 'dwight@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 18,
    name: 'Jim Halpert',
    role: 'Sales Representative',
    email: 'jim@complai.io',
    handbookStatus: 'Acknowledged'
  },
  {
    id: 19,
    name: 'Angela Martin',
    role: 'Senior Accountant',
    email: 'angela@complai.io',
    handbookStatus: 'Pending'
  },
  {
    id: 20,
    name: 'Kevin Malone',
    role: 'Accountant',
    email: 'kevin@complai.io',
    handbookStatus: 'Acknowledged'
  }
]

const handbookStatusConfig = {
  acknowledged: { label: 'Acknowledged', color: 'text-success-600', bg: 'bg-success-100' },
  pending: { label: 'Pending', color: 'text-warning-600', bg: 'bg-warning-100' }
}

export default function TeamPage() {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    handbookStatus: 'all',
    role: 'all'
  })

  const handleSelectAll = () => {
    if (selectedMembers.length === paginatedEmployees.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(paginatedEmployees.map(member => member.id))
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
        alert('Edit functionality - Employee ID: ' + employeeId)
        break
      case 'view':
        window.location.href = `/team/${employeeId}`
        break
      case 'delete':
        setEmployeeToDelete(employee)
        setShowDeleteModal(true)
        break
    }
  }

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to delete the employee
    console.log('Deleting employee:', employeeToDelete?.name)
    setShowDeleteModal(false)
    setEmployeeToDelete(null)
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
      handbookStatus: 'all',
      role: 'all'
    })
  }

  const filteredData = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         member.role.toLowerCase().includes(filters.search.toLowerCase())
    const matchesHandbookStatus = filters.handbookStatus === 'all' || member.handbookStatus.toLowerCase() === filters.handbookStatus
    const matchesRole = filters.role === 'all' || member.role.toLowerCase() === filters.role
    
    return matchesSearch && matchesHandbookStatus && matchesRole
  })

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '')

  // Unified pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedEmployees,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage
  } = usePagination({
    data: filteredData,
    itemsPerPage: 10
  })



  return (
    <SimpleLayout>
      <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
                  <p className="text-gray-600 mt-2">
                    Manage your team members and track their handbook status
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

            {/* Team Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Team</CardTitle>
                <CardDescription>
                  All team members with their handbook acknowledgment status
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
                        placeholder="Search employees..."
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Handbook Status</Label>
                            <Select value={filters.handbookStatus} onValueChange={(value) => handleFilterChange('handbookStatus', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                            <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Roles" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="product designer">Product Designer</SelectItem>
                                <SelectItem value="product manager">Product Manager</SelectItem>
                                <SelectItem value="senior developer">Senior Developer</SelectItem>
                                <SelectItem value="ux designer">UX Designer</SelectItem>
                                <SelectItem value="marketing manager">Marketing Manager</SelectItem>
                                <SelectItem value="hr specialist">HR Specialist</SelectItem>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          <Checkbox
                            checked={selectedMembers.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Handbook Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedMembers.includes(member.id)}
                              onCheckedChange={() => handleSelectMember(member.id)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{member.role}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{member.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.handbookStatus === 'Acknowledged' 
                                ? 'badge-status-success' 
                                : 'badge-status-warning'
                            }`}>
                              {member.handbookStatus === 'Acknowledged' ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                              <span>{member.handbookStatus}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <TableActions
                              actions={[
                                createEditAction(() => handleActionClick(member.id, 'edit')),
                                createViewAction(() => handleActionClick(member.id, 'view')),
                                createDeleteAction(() => handleActionClick(member.id, 'delete'))
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {paginatedEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No team members found matching your filters</p>
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
                      totalItems={filteredData.length}
                      itemsPerPage={10}
                      onPageChange={goToPage}
                    />
                  </div>
                )}
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
      </SimpleLayout>
  )
} 