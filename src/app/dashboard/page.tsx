'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TableActions, createViewAction, createEditAction, createDeleteAction } from '@/components/ui/table-actions'
import { Pagination } from '@/components/ui/pagination'
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Calendar,
  BookOpen,
  AlertCircle,
  Scale,
  MoreVertical,
  Mail
} from 'lucide-react'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { useState } from 'react'
import { usePagination } from '@/hooks/use-pagination'

// Mock data for the table
const mockTableData = [
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

export default function DashboardPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    handbookStatus: 'all'
  })



  const handleActionClick = (employeeId: number, action: string) => {
    const employee = mockTableData.find(emp => emp.id === employeeId)
    
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
      handbookStatus: 'all'
    })
  }

  const filteredData = mockTableData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         employee.role.toLowerCase().includes(filters.search.toLowerCase())
    const matchesHandbookStatus = filters.handbookStatus === 'all' || employee.handbookStatus.toLowerCase() === filters.handbookStatus
    
    return matchesSearch && matchesHandbookStatus
  })

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '')

  // Unified pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedData,
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
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome to COMPLai
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Here&apos;s what&apos;s happening with your documents today
                </p>
              </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => window.location.href = '/dashboard/add-employee'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>

            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-info-600">Overall Compliance Score</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MoreVertical className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Overall compliance score that includes handbook status and acknowledgment status</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-600">87%</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    <span className="text-sm text-success-600">+3%</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-primary-600 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary-600">See why</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-info-600">Handbook Status</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MoreVertical className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current status of your employee handbook compliance</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">100%</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Compliant
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-info-600">Flagged Issues</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MoreVertical className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Issues that require your attention</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">4</div>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">2 pending acknowledgments</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2 legal updates</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Last run on Jan 15, 2024</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Items */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Action Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 border-info-200 hover:border-info-300 hover:bg-info-50"
                  onClick={() => window.location.href = '/handbook'}
                >
                  <div className="flex flex-col items-center">
                    <BookOpen className="w-6 h-6 text-info-600 mb-2" />
                    <span className="text-info-600 font-medium">View Handbook</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 border-info-200 hover:border-info-300 hover:bg-info-50"
                  onClick={() => window.location.href = '/incident-coach'}
                >
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-6 h-6 text-info-600 mb-2" />
                    <span className="text-info-600 font-medium">Incident Coach</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 border-info-200 hover:border-info-300 hover:bg-info-50"
                  onClick={() => window.location.href = '/legal-updates'}
                >
                  <div className="flex flex-col items-center">
                    <Scale className="w-6 h-6 text-info-600 mb-2" />
                    <span className="text-info-600 font-medium">Legal Updates</span>
                  </div>
                </Button>
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
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                      {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                    </span>
                  )}
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Handbook Status</Label>
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

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Team</CardTitle>
                <CardDescription>
                  Manage and track your employee documents and compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Handbook Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{item.role}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{item.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.handbookStatus === 'Acknowledged' 
                                ? 'badge-status-success' 
                                : 'badge-status-warning'
                            }`}>
                              {item.handbookStatus === 'Acknowledged' ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                              <span>{item.handbookStatus}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <TableActions
                              actions={[
                                createEditAction(() => handleActionClick(item.id, 'edit')),
                                createViewAction(() => handleActionClick(item.id, 'view')),
                                createDeleteAction(() => handleActionClick(item.id, 'delete'))
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {paginatedData.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No employees found matching your filters</p>
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
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
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