'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { QA } from '@/lib/types/incident'
import { MessageSquare, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

interface FollowUpQAProps {
  questions: string[]
  onAnswer: (question: string, answer: string) => void
  qaHistory: QA[]
  currentQuestionIndex: number
  onQuestionIndexChange: (index: number) => void
  isDemoMode?: boolean
}

export function FollowUpQA({
  questions,
  onAnswer,
  qaHistory,
  currentQuestionIndex,
  onQuestionIndexChange,
  isDemoMode = false
}: FollowUpQAProps) {
  const [currentAnswer, setCurrentAnswer] = useState('')

  // Reset current answer when question changes
  const handleQuestionChange = (newIndex: number) => {
    setCurrentAnswer('')
    onQuestionIndexChange(newIndex)
  }

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      onAnswer(questions[currentQuestionIndex], currentAnswer.trim())
      setCurrentAnswer('')
      
      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        handleQuestionChange(currentQuestionIndex + 1)
      }
    }
  }

  const handleSkip = () => {
    onAnswer(questions[currentQuestionIndex], "I don't know or prefer not to answer")
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionChange(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionChange(currentQuestionIndex - 1)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <p className="text-lg font-medium text-gray-900 mt-2">All questions answered!</p>
        <p className="text-sm text-gray-600 mt-1">
          Ready to generate the final incident report
        </p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnsweredCurrent = qaHistory.some(qa => qa.question === currentQuestion)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <Badge variant="outline">
          {qaHistory.length} answered
        </Badge>
      </div>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {currentQuestion}
            </Label>
            
            {hasAnsweredCurrent ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✓ Answered</p>
                <p className="text-green-700 text-sm mt-1">
                  {qaHistory.find(qa => qa.question === currentQuestion)?.answer}
                </p>
              </div>
            ) : (
              <Textarea
                placeholder="Provide a detailed answer..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                rows={4}
              />
            )}

            <div className="flex gap-3 pt-2">
              {!isFirstQuestion && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {!hasAnsweredCurrent && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="flex-1"
                  >
                    {isLastQuestion ? 'Finish' : 'Next'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
              
              {hasAnsweredCurrent && !isLastQuestion && (
                <Button
                  onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                  className="flex-1 ml-auto"
                >
                  Next Question
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              )}
              
              {/* In demo mode, show Generate Report button when on last question */}
              {isDemoMode && isLastQuestion && hasAnsweredCurrent && (
                <Button
                  onClick={() => onAnswer('', '')}
                  className="flex-1 ml-auto"
                >
                  Generate Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer History */}
      {qaHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Previous Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qaHistory.map((qa, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium text-gray-900">{qa.question}</p>
                  <p className="text-sm text-gray-700 mt-1">{qa.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
