import { 
  ComprehensiveMultiStateCompany, 
  SmallSingleStateCompany, 
  HandbookApiResponse,
  HandbookTemplate 
} from './types'

const HANDBOOKS_API_BASE_URL = process.env.NEXT_PUBLIC_HANDBOOKS_API_URL || 'https://api.handbooks.com'

export class HandbooksApiService {
  private static async makeRequest(endpoint: string, data: any): Promise<HandbookApiResponse> {
    try {
      const response = await fetch(`${HANDBOOKS_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HANDBOOKS_API_KEY}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error calling Handbooks API:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static async createComprehensiveMultiStateHandbook(data: ComprehensiveMultiStateCompany): Promise<HandbookApiResponse> {
    return this.makeRequest('/handbooks/comprehensive-multi-state', data)
  }

  static async createSmallSingleStateHandbook(data: SmallSingleStateCompany): Promise<HandbookApiResponse> {
    return this.makeRequest('/handbooks/small-single-state', data)
  }

  static async createHandbook(template: HandbookTemplate, data: any): Promise<HandbookApiResponse> {
    switch (template) {
      case 'comprehensive-multi-state':
        return this.createComprehensiveMultiStateHandbook(data as ComprehensiveMultiStateCompany)
      case 'small-single-state':
        return this.createSmallSingleStateHandbook(data as SmallSingleStateCompany)
      default:
        throw new Error(`Unknown template: ${template}`)
    }
  }

  static async getHandbook(handbookId: string): Promise<HandbookApiResponse> {
    try {
      const response = await fetch(`${HANDBOOKS_API_BASE_URL}/handbooks/${handbookId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HANDBOOKS_API_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching handbook:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static async downloadHandbookPdf(handbookId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${HANDBOOKS_API_BASE_URL}/handbooks/${handbookId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HANDBOOKS_API_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error downloading handbook PDF:', error)
      return null
    }
  }
}

// Mock service for development/testing
export class MockHandbooksApiService {
  static async createHandbook(template: HandbookTemplate, data: any): Promise<HandbookApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock response
    const mockHandbookId = `handbook_${Date.now()}`
    const mockPdfUrl = `https://example.com/handbooks/${mockHandbookId}.pdf`
    
    return {
      success: true,
      data: {
        handbook_id: mockHandbookId,
        pdf_url: mockPdfUrl,
        content: `Mock handbook content for ${data.companyName}`
      }
    }
  }

  static async getHandbook(handbookId: string): Promise<HandbookApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      data: {
        handbook_id: handbookId,
        pdf_url: `https://example.com/handbooks/${handbookId}.pdf`,
        content: 'Mock handbook content for development purposes'
      }
    }
  }

  static async downloadHandbookPdf(handbookId: string): Promise<Blob | null> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create a mock PDF blob
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Mock Handbook PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`
    
    return new Blob([mockPdfContent], { type: 'application/pdf' })
  }
}

// Export the appropriate service based on environment
export const handbooksApiService = process.env.NODE_ENV === 'production' 
  ? HandbooksApiService 
  : MockHandbooksApiService
