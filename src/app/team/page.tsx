'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Users, Plus, Mail, Shield, UserCheck, UserX, Crown, Settings, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2024-07-18',
    avatar: 'JS',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'hr_manager',
    status: 'active',
    lastActive: '2024-07-17',
    avatar: 'SJ',
    permissions: ['contracts', 'audit', 'reports']
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'employee',
    status: 'active',
    lastActive: '2024-07-16',
    avatar: 'MD',
    permissions: ['view_contracts']
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.wilson@company.com',
    role: 'hr_manager',
    status: 'pending',
    lastActive: null,
    avatar: 'EW',
    permissions: ['contracts', 'audit']
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'employee',
    status: 'inactive',
    lastActive: '2024-07-10',
    avatar: 'DB',
    permissions: ['view_contracts']
  }
]

const roleConfig = {
  admin: { 
    label: 'Admin', 
    icon: Crown, 
    color: 'text-purple-600', 
    bg: 'bg-purple-100',
    description: 'Full access to all features and settings'
  },
  hr_manager: { 
    label: 'HR Manager', 
    icon: Shield, 
    color: 'text-blue-600', 
    bg: 'bg-blue-100',
    description: 'Can manage contracts, audits, and reports'
  },
  employee: { 
    label: 'Employee', 
    icon: Users, 
    color: 'text-gray-600', 
    bg: 'bg-gray-100',
    description: 'Can view assigned contracts only'
  }
}

const statusConfig = {
  active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-100' },
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  inactive: { label: 'Inactive', color: 'text-red-600', bg: 'bg-red-100' }
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const activeMembers = mockTeamMembers.filter(member => member.status === 'active')
  const pendingInvites = mockTeamMembers.filter(member => member.status === 'pending')

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                  <p className="text-gray-600 mt-1">
                    Manage team members, roles, and permissions
                  </p>
                </div>
                <Button onClick={() => setShowInviteModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900">{mockTeamMembers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <UserCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-gray-900">{activeMembers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingInvites.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Admins</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockTeamMembers.filter(m => m.role === 'admin').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Members List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your team members and their roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTeamMembers.map((member) => {
                        const role = roleConfig[member.role as keyof typeof roleConfig]
                        const status = statusConfig[member.status as keyof typeof statusConfig]
                        
                        return (
                          <div 
                            key={member.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedMember === member.id 
                                ? 'border-purple-300 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedMember(member.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">{member.avatar}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.bg} ${role.color}`}>
                                  <role.icon className="w-3 h-3 mr-1" />
                                  {role.label}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {member.lastActive && (
                              <p className="text-xs text-gray-500 mt-2">
                                Last active: {member.lastActive}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Member Details & Actions */}
              <div className="lg:col-span-1">
                {selectedMember ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Member Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const member = mockTeamMembers.find(m => m.id === selectedMember)
                        if (!member) return null
                        
                        const role = roleConfig[member.role as keyof typeof roleConfig]
                        const status = statusConfig[member.status as keyof typeof statusConfig]
                        
                        return (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-medium text-gray-700">{member.avatar}</span>
                              </div>
                              <h3 className="font-medium text-gray-900">{member.name}</h3>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Role</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.bg} ${role.color}`}>
                                  <role.icon className="w-3 h-3 mr-1" />
                                  {role.label}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              
                              {member.lastActive && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-1">Last Active</p>
                                  <p className="text-sm text-gray-600">{member.lastActive}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200">
                              <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Edit Permissions
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                                {member.status === 'pending' && (
                                  <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Resend Invite
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                                  <UserX className="w-4 h-4 mr-2" />
                                  Remove Member
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Member</h3>
                      <p className="text-gray-600">
                        Choose a team member to view details and manage permissions.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Role Permissions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>
                      Overview of what each role can do
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(roleConfig).map(([key, role]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <role.icon className={`w-4 h-4 mr-2 ${role.color}`} />
                            <span className="font-medium text-gray-900">{role.label}</span>
                          </div>
                          <p className="text-xs text-gray-600">{role.description}</p>
                        </div>
                      ))}
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