'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar,
  Upload,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  FileText,
  Video,
  File,
  Link as LinkIcon,
  Home,
  ChevronRight,
  X
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  status: string
  batchStartDate?: string
  batchEndDate?: string
  totalSeats?: number
  seatsLeft?: number
  materials: CourseMaterial[]
  schedules: ClassSchedule[]
  enrollments: {
    user: {
      name: string
      email: string
    }
  }[]
}

interface CourseMaterial {
  id: string
  title: string
  description?: string
  type: string
  url: string
  fileName?: string
  status: string
  createdAt: string
}

interface ClassSchedule {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  status: string
  googleMeetLink?: string
  attendance: {
    user: {
      name: string
    }
    isPresent: boolean
  }[]
}

export default function TutorDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialType, setMaterialType] = useState<'VIDEO' | 'PDF' | 'DOC' | 'PPT' | 'LINK'>('VIDEO')
  const [materialDescription, setMaterialDescription] = useState('')
  const [materialUrl, setMaterialUrl] = useState('')
  const [materialFile, setMaterialFile] = useState<File | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'TUTOR') {
      fetchCourses()
    }
  }, [status, session])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/tutor/courses')
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleMaterialSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/tutor/materials', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('Study material submitted for admin approval')
        setShowMaterialForm(false)
        setMaterialTitle('')
        setMaterialDescription('')
        setMaterialUrl('')
        setMaterialFile(null)
        fetchCourses()
      } else {
        toast.error('Failed to submit material')
      }
    } catch (error) {
      console.error('Error submitting material:', error)
      toast.error('Failed to submit material')
    }
  }

  const handleJoinClass = (schedule: ClassSchedule) => {
    if (schedule.googleMeetLink) {
      window.open(schedule.googleMeetLink, '_blank')
    } else {
      toast.error('No meeting link available')
    }
  }

  const handleCompleteClass = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/tutor/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      })

      if (response.ok) {
        toast.success('Class marked as completed')
        fetchCourses()
      } else {
        toast.error('Failed to mark class as completed')
      }
    } catch (error) {
      console.error('Error completing class:', error)
      toast.error('Failed to complete class')
    }
  }

  const getUpcomingCourses = () => {
    return courses.filter(course => {
      const hasUpcomingSchedules = course.schedules?.some(schedule => 
        new Date(schedule.startTime) >= new Date() && schedule.status !== 'COMPLETED'
      )
      return course.status === 'ACTIVE' && hasUpcomingSchedules
    })
  }

  const getCompletedCourses = () => {
    return courses.filter(course => {
      const allSchedulesCompleted = course.schedules?.length > 0 && 
        course.schedules.every(schedule => schedule.status === 'COMPLETED')
      return course.status === 'COMPLETED' || allSchedulesCompleted
    })
  }

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'pdf':
      case 'doc':
      case 'ppt':
        return <File className="h-4 w-4" />
      case 'link':
        return <LinkIcon className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
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

  if (status === 'unauthenticated' || session?.user?.role !== 'TUTOR') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You need tutor privileges to access this page.
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
            <span className="text-gray-900 font-medium">Tutor Dashboard</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Tutor Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your assigned courses, materials, and class schedules
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 p-1 bg-white rounded-xl shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Upcoming Courses ({getUpcomingCourses().length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Completed Courses ({getCompletedCourses().length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'upcoming' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Courses</h2>
              {getUpcomingCourses().length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Courses</h3>
                    <p className="text-gray-600">You don't have any upcoming courses at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getUpcomingCourses().map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-600" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={course.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                          <span className="text-sm text-gray-700">
                            {course.enrollments.length} students
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        {course.batchStartDate && (
                          <div className="flex items-center mb-4">
                            <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                            <span className="text-sm text-gray-600">
                              Starts: {new Date(course.batchStartDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-700">
                            Materials: {course.materials.filter(m => m.status === 'APPROVED').length}
                          </div>
                          <div className="text-sm text-gray-700">
                            Classes: {course.schedules.filter(s => s.status !== 'COMPLETED').length}
                          </div>
                        </div>
                        
                        {/* Hover buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => {
                                setSelectedCourse(course)
                                setShowMaterialForm(true)
                              }}
                              className="flex-1"
                              size="sm"
                              variant="outline"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Add Study Materials
                            </Button>
                            <Button 
                              onClick={() => {
                                setSelectedCourse(course)
                                setShowScheduleModal(true)
                              }}
                              className="flex-1"
                              size="sm"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedCourse(course)
                              setShowStudentsModal(true)
                            }}
                            className="w-full mt-2"
                            size="sm"
                            variant="outline"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            View Enrolled Students
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Courses</h2>
              {getCompletedCourses().length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Courses</h3>
                    <p className="text-gray-600">You haven't completed any courses yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCompletedCourses().map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            COMPLETED
                          </Badge>
                          <span className="text-sm text-gray-700">
                            {course.enrollments.length} students
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-700">
                            Materials: {course.materials.filter(m => m.status === 'APPROVED').length}
                          </div>
                          <div className="text-sm text-gray-700">
                            Classes: {course.schedules.filter(s => s.status === 'COMPLETED').length}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowStudentsModal(true)
                          }}
                          className="w-full"
                          size="sm"
                          variant="outline"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Students
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      {/* Add Material Modal */}
      {showMaterialForm && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Add Study Material</h3>
              <button onClick={() => setShowMaterialForm(false)} className="text-gray-700 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <div className="mt-1 w-full rounded-md border border-gray-300 p-3 bg-gray-50">
                  <p className="font-medium text-gray-900">{selectedCourse.title}</p>
                  <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="Enter material title"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="DOC">DOC</option>
                    <option value="PPT">PPT</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setMaterialFile(file)
                      } else {
                        setMaterialFile(null)
                      }
                    }}
                    disabled={materialType === 'LINK'}
                  />
                </div>
              </div>
              {materialType === 'LINK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    value={materialUrl}
                    onChange={(e) => setMaterialUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMaterialForm(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!selectedCourse || !materialTitle.trim()) {
                    toast.error('Title is required')
                    return
                  }
                  const form = new FormData()
                  form.append('courseId', selectedCourse.id)
                  form.append('title', materialTitle.trim())
                  form.append('type', materialType)
                  if (materialDescription.trim()) form.append('description', materialDescription.trim())
                  if (materialType === 'LINK') {
                    if (!materialUrl.trim()) {
                      toast.error('URL is required for link type')
                      return
                    }
                    form.append('url', materialUrl.trim())
                  } else if (materialFile) {
                    form.append('file', materialFile)
                  } else {
                    toast.error('Please select a file')
                    return
                  }
                  await handleMaterialSubmit(form)
                }}
              >
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Class Schedule - {selectedCourse.title}</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-700 hover:text-gray-900">✕</button>
            </div>
            
            <div className="space-y-6">
              {/* Calendar View */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Calendar View</h4>
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
                  {Array.from({ length: 30 }, (_, i) => {
                    const date = new Date()
                    date.setDate(i + 1)
                    const isPast = date < new Date()
                    const isToday = date.toDateString() === new Date().toDateString()
                    const hasClass = selectedCourse.schedules?.some(schedule => {
                      const scheduleDate = new Date(schedule.startTime)
                      return scheduleDate.toDateString() === date.toDateString()
                    })
                    const classSchedule = selectedCourse.schedules?.find(schedule => {
                      const scheduleDate = new Date(schedule.startTime)
                      return scheduleDate.toDateString() === date.toDateString()
                    })
                    const isCompleted = classSchedule?.status === 'COMPLETED'
                    
                    // Check if class is ongoing or starting soon
                    const now = new Date()
                    const classStartTime = classSchedule ? new Date(classSchedule.startTime) : null
                    const timeDiff = classStartTime ? (classStartTime.getTime() - now.getTime()) / (1000 * 60) : null
                    
                    // Calculate class end time (assuming 2 hours duration)
                    const classDuration = 120 // 2 hours in minutes
                    const classEndTime = classStartTime ? new Date(classStartTime.getTime() + classDuration * 60 * 1000) : null
                    const timeToEnd = classEndTime ? (classEndTime.getTime() - now.getTime()) / (1000 * 60) : null
                    
                    // Can join if: class starts within 30 minutes OR class is currently ongoing
                    const canJoin = hasClass && classSchedule?.googleMeetLink && !isCompleted && 
                                  timeDiff !== null && ((timeDiff <= 30 && timeDiff >= 0) || (timeDiff < 0 && timeToEnd !== null && timeToEnd > 0))
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-colors ${
                          isCompleted
                            ? 'bg-gray-300 text-gray-600 border-gray-400'
                            : canJoin && timeDiff !== null && timeDiff < 0
                              ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                              : isPast && hasClass
                                ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                                : hasClass
                                  ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
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
                                background: '#e0f2fe',
                                color: '#0b69a3',
                                border: '1px solid #38bdf8'
                              }
                            })
                          }
                        }}
                      >
                        <span className="text-sm font-medium">{i + 1}</span>
                        {hasClass && (
                          <div className="w-2 h-2 rounded-full bg-current mt-1"></div>
                        )}
                        {hasClass && classSchedule?.googleMeetLink && timeDiff !== null && timeDiff > 30 && !isCompleted && (
                          <div className="text-xs text-center mt-1">
                            <div className="font-medium text-orange-600">
                              Link available in {Math.floor(timeDiff / 60) > 0 ? `${Math.floor(timeDiff / 60)}h ${Math.floor(timeDiff % 60)}m` : `${Math.floor(timeDiff % 60)}m`}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-4 flex justify-center space-x-4 text-sm">
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
                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                    <span className="text-gray-600">Class Ongoing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                </div>
              </div>
              
              {/* Class List */}
              {selectedCourse.schedules.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Class Schedule</h4>
                  <div className="space-y-3">
                    {selectedCourse.schedules
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map((schedule) => {
                        const isPast = new Date(schedule.startTime) < new Date()
                        const isToday = new Date(schedule.startTime).toDateString() === new Date().toDateString()
                        const canJoin = schedule.googleMeetLink && (isPast || isToday) && schedule.status !== 'COMPLETED'
                        const canComplete = isPast && schedule.status !== 'COMPLETED'
                        
                        return (
                          <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{schedule.title}</h5>
                              <div className="flex items-center mt-1 space-x-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(schedule.startTime).toLocaleString()}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="h-4 w-4 mr-1" />
                                  {schedule.attendance.length} students
                                </div>
                                {schedule.googleMeetLink && (
                                  <div className="flex items-center text-sm text-green-600">
                                    <LinkIcon className="h-4 w-4 mr-1" />
                                    Meet link available
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {canJoin && (
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinClass(schedule)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Join Now
                                </Button>
                              )}
                              {canComplete && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCompleteClass(schedule.id)}
                                >
                                  Complete Class
                                </Button>
                              )}
                              <Badge className={getScheduleStatusColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Enrolled Students - {selectedCourse.title}</h3>
              <button onClick={() => setShowStudentsModal(false)} className="text-gray-700 hover:text-gray-900">✕</button>
            </div>
            
            <div className="space-y-4">
              {selectedCourse.enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h4>
                  <p className="text-gray-600">No students have enrolled in this course yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {selectedCourse.enrollments.map((enrollment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                          <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                        </div>
                      </div>
                      <Badge variant="default">Enrolled</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}