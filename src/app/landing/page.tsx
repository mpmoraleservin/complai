'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { 
  Shield, 
  Users, 
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
      description: 'Automated legal compliance checking with real-time updates and intelligent risk assessment.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Comprehensive employee management with handbook status tracking and role-based access.'
    },
    {
      icon: FileText,
      title: 'Smart Contract Generation',
      description: 'Generate employment contracts tailored to each state and role with up-to-date legal requirements.'
    },
    {
      icon: AlertCircle,
      title: 'Incident Management',
      description: 'AI-powered incident logging and analysis with risk assessment and recommended actions.'
    },
    {
      icon: Scale,
      title: 'Legal Updates Tracking',
      description: 'Stay informed about employment law changes with automated alerts and compliance deadlines.'
    },
    {
      icon: CheckCircle,
      title: 'E-Signature Integration',
      description: 'Seamless document signing workflow with PandaDoc integration and status tracking.'
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
      description: 'Automate manual compliance tasks and streamline contract management processes.'
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
      title: 'Generate Contracts',
      description: 'Create employment contracts tailored to your state and role requirements.'
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
    <SimpleLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">COMPLai</h1>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                AI-Powered Employment
                <span className="text-primary-600"> Compliance Platform</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Streamline contract management, legal compliance monitoring, and workforce administration 
                with our comprehensive labor compliance platform designed for modern businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
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
                Small and mid-sized businesses often use outdated or non-compliant contracts, 
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
                A comprehensive SaaS platform that helps businesses generate compliant contracts, 
                audit existing agreements, track regulatory changes, and manage workforce compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
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

        {/* Key Features Detail */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage employment compliance in one platform.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Smart Contract Generation
                    </h3>
                    <p className="text-gray-600">
                      Generate employment contracts tailored to each state and role with 
                      real-time legal compliance checking and custom clause addition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      AI Legal Auditor
                    </h3>
                    <p className="text-gray-600">
                      Audit existing contracts with AI-powered clause extraction, 
                      semantic similarity search, and compliance rule engine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Incident Management
                    </h3>
                    <p className="text-gray-600">
                      Log workplace incidents with AI-powered risk assessment, 
                      recommended actions, and automated reporting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Legal Updates Tracking
                    </h3>
                    <p className="text-gray-600">
                      Stay informed about employment law changes with automated alerts, 
                      compliance deadlines, and impact assessments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      E-Signature Integration
                    </h3>
                    <p className="text-gray-600">
                      Seamless document signing with PandaDoc integration, 
                      signature status tracking, and completed document storage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Team Management
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive employee management with handbook status tracking, 
                      role-based access, and compliance monitoring.
                    </p>
                  </div>
                </div>
              </div>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Schedule Demo
              </Button>
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
                  <li>Contract Generation</li>
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
    </SimpleLayout>
  )
} 