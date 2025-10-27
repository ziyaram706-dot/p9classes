'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  DollarSign,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Image,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Calendar,
  FileText,
  File,
  Video,
  Link as LinkIcon,
  X,
  Layout,
  Tag,
  Award,
  UserPlus,
  Shield,
  Home,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalStudents: number
  totalTutors: number
  totalCourses: number
  totalRevenue: number
  pendingEnquiries: number
  activeCourses: number
  completedCourses: number
  pendingEnrollments: number
}

interface RecentEnquiry {
  id: string
  name: string
  email: string
  courseInterest: string
  message: string
  status: string
  createdAt: string
}

interface RecentEnrollment {
  id: string
  status: string
  paymentStatus: string
  user: {
    name: string
    email: string
  }
  course: {
    title: string
  }
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'users' | 'courses' | 'enrollments' | 'enquiries' | 'meta' | 'sliders' | 'certificate-credentials' | 'testimonials'>('overview')

  // Debug session status
  console.log('Admin page session status:', status, 'session:', session)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([])
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [certificateCredentials, setCertificateCredentials] = useState({
    companyName: 'Planet Nine Classes',
    companyLogo: '🎓',
    managingDirectorName: 'Abhiram P Mohan',
    managingDirectorSignature: null,
    signatureImageUrl: null,
    websiteUrl: 'https://planetnineclasses.com'
  })
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [userRole, setUserRole] = useState<'ADMIN' | 'TUTOR' | 'STUDENT'>('STUDENT')
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: 'WEB_DEVELOPMENT',
    tutorId: '',
    totalSeats: '',
    batchStartDate: '',
    batchEndDate: '',
    courseHours: '',
    features: [''],
    imageUrl: '',
    bannerUrl: '',
    introductionVideo: '',
    courseSyllabus: '',
    additionalResources: [''],
    assignments: ['']
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [showCreateTestimonialModal, setShowCreateTestimonialModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    course: '',
    rating: 5,
    content: '',
    imageUrl: '',
    isActive: true
  })

  const handleAddSampleImages = async () => {
    try {
      const response = await fetch('/api/courses/add-sample-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        fetchDashboardData() // Refresh the courses list
      } else {
        toast.error('Failed to add sample images')
      }
    } catch (error) {
      console.error('Error adding sample images:', error)
      toast.error('Error adding sample images')
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  const handleCreateTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.course || !newTestimonial.content) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTestimonial),
      })

      if (response.ok) {
        toast.success('Testimonial created successfully')
        setShowCreateTestimonialModal(false)
        setNewTestimonial({
          name: '',
          course: '',
          rating: 5,
          content: '',
          imageUrl: '',
          isActive: true
        })
        fetchTestimonials()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create testimonial')
      }
    } catch (error) {
      toast.error('Error creating testimonial')
    }
  }

  const handleEditTestimonial = async () => {
    if (!editingTestimonial?.name || !editingTestimonial?.course || !editingTestimonial?.content) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingTestimonial.id,
          ...editingTestimonial
        }),
      })

      if (response.ok) {
        toast.success('Testimonial updated successfully')
        setEditingTestimonial(null)
        fetchTestimonials()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update testimonial')
      }
    } catch (error) {
      toast.error('Error updating testimonial')
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Testimonial deleted successfully')
        fetchTestimonials()
      } else {
        toast.error('Failed to delete testimonial')
      }
    } catch (error) {
      toast.error('Error deleting testimonial')
    }
  }

  const handleSaveCertificateCredentials = async () => {
    try {
      const formData = new FormData()
      formData.append('companyName', certificateCredentials.companyName)
      formData.append('companyLogo', certificateCredentials.companyLogo)
      formData.append('managingDirectorName', certificateCredentials.managingDirectorName)
      formData.append('websiteUrl', certificateCredentials.websiteUrl)
      
      if (signatureFile) {
        formData.append('signatureFile', signatureFile)
      }

      const response = await fetch('/api/admin/certificate-credentials', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Certificate credentials saved successfully')
        // Refresh credentials data
        const credentialsData = await response.json()
        if (credentialsData.credentials) {
          setCertificateCredentials(credentialsData.credentials)
        }
        setSignatureFile(null)
      } else {
        toast.error('Error saving certificate credentials')
      }
    } catch (error) {
      toast.error('Error saving certificate credentials')
    }
  }

  const handleImageUpload = async (file: File, type: 'imageUrl' | 'bannerUrl') => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (type === 'imageUrl') {
        setUploadingImage(true)
      } else {
        setUploadingBanner(true)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setNewCourse({ ...newCourse, [type]: result.url })
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      toast.error('Error uploading image')
    } finally {
      if (type === 'imageUrl') {
        setUploadingImage(false)
      } else {
        setUploadingBanner(false)
      }
    }
  }
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<string>('')
  const [selectedCourseForSchedule, setSelectedCourseForSchedule] = useState<string>('')
  const [showCertificateUploadModal, setShowCertificateUploadModal] = useState(false)
  const [selectedEnrollmentForCertificate, setSelectedEnrollmentForCertificate] = useState<string>('')
  const [selectedStudentName, setSelectedStudentName] = useState<string>('')
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [courseDuration, setCourseDuration] = useState<number>(0)
  const [scheduleDates, setScheduleDates] = useState<Date[]>([])
  const [classStartTime, setClassStartTime] = useState<string>('10:00')
  const [classEndTime, setClassEndTime] = useState<string>('12:00')
  const [selectedDays, setSelectedDays] = useState<number[]>([1,2,3,4,5]) // Mon-Fri by default
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    googleMeetLink: ''
  })
  
  // Schedule viewing modal state
  const [showScheduleViewModal, setShowScheduleViewModal] = useState(false)
  const [selectedCourseSchedules, setSelectedCourseSchedules] = useState<any[]>([])
  const [selectedCourseForView, setSelectedCourseForView] = useState<any>(null)
  
  // Schedule editing modal state
  const [showScheduleEditModal, setShowScheduleEditModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [sliders, setSliders] = useState<any[]>([])
  const [metaTags, setMetaTags] = useState<any[]>([])
  const [tutors, setTutors] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [admins, setAdmins] = useState<any[]>([])

  // CMS Management states
  const [showCMSEditor, setShowCMSEditor] = useState(false)
  const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'contact' | null>(null)
  const [cmsContent, setCmsContent] = useState({
    title: '',
    description: '',
    content: '',
    offer: {
      title: '',
      subtitle: '',
      link: '',
      imageUrl: ''
    }
  })

  // Course editing states
  const [showEditCourseModal, setShowEditCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchDashboardData()
    }
  }, [status, session])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, enquiriesRes, enrollmentsRes, usersRes, coursesRes, certificatesRes, testimonialsRes, credentialsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/enquiries?limit=5'),
        fetch('/api/admin/enrollments?limit=5'),
        fetch('/api/admin/users'),
        fetch('/api/courses?includeEnrollments=true'),
        fetch('/api/admin/certificates'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/certificate-credentials')
      ])
      
      const statsData = await statsRes.json()
      const enquiriesData = await enquiriesRes.json()
      const enrollmentsData = await enrollmentsRes.json()
      const usersData = await usersRes.json()
      const coursesData = await coursesRes.json()
      const certificatesData = await certificatesRes.json()
      const testimonialsData = await testimonialsRes.json()
      const credentialsData = await credentialsRes.json()
      
      setStats(statsData.stats)
      setRecentEnquiries(enquiriesData.enquiries || [])
      setRecentEnrollments(enrollmentsData.enrollments || [])
      setUsers(usersData.users || [])
      setCourses(coursesData.courses || [])
      setCertificates(certificatesData.certificates || [])
      setTestimonials(testimonialsData.testimonials || [])
      
      // Set certificate credentials if available
      if (credentialsData.credentials) {
        setCertificateCredentials(credentialsData.credentials)
      }
      
      // Separate users by role
      setAdmins(usersData.users?.filter((user: any) => user.role === 'ADMIN') || [])
      setTutors(usersData.users?.filter((user: any) => user.role === 'TUTOR') || [])
      setStudents(usersData.users?.filter((user: any) => user.role === 'STUDENT') || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiryAction = async (enquiryId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action === 'approve' ? 'RESOLVED' : 'REJECTED' }),
      })

      if (response.ok) {
        toast.success(`Enquiry ${action}d successfully`)
        fetchDashboardData()
      } else {
        toast.error(`Failed to ${action} enquiry`)
      }
    } catch (error) {
      console.error(`Error ${action}ing enquiry:`, error)
      toast.error(`Failed to ${action} enquiry`)
    }
  }

  const handleEnrollmentAction = async (enrollmentId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          paymentStatus: action === 'approve' ? 'PAID' : 'DECLINED'
        }),
      })

      if (response.ok) {
        toast.success(`Enrollment ${action}d successfully`)
        fetchDashboardData()
      } else {
        toast.error(`Failed to ${action} enrollment`)
      }
    } catch (error) {
      console.error(`Error ${action}ing enrollment:`, error)
      toast.error(`Failed to ${action} enrollment`)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          role: userRole
        }),
      })

      if (response.ok) {
        toast.success(`${userRole} created successfully`)
        setShowCreateUserModal(false)
        setNewUser({ name: '', email: '', password: '', phone: '' })
        fetchDashboardData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('Error creating user')
    }
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.price) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCourse,
          price: parseFloat(newCourse.price),
          discountedPrice: newCourse.discountedPrice ? parseFloat(newCourse.discountedPrice) : undefined,
          totalSeats: parseInt(newCourse.totalSeats),
          courseHours: parseInt(newCourse.courseHours),
          features: newCourse.features.filter((f: string) => f.trim() !== ''),
          additionalResources: newCourse.additionalResources.filter((r: string) => r.trim() !== ''),
          assignments: newCourse.assignments.filter((a: string) => a.trim() !== ''),
          status: 'DRAFT'
        }),
      })

      if (response.ok) {
        toast.success('Course created successfully')
        setShowCreateCourseModal(false)
        setNewCourse({
          title: '',
          description: '',
          price: '',
          discountedPrice: '',
          category: 'WEB_DEVELOPMENT',
          tutorId: '',
          totalSeats: '',
          batchStartDate: '',
          batchEndDate: '',
          courseHours: '',
          features: [''],
          imageUrl: '',
          bannerUrl: '',
          introductionVideo: '',
          courseSyllabus: '',
          additionalResources: [''],
          assignments: ['']
        })
        fetchDashboardData()
      } else {
        const error = await response.json()
        console.error('Course creation error:', error)
        if (error.details && Array.isArray(error.details)) {
          toast.error(`Validation failed: ${error.details.join(', ')}`)
        } else {
          toast.error(error.error || 'Failed to create course')
        }
      }
    } catch (error) {
      toast.error('Error creating course')
    }
  }

  const generateScheduleDates = (startDate: Date, duration: number, allowedDays: number[]) => {
    const dates: Date[] = []
    let current = new Date(startDate)
    while (dates.length < duration) {
      if (allowedDays.includes(current.getDay())) {
        dates.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourseForSchedule(courseId)
    const course = courses.find(c => c.id === courseId)
    if (course && course.courseHours) {
      setCourseDuration(Math.ceil(course.courseHours / 2)) // Assuming 2 hours per class
    }
  }

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date)
    const dates = generateScheduleDates(date, courseDuration, selectedDays)
    setScheduleDates(dates)
  }

  const toggleDay = (day: number) => {
    setSelectedDays(prev => {
      const has = prev.includes(day)
      const next = has ? prev.filter(d => d !== day) : [...prev, day]
      if (selectedDate) {
        setScheduleDates(generateScheduleDates(selectedDate, courseDuration, next))
      }
      return next
    })
  }

  const handleViewCertificate = (certificateId: string) => {
    // Open certificate in new tab
    window.open(`/api/certificate/verify/${certificateId}`, '_blank')
  }

  const handleDownloadCertificate = async (certificateId: string, courseTitle: string, studentName: string) => {
    try {
      const response = await fetch(`/api/certificate/download/${certificateId}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${courseTitle}_${studentName}_Certificate.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Certificate downloaded successfully')
      } else {
        toast.error('Failed to download certificate')
      }
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Error downloading certificate')
    }
  }

  const handleCMSEdit = (page: 'home' | 'about' | 'contact') => {
    setSelectedPage(page)
    setCmsContent({
      title: page === 'home' ? 'Planet Nine Classes - Explore the Universe of Knowledge' : 
             page === 'about' ? 'About Planet Nine Classes' : 'Contact Us',
      description: page === 'home' ? 'Learn from industry experts with our comprehensive live courses' :
                   page === 'about' ? 'Learn about our mission and values' : 'Get in touch with us',
      content: page === 'home' ? 'Welcome to Planet Nine Classes...' :
               page === 'about' ? 'About our academy...' : 'Contact information...',
      offer: {
        title: '',
        subtitle: '',
        link: '',
        imageUrl: ''
      }
    })
    setShowCMSEditor(true)
  }

  const handleCreateSchedule = async () => {
    if (!selectedCourseForSchedule || scheduleDates.length === 0) {
      toast.error('Please select a course and add schedule dates')
      return
    }

    try {
      // Create multiple schedules for each date using individual time ranges
      const schedulePromises = scheduleDates.map((date, index) => {
        const [startH, startM] = classStartTime.split(':').map(Number)
        const [endH, endM] = classEndTime.split(':').map(Number)
        
        const startTime = new Date(date)
        startTime.setHours(startH, startM || 0, 0, 0)
        
        const endTime = new Date(date)
        endTime.setHours(endH, endM || 0, 0, 0)

        return fetch('/api/admin/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: selectedCourseForSchedule,
            title: `Class ${index + 1}`,
            description: `Class ${index + 1} of the course`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            googleMeetLink: ''
          }),
        })
      })

      const responses = await Promise.all(schedulePromises)
      const allSuccessful = responses.every(response => response.ok)

      if (allSuccessful) {
        toast.success(`Created ${scheduleDates.length} class schedules successfully`)
        setShowScheduleModal(false)
        setSelectedCourseForSchedule('')
        setSelectedDate(null)
        setScheduleDates([])
        setCourseDuration(0)
        fetchDashboardData()
      } else {
        toast.error('Failed to create some schedules')
      }
    } catch (error) {
      toast.error('Error creating schedules')
    }
  }

  const handleUploadCertificate = (enrollmentId: string, studentName: string) => {
    setSelectedEnrollmentForCertificate(enrollmentId)
    setSelectedStudentName(studentName)
    setShowCertificateUploadModal(true)
  }

  const handleSubmitCertificate = async () => {
    if (!certificateFile || !selectedEnrollmentForCertificate) {
      toast.error('Please select a certificate file')
      return
    }

    try {
      const formData = new FormData()
      formData.append('certificate', certificateFile)
      formData.append('enrollmentId', selectedEnrollmentForCertificate)

      const response = await fetch('/api/admin/certificates', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Certificate uploaded successfully')
        setShowCertificateUploadModal(false)
        setCertificateFile(null)
        setSelectedEnrollmentForCertificate('')
        setSelectedStudentName('')
        fetchDashboardData()
      } else {
        toast.error('Failed to upload certificate')
      }
    } catch (error) {
      console.error('Error uploading certificate:', error)
      toast.error('Error uploading certificate')
    }
  }

  const handleViewCourseSchedules = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/schedules?courseId=${courseId}`)
      if (response.ok) {
        const schedules = await response.json()
        const course = courses.find(c => c.id === courseId)
        setSelectedCourseSchedules(schedules)
        setSelectedCourseForView(course)
        setShowScheduleViewModal(true)
      } else {
        toast.error('Failed to fetch schedules')
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error('Error fetching schedules')
    }
  }

  const handleEditSchedule = async (schedule: any) => {
    setEditingSchedule(schedule)
    setShowScheduleEditModal(true)
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        const response = await fetch(`/api/admin/schedules/${scheduleId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          toast.success('Schedule deleted successfully')
          // Refresh the schedules list
          if (selectedCourseForView) {
            handleViewCourseSchedules(selectedCourseForView.id)
          }
        } else {
          toast.error('Failed to delete schedule')
        }
      } catch (error) {
        console.error('Error deleting schedule:', error)
        toast.error('Error deleting schedule')
      }
    }
  }

  const handleUpdateSchedule = async () => {
    try {
      const response = await fetch(`/api/admin/schedules/${editingSchedule.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingSchedule.title,
          description: editingSchedule.description,
          startTime: editingSchedule.startTime,
          endTime: editingSchedule.endTime,
          googleMeetLink: editingSchedule.googleMeetLink,
          status: editingSchedule.status
        }),
      })

      if (response.ok) {
        toast.success('Schedule updated successfully')
        setShowScheduleEditModal(false)
        setEditingSchedule(null)
        // Refresh the schedules list
        if (selectedCourseForView) {
          handleViewCourseSchedules(selectedCourseForView.id)
        }
      } else {
        toast.error('Failed to update schedule')
      }
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast.error('Error updating schedule')
    }
  }

  const handleCMSSave = async () => {
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: selectedPage,
          title: cmsContent.title,
          description: cmsContent.description,
          content: cmsContent.content,
          offer: cmsContent.offer
        }),
      })

      if (response.ok) {
        toast.success(`${selectedPage} page updated successfully!`)
        setShowCMSEditor(false)
        setSelectedPage(null)
        setCmsContent({ title: '', description: '', content: '', offer: { title: '', subtitle: '', link: '', imageUrl: '' } })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update content')
      }
    } catch (error) {
      console.error('Error saving CMS content:', error)
      toast.error('Error saving content')
    }
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse({
      ...course,
      introductionVideo: course.introductionVideo || '',
      courseSyllabus: course.courseSyllabus || '',
      additionalResources: course.additionalResources || [''],
      assignments: course.assignments || ['']
    })
    setNewCourse({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      discountedPrice: course.discountedPrice?.toString() || '',
      category: course.category,
      tutorId: course.tutorId || '',
      totalSeats: course.totalSeats?.toString() || '',
      batchStartDate: course.batchStartDate || '',
      batchEndDate: course.batchEndDate || '',
      courseHours: course.courseHours?.toString() || '',
      features: course.features || [''],
      imageUrl: course.imageUrl || '',
      bannerUrl: course.bannerUrl || '',
      introductionVideo: course.introductionVideo || '',
      courseSyllabus: course.courseSyllabus || '',
      additionalResources: course.additionalResources || [''],
      assignments: course.assignments || ['']
    })
    setShowEditCourseModal(true)
  }

  const handleUpdateCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          price: parseFloat(editingCourse.price),
          discountedPrice: editingCourse.discountedPrice ? parseFloat(editingCourse.discountedPrice) : null,
          category: editingCourse.category,
          tutorId: editingCourse.tutorId || null,
          totalSeats: editingCourse.totalSeats ? parseInt(editingCourse.totalSeats) : null,
          batchStartDate: editingCourse.batchStartDate ? new Date(editingCourse.batchStartDate) : null,
          batchEndDate: editingCourse.batchEndDate ? new Date(editingCourse.batchEndDate) : null,
          courseHours: editingCourse.courseHours ? parseInt(editingCourse.courseHours) : null,
          imageUrl: editingCourse.imageUrl || null,
          bannerUrl: editingCourse.bannerUrl || null,
          features: editingCourse.features.filter((f: string) => f.trim() !== ''),
          introductionVideo: editingCourse.introductionVideo || null,
          courseSyllabus: editingCourse.courseSyllabus || null,
          additionalResources: editingCourse.additionalResources?.filter((r: string) => r.trim() !== '') || [],
          assignments: editingCourse.assignments?.filter((a: string) => a.trim() !== '') || []
        }),
      })

      if (response.ok) {
        toast.success('Course updated successfully!')
        setShowEditCourseModal(false)
        setEditingCourse(null)
        setNewCourse({
          title: '',
          description: '',
          price: '',
          discountedPrice: '',
          category: 'WEB_DEVELOPMENT',
          tutorId: '',
          totalSeats: '',
          batchStartDate: '',
          batchEndDate: '',
          courseHours: '',
          features: [''],
          imageUrl: '',
          bannerUrl: '',
          introductionVideo: '',
          courseSyllabus: '',
          additionalResources: [''],
          assignments: ['']
        })
        fetchDashboardData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update course')
      }
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error('Error updating course')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        fetchDashboardData()
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Error deleting user')
    }
  }

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchDashboardData()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Error updating user status')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Course deleted successfully')
        fetchDashboardData()
      } else {
        toast.error('Failed to delete course')
      }
    } catch (error) {
      toast.error('Error deleting course')
    }
  }

  const handleApproveMaterial = async (materialId: string) => {
    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' })
      })
      
      if (response.ok) {
        toast.success('Study material approved successfully')
        fetchDashboardData()
      } else {
        toast.error('Failed to approve material')
      }
    } catch (error) {
      console.error('Error approving material:', error)
      toast.error('Failed to approve material')
    }
  }

  const handleRejectMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to reject this study material?')) return
    
    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' })
      })
      
      if (response.ok) {
        toast.success('Study material rejected')
        fetchDashboardData()
      } else {
        toast.error('Failed to reject material')
      }
    } catch (error) {
      console.error('Error rejecting material:', error)
      toast.error('Failed to reject material')
    }
  }

  const handleUpdateCourseStatus = async (courseId: string, status: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Course status updated successfully')
        fetchDashboardData()
      } else {
        toast.error('Failed to update course status')
      }
    } catch (error) {
      toast.error('Error updating course status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-800 mb-4">
              You need admin privileges to access this page.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <span className="text-gray-900 font-medium">Admin Dashboard</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-800 text-lg">
            Manage your academy platform and oversee all operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5 mb-1" />
                <span className="text-xs">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'enrollments'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-xs">Enrollments</span>
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'cms'
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Layout className="h-5 w-5 mb-1" />
                <span className="text-xs">CMS</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Users</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'courses'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="h-5 w-5 mb-1" />
                <span className="text-xs">Courses</span>
              </button>
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'enquiries'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-xs">Enquiries</span>
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'meta'
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Tag className="h-5 w-5 mb-1" />
                <span className="text-xs">Meta Tags</span>
              </button>
              <button
                onClick={() => setActiveTab('sliders')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'sliders'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Image className="h-5 w-5 mb-1" />
                <span className="text-xs">Sliders</span>
              </button>
              <button
                onClick={() => setActiveTab('certificate-credentials')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'certificate-credentials'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-5 w-5 mb-1" />
                <span className="text-xs">Cert Credentials</span>
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex flex-col items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'testimonials'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-xs">Testimonials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'enrollments' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Pending Enrollments</CardTitle>
                    <CardDescription>Approve or reject new enrollment requests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentEnrollments.filter(e => e.status === 'PENDING').length === 0 && (
                      <p className="text-gray-700">No pending enrollments.</p>
                    )}
                    {recentEnrollments.filter(e => e.status === 'PENDING').map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="min-w-0 mr-4">
                          <p className="font-medium text-gray-900 truncate">{enrollment.user.name}</p>
                          <p className="text-sm text-gray-700 truncate">{enrollment.user.email}</p>
                          <p className="text-sm text-gray-600 truncate">{enrollment.course.title}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleEnrollmentAction(enrollment.id, 'approve')}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleEnrollmentAction(enrollment.id, 'reject')}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900">All Recent Enrollments</CardTitle>
                    <CardDescription>Latest course enrollments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentEnrollments.length === 0 && (
                      <p className="text-gray-700">No enrollments yet.</p>
                    )}
                    {recentEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="min-w-0 mr-4">
                          <p className="font-medium text-gray-900 truncate">{enrollment.user.name}</p>
                          <p className="text-sm text-gray-700 truncate">{enrollment.user.email}</p>
                          <p className="text-sm text-gray-600 truncate">{enrollment.course.title}</p>
                        </div>
                        <Badge variant={enrollment.status === 'PENDING' ? 'secondary' : 'default'}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    ))}
                    <Link href="/admin/enrollments">
                      <Button variant="outline" className="w-full">Manage All Enrollments</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Students</p>
                        <p className="text-3xl font-bold">{stats?.totalStudents || 0}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Total Tutors</p>
                        <p className="text-3xl font-bold">{stats?.totalTutors || 0}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Active Courses</p>
                        <p className="text-3xl font-bold">{stats?.activeCourses || 0}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold">₹{stats?.totalRevenue || 0}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Recent Enquiries
                    </CardTitle>
                    <CardDescription>
                      Latest course enquiries from potential students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentEnquiries.map((enquiry) => (
                        <div key={enquiry.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-700">{enquiry.email}</p>
                            <p className="text-sm text-gray-600">{enquiry.courseInterest}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={enquiry.status === 'PENDING' ? 'secondary' : 'default'}>
                              {enquiry.status}
                            </Badge>
                            {enquiry.status === 'PENDING' && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleEnquiryAction(enquiry.id, 'approve')}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEnquiryAction(enquiry.id, 'reject')}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="/admin/enquiries">
                        <Button variant="outline" className="w-full">
                          View All Enquiries
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Enrollments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Users className="h-5 w-5 mr-2" />
                      Recent Enrollments
                    </CardTitle>
                    <CardDescription>
                      Latest course enrollments requiring approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                            <p className="text-sm text-gray-700">{enrollment.user.email}</p>
                            <p className="text-sm text-gray-600">{enrollment.course.title}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={enrollment.status === 'PENDING' ? 'secondary' : 'default'}>
                              {enrollment.status}
                            </Badge>
                            {enrollment.status === 'PENDING' && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleEnrollmentAction(enrollment.id, 'approve')}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEnrollmentAction(enrollment.id, 'reject')}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="/admin/enrollments">
                        <Button variant="outline" className="w-full">
                          View All Enrollments
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">CMS Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Home Page</CardTitle>
                    <CardDescription>Manage homepage content and sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" onClick={() => handleCMSEdit('home')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Home Page
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">About Page</CardTitle>
                    <CardDescription>Update about us content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" onClick={() => handleCMSEdit('about')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit About Page
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800">Contact Page</CardTitle>
                    <CardDescription>Manage contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white" onClick={() => handleCMSEdit('contact')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contact Page
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
              
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Total Admins</p>
                        <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Total Tutors</p>
                        <p className="text-2xl font-bold text-gray-900">{tutors.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Lists */}
              <div className="space-y-8">
                {/* Admins */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        Admins ({admins.length})
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setUserRole('ADMIN')
                          setShowCreateUserModal(true)
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Admin
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {admins.length === 0 ? (
                      <p className="text-gray-700 text-center py-4">No admins found</p>
                    ) : (
                      <div className="space-y-3">
                        {admins.map((admin) => (
                          <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{admin.name}</p>
                              <p className="text-sm text-gray-700">{admin.email}</p>
                              <p className="text-xs text-gray-600">
                                Created: {new Date(admin.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                onClick={() => handleUpdateUserStatus(admin.id, !admin.isActive)}
                              >
                                {admin.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(admin.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tutors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-gray-900">Tutors ({tutors.length})</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setUserRole('TUTOR')
                          setShowCreateUserModal(true)
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Tutor
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tutors.length === 0 ? (
                      <p className="text-gray-700 text-center py-4">No tutors found</p>
                    ) : (
                      <div className="space-y-3">
                        {tutors.map((tutor) => (
                          <div key={tutor.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{tutor.name}</p>
                              <p className="text-sm text-gray-700">{tutor.email}</p>
                              <p className="text-xs text-gray-600">
                                Created: {new Date(tutor.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={tutor.isActive ? 'default' : 'secondary'}>
                                {tutor.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                onClick={() => handleUpdateUserStatus(tutor.id, !tutor.isActive)}
                              >
                                {tutor.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(tutor.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-purple-600" />
                        Students ({students.length})
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setUserRole('STUDENT')
                          setShowCreateUserModal(true)
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {students.length === 0 ? (
                      <p className="text-gray-700 text-center py-4">No students found</p>
                    ) : (
                      <div className="space-y-3">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-700">{student.email}</p>
                              <p className="text-xs text-gray-600">
                                Created: {new Date(student.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={student.isActive ? 'default' : 'secondary'}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                onClick={() => handleUpdateUserStatus(student.id, !student.isActive)}
                              >
                                {student.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(student.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
                <div className="flex space-x-3">
                  <Button 
                    className="text-white bg-green-600 hover:bg-green-700"
                    onClick={handleAddSampleImages}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Add Sample Images
                  </Button>
                  <Button 
                    className="text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowCreateCourseModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => setShowStudentsModal(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </Button>
                </div>
              </div>

              {/* Study Material Requests Notification */}
              {(() => {
                const pendingMaterials = courses.reduce((total, course) => {
                  return total + course.materials.filter(material => material.status === 'PENDING').length
                }, 0)
                
                if (pendingMaterials > 0) {
                  return (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FileText className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Study Material Requests Pending Approval
                            </h3>
                            <div className="mt-1 text-sm text-yellow-700">
                              <p>You have {pendingMaterials} study material request{pendingMaterials > 1 ? 's' : ''} waiting for your approval.</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {pendingMaterials} Pending
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              
              {courses.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
                    <p className="text-gray-700 mb-4">Create your first course to get started.</p>
                    <Button onClick={() => setShowCreateCourseModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                              <Badge variant={
                                course.status === 'ACTIVE' ? 'default' : 
                                course.status === 'DRAFT' ? 'secondary' : 'destructive'
                              }>
                                {course.status}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{course.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Price:</span>
                                <span className="ml-1 font-medium">₹{course.price}</span>
                                {course.discountedPrice && (
                                  <span className="ml-1 text-green-600">(₹{course.discountedPrice})</span>
                                )}
                              </div>
                              <div>
                                <span className="text-gray-600">Category:</span>
                                <span className="ml-1 font-medium">{course.category}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Seats:</span>
                                <span className="ml-1 font-medium">{course.seatsLeft || 0}/{course.totalSeats || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Tutor:</span>
                                <span className="ml-1 font-medium">{course.tutor?.name || 'Not assigned'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {/* Study Materials Notification */}
                            {course.materials.filter(m => m.status === 'PENDING').length > 0 && (
                              <div className="relative">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                  title="Study Material Requests"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                    {course.materials.filter(m => m.status === 'PENDING').length}
                                  </span>
                                </Button>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewCourseSchedules(course.id)}
                              title="View Schedules"
                            >
                              <Calendar className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateCourseStatus(course.id, 
                                course.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'
                              )}
                            >
                              {course.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Study Materials Section */}
                        {course.materials.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Study Materials</h4>
                            <div className="space-y-2">
                              {course.materials.map((material) => (
                                <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                      {material.type === 'VIDEO' ? (
                                        <Video className="h-4 w-4 text-blue-600" />
                                      ) : material.type === 'LINK' ? (
                                        <LinkIcon className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <File className="h-4 w-4 text-gray-600" />
                                      )}
                                    </div>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">{material.title}</p>
                                      <p className="text-xs text-gray-700">{material.type} • {new Date(material.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={
                                      material.status === 'APPROVED' ? 'default' : 
                                      material.status === 'PENDING' ? 'secondary' : 'destructive'
                                    }>
                                      {material.status}
                                    </Badge>
                                    {material.status === 'PENDING' && (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => handleApproveMaterial(material.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleRejectMaterial(material.id)}
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enquiry Management</h2>
              
              {recentEnquiries.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Enquiries Found</h3>
                    <p className="text-gray-600">All enquiries will appear here for review.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentEnquiries.map((enquiry) => (
                    <Card key={enquiry.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{enquiry.name}</h3>
                              <Badge variant={
                                enquiry.status === 'PENDING' ? 'secondary' : 
                                enquiry.status === 'APPROVED' ? 'default' : 'destructive'
                              }>
                                {enquiry.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{enquiry.message}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Email:</span>
                                <span className="ml-1 font-medium">{enquiry.email}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Phone:</span>
                                <span className="ml-1 font-medium">{(enquiry as any).phone || 'Not provided'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Subject:</span>
                                <span className="ml-1 font-medium">{(enquiry as any).subject || 'General Inquiry'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Date:</span>
                                <span className="ml-1 font-medium">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {enquiry.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleEnquiryAction(enquiry.id, 'approve')}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEnquiryAction(enquiry.id, 'reject')}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'meta' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Meta Tags Management</h2>
                <Button onClick={() => {/* TODO: Add meta tag creation */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meta Tag
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Homepage Meta Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Homepage Meta Tags</CardTitle>
                    <CardDescription>SEO meta tags for the homepage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Planet Nine Classes - Explore the Universe of Knowledge"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        defaultValue="Learn from industry experts with our comprehensive live courses. Transform your career with world-class education."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        defaultValue="online courses, live learning, career development, skills training"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <Button className="w-full">
                      Update Homepage Meta Tags
                    </Button>
                  </CardContent>
                </Card>

                {/* Courses Page Meta Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Courses Page Meta Tags</CardTitle>
                    <CardDescription>SEO meta tags for the courses listing page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Live Courses - Planet Nine Classes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        defaultValue="Browse our comprehensive collection of live courses designed to help you master in-demand skills and advance your career."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        defaultValue="live courses, online learning, professional development, skill building"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <Button className="w-full">
                      Update Courses Meta Tags
                    </Button>
                  </CardContent>
                </Card>

                {/* About Page Meta Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Page Meta Tags</CardTitle>
                    <CardDescription>SEO meta tags for the about page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        defaultValue="About Planet Nine Classes - Leading Online Education Platform"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        defaultValue="Learn about Planet Nine Classes' mission to provide world-class education through live courses led by industry experts."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        defaultValue="about test academy, online education, learning platform, educational mission"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <Button className="w-full">
                      Update About Meta Tags
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'sliders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Slider Management</h2>
                <Button onClick={() => {/* TODO: Add slider creation */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slider
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Hero Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section Slider</CardTitle>
                    <CardDescription>Main banner slider on the homepage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slider Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Master Your Skills with Expert-Led Courses"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          defaultValue="Explore Courses"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        defaultValue="Transform your career with world-class education. Join live sessions with industry experts and learn at your own pace."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Image URL
                      </label>
                      <input
                        type="url"
                        defaultValue="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">Show on mobile</span>
                      </label>
                    </div>
                    <Button className="w-full">
                      Update Hero Slider
                    </Button>
                  </CardContent>
                </Card>

                {/* Course Promotion Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Promotion Slider</CardTitle>
                    <CardDescription>Promotional slider for featured courses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Promotion Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Featured Course: Advanced React & Next.js"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          defaultValue="20"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Promotion Description
                      </label>
                      <textarea
                        defaultValue="Master modern web development with industry experts. Limited time offer - 20% off!"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Link
                      </label>
                      <input
                        type="url"
                        defaultValue="/courses/advanced-react-nextjs"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">Show timer</span>
                      </label>
                    </div>
                    <Button className="w-full">
                      Update Course Promotion
                    </Button>
                  </CardContent>
                </Card>

                {/* Testimonial Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle>Testimonial Slider</CardTitle>
                    <CardDescription>Customer testimonials slider</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        defaultValue="What Our Students Say"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Description
                      </label>
                      <textarea
                        defaultValue="Hear from successful students who have transformed their careers with us."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Auto-play</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Show navigation dots</span>
                      </label>
                    </div>
                    <Button className="w-full">
                      Update Testimonial Slider
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'certificate-credentials' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate Credentials</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Certificate Settings</CardTitle>
                  <CardDescription>Configure company information and signatures for certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={certificateCredentials.companyName}
                          onChange={(e) => setCertificateCredentials({...certificateCredentials, companyName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Planet Nine Classes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Emoji)</label>
                        <input
                          type="text"
                          value={certificateCredentials.companyLogo}
                          onChange={(e) => setCertificateCredentials({...certificateCredentials, companyLogo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="🎓"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Managing Director Name</label>
                        <input
                          type="text"
                          value={certificateCredentials.managingDirectorName}
                          onChange={(e) => setCertificateCredentials({...certificateCredentials, managingDirectorName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Abhiram P Mohan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Managing Director Signature (PNG Image)</label>
                        <input
                          type="file"
                          accept="image/png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setSignatureFile(file)
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {certificateCredentials.signatureImageUrl && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">Current signature:</p>
                            <img 
                              src={certificateCredentials.signatureImageUrl} 
                              alt="Current signature" 
                              className="h-16 w-auto border border-gray-300 rounded"
                            />
                          </div>
                        )}
                        {signatureFile && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">New file selected: {signatureFile.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input
                        type="url"
                        value={certificateCredentials.websiteUrl}
                        onChange={(e) => setCertificateCredentials({...certificateCredentials, websiteUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://planetnineclasses.com"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveCertificateCredentials}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
                <Button
                  onClick={() => setShowCreateTestimonialModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              
              {testimonials.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Testimonials Found</h3>
                    <p className="text-gray-600 mb-4">Create testimonials to showcase student feedback.</p>
                    <Button
                      onClick={() => setShowCreateTestimonialModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Testimonial
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {testimonial.imageUrl ? (
                              <img
                                src={testimonial.imageUrl}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-semibold text-lg">
                                  {testimonial.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                              <p className="text-sm text-gray-600">{testimonial.course}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                              {testimonial.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.content}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created: {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTestimonial(testimonial)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create {userRole}</h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateUserModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create {userRole}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Management Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Create Course Schedule</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course *
                  </label>
                  <select
                    value={selectedCourseForSchedule}
                    onChange={(e) => handleCourseSelection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.courseHours}h)
                      </option>
                    ))}
                  </select>
                </div>

                {courseDuration > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Course Duration:</strong> {courseDuration} classes
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Select a start date to generate the complete schedule
                    </p>
                  </div>
                )}

                {/* Calendar and Scheduling Controls */}
                {selectedCourseForSchedule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Start Date *
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <input
                        type="date"
                        onChange={(e) => handleDateSelection(new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Time selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class Start Time</label>
                        <input
                          type="time"
                          value={classStartTime}
                          onChange={(e) => setClassStartTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class End Time</label>
                        <input
                          type="time"
                          value={classEndTime}
                          onChange={(e) => setClassEndTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>

                    {/* Days of week selection */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { d: 0, l: 'Sun' },
                          { d: 1, l: 'Mon' },
                          { d: 2, l: 'Tue' },
                          { d: 3, l: 'Wed' },
                          { d: 4, l: 'Thu' },
                          { d: 5, l: 'Fri' },
                          { d: 6, l: 'Sat' },
                        ].map(({ d, l }) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDay(d)}
                            className={`px-3 py-1 rounded-full border ${selectedDays.includes(d) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Preview */}
                {scheduleDates.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Schedule Preview:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {scheduleDates.map((date, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <div className="text-sm text-green-700">
                              Class {index + 1}: {date.toLocaleDateString()} ({classStartTime} - {classEndTime})
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={date.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const newDate = new Date(e.target.value)
                                const newScheduleDates = [...scheduleDates]
                                newScheduleDates[index] = newDate
                                setScheduleDates(newScheduleDates)
                              }}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            />
                            <input
                              type="time"
                              value={classStartTime}
                              onChange={(e) => setClassStartTime(e.target.value)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            />
                            <input
                              type="time"
                              value={classEndTime}
                              onChange={(e) => setClassEndTime(e.target.value)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => {
                                const newScheduleDates = scheduleDates.filter((_, i) => i !== index)
                                setScheduleDates(newScheduleDates)
                              }}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          const lastDate = scheduleDates[scheduleDates.length - 1]
                          const nextDate = new Date(lastDate)
                          nextDate.setDate(nextDate.getDate() + 1)
                          setScheduleDates([...scheduleDates, nextDate])
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add More Classes
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                {selectedCourseForSchedule && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Course Details:</h4>
                      {(() => {
                        const course = courses.find(c => c.id === selectedCourseForSchedule)
                        return course ? (
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Title:</strong> {course.title}</p>
                            <p><strong>Duration:</strong> {course.courseHours} hours</p>
                            <p><strong>Seats:</strong> {course.seatsLeft}/{course.totalSeats}</p>
                            <p><strong>Tutor:</strong> {course.tutor?.name || 'Not assigned'}</p>
                          </div>
                        ) : null
                      })()}
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Schedule Settings:</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• Default time: 10:00 AM - 12:00 PM</p>
                        <p>• Classes will be created automatically</p>
                        <p>• Google Meet links can be added later</p>
                        <p>• Schedule can be modified after creation</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                disabled={!selectedDate || !selectedCourseForSchedule || scheduleDates.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create {scheduleDates.length} Classes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Viewing Modal */}
      {showScheduleViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Schedules for {selectedCourseForView?.title}
              </h3>
              <button
                onClick={() => setShowScheduleViewModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {selectedCourseSchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h4>
                <p className="text-gray-600">This course doesn't have any schedules yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCourseSchedules.map((schedule, index) => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                        <p className="text-sm text-gray-600">{schedule.description}</p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-700">Date:</span>
                            <span className="ml-1 font-medium">
                              {new Date(schedule.startTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-800">Time:</span>
                            <span className="ml-1 font-medium">
                              {new Date(schedule.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                              {new Date(schedule.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-800">Status:</span>
                            <span className="ml-1">
                              <Badge variant={schedule.status === 'SCHEDULED' ? 'default' : 'secondary'}>
                                {schedule.status}
                              </Badge>
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-800">Google Meet:</span>
                            <span className="ml-1">
                              {schedule.googleMeetLink ? (
                                <a 
                                  href={schedule.googleMeetLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Join Meeting
                                </a>
                              ) : (
                                <span className="text-gray-600">Not added</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Editing Modal */}
      {showScheduleEditModal && editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Edit Schedule</h3>
              <button
                onClick={() => setShowScheduleEditModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingSchedule.title}
                  onChange={(e) => setEditingSchedule({...editingSchedule, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingSchedule.description || ''}
                  onChange={(e) => setEditingSchedule({...editingSchedule, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={(() => {
                      try {
                        const date = new Date(editingSchedule.startTime)
                        if (isNaN(date.getTime())) {
                          return ''
                        }
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const hours = String(date.getHours()).padStart(2, '0')
                        const minutes = String(date.getMinutes()).padStart(2, '0')
                        return `${year}-${month}-${day}T${hours}:${minutes}`
                      } catch (error) {
                        console.error('Error formatting start time:', error)
                        return ''
                      }
                    })()}
                    onChange={(e) => {
                      try {
                        if (e.target.value) {
                          const newDate = new Date(e.target.value)
                          if (!isNaN(newDate.getTime())) {
                            setEditingSchedule({...editingSchedule, startTime: newDate.toISOString()})
                          }
                        }
                      } catch (error) {
                        console.error('Error parsing start time:', error)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    style={{ color: '#111827' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={(() => {
                      try {
                        const date = new Date(editingSchedule.endTime)
                        if (isNaN(date.getTime())) {
                          return ''
                        }
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const hours = String(date.getHours()).padStart(2, '0')
                        const minutes = String(date.getMinutes()).padStart(2, '0')
                        return `${year}-${month}-${day}T${hours}:${minutes}`
                      } catch (error) {
                        console.error('Error formatting end time:', error)
                        return ''
                      }
                    })()}
                    onChange={(e) => {
                      try {
                        if (e.target.value) {
                          const newDate = new Date(e.target.value)
                          if (!isNaN(newDate.getTime())) {
                            setEditingSchedule({...editingSchedule, endTime: newDate.toISOString()})
                          }
                        }
                      } catch (error) {
                        console.error('Error parsing end time:', error)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Meet Link
                </label>
                <input
                  type="url"
                  value={editingSchedule.googleMeetLink || ''}
                  onChange={(e) => setEditingSchedule({...editingSchedule, googleMeetLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingSchedule.status}
                  onChange={(e) => setEditingSchedule({...editingSchedule, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowScheduleEditModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSchedule}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Course</h3>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter course title"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  rows={3}
                  placeholder="Enter course description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  value={newCourse.discountedPrice}
                  onChange={(e) => setNewCourse({ ...newCourse, discountedPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter discounted price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="WEB_DEVELOPMENT">Web Development</option>
                  <option value="MAKEUP">Makeup</option>
                  <option value="SOFTWARE_TESTING">Software Testing</option>
                  <option value="DATA_SCIENCE">Data Science</option>
                  <option value="DIGITAL_MARKETING">Digital Marketing</option>
                  <option value="GRAPHIC_DESIGN">Graphic Design</option>
                  <option value="BUSINESS">Business</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Tutor
                </label>
                <select
                  value={newCourse.tutorId}
                  onChange={(e) => setNewCourse({ ...newCourse, tutorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Seats
                </label>
                <input
                  type="number"
                  value={newCourse.totalSeats}
                  onChange={(e) => setNewCourse({ ...newCourse, totalSeats: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter total seats"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Hours
                </label>
                <input
                  type="number"
                  value={newCourse.courseHours}
                  onChange={(e) => setNewCourse({ ...newCourse, courseHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter course hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Start Date
                </label>
                <input
                  type="date"
                  value={newCourse.batchStartDate}
                  onChange={(e) => setNewCourse({ ...newCourse, batchStartDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  style={{ color: '#111827' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch End Date
                </label>
                <input
                  type="date"
                  value={newCourse.batchEndDate}
                  onChange={(e) => setNewCourse({ ...newCourse, batchEndDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  style={{ color: '#111827' }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Features
                </label>
                {newCourse.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...newCourse.features]
                        newFeatures[index] = e.target.value
                        setNewCourse({ ...newCourse, features: newFeatures })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter course feature"
                    />
                    {newCourse.features.length > 1 && (
                      <button
                        onClick={() => {
                          const newFeatures = newCourse.features.filter((_: any, i: number) => i !== index)
                          setNewCourse({ ...newCourse, features: newFeatures })
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewCourse({ ...newCourse, features: [...newCourse.features, ''] })}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Feature
                </button>
              </div>

              {/* Course Introduction Video */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction Video URL
                </label>
                <input
                  type="url"
                  value={newCourse.introductionVideo}
                  onChange={(e) => setNewCourse({ ...newCourse, introductionVideo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-700 mt-1">Add a YouTube or Vimeo link for course introduction video</p>
              </div>

              {/* Course Syllabus */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Syllabus
                </label>
                <textarea
                  value={newCourse.courseSyllabus}
                  onChange={(e) => setNewCourse({ ...newCourse, courseSyllabus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  rows={4}
                  placeholder="Enter detailed course outline and objectives..."
                />
                <p className="text-xs text-gray-700 mt-1">Detailed course outline and objectives</p>
              </div>

              {/* Additional Resources */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Resources
                </label>
                <p className="text-xs text-gray-700 mb-2">External links and supplementary materials (Tutor materials will be added here after approval)</p>
                {newCourse.additionalResources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      value={resource}
                      onChange={(e) => {
                        const newResources = [...newCourse.additionalResources]
                        newResources[index] = e.target.value
                        setNewCourse({ ...newCourse, additionalResources: newResources })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/resource"
                    />
                    {newCourse.additionalResources.length > 1 && (
                      <button
                        onClick={() => {
                          const newResources = newCourse.additionalResources.filter((_: any, i: number) => i !== index)
                          setNewCourse({ ...newCourse, additionalResources: newResources })
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewCourse({ ...newCourse, additionalResources: [...newCourse.additionalResources, ''] })}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Resource
                </button>
              </div>

              {/* Assignments */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignments
                </label>
                <p className="text-xs text-gray-700 mb-2">Weekly assignment and project guidelines</p>
                {newCourse.assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={assignment}
                      onChange={(e) => {
                        const newAssignments = [...newCourse.assignments]
                        newAssignments[index] = e.target.value
                        setNewCourse({ ...newCourse, assignments: newAssignments })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assignment description"
                    />
                    {newCourse.assignments.length > 1 && (
                      <button
                        onClick={() => {
                          const newAssignments = newCourse.assignments.filter((_: any, i: number) => i !== index)
                          setNewCourse({ ...newCourse, assignments: newAssignments })
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewCourse({ ...newCourse, assignments: [...newCourse.assignments, ''] })}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Assignment
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Card Image
                </label>
                <div className="space-y-4">
                  {/* Sample Images */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Choose a sample image or upload your own:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Web Development', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', category: 'WEB_DEVELOPMENT' },
                        { name: 'Data Science', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', category: 'DATA_SCIENCE' },
                        { name: 'Software Testing', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', category: 'SOFTWARE_TESTING' },
                        { name: 'Makeup', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', category: 'MAKEUP' },
                        { name: 'Business', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', category: 'OTHER' },
                        { name: 'Design', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', category: 'OTHER' }
                      ].map((sample, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            newCourse.imageUrl === sample.url 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setNewCourse({ ...newCourse, imageUrl: sample.url })}
                        >
                          <img
                            src={sample.url}
                            alt={sample.name}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                              {sample.name}
                            </span>
                          </div>
                          {newCourse.imageUrl === sample.url && (
                            <div className="absolute top-1 right-1">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Option */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Or upload your own image:</p>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && file instanceof File) {
                            handleImageUpload(file, 'imageUrl')
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                      {uploadingImage && (
                        <div className="text-sm text-blue-600">Uploading...</div>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {newCourse.imageUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative inline-block">
                          <img
                            src={newCourse.imageUrl}
                            alt="Course preview"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setNewCourse({ ...newCourse, imageUrl: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Image for course cards (recommended: 400x300px)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Banner Image
                </label>
                <div className="space-y-4">
                  {/* Sample Banner Images */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Choose a sample banner or upload your own:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'Web Development Banner', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop', category: 'WEB_DEVELOPMENT' },
                        { name: 'Data Science Banner', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', category: 'DATA_SCIENCE' },
                        { name: 'Software Testing Banner', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop', category: 'SOFTWARE_TESTING' },
                        { name: 'Makeup Banner', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop', category: 'MAKEUP' }
                      ].map((sample, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            newCourse.bannerUrl === sample.url 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setNewCourse({ ...newCourse, bannerUrl: sample.url })}
                        >
                          <img
                            src={sample.url}
                            alt={sample.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                              {sample.name}
                            </span>
                          </div>
                          {newCourse.bannerUrl === sample.url && (
                            <div className="absolute top-1 right-1">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Option */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Or upload your own banner:</p>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && file instanceof File) {
                            handleImageUpload(file, 'bannerUrl')
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                      {uploadingBanner && (
                        <div className="text-sm text-blue-600">Uploading...</div>
                      )}
                    </div>
                    
                    {/* Banner Preview */}
                    {newCourse.bannerUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative inline-block">
                          <img
                            src={newCourse.bannerUrl}
                            alt="Banner preview"
                            className="w-48 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setNewCourse({ ...newCourse, bannerUrl: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Banner for course details page (recommended: 1200x400px)</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => setShowCreateCourseModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateCourse}
              >
                Create Course
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* CMS Editor Modal */}
      {showCMSEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit {selectedPage?.charAt(0).toUpperCase()}{selectedPage?.slice(1)} Page
              </h2>
              <button
                onClick={() => setShowCMSEditor(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={cmsContent.title}
                  onChange={(e) => setCmsContent({ ...cmsContent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={cmsContent.description}
                  onChange={(e) => setCmsContent({ ...cmsContent, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Content
                </label>
                <textarea
                  value={cmsContent.content}
                  onChange={(e) => setCmsContent({ ...cmsContent, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Offer Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Section</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Title
                    </label>
                    <input
                      type="text"
                      value={cmsContent.offer.title}
                      onChange={(e) => setCmsContent({ 
                        ...cmsContent, 
                        offer: { ...cmsContent.offer, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="e.g., Install comet browser for free"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Subtitle
                    </label>
                    <input
                      type="text"
                      value={cmsContent.offer.subtitle}
                      onChange={(e) => setCmsContent({ 
                        ...cmsContent, 
                        offer: { ...cmsContent.offer, subtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="e.g., Get 1 month free perplexity account"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Link
                    </label>
                    <input
                      type="url"
                      value={cmsContent.offer.link}
                      onChange={(e) => setCmsContent({ 
                        ...cmsContent, 
                        offer: { ...cmsContent.offer, link: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="https://example.com/offer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Image URL
                    </label>
                    <input
                      type="url"
                      value={cmsContent.offer.imageUrl}
                      onChange={(e) => setCmsContent({ 
                        ...cmsContent, 
                        offer: { ...cmsContent.offer, imageUrl: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setShowCMSEditor(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCMSSave}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <button
                onClick={() => setShowEditCourseModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={editingCourse?.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingCourse?.category || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="WEB_DEVELOPMENT">Web Development</option>
                  <option value="DATA_SCIENCE">Data Science</option>
                  <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="CLOUD_COMPUTING">Cloud Computing</option>
                  <option value="AI_ML">AI & Machine Learning</option>
                  <option value="MAKEUP">Makeup</option>
                  <option value="SOFTWARE_TESTING">Software Testing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={editingCourse?.price || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter course price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  value={editingCourse?.discountedPrice || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, discountedPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter discounted price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Tutor
                </label>
                <select
                  value={editingCourse?.tutorId || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, tutorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Seats
                </label>
                <input
                  type="number"
                  value={editingCourse?.totalSeats || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, totalSeats: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter total seats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Hours
                </label>
                <input
                  type="number"
                  value={editingCourse?.courseHours || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, courseHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter course hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Start Date
                </label>
                <input
                  type="date"
                  value={editingCourse?.batchStartDate || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, batchStartDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  style={{ color: '#111827' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch End Date
                </label>
                <input
                  type="date"
                  value={editingCourse?.batchEndDate || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, batchEndDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  style={{ color: '#111827' }}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                value={editingCourse?.description || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Enter course description"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Features
              </label>
              {editingCourse?.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...editingCourse.features]
                      newFeatures[index] = e.target.value
                      setEditingCourse({ ...editingCourse, features: newFeatures })
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course feature"
                  />
                  {editingCourse.features.length > 1 && (
                    <button
                      onClick={() => {
                        const newFeatures = editingCourse.features.filter((_: any, i: number) => i !== index)
                        setEditingCourse({ ...editingCourse, features: newFeatures })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setEditingCourse({ ...editingCourse, features: [...editingCourse.features, ''] })}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Feature
              </button>
            </div>

            {/* Course Introduction Video */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introduction Video URL
              </label>
              <input
                type="url"
                value={editingCourse?.introductionVideo || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, introductionVideo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-700 mt-1">Add a YouTube or Vimeo link for course introduction video</p>
            </div>

            {/* Course Syllabus */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Syllabus
              </label>
              <textarea
                value={editingCourse?.courseSyllabus || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, courseSyllabus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                rows={4}
                placeholder="Enter detailed course outline and objectives..."
              />
              <p className="text-xs text-gray-700 mt-1">Detailed course outline and objectives</p>
            </div>

            {/* Additional Resources */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Resources
              </label>
              <p className="text-xs text-gray-700 mb-2">External links and supplementary materials (Tutor materials will be added here after approval)</p>
              {editingCourse?.additionalResources?.map((resource: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={resource}
                    onChange={(e) => {
                      const newResources = [...editingCourse.additionalResources]
                      newResources[index] = e.target.value
                      setEditingCourse({ ...editingCourse, additionalResources: newResources })
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/resource"
                  />
                  {editingCourse.additionalResources.length > 1 && (
                    <button
                      onClick={() => {
                        const newResources = editingCourse.additionalResources.filter((_: any, i: number) => i !== index)
                        setEditingCourse({ ...editingCourse, additionalResources: newResources })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )) || []}
              <button
                onClick={() => setEditingCourse({ 
                  ...editingCourse, 
                  additionalResources: [...(editingCourse?.additionalResources || []), ''] 
                })}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Resource
              </button>
            </div>

            {/* Assignments */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignments
              </label>
              <p className="text-xs text-gray-700 mb-2">Weekly assignment and project guidelines</p>
              {editingCourse?.assignments?.map((assignment: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={assignment}
                    onChange={(e) => {
                      const newAssignments = [...editingCourse.assignments]
                      newAssignments[index] = e.target.value
                      setEditingCourse({ ...editingCourse, assignments: newAssignments })
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assignment description"
                  />
                  {editingCourse.assignments.length > 1 && (
                    <button
                      onClick={() => {
                        const newAssignments = editingCourse.assignments.filter((_: any, i: number) => i !== index)
                        setEditingCourse({ ...editingCourse, assignments: newAssignments })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )) || []}
              <button
                onClick={() => setEditingCourse({ 
                  ...editingCourse, 
                  assignments: [...(editingCourse?.assignments || []), ''] 
                })}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Assignment
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Card Image
              </label>
              <div className="space-y-4">
                {/* Sample Images */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Choose a sample image or upload your own:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Web Dev', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', category: 'WEB_DEVELOPMENT' },
                      { name: 'Data Science', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', category: 'DATA_SCIENCE' },
                      { name: 'Testing', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', category: 'SOFTWARE_TESTING' },
                      { name: 'Mobile', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop', category: 'MOBILE_DEVELOPMENT' },
                      { name: 'AI/ML', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', category: 'AI_ML' },
                      { name: 'Design', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', category: 'OTHER' }
                    ].map((sample, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          editingCourse?.imageUrl === sample.url 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setEditingCourse({ ...editingCourse, imageUrl: sample.url })}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                            {sample.name}
                          </span>
                        </div>
                        {editingCourse?.imageUrl === sample.url && (
                          <div className="absolute top-1 right-1">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Or upload your own image:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file instanceof File) {
                        handleImageUpload(file, 'imageUrl')
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  {uploadingImage && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
                
                {/* Image Preview */}
                {editingCourse?.imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={editingCourse.imageUrl}
                        alt="Course preview"
                        className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCourse({ ...editingCourse, imageUrl: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-700 mt-1">Image for course cards (recommended: 400x300px)</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Banner Image
              </label>
              <div className="space-y-4">
                {/* Sample Banner Images */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Choose a sample banner or upload your own:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Tech Banner', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop', category: 'WEB_DEVELOPMENT' },
                      { name: 'Data Banner', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', category: 'DATA_SCIENCE' },
                      { name: 'Testing Banner', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop', category: 'SOFTWARE_TESTING' },
                      { name: 'Makeup Banner', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop', category: 'MAKEUP' }
                    ].map((sample, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          editingCourse?.bannerUrl === sample.url 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setEditingCourse({ ...editingCourse, bannerUrl: sample.url })}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                            {sample.name}
                          </span>
                        </div>
                        {editingCourse?.bannerUrl === sample.url && (
                          <div className="absolute top-1 right-1">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Or upload your own banner:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file instanceof File) {
                        handleImageUpload(file, 'bannerUrl')
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  {uploadingBanner && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
                
                {/* Banner Preview */}
                {editingCourse?.bannerUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={editingCourse.bannerUrl}
                        alt="Banner preview"
                        className="w-48 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCourse({ ...editingCourse, bannerUrl: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-700 mt-1">Banner for course details page (recommended: 1200x400px)</p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setShowEditCourseModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCourse}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                Update Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Testimonial Modal */}
      {showCreateTestimonialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Testimonial</h3>
              <button
                onClick={() => setShowCreateTestimonialModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.course}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Enter course name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Content *
                </label>
                <textarea
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter testimonial content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={newTestimonial.imageUrl}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newTestimonial.isActive}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateTestimonialModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTestimonial}>
                Create Testimonial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Testimonial</h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.course}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Enter course name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Content *
                </label>
                <textarea
                  value={editingTestimonial.content}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter testimonial content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={editingTestimonial.imageUrl || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingTestimonial.isActive}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingTestimonial(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditTestimonial}>
                Update Testimonial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Course Students</h3>
              <button
                onClick={() => setShowStudentsModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Course Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourseForStudents}
                onChange={(e) => setSelectedCourseForStudents(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Students List */}
            {selectedCourseForStudents && (
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  Enrolled Students for {courses.find(c => c.id === selectedCourseForStudents)?.title}
                </h4>
                <div className="space-y-4">
                  {(() => {
                    const course = courses.find(c => c.id === selectedCourseForStudents)
                    if (!course) return null

                    const enrolledStudents = course.enrollments || []
                    
                    if (enrolledStudents.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          No students enrolled in this course yet.
                        </div>
                      )
                    }

                    return enrolledStudents.map((enrollment: any) => (
                      <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {enrollment.user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{enrollment.user.name}</h5>
                              <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                              <p className="text-xs text-gray-500">
                                Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={enrollment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {enrollment.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUploadCertificate(enrollment.id, enrollment.user.name)}
                              className="hidden"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Add Certificate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Upload Modal */}
      {showCertificateUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Upload Certificate for {selectedStudentName}</h3>
              <button
                onClick={() => setShowCertificateUploadModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate File (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCertificateFile(file)
                    } else {
                      setCertificateFile(null)
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCertificateUploadModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCertificate}
                  disabled={!certificateFile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Upload Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}