'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, XCircle, Clock, BookOpen, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Enrollment {
  id: string
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
  }
  course: {
    id: string
    title: string
    price: number
    discountedPrice?: number
  }
}

export default function AdminEnrollmentsPage() {
  const { data: session, status } = useSession()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchEnrollments()
    }
  }, [status, session])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/admin/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments || [])
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnrollmentStatus = async (id: string, status: 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    try {
      const response = await fetch(`/api/admin/enrollments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setEnrollments(enrollments.map(enrollment => 
          enrollment.id === id ? { ...enrollment, status } : enrollment
        ))
      }
    } catch (error) {
      console.error('Error updating enrollment status:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-800 mb-4">You need admin privileges to access this page.</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
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
            <Link href="/admin" className="hover:text-gray-700">Admin Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Enrollments</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Enrollment Management
          </h1>
          <p className="text-gray-800 text-lg">
            Manage course enrollments and student access
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrollments Found</h3>
                <p className="text-gray-700">There are no enrollments to display.</p>
              </CardContent>
            </Card>
          ) : (
            enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">{enrollment.user.name}</CardTitle>
                    <Badge variant={
                      enrollment.status === 'ACTIVE' ? 'default' : 
                      enrollment.status === 'COMPLETED' ? 'default' :
                      enrollment.status === 'APPROVED' ? 'default' :
                      enrollment.status === 'CANCELLED' ? 'destructive' : 'secondary'
                    }>
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Student Email:</span>
                      <span className="ml-2 text-gray-900">{enrollment.user.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mobile:</span>
                      <span className="ml-2 text-gray-900">{enrollment.user.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Course:</span>
                      <span className="ml-2 text-gray-900">{enrollment.course.title}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Price:</span>
                      <span className="ml-2 text-gray-900">
                        ₹{enrollment.course.discountedPrice || enrollment.course.price}
                        {enrollment.course.discountedPrice && (
                          <span className="ml-1 text-sm text-gray-600 line-through">
                            ₹{enrollment.course.price}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-gray-600">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </span>
                      {enrollment.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateEnrollmentStatus(enrollment.id, 'APPROVED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateEnrollmentStatus(enrollment.id, 'CANCELLED')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                      {enrollment.status === 'APPROVED' && (
                        <Button
                          size="sm"
                          onClick={() => updateEnrollmentStatus(enrollment.id, 'ACTIVE')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      {enrollment.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          onClick={() => updateEnrollmentStatus(enrollment.id, 'COMPLETED')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
