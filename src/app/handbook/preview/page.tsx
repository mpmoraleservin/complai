'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ChevronLeft, Download, Printer, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HandbookPreviewPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)

  const handbookSections = [
    {
      title: "Company Overview",
      content: `
        <h2>Welcome to Our Company</h2>
        <p>We are committed to creating a positive and productive work environment where every employee can thrive and contribute to our shared success.</p>
        
        <h3>Our Mission</h3>
        <p>To provide exceptional value to our customers while maintaining the highest standards of integrity, innovation, and employee satisfaction.</p>
        
        <h3>Our Values</h3>
        <ul>
          <li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
          <li><strong>Excellence:</strong> We strive for the highest quality in everything we do</li>
          <li><strong>Collaboration:</strong> We work together to achieve common goals</li>
          <li><strong>Innovation:</strong> We embrace new ideas and continuous improvement</li>
          <li><strong>Respect:</strong> We treat everyone with dignity and respect</li>
        </ul>
      `
    },
    {
      title: "Employment Policies",
      content: `
        <h2>Employment Policies</h2>
        <p>This section outlines the fundamental policies that govern employment at our company.</p>
        
        <h3>Equal Employment Opportunity</h3>
        <p>We are committed to providing equal employment opportunities to all individuals regardless of race, color, religion, sex, national origin, age, disability, or genetic information.</p>
        
        <h3>At-Will Employment</h3>
        <p>Employment with our company is at-will, meaning either the employee or the company may terminate the employment relationship at any time, with or without cause or notice.</p>
        
        <h3>Work Schedule</h3>
        <p>Standard work hours are Monday through Friday, 9:00 AM to 5:00 PM, with a one-hour lunch break. Flexible scheduling may be available based on business needs and manager approval.</p>
      `
    },
    {
      title: "Workplace Conduct",
      content: `
        <h2>Workplace Conduct</h2>
        <p>We expect all employees to maintain professional behavior and treat each other with respect and dignity.</p>
        
        <h3>Code of Conduct</h3>
        <ul>
          <li>Treat all colleagues, customers, and vendors with respect</li>
          <li>Maintain confidentiality of company and customer information</li>
          <li>Use company resources responsibly and for business purposes only</li>
          <li>Report any violations of company policies or unethical behavior</li>
          <li>Maintain a safe and harassment-free work environment</li>
        </ul>
        
        <h3>Dress Code</h3>
        <p>Employees are expected to dress in a manner that is appropriate for their position and maintains a professional appearance. Business casual attire is generally acceptable.</p>
        
        <h3>Use of Technology</h3>
        <p>Company computers, phones, and internet access are provided for business use. Limited personal use is permitted during breaks and lunch hours.</p>
      `
    },
    {
      title: "Compensation & Benefits",
      content: `
        <h2>Compensation & Benefits</h2>
        <p>We offer competitive compensation and comprehensive benefits to support our employees' well-being and financial security.</p>
        
        <h3>Salary and Pay</h3>
        <p>Employees are paid on a bi-weekly basis. Salaries are reviewed annually and may be adjusted based on performance, market conditions, and company financial performance.</p>
        
        <h3>Health Benefits</h3>
        <ul>
          <li>Medical, dental, and vision insurance</li>
          <li>Health savings account (HSA) with company contribution</li>
          <li>Flexible spending accounts (FSA)</li>
          <li>Life insurance and disability coverage</li>
        </ul>
        
        <h3>Retirement Benefits</h3>
        <p>We offer a 401(k) retirement plan with company matching contributions up to 4% of your salary.</p>
        
        <h3>Additional Benefits</h3>
        <ul>
          <li>Professional development and training opportunities</li>
          <li>Employee assistance program (EAP)</li>
          <li>Commuter benefits</li>
          <li>Employee discounts and perks</li>
        </ul>
      `
    },
    {
      title: "Time Off & Leave",
      content: `
        <h2>Time Off & Leave</h2>
        <p>We understand the importance of work-life balance and provide various types of leave to support our employees.</p>
        
        <h3>Paid Time Off (PTO)</h3>
        <p>Full-time employees accrue PTO based on years of service:</p>
        <ul>
          <li>0-2 years: 15 days per year</li>
          <li>3-5 years: 20 days per year</li>
          <li>6+ years: 25 days per year</li>
        </ul>
        
        <h3>Holidays</h3>
        <p>We observe the following paid holidays:</p>
        <ul>
          <li>New Year's Day</li>
          <li>Memorial Day</li>
          <li>Independence Day</li>
          <li>Labor Day</li>
          <li>Thanksgiving Day and the day after</li>
          <li>Christmas Day</li>
        </ul>
        
        <h3>Family and Medical Leave</h3>
        <p>Eligible employees may take up to 12 weeks of unpaid leave per year for qualifying family and medical reasons under the Family and Medical Leave Act (FMLA).</p>
        
        <h3>Bereavement Leave</h3>
        <p>Employees may take up to 3 days of paid bereavement leave for the death of an immediate family member.</p>
      `
    },
    {
      title: "Health & Safety",
      content: `
        <h2>Health & Safety</h2>
        <p>The safety and well-being of our employees is our top priority. We are committed to maintaining a safe and healthy work environment.</p>
        
        <h3>Workplace Safety</h3>
        <ul>
          <li>Regular safety training and updates</li>
          <li>Proper use of personal protective equipment (PPE)</li>
          <li>Reporting of safety hazards and incidents</li>
          <li>Emergency evacuation procedures</li>
          <li>First aid and medical assistance</li>
        </ul>
        
        <h3>Ergonomics</h3>
        <p>We provide ergonomic workstations and equipment to prevent workplace injuries. Employees are encouraged to take regular breaks and report any discomfort.</p>
        
        <h3>Emergency Procedures</h3>
        <p>In case of emergency:</p>
        <ol>
          <li>Call 911 if immediate medical attention is needed</li>
          <li>Notify your supervisor or HR immediately</li>
          <li>Follow evacuation procedures if required</li>
          <li>Document the incident for workers' compensation purposes</li>
        </ol>
        
        <h3>Drug and Alcohol Policy</h3>
        <p>We maintain a drug-free workplace. The use, possession, or distribution of illegal drugs or alcohol on company premises is strictly prohibited.</p>
      `
    }
  ]

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Simulate PDF download
    const blob = new Blob(['Mock handbook PDF content'], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Employee_Handbook_v2.1.pdf'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const nextSection = () => {
    if (currentSection < handbookSections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="hover:text-primary-600 transition-colors"
              >
                Dashboard
              </button>
              <span>/</span>
              <button 
                onClick={() => router.push('/handbook')}
                className="hover:text-primary-600 transition-colors"
              >
                Handbook
              </button>
              <span>/</span>
              <span className="text-gray-900">Preview</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/handbook')}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Handbook
                </Button>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                  <h1 className="text-xl font-bold text-gray-900">Employee Handbook v2.1</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Section Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Previous Section
              </Button>
              <div className="text-sm text-gray-600">
                Section {currentSection + 1} of {handbookSections.length}
              </div>
              <Button
                variant="outline"
                onClick={nextSection}
                disabled={currentSection === handbookSections.length - 1}
              >
                Next Section
                <ArrowDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Section Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary-600">
                {handbookSections[currentSection].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: handbookSections[currentSection].content }}
              />
            </CardContent>
          </Card>

          {/* Section Navigation Bottom */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Previous Section
            </Button>
            <div className="text-sm text-gray-600">
              Section {currentSection + 1} of {handbookSections.length}
            </div>
            <Button
              variant="outline"
              onClick={nextSection}
              disabled={currentSection === handbookSections.length - 1}
            >
              Next Section
              <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
  )
} 