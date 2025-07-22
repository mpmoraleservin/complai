'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuthContext } from '@/lib/context/auth-context'
import { 
  User, 
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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Trash2,
  X,
  ChevronDown,
  Calendar
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useState } from 'react'

// Mock data for the table
const mockTableData = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Product Designer',
    email: 'john@complai.io',
    complianceScore: 95,
    assigned: ['Sarah', 'Mike', 'Emma', 'Alex', 'David'],
    status: 'Active',
    statusColor: 'green'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Product Manager',
    email: 'jane@complai.io',
    complianceScore: 87,
    assigned: ['Tom', 'Lisa', 'Chris', 'Anna'],
    status: 'Pending Review',
    statusColor: 'orange'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Senior Developer',
    email: 'mike@complai.io',
    complianceScore: 92,
    assigned: ['Rachel', 'Kevin', 'Maria'],
    status: 'Active',
    statusColor: 'green'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    role: 'UX Designer',
    email: 'sarah@complai.io',
    complianceScore: 78,
    assigned: ['John', 'Emma', 'Alex', 'David', 'Lisa', 'Chris'],
    status: 'Needs Update',
    statusColor: 'red'
  },
  {
    id: 5,
    name: 'David Brown',
    role: 'Marketing Manager',
    email: 'david@complai.io',
    complianceScore: 89,
    assigned: ['Sarah', 'Mike', 'Emma'],
    status: 'Active',
    statusColor: 'green'
  },
  {
    id: 6,
    name: 'Emma Davis',
    role: 'HR Specialist',
    email: 'emma@complai.io',
    complianceScore: 96,
    assigned: ['John', 'Jane', 'Mike', 'Sarah'],
    status: 'Active',
    statusColor: 'green'
  }
]

export default function DashboardPage() {
  const { user, isMockMode } = useAuthContext()
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    complianceScore: 'all',
    dateRange: 'all'
  })

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-success-100 text-success-800'
      case 'orange':
        return 'bg-warning-100 text-warning-800'
      case 'red':
        return 'bg-destructive-100 text-destructive-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleActionClick = (employeeId: number, action: string) => {
    const employee = mockTableData.find(emp => emp.id === employeeId)
    
    switch (action) {
      case 'edit':
        window.location.href = `/dashboard/add-employee?edit=${employeeId}`
        break
      case 'view':
        window.location.href = `/team/${employeeId}`
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
      role: 'all',
      complianceScore: 'all',
      dateRange: 'all'
    })
  }

  const filteredData = mockTableData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         employee.role.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || employee.status.toLowerCase() === filters.status
    const matchesRole = filters.role === 'all' || employee.role.toLowerCase() === filters.role
    const matchesCompliance = filters.complianceScore === 'all' || 
                             (filters.complianceScore === 'high' && employee.complianceScore >= 90) ||
                             (filters.complianceScore === 'medium' && employee.complianceScore >= 70 && employee.complianceScore < 90) ||
                             (filters.complianceScore === 'low' && employee.complianceScore < 70)
    
    return matchesSearch && matchesStatus && matchesRole && matchesCompliance
  })

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '')

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome back, {user?.email?.split('@')[0] || 'User'}
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
              {isMockMode && (
                <div className="flex items-center mt-4">
                  <span className="px-2 py-1 bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200 text-xs rounded-full">
                    Mock Mode
                  </span>
                </div>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Signed Documents</CardTitle>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,420</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    <span className="text-sm text-success-600">+40%</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-success-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents Sent</CardTitle>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,210</div>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-destructive-500 mr-1" />
                    <span className="text-sm text-destructive-600">-10%</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-destructive-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employees</CardTitle>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">316</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    <span className="text-sm text-success-600">+20%</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="pending review">Pending Review</option>
                          <option value="needs update">Needs Update</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select
                          value={filters.role}
                          onChange={(e) => handleFilterChange('role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                        >
                          <option value="all">All Roles</option>
                          <option value="product designer">Product Designer</option>
                          <option value="product manager">Product Manager</option>
                          <option value="senior developer">Senior Developer</option>
                          <option value="ux designer">UX Designer</option>
                          <option value="marketing manager">Marketing Manager</option>
                          <option value="hr specialist">HR Specialist</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compliance Score</label>
                        <select
                          value={filters.complianceScore}
                          onChange={(e) => handleFilterChange('complianceScore', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                        >
                          <option value="all">All Scores</option>
                          <option value="high">High (90%+)</option>
                          <option value="medium">Medium (70-89%)</option>
                          <option value="low">Low (&lt;70%)</option>
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

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Documents</CardTitle>
                <CardDescription>
                  Manage and track your employee documents and compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Compliance Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Assigned</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                  {item.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-gray-100">{item.email}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full" 
                                  style={{ width: `${item.complianceScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{item.complianceScore}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {item.assigned.slice(0, 3).map((person, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800"
                                  >
                                    {person[0]}
                                  </div>
                                ))}
                              </div>
                              {item.assigned.length > 3 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  +{item.assigned.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.statusColor)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="relative">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedEmployee(selectedEmployee === item.id ? null : item.id)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              
                              {selectedEmployee === item.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleActionClick(item.id, 'edit')}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Employee
                                    </button>
                                    <button
                                      onClick={() => handleActionClick(item.id, 'view')}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Profile
                                    </button>
                                    <button
                                      onClick={() => handleActionClick(item.id, 'delete')}
                                      className="flex items-center w-full px-4 py-2 text-sm text-destructive-600 dark:text-destructive-400 hover:bg-destructive-50 dark:hover:bg-destructive-900"
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No employees found matching your filters</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {filteredData.length} of {mockTableData.length} results
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
      </DashboardLayout>
    </ProtectedRoute>
  )
} 