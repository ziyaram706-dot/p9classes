'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Users, 
  Clock, 
  Award, 
  Star, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Calendar,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  type: 'LIVE'
  price: number
  discountedPrice?: number
  category?: string
  features: string[]
  imageUrl?: string
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  tutor?: {
    name: string
  }
  batchStartDate?: string
  batchEndDate?: string
  seatsLeft?: number
  totalSeats?: number
  courseHours?: number
}

interface Testimonial {
  id: string
  name: string
  course: string
  rating: number
  content: string
  imageUrl?: string
}

export default function HomePage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [heroCourse, setHeroCourse] = useState<Course | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [certificateId, setCertificateId] = useState('')
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean
    certificate?: any
    message: string
  } | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [cmsContent, setCmsContent] = useState<any>(null)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  // Testimonial slider functions
  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, testimonialsRes, cmsRes] = await Promise.all([
          fetch('/api/courses?status=ACTIVE&type=LIVE&limit=6'),
          fetch('/api/testimonials'),
          fetch('/api/cms?page=home')
        ])
        
        const coursesData = await coursesRes.json()
        const testimonialsData = await testimonialsRes.json()
        const cmsData = await cmsRes.json()
        
        // Show active courses (remove date filtering to show all active courses)
        const allCourses: Course[] = coursesData.courses || []
        const filteredCourses = allCourses.filter((course: Course) => {
          // Show all active courses regardless of start date
          return course.status === 'ACTIVE'
        })
        
        setCourses(filteredCourses)
        
        // Pick a hero course:
        // 1) If CMS specifies featuredCourseId and it's in the filtered list, use it
        // 2) Otherwise, use the most recently created course
        // 3) Fallback to the first filtered course or null
        let selected: Course | null = null
        const featuredId = cmsData?.content?.featuredCourseId as string | undefined
        if (featuredId) {
          selected = filteredCourses.find((c) => c.id === featuredId) || null
        }
        if (!selected) {
          // Sort by creation date (most recent first)
          const recentlySorted = [...filteredCourses]
            .sort((a, b) => {
              const ad = new Date(a.createdAt || 0).getTime()
              const bd = new Date(b.createdAt || 0).getTime()
              return bd - ad // Most recent first
            })
          selected = recentlySorted[0] || null
        }
        setHeroCourse(selected)
        setTestimonials(testimonialsData.testimonials || [])
        setCmsContent(cmsData.content)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCertificateVerification = async () => {
    if (!certificateId.trim()) return
    
    try {
      const response = await fetch(`/api/certificate/verify/${certificateId}`)
      const result = await response.json()
      
      if (response.ok) {
        setVerificationResult({
          isValid: true,
          certificate: result.certificate,
          message: 'Certificate verified successfully!'
        })
      } else {
        setVerificationResult({
          isValid: false,
          message: result.error || 'Certificate not found'
        })
      }
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: 'Error verifying certificate'
      })
    }
  }

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Live Learning',
      description: 'Join interactive live sessions with real-time Q&A and support'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Career Support',
      description: 'Get job placement assistance and career guidance'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: 'Lifetime Access',
      description: 'Access course materials and updates forever'
    }
  ]

  return (
    <div className="min-h-screen galaxy-bg star-field">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient hero-pattern min-h-screen flex items-center">
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="floating-shape w-64 h-64 bg-white rounded-full"></div>
          <div className="floating-shape w-32 h-32 bg-blue-200 rounded-full"></div>
          <div className="floating-shape w-48 h-48 bg-purple-200 rounded-full"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-8 glass-effect animate-float">
                <span className="w-3 h-3 bg-success rounded-full mr-3 animate-pulse"></span>
                🔥 Join 50,000+ Successful Students
              </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight text-white">
              {cmsContent?.content?.title || 'Explore the Universe of Knowledge'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed">
              {cmsContent?.content?.description || 'Journey through the cosmos of learning with Planet Nine Classes. Master new skills with expert-led courses and discover your potential among the stars.'}
            </p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-bounce-slow">⭐</span>
                  <div>
                    <span className="font-bold text-xl">4.9/5</span>
                    <div className="text-sm">Student Rating</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-float">👥</span>
                  <div>
                    <span className="font-bold text-xl">50,000+</span>
                    <div className="text-sm">Active Students</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <span className="text-3xl mr-3 animate-pulse-slow">🏆</span>
                  <div>
                    <span className="font-bold text-xl">5,000+</span>
                    <div className="text-sm">Certificates Issued</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                  🚀 Explore Courses
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    border: '2px solid white',
                    color: 'white',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.color = 'black'
                    e.currentTarget.style.borderColor = 'black'
                    e.currentTarget.style.fontWeight = '700'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.borderColor = 'white'
                    e.currentTarget.style.fontWeight = '600'
                  }}
                >
                  📚 Start Learning
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-gray-300 text-sm mb-4">Trusted by students from</p>
                <div className="flex items-center space-x-8 opacity-70">
                  <div className="text-white font-bold">Google</div>
                  <div className="text-white font-bold">Microsoft</div>
                  <div className="text-white font-bold">Netflix</div>
                  <div className="text-white font-bold">Apple</div>
                  <div className="text-white font-bold">Amazon</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Course Preview (binds to first ACTIVE course) */}
            <div className="animate-float lg:pl-8">
              <div className="relative">
                {/* Main Course Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden card-hover transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  {/* Video Thumbnail */}
                  <div className="relative group cursor-pointer">
                    {heroCourse?.imageUrl ? (
                      <img src={heroCourse.imageUrl as string} alt={heroCourse.title} className="w-full h-64 object-cover" />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop&crop=center" alt="Course Preview" className="w-full h-64 object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-slow">
                        <Play className="w-8 h-8 text-gray-900 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 live-pulse"></div>
                        Live Course
                      </Badge>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{heroCourse?.title || 'Featured Live Course'}</h3>
                    <p className="text-gray-600 text-sm mb-4">{heroCourse?.description || 'Master modern skills with industry experts'}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{heroCourse?.tutor?.name ? `Tutor: ${heroCourse.tutor.name}` : 'Live cohort'}</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">₹{heroCourse?.discountedPrice || heroCourse?.price || 999}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      {(cmsContent?.content?.offer?.title || true) && (
        <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {cmsContent?.content?.offer?.imageUrl ? (
                  <img 
                    src={cmsContent.content.offer.imageUrl} 
                    alt="Offer" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {cmsContent?.content?.offer?.title || "Install Comet Browser for Free"}
                  </h3>
                  <p className="text-blue-100">
                    {cmsContent?.content?.offer?.subtitle || "Get 1 month free Perplexity Pro account"}
                  </p>
                </div>
              </div>
              {(cmsContent?.content?.offer?.link || true) && (
                <Link href={cmsContent?.content?.offer?.link || "https://comet.com/download"}>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Download Comet Browser
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Planet Nine Classes?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide the best learning experience with industry-leading features and support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600'
              ]
              const bgColors = [
                'bg-blue-50',
                'bg-green-50',
                'bg-purple-50', 
                'bg-orange-50'
              ]
              
              return (
                <div key={index} className={`${bgColors[index]} rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 bg-gradient-to-r ${colors[index]} rounded-2xl shadow-lg`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certificate Verification Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Verify Your Certificate
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Enter your certificate ID to verify and view your certificate
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter Certificate ID"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCertificateVerification}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Verify
              </button>
            </div>
            
            {verificationResult && (
              <div className={`p-6 rounded-xl shadow-lg border-2 ${
                verificationResult.isValid 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 text-green-800' 
                  : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300 text-red-800'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {verificationResult.isValid ? (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult.isValid ? 'Certificate Verified!' : 'Verification Failed'}
                </h3>
                <p className={`text-lg mb-4 ${
                  verificationResult.isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verificationResult.message}
                </p>
                {verificationResult.isValid && verificationResult.certificate && (
                  <div className="bg-white/50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Certificate Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Course:</span>
                        <p className="text-green-600">{verificationResult.certificate.course?.title}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Student:</span>
                        <p className="text-green-600">{verificationResult.certificate.user?.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Issued:</span>
                        <p className="text-green-600">
                          {verificationResult.certificate.issuedAt 
                            ? new Date(verificationResult.certificate.issuedAt).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Status:</span>
                        <p className="text-green-600">{verificationResult.certificate.status}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <button
                        onClick={() => window.open(`/api/certificate/download/${verificationResult.certificate.certificateId}`, '_blank')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Download Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you succeed in your career.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse bg-gray-800">
                  <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card key={course.id} className="course-card-planet overflow-hidden border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  {/* Sale Corner Strap */}
                  {course.discountedPrice && (
                    <div className="absolute -right-10 top-3 rotate-45 z-30">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-6 py-1 rounded shadow-xl tracking-wider">
                        🔥 SALE
                      </span>
                    </div>
                  )}
                  <div className="course-image flex items-center justify-center">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : course.category === 'MAKEUP' ? (
                      <div className="text-6xl">💄</div>
                    ) : course.category === 'SOFTWARE_TESTING' ? (
                      <div className="text-6xl">🧪</div>
                    ) : course.category === 'DATA_SCIENCE' ? (
                      <div className="text-6xl">📊</div>
                    ) : course.category === 'WEB_DEVELOPMENT' ? (
                      <div className="text-6xl">💻</div>
                    ) : course.category === 'CYBERSECURITY' ? (
                      <div className="text-6xl">🔒</div>
                    ) : course.category === 'AI_ML' ? (
                      <div className="text-6xl">🤖</div>
                    ) : (
                      <GraduationCap className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <CardContent className="p-6 bg-gray-800/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Live Course
                      </Badge>
                      {course.discountedPrice && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse">
                          🔥 SALE
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="course-title mb-3">
                      {course.title}
                    </h3>
                    <p className="course-description mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* Enhanced Course Info */}
                    <div className="space-y-2 mb-4">
                      {course.tutor && (
                        <div className="flex items-center text-sm text-gray-300">
                          <Users className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="font-medium">Tutor:</span>
                          <span className="ml-1">{course.tutor.name}</span>
                        </div>
                      )}
                      
                      {course.totalSeats && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-300">
                            <Users className="h-4 w-4 mr-2 text-green-400" />
                            <span className="font-medium">Seats:</span>
                            <span className="ml-1">
                              {course.seatsLeft !== undefined ? course.seatsLeft : course.totalSeats}/{course.totalSeats}
                            </span>
                          </div>
                          <div className="course-seats">
                            {course.seatsLeft !== undefined ? course.seatsLeft : course.totalSeats} Available
                          </div>
                        </div>
                      )}
                      
                      {course.batchStartDate && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                            <span className="font-medium">Starts:</span>
                            <span className="ml-1">{new Date(course.batchStartDate).toLocaleDateString()}</span>
                          </div>
                          <div className="course-dates">
                            {new Date(course.batchStartDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      
                      {course.courseHours && (
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="h-4 w-4 mr-2 text-purple-400" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">{course.courseHours} hours</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="course-price">
                          ₹{course.discountedPrice || course.price}
                        </span>
                        {course.discountedPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{course.price}
                          </span>
                        )}
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <Button className="btn-planet-primary">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 py-3">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Xpress Health Inspired */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                  What Our Students Say
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Hear from successful students who have transformed their careers with Planet Nine Classes.
              </p>
              <button 
                onClick={() => window.open('/testimonials', '_blank')}
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-3 rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-300 font-medium"
              >
                Read More Stories
              </button>
            </div>

            {/* Mobile Device Container */}
            <div className="relative max-w-4xl mx-auto">
              {/* Device Frame */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Device Header */}
                <div className="bg-gray-100 h-8 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Testimonial Slider */}
                <div className="p-8">
                  <div className="relative overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}>
                      {testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="w-full flex-shrink-0">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 relative">
                            {/* Quote Icon */}
                            <div className="absolute top-4 left-4 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            </div>
                            
                            {/* Testimonial Content */}
                            <div className="pt-8">
                              <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              
                              <blockquote className="text-gray-800 text-lg leading-relaxed mb-6 italic">
                                "{testimonial.content}"
                              </blockquote>
                              
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                  {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                                  <p className="text-green-600 font-medium">{testimonial.course}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <button 
                      onClick={prevTestimonial}
                      className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="bg-white rounded-full px-6 py-2 shadow-lg">
                      <span className="text-gray-800 font-medium">
                        {testimonials[currentTestimonialIndex]?.course || 'Student Success Stories'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={nextTestimonial}
                      className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonialIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonialIndex ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who have already transformed their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}