'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface APIKeyInputProps {
  onKeySet: (key: string) => void
  minimalDescription?: boolean
}

export function APIKeyInput({ onKeySet, minimalDescription }: APIKeyInputProps) {
  const [apiKey, setApiKey] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validationSuccess, setValidationSuccess] = useState(false)

  const validateAPIKey = async (key: string) => {
    setIsValidating(true)
    setValidationError(null)
    setValidationSuccess(false)

    try {
      // Test the API key with a simple request
      const response = await fetch('/api/incident-coach/test-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-api-key': key
        },
        body: JSON.stringify({ test: true })
      })

      if (response.ok) {
        setValidationSuccess(true)
        setTimeout(() => {
          onKeySet(key)
        }, 1000)
      } else {
        const errorData = await response.json()
        setValidationError(errorData.error || 'Invalid API key')
      }
    } catch (error) {
      setValidationError('Failed to validate API key. Please check your connection.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      validateAPIKey(apiKey.trim())
    }
  }

  const handleSkip = () => {
    onKeySet('demo')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Key className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">OpenAI API Key Required</CardTitle>
          {minimalDescription ? (
            <CardDescription>Ingresa tu OpenAI API key o continúa en modo demo</CardDescription>
          ) : (
            <CardDescription>
              Enter your OpenAI API key to use the AI-powered incident coach, or continue in demo mode
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={isVisible ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                  disabled={isValidating}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setIsVisible(!isVisible)}
                  disabled={isValidating}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              {validationSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>API key validated successfully! Redirecting...</AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-gray-500">
                Your API key is stored only in memory and never saved to disk
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!apiKey.trim() || isValidating}
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Validating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Use This API Key
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleSkip}
                disabled={isValidating}
              >
                Continue in Demo Mode
              </Button>
            </div>
            
            <div className="text-center pt-4 border-t">
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
              >
                Get your API key from OpenAI →
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
