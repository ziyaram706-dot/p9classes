'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Award, 
  Clock, 
  Users, 
  Bell, 
  Menu, 
  X,
  Play,
  Download,
  Settings,
  GraduationCap,
  Calendar,
  CheckCircle,
  Lock,
  AlertCircle,
  FileText,
  Eye,
  File,
  Video,
  Link as LinkIcon,
  Home,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  progress: number
  status: string
  tutor?: {
    name: string
  }
  materials?: any[]
  schedules?: any[]
}

interface Certificate {
  id: string
  certificateId: string
  courseId: string
  course: {
    title: string
  }
  type: string
  issuedAt: string
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeCourses, setActiveCourses] = useState<Course[]>([])
  const [pendingCourses, setPendingCourses] = useState<Course[]>([])
  const [completedCourses, setCompletedCourses] = useState<Course[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    studyTime: 0,
    certificatesEarned: 0
  })
  const [showMaterialsModal, setShowMaterialsModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const getCourseTitle = (course: Partial<Course> | any): string => {
    return course?.title || course?.name || 'Untitled Course'
  }

  // Countdown timer component
  const CountdownTimer = ({ targetTime, classEndTime }: { targetTime: Date, classEndTime?: Date }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [isOngoing, setIsOngoing] = useState<boolean>(false)

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date()
        const diff = targetTime.getTime() - now.getTime()
        const minutes = Math.floor(diff / (1000 * 60))
        
        // Check if class is ongoing
        const ongoing = classEndTime ? now.getTime() >= targetTime.getTime() && now.getTime() <= classEndTime.getTime() : false
        setIsOngoing(ongoing)
        
        if (ongoing && classEndTime) {
          // Show time remaining in class
          const endDiff = classEndTime.getTime() - now.getTime()
          setTimeLeft(Math.max(0, Math.floor(endDiff / (1000 * 60))))
        } else {
          // Show time until class starts
          setTimeLeft(Math.max(0, minutes))
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }, [targetTime, classEndTime])

    if (timeLeft <= 0 && !isOngoing) return null

    const hours = Math.floor(timeLeft / 60)
    const minutes = timeLeft % 60

    return (
      <div className="text-xs text-center mt-1">
        <div className={`font-medium ${isOngoing ? 'text-green-600' : 'text-orange-600'}`}>
          {isOngoing 
            ? `Class ongoing - ${hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`} left`
            : `Link available in ${hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}`
          }
        </div>
      </div>
    )
  }

  const handleMaterialsClick = (course: Course) => {
    setSelectedCourse(course)
    setShowMaterialsModal(true)
  }

  const handleScheduleClick = (course: Course) => {
    setSelectedCourse(course)
    setShowScheduleModal(true)
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      // Only fetch dashboard data for students
      if (session?.user?.role === 'STUDENT') {
        fetchDashboardData()
      }
    }
  }, [status, router]) // Removed session from dependencies

  // Separate effect for role-based redirects
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      // Redirect admin users to admin panel
      if (session.user.role === 'ADMIN') {
        router.push('/admin')
        return
      }
      
      // Redirect tutor users to tutor panel
      if (session.user.role === 'TUTOR') {
        router.push('/tutor')
        return
      }
    }
  }, [session?.user?.role, status, router])

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        fetch('/api/student/enrollments'),
        fetch('/api/student/certificates')
      ])

      if (!enrollmentsRes.ok) {
        throw new Error('Failed to fetch enrollments')
      }

      if (!certificatesRes.ok) {
        throw new Error('Failed to fetch certificates')
      }

      const enrollmentsData = await enrollmentsRes.json()
      const certificatesData = await certificatesRes.json()

      const enrollments = enrollmentsData.enrollments || []
      
      // Transform enrollments to courses with proper structure
      const courses = enrollments.map((enrollment: any) => ({
        id: enrollment.course?.id,
        title: enrollment.course?.title || enrollment.course?.name || 'Untitled Course',
        description: enrollment.course?.description || '',
        progress: 0, // Default progress, can be calculated later
        status: enrollment.status,
        tutor: enrollment.course?.tutor,
        materials: enrollment.course?.materials || [],
        schedules: enrollment.course?.schedules || []
      }))
      
      const completedCourses = courses.filter((c: any) => c.status === 'COMPLETED')
      const existingCertificates = certificatesData.certificates || []
      
      setActiveCourses(courses.filter((c: any) => c.status === 'ACTIVE'))
      setPendingCourses(courses.filter((c: any) => c.status === 'PENDING'))
      setCompletedCourses(completedCourses)
      setCertificates(existingCertificates)

      // Generate certificates for completed courses that don't have student certificates yet
      for (const course of completedCourses) {
        const hasStudentCertificate = existingCertificates.some((cert: any) => 
          cert.courseId === course.id && cert.type === 'STUDENT'
        )
        
        if (!hasStudentCertificate) {
          try {
            await fetch('/api/certificate/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ courseId: course.id }),
            })
          } catch (error) {
            console.error('Error generating certificate for course:', course.id, error)
          }
        }
      }

      // Update stats
      setStats({
        enrolledCourses: courses.length,
        completedCourses: completedCourses.length,
        studyTime: completedCourses
          .reduce((total: number, course: any) => total + (course.course?.courseHours || 0), 0),
        certificatesEarned: existingCertificates.length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You need student privileges to access this page.
            </p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-700">
            <Link href="/" className="flex items-center hover:text-gray-700">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Dashboard</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, {session?.user?.name}! Manage your courses and track your progress
          </p>
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-red-200 flex items-center justify-center relative">
                    <Award className="h-16 w-16 text-orange-600" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {certificate.course.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Certificate ID: {certificate.certificateId}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.open(`/api/certificate/generate-pdf/${certificate.certificateId}`, '_blank')
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Courses Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          
          {/* Active Courses */}
          {activeCourses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Active Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                      <span className="text-6xl font-bold text-blue-600">
                        {getCourseTitle(course).charAt(0).toUpperCase()}
                      </span>
                      {/* Hover overlay with buttons */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => handleMaterialsClick(course)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Materials
                          </Button>
                          <Button
                            onClick={() => handleScheduleClick(course)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default">Active</Badge>
                        <span className="text-sm text-gray-700">
                          {course.progress}% Complete
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getCourseTitle(course)}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      
                      {course.tutor && (
                        <div className="flex items-center mb-4">
                          <Users className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-600">
                            Tutor: {course.tutor.name}
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Courses */}
          {pendingCourses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Activation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
                    <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center relative">
                      <Lock className="h-16 w-16 text-yellow-600" />
                      {/* Hover overlay with pending message */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center text-white p-4">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Pending Activation</p>
                          <p className="text-xs mt-1">Waiting for admin approval</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">Pending Activation</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getCourseTitle(course)}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      
                      {course.tutor && (
                        <div className="flex items-center mb-4">
                          <Users className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-600">
                            Tutor: {course.tutor.name}
                          </span>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Awaiting Approval
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Completed Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default" className="bg-green-500">Completed</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getCourseTitle(course)}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      
                      {(() => {
                        const hasStudentCertificate = certificates.some(cert => 
                          cert.courseId === course.id && cert.type === 'STUDENT'
                        )
                        
                        if (hasStudentCertificate) {
                          const certificate = certificates.find(cert => 
                            cert.courseId === course.id && cert.type === 'STUDENT'
                          )
                          return (
                            <Button
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                if (certificate) {
                                  window.open(`/api/certificate/generate-pdf/${certificate.certificateId}`, '_blank')
                                }
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Certificate
                            </Button>
                          )
                        } else {
                          return (
                            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <p className="text-sm text-blue-800 font-medium mb-1">
                                Certificate Generating
                              </p>
                              <p className="text-xs text-blue-700">
                                Your completion certificate is being generated. Please refresh the page in a moment.
                              </p>
                            </div>
                          )
                        }
                      })()}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeCourses.length === 0 && pendingCourses.length === 0 && completedCourses.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />

      {/* Materials Modal */}
      {showMaterialsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCourse.title} - Materials</CardTitle>
                  <CardDescription>Course materials and resources</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowMaterialsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCourse.materials && selectedCourse.materials.filter((m: any) => m.status === 'APPROVED').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCourse.materials.filter((material: any) => material.status === 'APPROVED').map((material: any) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        {material.type === 'VIDEO' ? <Video className="h-5 w-5 text-blue-600" /> : 
                         material.type === 'LINK' ? <LinkIcon className="h-5 w-5 text-green-600" /> : 
                         <File className="h-5 w-5 text-gray-600" />}
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{material.title}</p>
                          <p className="text-sm text-gray-700">{material.type} • {new Date(material.createdAt).toLocaleDateString()}</p>
                          {material.description && (
                            <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (material.url) {
                              window.open(material.url, '_blank')
                            } else {
                              toast('No URL available for this material')
                            }
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Available</h3>
                  <p className="text-gray-600">No approved course materials available yet for this course.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCourse.title} - Class Schedule</CardTitle>
                  <CardDescription>Upcoming classes and schedule</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Calendar View</h4>
                <div className="text-center mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h5>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const today = new Date()
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                    const daysInMonth = lastDayOfMonth.getDate()
                    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.
                    
                    const calendarDays = []
                    
                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < firstDayOfWeek; i++) {
                      calendarDays.push(null)
                    }
                    
                    // Add all days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(today.getFullYear(), today.getMonth(), day)
                      calendarDays.push(date)
                    }
                    
                    return calendarDays.map((date, i) => {
                      if (!date) {
                        return <div key={i} className="aspect-square"></div>
                      }
                    const isPast = date < new Date()
                    const isToday = date.toDateString() === new Date().toDateString()
                    
                    // Only show admin-added schedules (schedules with googleMeetLink)
                    const hasClass = selectedCourse.schedules?.some(schedule => {
                      const scheduleDate = new Date(schedule.startTime)
                      return scheduleDate.toDateString() === date.toDateString() && schedule.googleMeetLink
                    })
                    const classSchedule = selectedCourse.schedules?.find(schedule => {
                      const scheduleDate = new Date(schedule.startTime)
                      return scheduleDate.toDateString() === date.toDateString() && schedule.googleMeetLink
                    })
                    const isCompleted = classSchedule?.status === 'COMPLETED'
                    
                    // Check if class is ongoing or starting soon
                    const now = new Date()
                    const classStartTime = classSchedule ? new Date(classSchedule.startTime) : null
                    const timeDiff = classStartTime ? (classStartTime.getTime() - now.getTime()) / (1000 * 60) : null
                    
                    // Calculate class end time (assuming 2 hours duration if not specified)
                    const classDuration = 120 // 2 hours in minutes
                    const classEndTime = classStartTime ? new Date(classStartTime.getTime() + classDuration * 60 * 1000) : null
                    const timeToEnd = classEndTime ? (classEndTime.getTime() - now.getTime()) / (1000 * 60) : null
                    
                    
                    // Can join if: class starts within 30 minutes OR class is currently ongoing
                    const canJoin = hasClass && classSchedule?.googleMeetLink && !isCompleted && 
                                  timeDiff !== null && ((timeDiff <= 30 && timeDiff >= 0) || (timeDiff < 0 && timeToEnd !== null && timeToEnd > 0))
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-center border rounded-lg cursor-pointer relative ${
                          isCompleted
                            ? 'bg-gray-300 text-gray-600 border-gray-400'
                            : isPast && hasClass
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : hasClass
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : isToday
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                  : 'bg-white text-gray-700 border-gray-200'
                        }`}
                        title={hasClass ? `${classSchedule?.title} - ${new Date(classSchedule!.startTime).toLocaleTimeString()}` : ''}
                        onClick={() => {
                          if (canJoin) {
                            window.open(classSchedule!.googleMeetLink, '_blank')
                          } else if (hasClass && !classSchedule?.googleMeetLink) {
                            toast('Google meet link has not added yet. please wait..', {
                              duration: 4000,
                              style: {
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '1px solid #f59e0b'
                              }
                            })
                          } else if (hasClass && isCompleted) {
                            toast('This class has already been completed')
                          } else if (hasClass && timeToEnd !== null && timeToEnd <= 0) {
                            toast('This class has ended', {
                              duration: 4000,
                              style: {
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: '1px solid #ef4444'
                              }
                            })
                          } else if (hasClass && timeDiff !== null && timeDiff > 30) {
                            const hours = Math.floor(timeDiff / 60)
                            const minutes = Math.floor(timeDiff % 60)
                            const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
                            toast(`Class starts in ${timeText}. Link will be available 30 minutes before class.`, {
                              duration: 4000,
                              style: {
                                background: '#dbeafe',
                                color: '#1e40af',
                                border: '1px solid #3b82f6'
                              }
                            })
                          }
                        }}
                      >
                        <span className="text-sm font-medium">{date.getDate()}</span>
                        {hasClass && (
                          <div className="w-2 h-2 rounded-full bg-current mt-1"></div>
                        )}
                        {canJoin && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                        {hasClass && classSchedule?.googleMeetLink && timeDiff !== null && timeDiff > 30 && !isCompleted && (
                          <CountdownTimer 
                            targetTime={new Date(classSchedule.startTime)} 
                            classEndTime={classEndTime}
                          />
                        )}
                      </div>
                    )
                    })
                  })()}
                </div>
                
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                    <span className="text-gray-600">Scheduled</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
                    <span className="text-gray-600">Missed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-600">Join Now</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-100 rounded mr-2"></div>
                    <span className="text-gray-600">Countdown Timer</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                    <span className="text-gray-600">Class Ongoing</span>
                  </div>
                </div>
                
                {/* Join Class Button */}
                {(() => {
                  const now = new Date()
                  const upcomingClass = selectedCourse.schedules?.find(schedule => {
                    const classStartTime = new Date(schedule.startTime)
                    const timeDiff = (classStartTime.getTime() - now.getTime()) / (1000 * 60)
                    return schedule.googleMeetLink && schedule.status !== 'COMPLETED' && 
                           timeDiff <= 30 && timeDiff >= -30
                  })
                  
                  if (upcomingClass) {
                    return (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-800">Class Starting Soon!</h4>
                            <p className="text-sm text-green-600">
                              {upcomingClass.title} - {new Date(upcomingClass.startTime).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => window.open(upcomingClass.googleMeetLink, '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Join Class
                          </Button>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}