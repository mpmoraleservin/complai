'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { 
  Shield, 
  Users, 
  User,
  FileText, 
  AlertCircle, 
  Scale, 
  CheckCircle, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Zap,
  Building,
  Target,
  Award,
  Clock,
  Globe,
  Lock
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Compliance Monitoring',
      description: 'Automated legal compliance checking with real-time updates and intelligent risk assessment.',
      details: [
        'Real-time compliance score tracking (87% with trends)',
        'Automated handbook compliance checking',
        'Risk assessment and recommendations',
        'Compliance history and audit trails'
      ]
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Comprehensive employee management with handbook status tracking and role-based access.',
      details: [
        'Employee profile management with roles and departments',
        'Handbook acknowledgment tracking (Acknowledged/Pending)',
        'Bulk employee operations and filtering',
        'Employee search and pagination',
        'Individual employee profile views and editing'
      ]
    },
    {
      icon: BookOpen,
      title: 'Smart Handbook Generation',
      description: 'Generate employee handbooks tailored to your company with state-specific legal requirements.',
      details: [
        'Multi-step handbook creation wizard (9 questions)',
        'State-specific legal compliance validation',
        'Customizable handbook sections and policies',
        'Real-time compliance checking',
        'Handbook version control and restoration'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Incident Management',
      description: 'AI-powered incident logging and analysis with risk assessment and recommended actions.',
      details: [
        'Incident logging with employee selection',
        'AI-powered risk assessment (High/Medium/Low)',
        'Automated action recommendations',
        'Incident status management (Resolved/In Progress/Under Investigation)',
        'Incident history with pagination and filtering',
        'Email drafting and report generation'
      ]
    },
    {
      icon: Scale,
      title: 'Legal Updates Tracking',
      description: 'Stay informed about employment law changes with automated alerts and compliance deadlines.',
      details: [
        'Real-time legal updates with priority levels',
        'Actions required vs completed tracking',
        'Advanced filtering by date, impact, and category',
        'Compliance deadline tracking',
        'Legal update history with search functionality',
        'Automated alerts for new regulations'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Document Management',
      description: 'Comprehensive document handling with preview, download, and sharing capabilities.',
      details: [
        'Handbook preview and download functionality',
        'Document sharing via email',
        'Version control and history tracking',
        'Compliance status monitoring',
        'Document acknowledgment tracking'
      ]
    }
  ]

  const benefits = [
    {
      icon: Target,
      title: 'Reduce Legal Risk',
      description: 'Minimize exposure to lawsuits with AI-powered compliance monitoring and up-to-date legal requirements.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate manual compliance tasks and streamline handbook management processes.'
    },
    {
      icon: TrendingUp,
      title: 'Improve Efficiency',
      description: 'Centralized platform for all HR compliance needs with intelligent automation.'
    },
    {
      icon: Award,
      title: 'Stay Compliant',
      description: 'Always up-to-date with the latest employment laws and regulatory changes.'
    }
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Set Up Your Company',
      description: 'Configure your company profile, industry, and compliance requirements.'
    },
    {
      step: '02',
      title: 'Generate Handbook',
      description: 'Create employee handbooks using our 9-question wizard tailored to your state.'
    },
    {
      step: '03',
      title: 'Monitor Compliance',
      description: 'Track legal updates, manage incidents, and ensure ongoing compliance.'
    },
    {
      step: '04',
      title: 'Stay Protected',
      description: 'Receive alerts for compliance issues and take action before problems arise.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center justify-center relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <Logo size="xl" className="text-6xl" />
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8">
            AI-Powered Employment
            <span className="text-primary-600"> Compliance Platform</span>
          </h2>
          <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Streamline handbook management, legal compliance monitoring, and workforce administration 
            with our comprehensive labor compliance platform designed for modern businesses.
          </p>
          <div className="flex justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-4">
                View Prototype
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-gray-500">
              <span className="text-sm mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Compliance Challenge
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              U.S. labor laws are complex, constantly changing, and state-specific. 
              Small and mid-sized businesses often use outdated or non-compliant handbooks, 
              exposing them to lawsuits and legal risks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Risk</h3>
                <p className="text-gray-600">
                  Outdated contracts and non-compliance expose businesses to lawsuits, 
                  especially around meal breaks, overtime, and scheduling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Consuming</h3>
                <p className="text-gray-600">
                  Manual compliance monitoring and contract updates require significant 
                  time and resources that could be better spent on business growth.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complex Regulations</h3>
                <p className="text-gray-600">
                  State-specific laws and constantly changing regulations make it 
                  difficult to stay compliant without dedicated legal expertise.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The COMPLai Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive SaaS platform that helps businesses generate compliant handbooks, 
              audit existing policies, track regulatory changes, and manage workforce compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with COMPLai in four simple steps and transform your compliance management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose COMPLai?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of businesses that trust COMPLai to manage their compliance needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard Sections & Actions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the comprehensive dashboard with detailed functionality for each section.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dashboard Overview */}
            <Card className="border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 text-primary-600 mr-2" />
                  Dashboard Overview
                </CardTitle>
                <CardDescription>
                  Main dashboard with compliance metrics and team preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Compliance Score tracking (87% with trends)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Handbook Status monitoring (Compliant/Needs Review)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Flagged Issues tracking (pending acknowledgments)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">My Team preview with pagination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Quick action buttons (View Handbook, Incident Coach, Legal Updates)</span>
                </div>
              </CardContent>
            </Card>

            {/* My Team Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  My Team Management
                </CardTitle>
                <CardDescription>
                  Complete team management with employee profiles and handbook tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Employee table with search, filtering, and pagination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Handbook status tracking (Acknowledged/Pending)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Individual employee profile views and editing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Add new employee with comprehensive form</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Bulk operations and employee management</span>
                </div>
              </CardContent>
            </Card>

            {/* Handbook Section */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                  Handbook Management
                </CardTitle>
                <CardDescription>
                  Employee handbook creation, management, and compliance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Current handbook display with preview, download, and share</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Create new handbook with 9-question wizard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Handbook sections overview (Company Overview, Employment Policies)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Compliance status tracking (100% compliant)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Old handbooks table with version control and restoration</span>
                </div>
              </CardContent>
            </Card>

            {/* Incident Coach */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                  Incident Coach
                </CardTitle>
                <CardDescription>
                  AI-powered incident logging, analysis, and management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">New incident logging with employee selection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">AI-powered risk assessment (High/Medium/Low)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Automated action recommendations based on risk level</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Recent incidents table with pagination and filtering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Incident status management (Resolved/In Progress/Under Investigation)</span>
                </div>
              </CardContent>
            </Card>

            {/* Legal Updates */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 text-purple-600 mr-2" />
                  Legal Updates
                </CardTitle>
                <CardDescription>
                  Real-time legal compliance tracking and action management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Actions Required section with pagination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Legal updates history with advanced filtering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Search functionality for legal updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Priority-based update categorization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Mark as done functionality for completed actions</span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Management */}
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 text-indigo-600 mr-2" />
                  Profile Management
                </CardTitle>
                <CardDescription>
                  Personal and company information management with tabbed interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Personal information management (name, email, role, bio)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Company information management (name, industry, size)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Compliance contacts (officer, legal advisor)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Tabbed interface for organized information management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Edit and save functionality for all profile sections</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Compliance Management?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of businesses that trust COMPLai to keep them compliant and protected.
          </p>
          <div className="flex justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                View Prototype
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">COMPLai</span>
              </div>
              <p className="text-gray-400">
                AI-powered employment compliance platform for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Handbook Generation</li>
                <li>Compliance Monitoring</li>
                <li>Incident Management</li>
                <li>Legal Updates</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Support</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Blog</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 COMPLai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 