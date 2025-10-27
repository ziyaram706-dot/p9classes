'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Calendar,
  Home,
  ChevronRight
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  type: 'LIVE'
  category: string
  price: number
  discountedPrice?: number
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 12

  // Get category from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses?status=ACTIVE&type=LIVE')
        const data = await response.json()
        setCourses(data.courses || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return course.title.toLowerCase().includes(query) ||
             course.description.toLowerCase().includes(query) ||
             course.tutor?.name.toLowerCase().includes(query)
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap: { [key: string]: string } = {
        'makeup': 'MAKEUP',
        'software-testing': 'SOFTWARE_TESTING',
        'web-development': 'WEB_DEVELOPMENT',
        'data-science': 'DATA_SCIENCE',
        'digital-marketing': 'DIGITAL_MARKETING',
        'graphic-design': 'GRAPHIC_DESIGN',
        'business': 'BUSINESS'
      }
      return course.category === categoryMap[selectedCategory]
    }
    
    // Show all active courses regardless of start date
    return true
  })


  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.batchStartDate || '').getTime() - new Date(a.batchStartDate || '').getTime()
      case 'price-low':
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
      case 'price-high':
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
      case 'popular':
      default:
        return (b.seatsLeft || 0) - (a.seatsLeft || 0)
    }
  })

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + coursesPerPage)

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'makeup', name: 'Makeup Courses' },
    { id: 'software-testing', name: 'Software Testing' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'business', name: 'Business' }
  ]

  return (
    <div className="min-h-screen galaxy-bg star-field courses-page">
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
              📚 Browse 200+ Live Courses
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight text-white">
              Explore Our Courses
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl">
              Discover expert-led live cohorts. Search, filter, and sort to find the right one for you.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
              </div>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-8">
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
            <span className="text-white font-medium">Courses</span>
          </nav>
        </div>
      </div>

      {/* Filters Section */}
      <section className="py-6 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer pr-10"
                >
                  <option value="popular" className="text-white bg-gray-800">Most Popular</option>
                  <option value="newest" className="text-white bg-gray-800">Newest</option>
                  <option value="price-low" className="text-white bg-gray-800">Price: Low to High</option>
                  <option value="price-high" className="text-white bg-gray-800">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {filteredCourses.length} courses found
              </h2>
              {searchQuery && (
                <p className="text-gray-600">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>
            <div className="text-gray-600">
              {filteredCourses.length} of {courses.length} courses
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse bg-gray-800">
                  <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No courses found matching your criteria.</p>
              <p className="text-gray-700 text-sm mt-2">Try adjusting your search or filter options.</p>
            </div>
          ) : (
            <>
              {/* Course Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCourses.map((course, index) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-600 rounded-lg text-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, page) => (
                      <button
                        key={page + 1}
                        onClick={() => setCurrentPage(page + 1)}
                        className={`px-3 py-2 border rounded-lg font-medium transition-colors ${
                          currentPage === page + 1
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-600 text-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-600 rounded-lg text-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Contact us to request a custom course or get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}