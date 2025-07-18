'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, FileText, Shield, Users, DollarSign } from 'lucide-react'
import { useState } from 'react'

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: 'Monthly Compliance Report',
    type: 'compliance',
    status: 'completed',
    createdAt: '2024-07-18',
    period: 'July 2024',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'Contract Audit Summary',
    type: 'audit',
    status: 'completed',
    createdAt: '2024-07-17',
    period: 'Q2 2024',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Legal Risk Assessment',
    type: 'risk',
    status: 'in-progress',
    createdAt: '2024-07-16',
    period: 'June 2024',
    downloadUrl: '#'
  }
]

const mockMetrics = {
  totalContracts: 24,
  complianceRate: 96.5,
  avgAuditScore: 92.3,
  riskLevel: 'Low',
  monthlyGrowth: 12.5,
  pendingAudits: 3,
  completedAudits: 21,
  totalEmployees: 18
}

const mockChartData = [
  { month: 'Jan', contracts: 12, compliance: 89 },
  { month: 'Feb', contracts: 15, compliance: 91 },
  { month: 'Mar', contracts: 18, compliance: 93 },
  { month: 'Apr', contracts: 20, compliance: 94 },
  { month: 'May', contracts: 22, compliance: 95 },
  { month: 'Jun', contracts: 24, compliance: 96 }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance':
        return Shield
      case 'audit':
        return FileText
      case 'risk':
        return BarChart3
      default:
        return FileText
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="text-gray-600 mt-1">
                    Generate comprehensive reports and track compliance metrics
                  </p>
                </div>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Calendar className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                      <p className="text-2xl font-bold text-gray-900">{mockMetrics.totalContracts}</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{mockMetrics.monthlyGrowth}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{mockMetrics.complianceRate}%</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2.1%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Audit Score</p>
                      <p className="text-2xl font-bold text-gray-900">{mockMetrics.avgAuditScore}%</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +1.8%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900">{mockMetrics.totalEmployees}</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +3
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Charts Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Trends</CardTitle>
                    <CardDescription>
                      Monthly compliance rate and contract volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Period Selector */}
                      <div className="flex space-x-2">
                        {['7d', '30d', '90d', '1y'].map((period) => (
                          <Button
                            key={period}
                            variant={selectedPeriod === period ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedPeriod(period)}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>

                      {/* Chart Placeholder */}
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Analytics</h3>
                        <p className="text-gray-600 mb-4">
                          Interactive charts showing compliance trends over time
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">Contracts Growth</p>
                            <p className="text-green-600">+12.5% this month</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Compliance Rate</p>
                            <p className="text-green-600">96.5% average</p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Level */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-green-900">Overall Risk Level: Low</p>
                            <p className="text-sm text-green-700">
                              Your contracts are highly compliant with current regulations
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* State-wise Compliance */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>State-wise Compliance</CardTitle>
                    <CardDescription>
                      Compliance status across different states
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { state: 'California', contracts: 8, compliance: 98, status: 'excellent' },
                        { state: 'New York', contracts: 6, compliance: 95, status: 'good' },
                        { state: 'Texas', contracts: 4, compliance: 92, status: 'good' },
                        { state: 'Florida', contracts: 3, compliance: 89, status: 'warning' },
                        { state: 'Illinois', contracts: 3, compliance: 94, status: 'good' }
                      ].map((item) => (
                        <div key={item.state} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.state}</p>
                            <p className="text-sm text-gray-500">{item.contracts} contracts</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{item.compliance}%</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'excellent' ? 'bg-green-100 text-green-800' :
                              item.status === 'good' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reports List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>
                      Download and manage your reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReports.map((report) => {
                        const IconComponent = getTypeIcon(report.type)
                        return (
                          <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 text-gray-400 mr-2" />
                                <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span>{report.period}</span>
                              <span>{report.createdAt}</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="w-3 h-3 mr-2" />
                              Download
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export All Contracts
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Compliance Summary
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Risk Assessment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 