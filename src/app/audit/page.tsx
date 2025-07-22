'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Shield, Upload, CheckCircle, AlertTriangle, Clock, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { useState } from 'react'

// Mock audit data
const mockAudits = [
  {
    id: 1,
    contractTitle: 'Software Engineer - Full Time',
    status: 'completed',
    complianceScore: 95,
    issues: 2,
    createdAt: '2024-07-18',
    completedAt: '2024-07-18',
    state: 'California'
  },
  {
    id: 2,
    contractTitle: 'Marketing Manager - Part Time',
    status: 'in-progress',
    complianceScore: null,
    issues: null,
    createdAt: '2024-07-17',
    completedAt: null,
    state: 'New York'
  },
  {
    id: 3,
    contractTitle: 'Sales Representative - Contract',
    status: 'completed',
    complianceScore: 88,
    issues: 4,
    createdAt: '2024-07-16',
    completedAt: '2024-07-16',
    state: 'Texas'
  }
]

const mockIssues = [
  {
    id: 1,
    severity: 'high',
    title: 'Missing Overtime Pay Clause',
    description: 'California law requires specific overtime pay provisions for non-exempt employees.',
    recommendation: 'Add overtime pay clause with California-specific requirements.',
    section: 'Compensation'
  },
  {
    id: 2,
    severity: 'medium',
    title: 'Incomplete Break Time Provisions',
    description: 'Break time requirements are not fully compliant with state regulations.',
    recommendation: 'Update break time section to include all required provisions.',
    section: 'Work Schedule'
  },
  {
    id: 3,
    severity: 'low',
    title: 'Missing Anti-Discrimination Language',
    description: 'Contract should include comprehensive anti-discrimination provisions.',
    recommendation: 'Add anti-discrimination clause with protected characteristics.',
    section: 'Equal Opportunity'
  }
]

const statusConfig = {
  'in-progress': { label: 'In Progress', icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100' }
}

const severityConfig = {
  high: { label: 'High', color: 'text-destructive-600', bg: 'bg-destructive-100' },
  medium: { label: 'Medium', color: 'text-warning-600', bg: 'bg-warning-100' },
  low: { label: 'Low', color: 'text-info-600', bg: 'bg-info-100' }
}

export default function AuditPage() {
  const [selectedAudit, setSelectedAudit] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      // In a real app, this would trigger the audit process
    }, 2000)
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-success-600'
    if (score >= 70) return 'text-warning-600'
    return 'text-destructive-600'
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
                  <h1 className="text-3xl font-bold text-gray-900">AI Contract Audit</h1>
                  <p className="text-gray-600 mt-1">
                    AI-powered compliance checking for employment documents
                  </p>
                </div>
                <Button className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Contract
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-info-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Audits</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAudits.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockAudits.filter(a => a.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-warning-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockAudits.filter(a => a.status === 'in-progress').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                      <p className="text-2xl font-bold text-gray-900">92%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Contract
                    </CardTitle>
                    <CardDescription>
                      Upload a contract for AI-powered compliance audit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop your contract here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports PDF, DOC, DOCX (max 10MB)
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handleFileUpload} 
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Start Audit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Audits */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Audits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockAudits.map((audit) => {
                        const status = statusConfig[audit.status as keyof typeof statusConfig]
                        return (
                          <div 
                            key={audit.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedAudit === audit.id 
                                ? 'border-primary-300 bg-primary-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedAudit(audit.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {audit.contractTitle}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                <status.icon className="w-3 h-3 mr-1" />
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{audit.state}</span>
                              <span>{audit.createdAt}</span>
                            </div>
                            {audit.complianceScore && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Compliance Score</span>
                                  <span className={`font-medium ${getComplianceColor(audit.complianceScore)}`}>
                                    {audit.complianceScore}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className={`h-1.5 rounded-full ${getComplianceColor(audit.complianceScore).replace('text-', 'bg-')}`}
                                    style={{ width: `${audit.complianceScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Audit Results */}
              <div className="lg:col-span-2">
                {selectedAudit ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit Results</CardTitle>
                      <CardDescription>
                        Detailed compliance analysis and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Compliance Score */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">Overall Compliance Score</h3>
                            <span className="text-2xl font-bold text-success-600">95%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-success-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            This contract is highly compliant with California employment laws.
                          </p>
                        </div>

                        {/* Issues Found */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Issues Found (2)</h3>
                          <div className="space-y-3">
                            {mockIssues.map((issue) => {
                              const severity = severityConfig[issue.severity as keyof typeof severityConfig]
                              return (
                                <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severity.bg} ${severity.color} mr-3`}>
                                        {severity.label}
                                      </span>
                                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                                    </div>
                                    <span className="text-xs text-gray-500">{issue.section}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                                  <div className="bg-info-50 border border-info-200 rounded p-3">
                                    <p className="text-sm font-medium text-info-900 mb-1">Recommendation:</p>
                                    <p className="text-sm text-info-800">{issue.recommendation}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <Button variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            View Full Report
                          </Button>
                          <Button>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Apply Fixes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Audit</h3>
                      <p className="text-gray-600">
                        Choose an audit from the list to view detailed results and recommendations.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 