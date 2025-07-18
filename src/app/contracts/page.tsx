'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'
import { useState } from 'react'

// Mock data for contracts
const mockContracts = [
  {
    id: 1,
    title: 'Software Engineer - Full Time',
    employee: 'John Smith',
    status: 'draft',
    createdAt: '2024-07-15',
    lastModified: '2024-07-18',
    state: 'California',
    compliance: 'pending'
  },
  {
    id: 2,
    title: 'Marketing Manager - Part Time',
    employee: 'Sarah Johnson',
    status: 'pending',
    createdAt: '2024-07-10',
    lastModified: '2024-07-17',
    state: 'New York',
    compliance: 'compliant'
  },
  {
    id: 3,
    title: 'Sales Representative - Contract',
    employee: 'Mike Davis',
    status: 'signed',
    createdAt: '2024-07-05',
    lastModified: '2024-07-12',
    state: 'Texas',
    compliance: 'compliant'
  },
  {
    id: 4,
    title: 'Product Designer - Full Time',
    employee: 'Emily Wilson',
    status: 'expired',
    createdAt: '2024-06-20',
    lastModified: '2024-07-01',
    state: 'California',
    compliance: 'non-compliant'
  }
]

const statusConfig = {
  draft: { label: 'Draft', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' },
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  signed: { label: 'Signed', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  expired: { label: 'Expired', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' }
}

const complianceConfig = {
  compliant: { label: 'Compliant', color: 'text-green-600', bg: 'bg-green-100' },
  'non-compliant': { label: 'Non-Compliant', color: 'text-red-600', bg: 'bg-red-100' },
  pending: { label: 'Pending Review', color: 'text-yellow-600', bg: 'bg-yellow-100' }
}

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.employee.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your employment contracts and track compliance status
                  </p>
                </div>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Contract
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                      <p className="text-2xl font-bold text-gray-900">{mockContracts.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockContracts.filter(c => c.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Signed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockContracts.filter(c => c.status === 'signed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expired</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockContracts.filter(c => c.status === 'expired').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="signed">Signed</option>
                      <option value="expired">Expired</option>
                    </select>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contracts Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Contracts</CardTitle>
                <CardDescription>
                  View and manage all your employment contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Contract</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">State</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Modified</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((contract) => {
                        const status = statusConfig[contract.status as keyof typeof statusConfig]
                        const compliance = complianceConfig[contract.compliance as keyof typeof complianceConfig]
                        
                        return (
                          <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{contract.title}</p>
                                <p className="text-sm text-gray-500">Created {contract.createdAt}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{contract.employee}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                <status.icon className="w-3 h-3 mr-1" />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{contract.state}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${compliance.bg} ${compliance.color}`}>
                                {compliance.label}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{contract.lastModified}</p>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {filteredContracts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contracts found</p>
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Contract
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 