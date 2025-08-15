import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-openai-api-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      )
    }

    // Test the API key with a simple request
    try {
      const openai = new OpenAI(apiKey)
      const response = await openai.chatCompletion({
        systemPrompt: 'You are a test assistant. Respond with "API key is valid" if you receive this message.',
        userPrompt: 'Test message',
        responseFormat: 'text',
        temperature: 0
      })

      if (response.content && response.content.includes('valid')) {
        return NextResponse.json({ 
          success: true, 
          message: 'API key validated successfully' 
        })
      } else {
        return NextResponse.json({ 
          error: 'Invalid API key response' 
        }, { status: 400 })
      }
    } catch (error) {
      console.error('OpenAI API test failed:', error)
      return NextResponse.json({ 
        error: 'Invalid API key or API error' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Error testing API key:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
