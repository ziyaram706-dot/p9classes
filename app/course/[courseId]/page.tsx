'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar,
  Video,
  File,
  Link as LinkIcon,
  Download,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Home,
  ChevronRight,
  Play,
  Award,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'

interface CourseMaterial {
  id: string
  title: string
  description?: string
  type: string
  url: string
  fileName?: string
  fileSize?: number
  createdAt: string
}

interface ClassSchedule {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  status: string
}

interface Course {
  id: string
  title: string
  description: string
  tutor?: {
    name: string
  }
  batchStartDate?: string
  batchEndDate?: string
  schedules: ClassSchedule[]
}

export default function CourseAccessPage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<'materials' | 'timetable'>('materials')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [params.courseId])

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`)
      const data = await response.json()
      setCourse(data.course)
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="h-5 w-5" />
      case 'pdf':
      case 'doc':
      case 'ppt':
        return <File className="h-5 w-5" />
      case 'link':
        return <LinkIcon className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen galaxy-bg star-field">
      <Navbar />

      {/* Hero Section - matches home page style */}
      <section className="relative overflow-hidden hero-gradient hero-pattern min-h-screen flex items-center">
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="floating-shape w-64 h-64 bg-white rounded-full"></div>
          <div className="floating-shape w-32 h-32 bg-blue-200 rounded-full"></div>
          <div className="floating-shape w-48 h-48 bg-purple-200 rounded-full"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-white animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-8 glass-effect animate-float">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              📚 Course Access Portal
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight text-white">
              {course?.title || 'Course Access'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl">
              {course?.description || 'Access your course materials and schedule'}
            </p>
            
            {/* Course Info */}
            <div className="flex flex-wrap gap-8 mb-10">
              {course?.tutor && (
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-float">👨‍🏫</span>
                  <div>
                    <span className="font-bold text-xl">Instructor</span>
                    <div className="text-sm">{course.tutor.name}</div>
                  </div>
                </div>
              )}
              {course?.batchStartDate && (
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-bounce-slow">📅</span>
                  <div>
                    <span className="font-bold text-xl">Started</span>
                    <div className="text-sm">{new Date(course.batchStartDate).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
              {course?.batchEndDate && (
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-pulse-slow">⏰</span>
                  <div>
                    <span className="font-bold text-xl">Ends</span>
                    <div className="text-sm">{new Date(course.batchEndDate).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-300">
            <Link href="/" className="flex items-center hover:text-white">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{course?.title}</span>
          </nav>
        </div>
      </div>
      
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'materials'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Course Materials
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'timetable'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Class Schedule
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'materials' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Course Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample materials - replace with actual data */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Introduction Video
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Course introduction and overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <File className="h-5 w-5 mr-2" />
                    Course Syllabus
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed course outline and objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Additional Resources
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    External links and supplementary materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Visit Link
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Assignment
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Weekly assignment and project guidelines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Assignment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Class Schedule</h2>
            <div className="space-y-4">
              {/* Sample schedule - replace with actual data */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Introduction to Course</h3>
                      <p className="text-gray-300">Course overview and expectations</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Monday, Jan 15, 2024</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>10:00 AM - 12:00 PM</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Completed</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Module 1: Fundamentals</h3>
                      <p className="text-gray-300">Basic concepts and principles</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Wednesday, Jan 17, 2024</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>10:00 AM - 12:00 PM</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Module 2: Advanced Topics</h3>
                      <p className="text-gray-300">Deep dive into advanced concepts</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Friday, Jan 19, 2024</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>10:00 AM - 12:00 PM</span>
                      </div>
                    </div>
                    <Badge className="bg-gray-500 text-white">Upcoming</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
