'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface Quiz {
  id: string
  moduleId: string
  questions: Question[]
}

interface QuizAttempt {
  id: string
  score: number
  status: string
  answers: Record<string, number>
}

export default function QuizPage({ params }: { params: { moduleId: string } }) {
  const { data: session } = useSession()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quiz/${params.moduleId}`)
        const data = await response.json()
        setQuiz(data.quiz)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        toast.error('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.moduleId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz()
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, quizCompleted])

  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(1800) // Reset timer
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: selectedAnswers,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setQuizCompleted(true)
        toast.success(`Quiz completed! Score: ${result.score}%`)
      } else {
        toast.error('Failed to submit quiz')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const calculateScore = () => {
    if (!quiz) return 0
    
    let correct = 0
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h1>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (quizCompleted) {
    const score = calculateScore()
    const passed = score >= 80

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                {passed ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {passed ? 'Congratulations!' : 'Quiz Completed'}
              </CardTitle>
              <CardDescription>
                {passed 
                  ? 'You passed the quiz! You can now proceed to the next module.'
                  : 'You need to score 80% or higher to pass. You can retake the quiz.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {quiz.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of {quiz.questions.length} correct
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {!passed && (
                  <Button onClick={() => {
                    setQuizCompleted(false)
                    setQuizStarted(false)
                    setCurrentQuestionIndex(0)
                    setSelectedAnswers({})
                    setTimeLeft(1800)
                  }}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                )}
                <Link href="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Module Quiz</h1>
            {quizStarted && (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span className="text-lg font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
          
          {!quizStarted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
                <p className="text-gray-600 mb-6">
                  This quiz contains {quiz.questions.length} questions. You have 30 minutes to complete it.
                  You need to score 80% or higher to pass and unlock the next module.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>30 minutes time limit</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>80% passing score required</span>
                  </div>
                </div>
                <Button size="lg" className="mt-6" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion.id] === index
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={selectedAnswers[currentQuestion.id] === index}
                        onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === index
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion.id] === index && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
