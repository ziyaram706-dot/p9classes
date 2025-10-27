'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Play, 
  Users, 
  Clock, 
  GraduationCap,
  Star,
  CheckCircle,
  Calendar,
  BookOpen,
  Award,
  Phone,
  Mail,
  User,
  Home,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  type: 'SELF_PACED' | 'LIVE'
  price: number
  discountedPrice?: number
  features: string[]
  imageUrl?: string
  tutor?: {
    name: string
  }
  batchStartDate?: string
  batchEndDate?: string
  seatsLeft?: number
  totalSeats?: number
  courseHours?: number
  modules?: {
    id: string
    title: string
    description?: string
    order: number
  }[]
}

interface EnrollmentForm {
  name: string
  email: string
  phone: string
  preferredContact: 'phone' | 'email' | 'whatsapp'
  message?: string
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm>({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone',
    message: '',
  })

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        const data = await response.json()
        setCourse(data.course)
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  // Auto-fill user data when opening enrollment form
  useEffect(() => {
    if (showEnrollmentForm && session?.user) {
      setEnrollmentForm(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }
  }, [showEnrollmentForm, session])

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnrollmentLoading(true)

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: params.id,
          ...enrollmentForm,
        }),
      })

      if (response.ok) {
        toast.success('Enrollment request submitted! Admin will contact you shortly.')
        setShowEnrollmentForm(false)
        setEnrollmentForm({
          name: '',
          email: '',
          phone: '',
          preferredContact: 'phone',
          message: '',
        })
      } else {
        const error = await response.json()
        console.error('Enrollment error:', error)
        
        // Show specific validation errors if available
        if (error.details && Array.isArray(error.details)) {
          error.details.forEach((detail: string) => {
            toast.error(detail)
          })
        } else {
          toast.error(error.message || 'Failed to submit enrollment request')
        }
      }
    } catch (error) {
      console.error('Enrollment submission error:', error)
      toast.error('An error occurred')
    } finally {
      setEnrollmentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="flex items-center hover:text-gray-700">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/courses" className="hover:text-gray-700">Courses</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant={course.type === 'LIVE' ? 'default' : 'secondary'} className="bg-red-500 text-white">
                  {course.type === 'LIVE' ? 'Live Course' : 'Self-Paced'}
                </Badge>
                {course.discountedPrice && (
                  <Badge variant="destructive" className="bg-green-500 text-white">
                    Save ₹{course.price - course.discountedPrice}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                {course.type === 'LIVE' && course.tutor && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Tutor: {course.tutor.name}
                  </div>
                )}
                
                {course.seatsLeft !== undefined && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.seatsLeft} seats left
                  </div>
                )}
                
                {course.courseHours && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.courseHours} hours
                  </div>
                )}
                
                {course.modules && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.modules.length} modules
                  </div>
                )}
              </div>
            </div>

            {/* Course Image/Video */}
            <div className="mb-8">
              {course.imageUrl ? (
                <div className="h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 md:h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <Play className="h-16 w-16 text-primary-600" />
                </div>
              )}
            </div>

            {/* Course Features */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-gray-900">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Modules (for self-paced courses) */}
            {course.type === 'SELF_PACED' && course.modules && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.modules.length} modules covering all essential topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            {module.description && (
                              <p className="text-sm text-gray-600">{module.description}</p>
                            )}
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Course Schedule */}
            {course.type === 'LIVE' && course.batchStartDate && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Batch Start Date:</span>
                      <span className="font-semibold">
                        {new Date(course.batchStartDate).toLocaleDateString()}
                      </span>
                    </div>
                    {course.batchEndDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Batch End Date:</span>
                        <span className="font-semibold">
                          {new Date(course.batchEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Seats:</span>
                      <span className="font-semibold">{course.totalSeats}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Seats Available:</span>
                      <span className="font-semibold text-green-600">{course.seatsLeft}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-gray-900">Enroll Now</CardTitle>
                <CardDescription>
                  Start your learning journey today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-primary-600">
                      ₹{course.discountedPrice || course.price}
                    </span>
                    {course.discountedPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                  {course.discountedPrice && (
                    <p className="text-sm text-green-600 font-semibold">
                      You save ₹{course.price - course.discountedPrice}
                    </p>
                  )}
                </div>

                {/* Enrollment Button */}
                {session ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    size="lg"
                    onClick={() => setShowEnrollmentForm(true)}
                  >
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Enroll Now
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/signin" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                        Sign In to Enroll
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-600 text-center">
                      Don't have an account?{' '}
                      <Link href="/auth/signup" className="text-primary-600 hover:text-primary-500">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                )}

                {/* Course Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    Certificate of Completion
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Lifetime Access
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    24/7 Support
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-gray-900">Enroll in {course.title}</CardTitle>
              <CardDescription>
                Fill out the form below and our admin will contact you for payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={enrollmentForm.name}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={enrollmentForm.email}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={enrollmentForm.phone}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, phone: e.target.value })}
                  required
                  placeholder="Enter your phone number"
                />
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Preferred Contact Method</label>
                  <div className="relative">
                    <select
                      value={enrollmentForm.preferredContact}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, preferredContact: e.target.value as any })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="phone" className="text-gray-900 bg-white">Phone Call</option>
                      <option value="email" className="text-gray-900 bg-white">Email</option>
                      <option value="whatsapp" className="text-gray-900 bg-white">WhatsApp</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <Textarea
                  label="Message (Optional)"
                  value={enrollmentForm.message}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, message: e.target.value })}
                  placeholder="Any specific questions or requirements?"
                  rows={3}
                />
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEnrollmentForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={enrollmentLoading}
                  >
                    {enrollmentLoading ? 'Submitting...' : 'Submit Enrollment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
