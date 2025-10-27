'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Home, 
  Search, 
  ArrowLeft, 
  BookOpen,
  Users,
  GraduationCap,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
              <AlertCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <Card className="bg-white shadow-xl border-0 mb-8">
            <CardContent className="p-12">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                404
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300">
                    <Home className="h-5 w-5 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Helpful Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Popular Courses</h3>
                <p className="text-gray-600 mb-4">Explore our most popular courses</p>
                <Link href="/courses">
                  <Button variant="outline" size="sm">View Courses</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
                <p className="text-gray-600 mb-4">Learn more about Planet Nine Classes</p>
                <Link href="/about">
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h3>
                <p className="text-gray-600 mb-4">Contact our support team</p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Search className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
                <p className="text-gray-600 mb-6">
                  Try searching for courses, or browse our categories to find what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/courses?category=web-development">
                    <Button variant="outline" size="sm">Web Development</Button>
                  </Link>
                  <Link href="/courses?category=software-testing">
                    <Button variant="outline" size="sm">Software Testing</Button>
                  </Link>
                  <Link href="/courses?category=makeup">
                    <Button variant="outline" size="sm">Makeup Courses</Button>
                  </Link>
                  <Link href="/courses?category=data-science">
                    <Button variant="outline" size="sm">Data Science</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
